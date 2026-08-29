/* ========================================================= */
/* KEDU ACADEMY                                              */
/* LECTURE-PLAYER.JS                                         */
/* STEP 3 — LECTURE PLAYER ENGINE                            */
/* ========================================================= */


/* ========================================================= */
/* PLAYER STATE                                               */
/* ========================================================= */

let currentPlayerLecture = null;

let currentPlayerIndex = -1;

let currentPlayerList = [];

/*
 * Object URL created from a cached
 * downloaded lecture video.
 */
let currentDownloadedObjectUrl =
    null;
/* ========================================================= */
/* MINI PLAYER STATE                                         */
/* ========================================================= */

let miniPlayerMode = false;
let playerPreviousPage = "lecture";
/* ========================================================= */
/* GLOBAL MINI PLAYER STATE                                  */
/* ========================================================= */

let miniPlayerSide =
    localStorage.getItem(
        "keduMiniPlayerSide"
    ) || "right";

let miniPlayerDragging = false;

let miniPlayerMoved = false;

let miniPlayerStartX = 0;

let miniPlayerStartY = 0;

let miniPlayerStartBottom = 70;

let miniPlayerWasPlaying = false;
let autoplayEnabled =
    localStorage.getItem("keduAutoplay") !== "false";

let resumeEnabled =
    localStorage.getItem("keduResume") !== "false";

let captionMemoryEnabled =
    localStorage.getItem("keduCaptionMemory") === "true";

let selectedCaption =
    captionMemoryEnabled
        ? localStorage.getItem("keduCaption") || "off"
        : "off";

let selectedQuality = "auto";

let autoplayTimer = null;

let autoplayInterval = null;

let playerControlsTimer = null;

let playerControlsVisible = true;

let miniPlayerControlsTimer = null;

let miniPlayerControlsVisible = true;

let videoTapTimer = null;

let miniVideoTapTimer = null;

let videoLastTapTime = 0;

let videoLastTapX = 0;
let videoSwipeStartX = 0;
let videoSwipeStartY = 0;
let videoSwipeActive = false;
let videoTouchHandled =
    false;
let miniLastTapTime = 0;

let playerLocked = false;

let playerSettingsOpen = false;


/* ========================================================= */
/* DOM HELPERS                                                */
/* ========================================================= */

function playerElement(id){

    return document.getElementById(id);

}
/* ========================================================= */
/* PLAYER CONTROL VISIBILITY                                 */
/* ========================================================= */

function showPlayerControls(autoHide = true){

    if(!playerVideoSection){
        return;
    }

    if(playerLocked){
        return;
    }
if(videoTouchHandled){
    return;
}
    playerControlsVisible = true;

    playerVideoSection.classList.remove(
        "player-controls-hidden"
    );

    if(playerControlsTimer){
        clearTimeout(
            playerControlsTimer
        );
    }

    if(autoHide){

        playerControlsTimer =
            setTimeout(
                () => {

                    hidePlayerControls();

                },
                8000
            );
}
}


/* ========================================================= */
/* HIDE PLAYER CONTROLS                                      */
/* ========================================================= */

function hidePlayerControls(){

    if(!playerVideoSection){
        return;
    }

    if(playerLocked){
        return;
    }

    playerControlsVisible = false;

    playerVideoSection.classList.add(
        "player-controls-hidden"
    );

    if(playerControlsTimer){

        clearTimeout(
            playerControlsTimer
        );

        playerControlsTimer = null;

    }

}


/* ========================================================= */
/* TOGGLE PLAYER CONTROLS                                    */
/* ========================================================= */

function togglePlayerControls(){

    if(playerLocked){
        return;
    }

    if(playerControlsVisible){

        hidePlayerControls();

    }

    else{

        showPlayerControls(true);

    }

}


/* ========================================================= */
/* MINI PLAYER CONTROL VISIBILITY                            */
/* ========================================================= */

function showMiniPlayerControls(autoHide = true){

    if(!miniPlayer){
        return;
    }

    miniPlayerControlsVisible = true;

    miniPlayer.classList.remove(
        "mini-controls-hidden"
    );

    if(miniPlayerControlsTimer){

        clearTimeout(
            miniPlayerControlsTimer
        );

    }

    if(autoHide){

        miniPlayerControlsTimer =
            setTimeout(
                () => {

                    hideMiniPlayerControls();

                },
                8000
            );

    }

}


/* ========================================================= */
/* HIDE MINI PLAYER CONTROLS                                 */
/* ========================================================= */

function hideMiniPlayerControls(){

    if(!miniPlayer){
        return;
    }

    miniPlayerControlsVisible = false;

    miniPlayer.classList.add(
        "mini-controls-hidden"
    );

    if(miniPlayerControlsTimer){

        clearTimeout(
            miniPlayerControlsTimer
        );

        miniPlayerControlsTimer = null;

    }

}


/* ========================================================= */
/* TOGGLE MINI PLAYER CONTROLS                               */
/* ========================================================= */

function toggleMiniPlayerControls(){

    if(miniPlayerControlsVisible){

        hideMiniPlayerControls();

    }

    else{

        showMiniPlayerControls(true);

    }

}
/* ========================================================= */
/* PUBLIC API — BOOTSTRAP EARLY                               */
/* ========================================================= */

window.openLecturePlayer = openLecturePlayer;
window.closeLecturePlayer = closeLecturePlayer;
/* ========================================================= */
/* LECTURE CARD CLICK FALLBACK                               */
/* ========================================================= */

document.addEventListener(
    "click",
    function(event){

        const card =
            event.target.closest(
                ".lecture-card"
            );

        if(!card){
            return;
        }


        /*
         * The normal lecture.js handler
         * gets the first chance to open
         * the player.
         *
         * If it already opened the player,
         * do nothing here.
         */

        if(
            playerPage &&
            playerPage.classList.contains(
                "active"
            )
        ){

            return;

        }


        const lectureId =
            card.getAttribute(
                "data-lecture-id"
            );


        if(!lectureId){

            console.error(
                "KEDU: Lecture card has no lecture ID."
            );

            return;

        }


        /*
         * currentLectureList is created
         * by lecture.js and is available
         * to this classic script.
         */

        if(
            !Array.isArray(
                currentLectureList
            )
        ){

            console.error(
                "KEDU: currentLectureList is not available."
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
                lectureId
            );

            return;

        }


        console.log(
            "KEDU: Fallback opening lecture:",
            lecture.title
        );


        openLecturePlayer(
            lecture
        );

    },
    true
);
window.playNextLecture = playNextLecture;
window.playPreviousLecture = playPreviousLecture;
/* ========================================================= */
/* MAIN PLAYER ELEMENTS                                      */
/* ========================================================= */

const playerPage =
    playerElement("lecture-player-page");

const playerVideo =
    playerElement("lecture-player-video");

const playerLockOverlay =
    playerElement("kedu-player-lock-overlay");

const playerUnlockButton =
    playerElement("kedu-player-unlock-btn");

const miniPlayer =
    playerElement(
        "kedu-mini-player"
    );

const miniPlayerVideo =
    playerElement(
        "kedu-mini-player-video"
    );

const miniPlayerPlay =
    playerElement(
        "kedu-mini-player-play"
    );

const miniPlayerClose =
    playerElement(
        "kedu-mini-player-close"
    );
const playerVideoSource =
    playerElement("lecture-player-video-source");

const playerTitle =
    playerElement("lecture-player-title");
const playerTitlePreview =
    playerElement("lecture-player-title-preview");

const playerDescriptionMore =
    playerElement("lecture-player-description-toggle");
const playerNumber =
    playerElement("lecture-player-number");

const playerDurationText =
    playerElement("lecture-player-duration-text");

const playerCurrentTime =
    playerElement("lecture-player-current-time");

const playerDuration =
    playerElement("lecture-player-duration");

const playerProgress =
    playerElement("lecture-player-progress");

const playerPlayButton =
    playerElement("lecture-player-play-btn");

const playerPlayIcon =
    playerElement("lecture-player-play-icon");

const playerPreviousButton =
    playerElement("lecture-player-previous-btn");

const playerNextButton =
    playerElement("lecture-player-next-btn");

const playerBackButton =
    playerElement("lecture-player-back-btn");

const playerFullscreenButton =
    playerElement("lecture-player-fullscreen-btn");

const playerBuffering =
    playerElement("lecture-player-buffering");

const playerError =
    playerElement("lecture-player-error");

const playerUnavailable =
    playerElement("lecture-player-unavailable");

const playerRetry =
    playerElement("lecture-player-retry-btn");

const playerDescriptionToggle =
    playerElement("lecture-player-description-toggle");

const playerDescriptionSheet =
    playerElement("lecture-player-description-sheet");

const playerDescriptionClose =
    playerElement("lecture-player-description-close");

const playerDescriptionSheetTitle =
    playerElement("lecture-player-description-sheet-title");

const playerDescriptionBody =
    playerElement("lecture-player-description-body");

const playerDescriptionLikes =
    playerElement("lecture-player-description-likes");

const playerDescriptionViews =
    playerElement("lecture-player-description-views");

const playerDescriptionDate =
    playerElement("lecture-player-description-date");

const playerDescriptionChannelLogo =
    playerElement("lecture-player-description-channel-logo");

const playerDescriptionChannelName =
    playerElement("lecture-player-description-channel-name");

const playerDescriptionSubscribeButton =
    playerElement("lecture-player-description-subscribe-btn");

const playerVideoDetailDate =
    playerElement("lecture-player-video-detail-date");

const playerVideoDetailViews =
    playerElement("lecture-player-video-detail-views");

const playerVideoDetailLikes =
    playerElement("lecture-player-video-detail-likes");

const playerChannelName =
    playerElement("lecture-player-channel-name");

const playerChannelLogo =
    playerElement("lecture-player-channel-logo");

const playerSubscribeButton =
    playerElement("lecture-player-subscribe-btn");

const playerNotesButton =
    playerElement("lecture-player-notes-btn");

const playerLikeButton =
    playerElement("lecture-player-like-btn");

const playerUnlikeButton =
    playerElement("lecture-player-unlike-btn");

const playerShareButton =
    playerElement("lecture-player-share-btn");
/* ========================================================= */
/* FULLSCREEN ACTION BUTTONS                                 */
/* ========================================================= */

const fullscreenLikeButton =
    playerElement(
        "lecture-player-fullscreen-like"
    );

const fullscreenUnlikeButton =
    playerElement(
        "lecture-player-fullscreen-unlike"
    );

const fullscreenShareButton =
    playerElement(
        "lecture-player-fullscreen-share"
    );
const playerDownloadButton =
    playerElement("lecture-player-download-btn");

const playerSettingsButton =
    playerElement("lecture-player-settings-btn");
const playerSettingsPanel =
    playerElement("lecture-player-settings-panel");

const playerSettingsClose =
    playerElement("lecture-player-settings-close");

const playerQualityOption =
    playerElement("lecture-player-quality-option");

const playerSpeedOption =
    playerElement("lecture-player-speed-option");

const playerCaptionOption =
    playerElement("lecture-player-caption-option");

const playerAutoplayOption =
    playerElement("lecture-player-autoplay-option");

const playerResumeOption =
    playerElement("lecture-player-resume-option");

const playerCaptionMemoryOption =
    playerElement("lecture-player-caption-memory-option");

const playerLockOption =
    playerElement("lecture-player-lock-option");

const playerMoreOption =
    playerElement("lecture-player-more-option");

const playerCurrentQuality =
    playerElement("lecture-player-current-quality");

const playerCurrentSpeed =
    playerElement("lecture-player-current-speed");

const playerCurrentCaption =
    playerElement("lecture-player-current-caption");

const playerAutoplayStatus =
    playerElement("lecture-player-autoplay-status");

const qualityPanel =
    playerElement("lecture-player-quality-panel");

const speedPanel =
    playerElement("lecture-player-speed-panel");
/* ========================================================= */
/* DOWNLOAD QUALITY PANEL                                   */
/* ========================================================= */

const downloadQualityPanel =
    playerElement(
        "lecture-player-download-quality-panel"
    );

const downloadQualityClose =
    playerElement(
        "lecture-player-download-quality-close"
    );

const downloadQualityButtons =
    document.querySelectorAll(
        ".lecture-player-download-quality-btn"
    );
const speedRange =
    playerElement("lecture-player-speed-range");

const speedDisplay =
    playerElement("lecture-player-speed-display");

const speedMinus =
    playerElement("lecture-player-speed-minus");

const speedPlus =
    playerElement("lecture-player-speed-plus");

const captionPanel =
    playerElement("lecture-player-caption-panel");

const autoplayButton =
    playerElement("lecture-player-autoplay-btn");

const captionButton =
    playerElement("lecture-player-caption-btn");

const autoplayCountdown =
    playerElement("lecture-player-autoplay-countdown");

const countdownNumber =
    playerElement("lecture-player-countdown");

const autoplayCancel =
    playerElement("lecture-player-autoplay-cancel");

const continueList =
    playerElement("lecture-player-continue-list");

const recommendList =
    playerElement("lecture-player-recommend-list");

const relatedList =
    playerElement("lecture-player-related-list");

/* ========================================================= */
/* FULLSCREEN PANEL HOST                                      */
/* ========================================================= */

const playerVideoSection =
    playerElement("lecture-player-video-section");

function movePlayerPanelsIntoVideoSection(){

    if(!playerVideoSection){
        return;
    }

    [
        playerSettingsPanel,
        qualityPanel,
        speedPanel,
        captionPanel
    ].forEach(panel => {

        if(
            panel &&
            panel.parentElement !== playerVideoSection
        ){
            playerVideoSection.appendChild(panel);
        }

    });

}

/* Panels must be descendants of the fullscreen element. */
movePlayerPanelsIntoVideoSection();
/* ========================================================= */
/* LECTURE ATTACHMENT SHEET                                  */
/* ========================================================= */

let playerAttachmentSheet = null;
let playerAttachmentBackdrop = null;


/* --------------------------------------------------------- */
/* CREATE ATTACHMENT SHEET                                   */
/* --------------------------------------------------------- */

