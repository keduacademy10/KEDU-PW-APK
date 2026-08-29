 /* ========================================================= */
/* KEDU PW — PAGE NAVIGATION                                 */
/* ========================================================= */

function showPage(pageName){

    const pageMap = {

    home: "home-page",

    subjects: "subjects-page",

    chapter: "chapter-page",

    lecture: "lecture-page",

    "lecture-player":
        "lecture-player-page",

    download:
        "download-page"

};

    const targetId =
        pageMap[pageName];


    if(!targetId){

        console.error(
            "KEDU PW: Unknown page:",
            pageName
        );

        return;

    }


    const targetPage =
        document.getElementById(
            targetId
        );


    if(!targetPage){

        console.error(
            "KEDU PW: Page not found:",
            targetId
        );

        return;

    }


    /* ===================================================== */
    /* HIDE CLASS / BATCH DETAIL PAGE                       */
    /* ===================================================== */

    const classDetailPage =
        document.getElementById(
            "class-detail-page"
        );


    if(classDetailPage){

        classDetailPage.classList.remove(
            "active"
        );

        classDetailPage.style.display =
            "none";

        classDetailPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* ===================================================== */
    /* HIDE ALL NORMAL PAGES                                 */
    /* ===================================================== */

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.style.display =
                "none";

            page.classList.remove(
                "active"
            );

            page.setAttribute(
                "aria-hidden",
                "true"
            );

        });


    /* ===================================================== */
    /* SHOW TARGET PAGE                                      */
    /* ===================================================== */

    targetPage.style.display =
        "flex";

    targetPage.classList.add(
        "active"
    );

    targetPage.setAttribute(
        "aria-hidden",
        "false"
    );


    /* ===================================================== */
    /* RESET TARGET PAGE SCROLL                              */
    /* ===================================================== */

    requestAnimationFrame(() => {

        const content =
            targetPage.querySelector(
                "main"
            );


        if(content){

            content.scrollTop = 0;

        }


        targetPage.scrollTop = 0;


        window.scrollTo({

            top: 0,

            left: 0,

            behavior: "instant"

        });

    });

}
/* ========================================================= */
/* CHAPTER DATA */
/* ========================================================= */

const chapterData = {

    mathematics: [

        {
            number: "Chapter 1",
            title: "Real Numbers"
        },

        {
            number: "Chapter 2",
            title: "Polynomials"
        },

        {
            number: "Chapter 3",
            title: "Pair Of Linear Equations In Two Variables"
        }

    ],

    science: [

        {
            number: "Chapter 1",
            title: "Chemical Reactions And Equations"
        }

    ]

};


/* ========================================================= */
/* LOAD CHAPTERS */
/* ========================================================= */

function loadChapters(subjectKey){

    const chapterList =
        document.getElementById("chapter-list");

    if(!chapterList) return;

    chapterList.innerHTML = "";

    const chapters =
        chapterData[subjectKey] || [];

    chapters.forEach(chapter=>{

        chapterList.insertAdjacentHTML(

            "beforeend",

            `
            <div class="chapter-card">

                <div class="chapter-accent"></div>

                <p class="chapter-number">
                    ${chapter.number}
                </p>

                <h2 class="chapter-title">
                    ${chapter.title}
                </h2>

            </div>
            `

        );

    });

}


/* ========================================================= */
/* OPEN CHAPTER PAGE */
/* ========================================================= */

function openChapterPage(
    subjectKey,
    subjectName,
    classKey,
    batchKey
){

    window.keduStudyContext = {

        classKey: classKey,

        batchKey: batchKey,

        subjectKey: subjectKey

    };


    document
        .getElementById("chapter-subject-title")
        .textContent = subjectName;


    loadChapters(subjectKey);


    showPage("chapter");

}


/* ========================================================= */
/* BACK BUTTON */
/* ========================================================= */

document
.getElementById("chapter-back-btn")
?.addEventListener("click",()=>{

    showPage("subjects");

});