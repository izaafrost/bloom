# 📘 Sådan publicerer du Bloom (trin for trin)

Den nemmeste opsætning:
- **Selve appen** → GitHub Pages (gratis, HTTPS, ingen server nødvendig)
- **Baggrunds-notifikationer** → Render.com (gratis, kobles til dit GitHub-repo)

Du kan nøjes med **Del 1** og have en fuldt fungerende app med lokale påmindelser.
**Del 2** tilføjer notifikationer der også virker, når appen er lukket.

Alle filer ligger i samme mappe (repo-roden) og skal i ét repo. Mappestrukturen er:

```
bloom/
├─ index.html
├─ config.js
├─ manifest.json
├─ service-worker.js
├─ icon-192.png
├─ icon-512.png
├─ apple-touch-icon.png
├─ README.md
├─ server.js
├─ package.json
├─ env.example
└─ .gitignore
```

---

## ✅ Forudsætninger
- En **GitHub-konto** (gratis): https://github.com/signup
- En **iPhone** med **Safari** (til installation)
- Til Del 2: en **Render-konto** (gratis): https://render.com — kan logges ind med GitHub

---

# DEL 1 · Læg appen online (GitHub Pages)

### 1.1 Opret et repository
1. Gå til https://github.com/new
2. **Repository name**: `bloom`
3. Vælg **Public** (Pages er gratis på public repos).
4. Klik **Create repository**.

### 1.2 Læg filerne i repo'et

**Nemmest — via terminal (du har git på Pop!_OS):**
Stå i mappen med alle filerne og kør:
```bash
git init
git add .
git commit -m "Bloom"
git branch -M main
git remote add origin https://github.com/DIT-BRUGERNAVN/bloom.git
git push -u origin main
```
> Erstat `DIT-BRUGERNAVN` med dit GitHub-brugernavn.
> `.gitignore` i roden sørger for, at hemmeligheder og `node_modules` ikke kommer med.

**Alternativt — via browseren (uden terminal):**
1. På repo-siden: **Add file → Upload files**.
2. Træk **alle filerne** ind. Slip dem.
3. Skriv en besked og klik **Commit changes**.

### 1.3 Slå GitHub Pages til
1. I repo'et: **Settings** (øverst) → **Pages** (i venstremenuen).
2. Under **Build and deployment → Source**: vælg **Deploy from a branch**.
3. **Branch**: vælg `main` og mappe `/ (root)`. Klik **Save**.
4. Vent ½–2 minutter og opdater siden. Øverst står din adresse:

   **`https://DIT-BRUGERNAVN.github.io/bloom/`**

### 1.4 Test i browseren
Åbn adressen. Appen skulle nu køre. 🎉
(På dette tidspunkt virker lokale påmindelser allerede — men kun mens appen er åben. Del 2 fikser baggrunden.)

### 1.5 Installér på iPhone
1. Åbn adressen i **Safari** på din iPhone.
2. Tryk på **Del**-ikonet (firkant med pil op).
3. Vælg **"Føj til hjemmeskærm"** → **Tilføj**.
4. Åbn Bloom fra hjemmeskærmen — nu kører den i fuldskærm med eget ikon.

> ⚠️ Notifikationer på iOS kræver, at appen åbnes **fra hjemmeskærmen** (ikke inde i Safari). Så installér den, før du slår påmindelser til.

**Er du tilfreds med lokale påmindelser, er du færdig her.** Vil du have påmindelser i baggrunden, fortsæt til Del 2.

---

# DEL 2 · Baggrunds-notifikationer (Render)

Dette får påmindelser til at virke, **selv når appen er helt lukket**.

### 2.1 (Anbefalet) Lav dine egne VAPID-nøgler
Der ligger en skabelon med pladsholdere i `env.example`, men lav dine egne nøgler:
```bash
npm install
npm run keys
```
Du får en `publicKey` og en `privateKey`. **Gem dem** — du skal bruge dem om lidt.

> 🔒 **Vigtigt om sikkerhed:** Den **private** nøgle skal holdes hemmelig. Læg den **aldrig** i et public repo. Vi sætter den kun som miljøvariabel inde i Render (se 2.3). Den **offentlige** nøgle må gerne være offentlig (den skal i `config.js`).

### 2.2 Opret web-servicen på Render
1. Log ind på https://render.com (vælg **"Sign in with GitHub"**).
2. Klik **New → Web Service**.
3. Vælg dit **bloom**-repo (giv Render adgang, hvis den spørger).
4. Udfyld:
   - **Name**: `bloom-push` (frit valg)
   - **Root Directory**: lad stå tom (serveren ligger i repo-roden, ikke i en undermappe)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 2.3 Sæt miljøvariabler (dine nøgler)
