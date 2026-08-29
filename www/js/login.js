/*
============================================================
                    KEDU ACADEMY
                    LOGIN.JS
============================================================

Purpose:
- Future login screen controller.
- Connects the future login UI with auth.js.
- Does not change the current APK until a login form
  is connected to this module.

Dependencies:
- config.js
- api.js
- auth.js
============================================================
*/


/* ==========================================================
   LOGIN CONFIGURATION
========================================================== */

const KEDU_LOGIN_CONFIG = {

    FORM_ID: "login-form",

    USERNAME_INPUT_ID: "login-username",

    PASSWORD_INPUT_ID: "login-password",

    SUBMIT_BUTTON_ID: "login-submit-btn",

    ERROR_ID: "login-error",

    LOADING_CLASS: "loading"
};


/* ==========================================================
   LOGIN STATE
========================================================== */

let keduLoginInProgress = false;


/* ==========================================================
   GET LOGIN ELEMENT
========================================================== */

function keduLoginElement(id) {

    return document.getElementById(id);
}


/* ==========================================================
   SHOW LOGIN ERROR
========================================================== */

function keduShowLoginError(message) {

    const errorElement =
        keduLoginElement(
            KEDU_LOGIN_CONFIG.ERROR_ID
        );


    if (!errorElement) {
        console.warn(
            "KEDU: Login error element not found.",
            message
        );

        return;
    }


    errorElement.textContent =
        message || "Unable to login.";

    errorElement.hidden = false;
}


/* ==========================================================
   CLEAR LOGIN ERROR
========================================================== */

function keduClearLoginError() {

    const errorElement =
        keduLoginElement(
            KEDU_LOGIN_CONFIG.ERROR_ID
        );


    if (!errorElement) {
        return;
    }


    errorElement.textContent = "";

    errorElement.hidden = true;
}


/* ==========================================================
   SET LOGIN LOADING STATE
========================================================== */

function keduSetLoginLoading(
    loading
) {

    const button =
        keduLoginElement(
            KEDU_LOGIN_CONFIG.SUBMIT_BUTTON_ID
        );


    if (!button) {
        return;
    }


    button.disabled = Boolean(
        loading
    );


    button.classList.toggle(
        KEDU_LOGIN_CONFIG.LOADING_CLASS,
        Boolean(loading)
    );


    button.setAttribute(
        "aria-busy",
        loading ? "true" : "false"
    );
}


/* ==========================================================
   GET LOGIN CREDENTIALS
========================================================== */

function keduGetLoginCredentials() {

    const usernameInput =
        keduLoginElement(
            KEDU_LOGIN_CONFIG.USERNAME_INPUT_ID
        );

    const passwordInput =
        keduLoginElement(
            KEDU_LOGIN_CONFIG.PASSWORD_INPUT_ID
        );


    if (!usernameInput) {

        throw new Error(
            "Login username field not found."
        );
    }


    if (!passwordInput) {

        throw new Error(
            "Login password field not found."
        );
    }


    const username =
        String(
            usernameInput.value || ""
        ).trim();


    const password =
        String(
            passwordInput.value || ""
        );


    if (!username) {

        throw new Error(
            "Please enter your username."
        );
    }


    if (!password) {

        throw new Error(
            "Please enter your password."
        );
    }


    return {

        username: username,

        password: password
    };
}


/* ==========================================================
   LOGIN SUCCESS
========================================================== */

function keduHandleLoginSuccess(
    response
) {

    window.dispatchEvent(
        new CustomEvent(
            "kedu:login-success",
            {
                detail: response
            }
        )
    );


    console.log(
        "KEDU: Login successful."
    );
}


/* ==========================================================
   LOGIN SUBMIT
========================================================== */

async function keduHandleLoginSubmit(
    event
) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();
    }


    if (keduLoginInProgress) {

        return;
    }


    keduClearLoginError();


    if (
        !window.KeduAuth ||
        typeof window.KeduAuth.login !==
        "function"
    ) {

        keduShowLoginError(
            "Authentication system is not available."
        );

        console.error(
            "KEDU: KeduAuth.login() is unavailable."
        );

        return;
    }


    keduLoginInProgress = true;

    keduSetLoginLoading(true);


    try {

        const credentials =
            keduGetLoginCredentials();


        const response =
            await window.KeduAuth.login(
                credentials
            );


        keduHandleLoginSuccess(
            response
        );


    } catch (error) {

        console.error(
            "KEDU: Login failed.",
            error
        );


        keduShowLoginError(
            error?.message ||
            "Login failed. Please try again."
        );


    } finally {

        keduLoginInProgress = false;

        keduSetLoginLoading(false);
    }
}


/* ==========================================================
   INITIALIZE LOGIN FORM
========================================================== */

function keduInitializeLogin() {

    const form =
        keduLoginElement(
            KEDU_LOGIN_CONFIG.FORM_ID
        );


    /*
     * The current APK may not have a login form.
     * Therefore this function safely does nothing.
     */

    if (!form) {

        console.log(
            "KEDU: Login form not present. Future login module ready."
        );

        return;
    }


    if (
        form.dataset.keduLoginInitialized ===
        "true"
    ) {

        return;
    }


    form.addEventListener(
        "submit",
        keduHandleLoginSubmit
    );


    form.dataset.keduLoginInitialized =
        "true";


    console.log(
        "KEDU: Login form initialized."
    );
}


/* ==========================================================
   PUBLIC LOGIN API
========================================================== */

window.KeduLogin = {

    initialize:
        keduInitializeLogin,

    submit:
        keduHandleLoginSubmit,

    getCredentials:
        keduGetLoginCredentials,

    showError:
        keduShowLoginError,

    clearError:
        keduClearLoginError,

    setLoading:
        keduSetLoginLoading
};


/* ==========================================================
   AUTO INITIALIZE WHEN DOM IS READY
========================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        keduInitializeLogin,
        {
            once: true
        }
    );

} else {

    keduInitializeLogin();
}


/* ==========================================================
   LOGIN.JS READY
========================================================== */

console.log(
    "KEDU: Login module ready."
);
