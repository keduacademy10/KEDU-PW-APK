/* =========================================================
   KEDU ACADEMY
   DOWNLOAD SYSTEM
   VERSION 4.0
   ========================================================= */

(function () {

    "use strict";


    /* =========================================================
       DOWNLOAD FILTER ORDER
       ========================================================= */

    const DOWNLOAD_FILTER_ORDER = [

    "lecture",

    "lecture-notes",

    "short-notes",

    "dpp",

    "formula-sheet",

    "mind-map",

    "pyqs",

    "ncert-solution",

    "ncert-exemplar-solution"

];

    /* =========================================================
       STATE
       ========================================================= */

    let currentDownloadFilter = "lecture";

    let previousPageId = "home";

    let downloadPageIsOpen = false;

/*
 * Keeps the currently opened three-dot menu
 * alive when download progress re-renders
 * the download cards.
 */
let openDownloadMenuLectureId = null;
/* ===================================================== */
/* KEDU DOWNLOAD MANAGER                                  */
/* ===================================================== */

const KEDU_DOWNLOAD_API =
    window.KEDU_DOWNLOAD_API ||
    "/api/downloads/prepare";
/* ===================================================== */
/* TEMPORARY DEMO DOWNLOAD MODE                          */
/* Set false when backend download API is ready.         */
/* ===================================================== */

const KEDU_DEMO_DOWNLOAD = true;
const KEDU_DOWNLOAD_CACHE =
    "kedu-academy-downloads-v1";
/* ===================================================== */
/* TEMPORARY PDF TEST MODE                               */
/* REMOVE AFTER BACKEND CONNECTION                       */
/* ===================================================== */

const KEDU_TEST_PDF_MODE = true;

const KEDU_TEST_PDF_PATH =
    "assets/pdf/lecture-notes/lecture-notes.pdf";
const KEDU_DOWNLOAD_META_KEY =
    "keduDownloadedLectures";
/* ===================================================== */
/* PDF ATTACHMENT DOWNLOAD METADATA                      */
/* ===================================================== */

const KEDU_PDF_DOWNLOAD_META_KEY =
    "keduDownloadedPdfAttachments";    
const KEDU_DEMO_DOWNLOAD_TIMERS =
    new Map();

/* ===================================================== */
/* DOWNLOAD METADATA                                      */
/* ===================================================== */

function getDownloadedLectures(){

    try{

        const data =
            localStorage.getItem(
                KEDU_DOWNLOAD_META_KEY
            );

        const parsed =
            data
                ? JSON.parse(data)
                : [];

        return Array.isArray(parsed)
            ? parsed
            : [];

    }
    catch(error){

        console.error(
            "KEDU Download Metadata Error:",
            error
        );

        return [];

    }

}


function saveDownloadedLectures(
    downloads
){

    localStorage.setItem(
        KEDU_DOWNLOAD_META_KEY,
        JSON.stringify(
            downloads
        )
    );

}

/* ===================================================== */
/* PDF ATTACHMENT DOWNLOAD STORAGE                      */
/* ===================================================== */

function getDownloadedPdfAttachments(){

    try{

        const data =
            localStorage.getItem(
                KEDU_PDF_DOWNLOAD_META_KEY
            );


        const parsed =
            data
                ? JSON.parse(data)
                : [];


        if(
            !Array.isArray(parsed)
        ){

            return [];

        }


        /*
         * Repair older PDF downloads.
         *
         * Older records were saved with:
         *
         * materialType: "pdf"
         *
         * But attachmentId contains
         * the actual material category.
         */

        let changed =
            false;


        const repaired =
            parsed.map(
                item => {

                    if(
                        item &&
                        (
                            !item.materialType ||
                            item.materialType ===
                                "pdf"
                        ) &&
                        item.attachmentId
                    ){

                        const attachmentId =
                            String(
                                item.attachmentId
                            );


                        const validTypes = [

                            "lecture-notes",
                            "short-notes",
                            "dpp",
                            "formula-sheet",
                            "mind-map",
                            "pyqs",
                            "practice-sheet",
                            "ncert-solution",
                            "ncert-exemplar"

                        ];


                        const storedType =
    normalizePdfMaterialType(
        item
    );


if(
    storedType
){

                            changed =
                                true;


                            return {

                                ...item,

                                materialType:
    storedType,
                                type:
                                    "pdf"

                            };

                        }

                    }


                    return item;

                }
            );


        if(changed){

            localStorage.setItem(
                KEDU_PDF_DOWNLOAD_META_KEY,
                JSON.stringify(
                    repaired
                )
            );

        }


        return repaired;

    }
    catch(error){

        console.error(
            "KEDU PDF Download Metadata Error:",
            error
        );


        return [];

    }

}


function saveDownloadedPdfAttachments(
    downloads
){

    localStorage.setItem(
        KEDU_PDF_DOWNLOAD_META_KEY,
        JSON.stringify(
            downloads
        )
    );

}

/* =========================================================
   NORMALIZE PDF MATERIAL TYPE
   ========================================================= */

function normalizePdfMaterialType(item){

    if(!item){
        return "";
    }

    let type =
        item.materialType ||
        item.attachmentType ||
        item.materialTypeId ||
        item.kind ||
        item.category ||
        "";

    type =
        String(type)
            .trim()
            .toLowerCase()
            .replace(/_/g, "-")
            .replace(/\s+/g, "-");

    const aliases = {

        "lecture-note":
            "lecture-notes",

        "lecture-notes":
            "lecture-notes",

        "lecturenotes":
            "lecture-notes",

        "short-note":
            "short-notes",

        "short-notes":
            "short-notes",

        "shortnotes":
            "short-notes",

        "dpp":
            "dpp",

        "formula":
            "formula-sheet",

        "formula-sheet":
            "formula-sheet",

        "mindmap":
            "mind-map",

        "mind-map":
            "mind-map",

        "pyq":
            "pyqs",

        "pyqs":
            "pyqs",

        "ncert-solution":
            "ncert-solution",

        "ncert-exemplar":
            "ncert-exemplar-solution",

        "ncert-exemplar-solution":
            "ncert-exemplar-solution"
    };

    return aliases[type] || "";
}
function isPdfAttachmentDownloaded(
    attachmentId
){

    if(!attachmentId){
        return false;
    }

    return getDownloadedPdfAttachments()
        .some(
            item =>
                String(item.attachmentId) ===
                String(attachmentId) &&
                item.status ===
                "completed"
        );

}
/* ===================================================== */
/* CHECK DOWNLOAD                                        */
/* ===================================================== */

function isLectureDownloaded(
    lectureId
){

    if(!lectureId){

        return false;

    }


    return getDownloadedLectures()
        .some(
            item =>
                String(item.lectureId) ===
                String(lectureId) &&
                item.status ===
                    "completed"
        );

}
/* ===================================================== */
/* GET DOWNLOADED VIDEO URL                              */
/* ===================================================== */

async function getDownloadedVideoUrl(
    lectureId
){

    if(!lectureId){

        return "";

    }


    const item =
        getDownloadedLectures()
            .find(
                download =>
                    String(
                        download.lectureId
                    ) ===
                    String(
                        lectureId
                    ) &&
                    download.status ===
                        "completed"
            );


    if(!item){

        return "";

    }


    /*
     * First try the real downloaded file
     * stored inside the browser Cache API.
     */
    if(
        "caches" in window &&
        item.cacheKey
    ){

        try{

            const cache =
                await caches.open(
                    KEDU_DOWNLOAD_CACHE
                );


            const response =
                await cache.match(
                    item.cacheKey
                );


            if(response){

                const blob =
                    await response.blob();


                return URL.createObjectURL(
                    blob
                );

            }

        }
        catch(error){

            console.warn(
                "KEDU: Unable to load cached lecture:",
                error
            );

        }

    }


    /*
     * Demo-download fallback.
     *
     * In demo mode the actual video is not
     * downloaded into Cache Storage.
     * The original demo video is used only
     * for testing the player functionality.
     */
    if(
        KEDU_DEMO_DOWNLOAD &&
        item.videoUrl
    ){

        return item.videoUrl;

    }


    return "";

}

/* ===================================================== */
/* GET DOWNLOAD CACHE KEY                                 */
/* ===================================================== */

function getLectureCacheKey(
    lectureId,
    quality
){

    return (
        location.origin +
        "/__kedu_downloads__/" +
        encodeURIComponent(
            String(lectureId)
        ) +
        "/" +
        encodeURIComponent(
            String(quality)
        ) +
        ".mp4"
    );

}




/* ===================================================== */
/* GET SERVER DOWNLOAD URL                                */
/* ===================================================== */

async function getServerDownloadUrl(
    lecture,
    quality
){
    /* ================================================= */
    /* TEMPORARY DEMO DOWNLOAD                           */
    /* Uses the lecture's local demo video.              */
    /* ================================================= */

    if(
        KEDU_DEMO_DOWNLOAD &&
        lecture &&
        lecture.video
    ){

        return {

            url:
                lecture.video,

            fileName:
                (
                    lecture.title ||
                    "KEDU-Lecture"
                ) + ".mp4",

            mimeType:
                "video/mp4"

        };

    }
    if(
        !lecture ||
        !lecture.id
    ){

        throw new Error(
            "Invalid lecture"
        );

    }


    if(!quality){

        throw new Error(
            "Download quality is missing"
        );

    }


    let response;

    try{

        response =
            await fetch(
                KEDU_DOWNLOAD_API,
                {
                    method:
                        "POST",

                    credentials:
                        "include",

                    headers:{
                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            lectureId:
                                String(
                                    lecture.id
                                ),

                            quality:
                                String(
                                    quality
                                )

                        })
                }
            );

    }

    catch(error){

        console.error(
            "KEDU Download API Network Error:",
            error
        );

        throw new Error(
            "Cannot connect to download server"
        );

    }


    let data = null;

    const responseText =
        await response.text();


    try{

        data =
            responseText
                ? JSON.parse(
                    responseText
                )
                : null;

    }

    catch(error){

        console.error(
            "KEDU Download API Invalid JSON:",
            responseText
        );

        throw new Error(
            "Download server returned invalid response"
        );

    }


    if(!response.ok){

        console.error(
            "KEDU Download API HTTP Error:",
            response.status,
            data
        );

        throw new Error(
            data?.message ||
            data?.error ||
            (
                "Download server error (" +
                response.status +
                ")"
            )
        );

    }


    const downloadUrl =
        data?.downloadUrl ||
        data?.url;


    if(
        !data ||
        data.success !== true ||
        !downloadUrl
    ){

        console.error(
            "KEDU Download API Response:",
            data
        );

        throw new Error(
            data?.message ||
            data?.error ||
            "Server did not provide download URL"
        );

    }


    return {

        url:
            String(
                downloadUrl
            ),

        fileName:
            data.fileName ||
            (
                lecture.title ||
                "KEDU-Lecture"
            ),

        mimeType:
            data.mimeType ||
            "video/mp4"

    };

}

/* ===================================================== */
/* DEMO DOWNLOAD HELPERS                                  */
/* ===================================================== */

function updateDownloadRecord(
    lectureId,
    patch
){

    const downloads =
        getDownloadedLectures();

    const index =
        downloads.findIndex(
            item =>
                String(item.lectureId) ===
                String(lectureId)
        );

    if(index === -1){
        return null;
    }

    downloads[index] = {
        ...downloads[index],
        ...patch
    };

    saveDownloadedLectures(
        downloads
    );

    renderDownloadResources();

    return downloads[index];

}


function clearDemoDownloadTimer(
    lectureId
){

    const timer =
        KEDU_DEMO_DOWNLOAD_TIMERS.get(
            String(lectureId)
        );

    if(timer){
        clearInterval(timer);
    }

    KEDU_DEMO_DOWNLOAD_TIMERS.delete(
        String(lectureId)
    );

}


function simulateDemoDownload(
    lecture,
    quality
){

    const lectureId =
        String(lecture.id);

    clearDemoDownloadTimer(
        lectureId
    );

    let progress =
        Number(
            getDownloadedLectures()
                .find(
                    item =>
                        String(item.lectureId) ===
                        lectureId
                )?.progress || 0
        );

    updateDownloadRecord(
        lectureId,
        {
            quality:String(quality),
            status:"downloading",
            progress:Math.min(
                99,
                Math.max(0, progress)
            )
        }
    );

    const timer =
        setInterval(
            () => {

                const current =
                    getDownloadedLectures()
                        .find(
                            item =>
                                String(item.lectureId) ===
                                lectureId
                        );

                if(
                    !current ||
                    current.status !==
                    "downloading"
                ){

                    clearDemoDownloadTimer(
                        lectureId
                    );

                    return;
                }

                progress =
                    Math.min(
                        100,
                        progress +
                        Math.floor(
                            Math.random() * 4
                        ) + 2
                    );

                if(progress >= 100){

                    clearDemoDownloadTimer(
                        lectureId
                    );

                    updateDownloadRecord(
                        lectureId,
                        {
                            status:"completed",
                            progress:100,
                            downloadedAt:
                                new Date().toISOString()
                        }
                    );

                    showDownloadToast(
                        "Lecture Downloaded Successfully"
                    );

                    document.dispatchEvent(
                        new CustomEvent(
                            "kedu-lecture-download-complete",
                            {
                                detail:{
                                    lecture:lecture,
                                    quality:
                                        String(quality)
                                }
                            }
                        )
                    );

                    return;
                }

                updateDownloadRecord(
                    lectureId,
                    {
                        status:"downloading",
                        progress:progress
                    }
                );

            },
            500
        );

    KEDU_DEMO_DOWNLOAD_TIMERS.set(
        lectureId,
        timer
    );

}


function toggleDemoDownloadPause(
    lectureId
){

    const item =
        getDownloadedLectures()
            .find(
                download =>
                    String(
                        download.lectureId
                    ) ===
                    String(lectureId)
            );

    if(!item){
        return;
    }

    if(
        item.status ===
        "downloading"
    ){

        clearDemoDownloadTimer(
            lectureId
        );

        updateDownloadRecord(
            lectureId,
            {
                status:"paused"
            }
        );

        showDownloadToast(
            "Download Paused"
        );

        return;
    }

    if(
        item.status ===
        "paused"
    ){

        showDownloadToast(
            "Download Resumed"
        );

        const lecture = {

            id:item.lectureId,

            title:item.title,

            thumbnail:item.thumbnail,

            channel:item.channel,

            uploadedDate:item.uploadedDate

        };

        simulateDemoDownload(
            lecture,
            item.quality
        );
    }

}

/* ===================================================== */
/* START PDF ATTACHMENT DOWNLOAD                         */
/* ===================================================== */

async function startPdfAttachmentDownload(
    attachment
){

    if(!attachment){
        return;
    }

    /* -----------------------------------------------------
   BASIC PDF INFORMATION
   ----------------------------------------------------- */

const baseAttachmentId =
    String(
        attachment.id ||
        attachment.file ||
        attachment.url ||
        attachment.path ||
        `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`
    );


const title =
    attachment.title ||
    attachment.name ||
    "KEDU PDF";


/* -----------------------------------------------------
   RESOLVE MATERIAL TYPE
   ----------------------------------------------------- */

let resolvedMaterialType =
    normalizePdfMaterialType(
        attachment
    );


if(!resolvedMaterialType){

    const rawType =
        String(
            attachment.type ||
            attachment.resourceType ||
            attachment.downloadType ||
            attachment.filter ||
            attachment.category ||
            ""
        )
        .trim()
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/\s+/g, "-");


    resolvedMaterialType =
        normalizePdfMaterialType({
            materialType:
                rawType
        });

}


/*
 * NEVER guess a category.
 */
if(!resolvedMaterialType){

    console.error(
        "KEDU: PDF material category missing.",
        attachment
    );

    showDownloadToast(
        "PDF Category Missing",
        "error"
    );

    return;
}


/* -----------------------------------------------------
   CATEGORY-SCOPED PDF ID
   ----------------------------------------------------- */

const attachmentId =
    `${resolvedMaterialType}::${baseAttachmentId}`;
    /* -----------------------------------------------------
       PREVENT DUPLICATE DOWNLOAD
       ----------------------------------------------------- */

    if(
        isPdfAttachmentDownloaded(
            attachmentId
        )
    ){

        showDownloadToast(
            "PDF Already Downloaded",
            "warning"
        );

        setDownloadFilter(
            resolvedMaterialType,
            false
        );

        return;
    }


    /* -----------------------------------------------------
       PDF FILE LOCATION
       ----------------------------------------------------- */

    const pdfPath =
        KEDU_TEST_PDF_MODE
            ?
            KEDU_TEST_PDF_PATH
            :
            (
                attachment.file ||
                attachment.url ||
                attachment.path ||
                attachment.pdf ||
                attachment.src ||
                `assets/pdf/${attachmentId}/${attachmentId}.pdf`
            );


    showDownloadToast(
        "Download Started",
        "success"
    );


    try{

        /* -------------------------------------------------
           FETCH PDF
           ------------------------------------------------- */

        const response =
            await fetch(
                pdfPath,
                {
                    credentials:
                        "same-origin"
                }
            );


        if(!response.ok){

            throw new Error(
                "PDF file could not be downloaded."
            );

        }


        const blob =
            await response.blob();


        /* -------------------------------------------------
           CACHE PDF
           ------------------------------------------------- */

        const cacheKey =
            location.origin +
            "/__kedu_pdf_downloads__/" +
            encodeURIComponent(
                attachmentId
            ) +
            ".pdf";


        if("caches" in window){

            const cache =
                await caches.open(
                    KEDU_DOWNLOAD_CACHE
                );


            await cache.put(
                cacheKey,
                new Response(
                    blob,
                    {
                        headers:{
                            "Content-Type":
                                blob.type ||
                                "application/pdf"
                        }
                    }
                )
            );

        }


        /* -------------------------------------------------
           GET EXISTING PDF DOWNLOADS
           ------------------------------------------------- */

        const downloads =
            getDownloadedPdfAttachments();


        /*
         * Remove an old record for the same PDF.
         */
        const remaining =
            downloads.filter(
                item =>
                    String(
                        item.attachmentId
                    ) !==
                    attachmentId
            );


        /* -------------------------------------------------
           CREATE ONE COMPLETED PDF RECORD
           ------------------------------------------------- */

        const completedPdfDownload = {

            attachmentId:
                attachmentId,

            attachmentType:
                resolvedMaterialType,

            materialType:
                resolvedMaterialType,

            title:
                title,

            type:
                "pdf",

            file:
                pdfPath,

            cacheKey:
                cacheKey,

            status:
                "completed",

            progress:
                100,

            downloadedAt:
                new Date().toISOString()

        };


        /* -------------------------------------------------
           SAVE PDF DOWNLOAD
           ------------------------------------------------- */

        remaining.push(
            completedPdfDownload
        );


        saveDownloadedPdfAttachments(
            remaining
        );


        /*
         * IMPORTANT:
         * Select Lecture Notes BEFORE rendering.
         */
        setDownloadFilter(
            resolvedMaterialType,
            false
        );


        /*
         * Render the card after the correct
         * filter is selected.
         */
        renderDownloadResources();


        showDownloadToast(
            `${title} Downloaded Successfully`,
            "success"
        );


        /* -------------------------------------------------
           NOTIFY OTHER KEDU MODULES
           ------------------------------------------------- */

        document.dispatchEvent(
            new CustomEvent(
                "kedu-pdf-download-complete",
                {
                    detail:{
                        attachment:
                            attachment,

                        materialType:
                            resolvedMaterialType
                    }
                }
            )
        );


        console.log(
            "KEDU: PDF Downloaded Successfully:",
            {
                title:
                    title,

                materialType:
                    resolvedMaterialType,

                attachmentId:
                    attachmentId
            }
        );

        return;

    }
    catch(error){

        console.error(
            "KEDU PDF Download Error:",
            error?.message ||
            error
        );

        console.error(
            "KEDU PDF Download Error Object:",
            error
        );


        showDownloadToast(
            "PDF Download Failed",
            "error"
        );

    }

}

                                
        

        


     /* ===================================================== */

