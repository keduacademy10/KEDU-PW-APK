/* ========================================================= */
/* KEDU PW — ATTACHMENT SYSTEM                               */
/* CATEGORY + MATERIAL VERSION                               */
/* ========================================================= */


/* ========================================================= */
/* GLOBAL STATE                                               */
/* ========================================================= */

let currentAttachmentList = [];
let currentAttachmentChapter = null;
let openedAttachmentCategory = null;


/* ========================================================= */
/* ATTACHMENT CATEGORIES                                      */
/* Books intentionally NOT included.                         */
/* ========================================================= */

const KEDU_PW_ATTACHMENT_CATEGORIES = [

    {
        key: "lecture-notes",
        title: "Lecture Notes",
        icon: "description"
    },

    {
        key: "short-notes",
        title: "Short Notes",
        icon: "sticky_note_2"
    },

    {
        key: "dpp",
        title: "DPP",
        icon: "assignment"
    },

    {
        key: "formula-sheet",
        title: "Formula Sheet",
        icon: "calculate"
    },

    {
        key: "mind-map",
        title: "Mind Map",
        icon: "account_tree"
    },

    {
        key: "pyqs",
        title: "PYQs",
        icon: "quiz"
    },

    {
        key: "ncert-solution",
        title: "NCERT Solution",
        icon: "menu_book"
    },

    {
        key: "ncert-exemplar-solution",
        title: "NCERT Exemplar Solution",
        icon: "auto_stories"
    }

];


/* ========================================================= */
/* TEMPORARY FRONTEND DATA                                   */
/* ========================================================= */
/*
 * This is only frontend testing data.
 *
 * Later KEDU Admin/backend can replace this data.
 *
 * Structure:
 *
 * subject
 *   ↓
 * chapter number
 *   ↓
 * category
 *   ↓
 * files
 *
 * Example:
 *
 * science: {
 *
 *     1: {
 *
 *         "lecture-notes": [
 *             {
 *                 id: "...",
 *                 title: "...",
 *                 file: "..."
 *             }
 *         ]
 *
 *     }
 *
 * }
 */

const KEDU_PW_ATTACHMENTS = {

    mathematics: {

        1: {

            "lecture-notes": [
                {
                    id:
                        "math-1-lecture-notes-1",

                    title:
                        "Lecture Notes",

                    type:
                        "pdf",

                    file:
                        "assets/pdf/lecture-notes/lecture-notes.pdf"
                }
            ],

            "short-notes": [
                {
                    id:
                        "math-1-short-notes-1",

                    title:
                        "Short Notes",

                    type:
                        "pdf",

                    file:
                        "assets/pdf/lecture-notes/lecture-notes.pdf"
                }
            ],

            "dpp": [
                {
                    id:
                        "math-1-dpp-1",

                    title:
                        "DPP",

                    type:
                        "pdf",

                    file:
                        "assets/pdf/lecture-notes/lecture-notes.pdf"
                }
            ],

            "formula-sheet": [
                {
                    id:
                        "math-1-formula-sheet-1",

                    title:
                        "Formula Sheet",

                    type:
                        "pdf",

                    file:
                        "assets/pdf/lecture-notes/lecture-notes.pdf"
                }
            ],

            "mind-map": [
                {
                    id:
                        "math-1-mind-map-1",

                    title:
                        "Mind Map",

                    type:
                        "pdf",

                    file:
                        "assets/pdf/lecture-notes/lecture-notes.pdf"
                }
            ],

            "pyqs": [
                {
                    id:
                        "math-1-pyqs-1",

                    title:
                        "PYQs",

                    type:
                        "pdf",

                    file:
                        "assets/pdf/lecture-notes/lecture-notes.pdf"
                }
            ],

            "ncert-solution": [
                {
                    id:
                        "math-1-ncert-solution-1",

                    title:
                        "NCERT Solution",

                    type:
                        "pdf",

                    file:
                        "assets/pdf/lecture-notes/lecture-notes.pdf"
                }
            ],

            "ncert-exemplar-solution": [
                {
                    id:
                        "math-1-ncert-exemplar-solution-1",

                    title:
                        "NCERT Exemplar Solution",

                    type:
                        "pdf",

                    file:
                        "assets/pdf/lecture-notes/lecture-notes.pdf"
                }
            ]

        }

    },


    science: {

        1: {

            "lecture-notes": [
                {
                    id:
                        "science-1-lecture-notes-1",

                    title:
                        "Lecture Notes",

                    type:
                        "pdf",

                    file:
                        "assets/pdf/lecture-notes/lecture-notes.pdf"
                }
            ]

        }

    }

};


