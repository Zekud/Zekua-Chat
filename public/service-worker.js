const CACHE_NAME = "my-chat-app-cache";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/static/css/main.chunk.css",
  "/static/js/bundle.js",
  // Add other assets and files your app depends on
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