/* START LECTURE DOWNLOAD                                */
/* ===================================================== */

async function startLectureDownload(
    lecture,
    quality
){

    if(
        !lecture ||
        !lecture.id
    ){

        throw new Error(
            "Invalid lecture"
        );

    }


    if(
        isLectureDownloaded(
            lecture.id
        )
    ){

        showDownloadToast(
            "Lecture Already Downloaded"
        );

        return;

    }


    const downloads =
        getDownloadedLectures();


    /*
     * Remove previous incomplete
     * record for this lecture.
     */

    const cleanDownloads =
        downloads.filter(
            item =>
                String(item.lectureId) !==
                String(lecture.id)
        );


cleanDownloads.push({

    lectureId:
        String(lecture.id),

    /*
     * Keep enough lecture information so a
     * downloaded lecture can be opened directly
     * from the Downloads page.
     */
    lectureData: {
        id:
            String(lecture.id),

        number:
            lecture.number || "",

        title:
            lecture.title ||
            "Lecture",

        thumbnail:
            lecture.thumbnail ||
            "",

        duration:
            lecture.duration ||
            "",

        uploadedDate:
            lecture.uploadedDate ||
            lecture.uploadDate ||
            lecture.date ||
            "",

        video:
            lecture.video ||
            "",

        videoSources:
            lecture.videoSources ||
            {},

        hls:
            lecture.hls ||
            "",

        description:
            lecture.description ||
            "",

        notes:
            lecture.notes ||
            "",

        captions:
            lecture.captions ||
            {},

        channel:
            lecture.channel ||
            "KEDU Academy",

        logo:
            lecture.logo ||
            "assets/logo/kedu-logo.png"
    },

    /*
     * Used by demo download mode.
     * Real downloads use the Cache API below.
     */
    videoUrl:
        KEDU_DEMO_DOWNLOAD
            ? (
                lecture.video ||
                ""
            )
            : "",

    title:
        lecture.title ||
        "Lecture",
        thumbnail:
            lecture.thumbnail ||
            "",

        channel:
            lecture.channel ||
            "KEDU Academy",

        uploadedDate:
            lecture.uploadedDate ||
            lecture.uploadDate ||
            lecture.date ||
            "",

        quality:
            String(quality),

        type:
            "lecture",

status:
    "downloading",

progress:
    0,

downloadedAt:
            new Date().toISOString(),

        cacheKey:
            getLectureCacheKey(
                lecture.id,
                quality
            )

    });


    saveDownloadedLectures(
        cleanDownloads
    );


    renderDownloadResources();
/* ================================================= */
/* DEMO MODE: NO REAL VIDEO IS DOWNLOADED            */
/* ================================================= */

if(KEDU_DEMO_DOWNLOAD){

    simulateDemoDownload(
        lecture,
        quality
    );

    return;

}

    try{

        /*
         * Server decides/generates
         * the requested quality.
         */

        const serverFile =
            await getServerDownloadUrl(
                lecture,
                quality
            );


const downloadUrl =
    new URL(
        serverFile.url,
        window.location.href
    );

const sameOrigin =
    downloadUrl.origin ===
    window.location.origin;


const response =
    await fetch(
        downloadUrl.href,
        {
            credentials:
                sameOrigin
                    ? "include"
                    : "omit",

            mode:
                "cors"
        }
    );


if(
    !response.ok
){

    throw new Error(
        "Video download failed (" +
        response.status +
        ")"
    );

}

        if(
            !("caches" in window)
        ){

            throw new Error(
                "Browser storage is unavailable"
            );

        }


        const cache =
            await caches.open(
                KEDU_DOWNLOAD_CACHE
            );


        const cacheKey =
            getLectureCacheKey(
                lecture.id,
                quality
            );


        await cache.put(
            cacheKey,
            response.clone()
        );


        const completed =
            getDownloadedLectures()
                .filter(
                    item =>
                        String(
                            item.lectureId
                        ) !==
                        String(
                            lecture.id
                        )
                );


        completed.push({

            lectureId:
                String(lecture.id),

            title:
                lecture.title ||
                "Lecture",

            thumbnail:
                lecture.thumbnail ||
                "",

            channel:
                lecture.channel ||
                "KEDU Academy",

            uploadedDate:
                lecture.uploadedDate ||
                lecture.uploadDate ||
                lecture.date ||
                "",

            quality:
                String(quality),

            type:
                "lecture",

            status:
                "completed",

            downloadedAt:
                new Date().toISOString(),

            cacheKey:
                cacheKey

        });


        saveDownloadedLectures(
            completed
        );


        renderDownloadResources();


        showDownloadToast(
            "Lecture Downloaded Successfully"
        );


        document.dispatchEvent(
            new CustomEvent(
                "kedu-lecture-download-complete",
                {
                    detail:{
                        lecture:
                            lecture,

                        quality:
                            String(
                                quality
                            )
                    }
                }
            )
        );


    }
catch(error){

    console.error(
        "KEDU Download Error:",
        error?.message ||
        error
    );

    console.error(
        "KEDU Download Error Object:",
        error
    );


        const failed =
            getDownloadedLectures()
                .filter(
                    item =>
                        String(
                            item.lectureId
                        ) !==
                        String(
                            lecture.id
                        )
                );


        saveDownloadedLectures(
            failed
        );


        renderDownloadResources();


        throw error;

    }

}