/* ========================================================= */
/* HTML ESCAPE                                                */
/* ========================================================= */

function escapeAttachmentHtml(value){

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


/* ========================================================= */
/* GET CURRENT CHAPTER                                        */
/* ========================================================= */

function getCurrentAttachmentChapter(){

    return (
        window.currentLectureChapter ||
        window.currentChapter ||
        window.selectedChapter ||
        null
    );

}


/* ========================================================= */
/* GET CURRENT SUBJECT                                       */
/* ========================================================= */

function getCurrentAttachmentSubject(){

    const chapter =
        getCurrentAttachmentChapter();

    return (
        chapter?.subjectKey ||
        window.currentSubjectKey ||
        window.selectedSubjectKey ||
        ""
    );

}


/* ========================================================= */
/* GET CURRENT CHAPTER NUMBER                                */
/* ========================================================= */

function getCurrentAttachmentChapterNumber(){

    const chapter =
        getCurrentAttachmentChapter();

    return (
        chapter?.chapterNumber ??
        chapter?.number ??
        window.currentChapterNumber ??
        window.selectedChapterNumber ??
        1
    );

}


/* ========================================================= */
/* GET ATTACHMENTS                                             */
/* ========================================================= */

function getAttachments(
    subjectKey,
    chapterNumber
){

    /*
     * First check frontend database.
     */

    const subject =
        KEDU_PW_ATTACHMENTS[
            subjectKey
        ];


    if(
        !subject
    ){

        return {};

    }


    /*
     * Chapter cards currently provide
     * values such as:
     *
     * "Chapter 1"
     *
     * while the temporary attachment
     * database uses:
     *
     * 1
     *
     * Normalize both formats.
     */

    const rawChapter =
        String(
            chapterNumber ?? ""
        ).trim();


    const normalizedChapter =
        rawChapter.replace(
            /^chapter\s*/i,
            ""
        ).trim();


    /*
     * Try the original key first,
     * then the normalized number.
     */

    const chapter =
        subject[
            chapterNumber
        ] ??
        subject[
            normalizedChapter
        ];


    if(
        chapter &&
        typeof chapter === "object"
    ){

        return chapter;

    }


    /*
     * No attachment data.
     */

    return {};

}
/* ========================================================= */
/* GET CATEGORY FILES                                         */
/* ========================================================= */

function getCategoryFiles(
    attachmentData,
    categoryKey
){

    /*
     * Temporary testing PDF.
     *
     * Until real materials are added,
     * every empty category uses this PDF.
     */

    const DEMO_PDF =
        "assets/pdf/lecture-notes/lecture-notes.pdf";


    if(
        !attachmentData ||
        typeof attachmentData !== "object"
    ){

        return [
            {
                id:
                    `demo-${categoryKey}`,

                title:
                    getAttachmentCategoryTitle(
                        categoryKey
                    ),

                type:
                    "pdf",

                file:
                    DEMO_PDF
            }
        ];

    }


    const files =
        attachmentData[
            categoryKey
        ];


    /*
     * Real files exist.
     */

    if(
        Array.isArray(files) &&
        files.length > 0
    ){

        return files.filter(
            file => {

                if(
                    !file
                ){

                    return false;

                }


                if(
                    !file.id ||
                    !file.title
                ){

                    return false;

                }


                return true;

            }
        );

    }


    /*
     * No real material yet.
     *
     * Show the temporary demo PDF.
     */

    return [

        {

            id:
                `demo-${categoryKey}`,

            title:
                getAttachmentCategoryTitle(
                    categoryKey
                ),

            type:
                "pdf",

            file:
                DEMO_PDF

        }

    ];

}


/* ========================================================= */
/* GET CATEGORY TITLE                                         */
/* ========================================================= */

function getAttachmentCategoryTitle(
    categoryKey
){

    const category =
        KEDU_PW_ATTACHMENT_CATEGORIES.find(
            item =>
                item.key ===
                categoryKey
        );


    return (
        category?.title ||
        "Demo Material"
    );

}


/* ========================================================= */
/* BUILD CATEGORY DATA                                       */
/* ========================================================= */

function buildAttachmentCategories(
    attachmentData
){

    return KEDU_PW_ATTACHMENT_CATEGORIES.map(
        category => {

            const files =
                getCategoryFiles(
                    attachmentData,
                    category.key
                );


            return {

    ...category,

    /*
     * IMPORTANT:
     * Attach the category key to EVERY
     * individual material.
     *
     * This is required by the Download
     * page so it knows whether the PDF
     * is Lecture Notes, DPP, Short Notes,
     * etc.
     */
    files:
        files.map(
            file => ({

                ...file,

                materialType:
                    category.key,

                attachmentType:
                    category.key

            })
        ),

    count:
        files.length

};

        }
    );

}


/* ========================================================= */
/* RENDER ATTACHMENTS                                         */
/* ========================================================= */

function renderAttachments(
    attachmentData
){

    const attachmentList =
        document.getElementById(
            "attachment-list"
        );


    if(
        !attachmentList
    ){

        console.warn(
            "KEDU PW: #attachment-list not found."
        );

        return;

    }


    attachmentList.innerHTML = "";


    const categories =
        buildAttachmentCategories(
            attachmentData
        );


    /*
     * Render all categories.
     */

    categories.forEach(
        category => {

            attachmentList.insertAdjacentHTML(
                "beforeend",
                `
                <article
                    class="attachment-category-card"
                    data-category-key="${escapeAttachmentHtml(category.key)}"
                >

                    <button
                        type="button"
                        class="attachment-category-main"
                        aria-expanded="false"
                    >

                        <span
                            class="attachment-category-icon"
                        >

                            <span
                                class="material-symbols-rounded"
                            >
                                ${escapeAttachmentHtml(category.icon)}
                            </span>

                        </span>


                        <span
                            class="attachment-category-content"
                        >

                            <span
                                class="attachment-category-title"
                            >
                                ${escapeAttachmentHtml(category.title)}
                            </span>

                            <span
                                class="attachment-category-count"
                            >
                                ${
                                    category.count
                                }
                                ${
                                    category.count === 1
                                        ? "Material"
                                        : "Materials"
                                }
                            </span>

                        </span>


                        <span
                            class="material-symbols-rounded attachment-category-arrow"
                        >
                            chevron_right
                        </span>

                    </button>


                    <div
                        class="attachment-category-content-list"
                    >

                        ${
                            renderCategoryFiles(
    category.files,
    category.key
)
                        }

                    </div>

                </article>
                `
            );

        }
    );

/*
 * Every fresh render starts completely closed.
 * No category is opened automatically.
 */

attachmentList
    .querySelectorAll(
        ".attachment-category-card"
    )
    .forEach(
        card => {

            card.classList.remove(
                "open"
            );

            const main =
                card.querySelector(
                    ".attachment-category-main"
                );

            if(main){

                main.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

openedAttachmentCategory = null;
  } 
/* ========================================================= */
/* RENDER CATEGORY FILES                                     */
/* ========================================================= */

function renderCategoryFiles(
    files,
    categoryKey
){

    if(
        !Array.isArray(files) ||
        files.length === 0
    ){

        return `
            <div
                class="attachment-category-empty"
            >

                <span
                    class="material-symbols-rounded"
                >
                    folder_open
                </span>

                <span>
                    Materials Coming Soon
                </span>

            </div>
        `;

    }


    return files.map(
        file => {

            return `
                <button
                    type="button"
                    class="attachment-file-item"
                    data-attachment-id="${escapeAttachmentHtml(file.id)}"
                    data-material-type="${escapeAttachmentHtml(categoryKey)}"
                >

                    <span
                        class="attachment-file-icon"
                    >

                        <span
                            class="material-symbols-rounded"
                        >
                            picture_as_pdf
                        </span>

                    </span>


                    <span
                        class="attachment-file-name"
                    >
                        ${escapeAttachmentHtml(file.title)}
                    </span>


                    <span
                        class="material-symbols-rounded attachment-file-arrow"
                    >
                        chevron_right
                    </span>

                </button>
            `;

        }
    ).join("");

}


/* ========================================================= */
/* OPEN CATEGORY                                             */
/* ========================================================= */

function openAttachmentCategory(
    card,
    animate = true
){

    if(
        !card
    ){

        return;

    }


    const main =
        card.querySelector(
            ".attachment-category-main"
        );


    if(
        !main
    ){

        return;

    }


    /*
     * Close every other category.
     */

    document
        .querySelectorAll(
            ".attachment-category-card"
        )
        .forEach(
            otherCard => {

                if(
                    otherCard !== card
                ){

                    closeAttachmentCategory(
                        otherCard
                    );

                }

            }
        );


    card.classList.add(
        "open"
    );


    main.setAttribute(
        "aria-expanded",
        "true"
    );


    openedAttachmentCategory =
        card.dataset.categoryKey || null;


    /*
     * Optional smooth scroll.
     */

    if(
        animate
    ){

        setTimeout(
            () => {

                card.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest"
                });

            },
            80
        );

    }

}


/* ========================================================= */
/* CLOSE CATEGORY                                            */
/* ========================================================= */

function closeAttachmentCategory(
    card
){

    if(
        !card
    ){

        return;

    }


    const main =
        card.querySelector(
            ".attachment-category-main"
        );


    card.classList.remove(
        "open"
    );


    if(
        main
    ){

        main.setAttribute(
            "aria-expanded",
            "false"
        );

    }


    if(
        openedAttachmentCategory ===
        card.dataset.categoryKey
    ){

        openedAttachmentCategory =
            null;

    }

}


/* ========================================================= */
/* TOGGLE CATEGORY                                           */
/* ========================================================= */

function toggleAttachmentCategory(
    card
){

    if(
        !card
    ){

        return;

    }


    if(
        card.classList.contains("open")
    ){

        closeAttachmentCategory(
            card
        );

        return;

    }


    openAttachmentCategory(
        card
    );

}




/* ========================================================= */
/* FIND ATTACHMENT BY ID + CATEGORY                          */
/* ========================================================= */

function findAttachmentById(
    attachmentId,
    materialType
){

    if(
        !attachmentId ||
        !materialType
    ){

        return null;

    }


    const files =
        getCategoryFiles(
            currentAttachmentList,
            materialType
        );


    const found =
        files.find(
            file =>
                String(
                    file.id
                ) ===
                String(
                    attachmentId
                )
        );


    if(
        !found
    ){

        return null;

    }


    /*
     * IMPORTANT:
     * The category is now taken directly
     * from the category in which the user
     * tapped the material.
     */

    return {

        ...found,

        materialType:
            materialType,

        attachmentType:
            materialType

    };

}


/* ========================================================= */
/* OPEN PDF                                                  */
/* KEDU PW — FINAL PDF HANDOFF                               */
/* ========================================================= */

function openAttachmentPdf(attachment){

    if(!attachment){
        console.error(
            "KEDU: PDF attachment data missing."
        );
        return;
    }

    const pdfViewerPage =
        document.getElementById(
            "pdf-viewer-page"
        );

    const pdfDocumentFrame =
        document.getElementById(
            "pdf-document-frame"
        );

    if(
        !pdfViewerPage ||
        !pdfDocumentFrame
    ){

        console.error(
            "KEDU: PDF viewer HTML is missing."
        );

        return;
    }

    /*
     * Make sure the attachment has an ID.
     */
    const attachmentId =
        String(
            attachment.id ??
            attachment.attachmentId ??
            ""
        ).trim();

    if(!attachmentId){

        console.error(
            "KEDU: PDF attachment ID missing.",
            attachment
        );

        return;
    }

    /*
     * Make sure the attachment has a PDF source.
     */
    const pdfFile =
        String(
            attachment.file ??
            attachment.url ??
            attachment.path ??
            attachment.pdf ??
            attachment.src ??
            ""
        ).trim();

    if(!pdfFile){

        console.error(
            "KEDU: PDF file path missing.",
            attachment
        );

        return;
    }

    /*
     * PDF viewer must already be loaded.
     */
    if(
        typeof window.openPdfViewer !==
        "function"
    ){

        console.error(
            "KEDU: openPdfViewer() is not loaded."
        );

        return;
    }

    /*
     * Pass the ORIGINAL attachment object.
     *
     * This keeps:
     * ID
     * title
     * type
     * file
     *
     * together.
     */
    window.openPdfViewer(
        attachment
    );

}

/* ========================================================= */
/* LOAD CHAPTER ATTACHMENTS                                  */
/* ========================================================= */

function loadChapterAttachments(){

    const subjectKey =
        getCurrentAttachmentSubject();


    const chapterNumber =
        getCurrentAttachmentChapterNumber();


    currentAttachmentChapter = {

        subjectKey:
            subjectKey,

        chapterNumber:
            chapterNumber

    };


    /*
     * Get chapter attachment data.
     */

    currentAttachmentList =
        getAttachments(
            subjectKey,
            chapterNumber
        );


    /*
     * Render.
     */

    renderAttachments(
        currentAttachmentList
    );


    console.log(
        "KEDU PW Attachments Loaded:",
        {
            subjectKey:
                subjectKey,

            chapterNumber:
                chapterNumber,

            categories:
                Object.keys(
                    currentAttachmentList
                )
        }
    );

}

/* ========================================================= */
/* SHOW LECTURE TAB                                          */
/* ========================================================= */

function showLectureTab(){

    const lectureList =
        document.getElementById(
            "lecture-list"
        );

    const attachmentList =
        document.getElementById(
            "attachment-list"
        );

    const lectureTab =
        document.getElementById(
            "lecture-tab-btn"
        );

    const attachmentTab =
        document.getElementById(
            "attachment-tab-btn"
        );


    /* Show lectures */

    if(lectureList){

        lectureList.style.display =
            "";

    }


    /* Hide attachments */

    if(attachmentList){

        attachmentList.style.display =
            "none";

    }


    /* Activate Lectures */

    if(lectureTab){

        lectureTab.classList.add(
            "active"
        );

    }


    /* Deactivate Attachments */

    if(attachmentTab){

        attachmentTab.classList.remove(
            "active"
        );

    }


    /* Reset attachment accordion */

    openedAttachmentCategory =
        null;

}


/* ========================================================= */
/* SHOW ATTACHMENT TAB                                       */
/* ========================================================= */

function showAttachmentTab(){

    const lectureList =
        document.getElementById(
            "lecture-list"
        );

    const attachmentList =
        document.getElementById(
            "attachment-list"
        );

    const lectureTab =
        document.getElementById(
            "lecture-tab-btn"
        );

    const attachmentTab =
        document.getElementById(
            "attachment-tab-btn"
        );


    /* Hide lectures */

    if(lectureList){

        lectureList.style.display =
            "none";

    }


    /* Show attachments */

    if(attachmentList){

        attachmentList.style.display =
            "";

    }


    /* Deactivate Lectures */

    if(lectureTab){

        lectureTab.classList.remove(
            "active"
        );

    }


    /* Activate Attachments */

    if(attachmentTab){

        attachmentTab.classList.add(
            "active"
        );

    }


    /* Start with every attachment category closed */

    openedAttachmentCategory =
        null;


    if(attachmentList){

        attachmentList
            .querySelectorAll(
                ".attachment-category-card"
            )
            .forEach(
                card => {

                    card.classList.remove(
                        "open"
                    );


                    const main =
                        card.querySelector(
                            ".attachment-category-main"
                        );


                    if(main){

                        main.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                }
            );

    }


    /* Load current chapter attachments */

    loadChapterAttachments();

}





/* ========================================================= */
/* ATTACHMENT CLICK HANDLER                                  */
/* ========================================================= */

function handleAttachmentClick(
    event
){

    /*
     * Category click.
     */

    const categoryMain =
        event.target.closest(
            ".attachment-category-main"
        );


    if(
        categoryMain
    ){

        const card =
            categoryMain.closest(
                ".attachment-category-card"
            );


        if(
            card
        ){

            toggleAttachmentCategory(
                card
            );

        }

        return;

    }


    /*
     * PDF/material click.
     */

    const fileItem =
        event.target.closest(
            ".attachment-file-item"
        );


    if(
        !fileItem
    ){

        return;

    }


    const attachmentId =
    fileItem.dataset.attachmentId;

const materialType =
    fileItem.dataset.materialType;

const attachment =
    findAttachmentById(
        attachmentId,
        materialType
    );


    if(
        !attachment
    ){

        console.error(
            "KEDU PW: Attachment not found.",
            attachmentId
        );

        return;

    }


    openAttachmentPdf(
        attachment
    );

}


/* ========================================================= */
/* INITIALIZE TABS                                           */
/* ========================================================= */

function initializeAttachmentTabs(){

    const lectureTab =
        document.getElementById(
            "lecture-tab-btn"
        );


    const attachmentTab =
        document.getElementById(
            "attachment-tab-btn"
        );


    if(
        lectureTab &&
        !lectureTab.dataset.attachmentBound
    ){

        lectureTab.addEventListener(
            "click",
            showLectureTab
        );


        lectureTab.dataset.attachmentBound =
            "true";

    }


    if(
        attachmentTab &&
        !attachmentTab.dataset.attachmentBound
    ){

        attachmentTab.addEventListener(
            "click",
            showAttachmentTab
        );


        attachmentTab.dataset.attachmentBound =
            "true";

    }

}


/* ========================================================= */
/* INITIALIZE SYSTEM                                         */
/* ========================================================= */

function initializeAttachmentSystem(){

    initializeAttachmentTabs();


    if(
        window.__keduPwAttachmentClickBound
    ){

        return;

    }


    document.addEventListener(
        "click",
        handleAttachmentClick
    );


    window.__keduPwAttachmentClickBound =
        true;

}


/* ========================================================= */
/* DOM READY                                                 */
/* ========================================================= */

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initializeAttachmentSystem
    );

}
else{

    initializeAttachmentSystem();

}


/* ========================================================= */
/* KEDU PW GLOBAL API                                        */
/* ========================================================= */

window.keduPWAttachments = {

    getAttachments:
        getAttachments,

    loadChapterAttachments:
        loadChapterAttachments,

    renderAttachments:
        renderAttachments,

    showLectureTab:
        showLectureTab,

    showAttachmentTab:
        showAttachmentTab,

    openAttachmentPdf:
        openAttachmentPdf

};


/* ========================================================= */
/* KEDU PW — ATTACHMENT SYSTEM END                           */
/* ========================================================= */