function createLectureAttachmentSheet(){

    if(
        playerAttachmentSheet &&
        document.body.contains(
            playerAttachmentSheet
        )
    ){

        return;

    }


    playerAttachmentBackdrop =
        document.createElement("div");

    playerAttachmentBackdrop.className =
        "kedu-attachment-backdrop";


    playerAttachmentSheet =
        document.createElement("section");

    playerAttachmentSheet.id =
        "kedu-lecture-attachment-sheet";

    playerAttachmentSheet.className =
        "kedu-lecture-attachment-sheet";

    playerAttachmentSheet.setAttribute(
        "role",
        "dialog"
    );

    playerAttachmentSheet.setAttribute(
        "aria-modal",
        "true"
    );


    playerAttachmentSheet.innerHTML = `

        <div class="kedu-attachment-sheet-handle"></div>

        <div class="kedu-attachment-sheet-header">

            <h2>
                Attachments
            </h2>

            <button
                type="button"
                class="kedu-attachment-sheet-close"
                aria-label="Close attachments"
            >
                <span class="material-symbols-rounded">
                    close
                </span>
            </button>

        </div>


        <div class="kedu-attachment-sheet-body">

            <div class="kedu-attachment-section-title">

                <span>
                    Notes
                </span>

                <span class="material-symbols-rounded">
                    expand_less
                </span>

            </div>


            <div
                class="kedu-attachment-list"
                id="kedu-attachment-list"
            ></div>

        </div>

    `;


    document.body.appendChild(
        playerAttachmentBackdrop
    );

    document.body.appendChild(
        playerAttachmentSheet
    );


    const closeButton =
        playerAttachmentSheet.querySelector(
            ".kedu-attachment-sheet-close"
        );


    closeButton?.addEventListener(
        "click",
        closeLectureAttachmentSheet
    );


    playerAttachmentBackdrop.addEventListener(
        "click",
        closeLectureAttachmentSheet
    );

}


/* --------------------------------------------------------- */
/* CLOSE ATTACHMENT SHEET                                    */
/* --------------------------------------------------------- */

function closeLectureAttachmentSheet(){

    if(
        playerAttachmentSheet
    ){

        playerAttachmentSheet.classList.remove(
            "active"
        );

    }


    if(
        playerAttachmentBackdrop
    ){

        playerAttachmentBackdrop.classList.remove(
            "active"
        );

    }


    document.body.classList.remove(
        "kedu-attachment-sheet-open"
    );

}


/* --------------------------------------------------------- */
/* GET CURRENT LECTURE NOTES                                 */
/* --------------------------------------------------------- */

function getCurrentLectureNotes(){

    if(!currentPlayerLecture){

        return null;

    }


    const lecture =
        currentPlayerLecture;


    let notes =
        lecture.notes ||
        lecture.notesUrl ||
        lecture.pdf ||
        lecture.attachment ||
        lecture.lectureNotes ||
        lecture.lectureNotesUrl ||
        lecture.pdfUrl ||
        null;


    if(
        !notes &&
        Array.isArray(
            lecture.attachments
        )
    ){

        notes =
            lecture.attachments.find(
                attachment => {

                    const type =
                        String(
                            attachment?.type ||
                            attachment?.kind ||
                            ""
                        )
                        .trim()
                        .toLowerCase();


                    const title =
                        String(
                            attachment?.title ||
                            attachment?.name ||
                            ""
                        )
                        .trim()
                        .toLowerCase();


                    return (

                        type === "pdf" ||

                        type === "notes" ||

                        type === "lecture-notes" ||

                        title.includes(
                            "lecture notes"
                        ) ||

                        title.includes(
                            "notes"
                        )

                    );

                }
            ) || null;

    }


    if(!notes){

        return {

            id:
                lecture.id,

            title:
                "Lecture Notes",

file:
    `assets/pdf/lecture-notes/${lecture.id}.pdf`

        };

    }


    if(
        typeof notes === "object"
    ){

        const attachmentId =
            notes.id ||
            lecture.id;


        return {

            ...notes,

            id:
                attachmentId,

            title:
                notes.title ||
                notes.name ||
                "Lecture Notes",

            file:
                notes.file ||
                notes.url ||
                notes.path ||
                notes.pdf ||
notes.src ||
`assets/pdf/lecture-notes/${attachmentId}.pdf`

        };

    }


    return {

        id:
            lecture.id,

        title:
            "Lecture Notes",

        file:
            String(notes)

    };

}


/* --------------------------------------------------------- */
/* OPEN ATTACHMENT SHEET                                     */
/* --------------------------------------------------------- */

function openLectureAttachmentSheet(){

    createLectureAttachmentSheet();


    const list =
        document.getElementById(
            "kedu-attachment-list"
        );


    if(!list){

        return;

    }


    list.innerHTML =
        "";


    const notes =
        getCurrentLectureNotes();


    if(
        !notes ||
        !notes.file
    ){

        list.innerHTML = `

            <div class="kedu-attachment-empty">

                <span class="material-symbols-rounded">
                    description
                </span>

                <p>
                    Lecture Notes are not available yet.
                </p>

            </div>

        `;

    }

    else{

        const item =
            document.createElement(
                "button"
            );


        item.type =
            "button";


        item.className =
            "kedu-attachment-item";


        item.innerHTML = `

            <span class="kedu-attachment-icon">

                <span class="material-symbols-rounded">
                    picture_as_pdf
                </span>

            </span>


            <span class="kedu-attachment-info">

                <strong>
                    Lecture Notes
                </strong>

                <small>
                    PDF Notes
                </small>

            </span>


            <span class="material-symbols-rounded kedu-attachment-arrow">
                chevron_right
            </span>

        `;


        item.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();


                /*
                 * Close the sheet first.
                 * Then open the PDF viewer.
                 */

                closeLectureAttachmentSheet();


                openLectureAttachment(
                    notes
                );

            }
        );


        list.appendChild(
            item
        );

    }


    requestAnimationFrame(
        () => {

            playerAttachmentBackdrop
                ?.classList.add(
                    "active"
                );


            playerAttachmentSheet
                ?.classList.add(
                    "active"
                );


            document.body.classList.add(
                "kedu-attachment-sheet-open"
            );

        }
    );

}


/* --------------------------------------------------------- */
/* OPEN LECTURE PDF                                          */
/* --------------------------------------------------------- */

function openLectureAttachment(
    attachment
){

    if(!attachment){

        showPlayerToast(
            "Lecture Notes are not available yet"
        );

        return;

    }


    const lectureId =
        attachment.id ||
        currentPlayerLecture?.id;

    const safeAttachment = {
        ...attachment,

        id:
            lectureId,

        title:
            attachment.title ||
            "Lecture Notes",

        /*
         * Always use the lecture PDF path first.
         * Keep the original attachment path as fallback.
         */
        file:
            `assets/pdf/lecture-notes/${lectureId}.pdf`,

        __originalAttachmentFile:
            attachment.file ||
            attachment.url ||
            attachment.path ||
            null
    };


    if(
        typeof openPdfViewer ===
        "function"
    ){
        openPdfViewer({
    ...safeAttachment,

    __openInsideLecturePlayer:
        true

});

        return;

    }


    showPlayerToast(
        "PDF Viewer is not available"
    );

}



/* ========================================================= */
/* ========================================================= */
/* LECTURE FILTER SYSTEM                                     */
/* ========================================================= */

const lectureFilterSection =
    document.getElementById(
        "lecture-player-filter-section"
    );

const lectureFilterChips =
    document.querySelectorAll(
        ".lecture-player-filter-chip"
    );

const recentSection =
    document.getElementById(
        "lecture-player-recent-section"
    );

const recentList =
    document.getElementById(
        "lecture-player-recent-list"
    );

let activeLectureFilter = "all";


function getFilteredPlayerLectures(){

    const lectures =
        Array.isArray(currentPlayerList)
            ? [...currentPlayerList]
            : [];

    return lectures.filter(
        lecture => {

            if(
                !currentPlayerLecture
            ){
                return true;
            }

            return String(lecture.id) !==
                String(
                    currentPlayerLecture.id
                );
        }
    );

}


function renderRecentLectures(){

    if(!recentList){
        return;
    }

    recentList.innerHTML = "";

    const lectures =
        getFilteredPlayerLectures()
            .slice(0,5);

    lectures.forEach(
        lecture => {

            recentList.insertAdjacentHTML(
                "beforeend",

                createRelatedCard(
                    lecture
                )
            );

        }
    );

}


function applyLectureFilter(
    filter
){

    activeLectureFilter =
        filter || "all";


    /* ----------------------------------------------------- */
    /* UPDATE CHIP                                           */
    /* ----------------------------------------------------- */

    lectureFilterChips.forEach(
        chip => {

            chip.classList.toggle(
                "active",

                chip.dataset.filter ===
                activeLectureFilter
            );

        }
    );


    /* ----------------------------------------------------- */
    /* HIDE ALL CONTENT                                      */
    /* ----------------------------------------------------- */

    document
        .getElementById(
            "lecture-player-continue-section"
        )
        ?.classList.add(
            "filter-hidden"
        );

    document
        .getElementById(
            "lecture-player-recommend-section"
        )
        ?.classList.add(
            "filter-hidden"
        );

    document
        .getElementById(
            "lecture-player-related-section"
        )
        ?.classList.add(
            "filter-hidden"
        );


    if(recentSection){
        recentSection.hidden = true;
    }


    /* ----------------------------------------------------- */
    /* ALL                                                     */
    /* ----------------------------------------------------- */

if(
    activeLectureFilter ===
    "all"
){

    return;
}

    /* ----------------------------------------------------- */
    /* RECOMMEND                                              */
    /* ----------------------------------------------------- */

    if(
        activeLectureFilter ===
        "recommend"
    ){

        document
            .getElementById(
                "lecture-player-recommend-section"
            )
            ?.classList.remove(
                "filter-hidden"
            );

        return;
    }


    /* ----------------------------------------------------- */
    /* RELATED                                                */
    /* ----------------------------------------------------- */

    if(
        activeLectureFilter ===
        "related"
    ){

        document
            .getElementById(
                "lecture-player-related-section"
            )
            ?.classList.remove(
                "filter-hidden"
            );

        return;
    }


    /* ----------------------------------------------------- */
    /* RECENTLY UPLOADED                                      */
    /* ----------------------------------------------------- */

    if(
        activeLectureFilter ===
        "recent"
    ){

        renderRecentLectures();

        if(recentSection){
            recentSection.hidden = false;
        }

        return;
    }


    /* ----------------------------------------------------- */
    /* FROM KEDU ACADEMY                                      */
    /* ----------------------------------------------------- */

    if(
        activeLectureFilter ===
        "kedu"
    ){

        if(recentList){

            recentList.innerHTML = "";

            getFilteredPlayerLectures()
                .filter(
                    lecture =>
                        String(
                            lecture.channel ||
                            ""
                        )
                        .trim()
                        .toLowerCase()
                        ===
                        "kedu academy"
                )
                .forEach(
                    lecture => {

                        recentList
                            .insertAdjacentHTML(
                                "beforeend",

                                createRelatedCard(
                                    lecture
                                )
                            );

                    }
                );

        }

        if(recentSection){

            recentSection.hidden =
                false;

            const heading =
                recentSection.querySelector(
                    "h2"
                );

            if(heading){

                heading.textContent =
                    "From KEDU Academy";

            }

        }

    }

}


/* ========================================================= */
/* FILTER CHIP CLICK                                         */
/* ========================================================= */

lectureFilterChips.forEach(
    chip => {

        chip.addEventListener(
            "click",

            () => {

                applyLectureFilter(
                    chip.dataset.filter
                );

            }
        );

    }
);

/* ========================================================= */
/* FORMAT TIME                                                */
/* ========================================================= */

function formatPlayerTime(seconds){

    if(!Number.isFinite(seconds) || seconds < 0){

        return "0:00";

    }

    const totalSeconds =
        Math.floor(seconds);

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const secs =
        totalSeconds % 60;

    if(hours > 0){

        return (

            hours +

            ":" +

            String(minutes).padStart(2,"0") +

            ":" +

            String(secs).padStart(2,"0")

        );

    }

    return (

        minutes +

        ":" +

        String(secs).padStart(2,"0")

    );

}


/* ========================================================= */
/* ESCAPE HTML                                                */
/* ========================================================= */