/* ===================================================== */
/* DELETE DOWNLOADED LECTURE                              */
/* ===================================================== */

async function deleteDownloadedLecture(
    lectureId
){

    const downloads =
        getDownloadedLectures();


    const item =
        downloads.find(
            download =>
                String(
                    download.lectureId
                ) ===
                String(
                    lectureId
                )
        );


    if(!item){

        return;

    }
if(
    openDownloadMenuLectureId ===
    String(lectureId)
){

    openDownloadMenuLectureId =
        null;

}

    try{

        if(
            "caches" in window &&
            item.cacheKey
        ){

            const cache =
                await caches.open(
                    KEDU_DOWNLOAD_CACHE
                );


            await cache.delete(
                item.cacheKey
            );

        }

    }
    catch(error){

        console.warn(
            "KEDU Cache Delete:",
            error
        );

    }


    const remaining =
        downloads.filter(
            download =>
                String(
                    download.lectureId
                ) !==
                String(
                    lectureId
                )
        );


    saveDownloadedLectures(
        remaining
    );


    renderDownloadResources();


    document.dispatchEvent(
        new CustomEvent(
            "kedu-lecture-download-deleted",
            {
                detail:{
                    lectureId:
                        String(
                            lectureId
                        )
                }
            }
        )
    );


showDownloadToast(
    "Download Removed Successfully",
    "error"
);
}

