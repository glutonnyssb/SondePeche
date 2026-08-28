// Service worker : met l'application en cache pour qu'elle démarre sans réseau.
// Change VERSION à chaque modification de index.html pour forcer la mise à jour.
const VERSION = "sonde-3";
const COQUILLE = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(COQUILLE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(cles => Promise.all(cles.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  // La météo passe toujours par le réseau, jamais par le cache.
  if (url.hostname.endsWith("open-meteo.com")) return;
  if (e.request.method !== "GET") return;

  e.respondWith(
    caches.match(e.request).then(reponse => {
      if (reponse) {
        // On rafraîchit en arrière-plan sans bloquer l'affichage.
        fetch(e.request).then(r => {
          if (r && r.ok) caches.open(VERSION).then(c => c.put(e.request, r.clone()));
        }).catch(() => {});
        return reponse;
      }
      return fetch(e.request).catch(() => caches.match("./index.html"));
    })
  );
});