function escapePlayerHTML(value){

    return String(value ?? "")

        .replace(/&/g,"&amp;")

        .replace(/</g,"&lt;")

        .replace(/>/g,"&gt;")

        .replace(/"/g,"&quot;")

        .replace(/'/g,"&#039;");

}


/* ========================================================= */
/* GET VIDEO URL                                              */
/* ========================================================= */

function getLectureVideoUrl(lecture){

    if(!lecture){

        return "";

    }

    return (

        lecture.video ||

        lecture.videoUrl ||

        lecture.videoURL ||

        lecture.url ||

        lecture.video240 ||

        lecture.video360 ||

        lecture.video480 ||

        lecture.video720 ||

        lecture.video1080 ||

        ""

    );

}


/* ========================================================= */
/* GET VIDEO SOURCES                                          */
/* ========================================================= */

function getLectureSources(
    lecture
){

    if(!lecture){

        return {};

    }


    const sources = {};


    /* ----------------------------------------------------- */
    /* BACKEND QUALITY OBJECT                                */
    /* ----------------------------------------------------- */

    if(
        lecture.quality &&
        typeof lecture.quality ===
            "object"
    ){

        Object.keys(
            lecture.quality
        ).forEach(
            quality => {

                if(
                    lecture.quality[
                        quality
                    ]
                ){

                    sources[
                        String(quality)
                    ] =
                        lecture.quality[
                            quality
                        ];

                }

            }
        );

    }


    /* ----------------------------------------------------- */
    /* CURRENT KEDU DATA STRUCTURE                            */
    /* ----------------------------------------------------- */

    if(
        lecture.videoSources &&
        typeof lecture.videoSources ===
            "object"
    ){

        Object.keys(
            lecture.videoSources
        ).forEach(
            quality => {

                if(
                    lecture.videoSources[
                        quality
                    ] &&
                    !sources[
                        String(quality)
                    ]
                ){

                    sources[
                        String(quality)
                    ] =
                        lecture.videoSources[
                            quality
                        ];

                }

            }
        );

    }


    /* ----------------------------------------------------- */
    /* BACKWARD COMPATIBILITY                                 */
    /* ----------------------------------------------------- */

    const fallbackQualityFields = [

        "144",
        "240",
        "360",
        "480",
        "720",
        "1080"

    ];


    fallbackQualityFields.forEach(
        quality => {

            const key =
                "video" +
                quality;


            if(
                lecture[key] &&
                !sources[quality]
            ){

                sources[quality] =
                    lecture[key];

            }

        }
    );


    return sources;

}
/* ========================================================= */
/* GET SELECTED VIDEO URL                                     */
/* ========================================================= */

function getSelectedVideoUrl(lecture){

    const sources =
        getLectureSources(lecture);

    if(
        selectedQuality !== "auto" &&
        sources[selectedQuality]
    ){

        return sources[selectedQuality];

    }

    return getLectureVideoUrl(lecture);

}


/* ========================================================= */
/* OPEN LECTURE PLAYER                                       */
/* ========================================================= */

function openLecturePlayer(lecture){

    if(!lecture){

        return;

    }


    /* ===================================================== */
    /* MINI PLAYER IS ACTIVE                                  */
    /* ===================================================== */

    if(miniPlayerMode){

        const sameLecture =
            currentPlayerLecture &&
            String(
                currentPlayerLecture.id
            ) ===
            String(
                lecture.id
            );


        /*
         * Same lecture:
         * simply open the full player.
         */

        if(sameLecture){

            openFullFromMiniPlayer();

            return;

        }


        /*
         * Different lecture:
         * close mini and load new lecture.
         */

        if(miniPlayerVideo){

            miniPlayerVideo.pause();

        }

        hideGlobalMiniPlayer();

        miniPlayerMode =
            false;

    }


    currentPlayerLecture =
        lecture;


    if(
        typeof currentLectureList !==
        "undefined" &&
        Array.isArray(
            currentLectureList
        )
    ){

        currentPlayerList =
            currentLectureList;

    }

    else{

        currentPlayerList =
            [];

    }


    currentPlayerIndex =
        currentPlayerList.findIndex(
            item =>
                String(item.id) ===
                String(lecture.id)
        );


    showLecturePlayer();


    populateLecturePlayer(
        lecture
    );

}

/* ========================================================= */
/* SHOW LECTURE PLAYER                                       */
/* ========================================================= */

function showLecturePlayer(){

    if(!playerPage){

        console.error(
            "KEDU: lecture-player-page not found."
        );

        return;

    }


    /* ----------------------------------------------------- */
    /* REMEMBER CURRENT PAGE                                 */
    /* ----------------------------------------------------- */

    const activePage =
        document.querySelector(
            ".page.active"
        );


    if(
        activePage &&
        activePage !== playerPage
    ){

        const activeId =
            activePage.id || "";


        if(
            activeId.endsWith("-page")
        ){

            playerPreviousPage =
                activeId.replace(
                    "-page",
                    ""
                );

        }

    }


    /* ----------------------------------------------------- */
    /* HIDE ACTIVE STATE FROM OTHER PAGES                    */
    /* ----------------------------------------------------- */

    document
        .querySelectorAll(".page")
        .forEach(page => {

            if(
                page !== playerPage
            ){

                page.classList.remove(
                    "active"
                );

            }

        });


    /* ----------------------------------------------------- */
    /* OPEN LECTURE PLAYER PAGE                              */
    /* ----------------------------------------------------- */

    playerPage.classList.add(
        "active"
    );


    playerPage.style.display =
        "block";


    playerPage.classList.remove(
        "mini-player"
    );


    /* ----------------------------------------------------- */
    /* LOCK BACKGROUND PAGE SCROLL                            */
    /* ----------------------------------------------------- */

    document.body.style.overflow =
        "hidden";


    /* ----------------------------------------------------- */
    /* START FROM TOP                                        */
    /* ----------------------------------------------------- */

    try{

        playerPage.scrollTop = 0;

    }

    catch(error){}


    window.scrollTo(
        0,
        0
    );


    console.log(
        "KEDU: Lecture Player Page Opened"
    );

}

/* ========================================================= */
/* MINI PLAY / PAUSE — FIXED                                 */
/* ========================================================= */

function toggleMiniPlayerPlayback(){

    if(
        !miniPlayerVideo ||
        !currentPlayerLecture
    ){

        return;

    }


    /*
     * Make sure mini player has the
     * current lecture loaded.
     */

    if(
        !miniPlayerVideo.currentSrc &&
        !miniPlayerVideo.src
    ){

        miniPlayerWasPlaying =
            true;

        syncFullPlayerToMiniPlayer();

        return;

    }


    if(
        miniPlayerVideo.paused
    ){

        miniPlayerVideo
            .play()
            .then(
                ()=>{
                    updateMiniPlayerPlayIcon();
                }
            )
            .catch(
                error => {

                    console.error(
                        "KEDU: Mini player play failed",
                        error
                    );

                }
            );

    }

    else{

        miniPlayerVideo.pause();

        updateMiniPlayerPlayIcon();

    }

}


/* ========================================================= */
/* TOGGLE LECTURE MINI PLAYER                               */
/* ========================================================= */

function toggleLectureMiniPlayer(){

    /* MINI → FULL */
    if(miniPlayerMode){

        openFullFromMiniPlayer();

        return;
    }


    /* FULL → MINI */

    miniPlayerWasPlaying =
        playerVideo &&
        !playerVideo.paused;


    syncFullPlayerToMiniPlayer();


    miniPlayerMode =
        true;


    /* Hide full player */

    if(playerPage){

        playerPage.classList.remove(
            "active"
        );

        playerPage.classList.remove(
            "mini-player"
        );

        playerPage.style.display =
            "none";
    }


    /* Restore previous page */

    const previousPage =
        document.getElementById(
            playerPreviousPage +
            "-page"
        );


    if(previousPage){

        previousPage.classList.add(
            "active"
        );

    }


    document.body.style.overflow =
        "";


    showGlobalMiniPlayer();


    console.log(
        "KEDU: Full Player → Global Mini Player"
    );

}
/* ========================================================= */
/* SHOW GLOBAL MINI PLAYER                                   */
/* ========================================================= */

function showGlobalMiniPlayer(){

    if(!miniPlayer){

        return;

    }

    miniPlayer.hidden =
        false;

    miniPlayer.classList.remove(
        "dragging"
    );

    applyMiniPlayerSide();

    updateMiniPlayerPlayIcon();
        showMiniPlayerControls(true);
}


/* ========================================================= */
/* HIDE GLOBAL MINI PLAYER                                   */
/* ========================================================= */

function hideGlobalMiniPlayer(){

    if(!miniPlayer){

        return;

    }

    miniPlayer.hidden =
        true;

    miniPlayer.classList.remove(
        "dragging"
    );

}


/* ========================================================= */
/* APPLY LEFT / RIGHT POSITION                               */
/* ========================================================= */

function applyMiniPlayerSide(){

    if(!miniPlayer){

        return;

    }

    miniPlayer.style.left =
        "";

    miniPlayer.style.right =
        "";

    if(
        miniPlayerSide ===
        "left"
    ){

        miniPlayer.style.left =
            "10px";

    }

    else{

        miniPlayer.style.right =
            "10px";

    }

}


/* ========================================================= */
/* SYNC FULL PLAYER → MINI PLAYER                            */
/* ========================================================= */

function syncFullPlayerToMiniPlayer(){

    if(
        !playerVideo ||
        !miniPlayerVideo ||
        !currentPlayerLecture
    ){

        return;

    }

    const source =
        playerVideo.currentSrc ||
        getSelectedVideoUrl(
            currentPlayerLecture
        );

    if(!source){

        return;

    }

    miniPlayerVideo.pause();

    miniPlayerVideo.src =
        source;

    miniPlayerVideo.poster =
        playerVideo.poster ||
        "";

    miniPlayerVideo.playbackRate =
        playerVideo.playbackRate ||
        1;

    const currentTime =
        Number(
            playerVideo.currentTime
        ) || 0;


    const restoreMiniPosition =
        ()=>{

            try{

                miniPlayerVideo.currentTime =
                    Math.min(
                        currentTime,
                        miniPlayerVideo.duration ||
                        currentTime
                    );

            }

            catch(error){}


            miniPlayerVideo.playbackRate =
                playerVideo.playbackRate ||
                1;


            if(
                miniPlayerWasPlaying
            ){

                miniPlayerVideo
                    .play()
                    .catch(
                        ()=>{}
                    );

            }

            miniPlayerVideo
                .removeEventListener(
                    "loadedmetadata",
                    restoreMiniPosition
                );

        };


    miniPlayerVideo
        .addEventListener(
            "loadedmetadata",
            restoreMiniPosition
        );

    miniPlayerVideo.load();

}


/* ========================================================= */
/* SYNC MINI PLAYER → FULL PLAYER                            */
/* ========================================================= */

function syncMiniPlayerToFullPlayer(){

    if(
        !playerVideo ||
        !miniPlayerVideo
    ){

        return;

    }

    const currentTime =
        Number(
            miniPlayerVideo.currentTime
        ) || 0;


    try{

        playerVideo.currentTime =
            Math.min(
                currentTime,
                playerVideo.duration ||
                currentTime
            );

    }

    catch(error){}


    playerVideo.playbackRate =
        miniPlayerVideo.playbackRate ||
        1;

}


/* ========================================================= */
/* MINI → FULL PLAYER                                        */
/* ========================================================= */

function openFullFromMiniPlayer(){

    if(
        !playerPage ||
        !currentPlayerLecture
    ){

        return;

    }

    const wasPlaying =
        miniPlayerVideo &&
        !miniPlayerVideo.paused;


    syncMiniPlayerToFullPlayer();


    if(miniPlayerVideo){

        miniPlayerVideo.pause();

    }


    hideGlobalMiniPlayer();


    miniPlayerMode =
        false;


    playerPage.classList.add(
        "active"
    );

    playerPage.classList.remove(
        "mini-player"
    );

    playerPage.style.display =
        "block";
const lectureHost =
    document.getElementById(
        "lecture-page"
    );

if(lectureHost){

    lectureHost.classList.add(
        "active"
    );

    lectureHost.classList.add(
        "lecture-player-host"
    );

    lectureHost.style.display =
        "block";

}
    document.body.style.overflow =
        "hidden";


    updatePlayIcon();


    if(wasPlaying){

        playerVideo
            ?.play()
            .catch(
                ()=>{}
            );

    }


    console.log(
        "KEDU: Mini Player → Full Player"
    );

}


/* ========================================================= */
/* MINI PLAY / PAUSE                                        */
/* ========================================================= */

function toggleMiniPlayerPlayback(){

    if(!miniPlayerVideo){

        return;

    }

    if(
        miniPlayerVideo.paused
    ){

        miniPlayerVideo
            .play()
            .catch(
                ()=>{}
            );

    }

    else{

        miniPlayerVideo.pause();

    }

}


/* ========================================================= */
/* MINI PLAY ICON                                           */
/* ========================================================= */

function updateMiniPlayerPlayIcon(){

    if(!miniPlayerPlay){

        return;

    }

    const icon =
        miniPlayerPlay.querySelector(
            ".material-symbols-rounded"
        );

    if(!icon){

        return;

    }

    if(
        miniPlayerVideo &&
        !miniPlayerVideo.paused
    ){

        icon.textContent =
            "pause";

        miniPlayerPlay
            .setAttribute(
                "aria-label",
                "Pause"
            );

    }

    else{

        icon.textContent =
            "play_arrow";

        miniPlayerPlay
            .setAttribute(
                "aria-label",
                "Play"
            );

    }

}


/* ========================================================= */
/* CLOSE MINI PLAYER                                        */
/* ========================================================= */

function closeGlobalMiniPlayer(){

    if(miniPlayerVideo){

        miniPlayerVideo.pause();

    }

    hideGlobalMiniPlayer();

    miniPlayerMode =
        false;

    if(playerVideo){

        playerVideo.pause();

    }

    console.log(
        "KEDU: Mini Player Closed"
    );

}
/* ========================================================= */
/* MINI PLAYER BUTTON UI                                     */
/* ========================================================= */

function updateMiniPlayerButton(){

    if(!playerBackButton){

        return;

    }


    const icon =
        playerBackButton.querySelector(
            ".material-symbols-rounded"
        );


    if(miniPlayerMode){

        if(icon){

            icon.textContent =
                "keyboard_arrow_up";

        }


        playerBackButton.setAttribute(
            "aria-label",
            "Open Full Player"
        );

    }

    else{

        if(icon){

            icon.textContent =
                "keyboard_arrow_down";

        }


        playerBackButton.setAttribute(
            "aria-label",
            "Minimize Player"
        );

    }

}
/* ========================================================= */
/* CLOSE PLAYER                                              */
/* ========================================================= */

function closeLecturePlayer(){

    stopAutoplayCountdown();

closeAllPlayerPanels();

closeLectureDescription();


    if(playerVideo){

        playerVideo.pause();

    }


    miniPlayerMode =
        false;

if(
    miniPlayerVideo
){

    miniPlayerVideo.pause();

}

hideGlobalMiniPlayer();
    if(playerPage){

    playerPage.classList.remove(
        "active"
    );

    playerPage.classList.remove(
        "mini-player"
    );

    playerPage.style.display =
        "none";

}


/*
 * Restore the lecture page to normal mode.
 */
const lectureHost =
    document.getElementById(
        "lecture-page"
    );

if(lectureHost){

    lectureHost.classList.remove(
        "lecture-player-host"
    );

}


    document.body.style.overflow =
        "";


    const previousPage =
        document.getElementById(
            playerPreviousPage + "-page"
        );


    if(previousPage){

        document
            .querySelectorAll(".page")
            .forEach(page=>{

                page.classList.remove(
                    "active"
                );

            });


        previousPage.classList.add(
            "active"
        );

    }


    updateMiniPlayerButton();


    console.log(
        "KEDU: Lecture Player Closed"
    );

}
/* ========================================================= */
/* TWO-LINE TITLE PREVIEW                                    */
/* ========================================================= */

function updateLectureTitlePreview(
    title
){

    if(!playerTitlePreview){

        return;

    }


    const moreButton =
        playerTitlePreview.querySelector(
            "#lecture-player-description-toggle"
        );


    const words =
        String(title || "Lecture")
            .trim()
            .split(/\s+/)
            .slice(
                0,
                100
            );


    /*
     * Start with the complete title.
     */

    playerTitlePreview.textContent =
        words.join(" ");


    /*
     * Add the inline MORE control.
     */

    if(moreButton){

        playerTitlePreview.appendChild(
            document.createTextNode(" ")
        );

        playerTitlePreview.appendChild(
            moreButton
        );

    }


    /*
     * If the title fits in two lines,
     * show it completely.
     */

    if(
        playerTitlePreview.scrollHeight <=
        playerTitlePreview.clientHeight + 2
    ){

        return;

    }


    /*
     * Remove words until the title,
     * including …more, fits inside
     * exactly two lines.
     */

    let visibleWords = [
        ...words
    ];


    while(
        visibleWords.length > 1
    ){

        visibleWords.pop();


        playerTitlePreview.textContent =
            visibleWords.join(" ") +
            "…";


        if(moreButton){

            playerTitlePreview.appendChild(
                document.createTextNode(" ")
            );

            playerTitlePreview.appendChild(
                moreButton
            );

        }


        if(
            playerTitlePreview.scrollHeight <=
            playerTitlePreview.clientHeight + 2
        ){

            break;

        }

    }

}
/* ========================================================= */
/* POPULATE PLAYER                                            */
/* ========================================================= */

function populateLecturePlayer(lecture){

    if(!lecture){

        return;

    }
closeLectureDescription();
    hidePlayerMessages();

    stopAutoplayCountdown();

    resetPlayerControls();

const baseTitle =
    lecture.title ||
    "Lecture";

const number =
    lecture.number
        ? "Lecture " + lecture.number
        : "";

const title =
    number
        ? number + " | " + baseTitle
        : baseTitle;

const duration =
    lecture.duration ||
    "";
    const description =
        lecture.description ||
        lecture.desc ||
        "Lecture description will appear here.";

    const channel =
        lecture.channel ||
        "KEDU Academy";

    const logo =
        lecture.logo ||
        "assets/logo/kedu-logo.png";

    const thumbnail =
        lecture.thumbnail ||
        "";

if(playerTitle){

    playerTitle.textContent =
        title;
updatePlayerDownloadState();
}


/* ========================================================= */
/* TWO-LINE TITLE PREVIEW                                    */
/* ========================================================= */

updateLectureTitlePreview(
    title
);

/* ========================================================= */
/* OLD LECTURE META ROW — NO LONGER DISPLAYED                */
/* ========================================================= */

if(playerNumber){

    playerNumber.textContent =
        "";

    playerNumber.hidden =
        true;

}


if(playerDurationText){

    playerDurationText.textContent =
        "";

    playerDurationText.hidden =
        true;

}

/* ========================================================= */
/* DESCRIPTION SHEET DATA                                    */
/* ========================================================= */

updateLectureDescriptionSheet(
    lecture
);


if(playerDescriptionToggle){

    playerDescriptionToggle.textContent =
        "…more";

}
    if(playerChannelName){

        playerChannelName.textContent =
            channel;

    }

    if(playerChannelLogo){

        playerChannelLogo.src =
            logo;

    }

    if(playerVideo){

        playerVideo.poster =
            thumbnail;

    }

    loadLectureVideo(
        lecture
    );

updatePlayerActions(
    lecture
);

updateSubscribeUI();

closeLectureAttachmentSheet();

applyLectureFilter("all");
}


/* ========================================================= */
/* LOAD VIDEO                                                 */
/* ========================================================= */

/* ========================================================= */
/* LOAD VIDEO                                                 */
/* ========================================================= */

async function loadLectureVideo(
    lecture
){

    if(!playerVideo){

        return;

    }

    /*
     * Stop the previous lecture immediately.
     */
    try{

        playerVideo.pause();

    }
    catch(error){}


    /*
     * Try the locally downloaded video first.
     *
     * This allows the Downloads page to play
     * the cached file without streaming it again.
     */
    let videoUrl = "";

    if(
        window.KEDUDownload &&
        typeof
            window.KEDUDownload
                .getDownloadedVideoUrl ===
                "function"
    ){

        try{

            videoUrl =
                await window.KEDUDownload
                    .getDownloadedVideoUrl(
                        lecture.id
                    );

        }
        catch(error){

            console.warn(
                "KEDU: Downloaded video unavailable:",
                error
            );

        }

    }


    /*
     * If no downloaded video exists,
     * use the normal online lecture source.
     */
    if(!videoUrl){

        videoUrl =
            getSelectedVideoUrl(
                lecture
            );

    }


    /*
     * Lecture may have changed while the
     * cached video was being loaded.
     */
    if(
        !currentPlayerLecture ||
        String(
            currentPlayerLecture.id
        ) !==
        String(
            lecture.id
        )
    ){

        if(
            videoUrl &&
            videoUrl.startsWith("blob:")
        ){

            URL.revokeObjectURL(
                videoUrl
            );

        }

        return;

    }


    if(!videoUrl){

        showUnavailable();

        return;

    }


    hidePlayerMessages();


    /*
     * Release the previous cached video URL.
     */
    if(
        currentDownloadedObjectUrl
    ){

        try{

            URL.revokeObjectURL(
                currentDownloadedObjectUrl
            );

        }
        catch(error){}

        currentDownloadedObjectUrl =
            null;

    }


    /*
     * Remember the new Blob URL so it can
     * be released when another lecture opens.
     */
    if(
        videoUrl.startsWith("blob:")
    ){

        currentDownloadedObjectUrl =
            videoUrl;

    }


    /*
     * Reset previous video source.
     */
    if(playerVideoSource){

        playerVideoSource.removeAttribute(
            "src"
        );

    }

    playerVideo.removeAttribute(
        "src"
    );

    playerVideo.load();


    /*
     * Set new video source.
     */
    if(playerVideoSource){

        playerVideoSource.src =
            videoUrl;

        playerVideoSource.type =
            "video/mp4";

    }
    else{

        playerVideo.src =
            videoUrl;

    }


    
    /*
 * Load caption tracks for
 * the current lecture.
 */
setupLectureCaptionTracks(
    lecture
);


/*
 * Load the new lecture.
 */
playerVideo.load();

console.log(
    "KEDU: Loading lecture video:",
    videoUrl
);

}
/* ========================================================= */
/* LECTURE CAPTION TRACK LOADER                               */
/* ========================================================= */

function setupLectureCaptionTracks(
    lecture
){

    if(!playerVideo){
        return;
    }

    /*
     * Remove tracks from the
     * previous lecture.
     */
    playerVideo
        .querySelectorAll(
            "track[data-kedu-caption]"
        )
        .forEach(
            track => track.remove()
        );


    if(!lecture){
        return;
    }


    const lectureId =
        lecture.id;

    if(
        lectureId === undefined ||
        lectureId === null ||
        String(lectureId).trim() === ""
    ){
        console.warn(
            "KEDU: Caption tracks skipped - lecture ID missing."
        );

        return;
    }


    /*
     * Caption URLs.
     *
     * You can later provide custom
     * URLs directly inside lecture data.
     *
     * Otherwise KEDU uses:
     *
     * assets/captions/LECTURE_ID/hi.vtt
     * assets/captions/LECTURE_ID/en.vtt
     * assets/captions/LECTURE_ID/ta.vtt
     * assets/captions/LECTURE_ID/gu.vtt
     */

    const captionSources = {

        hi:
            lecture?.captions?.hi ||
            lecture?.captionTracks?.hi ||
            `assets/captions/${lectureId}/hi.vtt`,

        en:
            lecture?.captions?.en ||
            lecture?.captionTracks?.en ||
            `assets/captions/${lectureId}/en.vtt`,

        ta:
            lecture?.captions?.ta ||
            lecture?.captionTracks?.ta ||
            `assets/captions/${lectureId}/ta.vtt`,

        gu:
            lecture?.captions?.gu ||
            lecture?.captionTracks?.gu ||
            `assets/captions/${lectureId}/gu.vtt`

    };


    const captionLanguages = [

        {
            code:"hi",
            label:"Hindi"
        },

        {
            code:"en",
            label:"English"
        },

        {
            code:"ta",
            label:"Tamil"
        },

        {
            code:"gu",
            label:"Gujarati"
        }

    ];


    captionLanguages.forEach(
        caption => {

            const src =
                captionSources[
                    caption.code
                ];


            if(
                !src
            ){
                return;
            }


            const track =
                document.createElement(
                    "track"
                );


            track.kind =
                "subtitles";


            track.label =
                caption.label;


            track.srclang =
                caption.code;


            track.src =
                src;


            /*
             * Never automatically
             * activate a caption.
             */
            track.default =
                false;


            track.dataset.keduCaption =
                caption.code;


            playerVideo.appendChild(
                track
            );

        }
    );


    console.log(
        "KEDU: Caption tracks loaded for lecture:",
        lectureId
    );

}
/* ========================================================= */
/* APPLY SAVED POSITION                                       */
/* ========================================================= */

function applySavedPlaybackPosition(lecture){

    if(
        !resumeEnabled ||
        !playerVideo
    ){

        return;

    }

    const key =
        getProgressKey(
            lecture
        );

    const saved =
        Number(
            localStorage.getItem(
                key
            )
        );

    if(
        Number.isFinite(saved) &&
        saved > 5
    ){

        playerVideo.addEventListener(
            "loadedmetadata",
            function resumeOnce(){

                if(
                    saved <
                    playerVideo.duration - 5
                ){

                    try{

                        playerVideo.currentTime =
                            saved;

                    }
                    catch(error){}

                }

                playerVideo.removeEventListener(
                    "loadedmetadata",
                    resumeOnce
                );

            }
        );

    }

}


/* ========================================================= */
/* PLAY / PAUSE                                                */
/* ========================================================= */

function toggleLecturePlayback(){

    if(!playerVideo){

        return;

    }

    if(playerVideo.paused){

        playerVideo
            .play()
            .catch(()=>{

                showPlayerError();

            });

    }

    else{

        playerVideo.pause();

    }

}


/* ========================================================= */
/* UPDATE PLAY ICON                                            */
/* ========================================================= */

function updatePlayIcon(){

    if(!playerPlayIcon){

        return;

    }

    if(
        playerVideo &&
        !playerVideo.paused
    ){

        playerPlayIcon.textContent =
            "pause";

        if(playerPlayButton){

            playerPlayButton
                .setAttribute(
                    "aria-label",
                    "Pause"
                );

        }

    }

    else{

        playerPlayIcon.textContent =
            "play_arrow";

        if(playerPlayButton){

            playerPlayButton
                .setAttribute(
                    "aria-label",
                    "Play"
                );

        }

    }

}


/* ========================================================= */
/* SEEK                                                       */
/* ========================================================= */

function seekLecture(seconds){

    if(!playerVideo){

        return;

    }

    if(
        !Number.isFinite(
            playerVideo.duration
        )
    ){

        return;

    }

    playerVideo.currentTime =
        Math.min(

            Math.max(
                0,
                playerVideo.currentTime +
                seconds
            ),

            playerVideo.duration

        );

}


/* ========================================================= */
/* PREVIOUS LECTURE                                           */
/* ========================================================= */

function playPreviousLecture(){

    if(
        currentPlayerIndex <= 0
    ){

        if(playerVideo){

            playerVideo.currentTime =
                0;

        }

        return;

    }

    const previous =
        currentPlayerList[
            currentPlayerIndex - 1
        ];

    if(previous){

        currentPlayerIndex--;

        populateLecturePlayer(
            previous
        );

    }

}


/* ========================================================= */
/* NEXT LECTURE                                               */
/* ========================================================= */

function playNextLecture(){

    if(
        currentPlayerIndex < 0 ||
        currentPlayerIndex >=
        currentPlayerList.length - 1
    ){

        stopAutoplayCountdown();

        return;

    }

    const next =
        currentPlayerList[
            currentPlayerIndex + 1
        ];

    if(next){

        currentPlayerIndex++;

        populateLecturePlayer(
            next
        );

    }

}


/* ========================================================= */
/* PLAYER TIME UPDATE                                        */
/* ========================================================= */

function updatePlayerProgress(){

    if(!playerVideo){

        return;

    }

    const current =
        playerVideo.currentTime || 0;

    const duration =
        playerVideo.duration || 0;

    if(playerCurrentTime){

        playerCurrentTime.textContent =
            formatPlayerTime(
                current
            );

    }

    if(playerDuration){

        playerDuration.textContent =
            formatPlayerTime(
                duration
            );

    }

    if(playerDurationText){

        playerDurationText.textContent =
            formatPlayerTime(
                duration
            );

    }

if(playerProgress){

    const progressMax =
        duration || 100;

    playerProgress.max =
        progressMax;

    playerProgress.value =
        current;

    const progressPercent =
        progressMax > 0
            ? (current / progressMax) * 100
            : 0;

    playerProgress.style.setProperty(
        "--progress-percent",
        `${progressPercent}%`
    );
}
    saveLectureProgress();

}


/* ========================================================= */
/* SAVE PROGRESS                                               */
/* ========================================================= */

function saveLectureProgress(){

    if(
        !currentPlayerLecture ||
        !playerVideo
    ){

        return;

    }

    const current =
        playerVideo.currentTime || 0;

    if(current <= 0){

        return;

    }

    localStorage.setItem(

        getProgressKey(
            currentPlayerLecture
        ),

        String(current)

    );

}


/* ========================================================= */
/* PROGRESS KEY                                               */
/* ========================================================= */

function getProgressKey(lecture){

    return (

        "keduLectureProgress_" +

        String(
            lecture?.id || "unknown"
        )

    );

}


/* ========================================================= */
/* COMPLETE LECTURE                                           */
/* ========================================================= */

function markLectureCompleted(){

    if(
        !currentPlayerLecture
    ){

        return;

    }

    localStorage.setItem(

        getProgressKey(
            currentPlayerLecture
        ),

        "0"

    );

    localStorage.setItem(

        "keduLectureCompleted_" +
        String(
            currentPlayerLecture.id
        ),

        "true"

    );

}


/* ========================================================= */
/* PROGRESS INPUT                                             */
/* ========================================================= */

function handleProgressInput(){

    if(
        !playerVideo ||
        !playerProgress
    ){

        return;

    }

    playerVideo.currentTime =
        Number(
            playerProgress.value
        );

}


/* ========================================================= */
/* FULLSCREEN — LANDSCAPE PLAYER                             */
/* ========================================================= */

/* ========================================================= */
/* KEDU FULLSCREEN — VIDEO ONLY + LANDSCAPE                  */
/* ========================================================= */

async function toggleLectureFullscreen(){

    const target =
        playerElement(
            "lecture-player-video-section"
        );

    if(!target){

        return;

    }

    try{

        if(
            !document.fullscreenElement
        ){

            /*
             * IMPORTANT:
             * Fullscreen ONLY the video section.
             */

            await target.requestFullscreen();

            /*
             * Change mobile orientation to landscape.
             */

            if(
                screen.orientation &&
                screen.orientation.lock
            ){

                try{

                    await screen.orientation.lock(
                        "landscape"
                    );

                }

                catch(error){

                    console.log(
                        "KEDU: Landscape orientation lock unavailable",
                        error
                    );

                }

            }

        }

        else{

            await document.exitFullscreen();

        }

    }

    catch(error){

        console.error(
            "KEDU: Fullscreen error",
            error
        );

    }

}
/* ========================================================= */
/* DESCRIPTION SHEET — ANIMATION STATE                       */
/* ========================================================= */

let descriptionCloseTimer = null;

let descriptionSwipeStartY = 0;

let descriptionSwipeStartX = 0;

let descriptionSwipeActive = false;


/* ========================================================= */
/* DESCRIPTION SHEET — OPEN                                  */
/* ========================================================= */

function openLectureDescription(){

    if(!playerDescriptionSheet){
        return;
    }

    if(descriptionCloseTimer){

        clearTimeout(
            descriptionCloseTimer
        );

        descriptionCloseTimer = null;

    }

    playerDescriptionSheet.hidden = false;

    playerDescriptionSheet.classList.remove(
        "description-sheet-closing"
    );

    playerDescriptionSheet.classList.add(
        "description-sheet-opening"
    );

    document.body.classList.add(
        "lecture-description-open"
    );

    requestAnimationFrame(()=>{

        requestAnimationFrame(()=>{

            if(playerDescriptionSheet){

                playerDescriptionSheet.classList.remove(
                    "description-sheet-opening"
                );

                playerDescriptionSheet.classList.add(
                    "description-sheet-open"
                );

            }

        });

    });

}


/* ========================================================= */
/* DESCRIPTION SHEET — CLOSE                                 */
/* ========================================================= */

function closeLectureDescription(){

    if(!playerDescriptionSheet){

        return;

    }

    if(playerDescriptionSheet.hidden){

        return;

    }

    playerDescriptionSheet.classList.remove(
        "description-sheet-opening"
    );

    playerDescriptionSheet.classList.remove(
        "description-sheet-open"
    );

    playerDescriptionSheet.classList.add(
        "description-sheet-closing"
    );

    document.body.classList.remove(
        "lecture-description-open"
    );

    if(descriptionCloseTimer){

        clearTimeout(
            descriptionCloseTimer
        );

    }

    descriptionCloseTimer =
        setTimeout(()=>{

            if(playerDescriptionSheet){

                playerDescriptionSheet.hidden =
                    true;

                playerDescriptionSheet.classList.remove(
                    "description-sheet-closing"
                );

            }

            descriptionCloseTimer =
                null;

        },220);

}

/* ========================================================= */
/* DESCRIPTION SHEET — UPDATE                                */
/* ========================================================= */

function updateLectureDescriptionSheet(
    lecture
){

    if(!lecture){

        return;

    }


const baseTitle =
    lecture.title ||
    "Lecture";

const title =
    lecture.number
        ? "Lecture " +
          lecture.number +
          " | " +
          baseTitle
        : baseTitle;

    const description =
        lecture.description ||
        lecture.desc ||
        "Description will be added by KEDU Academy.";


    const likes =
        lecture.likes ??
        0;


    const views =
        lecture.views ??
        0;


    const date =
        lecture.uploadedDate ||
        lecture.uploadDate ||
        lecture.date ||
        "—";


    const channel =
        lecture.channel ||
        "KEDU Academy";


    const logo =
        lecture.logo ||
        "assets/logo/kedu-logo.png";


    /* FULL TITLE */

    if(playerDescriptionSheetTitle){

        playerDescriptionSheetTitle.textContent =
            title;

    }


    /* DESCRIPTION */

    if(playerDescriptionBody){

        playerDescriptionBody.textContent =
            description;

    }


    /* LIKES */

    if(playerDescriptionLikes){

        playerDescriptionLikes.textContent =
            formatLectureNumber(
                likes
            );

    }


    /* VIEWS */

    if(playerDescriptionViews){

        playerDescriptionViews.textContent =
            formatLectureNumber(
                views
            );

    }


    /* DATE */

    if(playerDescriptionDate){

        playerDescriptionDate.textContent =
            date;

    }


    /* CHANNEL LOGO */

    if(playerDescriptionChannelLogo){

        playerDescriptionChannelLogo.src =
            logo;

    }


    /* CHANNEL NAME */

    if(playerDescriptionChannelName){

        playerDescriptionChannelName.textContent =
            channel;

    }


    /* VIDEO DETAILS — DATE */

    if(playerVideoDetailDate){

        playerVideoDetailDate.textContent =
            date;

    }


    /* VIDEO DETAILS — VIEWS */

    if(playerVideoDetailViews){

        playerVideoDetailViews.textContent =
            formatLectureNumber(
                views
            );

    }


    /* VIDEO DETAILS — LIKES */

    if(playerVideoDetailLikes){

        playerVideoDetailLikes.textContent =
            formatLectureNumber(
                likes
            );

    }

}


/* ========================================================= */
/* NUMBER FORMAT                                              */
/* ========================================================= */

function formatLectureNumber(
    value
){

    const number =
        Number(
            value
        );


    if(
        !Number.isFinite(
            number
        )
    ){

        return "0";

    }


    return number.toLocaleString(
        "en-IN"
    );

}
/* ========================================================= */
/* SETTINGS PANEL                                             */
/* ========================================================= */

function toggleSettingsPanel(){

    if(!playerSettingsPanel){

        return;

    }

    const hidden =
        playerSettingsPanel.hidden;

    closeAllPlayerPanels();

    if(hidden){

        playerSettingsPanel.hidden =
            false;

        playerSettingsOpen =
            true;

    }

}


/* ========================================================= */
/* CLOSE ALL PANELS                                           */
/* ========================================================= */

function closeAllPlayerPanels(){

    [
        playerSettingsPanel,
        qualityPanel,
        speedPanel,
        captionPanel
    ]

    .forEach(panel=>{

        if(panel){

            panel.hidden =
                true;

        }

    });

    playerSettingsOpen =
        false;

}


/* ========================================================= */
/* QUALITY PANEL                                              */
/* ========================================================= */

function openQualityPanel(){

    closeAllPlayerPanels();

    if(qualityPanel){

        qualityPanel.hidden =
            false;

    }

}


/* ========================================================= */
/* SPEED PANEL                                                */
/* ========================================================= */

function openSpeedPanel(){

    closeAllPlayerPanels();

    if(speedPanel){

        speedPanel.hidden =
            false;

    }

}


/* ========================================================= */
/* CAPTION PANEL                                              */
/* ========================================================= */

function openCaptionPanel(){

    closeAllPlayerPanels();

    if(captionPanel){

        captionPanel.hidden =
            false;

    }

}


/* ========================================================= */
/* SET QUALITY                                                */
/* ========================================================= */

function setLectureQuality(quality){

    selectedQuality =
        quality;

    if(playerCurrentQuality){

        playerCurrentQuality.textContent =
            quality === "auto"
                ? "Auto"
                : quality + "p";

    }

    closeAllPlayerPanels();

    if(!currentPlayerLecture){

        return;

    }

    const currentTime =
        playerVideo
            ? playerVideo.currentTime
            : 0;

    loadLectureVideo(
        currentPlayerLecture
    );

    if(playerVideo){

        playerVideo.addEventListener(
            "loadedmetadata",
            function restoreTime(){

                try{

                    playerVideo.currentTime =
                        Math.min(
                            currentTime,
                            playerVideo.duration || currentTime
                        );

                }
                catch(error){}

                playerVideo.removeEventListener(
                    "loadedmetadata",
                    restoreTime
                );

            }
        );

    }

}
/* ========================================================= */
/* DOWNLOAD QUALITY REQUEST                                  */
/* ========================================================= */

async function requestLectureDownload(
    quality
){

    if(!currentPlayerLecture){

        return;

    }


    if(
        !quality
    ){

        return;

    }


    closeDownloadQualityPanel();


    if(
        !window.KEDUDownload ||
        typeof
            window.KEDUDownload.startLectureDownload !==
            "function"
    ){

        showPlayerToast(
            "Download System Not Ready"
        );

        return;

    }


    showPlayerToast(
        "Preparing " +
        quality +
        "p Download..."
    );


    try{

await
    window.KEDUDownload.startLectureDownload(
        currentPlayerLecture,
        quality
    );


/* ================================================= */
/* DEMO: OPEN DOWNLOAD PAGE IMMEDIATELY               */
/* ================================================= */

if(
    window.KEDUDownload &&
    typeof window.KEDUDownload.open ===
        "function"
){

    window.KEDUDownload.open(
        "lecture"
    );

}


updatePlayerDownloadState();

    }
    catch(error){

        console.error(
            "KEDU Download Error:",
            error
        );

        showPlayerToast(
            "Download Failed"
        );

    }

}


/* ========================================================= */
/* DOWNLOAD QUALITY BUTTON EVENTS                            */
/* ========================================================= */

downloadQualityButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();


                const quality =
                    button.dataset.downloadQuality;


                requestLectureDownload(
                    quality
                );

            }
        );

    }
);
downloadQualityClose
    ?.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            closeDownloadQualityPanel();

        }
    );