/* ===================================================== */
/* DELETE DOWNLOADED PDF                                 */
/* ===================================================== */

async function deleteDownloadedPdf(
    attachmentId
){

    if(!attachmentId){
        return;
    }


    const downloads =
        getDownloadedPdfAttachments();


    const item =
        downloads.find(
            download =>
                String(
                    download.attachmentId
                ) ===
                String(
                    attachmentId
                )
        );


    if(!item){
        return;
    }


    try{

        if(
            "caches" in window &&
            item.cacheKey
        ){

            const cache =
                await caches.open(
                    KEDU_DOWNLOAD_CACHE
                );


            await cache.delete(
                item.cacheKey
            );

        }

    }
    catch(error){

        console.warn(
            "KEDU PDF Cache Delete:",
            error
        );

    }


    const remaining =
        downloads.filter(
            download =>
                String(
                    download.attachmentId
                ) !==
                String(
                    attachmentId
                )
        );


    saveDownloadedPdfAttachments(
        remaining
    );


    renderDownloadResources();


    showDownloadToast(
        "Download Removed Successfully",
        "error"
    );

}
/* ===================================================== */
/* DOWNLOAD TOAST                                        */
/* ===================================================== */

function showDownloadToast(
    message,
    type = "success"
){

    if(
        typeof showToast ===
        "function"
    ){

        showToast(
            message,
            type
        );

        return;

    }


    console.log(
        "KEDU Download:",
        message,
        type
    );

}


    let pageSwipeTracking = false;

    let pageSwipeStartX = 0;

    let pageSwipeStartY = 0;

    let filterTouchActive = false;


    /* =========================================================
       ELEMENTS
       ========================================================= */

    const downloadPage =
        document.getElementById(
            "download-page"
        );


    const downloadBackBtn =
        document.getElementById(
            "download-back-btn"
        );


    const filterContainer =
        document.getElementById(
            "download-filter-chips"
        );


    function normalizeDownloadFilter(filter){

    filter =
        String(
            filter || ""
        )
        .trim()
        .toLowerCase();


    /*
     * KEDU PW uses the complete
     * NCERT Exemplar Solution name.
     */

    if(
        filter ===
        "ncert-exemplar"
        ||
        filter ===
        "ncert-exampler"
        ||
        filter ===
        "ncert-exampler-solution"
    ){

        return "ncert-exemplar-solution";

    }


    /*
     * Books are not part of
     * KEDU PW Download.
     */

    if(
        filter === "books"
    ){

        return "lecture";

    }


    if(
        !DOWNLOAD_FILTER_ORDER.includes(
            filter
        )
    ){

        return "lecture";

    }


    return filter;

}
  /* =========================================================
   CREATE DOWNLOAD FILTER PILLS
   ========================================================= */

function ensureDownloadFilterChips(){

    const container =
        document.getElementById(
            "download-filter-chips"
        );

    if(!container){
        return;
    }


    const filterLabels = {

        "lecture":
            "Lecture",

        "lecture-notes":
            "Lecture Notes",

        "short-notes":
            "Short Notes",

        "dpp":
            "DPP",

        "formula-sheet":
            "Formula Sheet",

        "mind-map":
            "Mind Map",

        "pyqs":
            "PYQs",

        "ncert-solution":
            "NCERT Solution",

        "ncert-exemplar-solution":
            "NCERT Exemplar Solution"

    };


    /*
     * Create missing pills only.
     * Existing Download CSS remains untouched.
     */

    DOWNLOAD_FILTER_ORDER.forEach(
        function(filter){

            const exists =
                container.querySelector(
                    `.download-filter-chip[data-filter="${filter}"]`
                );

            if(exists){
                return;
            }


            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.className =
                "download-filter-chip";

            button.dataset.filter =
                filter;

            button.textContent =
                filterLabels[filter] ||
                filter;


            container.appendChild(
                button
            );

        }
    );

}
    /* =========================================================
       GET FILTER CHIPS
       ========================================================= */

    function getFilterChips() {

        return document.querySelectorAll(
            ".download-filter-chip"
        );

    }


/* =========================================================
   ACTIVATE DOWNLOAD NAVIGATION
   ========================================================= */

function activateDownloadNavigation() {

    /*
     * Download is its own navigation section.
     * Activate Download in BOTH:
     * 1. Bottom navigation
     * 2. Navigation drawer
     */

    if (
        typeof window.keduSetActiveSection ===
        "function"
    ) {
        window.keduSetActiveSection(
            "download"
        );
    }

    else {

        /*
         * Fallback: activate bottom
         * Download navigation manually.
         */

        document
            .querySelectorAll(
                ".bottom-nav-item"
            )
            .forEach(
                function (item) {

                    item.classList.toggle(
                        "active",
                        item.dataset.section ===
                        "download"
                    );

                }
            );

        /*
         * Fallback: activate drawer
         * Download navigation manually.
         */

        document
            .querySelectorAll(
                ".drawer-item[data-section]"
            )
            .forEach(
                function (item) {

                    item.classList.toggle(
                        "active",
                        item.dataset.section ===
                        "download"
                    );

                }
            );

    }

}

        

    /* =========================================================
       SET DOWNLOAD FILTER
       ========================================================= */

    function setDownloadFilter(
        filter,
        scrollToChip = true
    ) {

        filter =
            normalizeDownloadFilter(
                filter
            );


        currentDownloadFilter =
            filter;


        /*
         * Update active filter.
         */

        getFilterChips().forEach(
            function (chip) {

                const chipFilter =
                    normalizeDownloadFilter(
                        chip.dataset.filter
                    );


                chip.classList.toggle(
                    "active",
                    chipFilter ===
                    currentDownloadFilter
                );

            }
        );


        /*
         * Scroll selected filter
         * into the center.
         */

        if (scrollToChip) {

            const activeChip =
                document.querySelector(
                    ".download-filter-chip.active"
                );


            if (activeChip) {

                activeChip.scrollIntoView(
                    {
                        behavior:
                            "smooth",

                        block:
                            "nearest",

                        inline:
                            "center"
                    }
                );

            }

        }


        /*
         * Future resource/card system
         * can listen to this event.
         *
         * No card is created here.
         */

        document.dispatchEvent(
            new CustomEvent(
                "kedu-download-filter-change",
                {
                    detail: {
                        filter:
                            currentDownloadFilter
                    }
                }
            )
        );
renderDownloadResources();
    }
