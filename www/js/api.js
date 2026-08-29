/*
============================================================
KEDU ACADEMY
API CONNECTION
============================================================

Purpose:
- Central connection between KEDU PW APK and backend.
- APK does NOT store educational content locally.
- Lecture metadata comes from backend.
- Videos, PDFs and thumbnails come from R2 through
  backend-generated URLs.

IMPORTANT:
- Do NOT put Cloudflare R2 secret keys here.
- Do NOT put database credentials here.
- Do NOT upload private R2 credentials into the APK.
- Only the public/backend API base URL belongs here.
============================================================
*/


/* ==========================================================
   API CONFIGURATION
========================================================== */

const KEDU_API_CONFIG = {

    /*
     * Replace this later with your real backend URL.
     *
     * Example:
     * https://api.kedu.example
     */
    BASE_URL: "",

    /*
     * API request timeout.
     */
    TIMEOUT: 15000,

    /*
     * API version.
     */
    VERSION: "v1"

};


/* ==========================================================
   API ERROR
========================================================== */

class KeduApiError extends Error {

    constructor(message, status = 0, data = null) {

        super(message);

        this.name = "KeduApiError";

        this.status = status;

        this.data = data;

    }

}


/* ==========================================================
   BUILD API URL
========================================================== */

function keduApiUrl(path = "") {

    const baseUrl =
        String(KEDU_API_CONFIG.BASE_URL || "")
            .replace(/\/+$/, "");

    const cleanPath =
        String(path || "")
            .replace(/^\/+/, "");

    if (!baseUrl) {

        throw new KeduApiError(
            "KEDU backend URL is not configured."
        );

    }

    return `${baseUrl}/api/${KEDU_API_CONFIG.VERSION}/${cleanPath}`;

}


/* ==========================================================
   REQUEST TIMEOUT
========================================================== */

function keduTimeoutSignal(timeout) {

    if (typeof AbortController === "undefined") {

        return {
            signal: undefined,
            cancel: () => {}
        };

    }

    const controller =
        new AbortController();

    const timer =
        setTimeout(
            () => controller.abort(),
            timeout
        );

    return {

        signal: controller.signal,

        cancel: () => clearTimeout(timer)

    };

}


/* ==========================================================
   GENERIC API REQUEST
========================================================== */

async function keduApiRequest(
    path,
    options = {}
) {

    const url =
        keduApiUrl(path);

    const {

        method = "GET",

        body = null,

        headers = {},

        timeout =
            KEDU_API_CONFIG.TIMEOUT

    } = options;


    const requestHeaders = {

        Accept: "application/json",

        ...headers

    };


    let requestBody = body;


    /*
     * Automatically convert normal JS objects
     * into JSON.
     */

    if (
        body !== null &&
        typeof body === "object" &&
        !(body instanceof FormData) &&
        !(body instanceof Blob)
    ) {

        requestHeaders["Content-Type"] =
            "application/json";

        requestBody =
            JSON.stringify(body);

    }


    /*
     * Add authentication token when available.
     *
     * The token itself will be managed by auth.js.
     */

    try {

        const token =
            localStorage.getItem(
                "kedu_access_token"
            );

        if (token) {

            requestHeaders.Authorization =
                `Bearer ${token}`;

        }

    } catch (error) {

        console.warn(
            "KEDU: Unable to read access token.",
            error
        );

    }


    const timeoutControl =
        keduTimeoutSignal(timeout);


    try {

        const response =
            await fetch(

                url,

                {

                    method,

                    headers: requestHeaders,

                    body: requestBody,

                    signal:
                        timeoutControl.signal

                }

            );


        const contentType =
            response.headers.get(
                "content-type"
            ) || "";


        let responseData;


        if (
            contentType.includes(
                "application/json"
            )
        ) {

            responseData =
                await response.json();

        } else {

            responseData =
                await response.text();

        }


        if (!response.ok) {

            let message =
                `KEDU API request failed (${response.status}).`;


            if (
                responseData &&
                typeof responseData === "object"
            ) {

                message =
                    responseData.message ||
                    responseData.error ||
                    message;

            }


            throw new KeduApiError(

                message,

                response.status,

                responseData

            );

        }


        return responseData;


    } catch (error) {

        if (
            error &&
            error.name === "AbortError"
        ) {

            throw new KeduApiError(
                "KEDU API request timed out."
            );

        }


        if (
            error instanceof KeduApiError
        ) {

            throw error;

        }


        throw new KeduApiError(

            "Unable to connect to KEDU backend.",

            0,

            error

        );


    } finally {

        timeoutControl.cancel();

    }

}