/* ========================================================= */
/* DOWNLOAD QUALITY PANEL OUTSIDE CLICK                      */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        if(
            !downloadQualityPanel ||
            downloadQualityPanel.hidden
        ){

            return;

        }


        if(
            event.target.closest(
                "#lecture-player-download-quality-panel"
            )
        ){

            return;

        }


        if(
            event.target.closest(
                "#lecture-player-download-btn"
            )
        ){

            return;

        }


        closeDownloadQualityPanel();

    }
);

/* ========================================================= */
/* SET SPEED                                                  */
/* ========================================================= */

function setLectureSpeed(
    speed,
    closePanel = true
){

    let value =
        Number(speed);

    if(
        !Number.isFinite(value) ||
        !playerVideo
    ){
        return;
    }

    value =
        Math.max(
            0.5,
            Math.min(
                3,
                value
            )
        );

    playerVideo.playbackRate =
        value;

    if(playerCurrentSpeed){

        playerCurrentSpeed.textContent =
            value.toFixed(2) + "×";

    }

    if(speedDisplay){

        speedDisplay.textContent =
            value.toFixed(2) + "×";

    }

    if(speedRange){

        speedRange.value =
            String(value);

    }

    if(closePanel){

        closeAllPlayerPanels();

    }

}
/* ========================================================= */
/* SPEED SLIDER                                               */
/* ========================================================= */

