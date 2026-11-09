// Сервис-воркер: игра работает без интернета (самолёт) + уведомления
const V='arena-offline-v1';
const CORE=['./','index.html','manifest.json','icon-192.png','icon-512.png','apple-touch-icon.png'];
const THREE='https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await Promise.all(CORE.map(u=>c.add(u).catch(()=>{})));try{await c.put(THREE,await fetch(new Request(THREE,{mode:'no-cors'})))}catch(_){}self.skipWaiting()})())});
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V&&k.startsWith('arena-offline'))await caches.delete(k);await self.clients.claim()})()));
const timeout=ms=>new Promise((_,rej)=>setTimeout(()=>rej(new Error('t')),ms));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){
  e.respondWith((async()=>{const c=await caches.open(V);try{const res=await Promise.race([fetch(r),timeout(r.mode==='navigate'?4000:8000)]);if(res&&res.ok)c.put(r,res.clone());return res}catch(_){const m=await c.match(r,{ignoreSearch:true});if(m)return m;if(r.mode==='navigate'){const i=await c.match('index.html');if(i)return i}return Response.error()}})());
 }else if(u.href===THREE){
  e.respondWith((async()=>{const c=await caches.open(V),m=await c.match(THREE);if(m)return m;const res=await fetch(r);try{c.put(THREE,res.clone())}catch(_){}return res})());
 }else if(u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com'){
  e.respondWith((async()=>{const c=await caches.open(V),m=await c.match(r);const n=fetch(r).then(res=>{try{c.put(r,res.clone())}catch(_){}return res}).catch(()=>null);return m||(await n)||Response.error()})());
 }});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if('focus' in c)return c.focus()}if(self.clients.openWindow)return self.clients.openWindow('./')}))});
