/* =========================================================
   KEDU PW — SOCIAL CHANNEL JOIN POSTER

   Rotation:
   WhatsApp → Telegram → YouTube → WhatsApp...

   Timing:
   Loading reaches 100%
          ↓
   Wait 1 second
          ↓
   Show poster
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENTS
    ===================================================== */

    const overlay =
        document.getElementById(
            "social-join-overlay"
        );

    const poster =
        document.getElementById(
            "social-join-poster"
        );

    const platformIcon =
        document.getElementById(
            "social-join-platform-icon"
        );

    const platformName =
        document.getElementById(
            "social-join-platform-name"
        );

    const title =
        document.getElementById(
            "social-join-title"
        );

    const description =
        document.getElementById(
            "social-join-description"
        );

    const noticeText =
        document.getElementById(
            "social-join-notice-text"
        );

    const cancelButton =
        document.getElementById(
            "social-join-cancel"
        );

    const joinButton =
        document.getElementById(
            "social-join-now"
        );


    /* =====================================================
       SAFETY CHECK
    ===================================================== */

    if (
        !overlay ||
        !poster ||
        !platformIcon ||
        !platformName ||
        !title ||
        !description ||
        !noticeText ||
        !cancelButton ||
        !joinButton
    ) {
        return;
    }


    /* =====================================================
       OFFICIAL CHANNELS
    ===================================================== */

    const channels = {

        whatsapp: {

            name:
                "WhatsApp",

            title:
                "Official WhatsApp Channel",

            description:
                "Get official KEDU updates, announcements, important notifications, educational updates and useful information directly through our WhatsApp Channel.",

            url:
                "https://whatsapp.com/channel/0029Vb8J2YL1yT2GC58Kad19"

        },


        telegram: {

            name:
                "Telegram",

            title:
                "Official Telegram Channel",

            description:
                "Join the official KEDU Telegram channel to receive educational updates, announcements, important notifications and community information.",

            url:
                "https://t.me/keduwolrd"

        },


        youtube: {

            name:
                "YouTube",

            title:
                "Official KEDU YouTube Channel",

            description:
                "Subscribe to the official KEDU YouTube channel for educational lectures, important updates, useful videos and quality learning content.",

            url:
                "https://www.youtube.com/@Keduworld10"

        }

    };


    /* =====================================================
       STORAGE
    ===================================================== */

    const STORAGE_KEY =
        "kedu_last_social_poster";


    /* =====================================================
       PLATFORM ICONS
    ===================================================== */

    const whatsappIcon = `

        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >

            <path
                d="M12 2.1a9.8 9.8 0 0 0-8.5 14.8L2.2 21.8l5-1.3A9.9 9.9 0 1 0 12 2.1Z"
            />

            <path
                d="M8.2 7.2c.2-.3.4-.3.7-.3h.5c.2 0 .4.1.5.4l.8 1.9c.1.3.1.5-.1.7l-.6.7c-.1.1-.1.3 0 .5.4.8 1 1.5 1.7 2 .6.5 1.3.9 2 1.1.2.1.4 0 .5-.1l.7-.8c.2-.2.4-.2.7-.1l1.8.8c.3.1.4.3.4.6 0 .5-.2 1-.6 1.3-.4.4-1 .6-1.5.5-1.3-.2-2.8-.9-4.2-2-1.5-1.2-2.7-2.7-3.4-4.3-.4-.8-.6-1.6-.5-2.2.1-.5.4-.9.7-1.2Z"
            />

        </svg>

    `;


    const telegramIcon = `

        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >

            <path
                d="M21.7 3.2L18.6 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-.9.5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.1 13.6l-5-1.6c-1.1-.4-1.1-1.1.2-1.7L20.3 2.1c.9-.3 1.7.2 1.4 1.1Z"
            />

        </svg>

    `;


    const youtubeIcon = `

        <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
        >

            <path
                d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8Z"
            />

            <path
                d="M9.6 15.8 15.8 12 9.6 8.2v7.6Z"
                fill="#FF0000"
            />

        </svg>

    `;


    /* =====================================================
       GET NEXT PLATFORM
    ===================================================== */

    function getNextPlatform() {

        let lastPlatform = null;

        try {

            lastPlatform =
                localStorage.getItem(
                    STORAGE_KEY
                );

        } catch (error) {

            lastPlatform = null;

        }


        /*
         * First app opening
         */

        if (
            lastPlatform !== "whatsapp" &&
            lastPlatform !== "telegram" &&
            lastPlatform !== "youtube"
        ) {

            return "whatsapp";

        }


        /*
         * Three-way rotation
         */

        if (
            lastPlatform === "whatsapp"
        ) {

            return "telegram";

        }


        if (
            lastPlatform === "telegram"
        ) {

            return "youtube";

        }


        return "whatsapp";

    }


    /* =====================================================
       SAVE LAST PLATFORM
    ===================================================== */

    function saveLastPlatform(platform) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                platform
            );

        } catch (error) {

            /*
             * Ignore localStorage errors.
             */

        }

    }


    /* =====================================================
       PREPARE POSTER
    ===================================================== */

    function preparePoster(platform) {

        const channel =
            channels[platform];

        if (!channel) return;


        /* ================================================
           PLATFORM CLASS
        ================================================ */

        poster.classList.remove(
            "social-whatsapp",
            "social-telegram",
            "social-youtube"
        );

        poster.classList.add(
            `social-${platform}`
        );


        /* ================================================
           ICON
        ================================================ */

        if (
            platform === "telegram"
        ) {

            platformIcon.innerHTML =
                telegramIcon;

        } else if (
            platform === "youtube"
        ) {

            platformIcon.innerHTML =
                youtubeIcon;

        } else {

            platformIcon.innerHTML =
                whatsappIcon;

        }


        /* ================================================
           PLATFORM NAME
        ================================================ */

        platformName.textContent =
            channel.name;


        /* ================================================
           TITLE
        ================================================ */

        title.textContent =
            channel.title;


        /* ================================================
           DESCRIPTION
        ================================================ */

        description.textContent =
            channel.description;


        /* ================================================
           IMPORTANT NOTICE
        ================================================ */

        noticeText.textContent =
            "KEDU does not charge any money for joining the official channel. If anyone asks you for money claiming to represent KEDU, do not pay them and report/ignore the request.";


        /* ================================================
           JOIN BUTTON
        ================================================ */

        joinButton.textContent =
            `Join ${channel.name}`;

        joinButton.href =
            channel.url;

    }


    /* =====================================================
       OPEN POSTER
    ===================================================== */

    function openSocialPoster() {

        const platform =
            getNextPlatform();


        preparePoster(
            platform
        );


        /*
         * Save immediately when displayed.
         */

        saveLastPlatform(
            platform
        );


        overlay.classList.add(
            "is-visible"
        );

        overlay.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "social-poster-open"
        );

    }


    /* =====================================================
       CLOSE POSTER
    ===================================================== */

    function closeSocialPoster() {

        overlay.classList.remove(
            "is-visible"
        );

        overlay.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.classList.remove(
            "social-poster-open"
        );

    }


    /* =====================================================
       CANCEL
    ===================================================== */

    cancelButton.addEventListener(
        "click",
        closeSocialPoster
    );


    /* =====================================================
       OUTSIDE TAP
    ===================================================== */

    overlay.addEventListener(
        "click",
        (event) => {

            if (
                event.target === overlay
            ) {

                closeSocialPoster();

            }

        }
    );


    /* =====================================================
       ESCAPE
    ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                overlay.classList.contains(
                    "is-visible"
                )
            ) {

                closeSocialPoster();

            }

        }
    );


    /* =====================================================
       WAIT FOR LOADING TO REACH 100%
    ===================================================== */

    function waitForLoadingComplete() {

        const percent =
            document.getElementById(
                "progress-percent"
            );

        if (!percent) {

            return;

        }


        const currentPercent =
            percent.textContent
                .trim()
                .replace("%", "");


        if (
            currentPercent === "100"
        ) {

            /*
             * Loading is exactly 100%.
             * Wait one second before
             * showing the social poster.
             */

            setTimeout(
                openSocialPoster,
                1000
            );

            return;

        }


        /*
         * Check again shortly.
         */

        setTimeout(
            waitForLoadingComplete,
            100
        );

    }


    /* =====================================================
       START LOADING CHECK
    ===================================================== */

    waitForLoadingComplete();

});