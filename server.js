/* ───────────────────────────────────────────────────────────────
   Bloom · Web Push-server
   Sender notifikationer på brugerens valgte tidspunkter — også når
   appen er lukket. Gemmer abonnementer i en simpel JSON-fil.

   Miljøvariabler (se .env.example):
     VAPID_PUBLIC_KEY   offentlig VAPID-nøgle
     VAPID_PRIVATE_KEY  privat VAPID-nøgle  (HOLD HEMMELIG)
     VAPID_SUBJECT      "mailto:dig@eksempel.dk"
     PORT               (valgfri, standard 3000)
     ALLOW_ORIGIN       (valgfri, fx "https://dit-brugernavn.github.io")
   ─────────────────────────────────────────────────────────────── */
"use strict";
const express = require("express");
const cors = require("cors");
const webpush = require("web-push");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const STORE = path.join(__dirname, "subscriptions.json");

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:you@example.com";

if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
  console.error("⚠️  Mangler VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY. Se .env.example.");
  process.exit(1);
}
webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

const app = express();
app.use(cors({ origin: process.env.ALLOW_ORIGIN || true }));
app.use(express.json({ limit: "16kb" }));

/* ---- simpel fil-lagring ---- */
function load() { try { return JSON.parse(fs.readFileSync(STORE, "utf8")); } catch { return {}; } }
function save(d) { try { fs.writeFileSync(STORE, JSON.stringify(d, null, 2)); } catch (e) { console.error("save:", e.message); } }

/* ---- ruter ---- */
app.get("/", (_req, res) => res.send("Bloom push server kører 🌸"));
app.get("/vapidPublicKey", (_req, res) => res.json({ key: VAPID_PUBLIC }));

app.post("/subscribe", (req, res) => {
  const { subscription, reminders, timezone } = req.body || {};
  if (!subscription || !subscription.endpoint) return res.status(400).json({ error: "manglende subscription" });
  const db = load();
  const existing = db[subscription.endpoint] || {};
  db[subscription.endpoint] = {
    subscription,
    reminders: reminders || existing.reminders || {},
    timezone: timezone || existing.timezone || "Europe/Copenhagen",
    sent: existing.sent || {}
  };
  save(db);
  res.json({ ok: true });
});

app.post("/unsubscribe", (req, res) => {
  const { endpoint } = req.body || {};
  const db = load();
  if (endpoint && db[endpoint]) { delete db[endpoint]; save(db); }
  res.json({ ok: true });
});

/* ---- notifikations-tekster ---- */
const LABELS = {
  morgen: "🌅 Tid til morgenmad",
  frokost: "🥗 Tid til frokost",
  aften: "🌙 Tid til aftensmad",
  walk: "🚶‍♀️ Tid til en gåtur",
  core: "🧘‍♀️ Tid til core-træning",
  water: "💧 Husk at drikke vand"
};

/* lokal tid (HH:MM) og dato (YYYY-MM-DD) i en given tidszone */
function localHM(tz) {
  return new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}
function localDay(tz) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

/* ---- cron: hvert minut ---- */
cron.schedule("* * * * *", async () => {
  const db = load();
  let changed = false;
  for (const ep of Object.keys(db)) {
    const rec = db[ep];
    const tz = rec.timezone || "Europe/Copenhagen";
    let hm, day;
    try { hm = localHM(tz); day = localDay(tz); } catch { hm = localHM("Europe/Copenhagen"); day = localDay("Europe/Copenhagen"); }
    const reminders = rec.reminders || {};
    rec.sent = rec.sent || {};
    for (const key of Object.keys(reminders)) {
      if (reminders[key] === hm) {
        const sk = day + "_" + key;
        if (rec.sent[sk]) continue;
        try {
          await webpush.sendNotification(rec.subscription, JSON.stringify({ title: "Bloom 🌸", body: LABELS[key] || "Påmindelse" }));
          rec.sent[sk] = true; changed = true;
        } catch (err) {
          if (err.statusCode === 404 || err.statusCode === 410) { delete db[ep]; changed = true; }
          else console.error("push:", err.statusCode || err.message);
        }
      }
    }
    // ryd gamle "sent"-mærker (behold kun i dag)
    if (db[ep]) for (const k of Object.keys(rec.sent)) if (!k.startsWith(day)) { delete rec.sent[k]; changed = true; }
  }
  if (changed) save(db);
});

app.listen(PORT, () => console.log("Bloom push server lytter på :" + PORT));
