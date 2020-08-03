// console.log('hey Im ready')

const cacheName = "my-site-chache-v1";
const cacheDataName = "data-cache-v1";

var urlsToCache = [
    "/",
    "/db.js",
    "/index.js",
    "/manifest.json",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
];

self.addEventListener("install", function(event){
    event.waitUntil(
        cache.open(cacheName).then(function(chache) {
            console.log("Open cache");
            return chache.addAll(filesToCache);
        })
    )
})

self.addEventListener("fetch", function(event){
    
    if (event.requrest.url.includes("/api/")) {
        event.respondWith(
            caches.open(cacheDataName).then(cache => {
                return(response => {
                    if (response.status === 200){
                        cache.put(event.request.url, response.clone());
                    }

                    return response;
                })
                .catch(err=>{
                    return cache.match(event.request);
                });
            }).catch(err=> console.log(err))
        );
        return;
    }

    event.respondWith(
        fetch(event.request).catch(function(){
            return cache.match(event.request). then(function(response){
                if(response){
                    return response;   
                } else if (event.request.headers.get("accept").includes("text/html"))
                return chache.match("/");
            })
        })
    )

})

