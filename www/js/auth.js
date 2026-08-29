/*
============================================================
                    KEDU ACADEMY
                    AUTH.JS
============================================================

Purpose:
- Central authentication manager for KEDU PW APK.
- Works with the central api.js layer.
- Handles access token and refresh token.
- Provides login, registration, logout and session helpers.
- No backend/R2 secrets are stored here.

IMPORTANT:
- Authentication is performed by the backend.
- This file only communicates with the backend API.
============================================================
*/


/* ==========================================================
   AUTH CONFIGURATION
========================================================== */

const KEDU_AUTH_CONFIG = {

    /*
     * Backend authentication endpoints.
     * These paths can be changed later if the backend
     * uses different endpoint names.
     */

    LOGIN_PATH: "auth/login",

    REGISTER_PATH: "auth/register",

    REFRESH_PATH: "auth/refresh",

    LOGOUT_PATH: "auth/logout",

    ME_PATH: "auth/me",


    /*
     * Local session keys.
     */

    ACCESS_TOKEN_KEY: "kedu_access_token",

    REFRESH_TOKEN_KEY: "kedu_refresh_token",

    USER_KEY: "kedu_auth_user"
};


/* ==========================================================
   AUTH STORAGE
========================================================== */

const KeduAuthStorage = {

    getAccessToken() {

        try {

            return localStorage.getItem(
                KEDU_AUTH_CONFIG.ACCESS_TOKEN_KEY
            );

        } catch (error) {

            console.warn(
                "KEDU: Unable to read access token.",
                error
            );

            return null;
        }
    },


    setAccessToken(token) {

        if (!token) {
            return;
        }

        try {

            localStorage.setItem(
                KEDU_AUTH_CONFIG.ACCESS_TOKEN_KEY,
                String(token)
            );

        } catch (error) {

            console.warn(
                "KEDU: Unable to save access token.",
                error
            );
        }
    },


    getRefreshToken() {

        try {

            return localStorage.getItem(
                KEDU_AUTH_CONFIG.REFRESH_TOKEN_KEY
            );

        } catch (error) {

            console.warn(
                "KEDU: Unable to read refresh token.",
                error
            );

            return null;
        }
    },


    setRefreshToken(token) {

        if (!token) {
            return;
        }

        try {

            localStorage.setItem(
                KEDU_AUTH_CONFIG.REFRESH_TOKEN_KEY,
                String(token)
            );

        } catch (error) {

            console.warn(
                "KEDU: Unable to save refresh token.",
                error
            );
        }
    },


    getUser() {

        try {

            const user = localStorage.getItem(
                KEDU_AUTH_CONFIG.USER_KEY
            );

            return user
                ? JSON.parse(user)
                : null;

        } catch (error) {

            console.warn(
                "KEDU: Unable to read saved user.",
                error
            );

            return null;
        }
    },


    setUser(user) {

        if (!user) {
            return;
        }

        try {

            localStorage.setItem(
                KEDU_AUTH_CONFIG.USER_KEY,
                JSON.stringify(user)
            );

        } catch (error) {

            console.warn(
                "KEDU: Unable to save user.",
                error
            );
        }
    },


    clear() {

        try {

            localStorage.removeItem(
                KEDU_AUTH_CONFIG.ACCESS_TOKEN_KEY
            );

            localStorage.removeItem(
                KEDU_AUTH_CONFIG.REFRESH_TOKEN_KEY
            );

            localStorage.removeItem(
                KEDU_AUTH_CONFIG.USER_KEY
            );

        } catch (error) {

            console.warn(
                "KEDU: Unable to clear authentication data.",
                error
            );
        }
    }
};


/* ==========================================================
   SAVE AUTH RESPONSE
========================================================== */

function keduSaveAuthResponse(data) {

    if (!data || typeof data !== "object") {
        return;
    }


    /*
     * Support common backend response names.
     */

    const accessToken =
        data.accessToken ||
        data.access_token ||
        data.token ||
        null;


    const refreshToken =
        data.refreshToken ||
        data.refresh_token ||
        null;


    const user =
        data.user ||
        data.account ||
        data.profile ||
        null;


    if (accessToken) {

        KeduAuthStorage.setAccessToken(
            accessToken
        );
    }


    if (refreshToken) {

        KeduAuthStorage.setRefreshToken(
            refreshToken
        );
    }


    if (user) {

        KeduAuthStorage.setUser(
            user
        );
    }
}


/* ==========================================================
   AUTH REQUEST HELPER
========================================================== */

async function keduAuthRequest(
    path,
    options = {}
) {

    if (
        typeof window.keduApiRequest !==
        "function"
    ) {

        throw new Error(
            "KEDU API request function is not available."
        );
    }


    return window.keduApiRequest(
        path,
        options
    );
}


/* ==========================================================
   LOGIN
========================================================== */

