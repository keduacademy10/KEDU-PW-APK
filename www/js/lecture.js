/* ========================================================= */
/* KEDU ACADEMY                                              */
/* LECTURE.JS                                                */
/* STEP 4 — LECTURE DATA SYSTEM                              */
/* ========================================================= */


/* ========================================================= */
/* LECTURE DATA                                              */
/* ========================================================= */

/*
    IMPORTANT

    This structure is temporary frontend data.

    Later the ADMIN PANEL / BACKEND will provide
    the same structure through an API/database.

    Do NOT manually create 240p/360p/480p/720p/1080p
    entries for every lecture here.

    The backend will provide the processed video data.
*/


const lectureData = {


    mathematics: {


        "Chapter 1": [

            {

                id: "math-c1-l1",

                number: 1,

                title:
                    "Introduction To Real Numbers",

                teacher:
                    "KEDU Academy",

                thumbnail:
    "assets/thumbnails/lectures/demo.jpg",

                duration:
                    "42:15",

uploadedDate:
    "11 Aug 2026",
                /*
                    Temporary video URL.

                    Later this will be replaced by
                    backend-generated HLS/DASH data.
                */

                video:
                    "assets/videos/lectures/demo.mp4",


                /*
                    Optional quality URLs.

                    DO NOT manually create these
                    when using automatic transcoding.

                    They are supported only as fallback.
                */

                videoSources: {

                    "1080":
                        "",

                    "720":
                        "",

                    "480":
                        "",

                    "360":
                        "",

                    "240":
                        ""

                },


                /*
                    Future adaptive streaming URL.
                */

                hls:
                    "",


                /*
                    Download URL.

                    Initially we can provide
                    the master 1080p file.
                */

                download:
                    "",


                description:
                    "In this lecture, we will learn the basic concepts of Real Numbers in a simple and easy-to-understand way.",


                notes:
                    "",


                captions: {

                    hi:
                        "",

                    en:
                        "",

                    ta:
                        "",

                    gu:
                        ""

                },


                channel:
                    "KEDU Academy",

                logo:
                    "assets/logo/kedu-logo.png"

            }

        ],


        "Chapter 2": [],

        "Chapter 3": []

    },


    science: {


        "Chapter 1": [

            {

                id: "science-c1-l1",

                number: 1,

                title:
                    "Chemical Reactions And Equations",

                teacher:
                    "KEDU Academy",

                thumbnail:
    "assets/thumbnails/lectures/demo.jpg",

                duration:
                    "45:20",
uploadedDate:
    "11 Aug 2026",
                video:
                    "assets/videos/lectures/demo.mp4",

                videoSources: {

                    "1080":
                        "",

                    "720":
                        "",

                    "480":
                        "",

                    "360":
                        "",

                    "240":
                        ""

                },

                hls:
                    "",

                download:
                    "",

                description:
                    "Complete introduction to Chemical Reactions and Equations for Class 10 Science.",

                notes:
                    "",

                captions: {

                    hi:
                        "",

                    en:
                        "",

                    ta:
                        "",

                    gu:
                        ""

                },

                channel:
                    "KEDU Academy",

                logo:
                    "assets/logo/kedu-logo.png"

            }

        ]

    }

};


/* ========================================================= */
/* CURRENT LECTURE STATE                                     */
/* ========================================================= */

let currentLectureChapter = null;

let currentLectureList = [];


/* ========================================================= */
/* GET LECTURES                                              */
/* ========================================================= */

function getLectures(
    subjectKey,
    chapterNumber
){

    const subjectLectures =
        lectureData[subjectKey];


    if(!subjectLectures){

        return [];

    }


    return (

        subjectLectures[
            chapterNumber
        ] || []

    );

}


/* ========================================================= */
/* ARRANGE LECTURES                                           */
/* ========================================================= */

function arrangeLectures(
    lectures
){

    return [

        ...lectures

    ]

    .sort(

        (a,b)=>{

            const numberA =
                Number(a.number) || 0;

            const numberB =
                Number(b.number) || 0;

            return (
                numberA -
                numberB
            );

        }

    );

}


