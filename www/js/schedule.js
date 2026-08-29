/* ========================================================= */
/* KEDU PW                                                   */
/* WEEKLY + CLASS SCHEDULE SYSTEM                            */
/* REBUILT VERSION                                           */
/* ========================================================= */

"use strict";


/* ========================================================= */
/* SCHEDULE DATA                                              */
/* ========================================================= */

const batchSchedules = {

    project45icse: {

        Monday: [

            {
                subject: "Physics",
                teacher: "Rakshak Sir",
                start: "09:00",
                end: "10:30"
            },

            {
                subject: "Chemistry",
                teacher: "Sunil Sir",
                start: "11:00",
                end: "12:30"
            }

        ],

        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []

    }

};


/* ========================================================= */
/* DATE-SPECIFIC SCHEDULE                                     */
/* ========================================================= */

const batchCalendar = {

    project45icse: {

        "2026-08-03": [

            {
                subject: "Physics",
                teacher: "Rakshak Sir",
                start: "09:00",
                end: "10:30"
            },

            {
                subject: "Chemistry",
                teacher: "Sunil Sir",
                start: "11:00",
                end: "12:30"
            }

        ],


        "2026-08-05": [

            {
                subject: "Mathematics",
                teacher: "Sunil Sir",
                start: "09:00",
                end: "10:30"
            }

        ],


        "2026-08-06": [

            {
                subject: "Physics",
                teacher: "Rakshak Sir",
                start: "09:00",
                end: "10:30"
            },

            {
                subject: "Chemistry",
                teacher: "Sunil Sir",
                start: "11:00",
                end: "12:30"
            }

        ],


        "2026-08-07": [

            {
                subject: "Mathematics",
                teacher: "Ankit Sir",
                start: "08:00",
                end: "09:30"
            },

            {
                subject: "Biology",
                teacher: "Neha Ma'am",
                start: "10:00",
                end: "11:30"
            },

            {
                subject: "English",
                teacher: "Rahul Sir",
                start: "12:00",
                end: "13:00"
            }

        ],


        "2026-08-10": {
            status: "cancelled"
        }

    }

};


/* ========================================================= */
/* DATE CONSTANTS                                             */
/* ========================================================= */

const WEEK_DAYS = [

    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"

];


const MONTHS = [

    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC"

];


const FULL_MONTHS = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

];


/* ========================================================= */
/* CURRENT BATCH                                              */
/* ========================================================= */

function getCurrentBatchKey(){

    return (

        window.keduPWCurrentBatchKey ||

        "project45icse"

    );

}


/* ========================================================= */
/* SELECTED DATE                                              */
/* ========================================================= */

let selectedDate = new Date();


/* ========================================================= */
/* DATE KEY                                                   */
/* ========================================================= */

function getDateKey(date){

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2,"0");

    const day =
        String(
            date.getDate()
        ).padStart(2,"0");

    return `${year}-${month}-${day}`;

}


/* ========================================================= */
/* TIME → MINUTES                                             */
/* ========================================================= */

function timeToMinutes(time){

    if(!time){
        return 0;
    }

    const parts =
        String(time)
            .split(":")
            .map(Number);

    const hour =
        Number.isFinite(parts[0])
            ? parts[0]
            : 0;

    const minute =
        Number.isFinite(parts[1])
            ? parts[1]
            : 0;

    return (
        hour * 60 +
        minute
    );

}


/* ========================================================= */
/* FORMAT TIME                                                */
/* ========================================================= */

function formatTime(time){

    const minutes =
        timeToMinutes(time);

    let hour =
        Math.floor(
            minutes / 60
        );

    const minute =
        minutes % 60;

    const suffix =
        hour >= 12
            ? "PM"
            : "AM";

    hour =
        hour % 12;

    if(hour === 0){
        hour = 12;
    }

    return (
        String(hour).padStart(2,"0") +
        ":" +
        String(minute).padStart(2,"0") +
        " " +
        suffix
    );

}


/* ========================================================= */
/* GET CLASSES FOR DATE                                       */
/* ========================================================= */

