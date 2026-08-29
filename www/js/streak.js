/* =========================================================
   KEDU PW — COMPLETE STREAK SYSTEM
========================================================= */

"use strict";


/* =========================================================
   CONSTANTS
========================================================= */

const KEDU_STREAK_STORAGE_KEY =
    "keduPWStreakV1";

const KEDU_STREAK_REQUIRED_SECONDS =
    10 * 60;


/* =========================================================
   STATE
========================================================= */

let streakData = {
    streak: 0,
    lastCompletedDate: null,
    todayDate: null,
    todaySeconds: 0
};

let streakTrackingTimer = null;

let streakTrackedVideo = null;

let streakLastVideoTime = null;

let streakAnimationTimer = null;


/* =========================================================
   ELEMENTS
========================================================= */

const streakButton =
    document.getElementById(
        "streak-button"
    );

const streakCount =
    document.getElementById(
        "streak-count"
    );

const streakOverlay =
    document.getElementById(
        "streak-overlay"
    );

const streakSheet =
    document.getElementById(
        "streak-sheet"
    );

const streakSheetClose =
    document.getElementById(
        "streak-sheet-close"
    );

const streakWhatsButton =
    document.getElementById(
        "streak-whats-button"
    );

const streakTutorial =
    document.getElementById(
        "streak-tutorial"
    );

const streakTutorialClose =
    document.getElementById(
        "streak-tutorial-close"
    );

const streakMinutes =
    document.getElementById(
        "streak-minutes"
    );

const streakProgressRing =
    document.getElementById(
        "streak-progress-ring"
    );

const streakNext1 =
    document.getElementById(
        "streak-next-1"
    );

const streakBack2 =
    document.getElementById(
        "streak-back-2"
    );

const streakNext2 =
    document.getElementById(
        "streak-next-2"
    );

const streakBack3 =
    document.getElementById(
        "streak-back-3"
    );

const streakClose3 =
    document.getElementById(
        "streak-close-3"
    );

const streakDemoNumber =
    document.getElementById(
        "streak-demo-number"
    );

const streakDemoRing =
    document.getElementById(
        "streak-demo-ring"
    );


/* =========================================================
   DATE
========================================================= */

function getStreakDate(){

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );

}


/* =========================================================
   DATE DIFFERENCE
========================================================= */

function getDateDifference(
    firstDate,
    secondDate
){

    if(
        !firstDate ||
        !secondDate
    ){

        return null;

    }


    const first =
        new Date(
            firstDate +
            "T00:00:00"
        );

    const second =
        new Date(
            secondDate +
            "T00:00:00"
        );


    const difference =
        second.getTime() -
        first.getTime();


    return Math.round(
        difference /
        86400000
    );

}


/* =========================================================
   LOAD DATA
========================================================= */

function loadStreakData(){

    try{

        const saved =
            localStorage.getItem(
                KEDU_STREAK_STORAGE_KEY
            );


        if(saved){

            const parsed =
                JSON.parse(
                    saved
                );


            if(
                parsed &&
                typeof parsed ===
                    "object"
            ){

                streakData = {
                    streak:
                        Number(
                            parsed.streak
                        ) || 0,

                    lastCompletedDate:
                        parsed.lastCompletedDate ||
                        null,

                    todayDate:
                        parsed.todayDate ||
                        null,

                    todaySeconds:
                        Number(
                            parsed.todaySeconds
                        ) || 0
                };

            }

        }

    }
    catch(error){

        console.warn(
            "KEDU Streak: Could not load data.",
            error
        );

    }


    refreshStreakDay();

}


/* =========================================================
   SAVE DATA
========================================================= */

function saveStreakData(){

    try{

        localStorage.setItem(
            KEDU_STREAK_STORAGE_KEY,
            JSON.stringify(
                streakData
            )
        );

    }
    catch(error){

        console.warn(
            "KEDU Streak: Could not save data.",
            error
        );

    }

}


/* =========================================================
   REFRESH CURRENT DAY
========================================================= */

function refreshStreakDay(){

    const today =
        getStreakDate();


    if(
        streakData.todayDate !==
        today
    ){

        streakData.todayDate =
            today;

        streakData.todaySeconds =
            0;

    }


    /*
     * Two consecutive missed days
     * break the streak.
     */

    if(
        streakData.lastCompletedDate
    ){

        const gap =
            getDateDifference(
                streakData.lastCompletedDate,
                today
            );


        if(
            gap !== null &&
            gap >= 2
        ){

            streakData.streak =
                0;

        }

    }


    saveStreakData();

    updateStreakUI();

}


/* =========================================================
   UPDATE HEADER
========================================================= */

