# 🤝 Overdragelse · Bloom-projektet

Dette dokument giver et hurtigt overblik, så en ny person (eller deres Claude) kan arbejde videre uden at kende hele historikken. Paster du dette ind i en ny Claude-chat sammen med filerne, kan Claude fortsætte med det samme.

## Hvad er Bloom?
En lys, iPhone-venlig **PWA** (Progressive Web App) til at følge sin daglige rytme og menstruationscyklus. Alle brugerdata gemmes **lokalt** i browseren (`localStorage`) — intet sendes til en server, bortset fra det tekniske push-abonnement (se nedenfor).

## Funktioner
- **Måltider** — daglig afkrydsning af morgenmad, frokost, aftensmad
- **Bevægelse** — gåtur + core-træning
- **Øvelser** — pilates/yoga i 3 niveauer, målrettet efterfødsel, bækkenbund og kropsholdning
- **Væske** — glas á 250 ml, mål ca. 2 liter
- **Vægt** — registrering med lille trend-graf
- **Cyklus** — beregner fasen ud fra seneste menstruation + cykluslængde; **hele appens farveskema skifter efter fasen** (vinter/forår/sommer/efterår som "indre årstider")
- **Fødevareforslag pr. fase** — tilpasset for at støtte hormonbalancen (inspireret af Flow Intimates' cyklusguide)
- **Historik** — grafer for væske, vægt og et "varmekort" for måltider/bevægelse (7/14/30 dage)
- **Påmindelser** — lokale notifikationer + valgfri baggrunds-push via server

## Teknik
- **Frontend:** ét selvstændigt `index.html` (HTML/CSS/vanilla JS, ingen build). Skrifttyper: Fraunces + Hanken Grotesk. Ikoner: emoji + genereret blomster-ikon.
- **PWA:** `manifest.json` + `service-worker.js` (cache-first offline, modtager push).
- **Push-server (valgfri):** `server/` — Node + Express + `web-push` (VAPID) + `node-cron`. Sender notifikationer på brugerens tider (i deres tidszone), gemmer abonnementer i `subscriptions.json`.
- **Konfiguration:** `config.js` kobler frontend til push-serveren (server-URL + offentlig VAPID-nøgle). Er den tom, kører appen med lokale påmindelser alene.

## Filstruktur
```
index.html            selve appen
config.js             push-konfiguration (server-URL + offentlig nøgle)
manifest.json         PWA-manifest
service-worker.js     offline + push
icon-192.png / icon-512.png / apple-touch-icon.png
README.md             projektoverblik
PUBLICERING.md        trin-for-trin udgivelsesguide (GitHub Pages + Render)
server/               valgfri push-server (se server/README.md)
```

## Sådan kører man det
- **Lokalt:** åbn `index.html` i en browser (lokale påmindelser virker; baggrunds-push kræver server).
- **Udgivelse:** følg **`PUBLICERING.md`** — appen på GitHub Pages, serveren på Render, forbind via `config.js`.

## Vigtige forbehold
- **Sikkerhed:** den **private** VAPID-nøgle må aldrig i et offentligt repo — kun som miljøvariabel på serveren. Den offentlige nøgle må gerne stå i `config.js`.
- **iOS:** baggrunds-push virker kun, når appen er føjet til hjemmeskærmen (iOS 16.4+). Gratis Render-servere kan "sove" og forsinke en påmindelse.
- **Ingen build/afhængigheder i frontend** — det er bevidst holdt simpelt og redigérbart i hånden.

## Mulige næste skridt (ikke lavet endnu)
- Push-serveren om til en **Cloudflare Worker med Cron Trigger** (sover ikke, stadig gratis).
- Notifikation når en **ny cyklusfase** starter.
- **Eksport** af data, og evt. humør-/symptom-logning pr. dag.
- Redigérbare øvelses-favoritter.

## Sundhedsforbehold
Appen giver generelle velvære- og fødevareforslag — ikke lægefaglige råd. Øvelserne er almene; efter fødsel kan mavemuskler være delt (diastase), så start blidt og få evt. et tjek hos fysioterapeut/jordemoder.

---
*Tip: Vil du fortsætte med Claude, så åbn en ny chat, upload disse filer (eller ZIP'en), og indsæt dette dokument som første besked. Så har Claude hele konteksten.*