/* ========================================================= */
/* RENDER LECTURE CARDS                                      */
/* ========================================================= */

function renderLectures(
    lectures
){

    const lectureList =
        document.getElementById(
            "lecture-list"
        );


    if(!lectureList){

        return;

    }


    lectureList.innerHTML =
        "";


    if(
        !lectures ||
        lectures.length === 0
    ){

        lectureList.innerHTML = `

            <div class="lecture-empty-state">

                <span class="material-symbols-rounded">
                    play_circle
                </span>

                <h3>
                    Lectures Coming Soon
                </h3>

                <p>
                    Lectures for this chapter
                    will be added soon.
                </p>

            </div>

        `;

        return;

    }


    lectures.forEach(
        lecture=>{


            const thumbnail =

                lecture.thumbnail

                ?

                `

                <img

                    src="${lecture.thumbnail}"

                    alt="${lecture.title}"

                    loading="lazy"

                >

                `

                :

                `

                <div
                    class="lecture-thumbnail-placeholder"
                >

                    <span class="material-symbols-rounded">
                        play_circle
                    </span>

                </div>

                `;


            const duration =

                lecture.duration

                ?

                `

                <span
                    class="lecture-duration"
                >

                    ${lecture.duration}

                </span>

                `

                :

                "";


const teacher =

    lecture.teacher

    ?

    `

    <span
        class="lecture-teacher"
    >

        ${lecture.teacher}

    </span>

    `

    :

    "";


const lectureDate =

    lecture.uploadedDate

    ?

    `

    <span
        class="lecture-date"
    >

        ${lecture.uploadedDate}

    </span>

    `

    :

    "";


            lectureList.insertAdjacentHTML(

                "beforeend",

                `

<article
    class="lecture-card"
    data-lecture-id="${lecture.id}"
    onclick="window.handleLectureCardClick(this, event)"
    role="button"
    tabindex="0"
>
                    <div
                        class="lecture-thumbnail"
                    >

                        ${thumbnail}

                        ${duration}

                    </div>


                    <div
                        class="lecture-info"
                    >

                        <img

                            class="lecture-logo"

                            src="assets/logo/kedu-logo.png"

                            alt="KEDU Academy"

                        >


<div
    class="lecture-text"
>

    <h3
        class="lecture-title"
    >

        ${lecture.title}

    </h3>


    ${teacher}


    ${lectureDate}

</div>
                    </div>

                </article>

                `

            );

        }

    );

}
/* ========================================================= */
/* DIRECT LECTURE CARD OPEN                                  */
/* ========================================================= */

window.handleLectureCardClick =
function(card, event){

    if(event){

        event.preventDefault();

        event.stopPropagation();

    }


    if(!card){

        console.error(
            "KEDU: Lecture card not found."
        );

        return;

    }


    const lectureId =
        card.getAttribute(
            "data-lecture-id"
        );


    console.log(
        "KEDU: Lecture card tapped:",
        lectureId
    );


    if(!lectureId){

        console.error(
            "KEDU: Lecture ID missing."
        );

        return;

    }


    const lecture =
        currentLectureList.find(

            item =>

                String(item.id) ===
                String(lectureId)

        );


    if(!lecture){

        console.error(
            "KEDU: Lecture not found:",
            lectureId,
            currentLectureList
        );

        return;

    }


    console.log(
        "KEDU: Opening lecture:",
        lecture.title
    );


    if(
        typeof window.openLecturePlayer !==
        "function"
    ){

        console.error(
            "KEDU: openLecturePlayer() is not available."
        );

        return;

    }


    window.openLecturePlayer(
        lecture
    );

};

/* ========================================================= */
/* OPEN LECTURE PAGE                                         */
/* ========================================================= */

