/* =========================================================
   KEDU PW — SERVICE WORKER
   PWA OFFLINE + CACHE SYSTEM
   ========================================================= */

const KEDU_PW_CACHE = "kedu-pw-v1";


/* =========================================================
   APP SHELL
   ========================================================= */

const KEDU_PW_APP_SHELL = [

    "./",
    "./index.html",

    "./manifest.json",

    "./css/style.css",
    "./css/root.css",
    "./css/responsive.css",
    "./css/loading.css",

    "./js/app.js",
    "./js/navigation.js",
    "./js/drawer.js",
    "./js/follow.js",
    "./js/social-poster.js",
    "./js/contact.js",
    "./js/about-kedu.js",
    "./js/more-apps.js",
    "./js/study.js",
    "./js/subject.js",
    "./js/chapter.js",
    "./js/lecture.js",
    "./js/lecture-player.js",
    "./js/streak.js",
    "./js/toast.js",
    "./js/batch.js",
    "./js/sort.js",
    "./js/attachment.js",
    "./js/pdf-viewer.js",
    "./js/download.js",
    "./js/notification.js",
    "./js/bookmark.js",
    "./js/search.js",
    "./js/schedule.js",
    "./js/theme.js",

    "./assets/logo/kedupw.png"

];


/* =========================================================
   INSTALL
   ========================================================= */

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(KEDU_PW_CACHE)
                .then(
                    cache => {

                        return cache.addAll(
                            KEDU_PW_APP_SHELL
                        );

                    }
                )

        );

        self.skipWaiting();

    }
);


/* =========================================================
   ACTIVATE
   ========================================================= */

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    cacheNames => {

                        return Promise.all(

                            cacheNames
                                .filter(
                                    cacheName =>
                                        cacheName !==
                                        KEDU_PW_CACHE
                                )
                                .map(
                                    cacheName =>
                                        caches.delete(
                                            cacheName
                                        )
                                )

                        );

                    }
                )

        );

        self.clients.claim();

    }
);


/* =========================================================
   FETCH
   ========================================================= */

self.addEventListener(
    "fetch",
    event => {

        const request =
            event.request;


        /*
         * Only handle GET requests.
         */

        if(
            request.method !== "GET"
        ){

            return;

        }


        const requestURL =
            new URL(
                request.url
            );


        /*
         * Never try to cache large
         * video/audio/PDF downloads.
         */

        const pathname =
            requestURL.pathname.toLowerCase();


        if(
            pathname.endsWith(".mp4") ||
            pathname.endsWith(".webm") ||
            pathname.endsWith(".m3u8") ||
            pathname.endsWith(".mp3") ||
            pathname.endsWith(".pdf")
        ){

            return;

        }


        /*
         * Navigation request.
         *
         * If offline, open cached index.html.
         */

        if(
            request.mode === "navigate"
        ){

            event.respondWith(

                fetch(request)
                    .then(
                        response => {

                            if(
                                response &&
                                response.ok
                            ){

                                const responseClone =
                                    response.clone();

                                caches
                                    .open(
                                        KEDU_PW_CACHE
                                    )
                                    .then(
                                        cache => {

                                            cache.put(
                                                request,
                                                responseClone
                                            );

                                        }
                                    );

                            }

                            return response;

                        }
                    )
                    .catch(
                        () => {

                            return caches.match(
                                "./index.html"
                            );

                        }
                    )

            );

            return;

        }


        /*
         * Cache-first for app resources.
         */

        event.respondWith(

            caches
                .match(request)
                .then(
                    cachedResponse => {

                        if(
                            cachedResponse
                        ){

                            return cachedResponse;

                        }


                        return fetch(request)
                            .then(
                                response => {

                                    if(
                                        !response ||
                                        !response.ok
                                    ){

                                        return response;

                                    }


                                    const responseClone =
                                        response.clone();

                                    caches
                                        .open(
                                            KEDU_PW_CACHE
                                        )
                                        .then(
                                            cache => {

                                                cache.put(
                                                    request,
                                                    responseClone
                                                );

                                            }
                                        );

                                    return response;

                                }
                            );

                    }
                )

        );

    }
);


/* =========================================================
   KEDU PW SERVICE WORKER READY
   ========================================================= */

console.log(
    "KEDU PW Service Worker Ready"
);