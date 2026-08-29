/* ============================================================
   KEDU ACADEMY
   CONFIG.JS
   ============================================================ */

/*
 * Central application configuration.
 *
 * IMPORTANT:
 * - No lecture videos are stored here.
 * - No PDFs are stored here.
 * - No R2 secret keys are stored here.
 * - R2 credentials MUST remain on the backend.
 *
 * The APK communicates with the backend API.
 * The backend communicates with Cloudflare R2.
 */

const KEDU_CONFIG = {

    /* --------------------------------------------------------
       APPLICATION
       -------------------------------------------------------- */

    appName: "KEDU PW",

    appVersion: "1.0.0",

    environment: "production",


    /* --------------------------------------------------------
       BACKEND API
       -------------------------------------------------------- */

    /*
     * Replace this with the real KEDU backend URL
     * when the backend is deployed.
     *
     * Example:
     * https://api.example.com
     */

    API_BASE_URL: "",


    /* --------------------------------------------------------
       API SETTINGS
       -------------------------------------------------------- */

    api: {

        timeout: 30000,

        credentials: "include",

        headers: {
            "Content-Type": "application/json"
        }

    },


    /* --------------------------------------------------------
       STORAGE
       -------------------------------------------------------- */

    storage: {

        provider: "cloudflare-r2",

        /*
         * R2 is accessed through the backend.
         *
         * DO NOT put:
         * - R2 access key
         * - R2 secret key
         * - R2 bucket credentials
         *
         * inside the APK.
         */

        directClientAccess: false

    },


    /* --------------------------------------------------------
       CONTENT
       -------------------------------------------------------- */

    content: {

        localContent: false,

        videos: "remote",

        thumbnails: "remote",

        pdfs: "remote",

        notes: "remote",

        dpp: "remote"

    },


    /* --------------------------------------------------------
       AUTHENTICATION
       -------------------------------------------------------- */

    auth: {

        enabled: true,

        tokenStorage: "secure",

        refreshEnabled: true

    }

};


/* ============================================================
   GLOBAL CONFIG
   ============================================================ */

window.KEDU_CONFIG = KEDU_CONFIG;