function getClassesForDate(date){

    const batchKey =
        getCurrentBatchKey();

    const dateKey =
        getDateKey(date);

    const dateSchedules =
        batchCalendar[batchKey];

    const weeklySchedules =
        batchSchedules[batchKey];


    /* ----------------------------------------------------- */
    /* DATE-SPECIFIC SCHEDULE HAS PRIORITY                    */
    /* ----------------------------------------------------- */

    if(

        dateSchedules &&

        Object.prototype.hasOwnProperty.call(
            dateSchedules,
            dateKey
        )

    ){

        const dateData =
            dateSchedules[dateKey];


        /* Cancelled date */

        if(

            dateData &&

            dateData.status === "cancelled"

        ){

            return [];

        }


        /* Normal date schedule */

        if(
            Array.isArray(dateData)
        ){

            return dateData.map(
                item => ({
                    ...item
                })
            );

        }

        return [];

    }


    /* ----------------------------------------------------- */
    /* WEEKLY FALLBACK                                         */
    /* ----------------------------------------------------- */

    if(!weeklySchedules){

        return [];

    }


    const dayName =
        WEEK_DAYS[
            date.getDay()
        ];


    return (

        weeklySchedules[dayName] || []

    ).map(

        item => ({
            ...item
        })

    );

}


/* ========================================================= */
/* CLASS STATUS                                               */
/* ========================================================= */

function getClassStatus(
    classItem,
    date
){

    const now =
        new Date();

    const todayKey =
        getDateKey(now);

    const selectedKey =
        getDateKey(date);


    const startMinutes =
        timeToMinutes(
            classItem.start
        );

    const endMinutes =
        timeToMinutes(
            classItem.end
        );


    /* ----------------------------------------------------- */
    /* PAST DATE                                               */
    /* ----------------------------------------------------- */

    if(
        selectedKey <
        todayKey
    ){

        return "completed";

    }


    /* ----------------------------------------------------- */
    /* FUTURE DATE                                             */
    /* ----------------------------------------------------- */

    if(
        selectedKey >
        todayKey
    ){

        return "upcoming";

    }


    /* ----------------------------------------------------- */
    /* TODAY                                                   */
    /* ----------------------------------------------------- */

    const currentMinutes =

        now.getHours() * 60 +

        now.getMinutes();


    if(
        currentMinutes <
        startMinutes
    ){

        return "upcoming";

    }


    if(

        currentMinutes >=
            startMinutes &&

        currentMinutes <
            endMinutes

    ){

        return "live";

    }


    return "completed";

}


/* ========================================================= */
/* STATUS TEXT                                                */
/* ========================================================= */

function getStatusText(status){

    if(
        status === "live"
    ){

        return "🔴 Live";

    }


    if(
        status === "completed"
    ){

        return "🟢 Completed";

    }


    return "🟡 Upcoming";

}


/* ========================================================= */
/* SUBJECT PAGE — TODAY HEADER                               */
/* ========================================================= */

function updateScheduleHeader(){

    const now =
        new Date();


    const dayNumber =
        document.getElementById(
            "schedule-day-number"
        );

    const month =
        document.getElementById(
            "schedule-month"
        );

    const fullDate =
        document.getElementById(
            "schedule-full-date"
        );


    if(dayNumber){

        dayNumber.textContent =
            String(
                now.getDate()
            ).padStart(2,"0");

    }


    if(month){

        month.textContent =
            MONTHS[
                now.getMonth()
            ];

    }


    if(fullDate){

        fullDate.textContent =

            `${WEEK_DAYS[now.getDay()]}, ` +

            `${now.getDate()} ` +

            `${FULL_MONTHS[now.getMonth()]} ` +

            `${now.getFullYear()}`;

    }

}


/* ========================================================= */
/* MONTH TITLE                                                */
/* ========================================================= */

function updateMonthTitle(){

    const monthTitle =
        document.getElementById(
            "schedule-current-month"
        );


    if(!monthTitle){

        return;

    }


    monthTitle.textContent =

        `${FULL_MONTHS[selectedDate.getMonth()]} ` +

        `${selectedDate.getFullYear()}`;

}


/* ========================================================= */
/* CREATE CLASS CARD                                          */
/* ========================================================= */

function createClassCard(
    classItem,
    date
){

    const status =
        getClassStatus(
            classItem,
            date
        );


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "schedule-class-card";


    card.innerHTML = `

        <div class="schedule-card-header">

            <div class="schedule-subject">

                ${classItem.subject || ""}

            </div>


            <div
                class="schedule-status ${status}">

                ${getStatusText(status)}

            </div>

        </div>


        <div class="schedule-teacher">

            ${classItem.teacher || ""}

        </div>


        <div class="schedule-time">

            ${formatTime(classItem.start)}

            -

            ${formatTime(classItem.end)}

        </div>

    `;


    return card;

}


