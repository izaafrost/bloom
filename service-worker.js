/* Bloom service worker — cache-first så appen virker offline */
const CACHE = "bloom-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req).then((res) => {
        // Gem en kopi af nye svar (fx Google Fonts) til offline brug
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});

// Tryk på en notifikation → åbn/fokusér appen
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const c of list) { if ("focus" in c) return c.focus(); }
      if (self.clients.openWindow) return self.clients.openWindow("./index.html");
    })
  );
});

// Modtag baggrunds-push fra serveren og vis notifikation
self.addEventListener("push", (e) => {
  let data = { title: "Bloom 🌸", body: "Påmindelse" };
  try { if (e.data) data = e.data.json(); } catch (_) {}
  e.waitUntil(
    self.registration.showNotification(data.title || "Bloom 🌸", {
      body: data.body || "",
      icon: "icon-192.png",
      badge: "icon-192.png",
      tag: data.body || "bloom"
    })
  );
});