async function keduLogin(credentials = {}) {

    if (
        !credentials ||
        typeof credentials !== "object"
    ) {

        throw new Error(
            "KEDU: Login credentials are required."
        );
    }


    const response =
        await keduAuthRequest(
            KEDU_AUTH_CONFIG.LOGIN_PATH,
            {
                method: "POST",
                body: credentials
            }
        );


    keduSaveAuthResponse(
        response
    );


    window.dispatchEvent(
        new CustomEvent(
            "kedu:login",
            {
                detail: response
            }
        )
    );


    return response;
}


/* ==========================================================
   REGISTER
========================================================== */

async function keduRegister(
    registrationData = {}
) {

    if (
        !registrationData ||
        typeof registrationData !== "object"
    ) {

        throw new Error(
            "KEDU: Registration data is required."
        );
    }


    const response =
        await keduAuthRequest(
            KEDU_AUTH_CONFIG.REGISTER_PATH,
            {
                method: "POST",
                body: registrationData
            }
        );


    /*
     * Save tokens only if the backend returns them.
     */

    keduSaveAuthResponse(
        response
    );


    window.dispatchEvent(
        new CustomEvent(
            "kedu:registration",
            {
                detail: response
            }
        )
    );


    return response;
}


/* ==========================================================
   REFRESH SESSION
========================================================== */

async function keduRefreshSession() {

    const refreshToken =
        KeduAuthStorage.getRefreshToken();


    if (!refreshToken) {

        return null;
    }


    const response =
        await keduAuthRequest(
            KEDU_AUTH_CONFIG.REFRESH_PATH,
            {
                method: "POST",

                body: {
                    refreshToken:
                        refreshToken
                }
            }
        );


    keduSaveAuthResponse(
        response
    );


    window.dispatchEvent(
        new CustomEvent(
            "kedu:session-refreshed",
            {
                detail: response
            }
        )
    );


    return response;
}


/* ==========================================================
   GET CURRENT USER
========================================================== */

async function keduGetCurrentUser() {

    const response =
        await keduAuthRequest(
            KEDU_AUTH_CONFIG.ME_PATH,
            {
                method: "GET"
            }
        );


    if (
        response &&
        response.user
    ) {

        KeduAuthStorage.setUser(
            response.user
        );

        return response.user;
    }


    if (
        response &&
        response.account
    ) {

        KeduAuthStorage.setUser(
            response.account
        );

        return response.account;
    }


    if (
        response &&
        response.profile
    ) {

        KeduAuthStorage.setUser(
            response.profile
        );

        return response.profile;
    }


    return response;
}


/* ==========================================================
   LOGOUT
========================================================== */

async function keduLogout() {

    const refreshToken =
        KeduAuthStorage.getRefreshToken();


    try {

        /*
         * Tell the backend to invalidate the session
         * when a refresh token exists.
         */

        if (refreshToken) {

            await keduAuthRequest(
                KEDU_AUTH_CONFIG.LOGOUT_PATH,
                {
                    method: "POST",

                    body: {
                        refreshToken:
                            refreshToken
                    }
                }
            );
        }

    } catch (error) {

        /*
         * Local logout must still happen even if
         * the backend cannot be reached.
         */

        console.warn(
            "KEDU: Backend logout failed.",
            error
        );

    } finally {

        KeduAuthStorage.clear();


        window.dispatchEvent(
            new CustomEvent(
                "kedu:logout"
            )
        );
    }
}


/* ==========================================================
   AUTH STATUS
========================================================== */

function keduIsLoggedIn() {

    return Boolean(
        KeduAuthStorage.getAccessToken()
    );
}


/* ==========================================================
   GET SAVED USER
========================================================== */

function keduGetSavedUser() {

    return KeduAuthStorage.getUser();
}


/* ==========================================================
   GET ACCESS TOKEN
========================================================== */

function keduGetAccessToken() {

    return KeduAuthStorage.getAccessToken();
}


/* ==========================================================
   CLEAR LOCAL SESSION
========================================================== */

function keduClearAuth() {

    KeduAuthStorage.clear();


    window.dispatchEvent(
        new CustomEvent(
            "kedu:auth-cleared"
        )
    );
}


/* ==========================================================
   EXPOSE AUTH API GLOBALLY
========================================================== */

window.KeduAuth = {

    login: keduLogin,

    register: keduRegister,

    refreshSession:
        keduRefreshSession,

    getCurrentUser:
        keduGetCurrentUser,

    logout: keduLogout,

    isLoggedIn:
        keduIsLoggedIn,

    getSavedUser:
        keduGetSavedUser,

    getAccessToken:
        keduGetAccessToken,

    clear:
        keduClearAuth,

    storage:
        KeduAuthStorage
};


/* ==========================================================
   AUTH.JS READY
========================================================== */

window.dispatchEvent(
    new CustomEvent(
        "kedu:auth-ready"
    )
);

console.log(
    "KEDU: Authentication system ready."
);