speedRange
?.addEventListener(
    "input",
    event => {

        setLectureSpeed(
            event.target.value,
            false
        );

    }
);

speedRange
?.addEventListener(
    "change",
    event => {

        setLectureSpeed(
            event.target.value,
            true
        );

    }
);

speedMinus
?.addEventListener(
    "click",
    () => {

        const current =
            Number(
                speedRange?.value || 1
            );

        setLectureSpeed(
            Math.max(
                0.5,
                current - 0.05
            ),
            false
        );

    }
);

speedPlus
?.addEventListener(
    "click",
    () => {

        const current =
            Number(
                speedRange?.value || 1
            );

        setLectureSpeed(
            Math.min(
                3,
                current + 0.05
            ),
            false
        );

    }
);

/* ========================================================= */
/* ========================================================= */
/* SET CAPTION                                                */
/* ========================================================= */

function setLectureCaption(language){

    selectedCaption =
        language;

    if(playerCurrentCaption){

        const names = {

            off:"Off",

            hi:"Hindi",

            en:"English",

            ta:"Tamil",

            gu:"Gujarati"

        };

        playerCurrentCaption.textContent =
            names[language] ||
            "Off";

    }

    applyCaptionTrack(
        language
    );

    if(captionMemoryEnabled){

        localStorage.setItem(
            "keduCaption",
            language
        );

    }

    closeAllPlayerPanels();

}


/* ========================================================= */
/* APPLY CAPTION TRACK                                        */
/* ========================================================= */

function applyCaptionTrack(language){

    if(!playerVideo){

        return;

    }

    const tracks =
        playerVideo.textTracks;

    if(!tracks){

        return;

    }

    for(
        let i = 0;
        i < tracks.length;
        i++
    ){

        const track =
            tracks[i];

        if(
            language === "off"
        ){

            track.mode =
                "hidden";

            continue;

        }

        const trackLanguage =
            (
                track.language ||
                ""
            )
            .toLowerCase();

        if(
            trackLanguage ===
            language.toLowerCase()
        ){

            track.mode =
                "showing";

        }

        else{

            track.mode =
                "hidden";

        }

    }

}


/* ========================================================= */
/* AUTOPLAY TOGGLE                                            */
/* ========================================================= */

function toggleAutoplay(){

    autoplayEnabled =
        !autoplayEnabled;

    localStorage.setItem(

        "keduAutoplay",

        String(
            autoplayEnabled
        )

    );

    updateAutoplayUI();

    if(!autoplayEnabled){

        stopAutoplayCountdown();

    }

}


/* ========================================================= */
/* UPDATE AUTOPLAY UI — SYNC BOTH PLACES                     */
/* ========================================================= */

function updateAutoplayUI(){

    const text =
        autoplayEnabled
            ? "On"
            : "Off";


    /* ----------------------------------------------------- */
    /* SETTINGS STATUS                                       */
    /* ----------------------------------------------------- */

    if(playerAutoplayStatus){

        playerAutoplayStatus.textContent =
            text;

    }


    /* ----------------------------------------------------- */
    /* TOP AUTOPLAY TOGGLE                                   */
    /* ----------------------------------------------------- */

    if(autoplayButton){

        autoplayButton.classList.toggle(
            "active",
            autoplayEnabled
        );

        autoplayButton.setAttribute(
            "aria-pressed",
            String(
                autoplayEnabled
            )
        );

        autoplayButton.dataset.state =
            autoplayEnabled
                ? "on"
                : "off";

    }


    /* ----------------------------------------------------- */
    /* SETTINGS AUTOPLAY ROW                                 */
    /* ----------------------------------------------------- */

    if(playerAutoplayOption){

        playerAutoplayOption.classList.toggle(
            "active",
            autoplayEnabled
        );

        playerAutoplayOption.setAttribute(
            "aria-pressed",
            String(
                autoplayEnabled
            )
        );

    }

}

/* ========================================================= */
/* RESUME TOGGLE                                              */
/* ========================================================= */

function toggleResume(){

    resumeEnabled =
        !resumeEnabled;

    localStorage.setItem(

        "keduResume",

        String(
            resumeEnabled
        )

    );

}


/* ========================================================= */
/* CAPTION MEMORY TOGGLE                                      */
/* ========================================================= */

function toggleCaptionMemory(){

    captionMemoryEnabled =
        !captionMemoryEnabled;

    localStorage.setItem(

        "keduCaptionMemory",

        String(
            captionMemoryEnabled
        )

    );

}