/* ========================================================= */
/* WEEKLY SCHEDULE — SUBJECT PAGE                            */
/* ========================================================= */

function renderTodaySchedule(){

    const list =
        document.getElementById(
            "schedule-card-list"
        );

    const emptyState =
        document.getElementById(
            "schedule-empty-state"
        );

    const completedState =
        document.getElementById(
            "schedule-completed-state"
        );


    if(!list){

        return;

    }


    const today =
        new Date();


    const classes =
        getClassesForDate(
            today
        ).sort(

            (a,b) =>

                timeToMinutes(a.start) -

                timeToMinutes(b.start)

        );


    list.innerHTML = "";


    if(emptyState){

        emptyState.hidden =
            true;

    }


    if(completedState){

        completedState.hidden =
            true;

    }


    /* ----------------------------------------------------- */
    /* NO CLASS                                               */
    /* ----------------------------------------------------- */

    if(
        classes.length === 0
    ){

        if(emptyState){

            emptyState.hidden =
                false;

        }

        return;

    }


    /* ----------------------------------------------------- */
    /* ONLY UPCOMING + LIVE                                   */
    /* ----------------------------------------------------- */

    const activeClasses =
        classes.filter(

            classItem => {

                const status =
                    getClassStatus(
                        classItem,
                        today
                    );


                return (

                    status === "upcoming" ||

                    status === "live"

                );

            }

        );


    /* ----------------------------------------------------- */
    /* ALL COMPLETED                                          */
    /* ----------------------------------------------------- */

    if(
        activeClasses.length === 0
    ){

        if(completedState){

            completedState.hidden =
                false;

        }

        return;

    }


    /* ----------------------------------------------------- */
    /* RENDER ACTIVE CLASSES                                  */
    /* ----------------------------------------------------- */

    activeClasses.forEach(

        classItem => {

            list.appendChild(

                createClassCard(
                    classItem,
                    today
                )

            );

        }

    );

}


/* ========================================================= */
/* CLASS SCHEDULE — SELECTED DATE                            */
/* ========================================================= */

function renderClassSchedulePage(){

    const events =
        document.getElementById(
            "schedule-events"
        );

    const noEvents =
        document.getElementById(
            "schedule-no-events"
        );


    if(!events){

        return;

    }


    events.innerHTML = "";


    const classes =
        getClassesForDate(
            selectedDate
        ).sort(

            (a,b) =>

                timeToMinutes(a.start) -

                timeToMinutes(b.start)

        );


    if(noEvents){

        noEvents.hidden =
            classes.length !== 0;

    }


    classes.forEach(

        classItem => {

            events.appendChild(

                createClassCard(
                    classItem,
                    selectedDate
                )

            );

        }

    );

}


/* ========================================================= */
/* DATE STATUS                                                */
/* ========================================================= */

function getDateStatus(date){

    const today =
        new Date();


    const dateKey =
        getDateKey(date);

    const todayKey =
        getDateKey(today);


    if(
        dateKey === todayKey
    ){

        return "today";

    }


    const classes =
        getClassesForDate(
            date
        );


    if(
        classes.length > 0
    ){

        return "scheduled";

    }


    return "no-class";

}


/* ========================================================= */
/* WEEK STRIP                                                 */
/* ========================================================= */

function renderWeekStrip(){

    const weekStrip =
        document.getElementById(
            "schedule-week-strip"
        );


    if(!weekStrip){

        return;

    }


    weekStrip.innerHTML = "";


    const current =
        new Date(
            selectedDate
        );


    const day =
        current.getDay();


    const mondayOffset =

        day === 0

            ? -6

            : 1 - day;


    current.setDate(

        current.getDate() +

        mondayOffset

    );


    for(
        let i = 0;
        i < 7;
        i++
    ){

        const date =
            new Date(
                current
            );


        date.setDate(

            current.getDate() +

            i

        );


        const item =
            document.createElement(
                "div"
            );


        item.className =
            "schedule-day";


        const active =

            date.toDateString() ===

            selectedDate.toDateString();


        const status =
            getDateStatus(
                date
            );


        item.innerHTML = `

            <div class="schedule-day-name">

                ${WEEK_DAYS[
                    date.getDay()
                ].substring(0,3)}

            </div>


            <div class="schedule-date">

                <div
                    class="
                        schedule-date-number
                        ${status}
                        ${active ? "active" : ""}
                    ">

                    ${date.getDate()}

                </div>

            </div>

        `;


        item.addEventListener(

            "click",

            () => {

                selectedDate =
                    new Date(
                        date
                    );


                updateMonthTitle();

                renderWeekStrip();

                renderFullCalendar();

                renderClassSchedulePage();

            }

        );


        weekStrip.appendChild(
            item
        );

    }

}