function openLecturePage(

    subjectKey,

    chapterNumber,

    chapterTitle

){

    currentLectureChapter = {

        subjectKey:
            subjectKey,

        chapterNumber:
            chapterNumber,

        chapterTitle:
            chapterTitle

    };
window.currentLectureChapter =
    currentLectureChapter;

    const chapterTitleElement =
        document.getElementById(
            "lecture-chapter-title"
        );


    if(chapterTitleElement){

        chapterTitleElement.textContent =
            chapterTitle;

    }


    const lectures =
        getLectures(

            subjectKey,

            chapterNumber

        );


    currentLectureList =
        arrangeLectures(
            lectures
        );


    renderLectures(
        currentLectureList
    );


    resetLectureTabs();


    showPage(
        "lecture"
    );

}


/* ========================================================= */
/* RESET LECTURE TABS                                        */
/* ========================================================= */

function resetLectureTabs(){

    const lectureTab =
        document.getElementById(
            "lecture-tab-btn"
        );


    const attachmentTab =
        document.getElementById(
            "attachment-tab-btn"
        );


    const lectureList =
        document.getElementById(
            "lecture-list"
        );


    const attachmentList =
        document.getElementById(
            "attachment-list"
        );


    lectureTab?.classList.add(
        "active"
    );


    attachmentTab?.classList.remove(
        "active"
    );


    if(lectureList){

        lectureList.style.display =
            "flex";

    }


    if(attachmentList){

        attachmentList.style.display =
            "none";

    }

}


/* ========================================================= */
/* LECTURE TAB                                               */
/* ========================================================= */

document

    .getElementById(
        "lecture-tab-btn"
    )

    ?.addEventListener(

        "click",

        ()=>{

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


            lectureTab?.classList.add(
                "active"
            );


            attachmentTab?.classList.remove(
                "active"
            );


            if(lectureList){

                lectureList.style.display =
                    "flex";

            }


            if(attachmentList){

                attachmentList.style.display =
                    "none";

            }

        }

    );





/* ========================================================= */
/* CHAPTER CARD CLICK                                        */
/* ========================================================= */

document.addEventListener(

    "click",

    event=>{


        const chapterCard =
            event.target.closest(
                ".chapter-card"
            );


        if(!chapterCard){

            return;

        }


        const chapterNumber =

            chapterCard

                .querySelector(
                    ".chapter-number"
                )

                ?.textContent

                .trim();


        const chapterTitle =

            chapterCard

                .querySelector(
                    ".chapter-title"
                )

                ?.textContent

                .trim();


        const subjectTitle =

            document

                .getElementById(
                    "chapter-subject-title"
                )

                ?.textContent

                .trim();


        if(
            !chapterNumber ||
            !chapterTitle
        ){

            return;

        }


        let subjectKey =

            subjectTitle

                ?.toLowerCase()

                .replace(
                    /[^a-z0-9]/g,
                    ""
                );


        if(
            subjectKey &&
            !lectureData[
                subjectKey
            ]
        ){

            if(

                subjectTitle
                    ?.toLowerCase()
                    .includes(
                        "math"
                    )

            ){

                subjectKey =
                    "mathematics";

            }


            else if(

                subjectTitle
                    ?.toLowerCase()
                    .includes(
                        "science"
                    )

            ){

                subjectKey =
                    "science";

            }

        }


        openLecturePage(

            subjectKey,

            chapterNumber,

            chapterTitle

        );

    }

);




/* ========================================================= */
/* LECTURE BACK BUTTON                                       */
/* ========================================================= */

document

    .getElementById(
        "lecture-back-btn"
    )

    ?.addEventListener(

        "click",

        ()=>{

            showPage(
                "chapter"
            );

        }

    );


/* ========================================================= */
/* PUBLIC DATA API                                           */
/* ========================================================= */

/*
    These functions will later allow the
    ADMIN PANEL / API to update lecture data
    without changing the player.
*/

window.getLectures =
    getLectures;


window.getLectureData =
    ()=>lectureData;


window.arrangeLectures =
    arrangeLectures;


/* ========================================================= */
/* READY                                                      */
/* ========================================================= */

console.log(
    "KEDU Academy Lecture Data System Ready"
);


/* ========================================================= */
/* END                                                        */
/* ========================================================= */