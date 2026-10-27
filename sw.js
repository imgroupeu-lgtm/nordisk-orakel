/* Offline support: the whole site is cached on install, so the app opens without internet.
   Pages and texts: network first (fresh when online), cache when offline. Images and fonts: cache first. */
const VERSION="orakel-v9-1";
const CORE=["./","index.html","manifest.webmanifest", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "img/asgardsreien.jpg", "img/dynna.jpg", "img/froan-salyne.jpg", "img/nokken.jpg", "img/primstav.jpg", "img/sorburoy-berg.jpg", "img/sorburoy-nordlys-hus.jpg", "img/sorburoy-nordlys.jpg", "img/sorburoy-skumring.jpg", "img/sorburoy-solnedgang.jpg", "img/sorburoy-tjern.jpg", "img/thor.jpg", "img/volva.jpg", "img/yggdrasil.jpg", "lang/da.json", "lang/de.json", "lang/en.json", "lang/et.json", "lang/fi.json", "lang/lt.json", "lang/lv.json", "lang/no.json", "lang/pl.json", "lang/sv.json"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url);
  const fresh=r.mode==="navigate"||u.pathname.endsWith(".json")||u.pathname.endsWith(".html")||u.pathname.endsWith("/");
  if(fresh&&u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(VERSION).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));
  }else{
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==="opaque"){const c=res.clone();caches.open(VERSION).then(x=>x.put(r,c))}return res})));
  }
});