/* ========================================================= */
/* FULL MONTH CALENDAR                                        */
/* ========================================================= */

function renderFullCalendar(){

    const calendar =
        document.getElementById(
            "schedule-full-calendar"
        );


    if(!calendar){

        return;

    }


    calendar.innerHTML = "";


    const year =
        selectedDate.getFullYear();


    const month =
        selectedDate.getMonth();


    const firstDay =
        new Date(
            year,
            month,
            1
        );


    const lastDay =
        new Date(
            year,
            month + 1,
            0
        );


    const start =
        firstDay.getDay();


    /* Empty cells */

    for(
        let i = 0;
        i < start;
        i++
    ){

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "schedule-empty-cell";


        calendar.appendChild(
            empty
        );

    }


    /* Dates */

    for(
        let day = 1;
        day <= lastDay.getDate();
        day++
    ){

        const date =
            new Date(
                year,
                month,
                day
            );


        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "schedule-date";


        const status =
            getDateStatus(
                date
            );


        const active =

            date.toDateString() ===

            selectedDate.toDateString();


        cell.innerHTML = `

            <div
                class="
                    schedule-date-number
                    ${status}
                    ${active ? "active" : ""}
                ">

                ${day}

            </div>


            <div
                class="
                    schedule-status-dot
                    ${status}
                ">
            </div>

        `;


        cell.addEventListener(

            "click",

            () => {

                selectedDate =
                    new Date(
                        date
                    );


                updateMonthTitle();

                renderWeekStrip();

                renderFullCalendar();

                renderClassSchedulePage();


                calendar.classList.remove(
                    "show"
                );


                calendar.hidden =
                    true;


                const weekStrip =
                    document.getElementById(
                        "schedule-week-strip"
                    );


                if(weekStrip){

                    weekStrip.style.display =
                        "flex";

                }

            }

        );


        calendar.appendChild(
            cell
        );

    }

}


/* ========================================================= */
/* CALENDAR INITIALIZATION                                    */
/* ========================================================= */

function initializeScheduleCalendar(){

    const monthTitle =
        document.getElementById(
            "schedule-current-month"
        );


    const calendar =
        document.getElementById(
            "schedule-full-calendar"
        );


    const weekStrip =
        document.getElementById(
            "schedule-week-strip"
        );


    const previousButton =
        document.getElementById(
            "schedule-prev-month"
        );


    const nextButton =
        document.getElementById(
            "schedule-next-month"
        );


    if(

        !monthTitle ||

        !calendar ||

        !weekStrip

    ){

        return;

    }


    calendar.hidden =
        true;


    calendar.classList.remove(
        "show"
    );


    /* ----------------------------------------------------- */
    /* MONTH TITLE → OPEN CALENDAR                            */
    /* ----------------------------------------------------- */

    monthTitle.onclick = () => {

        const open =

            !calendar.classList.contains(
                "show"
            );


        calendar.classList.toggle(
            "show",
            open
        );


        calendar.hidden =
            !open;


        weekStrip.style.display =

            open
                ? "none"
                : "flex";


        renderFullCalendar();

    };


    /* ----------------------------------------------------- */
    /* PREVIOUS MONTH                                         */
    /* ----------------------------------------------------- */

    if(previousButton){

        previousButton.onclick = () => {

            selectedDate =
                new Date(
                    selectedDate
                );


            selectedDate.setMonth(

                selectedDate.getMonth() -

                1

            );


            updateMonthTitle();

            renderWeekStrip();

            renderFullCalendar();

            renderClassSchedulePage();

        };

    }


    /* ----------------------------------------------------- */
    /* NEXT MONTH                                             */
    /* ----------------------------------------------------- */

    if(nextButton){

        nextButton.onclick = () => {

            selectedDate =
                new Date(
                    selectedDate
                );


            selectedDate.setMonth(

                selectedDate.getMonth() +

                1

            );


            updateMonthTitle();

            renderWeekStrip();

            renderFullCalendar();

            renderClassSchedulePage();

        };

    }

}

