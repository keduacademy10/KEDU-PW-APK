/* =========================================
   KEDU PW APP
   Loading Screen
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loadingScreen =
        document.getElementById("loading-screen");

    const progressBar =
        document.getElementById("progress-bar");

    const progressPercent =
        document.getElementById("progress-percent");

    const loadingMessage =
        document.getElementById("loading-message");


    if (!loadingScreen) {
        return;
    }


    /*
     * Loading messages
     */

    const loadingMessages = [
        {
            percent: 0,
            message: "Starting KEDU PW..."
        },
        {
            percent: 20,
            message: "Preparing Study Space..."
        },
        {
            percent: 40,
            message: "Loading Study Resources..."
        },
        {
            percent: 60,
            message: "Preparing Your Learning Experience..."
        },
        {
            percent: 80,
            message: "Almost Ready..."
        },
        {
            percent: 100,
            message: "KEDU PW Is Ready!"
        }
    ];


    let progress = 0;


    /*
     * Update loading message
     */

    function updateMessage(value) {

        let currentMessage = loadingMessages[0];

        loadingMessages.forEach(item => {

            if (value >= item.percent) {
                currentMessage = item;
            }

        });

        loadingMessage.textContent =
            currentMessage.message;
    }


    /*
     * Update progress
     */

    function updateProgress(value) {

        progressBar.style.width = `${value}%`;

        progressPercent.textContent =
            `${value}%`;

        updateMessage(value);
    }


    /*
     * Start loading
     */

    const loadingInterval = setInterval(() => {

        progress++;

        updateProgress(progress);


        /*
         * When progress reaches 100%
         */

        if (progress >= 100) {

            clearInterval(loadingInterval);


            /*
             * Wait exactly one second
             * after reaching 100%
             */

            setTimeout(() => {

                loadingScreen.classList.add("hidden");


                /*
                 * Remove loading screen
                 * after fade-out animation
                 */

                setTimeout(() => {

                    loadingScreen.remove();

                }, 550);

            }, 1000);
        }

    }, 35);

});
/* =========================================================
   KEDU PW — PWA SERVICE WORKER REGISTRATION
   ========================================================= */

if(
    "serviceWorker" in navigator
){

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./service-worker.js"
                )
                .then(
                    registration => {

                        console.log(
                            "KEDU PW PWA Service Worker Registered",
                            registration.scope
                        );

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "KEDU PW PWA Service Worker Registration Failed:",
                            error
                        );

                    }
                );

        }
    );

}