function updateStreakUI(){

    if(streakCount){

        streakCount.textContent =
            String(
                streakData.streak
            );

    }


    updateStreakProgress();

}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateStreakProgress(){

    const seconds =
        Math.min(
            streakData.todaySeconds,
            KEDU_STREAK_REQUIRED_SECONDS
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    if(streakMinutes){

        streakMinutes.textContent =
            minutes +
            "/10";

    }


    if(streakProgressRing){

        const radius =
            50;

        const circumference =
            2 *
            Math.PI *
            radius;


        const percentage =
            seconds /
            KEDU_STREAK_REQUIRED_SECONDS;


        const offset =
            circumference *
            (1 - percentage);


        streakProgressRing.style.strokeDasharray =
            String(
                circumference
            );


        streakProgressRing.style.strokeDashoffset =
            String(
                offset
            );

    }

}


/* =========================================================
   OPEN STREAK SHEET
========================================================= */

function openStreakSheet(){

    refreshStreakDay();

    if(!streakOverlay){
        return;
    }


    if(streakTutorial){

        streakTutorial.hidden =
            true;

        streakTutorial
            .classList.remove(
                "open"
            );

    }


    streakOverlay
        .classList.add(
            "open"
        );

    streakOverlay
        .setAttribute(
            "aria-hidden",
            "false"
        );


    document.body.classList.add(
        "streak-open"
    );


    updateStreakUI();

}


/* =========================================================
   CLOSE STREAK SHEET
========================================================= */

function closeStreakSheet(){

    if(!streakOverlay){
        return;
    }


    streakOverlay
        .classList.remove(
            "open"
        );

    streakOverlay
        .setAttribute(
            "aria-hidden",
            "true"
        );


    document.body.classList.remove(
        "streak-open"
    );


    stopDemoAnimation();

}


/* =========================================================
   OPEN TUTORIAL
========================================================= */

function openStreakTutorial(){

    if(!streakTutorial){
        return;
    }


    if(streakSheet){

        streakSheet
            .classList.add(
                "streak-sheet-hidden"
            );

    }


    streakTutorial.hidden =
        false;


    requestAnimationFrame(
        () => {

            streakTutorial
                .classList.add(
                    "open"
                );

        }
    );


    showStreakTutorialPage(
        1
    );


    startDemoAnimation();

}


/* =========================================================
   CLOSE TUTORIAL
========================================================= */

function closeStreakTutorial(){

    if(!streakTutorial){
        return;
    }


    streakTutorial
        .classList.remove(
            "open"
        );


    setTimeout(
        () => {

            if(streakTutorial){

                streakTutorial.hidden =
                    true;

            }

        },
        220
    );


    if(streakSheet){

        streakSheet
            .classList.remove(
                "streak-sheet-hidden"
            );

    }


    stopDemoAnimation();

}


/* =========================================================
   TUTORIAL PAGE
========================================================= */

function showStreakTutorialPage(
    pageNumber
){

    if(!streakTutorial){
        return;
    }


    const pages =
        streakTutorial.querySelectorAll(
            ".streak-tutorial-page"
        );


    pages.forEach(
        page => {

            const pageNumberValue =
                Number(
                    page.dataset.streakPage
                );


            page.classList.toggle(
                "active",
                pageNumberValue ===
                    pageNumber
            );

        }
    );


    streakTutorial.dataset.currentPage =
        String(
            pageNumber
        );


    /*
     * Reset the demo whenever
     * page 1 is shown.
     */

    if(
        pageNumber === 1
    ){

        startDemoAnimation();

    }
    else{

        stopDemoAnimation();

    }

}


/* =========================================================
   DEMO ANIMATION
========================================================= */

function startDemoAnimation(){

    stopDemoAnimation();


    if(
        !streakDemoNumber ||
        !streakDemoRing
    ){

        return;

    }


    let value =
        0;


    const circumference =
        2 *
        Math.PI *
        50;


    streakDemoRing.style.strokeDasharray =
        String(
            circumference
        );


    function animate(){

        streakDemoNumber.textContent =
            String(
                value
            );


        const percentage =
            value / 10;


        const offset =
            circumference *
            (1 - percentage);


        streakDemoRing.style.strokeDashoffset =
            String(
                offset
            );


        value++;


        if(
            value > 10
        ){

            value = 0;

        }

    }


    animate();


    streakAnimationTimer =
        setInterval(
            animate,
            700
        );

}


/* =========================================================
   STOP DEMO
========================================================= */

function stopDemoAnimation(){

    if(
        streakAnimationTimer
    ){

        clearInterval(
            streakAnimationTimer
        );

        streakAnimationTimer =
            null;

    }

}


/* =========================================================
   GET ACTIVE VIDEO
========================================================= */

function getActiveStreakVideo(){

    const mainVideo =
        document.getElementById(
            "lecture-player-video"
        );

    const miniVideo =
        document.getElementById(
            "kedu-mini-player-video"
        );


    if(
        mainVideo &&
        !mainVideo.paused &&
        !mainVideo.ended
    ){

        return mainVideo;

    }


    if(
        miniVideo &&
        !miniVideo.paused &&
        !miniVideo.ended
    ){

        return miniVideo;

    }


    return null;

}


/* =========================================================
   TRACK PLAYBACK
========================================================= */

function trackStreakPlayback(){

    refreshStreakDay();


    const video =
        getActiveStreakVideo();


    if(
        !video
    ){

        streakTrackedVideo =
            null;

        streakLastVideoTime =
            null;

        return;

    }


    if(
        streakTrackedVideo !==
        video
    ){

        streakTrackedVideo =
            video;

        streakLastVideoTime =
            Number(
                video.currentTime
            ) || 0;

        return;

    }


    const currentTime =
        Number(
            video.currentTime
        ) || 0;


    if(
        streakLastVideoTime ===
        null
    ){

        streakLastVideoTime =
            currentTime;

        return;

    }


    const delta =
        currentTime -
        streakLastVideoTime;


    streakLastVideoTime =
        currentTime;


    /*
     * Ignore seeks/jumps.
     *
     * Normal playback delta is
     * accepted. Large jumps are not
     * counted as watch time.
     */

    if(
        delta <= 0 ||
        delta > 5
    ){

        return;

    }


    if(
        streakData.todaySeconds >=
        KEDU_STREAK_REQUIRED_SECONDS
    ){

        return;

    }


    streakData.todaySeconds +=
        delta;


    if(
        streakData.todaySeconds >
        KEDU_STREAK_REQUIRED_SECONDS
    ){

        streakData.todaySeconds =
            KEDU_STREAK_REQUIRED_SECONDS;

    }


    updateStreakProgress();

    saveStreakData();


    if(
        streakData.todaySeconds >=
        KEDU_STREAK_REQUIRED_SECONDS
    ){

        completeTodayStreak();

    }

}


/* =========================================================
   COMPLETE TODAY
========================================================= */

function completeTodayStreak(){

    const today =
        getStreakDate();


    /*
     * Already completed today.
     */

    if(
        streakData.lastCompletedDate ===
        today
    ){

        saveStreakData();

        updateStreakUI();

        return;

    }


    const previousDate =
        streakData.lastCompletedDate;


    let newStreak =
        1;


    if(previousDate){

        const gap =
            getDateDifference(
                previousDate,
                today
            );


        /*
         * Yesterday completed:
         * continue the streak.
         */

        if(
            gap === 1
        ){

            newStreak =
                streakData.streak +
                1;

        }


        /*
         * More than one day since
         * completion: old streak broke.
         */

        else if(
            gap >= 2
        ){

            newStreak =
                1;

        }

    }


    streakData.streak =
        newStreak;


    streakData.lastCompletedDate =
        today;


    streakData.todaySeconds =
        KEDU_STREAK_REQUIRED_SECONDS;


    saveStreakData();

    updateStreakUI();


    /*
     * Small completion animation.
     */

    if(streakProgressRing){

        streakProgressRing
            .classList.remove(
                "streak-complete-pulse"
            );


        void streakProgressRing
            .offsetWidth;


        streakProgressRing
            .classList.add(
                "streak-complete-pulse"
            );

    }

}


/* =========================================================
   START TRACKER
========================================================= */

function startStreakTracker(){

    if(
        streakTrackingTimer
    ){

        return;

    }


    streakTrackingTimer =
        setInterval(
            trackStreakPlayback,
            1000
        );

}


/* =========================================================
   HEADER BUTTON
========================================================= */

streakButton?.addEventListener(
    "click",
    openStreakSheet
);


/* =========================================================
   CLOSE BUTTON
========================================================= */

streakSheetClose?.addEventListener(
    "click",
    closeStreakSheet
);


/* =========================================================
   WHAT'S A STREAK
========================================================= */

streakWhatsButton?.addEventListener(
    "click",
    openStreakTutorial
);


/* =========================================================
   TUTORIAL CLOSE
========================================================= */

streakTutorialClose?.addEventListener(
    "click",
    closeStreakTutorial
);


/* =========================================================
   PAGE 1 → PAGE 2
========================================================= */

streakNext1?.addEventListener(
    "click",
    () => {

        showStreakTutorialPage(
            2
        );

    }
);


/* =========================================================
   PAGE 2 BACK → PAGE 1
========================================================= */

streakBack2?.addEventListener(
    "click",
    () => {

        showStreakTutorialPage(
            1
        );

    }
);


/* =========================================================
   PAGE 2 → PAGE 3
========================================================= */

streakNext2?.addEventListener(
    "click",
    () => {

        showStreakTutorialPage(
            3
        );

    }
);


/* =========================================================
   PAGE 3 BACK → PAGE 2
========================================================= */

streakBack3?.addEventListener(
    "click",
    () => {

        showStreakTutorialPage(
            2
        );

    }
);


/* =========================================================
   PAGE 3 CLOSE
========================================================= */

streakClose3?.addEventListener(
    "click",
    closeStreakTutorial
);


/* =========================================================
   OVERLAY BACKGROUND
========================================================= */

streakOverlay?.addEventListener(
    "click",
    event => {

        if(
            event.target ===
            streakOverlay
        ){

            closeStreakSheet();

        }

    }
);


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if(
            event.key !==
            "Escape"
        ){

            return;

        }


        if(
            streakTutorial &&
            !streakTutorial.hidden
        ){

            closeStreakTutorial();

            return;

        }


        if(
            streakOverlay &&
            streakOverlay.classList.contains(
                "open"
            )
        ){

            closeStreakSheet();

        }

    }
);


/* =========================================================
   VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        streakTrackedVideo =
            null;

        streakLastVideoTime =
            null;

        refreshStreakDay();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

loadStreakData();

startStreakTracker();