/* ========================================================= */
/* KEDU PW — SCHEDULE PREVIOUS PAGE                          */
/* ========================================================= */

let schedulePreviousPageId = "subjects-page";
/* ========================================================= */
/* OPEN CLASS SCHEDULE PAGE                                   */
/* ========================================================= */

function openClassSchedulePage(){

    const schedulePage =
        document.getElementById(
            "schedule-page"
        );


    if(!schedulePage){

        return;

    }
/* ========================================================= */
/* SAVE THE PAGE FROM WHICH SCHEDULE WAS OPENED              */
/* ========================================================= */

const activePage =
    document.querySelector(
        ".page.active"
    );

if(
    activePage &&
    activePage.id !== "schedule-page"
){

    schedulePreviousPageId =
        activePage.id;

}

    /* Hide every page */

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(

            page => {

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

        );


    /* Show Class Schedule */

    schedulePage.style.display =
    "flex";

    schedulePage.classList.add(
        "active"
    );


    schedulePage.setAttribute(
        "aria-hidden",
        "false"
    );


    /* Start from today */

    selectedDate =
        new Date();


    updateMonthTitle();

    renderWeekStrip();

    renderFullCalendar();

    renderClassSchedulePage();


        requestAnimationFrame(() => {

        const subjectsContent =
            document.getElementById(
                "subjects-content"
            );

        if(subjectsContent){

            subjectsContent.scrollTop =
                0;

        }

        window.scrollTo({

            top:0,
            left:0,
            behavior:"instant"

        });

    });

}
        
/* ========================================================= */
/* CLOSE CLASS SCHEDULE PAGE                                 */
/* RETURN TO ACTUAL PREVIOUS PAGE                            */
/* ========================================================= */

function closeClassSchedulePage(){

    const schedulePage =
        document.getElementById(
            "schedule-page"
        );

    /* ----------------------------------------------------- */
    /* Hide schedule page                                    */
    /* ----------------------------------------------------- */

    if(schedulePage){

        schedulePage.style.display =
            "none";

        schedulePage.classList.remove(
            "active"
        );

        schedulePage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* ----------------------------------------------------- */
    /* Hide every page                                       */
    /* ----------------------------------------------------- */

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            page => {

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
        );


    /* ----------------------------------------------------- */
    /* Get actual previous page                              */
    /* ----------------------------------------------------- */

    const previousPage =
        document.getElementById(
            schedulePreviousPageId
        );


    /* ----------------------------------------------------- */
    /* Fallback → subjects page                              */
    /* ----------------------------------------------------- */

    const targetPage =
        previousPage ||
        document.getElementById(
            "subjects-page"
        );


    if(!targetPage){

        return;

    }


    /* ----------------------------------------------------- */
    /* Show previous page                                    */
    /* ----------------------------------------------------- */

    targetPage.style.display =
        "flex";

    targetPage.classList.add(
        "active"
    );

    targetPage.setAttribute(
        "aria-hidden",
        "false"
    );


    /* ----------------------------------------------------- */
    /* If returning to subject page, restore subjects        */
    /* ----------------------------------------------------- */

    if(
        targetPage.id ===
        "subjects-page"
    ){

        const classKey =
            window.keduPWCurrentClassKey || "";

        const batchKey =
            window.keduPWCurrentBatchKey || "";

        if(
            classKey &&
            batchKey &&
            typeof renderSubjects ===
                "function"
        ){

            renderSubjects(
                classKey,
                batchKey
            );

        }

    }


    /* ----------------------------------------------------- */
    /* Reset target page scroll                               */
    /* ----------------------------------------------------- */

    requestAnimationFrame(
        function(){

            targetPage.scrollTop =
                0;

            const content =
                targetPage.querySelector(
                    ".page-content, " +
                    "#subjects-content, " +
                    "#batches-content"
                );

            if(content){

                content.scrollTop =
                    0;

            }

            window.scrollTo({

                top: 0,
                left: 0,
                behavior: "instant"

            });

        }
    );

}

        
/* ========================================================= */
/* CONNECT BUTTONS                                            */
/* ========================================================= */

function connectScheduleButtons(){

    const calendarButton =
        document.getElementById(
            "schedule-calendar-btn"
        );


    if(calendarButton){

        calendarButton.onclick =
            openClassSchedulePage;

    }


    const backButton =
        document.getElementById(
            "schedule-back-btn"
        );


    if(backButton){

        backButton.onclick =
            closeClassSchedulePage;

    }

}

/* ========================================================= */
/* KEDU PW — FULL WEEK SWIPE                                 */
/* LEFT  = NEXT WEEK                                         */
/* RIGHT = PREVIOUS WEEK                                     */
/* ========================================================= */

(function(){

    const weekStrip =
        document.getElementById(
            "schedule-week-strip"
        );

    if(!weekStrip){
        return;
    }


    let startX = 0;
    let startY = 0;


    /* ----------------------------------------------------- */
    /* TOUCH START                                            */
    /* ----------------------------------------------------- */

    weekStrip.addEventListener(
        "touchstart",
        function(event){

            if(
                !event.changedTouches.length
            ){
                return;
            }


            startX =
                event.changedTouches[0].clientX;

            startY =
                event.changedTouches[0].clientY;

        },
        {
            passive:true
        }
    );


    /* ----------------------------------------------------- */
    /* TOUCH END                                              */
    /* ----------------------------------------------------- */

    weekStrip.addEventListener(
        "touchend",
        function(event){

            if(
                !event.changedTouches.length
            ){
                return;
            }


            const endX =
                event.changedTouches[0].clientX;

            const endY =
                event.changedTouches[0].clientY;


            const distanceX =
                endX - startX;

            const distanceY =
                endY - startY;


            /* ------------------------------------------------ */
            /* Ignore small movement / vertical scrolling       */
            /* ------------------------------------------------ */

            if(
                Math.abs(distanceX) < 60 ||
                Math.abs(distanceX) <=
                Math.abs(distanceY)
            ){
                return;
            }


            /* ------------------------------------------------ */
            /* LEFT  → NEXT WEEK                                */
            /* RIGHT → PREVIOUS WEEK                            */
            /* ------------------------------------------------ */

            const direction =
                distanceX < 0
                    ? 1
                    : -1;


            /* ------------------------------------------------ */
            /* Move exactly 7 days                              */
            /* ------------------------------------------------ */

            selectedDate =
                new Date(selectedDate);


            selectedDate.setDate(
                selectedDate.getDate() +
                (direction * 7)
            );


            /* ------------------------------------------------ */
            /* Refresh week + month + classes                    */
            /* ------------------------------------------------ */

            updateMonthTitle();

            renderWeekStrip();

            renderFullCalendar();

            renderClassSchedulePage();


            /* ------------------------------------------------ */
            /* Keep schedule content at top                      */
            /* ------------------------------------------------ */

            const scheduleContent =
                document.getElementById(
                    "schedule-content"
                );


            if(scheduleContent){

                scheduleContent.scrollTop = 0;

            }


            /* ------------------------------------------------ */
            /* Week slide animation                              */
            /* ------------------------------------------------ */

            weekStrip.classList.remove(
                "week-slide-next",
                "week-slide-prev"
            );


            void weekStrip.offsetWidth;


            weekStrip.classList.add(
                direction > 0
                    ? "week-slide-next"
                    : "week-slide-prev"
            );


            window.setTimeout(
                function(){

                    weekStrip.classList.remove(
                        "week-slide-next",
                        "week-slide-prev"
                    );

                },
                240
            );

        },
        {
            passive:true
        }
    );

})();
/* ========================================================= */
/* REFRESH                                                    */
/* ========================================================= */

function refreshSchedule(){

    updateScheduleHeader();

    updateMonthTitle();

    renderTodaySchedule();

    renderWeekStrip();

    renderFullCalendar();

    renderClassSchedulePage();

}


/* ========================================================= */
/* INITIALIZATION                                             */
/* ========================================================= */

function initializeScheduleSystem(){

    updateScheduleHeader();

    initializeScheduleCalendar();

    updateMonthTitle();

    renderTodaySchedule();

    renderWeekStrip();

    renderFullCalendar();

    renderClassSchedulePage();

    connectScheduleButtons();


    /* Refresh class status every 30 seconds */

    setInterval(

        refreshSchedule,

        30000

    );

}


/* ========================================================= */
/* START                                                       */
/* ========================================================= */

if(
    document.readyState === "loading"
){

    document.addEventListener(

        "DOMContentLoaded",

        initializeScheduleSystem,

        {
            once:true
        }

    );

}
else{

    initializeScheduleSystem();

}


/* ========================================================= */
/* KEDU PW SCHEDULE SYSTEM END                                */
/* ========================================================= */