/* ========================================================= */
/* LOCK SCREEN                                                */
/* ========================================================= */

function togglePlayerLock(){

    playerLocked =
        !playerLocked;

    const videoSection =
        playerElement(
            "lecture-player-video-section"
        );

    if(videoSection){

        videoSection.classList.toggle(
            "player-locked",
            playerLocked
        );

    }

    /*
     * Never leave Settings/Speed/Caption
     * sheets open while locking.
     */
    closeAllPlayerPanels();

    if(playerLockOption){

        const icon =
            playerLockOption.querySelector(
                ".material-symbols-rounded"
            );

        if(icon){

            icon.textContent =
                playerLocked
                    ? "lock"
                    : "lock_open";

        }

    }

    if(playerLockOverlay){

        playerLockOverlay.hidden =
            !playerLocked;

    }

}
/* ========================================================= */
/* UNLOCK BUTTON                                             */
/* ========================================================= */

playerUnlockButton
?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        togglePlayerLock();

    }
);

/* ========================================================= */

/* ========================================================= */
/* ERROR / UNAVAILABLE                                        */
/* ========================================================= */

function hidePlayerMessages(){

    if(playerError){

        playerError.hidden =
            true;

    }

    if(playerUnavailable){

        playerUnavailable.hidden =
            true;

    }

}

function showPlayerError(){

    if(playerError){

        playerError.hidden =
            false;

    }

}

function showUnavailable(){

    if(playerUnavailable){

        playerUnavailable.hidden =
            false;

    }

}


/* ========================================================= */
/* RETRY                                                      */
/* ========================================================= */

function retryLecture(){

    if(!currentPlayerLecture){

        return;

    }

    hidePlayerMessages();

    loadLectureVideo(
        currentPlayerLecture
    );

}


/* ========================================================= */
/* BUFFERING                                                   */
/* ========================================================= */

function showBuffering(){

    if(playerBuffering){

        playerBuffering.classList.add(
            "show"
        );

    }

}

function hideBuffering(){

    if(playerBuffering){

        playerBuffering.classList.remove(
            "show"
        );

    }

}


/* ========================================================= */
/* AUTOPLAY COUNTDOWN                                         */
/* ========================================================= */

function startAutoplayCountdown(){

    if(
        !autoplayEnabled ||
        currentPlayerIndex < 0 ||
        currentPlayerIndex >=
        currentPlayerList.length - 1
    ){

        return;

    }

    stopAutoplayCountdown();

    if(!autoplayCountdown){

        return;

    }

    autoplayCountdown.hidden =
        false;

    let count = 5;

    if(countdownNumber){

        countdownNumber.textContent =
            count;

    }

    autoplayInterval =
        setInterval(()=>{

            count--;

            if(countdownNumber){

                countdownNumber.textContent =
                    count;

            }

            if(count <= 0){

                stopAutoplayCountdown();

                playNextLecture();

            }

        },1000);

}

/* ========================================================= */
/* STOP AUTOPLAY COUNTDOWN                                    */
/* ========================================================= */

function stopAutoplayCountdown(){

    if(autoplayInterval){

        clearInterval(
            autoplayInterval
        );

        autoplayInterval =
            null;

    }

    if(autoplayTimer){

        clearTimeout(
            autoplayTimer
        );

        autoplayTimer =
            null;

    }

    if(autoplayCountdown){

        autoplayCountdown.hidden =
            true;

    }

}


/* ========================================================= */
/* UPDATE PLAYER ACTIONS                                     */
/* ========================================================= */

function updatePlayerActions(lecture){

    if(!lecture){

        return;

    }

    const liked =
        localStorage.getItem(
            "keduLiked_" +
            lecture.id
        ) === "true";

    const unliked =
        localStorage.getItem(
            "keduUnliked_" +
            lecture.id
        ) === "true";

    playerLikeButton?.classList.toggle(
        "active",
        liked
    );

    playerUnlikeButton?.classList.toggle(
        "active",
        unliked
    );

    fullscreenLikeButton?.classList.toggle(
        "active",
        liked
    );

    fullscreenUnlikeButton?.classList.toggle(
        "active",
        unliked
    );
}


/* ========================================================= */
/* LIKE                                                       */
/* ========================================================= */

function toggleLectureLike(){

    if(!currentPlayerLecture){

        return;

    }

    const key =
        "keduLiked_" +
        currentPlayerLecture.id;

    const current =
        localStorage.getItem(
            key
        ) === "true";

    localStorage.setItem(
        key,
        String(!current)
    );

    if(!current){

        localStorage.removeItem(
            "keduUnliked_" +
            currentPlayerLecture.id
        );

    }

    updatePlayerActions(
        currentPlayerLecture
    );

}


/* ========================================================= */
/* UNLIKE                                                     */
/* ========================================================= */

function toggleLectureUnlike(){

    if(!currentPlayerLecture){

        return;

    }

    const key =
        "keduUnliked_" +
        currentPlayerLecture.id;

    const current =
        localStorage.getItem(
            key
        ) === "true";

    localStorage.setItem(
        key,
        String(!current)
    );

    if(!current){

        localStorage.removeItem(
            "keduLiked_" +
            currentPlayerLecture.id
        );

    }

    updatePlayerActions(
        currentPlayerLecture
    );

}


/* ========================================================= */
/* SHARE                                                      */
/* ========================================================= */

async function shareLecture(){

    if(!currentPlayerLecture){

        return;

    }

    const title =
        currentPlayerLecture.title ||
        "KEDU Academy Lecture";

    const shareUrl =
        window.location.href;

    if(
        navigator.share
    ){

        try{

            await navigator.share({

                title:title,

                text:
                    "Watch this lecture on KEDU Academy",

                url:shareUrl

            });

            return;

        }

        catch(error){}

    }

    try{

        await navigator.clipboard.writeText(
            shareUrl
        );

        showPlayerToast(
            "Lecture link copied"
        );

    }

    catch(error){

        showPlayerToast(
            "Unable to share lecture"
        );

    }

}




/* ========================================================= */
/* OPEN DOWNLOAD QUALITY PANEL                               */
/* ========================================================= */

function openDownloadQualityPanel(){

    if(!currentPlayerLecture){
        return;
    }

    if(
        downloadQualityPanel
    ){
        downloadQualityPanel.hidden =
            false;
    }

}


/* ========================================================= */
/* CLOSE DOWNLOAD QUALITY PANEL                              */
/* ========================================================= */

function closeDownloadQualityPanel(){

    if(
        downloadQualityPanel
    ){
        downloadQualityPanel.hidden =
            true;
    }

}


/* ========================================================= */
/* UPDATE PLAYER DOWNLOAD STATE                              */
/* ========================================================= */

function updatePlayerDownloadState(){

    if(
        !playerDownloadButton ||
        !currentPlayerLecture
    ){
        return;
    }

    const icon =
        document.getElementById(
            "lecture-player-download-icon"
        );

    const label =
        document.getElementById(
            "lecture-player-download-label"
        );

    let downloaded = false;

    if(
        window.KEDUDownload &&
        typeof
            window.KEDUDownload.isLectureDownloaded ===
            "function"
    ){

        downloaded =
            window.KEDUDownload.isLectureDownloaded(
                currentPlayerLecture.id
            );

    }

    if(downloaded){

        playerDownloadButton.classList.add(
            "download-completed"
        );

        if(icon){

            icon.textContent =
                "download_done";

        }

        if(label){

            label.textContent =
                "Downloaded";

        }

        playerDownloadButton.setAttribute(
            "aria-label",
            "Lecture Downloaded"
        );

    }
    else{

        playerDownloadButton.classList.remove(
            "download-completed"
        );

        if(icon){

            icon.textContent =
                "download";

        }

        if(label){

            label.textContent =
                "Download";

        }

        playerDownloadButton.setAttribute(
            "aria-label",
            "Download Lecture"
        );

    }

}


/* ========================================================= */
/* DOWNLOAD LECTURE                                          */
/* ========================================================= */

function downloadLecture(){

    if(!currentPlayerLecture){

        showPlayerToast(
            "Lecture is not available"
        );

        return;

    }


    if(
        window.KEDUDownload &&
        typeof
            window.KEDUDownload.isLectureDownloaded ===
            "function" &&
        window.KEDUDownload.isLectureDownloaded(
            currentPlayerLecture.id
        )
    ){

        showPlayerToast(
            "Lecture Already Downloaded"
        );

        return;

    }


    openDownloadQualityPanel();

}


/* ========================================================= */
/* NOTES                                                      */
/* ========================================================= */

/* ========================================================= */
/* NOTES                                                      */
/* ========================================================= */

function openLectureNotes(){

    const notes =
        getCurrentLectureNotes();

    if(!notes || !notes.file){

        showPlayerToast(
            "Lecture Notes are not available yet"
        );

        return;

    }

    openLectureAttachment(
        notes
    );

}

/* ========================================================= */
/* SUBSCRIBE STATE                                            */
/* ========================================================= */

function getKeduSubscriptionState(){

    return localStorage.getItem(
        "keduAcademySubscribed"
    ) === "true";

}


/* ========================================================= */
/* UPDATE SUBSCRIBE UI                                        */
/* ========================================================= */

function updateSubscribeUI(){

    if(!playerSubscribeButton){

        return;

    }


    const subscribed =
        getKeduSubscriptionState();


    if(subscribed){

        playerSubscribeButton.textContent =
            "Subscribed";

        playerSubscribeButton.classList.add(
            "subscribed"
        );

        playerSubscribeButton.setAttribute(
            "aria-label",
            "Subscribed to KEDU Academy"
        );

    }

    else{

        playerSubscribeButton.textContent =
            "Subscribe";

        playerSubscribeButton.classList.remove(
            "subscribed"
        );

        playerSubscribeButton.setAttribute(
            "aria-label",
            "Subscribe to KEDU Academy"
        );

    }

}


/* ========================================================= */
/* SUBSCRIBE                                                  */
/* ========================================================= */

function subscribeToKedu(){

    const subscribed =
        getKeduSubscriptionState();


    localStorage.setItem(
        "keduAcademySubscribed",
        String(!subscribed)
    );


    updateSubscribeUI();


    showPlayerToast(
        !subscribed
            ? "Subscribed to KEDU Academy"
            : "Subscription removed"
    );

}

/* ========================================================= */
/* SHORT DESCRIPTION                                         */
/* ========================================================= */

function getShortDescription(
    description
){

    const text =
        String(
            description || ""
        );

    if(text.length <= 160){

        return text;

    }

    return (
        text.substring(
            0,
            160
        ) +
        "..."
    );

}


/* ========================================================= */
/* CONTINUE WATCHING                                         */
/* ========================================================= */

function renderContinueWatching(){

    if(!continueList){

        return;

    }

    continueList.innerHTML =
        "";

    const items = [];

    currentPlayerList
        .forEach(lecture=>{

            const progress =
                Number(
                    localStorage.getItem(
                        getProgressKey(
                            lecture
                        )
                    )
                );

            if(
                progress > 5
            ){

                items.push({

                    lecture,

                    progress

                });

            }

        });

    if(items.length === 0){

        return;

    }

    items
        .slice(0,5)
        .forEach(item=>{

            continueList
                .insertAdjacentHTML(

                    "beforeend",

                    createRelatedCard(
                        item.lecture,
                        item.progress
                    )

                );

        });

}


/* ========================================================= */
/* RECOMMENDED LECTURES                                      */
/* ========================================================= */

function renderRecommendedLectures(){

    if(!recommendList){

        return;

    }

    recommendList.innerHTML =
        "";

    currentPlayerList
        .filter(
            lecture =>
                !currentPlayerLecture ||
                String(lecture.id) !==
                String(
                    currentPlayerLecture.id
                )
        )

        .slice(0,5)

        .forEach(lecture=>{

            recommendList
                .insertAdjacentHTML(

                    "beforeend",

                    createRelatedCard(
                        lecture
                    )

                );

        });

}


/* ========================================================= */
/* RELATED LECTURES                                          */
/* ========================================================= */

function renderRelatedLectures(){

    if(!relatedList){

        return;

    }

    relatedList.innerHTML =
        "";

    currentPlayerList
        .filter(
            lecture =>
                !currentPlayerLecture ||
                String(lecture.id) !==
                String(
                    currentPlayerLecture.id
                )
        )

        .slice(5,10)

        .forEach(lecture=>{

            relatedList
                .insertAdjacentHTML(

                    "beforeend",

                    createRelatedCard(
                        lecture
                    )

                );

        });

}


/* ========================================================= */
/* RELATED CARD                                               */
/* ========================================================= */

function createRelatedCard(
    lecture,
    progress = 0
){

    const thumbnail =
        lecture.thumbnail ||
        "";

    const title =
        lecture.title ||
        "Lecture";

    const duration =
        lecture.duration ||
        "";

    return `

        <button
            type="button"
            class="lecture-player-related-card"
            data-player-lecture-id="${escapePlayerHTML(lecture.id)}">

            <div class="lecture-player-related-thumb">

                ${
                    thumbnail
                    ?
                    `
                    <img
                        src="${escapePlayerHTML(thumbnail)}"
                        alt="${escapePlayerHTML(title)}">
                    `
                    :
                    `
                    <span class="material-symbols-rounded">
                        play_circle
                    </span>
                    `
                }

                ${
                    duration
                    ?
                    `
                    <span>
                        ${escapePlayerHTML(duration)}
                    </span>
                    `
                    :
                    ""
                }

            </div>

            <div class="lecture-player-related-info">

                <strong>
                    ${escapePlayerHTML(title)}
                </strong>

                ${
                    progress > 0
                    ?
                    `
                    <small>
                        Continue From
                        ${escapePlayerHTML(
                            formatPlayerTime(progress)
                        )}
                    </small>
                    `
                    :
                    ""
                }

            </div>

        </button>

    `;

}
/* ========================================================= */
/* FULLSCREEN MORE VIDEOS                                    */
/* ========================================================= */

const fullscreenMoreButton =
    playerElement(
        "lecture-player-fullscreen-more-btn"
    );

const fullscreenMorePanel =
    playerElement(
        "lecture-player-fullscreen-more-panel"
    );

const fullscreenMoreClose =
    playerElement(
        "lecture-player-fullscreen-more-close"
    );

const fullscreenMoreList =
    playerElement(
        "lecture-player-fullscreen-more-list"
    );

const fullscreenMoreThumb =
    playerElement(
        "lecture-player-fullscreen-more-thumb"
    );


/* ========================================================= */
/* GET MAXIMUM 12 COMBINED VIDEOS                             */
/* ========================================================= */

