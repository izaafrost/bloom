# 🌙 Bloom Push-server

En lille Node-server der sender **baggrunds-notifikationer** til Bloom-appen på de tidspunkter brugeren har valgt — også når appen er helt lukket. Den bruger ægte **Web Push** (VAPID) og en **cron** der tjekker hvert minut.

## Hvad den gør
- `GET /vapidPublicKey` → den offentlige nøgle
- `POST /subscribe` → gemmer abonnement + påmindelsestider + tidszone
- `POST /unsubscribe` → fjerner abonnement
- Hvert minut: sender de påmindelser, der matcher klokkeslættet i brugerens tidszone (én gang pr. dag pr. påmindelse)

Abonnementer gemmes i `subscriptions.json` ved siden af serveren.

---

## 1) VAPID-nøgler

Der ligger allerede et nøglepar i `.env.example`. **Lav gerne dine egne** (og hold den private hemmelig):

```bash
npm install
npm run keys
```

## 2) Kør lokalt

```bash
cp .env.example .env      # ret evt. nøgler + VAPID_SUBJECT (din mail)
npm install
npm start                 # lytter på http://localhost:3000
```

## 3) Deploy (gratis muligheder)

Serveren skal køre **konstant** (cron'en kører hvert minut), så en "always-on" host er bedst.

### Render.com (nemt)
1. Læg `server`-mappen i et GitHub-repo (eller hele projektet).
2. På Render: **New → Web Service**, peg på repo'et, og sæt **Root Directory** = `server`.
3. Build command: `npm install` · Start command: `npm start`.
4. Under **Environment** tilføj: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`, og evt. `ALLOW_ORIGIN` (din app-adresse).
5. Deploy. Din adresse bliver noget i stil med `https://bloom-push.onrender.com`.

> ⚠️ Renders gratis-tier kan **sove** efter inaktivitet, hvilket kan forsinke cron'en. Vil du være sikker, brug en betalt "always-on" instans, en lille VPS, eller **Railway/Fly.io**, som holder processen vågen.

### Andre
- **Railway.app** / **Fly.io**: samme idé — kør `npm start`, sæt miljøvariablerne.
- **Egen VPS**: kør med `pm2 start server.js` så den genstarter automatisk.

## 4) Forbind appen
I projektets **`config.js`** (ved siden af `index.html`) udfylder du:
```js
window.BLOOM_CONFIG = {
  serverUrl: "https://din-server-adresse",   // uden skråstreg til sidst
  vapidPublicKey: "DIN_OFFENTLIGE_VAPID_NØGLE"
};
```
Brug **samme** offentlige nøgle som på serveren. Commit og push — så slår appen automatisk baggrunds-push til, når brugeren aktiverer påmindelser under **Mig**.

---

## Vigtigt om iOS
- Baggrunds-push virker kun, når appen er **føjet til hjemmeskærmen** (installeret som PWA) på iOS 16.4+.
- Brugeren skal **acceptere notifikationer** første gang.
- `subscriptions.json` er ren fillagring — fint til personligt brug. Skal mange bruge den, så skift til en rigtig database.
