/*
============================================================
KEDU ACADEMY
REGISTRATION.JS
============================================================

Purpose:
- Future KEDU PW user registration system.
- Communicates with the KEDU backend API.
- Does NOT store passwords or private backend credentials.
- Works with the central api.js and auth.js modules.
- Safe to keep in the APK before registration UI is added.

IMPORTANT:
- Registration will be handled by the backend.
- Password validation/security must also be enforced by the backend.
- R2 credentials must NEVER be placed here.
============================================================
*/


/* ============================================================
   REGISTRATION CONFIGURATION
   ============================================================ */

const KEDU_REGISTRATION_CONFIG = {

    /*
     * Backend endpoint.
     *
     * The actual backend URL is taken from api.js/config.js.
     * Do not put a Cloudflare R2 URL here.
     */
    ENDPOINT: "/auth/register",

    /*
     * Minimum password length.
     *
     * This is only client-side validation.
     * The backend MUST validate it again.
     */
    MIN_PASSWORD_LENGTH: 8

};


/* ============================================================
   REGISTRATION VALIDATION
   ============================================================ */

/**
 * Validate registration data before sending it
 * to the backend.
 *
 * @param {Object} data
 * @returns {Object}
 */
function validateRegistrationData(data = {}) {

    const errors = [];

    const username = String(data.username || "").trim();
    const email = String(data.email || "").trim();
    const phone = String(data.phone || "").trim();
    const password = String(data.password || "");
    const confirmPassword =
        String(data.confirmPassword || "");

    if (!username) {
        errors.push("Username is required.");
    }

    if (!email) {
        errors.push("Email is required.");
    } else if (!isValidEmail(email)) {
        errors.push("Please enter a valid email.");
    }

    if (!phone) {
        errors.push("Phone number is required.");
    }

    if (!password) {
        errors.push("Password is required.");
    } else if (
        password.length <
        KEDU_REGISTRATION_CONFIG.MIN_PASSWORD_LENGTH
    ) {
        errors.push(
            `Password must be at least ` +
            `${KEDU_REGISTRATION_CONFIG.MIN_PASSWORD_LENGTH} characters.`
        );
    }

    if (password !== confirmPassword) {
        errors.push("Passwords do not match.");
    }

    return {
        valid: errors.length === 0,
        errors
    };

}


/* ============================================================
   EMAIL VALIDATION
   ============================================================ */

/**
 * Basic email validation.
 *
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        String(email).trim()
    );

}


/* ============================================================
   PHONE VALIDATION
   ============================================================ */

/**
 * Basic phone validation.
 *
 * Backend validation is still required.
 *
 * @param {string} phone
 * @returns {boolean}
 */
function isValidPhone(phone) {

    const cleanedPhone =
        String(phone).replace(/\D/g, "");

    return cleanedPhone.length >= 10;

}


/* ============================================================
   REGISTRATION REQUEST
   ============================================================ */

/**
 * Send registration data to the KEDU backend.
 *
 * @param {Object} data
 * @returns {Promise<Object>}
 */
async function registerKeduUser(data = {}) {

    const validation =
        validateRegistrationData(data);

    if (!validation.valid) {

        throw new Error(
            validation.errors.join(" ")
        );

    }

    /*
     * Prepare only the fields required by the backend.
     *
     * Never send:
     * - R2 credentials
     * - database credentials
     * - private API keys
     * - access tokens
     */
    const registrationData = {

        username:
            String(data.username || "").trim(),

        email:
            String(data.email || "").trim(),

        phone:
            String(data.phone || "").trim(),

        password:
            String(data.password || "")

    };


    /*
     * api.js provides the central API request function.
     */
    if (
        typeof window.keduApiRequest !==
        "function"
    ) {

        throw new Error(
            "KEDU API is not available."
        );

    }


    try {

        const response =
            await window.keduApiRequest(
                KEDU_REGISTRATION_CONFIG.ENDPOINT,
                {
                    method: "POST",
                    body: registrationData
                }
            );


        /*
         * Backend decides the final registration result.
         */
        return {

            success: true,

            data: response

        };

    } catch (error) {

        console.error(
            "KEDU: Registration failed.",
            error
        );

        return {

            success: false,

            error: error,

            message:
                error?.message ||
                "Registration failed."

        };

    }

}


/* ============================================================
   REGISTRATION FORM HANDLER
   ============================================================ */

/**
 * Handle a registration form submission.
 *
 * This function is intentionally separate from the UI.
 * The actual form can be connected later.
 *
 * @param {HTMLFormElement} form
 * @returns {Promise<Object>}
 */
async function handleKeduRegistrationForm(form) {

    if (!form) {

        throw new Error(
            "Registration form was not provided."
        );

    }


    const formData =
        new FormData(form);


    const data = {

        username:
            formData.get("username"),

        email:
            formData.get("email"),

        phone:
            formData.get("phone"),

        password:
            formData.get("password"),

        confirmPassword:
            formData.get("confirmPassword")

    };


    return await registerKeduUser(data);

}


/* ============================================================
   REGISTRATION UI HELPER
   ============================================================ */

/**
 * Display registration errors.
 *
 * UI-specific styling can be connected later.
 *
 * @param {Array|string} errors
 */
function showRegistrationErrors(errors) {

    const message =
        Array.isArray(errors)
            ? errors.join("\n")
            : String(errors || "Registration failed.");


    console.warn(
        "KEDU Registration:",
        message
    );

}


/* ============================================================
   REGISTRATION FORM AUTO CONNECTION
   ============================================================ */

/**
 * Connect a future registration form if it exists.
 *
 * Expected ID:
 * registration-form
 */
function initKeduRegistration() {

    const form =
        document.getElementById(
            "registration-form"
        );


    /*
     * Registration UI does not exist yet.
     * This is completely normal.
     */
    if (!form) {

        return;

    }


    /*
     * Prevent duplicate event listeners.
     */
    if (
        form.dataset.keduRegistrationReady ===
        "true"
    ) {

        return;

    }


    form.dataset.keduRegistrationReady =
        "true";


    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const result =
                await handleKeduRegistrationForm(
                    form
                );


            if (!result.success) {

                showRegistrationErrors(
                    result.message
                );

                return;

            }


            /*
             * Future success handling:
             *
             * - show verification screen
             * - OTP verification
             * - create/login session
             * - load user profile
             *
             * These will be connected when
             * the backend authentication system
             * is implemented.
             */

            console.log(
                "KEDU: Registration successful.",
                result.data
            );

        }
    );

}


/* ============================================================
   INITIALIZE
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initKeduRegistration
    );

} else {

    initKeduRegistration();

}


/* ============================================================
   PUBLIC API
   ============================================================ */

window.KEDU_REGISTRATION = {

    register:
        registerKeduUser,

    validate:
        validateRegistrationData,

    validateEmail:
        isValidEmail,

    validatePhone:
        isValidPhone,

    init:
        initKeduRegistration

};