/* ===================================================== */
/* DOWNLOAD CARD ESCAPE                                  */
/* ===================================================== */

function escapeDownloadHTML(
    value
){

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* ===================================================== */
/* RENDER DOWNLOAD RESOURCES                             */
/* ===================================================== */

function renderDownloadResources(){

    const list =
        document.getElementById(
            "download-resource-list"
        );

    if(!list){
        return;
    }


    /* =================================================
       LECTURE DOWNLOADS
       ================================================= */

    if(
        currentDownloadFilter ===
        "lecture"
    ){

        const downloads =
            getDownloadedLectures()
                .filter(
                    item =>
                        item.status ===
                        "completed" ||
                        item.status ===
                        "downloading" ||
                        item.status ===
                        "paused"
                );


        if(
            downloads.length === 0
        ){

            list.innerHTML = `
                <div class="kedu-download-empty">

                    <span class="material-symbols-rounded">
                        download
                    </span>

                    <h3>
                        No Downloads Yet
                    </h3>

                    <p>
                        Downloaded lectures will appear here.
                    </p>

                </div>
            `;

            return;
        }


        list.innerHTML =
            downloads
                .map(
                    item => {

                        const thumbnail =
                            item.thumbnail
                                ?
                                `
                                <img
                                    src="${escapeDownloadHTML(
                                        item.thumbnail
                                    )}"
                                    alt="${escapeDownloadHTML(
                                        item.title
                                    )}"
                                    loading="lazy">
                                `
                                :
                                `
                                <div class="kedu-download-thumbnail-placeholder">

                                    <span class="material-symbols-rounded">
                                        play_circle
                                    </span>

                                </div>
                                `;


                        return `

                            <article
                                class="kedu-download-card"
                                data-lecture-id="${escapeDownloadHTML(
                                    item.lectureId
                                )}"
                                data-download-type="lecture"
                            >

                                <div class="kedu-download-thumbnail">

                                    ${thumbnail}

                                </div>


                                <div class="kedu-download-info">

                                    <h3 class="kedu-download-title">

                                        ${escapeDownloadHTML(
                                            item.title
                                        )}

                                    </h3>


                                    <div class="kedu-download-channel">

    ${
        String(
            item.materialType ||
            ""
        )
        .replace(
            /-/g,
            " "
        )
        .replace(
            /\b\w/g,
            char =>
                char.toUpperCase()
        )
    }

</div>
                            


                                    <div class="kedu-download-date">

                                        ${escapeDownloadHTML(
                                            item.uploadedDate ||
                                            ""
                                        )}

                                    </div>

                                </div>


                                <div class="kedu-download-card-actions">

                                    <span
                                        class="material-symbols-rounded kedu-download-completed-icon"
                                        aria-label="Downloaded"
                                    >
                                        download_done
                                    </span>


                                    <button
                                        type="button"
                                        class="kedu-download-more-btn"
                                        data-download-more="${escapeDownloadHTML(
                                            item.lectureId
                                        )}"
                                        aria-label="More options"
                                    >

                                        <span class="material-symbols-rounded">
                                            more_vert
                                        </span>

                                    </button>


                                    <div
                                        class="kedu-download-menu"
                                        data-download-menu="${escapeDownloadHTML(
                                            item.lectureId
                                        )}"
                                        hidden
                                    >

                                        <button
                                            type="button"
                                            class="kedu-download-delete-btn"
                                            data-download-delete="${escapeDownloadHTML(
                                                item.lectureId
                                            )}"
                                            data-download-delete-type="lecture"
                                        >

                                            <span class="material-symbols-rounded">
                                                delete
                                            </span>

                                            <span>
                                                Delete from downloads
                                            </span>

                                        </button>

                                    </div>

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");

        return;
    }


    /* =================================================
       BOOKS
       ================================================= */

    if(
        currentDownloadFilter ===
        "books"
    ){

        list.innerHTML = `

            <div class="kedu-download-empty">

                <span class="material-symbols-rounded">
                    library_books
                </span>

                <h3>
                    No Downloads Yet
                </h3>

                <p>
                    Book downloads are not included in this PDF system.
                </p>

            </div>

        `;

        return;
    }


    /* =================================================
       PDF DOWNLOADS
       ================================================= */

    const pdfDownloads =
    getDownloadedPdfAttachments()
        .filter(
            item =>
                item &&
                item.status === "completed"
        )
        .filter(
            item => {

                const savedType =
                    normalizePdfMaterialType(
                        item
                    );

                const selectedType =
                    normalizePdfMaterialType({
                        materialType:
                            currentDownloadFilter
                    });

                return (
                    savedType ===
                    selectedType
                );

            }
        );
    console.log(
        "KEDU PDF DOWNLOAD RENDER:",
        {
            filter:
                currentDownloadFilter,

            pdfDownloads:
                pdfDownloads
        }
    );


    if(
        pdfDownloads.length ===
        0
    ){

        list.innerHTML = `

            <div class="kedu-download-empty">

                <span class="material-symbols-rounded">
                    picture_as_pdf
                </span>

                <h3>
                    No Downloads Yet
                </h3>

                <p>
                    Downloaded PDF resources will appear here.
                </p>

            </div>

        `;

        return;
    }


    list.innerHTML =
        pdfDownloads
            .map(
                item => {

                    return `

                        <article
                            class="kedu-download-card kedu-pdf-download-card"
                            data-attachment-id="${escapeDownloadHTML(
                                item.attachmentId
                            )}"
                            data-download-type="pdf"
                        >

                            <div class="kedu-download-thumbnail kedu-pdf-download-thumbnail">

                                <span class="material-symbols-rounded">
                                    picture_as_pdf
                                </span>

                            </div>


<div class="kedu-download-info">

    <h3 class="kedu-download-title">

        ${escapeDownloadHTML(
            item.title ||
            "KEDU PDF"
        )}

    </h3>

</div>


                            <div class="kedu-download-card-actions">

                                <span
                                    class="material-symbols-rounded kedu-download-completed-icon"
                                    aria-label="Downloaded"
                                >
                                    download_done
                                </span>


                                <button
                                    type="button"
                                    class="kedu-download-more-btn"
                                    data-pdf-download-more="${escapeDownloadHTML(
                                        item.attachmentId
                                    )}"
                                    aria-label="More options"
                                >

                                    <span class="material-symbols-rounded">
                                        more_vert
                                    </span>

                                </button>


                                <div
                                    class="kedu-download-menu"
                                    data-pdf-download-menu="${escapeDownloadHTML(
                                        item.attachmentId
                                    )}"
                                    hidden
                                >

                                    <button
                                        type="button"
                                        class="kedu-download-delete-btn"
                                        data-pdf-download-delete="${escapeDownloadHTML(
                                            item.attachmentId
                                        )}"
                                    >

                                        <span class="material-symbols-rounded">
                                            delete
                                        </span>

                                        <span>
                                            Delete from downloads
                                        </span>

                                    </button>

                                </div>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}
/* ===================================================== */
/* DOWNLOAD CARD EVENTS                                  */
/* ===================================================== */

