# 🌸 Bloom · Cyklus & Velvære

En lille, lys PWA der hjælper dig med at følge din rytme:

- 🍽️ **Måltider** — påmindelse om morgenmad, frokost og aftensmad
- 🚶‍♀️ **Bevægelse** — gåtur + core-træning
- 🧘‍♀️ **Øvelser** — pilates/yoga i 3 niveauer med fokus på efterfødsel, bækkenbund og kropsholdning
- 💧 **Væske** — glas á 250 ml mod et mål på ca. 2 liter
- ⚖️ **Vægt** — registrering med lille trend-graf
- 🌙 **Cyklus** — beregner din fase og skifter hele appens farver efter den
- 🥗 **Fødevareforslag** — tilpasset hver cyklusfase for at støtte hormonbalancen
- 🔔 **Påmindelser** — notifikationer på de tider du selv vælger
- 📊 **Historik** — grafer over væske, vægt, måltider og bevægelse (7/14/30 dage)

Alle data gemmes **lokalt på din enhed** (`localStorage`). Intet sendes nogen steder.

---

## 📁 Filer

```
index.html          → selve appen
config.js            → indstilling af baggrunds-push (server-URL + offentlig nøgle)
manifest.json         → PWA-manifest (navn, ikoner, farver)
service-worker.js     → offline-cache + modtagelse af push
icon-192.png          → app-ikon
icon-512.png          → app-ikon (stort)
apple-touch-icon.png  → hjemmeskærms-ikon på iPhone
server.js             → valgfri Node-server til baggrunds-notifikationer (ægte Web Push via VAPID)
package.json          → afhængigheder til server.js
env.example           → skabelon til .env med VAPID-nøgler (kopiér og udfyld selv, se ADVARSEL nedenfor)
```

---

## 🚀 Sådan lægger du den på GitHub Pages

1. Opret et nyt repository på GitHub, fx **`bloom`**.
2. Upload **alle filerne ovenfor** til repo'et (træk-og-slip i browseren under *Add file → Upload files*, eller via `git`).
3. Gå til **Settings → Pages**.
4. Under *Build and deployment* → *Source*: vælg **Deploy from a branch**.
5. Vælg branch **`main`** og mappe **`/ (root)`**, tryk **Save**.
6. Efter ½–2 minutter er appen live på:
   `https://<dit-brugernavn>.github.io/bloom/`

> En PWA **kræver HTTPS** for at kunne installeres — det giver GitHub Pages automatisk. ✅

### Via git (alternativ)
```bash
git init
git add .
git commit -m "Bloom PWA"
git branch -M main
git remote add origin https://github.com/<dit-brugernavn>/bloom.git
git push -u origin main
```

---

## 📲 Sådan installerer du den på iPhone-hjemmeskærmen

1. Åbn linket (`https://<dit-brugernavn>.github.io/bloom/`) i **Safari** (skal være Safari på iOS).
2. Tryk på **Del**-ikonet (firkanten med pil op).
3. Vælg **"Føj til hjemmeskærm"**.
4. Tryk **Tilføj**.

Nu ligger Bloom som et app-ikon, åbner i fuldskærm uden browserlinje, og virker offline. 🎉

---

## 🔔 Om påmindelserne

Påmindelser sættes under **Mig** → slå *Påmindelser* til og vælg tidspunkter for hvert punkt. Notifikationerne er **lokale på din enhed** — der sendes ingen persondata nogen steder.

Der er to niveauer:

**A) Uden server (standard)** — påmindelser vises pålideligt, mens appen har været åbnet for nylig. Ingen opsætning. Godt til at komme i gang.

**B) Med baggrunds-push (valgfri)** — for at få påmindelser *også når appen er helt lukket*, kan du deploye den lille server (`server.js`) og udfylde `config.js`. Så bruger appen ægte Web Push.

Kort sagt:
1. Kopiér `env.example` til `.env` og udfyld dine **egne** VAPID-nøgler (generér med `npm run keys` — brug aldrig eksempel-nøglerne i produktion).
2. Deploy serveren (fx på Render/Railway/Fly) med `npm install` + `npm start`, og sæt miljøvariablerne `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (og evt. `ALLOW_ORIGIN`).
3. Skriv server-adressen + den offentlige nøgle i `config.js`.
4. Slå påmindelser til i appen → den abonnerer automatisk, og du ser "🌙 Baggrunds-påmindelser er aktive".

> På iOS virker baggrunds-push kun, når appen er **føjet til hjemmeskærmen** (iOS 16.4+).

## 📊 Om historikken

Under **Historik** kan du se 7/14/30 dage:
- søjlediagram over dagligt væskeindtag,
- kurve over din vægt,
- et lille "varmekort" over hvor mange af dagens 5 punkter (3 måltider + 2 bevægelse) du klarede,
- samt gennemsnit, stime og antal loggede dage.

Alt beregnes ud fra de data, der allerede ligger lokalt i appen.

---

*Bloom giver generelle velvære- og fødevareforslag inspireret af cyklussens fire faser — ikke lægefaglige råd. Øvelserne er almene; efter fødsel kan mavemuskler være delt (diastase) og bækkenbunden svækket, så start blidt og få evt. et tjek hos fysioterapeut eller jordemoder. Mærker du markante forandringer, så tal med din læge.* 🌷