Stadig på opsætningssiden (eller bagefter under **Environment**), tilføj:

| Key | Value |
|-----|-------|
| `VAPID_PUBLIC_KEY`  | din **offentlige** nøgle |
| `VAPID_PRIVATE_KEY` | din **private** nøgle |
| `VAPID_SUBJECT`     | `mailto:din@mail.dk` |
| `ALLOW_ORIGIN`      | `https://DIT-BRUGERNAVN.github.io` |

> `ALLOW_ORIGIN` er kun din "origin" — altså `https://DIT-BRUGERNAVN.github.io` **uden** `/bloom/`.

### 2.4 Deploy
Klik **Create Web Service**. Render bygger og starter serveren. Når den er grøn (Live), står adressen øverst, fx:

   **`https://bloom-push.onrender.com`**

Test den ved at åbne `https://bloom-push.onrender.com/` i browseren — du skulle se "Bloom push server kører 🌸".

### 2.5 Forbind appen til serveren
1. Åbn filen **`config.js`** (i roden af projektet).
2. Udfyld de to felter:
   ```js
   window.BLOOM_CONFIG = {
     serverUrl: "https://bloom-push.onrender.com",
     vapidPublicKey: "DIN_OFFENTLIGE_VAPID_NØGLE"
   };
   ```
   - `serverUrl`: din Render-adresse (uden skråstreg til sidst).
   - `vapidPublicKey`: **samme offentlige nøgle** som på Render.
3. Gem og send ændringen til GitHub:
   ```bash
   git add config.js
   git commit -m "Forbind push-server"
   git push
   ```
   (eller via browseren: åbn `config.js` → blyant-ikonet → ret → **Commit changes**.)

### 2.6 Slå baggrunds-push til på din iPhone
1. Åbn Bloom **fra hjemmeskærmen**.
2. Gå til **Mig** (nederst til højre).
3. Slå **Påmindelser** til → accepter notifikationer, når iOS spørger.
4. Du skulle nu se: **"🌙 Baggrunds-påmindelser er aktive"**.
5. Tjek tidspunkterne, og tryk evt. **"Send en test-notifikation"**.

Færdig! 🌸 Nu får du besked på dine tider — også når appen er lukket.

---

## 🧪 Hurtig test af baggrunds-push
Sæt fx "Frokost" til om 2 minutter, luk appen helt, og vent. Notifikationen skulle dukke op.

---

## 🛠️ Fejlfinding

**Appen vises ikke på Pages-adressen**
- Vent et par minutter mere; første deploy tager tid.
- Tjek at **Source** står til `main` / `root` under Settings → Pages.

**"Føj til hjemmeskærm" mangler**
- Du skal bruge **Safari** på iOS (ikke Chrome).

**Notifikationer kommer ikke**
- Åbn appen fra **hjemmeskærmen**, ikke i Safari.
- Tjek at du sagde **Tillad** til notifikationer (ellers: iOS Indstillinger → Bloom → Notifikationer).
- Under **Mig** skal der stå "Baggrunds-påmindelser er aktive". Står der det ikke, så tjek `config.js` (rigtig server-URL + nøgle) og at Render er Live.

**Notifikationen er forsinket**
- Renders **gratis** server "sover" efter ca. 15 min. inaktivitet og vågner først ved næste kald, hvilket kan forsinke en påmindelse. Løsninger: en betalt always-on instans på Render, eller flyt til **Railway/Fly.io**, eller kør på en lille VPS med `pm2`.

**"CORS"-fejl i konsollen**
- Tjek at `ALLOW_ORIGIN` på Render er præcis `https://DIT-BRUGERNAVN.github.io` (din origin, uden sti).

**Jeg ændrede config.js, men appen bruger stadig det gamle**
- Appen cacher for offline-brug. Luk og åbn appen et par gange, eller fjern den fra hjemmeskærmen og føj den til igen.

---

## 🔐 Sikkerhed kort
- Den **private** VAPID-nøgle findes **kun** som miljøvariabel på Render — aldrig i repo'et.
- `config.js` (offentlig nøgle + server-URL) må gerne være offentlig.
- Al brugerdata (cyklus, vægt, vand, måltider) gemmes **lokalt på din enhed**. Serveren gemmer kun det tekniske push-abonnement + dine påmindelsestider.

God fornøjelse med Bloom! 🌷