document.addEventListener(
    "click",
    event => {

        const moreButton =
            event.target.closest(
                "[data-download-more]"
            );


        if(moreButton){

            event.preventDefault();
            event.stopPropagation();


            const lectureId =
                moreButton.dataset.downloadMore;


            document
                .querySelectorAll(
                    ".kedu-download-menu"
                )
                .forEach(
                    menu => {

                        if(
                            menu.dataset.downloadMenu !==
                            lectureId
                        ){

                            menu.hidden =
                                true;

                        }

                    }
                );


            const menu =
                document.querySelector(
                    `[data-download-menu="${CSS.escape(
                        lectureId
                    )}"]`
                );


if(menu){

    const shouldOpen =
        menu.hidden;

    menu.hidden =
        !shouldOpen;

    openDownloadMenuLectureId =
        shouldOpen
            ? lectureId
            : null;

}


            return;

        }

const pauseButton =
    event.target.closest(
        "[data-download-pause]"
    );

if(pauseButton){

    event.preventDefault();
    event.stopImmediatePropagation();
    const lectureId =
        pauseButton.dataset.downloadPause;

    toggleDemoDownloadPause(
        lectureId
    );

    return;
}
const deleteButton =
    event.target.closest(
        "[data-download-delete]"
    );


if(deleteButton){

    event.preventDefault();
    event.stopPropagation();


    const lectureId =
        deleteButton.dataset
            .downloadDelete;


    const deleteType =
        deleteButton.dataset
            .downloadDeleteType ||
        "lecture";


    if(
        deleteType ===
        "lecture"
    ){

        deleteDownloadedLecture(
            lectureId
        );

    }


    return;

}
/* ===================================================== */
/* PDF DOWNLOAD CARD EVENTS                              */
/* ===================================================== */

document.addEventListener(
    "click",
    event => {

        const moreButton =
            event.target.closest(
                "[data-pdf-download-more]"
            );


        if(moreButton){

            event.preventDefault();
            event.stopPropagation();


            const attachmentId =
                moreButton.dataset
                    .pdfDownloadMore;


            document
                .querySelectorAll(
                    "[data-pdf-download-menu]"
                )
                .forEach(
                    menu => {

                        if(
                            menu.dataset
                                .pdfDownloadMenu !==
                            attachmentId
                        ){

                            menu.hidden =
                                true;

                        }

                    }
                );


            const menu =
                document.querySelector(
                    `[data-pdf-download-menu="${CSS.escape(
                        attachmentId
                    )}"]`
                );


            if(menu){

                menu.hidden =
                    !menu.hidden;

            }


            return;

        }


        const deleteButton =
            event.target.closest(
                "[data-pdf-download-delete]"
            );


        if(deleteButton){

            event.preventDefault();
            event.stopPropagation();


            const attachmentId =
                deleteButton.dataset
                    .pdfDownloadDelete;


            deleteDownloadedPdf(
                attachmentId
            );


            return;

        }


        /*
         * Close PDF download menus
         * when tapping outside.
         */

        if(
            !event.target.closest(
                ".kedu-download-card-actions"
            )
        ){

            document
                .querySelectorAll(
                    "[data-pdf-download-menu]"
                )
                .forEach(
                    menu => {

                        menu.hidden =
                            true;

                    }
                );

        }

    }
);
/* ===================================================== */
/* OPEN DOWNLOADED PDF CARD                              */
/* ===================================================== */

document.addEventListener(
    "click",
    async event => {

        const pdfCard =
            event.target.closest(
                ".kedu-pdf-download-card"
            );

        if(!pdfCard){

            return;

        }


        /*
         * Do not open PDF when the user
         * taps the three-dot/delete area.
         */

        if(
            event.target.closest(
                ".kedu-download-card-actions"
            )
        ){

            return;

        }


        event.preventDefault();
        event.stopPropagation();


        const attachmentId =
            pdfCard.dataset.attachmentId;

        if(!attachmentId){

            console.warn(
                "KEDU: Downloaded PDF attachment ID missing."
            );

            return;

        }


        /*
         * Find the completed PDF record.
         */

        const item =
            getDownloadedPdfAttachments()
                .find(
                    download =>
                        String(
                            download.attachmentId
                        ) ===
                        String(
                            attachmentId
                        ) &&
                        download.status ===
                            "completed"
                );


        if(!item){

            showDownloadToast(
                "Downloaded PDF Not Found",
                "error"
            );

            return;

        }


        /*
         * Create the attachment object
         * required by the existing PDF viewer.
         */

        const attachment = {

            id:
                String(
                    item.attachmentId
                ),

            title:
                item.title ||
                "KEDU PDF",

            name:
                item.title ||
                "KEDU PDF",

            type:
                "pdf",

            materialType:
                item.materialType ||
                item.attachmentId,

            file:
                item.file ||
                "",

            cacheKey:
                item.cacheKey ||
                ""

        };


        /*
         * First try the actual downloaded
         * PDF stored in Cache Storage.
         */

        if(
            "caches" in window &&
            item.cacheKey
        ){

            try{

                const cache =
                    await caches.open(
                        KEDU_DOWNLOAD_CACHE
                    );


                const response =
                    await cache.match(
                        item.cacheKey
                    );


                if(response){

                    const blob =
                        await response.blob();


                    /*
                     * Use the downloaded PDF blob
                     * instead of requesting the
                     * original PDF again.
                     */

                    attachment.file =
                        URL.createObjectURL(
                            blob
                        );

                }

            }
            catch(error){

                console.warn(
                    "KEDU: Could not read downloaded PDF cache.",
                    error
                );

            }

        }


        /*
         * Open the existing KEDU PDF viewer.
         */

        if(
            typeof window.openPdfViewer ===
            "function"
        ){

            window.openPdfViewer(
                attachment
            );

            return;

        }


        /*
         * Compatibility with classic
         * non-module script loading.
         */

        if(
            typeof openPdfViewer ===
            "function"
        ){

            openPdfViewer(
                attachment
            );

            return;

        }


        console.error(
            "KEDU: openPdfViewer() is not available."
        );

        showDownloadToast(
            "PDF Viewer Not Ready",
            "error"
        );

    }
);
/* ===================================================== */
/* OPEN COMPLETED DOWNLOADED LECTURE                     */
/* ===================================================== */

const downloadCard =
    event.target.closest(
        ".kedu-download-card"
    );

if(downloadCard){

    /*
     * Do not open the lecture when the user
     * is interacting with the three-dot menu,
     * pause button, or delete button.
     */
    if(
        event.target.closest(
            ".kedu-download-card-actions"
        )
    ){

        return;

    }

    event.preventDefault();
    event.stopPropagation();

    const lectureId =
        downloadCard.dataset.lectureId;

    if(!lectureId){

        return;

    }

    const item =
        getDownloadedLectures()
            .find(
                download =>
                    String(
                        download.lectureId
                    ) ===
                    String(
                        lectureId
                    )
            );

    /*
     * Only completed downloads can be played.
     */
    if(
        !item ||
        item.status !==
            "completed"
    ){

        return;

    }

    openDownloadMenuLectureId =
        null;

    /*
     * First use the saved lecture snapshot.
     */
    let lecture =
        item.lectureData
            ? {
                ...item.lectureData
            }
            : null;

    /*
     * Compatibility with older download
     * records created before lectureData existed.
     */
    if(
        !lecture &&
        typeof currentLectureList !==
            "undefined" &&
        Array.isArray(
            currentLectureList
        )
    ){

        lecture =
            currentLectureList.find(
                currentLecture =>
                    String(
                        currentLecture.id
                    ) ===
                    String(
                        lectureId
                    )
            ) || null;

    }

    /*
     * Final fallback for an old download record.
     */
    if(!lecture){

        lecture = {

            id:
                String(
                    item.lectureId
                ),

            title:
                item.title ||
                "Lecture",

            thumbnail:
                item.thumbnail ||
                "",

            channel:
                item.channel ||
                "KEDU Academy",

            uploadedDate:
                item.uploadedDate ||
                "",

            video:
                item.videoUrl ||
                "",

            duration:
                "",

            description:
                ""

        };

    }

    if(
        typeof window.openLecturePlayer !==
        "function"
    ){

        console.error(
            "KEDU: openLecturePlayer() is not available."
        );

        return;

    }

    console.log(
        "KEDU: Opening downloaded lecture:",
        lecture.title
    );

    window.openLecturePlayer(
        lecture
    );

    return;

}

        /*
         * Close open menu when user
         * taps outside.
         */

        if(
            !event.target.closest(
                ".kedu-download-card-actions"
            )
        ){
openDownloadMenuLectureId =
    null;
            document
                .querySelectorAll(
                    ".kedu-download-menu"
                )
                .forEach(
                    menu => {

                        menu.hidden =
                            true;

                    }
                );

        }

    }
);