function getFullscreenMoreVideos(){

    if(
        !Array.isArray(
            currentPlayerList
        )
    ){

        return [];

    }


    const videos =
        currentPlayerList.filter(
            lecture => {

                if(
                    !currentPlayerLecture
                ){

                    return true;

                }


                return String(
                    lecture.id
                ) !==
                String(
                    currentPlayerLecture.id
                );

            }
        );


    const uniqueVideos = [];

    const seen =
        new Set();


    videos.forEach(
        lecture => {

            const id =
                String(
                    lecture.id
                );


            if(
                seen.has(id)
            ){

                return;

            }


            seen.add(id);

            uniqueVideos.push(
                lecture
            );

        }
    );


    /*
     * ONE COMBINED LIST.
     * MAXIMUM 12.
     */

    return uniqueVideos.slice(
        0,
        12
    );

}


/* ========================================================= */
/* RENDER FULLSCREEN MORE VIDEOS                             */
/* ========================================================= */

function renderFullscreenMoreVideos(){

    if(
        !fullscreenMoreList
    ){

        return;

    }


    fullscreenMoreList.innerHTML =
        "";


    const videos =
        getFullscreenMoreVideos();


    videos.forEach(
        lecture => {

            fullscreenMoreList.insertAdjacentHTML(
                "beforeend",

                createRelatedCard(
                    lecture
                )

            );

        }
    );


    /*
     * FIRST THUMBNAIL FOR THE PILL
     */

    if(
        fullscreenMoreThumb
    ){

        const first =
            videos[0];


        if(
            first &&
            first.thumbnail
        ){

            fullscreenMoreThumb.style.backgroundImage =
                `url("${first.thumbnail}")`;

        }

        else{

            fullscreenMoreThumb.style.backgroundImage =
                "none";

        }

    }

}


/* ========================================================= */
/* OPEN MORE VIDEOS                                          */
/* ========================================================= */

fullscreenMoreButton
?.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        renderFullscreenMoreVideos();


        if(
            fullscreenMorePanel
        ){

            fullscreenMorePanel.hidden =
                false;

        }

    }
);


/* ========================================================= */
/* CLOSE MORE VIDEOS                                         */
/* ========================================================= */

fullscreenMoreClose
?.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        if(
            fullscreenMorePanel
        ){

            fullscreenMorePanel.hidden =
                true;

        }

    }
);


/* ========================================================= */
/* CLOSE WHEN CLICKING OUTSIDE                               */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        if(
            !fullscreenMorePanel ||
            fullscreenMorePanel.hidden
        ){

            return;

        }


        if(
            fullscreenMorePanel.contains(
                event.target
            )
        ){

            return;

        }


        if(
            fullscreenMoreButton &&
            fullscreenMoreButton.contains(
                event.target
            )
        ){

            return;

        }


        fullscreenMorePanel.hidden =
            true;

    }
);
/* ========================================================= */
/* RELATED CARD CLICK                                         */
/* ========================================================= */

function handleRelatedLectureClick(
    element
){

    const id =
        element.dataset
            .playerLectureId;

    if(!id){

        return;

    }

    const lecture =
        currentPlayerList.find(
            item =>
                String(item.id) ===
                String(id)
        );

    if(!lecture){

        return;

    }

    currentPlayerLecture =
        lecture;

    currentPlayerIndex =
        currentPlayerList.findIndex(
            item =>
                String(item.id) ===
                String(id)
        );

    populateLecturePlayer(
        lecture
    );

}


/* ========================================================= */
/* PLAYER TOAST                                               */
/* ========================================================= */

function showPlayerToast(
    message
){

    if(
        typeof showToast ===
        "function"
    ){

        showToast(
            message
        );

        return;

    }

    console.log(
        "KEDU Academy:",
        message
    );

}


/* ========================================================= */
/* RESET PLAYER CONTROLS                                    */
/* ========================================================= */

function resetPlayerControls(){

    if(playerProgress){
        playerProgress.value = 0;
    }

    if(playerCurrentTime){
        playerCurrentTime.textContent = "0:00";
    }

    if(playerDuration){
        playerDuration.textContent = "0:00";
    }

    if(playerVideo){
        playerVideo.playbackRate = 1;
    }

    if(playerCurrentSpeed){
        playerCurrentSpeed.textContent = "1×";
    }

    /* ========================================= */
    /* ALWAYS SHOW CONTROLS WHEN NEW VIDEO OPENS */
    /* ========================================= */

    if(playerControlsTimer){
        clearTimeout(playerControlsTimer);
        playerControlsTimer = null;
    }

    playerControlsVisible = true;

    if(playerVideoSection){
        playerVideoSection.classList.remove(
            "player-controls-hidden"
        );
    }

    /* Hide automatically after 15 seconds */
    if(playerVideoSection){
        playerControlsTimer = setTimeout(
            () => {
                hidePlayerControls();
            },
            8000
        );
    }

    updateAutoplayUI();

    showPlayerControls(true);

}


/* ========================================================= */
/* PLAYER VIDEO EVENTS                                        */
/* ========================================================= */

if(playerVideo){

    playerVideo.addEventListener(
        "play",
        ()=>{

            updatePlayIcon();

        }
    );

    playerVideo.addEventListener(
        "pause",
        ()=>{

            updatePlayIcon();

        }
    );
    playerVideo.addEventListener(
        "pause",
        ()=>{
            updateMiniPlayerPlayIcon();
        }
    );
    playerVideo.addEventListener(
        "timeupdate",
        ()=>{

            updatePlayerProgress();

        }
    );

    playerVideo.addEventListener(
        "loadedmetadata",
        ()=>{

            hideBuffering();

            updatePlayerProgress();

            if(
                selectedCaption !==
                "off"
            ){

                applyCaptionTrack(
                    selectedCaption
                );

            }

        }
    );

    playerVideo.addEventListener(
        "waiting",
        ()=>{

            showBuffering();

        }
    );

    playerVideo.addEventListener(
        "playing",
        ()=>{

            hideBuffering();

        }
    );

    playerVideo.addEventListener(
        "canplay",
        ()=>{

            hideBuffering();

        }
    );

playerVideo.addEventListener(
    "error",
    () => {

        hideBuffering();

        const mediaError =
            playerVideo.error;

        console.error(
            "KEDU VIDEO ERROR:",
            mediaError
        );

        if(mediaError){

            console.error(
                "Error code:",
                mediaError.code
            );

            console.error(
                "Video URL:",
                playerVideo.currentSrc
            );
        }

        showPlayerError();
    }
);

    playerVideo.addEventListener(
        "ended",
        ()=>{

            markLectureCompleted();

            updatePlayIcon();

            startAutoplayCountdown();

        }
    );

}


/* ========================================================= */
/* PLAYER BUTTON EVENTS                                       */
/* ========================================================= */

playerPlayButton
?.addEventListener(
    "click",
    toggleLecturePlayback
);

playerPreviousButton
?.addEventListener(
    "click",
    playPreviousLecture
);

playerNextButton
?.addEventListener(
    "click",
    playNextLecture
);

/* ========================================================= */
/* MINI PLAYER BUTTON                                        */
/* ========================================================= */

playerBackButton
?.addEventListener(
    "click",
    toggleLectureMiniPlayer
);
/* ========================================================= */
/* GLOBAL MINI PLAYER BUTTONS                                */
/* ========================================================= */

miniPlayerPlay
?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        toggleMiniPlayerPlayback();

    }
);


miniPlayerClose
?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        closeGlobalMiniPlayer();

    }
);
if(miniPlayerVideo){

    miniPlayerVideo.addEventListener(
        "play",
        updateMiniPlayerPlayIcon
    );

    miniPlayerVideo.addEventListener(
        "pause",
        updateMiniPlayerPlayIcon
    );

}
/* ========================================================= */
/* MINI PLAYER TAP SYSTEM                                    */
/* ========================================================= */

miniPlayer
?.addEventListener(
    "click",
    event => {

        if(miniPlayerMoved){

            miniPlayerMoved =
                false;

            return;

        }

        if(
            event.target.closest(
                "button"
            )
        ){

            return;

        }

        const now =
            Date.now();

        const delta =
            now -
            miniLastTapTime;


        /* ================================================= */
        /* DOUBLE TAP → OPEN VERTICAL PLAYER                 */
        /* ================================================= */

        if(
            delta > 0 &&
            delta < 320
        ){

            if(miniVideoTapTimer){

                clearTimeout(
                    miniVideoTapTimer
                );

                miniVideoTapTimer =
                    null;

            }

            miniLastTapTime =
                0;

            openFullFromMiniPlayer();

            return;

        }


        /* ================================================= */
        /* SINGLE TAP → SHOW / HIDE CONTROLS                 */
        /* ================================================= */

        miniLastTapTime =
            now;

        if(miniVideoTapTimer){

            clearTimeout(
                miniVideoTapTimer
            );

        }

        miniVideoTapTimer =
            setTimeout(
                () => {

                    toggleMiniPlayerControls();

                    miniVideoTapTimer =
                        null;

                },
                220
            );

    }
);
/* ========================================================= */
/* MINI PLAYER DRAG — SIDE ONLY                              */
/* ========================================================= */

if(miniPlayer){

    miniPlayer.addEventListener(
        "pointerdown",
        event => {

            if(
                event.target.closest(
                    "button"
                )
            ){

                return;

            }


            miniPlayerDragging =
                true;

            miniPlayerMoved =
                false;

            miniPlayerStartX =
                event.clientX;

            miniPlayerStartY =
                event.clientY;


            const rect =
                miniPlayer.getBoundingClientRect();


            miniPlayerStartBottom =
                window.innerHeight -
                rect.bottom;


            miniPlayer.classList.add(
                "dragging"
            );


            miniPlayer.setPointerCapture(
                event.pointerId
            );

        }
    );


    miniPlayer.addEventListener(
        "pointermove",
        event => {

            if(
                !miniPlayerDragging
            ){

                return;

            }


            const deltaX =
                event.clientX -
                miniPlayerStartX;

            const deltaY =
                event.clientY -
                miniPlayerStartY;


            if(
                Math.abs(deltaX) > 8 ||
                Math.abs(deltaY) > 8
            ){

                miniPlayerMoved =
                    true;

            }


            const maxBottom =
                window.innerHeight -
                miniPlayer.offsetHeight -
                70;


            const minBottom =
                70;


            let newBottom =
                miniPlayerStartBottom -
                deltaY;


            newBottom =
                Math.max(
                    minBottom,
                    Math.min(
                        maxBottom,
                        newBottom
                    )
                );


            miniPlayer.style.bottom =
                newBottom +
                "px";


            /*
             * Do NOT allow center position.
             * Only remember which side
             * the user dragged toward.
             */

            if(
                event.clientX <
                window.innerWidth / 2
            ){

                miniPlayerSide =
                    "left";

            }

            else{

                miniPlayerSide =
                    "right";

            }

        }
    );


    miniPlayer.addEventListener(
        "pointerup",
        event => {

            if(
                !miniPlayerDragging
            ){

                return;

            }


            miniPlayerDragging =
                false;


            miniPlayer.classList.remove(
                "dragging"
            );


            applyMiniPlayerSide();


            localStorage.setItem(
                "keduMiniPlayerSide",
                miniPlayerSide
            );


            try{

                miniPlayer.releasePointerCapture(
                    event.pointerId
                );

            }

            catch(error){}

        }
    );


    miniPlayer.addEventListener(
        "pointercancel",
        () => {

            miniPlayerDragging =
                false;

            miniPlayer.classList.remove(
                "dragging"
            );

            applyMiniPlayerSide();

        }
    );

}
playerFullscreenButton
?.addEventListener(
    "click",
    event => {
        event.preventDefault();
        event.stopPropagation();

        toggleLectureFullscreen();
    }
);

playerRetry
?.addEventListener(
    "click",
    retryLecture
);

playerProgress
?.addEventListener(
    "input",
    handleProgressInput
);

playerDescriptionToggle
?.addEventListener(
    "click",
    event => {
        event.preventDefault();
        event.stopPropagation();

        openLectureDescription();
    }
);

playerTitlePreview
?.addEventListener(
    "click",
    event => {

        if(
            playerDescriptionToggle &&
            playerDescriptionToggle.contains(
                event.target
            )
        ){
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        openLectureDescription();
    }
);


playerDescriptionClose
?.addEventListener(
    "click",
    closeLectureDescription
);
/* ========================================================= */
/* DESCRIPTION SHEET — TAP OUTSIDE TO CLOSE                  */
/* ========================================================= */

playerPage
?.addEventListener(
    "click",
    event => {

if(
    playerDescriptionToggle &&
    playerDescriptionToggle.contains(event.target)
){
    return;
}


        /*
         * If the click happened inside
         * the description sheet,
         * do nothing.
         */

        if(
            playerDescriptionSheet.contains(
                event.target
            )
        ){

            return;

        }


        /*
         * Anything outside the sheet
         * closes it.
         */

        closeLectureDescription();

    }
);
/* ========================================================= */
/* DESCRIPTION SHEET — SWIPE DOWN TO CLOSE                   */
/* ========================================================= */

playerDescriptionSheet
?.addEventListener(
    "touchstart",
    event => {

        if(
            playerDescriptionSheet.hidden
        ){

            return;

        }

        const touch =
            event.touches[0];

        if(!touch){

            return;

        }


        /*
         * Only allow swipe-to-close
         * when the sheet is already
         * at the top of its scroll.
         */

        if(
            playerDescriptionSheet.scrollTop > 0
        ){

            descriptionSwipeActive =
                false;

            return;

        }


        descriptionSwipeStartY =
            touch.clientY;

        descriptionSwipeStartX =
            touch.clientX;

        descriptionSwipeActive =
            true;

    },
    {
        passive:true
    }
);


/* ========================================================= */
/* SWIPE MOVE                                                 */
/* ========================================================= */

playerDescriptionSheet
?.addEventListener(
    "touchmove",
    event => {

        if(
            !descriptionSwipeActive ||
            playerDescriptionSheet.hidden
        ){

            return;

        }


        const touch =
            event.touches[0];

        if(!touch){

            return;

        }


        const deltaY =
            touch.clientY -
            descriptionSwipeStartY;


        const deltaX =
            touch.clientX -
            descriptionSwipeStartX;


        /*
         * Ignore horizontal gestures.
         */

        if(
            Math.abs(deltaX) >
            Math.abs(deltaY)
        ){

            descriptionSwipeActive =
                false;

            return;

        }


        /*
         * Only follow the finger
         * while swiping downward.
         */

        if(deltaY <= 0){

            return;

        }


        /*
         * Limit the movement.
         */

const translateY =
    Math.min(
        deltaY,
        260
    );

playerDescriptionSheet.style.transition =
    "none";

playerDescriptionSheet.style.transform =
    `translateY(${translateY}px)`;
    },
    {
        passive:true
    }
);


/* ========================================================= */
/* SWIPE END                                                  */
/* ========================================================= */

playerDescriptionSheet
?.addEventListener(
    "touchend",
    event => {

        if(
            !descriptionSwipeActive
        ){

            return;

        }


        const touch =
            event.changedTouches[0];

        if(!touch){

            descriptionSwipeActive =
                false;

            return;

        }


        const deltaY =
            touch.clientY -
            descriptionSwipeStartY;


        const deltaX =
            touch.clientX -
            descriptionSwipeStartX;


        descriptionSwipeActive =
            false;


        /*
         * Ignore horizontal gesture.
         */

        if(
            Math.abs(deltaX) >
            Math.abs(deltaY)
        ){

            playerDescriptionSheet.style.transform =
                "";
playerDescriptionSheet.style.transition =
    "";
   
            return;

        }


        /*
         * Close after a meaningful
         * downward swipe.
         */

if(deltaY >= 90){

    playerDescriptionSheet.style.transform =
        "";
playerDescriptionSheet.style.transition =
    "";
    closeLectureDescription();

    return;

}

        /*
         * Small swipe:
         * return sheet to original position.
         */

        playerDescriptionSheet.style.transform =
            "";
playerDescriptionSheet.style.transition =
    "";
    
    },
    {
        passive:true
    }
);


/* ========================================================= */
/* SWIPE CANCEL                                               */
/* ========================================================= */

playerDescriptionSheet
?.addEventListener(
    "touchcancel",
    () => {

        descriptionSwipeActive =
            false;

        playerDescriptionSheet.style.transform =
            "";
playerDescriptionSheet.style.transition =
    "";
    }
);
/* ========================================================= */
/* SETTINGS EVENTS                                            */
/* ========================================================= */

playerSettingsButton
?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        toggleSettingsPanel();

    }
);