/* ==========================================================
   GET
========================================================== */

async function keduApiGet(
    path,
    options = {}
) {

    return keduApiRequest(

        path,

        {

            ...options,

            method: "GET"

        }

    );

}


/* ==========================================================
   POST
========================================================== */

async function keduApiPost(
    path,
    body = null,
    options = {}
) {

    return keduApiRequest(

        path,

        {

            ...options,

            method: "POST",

            body

        }

    );

}


/* ==========================================================
   PUT
========================================================== */

async function keduApiPut(
    path,
    body = null,
    options = {}
) {

    return keduApiRequest(

        path,

        {

            ...options,

            method: "PUT",

            body

        }

    );

}


/* ==========================================================
   DELETE
========================================================== */

async function keduApiDelete(
    path,
    options = {}
) {

    return keduApiRequest(

        path,

        {

            ...options,

            method: "DELETE"

        }

    );

}


/* ==========================================================
   HEALTH CHECK
========================================================== */

async function keduBackendHealth() {

    return keduApiGet(
        "health"
    );

}


/* ==========================================================
   CONTENT API
========================================================== */

/*
 * These functions are intentionally generic.
 *
 * The final backend structure will define the exact
 * endpoints later.
 */


async function keduGetClasses() {

    return keduApiGet(
        "classes"
    );

}


async function keduGetBatches() {

    return keduApiGet(
        "batches"
    );

}


async function keduGetSubjects(
    classId,
    batchId = null
) {

    const params =
        new URLSearchParams();


    if (classId !== undefined && classId !== null) {

        params.set(
            "classId",
            String(classId)
        );

    }


    if (batchId !== undefined && batchId !== null) {

        params.set(
            "batchId",
            String(batchId)
        );

    }


    const query =
        params.toString();


    return keduApiGet(

        query
            ? `subjects?${query}`
            : "subjects"

    );

}


async function keduGetChapters(
    subjectId
) {

    const params =
        new URLSearchParams({

            subjectId:
                String(subjectId)

        });


    return keduApiGet(
        `chapters?${params.toString()}`
    );

}


async function keduGetLectures(
    subjectId,
    chapterId
) {

    const params =
        new URLSearchParams({

            subjectId:
                String(subjectId),

            chapterId:
                String(chapterId)

        });


    return keduApiGet(
        `lectures?${params.toString()}`
    );

}


/* ==========================================================
   SINGLE LECTURE
========================================================== */

async function keduGetLecture(
    lectureId
) {

    return keduApiGet(

        `lectures/${encodeURIComponent(
            lectureId
        )}`

    );

}


/* ==========================================================
   LECTURE MEDIA
========================================================== */

/*
 * The backend will return R2/CDN URLs.
 *
 * Example response concept:
 *
 * {
 *   thumbnail: "...",
 *   video: "...",
 *   hls: "...",
 *   download: "...",
 *   notes: "..."
 * }
 *
 * No actual educational file is stored in the APK.
 */

async function keduGetLectureMedia(
    lectureId
) {

    return keduApiGet(

        `lectures/${encodeURIComponent(
            lectureId
        )}/media`

    );

}


/* ==========================================================
   EXPORT TO WINDOW
========================================================== */

window.KEDU_API_CONFIG =
    KEDU_API_CONFIG;

window.KeduApiError =
    KeduApiError;

window.keduApiUrl =
    keduApiUrl;

window.keduApiRequest =
    keduApiRequest;

window.keduApiGet =
    keduApiGet;

window.keduApiPost =
    keduApiPost;

window.keduApiPut =
    keduApiPut;

window.keduApiDelete =
    keduApiDelete;

window.keduBackendHealth =
    keduBackendHealth;

window.keduGetClasses =
    keduGetClasses;

window.keduGetBatches =
    keduGetBatches;

window.keduGetSubjects =
    keduGetSubjects;

window.keduGetChapters =
    keduGetChapters;

window.keduGetLectures =
    keduGetLectures;

window.keduGetLecture =
    keduGetLecture;

window.keduGetLectureMedia =
    keduGetLectureMedia;


/* ==========================================================
   READY MESSAGE
========================================================== */

console.log(
    "KEDU: API module loaded."
);