/* ===================================================== */
/* PUBLIC DOWNLOAD API                                   */
/* ===================================================== */

window.KEDUDownload = {

    /* ----------------------------------------------- */
    /* OPEN DOWNLOAD                                   */
    /* ----------------------------------------------- */

    open:function(
        filter
    ){

        openDownloadPage(
            filter ||
            "lecture"
        );

    },


    /* ----------------------------------------------- */
    /* SET FILTER                                      */
    /* ----------------------------------------------- */

    setFilter:function(
        filter
    ){

        setDownloadFilter(
            filter
        );

    },


    /* ----------------------------------------------- */
    /* GET FILTER                                      */
    /* ----------------------------------------------- */

    getFilter:function(){

        return currentDownloadFilter;

    },


    /* ----------------------------------------------- */
    /* GET PREVIOUS PAGE                               */
    /* ----------------------------------------------- */

    getPreviousPage:function(){

        return previousPageId;

    },


    /* ----------------------------------------------- */
    /* CHECK DOWNLOAD PAGE                              */
    /* ----------------------------------------------- */

    isOpen:function(){

        return downloadPageIsOpen;

    },


    /* ----------------------------------------------- */
    /* START LECTURE DOWNLOAD                           */
    /* ----------------------------------------------- */

    startLectureDownload:
        startLectureDownload,
/* ----------------------------------------------- */
/* START PDF ATTACHMENT DOWNLOAD                   */
/* ----------------------------------------------- */

startPdfAttachmentDownload:
    startPdfAttachmentDownload,

/* ----------------------------------------------- */
/* CHECK LECTURE DOWNLOAD                           */
/* ----------------------------------------------- */

isLectureDownloaded:
    isLectureDownloaded,

/* ----------------------------------------------- */
/* GET DOWNLOADED VIDEO URL                         */
/* ----------------------------------------------- */

getDownloadedVideoUrl:
    getDownloadedVideoUrl,

    /* ----------------------------------------------- */
    /* DELETE LECTURE DOWNLOAD                          */
    /* ----------------------------------------------- */

    deleteDownloadedLecture:
        deleteDownloadedLecture,


    /* ----------------------------------------------- */
    /* RENDER DOWNLOADS                                */
    /* ----------------------------------------------- */

    render:
        renderDownloadResources

};
    /* =========================================================
       OPEN DOWNLOAD PAGE
       ========================================================= */

    function openDownloadPage(
        filter = "lecture",
        sourcePage = null
    ) {

        if (!downloadPage) {

            console.error(
                "KEDU Download: #download-page not found."
            );

            return;

        }


        /*
         * Remember the actual page
         * before entering Download.
         */

        if (sourcePage) {

            previousPageId =
                sourcePage;

        }
        else {

    /*
     * Favorite is not a .page element.
     * Detect it separately before checking
     * the normal page system.
     */

    const favoritePage =
        document.getElementById(
            "favorite-page"
        );

    if (
        favoritePage &&
        favoritePage.classList.contains(
            "active"
        )
    ) {

        previousPageId =
            "favorite";

    }
    else {

        const activePage =
            document.querySelector(
                ".page.active"
            );

        if (
            activePage &&
            activePage.id !==
            "download-page"
        ) {

            previousPageId =
                activePage.id.replace(
                    "-page",
                    ""
                );

        }

    }

}

        /*
         * Download must never become
         * its own previous page.
         */

        if (
            previousPageId ===
            "download"
        ) {

            previousPageId =
                "home";

        }


        /*
         * Set selected filter first.
         */

        setDownloadFilter(
            filter,
            false
        );


        /*
         * Open through KEDU's
         * existing page system.
         *
         * false = Download does not
         * create a duplicate history entry.
         */

        /*
 * =====================================================
 * OPEN DOWNLOAD AS A REAL FULL PAGE
 * =====================================================
 *
 * Hide Study and every other page first.
 * Then show Download only.
 */

/* Hide Study page */
const studyPage =
    document.getElementById(
        "home-page"
    );

if (studyPage) {

    studyPage.style.display =
        "none";

    studyPage.classList.remove(
        "active"
    );

    studyPage.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* Hide every normal page */
document
    .querySelectorAll(
        ".page"
    )
    .forEach(
        function (page) {

            if (
                page !==
                downloadPage
            ) {

                page.style.display =
                    "none";

                page.classList.remove(
                    "active"
                );

                page.setAttribute(
                    "aria-hidden",
                    "true"
                );

            }

        }
    );


/* Show Download */
downloadPage.style.display =
    "block";

downloadPage.classList.add(
    "active"
);

downloadPage.setAttribute(
    "aria-hidden",
    "false"
);


/* Always start Download from top */
downloadPage.scrollTop =
    0;

window.scrollTo({
    top: 0,
    left: 0,
    behavior: "instant"
});


downloadPageIsOpen =
    true;
const mainAppHeader =
    document.querySelector(
        "main#app > .app-header"
    );

if (mainAppHeader) {
    mainAppHeader.style.display = "none";
}

/*
 * DOWNLOAD ALWAYS BELONGS TO STUDY.
 * Make Study active immediately.
 */

activateDownloadNavigation();


pageSwipeTracking =
    false;

filterTouchActive =
    false;


        pageSwipeTracking =
            false;


        filterTouchActive =
            false;


        /*
         * Download always belongs
         * to Study.
         */




        /*
         * Close drawer if it is open.
         */

        if (
            typeof closeDrawer ===
            "function"
        ) {

            closeDrawer();

        }

    }


    /* =========================================================
       CLOSE DOWNLOAD PAGE
       ========================================================= */

    function closeDownloadPage() {

        downloadPageIsOpen =
            false;

const mainAppHeader =
    document.querySelector(
        "main#app > .app-header"
    );

if (mainAppHeader) {
    mainAppHeader.style.display = "";
}
        pageSwipeTracking =
            false;


        filterTouchActive =
            false;


        const returnPage =
            previousPageId ||
            "home";


        /*
         * Return to the real page
         * without creating another
         * Download history entry.
         */

        if (
    returnPage ===
    "favorite" &&
    typeof window.keduShowFavoritePage ===
    "function"
) {

    window.keduShowFavoritePage();

}
else if (
    returnPage ===
    "study" &&
    typeof window.keduShowStudyPage ===
    "function"
) {

    window.keduShowStudyPage();

}
else if (
    typeof showPage ===
    "function"
) {

    showPage(
        returnPage,
        false
    );

}
else {

    window.keduShowStudyPage?.();

}

    }


    /* =========================================================
       FILTER CHIP CLICK
       ========================================================= */

    function bindFilterChips() {
ensureDownloadFilterChips();
        getFilterChips().forEach(
            function (chip) {

                if (
                    chip.dataset
                        .keduDownloadBound ===
                    "true"
                ) {

                    return;

                }


                chip.dataset
                    .keduDownloadBound =
                    "true";


                chip.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        event.stopPropagation();


                        const filter =
                            normalizeDownloadFilter(
                                chip.dataset.filter
                            );


                        setDownloadFilter(
                            filter
                        );

                    }
                );

            }
        );

    }


    /* =========================================================
       DRAWER DOWNLOAD ITEMS
       ========================================================= */

    function bindDrawerDownloadItems() {

        document
            .querySelectorAll(
                "[data-download-filter]"
            )
            .forEach(
                function (item) {

                    if (
                        item.dataset
                            .keduDownloadBound ===
                        "true"
                    ) {

                        return;

                    }


                    item.dataset
                        .keduDownloadBound =
                        "true";


                    item.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            event.stopPropagation();


                            const filter =
                                normalizeDownloadFilter(
                                    item.dataset
                                        .downloadFilter
                                );


                            /*
                             * Drawer opens Download
                             * from Home.
                             */

                            openDownloadPage(
                                filter,
                                "home"
                            );

                        }
                    );

                }
            );

    }


    /* =========================================================
       STUDY DOWNLOAD BUTTON
       ========================================================= */

    function bindStudyDownloadButton() {

        const button =
            document.getElementById(
                "study-download-btn"
            );


        if (
            !button ||
            button.dataset
                .keduDownloadBound ===
            "true"
        ) {

            return;

        }


        button.dataset
            .keduDownloadBound =
            "true";


        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                openDownloadPage(
                    "lecture",
                    "study"
                );

            }
        );

    }


    /* =========================================================
       BOOKS DOWNLOAD BUTTON
       ========================================================= */

    function bindBooksDownloadButton() {

        const button =
            document.getElementById(
                "books-download-btn"
            );


        if (
            !button ||
            button.dataset
                .keduDownloadBound ===
            "true"
        ) {

            return;

        }


        button.dataset
            .keduDownloadBound =
            "true";


        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                openDownloadPage(
                    "books",
                    "books"
                );

            }
        );

    }


    /* =========================================================
       DOWNLOAD BACK BUTTON
       ========================================================= */

    function bindBackButton() {

        if (
            !downloadBackBtn ||
            downloadBackBtn.dataset
                .keduDownloadBound ===
            "true"
        ) {

            return;

        }


        downloadBackBtn.dataset
            .keduDownloadBound =
            "true";


        downloadBackBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                closeDownloadPage();

            }
        );

    }


    /* =========================================================
       FILTER STRIP TOUCH
       ========================================================= */

    function bindFilterStrip() {

        if (
            !filterContainer ||
            filterContainer.dataset
                .keduDownloadTouchBound ===
            "true"
        ) {

            return;

        }


        filterContainer.dataset
            .keduDownloadTouchBound =
            "true";


        filterContainer.addEventListener(
            "touchstart",
            function (event) {

                if (
                    !event.touches ||
                    !event.touches.length
                ) {

                    return;

                }


                filterTouchActive =
                    true;

            },
            {
                passive: true
            }
        );


        filterContainer.addEventListener(
            "touchend",
            function () {

                filterTouchActive =
                    false;

            },
            {
                passive: true
            }
        );


        filterContainer.addEventListener(
            "touchcancel",
            function () {

                filterTouchActive =
                    false;

            },
            {
                passive: true
            }
        );

    }


    /* =========================================================
       DOWNLOAD PAGE SWIPE
       ========================================================= */

    function bindDownloadPageSwipe() {

        if (
            !downloadPage ||
            downloadPage.dataset
                .keduDownloadSwipeBound ===
            "true"
        ) {

            return;

        }


        downloadPage.dataset
            .keduDownloadSwipeBound =
            "true";


        /* -----------------------------------------------------
           TOUCH START
           ----------------------------------------------------- */

        downloadPage.addEventListener(
            "touchstart",
            function (event) {

                if (
                    !downloadPageIsOpen
                ) {

                    return;

                }
if (
    window.__keduPageSwipe
) {

    pageSwipeTracking =
        false;

    return;

}

                /*
                 * Filter strip has its own
                 * horizontal scrolling.
                 *
                 * Do not treat it as
                 * Download-page swipe.
                 */

                if (
                    event.target.closest(
                        "#download-filter-chips"
                    )
                ) {

                    pageSwipeTracking =
                        false;

                    return;

                }


                if (
                    filterTouchActive
                ) {

                    pageSwipeTracking =
                        false;

                    return;

                }


                if (
                    !event.touches ||
                    !event.touches.length
                ) {

                    return;

                }


                const touch =
                    event.touches[0];


                pageSwipeStartX =
                    touch.clientX;


                pageSwipeStartY =
                    touch.clientY;


                pageSwipeTracking =
                    true;

            },
            {
                passive: true
            }
        );


        /* -----------------------------------------------------
           TOUCH END
           ----------------------------------------------------- */

        downloadPage.addEventListener(
            "touchend",
            function (event) {

                if (
                    !downloadPageIsOpen ||
                    !pageSwipeTracking
                ) {

                    return;

                }


                pageSwipeTracking =
                    false;


                if (
                    !event.changedTouches ||
                    !event.changedTouches.length
                ) {

                    return;

                }


                const touch =
                    event.changedTouches[0];


                const deltaX =
                    touch.clientX -
                    pageSwipeStartX;


                const deltaY =
                    touch.clientY -
                    pageSwipeStartY;


                /*
                 * Vertical movement wins.
                 *
                 * Therefore normal page
                 * scrolling still works.
                 */

                if (
                    Math.abs(deltaY) >
                    Math.abs(deltaX)
                ) {

                    return;

                }


                /*
                 * Ignore small movement.
                 */

                if (
                    Math.abs(deltaX) <
                    70
                ) {

                    return;

                }


                const currentIndex =
                    DOWNLOAD_FILTER_ORDER.indexOf(
                        currentDownloadFilter
                    );


                if (
                    currentIndex ===
                    -1
                ) {

                    return;

                }


                /* -------------------------------------------------
                   LEFT SWIPE → NEXT FILTER
                   ------------------------------------------------- */

                if (
                    deltaX < 0
                ) {

                    if (
                        currentIndex <
                        DOWNLOAD_FILTER_ORDER.length - 1
                    ) {

                        const nextFilter =
                            DOWNLOAD_FILTER_ORDER[
                                currentIndex + 1
                            ];


                        setDownloadFilter(
                            nextFilter,
                            true
                        );

                    }

                }


                /* -------------------------------------------------
                   RIGHT SWIPE → PREVIOUS FILTER
                   ------------------------------------------------- */

                else {

                    if (
                        currentIndex >
                        0
                    ) {

                        const previousFilter =
                            DOWNLOAD_FILTER_ORDER[
                                currentIndex - 1
                            ];


                        setDownloadFilter(
                            previousFilter,
                            true
                        );

                    }

                }


                /*
                 * Download remains under Study.
                 */

                /*
 * =====================================================
 * DOWNLOAD NAVIGATION ACTIVE
 * =====================================================
 *
 * Download must be highlighted in BOTH:
 * Bottom Navigation + Drawer.
 */

activateDownloadNavigation();

            },
            {
                passive: true
            }
        );


        /* -----------------------------------------------------
           TOUCH CANCEL
           ----------------------------------------------------- */

        downloadPage.addEventListener(
            "touchcancel",
            function () {

                pageSwipeTracking =
                    false;

            },
            {
                passive: true
            }
        );

    }