playerSettingsClose
?.addEventListener(
    "click",
    closeAllPlayerPanels
);

playerQualityOption
?.addEventListener(
    "click",
    openQualityPanel
);

playerSpeedOption
?.addEventListener(
    "click",
    openSpeedPanel
);

playerCaptionOption
?.addEventListener(
    "click",
    openCaptionPanel
);

playerAutoplayOption
?.addEventListener(
    "click",
    toggleAutoplay
);

playerResumeOption
?.addEventListener(
    "click",
    toggleResume
);

playerCaptionMemoryOption
?.addEventListener(
    "click",
    toggleCaptionMemory
);

playerLockOption
?.addEventListener(
    "click",
    togglePlayerLock
);

playerMoreOption
?.addEventListener(
    "click",
    ()=>{
        showPlayerToast(
            "More player options will be added later"
        );
    }
);

/* ========================================================= */
/* TOP CAPTION BUTTON                                         */
/* ========================================================= */

captionButton
?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        openCaptionPanel();

    }
);

/* ========================================================= */
/* QUALITY BUTTONS                                            */
/* ========================================================= */

document.addEventListener(
    "click",
    event=>{

        const button =
            event.target.closest(
                "[data-quality]"
            );

        if(!button){

            return;

        }

        if(
            !qualityPanel ||
            !qualityPanel.contains(
                button
            )
        ){

            return;

        }

        setLectureQuality(
            button.dataset.quality
        );

    }
);


/* ========================================================= */
/* SPEED BUTTONS                                              */
/* ========================================================= */

document.addEventListener(
    "click",
    event=>{

        const button =
            event.target.closest(
                "[data-speed]"
            );

        if(!button){

            return;

        }

        if(
            !speedPanel ||
            !speedPanel.contains(
                button
            )
        ){

            return;

        }

        setLectureSpeed(
            button.dataset.speed
        );

    }
);


/* ========================================================= */
/* CAPTION BUTTONS                                            */
/* ========================================================= */

document.addEventListener(
    "click",
    event=>{

        const button =
            event.target.closest(
                "[data-caption]"
            );

        if(!button){

            return;

        }

        if(
            !captionPanel ||
            !captionPanel.contains(
                button
            )
        ){

            return;

        }

        setLectureCaption(
            button.dataset.caption
        );

    }
);


/* ========================================================= */
/* AUTOPLAY CANCEL                                            */
/* ========================================================= */

autoplayCancel
?.addEventListener(
    "click",
    stopAutoplayCountdown
);
/* ========================================================= */
/* AUTOPLAY TOP TOGGLE                                       */
/* ========================================================= */

autoplayButton
?.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        toggleAutoplay();

    }
);

/* ========================================================= */
/* ACTION BUTTONS                                             */
/* ========================================================= */

playerLikeButton
?.addEventListener(
    "click",
    toggleLectureLike
);

playerUnlikeButton
?.addEventListener(
    "click",
    toggleLectureUnlike
);

playerShareButton
?.addEventListener(
    "click",
    shareLecture
);
/* ========================================================= */
/* FULLSCREEN ACTION BUTTONS — DIRECT ACTIONS                */
/* ========================================================= */

fullscreenLikeButton
?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        if(!currentPlayerLecture){
            return;
        }

        toggleLectureLike();

    }
);


fullscreenUnlikeButton
?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        if(!currentPlayerLecture){
            return;
        }

        toggleLectureUnlike();

    }
);


fullscreenShareButton
?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        if(!currentPlayerLecture){
            return;
        }

        shareLecture();

    }
);
playerDownloadButton
?.addEventListener(
    "click",
    downloadLecture
);

playerNotesButton
?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        openLectureAttachmentSheet();

    }
);

playerSubscribeButton
?.addEventListener(
    "click",
    subscribeToKedu
);


/* ========================================================= */
/* RELATED / RECOMMENDED CLICK                                */
/* ========================================================= */

document.addEventListener(
    "click",
    event=>{

        const card =
            event.target.closest(
                ".lecture-player-related-card"
            );

        if(!card){

            return;

        }

        handleRelatedLectureClick(
            card
        );

    }
);


/* ========================================================= */
/* VIDEO CLICK                                                */
/* ========================================================= */
/* ========================================================= */
/* VIDEO SWIPE — PORTRAIT → MINI / LANDSCAPE → PORTRAIT      */
/* ========================================================= */

playerVideo?.addEventListener(
    "touchstart",
    event => {

        if(playerLocked){
            return;
        }

        const touch =
            event.touches[0];

        if(!touch){
            return;
        }

        videoSwipeStartX =
            touch.clientX;

        videoSwipeStartY =
            touch.clientY;

        videoSwipeActive =
            true;
    },
    {
        passive:true
    }
);


playerVideo?.addEventListener(
    "touchend",
    event => {

        if(
            !videoSwipeActive ||
            playerLocked
        ){
            return;
        }

        videoSwipeActive =
            false;

        const touch =
            event.changedTouches[0];

        if(!touch){
            return;
        }

        const deltaX =
            touch.clientX -
            videoSwipeStartX;

        const deltaY =
            touch.clientY -
            videoSwipeStartY;

        /*
         * Only vertical downward swipe.
         */
        if(
            deltaY < 80 ||
            Math.abs(deltaY) <=
            Math.abs(deltaX)
        ){
            return;
        }

        /*
         * LANDSCAPE → PORTRAIT
         */
        if(
            window.innerWidth >
            window.innerHeight &&
            document.fullscreenElement
        ){

            document.exitFullscreen()
                .catch(
                    ()=>{}
                );

            if(
                screen.orientation &&
                screen.orientation.lock
            ){
                screen.orientation.lock(
                    "portrait"
                ).catch(
                    ()=>{}
                );
            }

            return;
        }

        /*
         * PORTRAIT → MINI PLAYER
         */
        if(
            window.innerWidth <
            window.innerHeight &&
            !miniPlayerMode
        ){

            toggleLectureMiniPlayer();
        }

    },
    {
        passive:true
    }
);
/* ========================================================= */
/* VIDEO TAP CONTROL SYSTEM                                  */
/* ========================================================= */


/* ========================================================= */
/* MOBILE TOUCH                                              */
/* ========================================================= */

playerVideo
?.addEventListener(
    "touchend",
    event => {

        if(playerLocked){
            return;
        }

        const touch =
            event.changedTouches[0];

        if(!touch){
            return;
        }

        const now =
            Date.now();

        const delta =
            now -
            videoLastTapTime;

        const deltaX =
            Math.abs(
                touch.clientX -
                videoLastTapX
            );


        /* ================================================= */
        /* DOUBLE TAP — SEEK                                 */
        /* ================================================= */

        if(
            delta > 0 &&
            delta < 320 &&
            deltaX < 80
        ){

            if(videoTapTimer){

                clearTimeout(
                    videoTapTimer
                );

                videoTapTimer = null;

            }


            const rect =
                playerVideo.getBoundingClientRect();

            const tapX =
                touch.clientX -
                rect.left;


            if(
                tapX <
                rect.width / 2
            ){

                seekLecture(-10);

                showPlayerToast(
                    "−10 seconds"
                );

            }

            else{

                seekLecture(10);

                showPlayerToast(
                    "+10 seconds"
                );

            }


            videoLastTapTime = 0;

            event.preventDefault();

            return;

        }


        /* ================================================= */
        /* FIRST TAP — SHOW/HIDE CONTROLS                    */
        /* ================================================= */

videoLastTapTime =
    now;

videoLastTapX =
    touch.clientX;

showPlayerControls(true);

videoTouchHandled =
    true;

setTimeout(
    () => {
        videoTouchHandled = false;
    },
    350
);

        if(videoTapTimer){

            clearTimeout(
                videoTapTimer
            );

        }


videoTapTimer =
    setTimeout(
        () => {
            showPlayerControls(true);

            videoTapTimer = null;
        },
        220
    );

    },
    {
        passive:false
    }
);


/* ========================================================= */
/* DESKTOP CLICK                                             */
/* ========================================================= */

playerVideo
?.addEventListener(
    "click",
    event => {

        if(playerLocked){
            return;
        }


        /*
         * Ignore synthetic click produced
         * immediately after touch.
         */

        if(
            event.detail > 1
        ){
            return;
        }


        togglePlayerControls();

    }
);
/* ========================================================= */
/* PLAYER CONTROL INTERACTION                                */
/* ========================================================= */

[
    playerElement(
        "lecture-player-top-controls"
    ),

    playerElement(
        "lecture-player-bottom-controls"
    ),

    playerElement(
        "lecture-player-center-controls"
    ),

    playerElement(
        "lecture-player-bottom-actions"
    )
]
.forEach(
    controls => {

        controls
        ?.addEventListener(
            "pointerdown",
            event => {

                event.stopPropagation();

                showPlayerControls(true);

            }
        );

    }
);
/* ========================================================= */
/* KEYBOARD CONTROLS                                          */
/* ========================================================= */

document.addEventListener(
    "keydown",
    event=>{

        if(
            !playerPage ||
            !playerPage.classList.contains(
                "active"
            )
        ){

            return;

        }

        if(
            event.target.matches(
                "input,textarea,button"
            )
        ){

            return;

        }

        switch(event.key){

            case " ":

                event.preventDefault();

                toggleLecturePlayback();

                break;


            case "ArrowLeft":

                seekLecture(-10);

                break;


            case "ArrowRight":

                seekLecture(10);

                break;


            case "ArrowUp":

                if(playerVideo){

                    playerVideo.volume =
                        Math.min(
                            1,
                            playerVideo.volume +
                            0.1
                        );

                }

                break;


            case "ArrowDown":

                if(playerVideo){

                    playerVideo.volume =
                        Math.max(
                            0,
                            playerVideo.volume -
                            0.1
                        );

                }

                break;


            case "f":

            case "F":

                toggleLectureFullscreen();

                break;


            case "Escape":

                if(playerSettingsOpen){

                    closeAllPlayerPanels();

                }

                break;

        }

    }
);


/* ========================================================= */
/* BACK BUTTON / ANDROID BACK SUPPORT                         */
/* ========================================================= */

window.addEventListener(
    "popstate",
    ()=>{

        if(
            playerPage &&
            playerPage.classList.contains(
                "active"
            )
        ){

            closeLecturePlayer();

        }

    }
);


/* ========================================================= */
/* INITIAL PLAYER UI                                          */
/* ========================================================= */
updateSubscribeUI();
updateAutoplayUI();

if(playerCurrentCaption){

    const captionNames = {

        off:"Off",

        hi:"Hindi",

        en:"English",

        ta:"Tamil",

        gu:"Gujarati"

    };

    playerCurrentCaption.textContent =
        captionNames[
            selectedCaption
        ] || "Off";

}




/* ========================================================= */
/* LECTURE PLAYER READY                                      */
/* ========================================================= */

console.log(
    "KEDU Academy Lecture Player Ready"
);


/* ========================================================= */
/* END                                                        */
/* ========================================================= */
/* ========================================================= */
/* SETTINGS — TAP OUTSIDE TO CLOSE                           */
/* ========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        const panels = [
            playerSettingsPanel,
            qualityPanel,
            speedPanel,
            captionPanel
        ];

        const anyPanelOpen =
            panels.some(
                panel =>
                    panel &&
                    !panel.hidden
            );

        if(!anyPanelOpen){

            return;

        }

        const clickedInsidePanel =
            panels.some(
                panel =>
                    panel &&
                    !panel.hidden &&
                    (
                        panel.contains(
                            event.target
                        ) ||
                        event.composedPath().includes(
                            panel
                        )
                    )
            );

        const menuButtons = [
            playerSettingsButton,
            captionButton,
            playerQualityOption,
            playerSpeedOption,
            playerCaptionOption,
            playerAutoplayOption,
            playerResumeOption,
            playerCaptionMemoryOption,
            playerLockOption,
            playerMoreOption
        ];

        const clickedMenuButton =
            menuButtons.some(
                button =>
                    button &&
                    (
                        button === event.target ||
                        button.contains(
                            event.target
                        )
                    )
            );

        if(
            !clickedInsidePanel &&
            !clickedMenuButton
        ){

            closeAllPlayerPanels();

        }

    },
    true
);
/* ========================================================= */
/* PUBLIC LECTURE PLAYER API                                 */
/* ========================================================= */

window.openLecturePlayer =
    openLecturePlayer;

window.closeLecturePlayer =
    closeLecturePlayer;