/* =========================================================
   PUBLIC API
   ========================================================= */

window.KEDUDownload = {

    open:function(filter){

        openDownloadPage(
            filter ||
            "lecture"
        );

    },


    close:function(){

        closeDownloadPage();

    },


    setFilter:function(filter){

        setDownloadFilter(
            filter
        );

    },


    getFilter:function(){

        return currentDownloadFilter;

    },


    getPreviousPage:function(){

        return previousPageId;

    },


    isOpen:function(){

        return downloadPageIsOpen;

    },


startLectureDownload:
    startLectureDownload,


/* ----------------------------------------------- */
/* START PDF ATTACHMENT DOWNLOAD                   */
/* ----------------------------------------------- */

startPdfAttachmentDownload:
    startPdfAttachmentDownload,


isLectureDownloaded:
    isLectureDownloaded,


    deleteDownloadedLecture:
        deleteDownloadedLecture,


    render:
        renderDownloadResources

};

    function initializeDownloadSystem(){

    ensureDownloadFilterChips();

    bindFilterChips();

    bindDrawerDownloadItems();

    bindStudyDownloadButton();

    bindBooksDownloadButton();

    bindBackButton();

    bindFilterStrip();

    bindDownloadPageSwipe();


    setDownloadFilter(
        "lecture",
        false
    );


    renderDownloadResources();

}

    /* =========================================================
       START
       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeDownloadSystem,
            {
                once: true
            }
        );

    }
    else {

        initializeDownloadSystem();

    }


})();