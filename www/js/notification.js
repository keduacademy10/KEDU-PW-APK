/* =========================================================
   KEDU PW — NOTIFICATIONS
   Full Notification Page Controller
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const notificationButton =
        document.getElementById(
            "notification-button"
        );

    const notificationPage =
        document.getElementById(
            "notifications-page"
        );

    const notificationBack =
        document.getElementById(
            "notifications-page-back"
        );

    const notificationList =
        document.getElementById(
            "notifications-list"
        );

    const notificationEmpty =
        document.getElementById(
            "notifications-empty"
        );
const notificationSettingsButton =
    document.getElementById(
        "notifications-settings-button"
    );
  const notificationSettingsOverlay =
    document.getElementById(
        "notification-settings-overlay"
    );

const notificationSettingsList =
    document.getElementById(
        "notification-settings-list"
    );
    const batchSelect =
        document.getElementById(
            "notifications-batch-select"
        );

    const markAllButton =
        document.getElementById(
            "notifications-mark-all"
        );

    const drawerNotificationButton =
        document.getElementById(
            "drawer-notification-button"
        );

    const detailOverlay =
        document.getElementById(
            "notification-detail-overlay"
        );

    const detailClose =
        document.getElementById(
            "notification-detail-close"
        );

    const detailContent =
        document.getElementById(
            "notification-detail-content"
        );


    /* =====================================================
       NOTIFICATION DATA

       Replace this data later with backend/API data.
    ====================================================== */

    const notifications = [

        {
            id: "demo-1",
            batch: "Vidyapeeth 12-AJ257MA 2026",
            title: "Important Announcement",
            message:
                "📢 Attention 11th JEE Students! Dear Students, This is an important announcement for your batch.",
            date: "2026-08-26T17:30:00",
            image: "",
            unread: true
        },

        {
            id: "demo-2",
            batch: "Vidyapeeth 12-AJ257MA 2026",
            title: "Important Announcement",
            message:
                "Dear Students, This is to inform you that there will be an important update for your batch.",
            date: "2026-08-26T14:30:00",
            image: "",
            unread: true
        },

        {
            id: "demo-3",
            batch: "Vidyapeeth 12-AJ257MA 2026",
            title: "Test QnA",
            message:
                "Dear Students, Test Paper & Answer Key will be available in the test material section.",
            date: "2026-08-25T10:00:00",
            image: "",
            unread: false
        },

        {
            id: "demo-4",
            batch: "Vidyapeeth 12-AJ257MA 2026",
            title: "Syllabus",
            message:
                "Please check the Test Planner for the latest test syllabus and preparation details.",
            date: "2026-08-24T10:00:00",
            image: "",
            unread: false
        },

        {
            id: "demo-5",
            batch: "Vidyapeeth 12-AJ257MA 2026",
            title: "Test Feedback",
            message:
                "We value your feedback and would like to hear about your recent test experience.",
            date: "2026-08-24T08:00:00",
            image: "",
            unread: false
        }

    ];


    /* =====================================================
       BATCH LIST

       First use notification batches.
       Then automatically add batches from Study page.
    ====================================================== */

    const notificationBatches = [
        "Vidyapeeth 12-AJ257MA 2026",
        "Vidyapeeth 12-ARE51AB 2026",
        "11th JEE Ardhshatak (Bihar+JH)",
        "11th JEE - NCERT Punch",
        "PW Shiksha (2026-27)",
        "Vidyapeeth 11th Jee Momentum"
    ];


    function collectStudyBatches() {

        const batchCards =
            document.querySelectorAll(
                ".batch-card[data-batch]"
            );

        const names =
            new Set(
                notificationBatches
            );

        batchCards.forEach(card => {

            const title =
                card.querySelector(
                    ".batch-title"
                );

            if (!title) {
                return;
            }

            const name =
                title.textContent.trim();

            if (name) {
                names.add(name);
            }

        });

        return Array.from(names);

    }


    /* =====================================================
       POPULATE BATCH SELECTOR
    ====================================================== */

    function populateBatchSelector() {

        if (!batchSelect) {
            return;
        }

        const batches =
            collectStudyBatches();

        batchSelect.innerHTML = "";

        batches.forEach(
            batch => {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value = batch;
                option.textContent = batch;

                batchSelect.appendChild(
                    option
                );

            }
        );

        if (batches.length) {

            batchSelect.value =
                batches.includes(
                    "Vidyapeeth 12-AJ257MA 2026"
                )
                    ? "Vidyapeeth 12-AJ257MA 2026"
                    : batches[0];

        }

    }


    /* =====================================================
       FORMAT TIME
    ====================================================== */

    function formatTime(dateValue) {

        const date =
            new Date(dateValue);

        const now =
            new Date();

        const diff =
            now - date;

        const minutes =
            Math.floor(
                diff / 60000
            );

        const hours =
            Math.floor(
                minutes / 60
            );

        if (minutes < 1) {
            return "Just now";
        }

        if (minutes < 60) {
            return `${minutes}m`;
        }

        if (hours < 24) {
            return `${hours}h`;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short"
            }
        );

    }


    /* =====================================================
       DATE GROUP
    ====================================================== */

    function getDateGroup(dateValue) {

        const date =
            new Date(dateValue);

        const today =
            new Date();

        const yesterday =
            new Date();

        yesterday.setDate(
            yesterday.getDate() - 1
        );

        if (
            date.toDateString() ===
            today.toDateString()
        ) {
            return "TODAY";
        }

        if (
            date.toDateString() ===
            yesterday.toDateString()
        ) {
            return "YESTERDAY";
        }

        return "OLDER";

    }


    /* =====================================================
       ESCAPE HTML
    ====================================================== */

    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       RENDER NOTIFICATIONS
    ====================================================== */

    function renderNotifications() {

        if (!notificationList) {
            return;
        }

        const selectedBatch =
            batchSelect?.value;

        const filtered =
            notifications
                .filter(
                    notification =>
                        notification.batch ===
                        selectedBatch
                )
                .sort(
                    (a, b) =>
                        new Date(b.date) -
                        new Date(a.date)
                );


        notificationList.innerHTML = "";


        if (!filtered.length) {

            notificationList.hidden =
                true;

            if (notificationEmpty) {
                notificationEmpty.hidden =
                    false;
            }

            return;

        }


        notificationList.hidden =
            false;

        if (notificationEmpty) {
            notificationEmpty.hidden =
                true;
        }


        const groups = {};

        filtered.forEach(
            notification => {

                const group =
                    getDateGroup(
                        notification.date
                    );

                if (!groups[group]) {
                    groups[group] = [];
                }

                groups[group].push(
                    notification
                );

            }
        );


        [
            "TODAY",
            "YESTERDAY",
            "OLDER"
        ].forEach(
            groupName => {

                if (
                    !groups[groupName] ||
                    !groups[groupName].length
                ) {
                    return;
                }


                const group =
                    document.createElement(
                        "section"
                    );

                group.className =
                    "notification-group";


                const heading =
                    document.createElement(
                        "h2"
                    );

                heading.className =
                    "notification-group-title";

                heading.textContent =
                    groupName;

                group.appendChild(
                    heading
                );


                groups[groupName].forEach(
                    notification => {

                        const card =
                            document.createElement(
                                "article"
                            );

                        card.className =
                            "notification-card";

                        if (
                            notification.unread
                        ) {
                            card.classList.add(
                                "unread"
                            );
                        }

                        card.dataset.id =
                            notification.id;


                        card.innerHTML = `

                            <div class="
                                notification-card-icon
                            ">
                                <span class="
                                    material-symbols-rounded
                                ">
                                    campaign
                                </span>
                            </div>

                            <div class="
                                notification-card-content
                            ">

                                <div class="
                                    notification-card-top
                                ">

                                    <h3>
                                        ${escapeHTML(
                                            notification.title
                                        )}
                                    </h3>

                                    <time>
                                        ${formatTime(
                                            notification.date
                                        )}
                                    </time>

                                </div>

                                <p>
                                    ${escapeHTML(
                                        notification.message
                                    )}
                                </p>

                            </div>

                        `;


                        card.addEventListener(
                            "click",
                            () => {

                                notification.unread =
                                    false;

                                card.classList.remove(
                                    "unread"
                                );

                                openNotification(
                                    notification
                                );

                            }
                        );


                        group.appendChild(
                            card
                        );

                    }
                );


                notificationList.appendChild(
                    group
                );

            }
        );

        updateNotificationDot();

    }


    /* =====================================================
       OPEN FULL NOTIFICATION
    ====================================================== */

    function openNotification(
        notification
    ) {

        if (
            !detailOverlay ||
            !detailContent
        ) {
            return;
        }


        detailContent.innerHTML = `

            <div class="
                notification-detail-top
            ">

                <h2>
                    ${escapeHTML(
                        notification.title
                    )}
                </h2>

                <time>
                    ${formatTime(
                        notification.date
                    )}
                </time>

            </div>


            <div class="
                notification-detail-message
            ">
                ${escapeHTML(
                    notification.message
                )}
            </div>


            ${
                notification.image
                    ? `
                        <img
                            class="
                                notification-detail-image
                            "
                            src="${notification.image}"
                            alt="Notification"
                        >
                    `
                    : ""
            }

        `;


        detailOverlay.classList.add(
            "active"
        );

        detailOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE FULL NOTIFICATION
    ====================================================== */

    function closeNotification() {

        if (!detailOverlay) {
            return;
        }

        detailOverlay.classList.remove(
            "active"
        );

        detailOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.style.overflow =
            "";

    }


    /* =====================================================
       OPEN NOTIFICATION PAGE
    ====================================================== */

    function openNotificationsPage() {

        if (!notificationPage) {
            return;
        }


        /*
         * Close drawer
         */

        if (
            typeof window.closeKeduDrawer ===
            "function"
        ) {
            window.closeKeduDrawer();
        }


        /*
         * Hide main header
         */

        const mainHeader =
            document.querySelector(
                "main#app > .app-header"
            );

        if (mainHeader) {
            mainHeader.style.display =
                "none";
        }


        /*
         * Hide bottom navigation
         */

        const bottomNavigation =
            document.querySelector(
                ".bottom-navigation"
            );

        if (bottomNavigation) {
            bottomNavigation.style.display =
                "none";
        }


        /*
         * Hide other full-screen pages
         */

        const pages = [
            "home-page",
            "favorite-page",
            "class-detail-page",
            "subjects-page",
            "schedule-page",
            "contact-page",
            "about-kedu-page",
            "more-apps-page"
        ];

        pages.forEach(
            id => {

                const page =
                    document.getElementById(id);

                if (!page) {
                    return;
                }

                page.classList.remove(
                    "active"
                );

                page.setAttribute(
                    "aria-hidden",
                    "true"
                );

                if (
                    id !==
                    "home-page"
                ) {
                    page.style.display =
                        "none";
                }

            }
        );


        /*
         * Show notification page
         */

        notificationPage.style.display =
            "block";

        notificationPage.classList.add(
            "active"
        );

        notificationPage.setAttribute(
            "aria-hidden",
            "false"
        );


        populateBatchSelector();
        renderNotifications();


        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    }


    /* =====================================================
       RETURN TO STUDY
    ====================================================== */

    function backToStudy() {

        closeNotification();


        if (
            typeof window.keduShowStudyPage ===
            "function"
        ) {

            window.keduShowStudyPage();

        }
        else {

            const page =
                document.getElementById(
                    "notifications-page"
                );

            if (page) {

                page.classList.remove(
                    "active"
                );

                page.setAttribute(
                    "aria-hidden",
                    "true"
                );

                page.style.display =
                    "none";

            }

        }


        const mainHeader =
            document.querySelector(
                "main#app > .app-header"
            );

        if (mainHeader) {
            mainHeader.style.display =
                "";
        }


        const bottomNavigation =
            document.querySelector(
                ".bottom-navigation"
            );

        if (bottomNavigation) {
            bottomNavigation.style.display =
                "";
        }


        if (notificationPage) {

            notificationPage.classList.remove(
                "active"
            );

            notificationPage.setAttribute(
                "aria-hidden",
                "true"
            );

            notificationPage.style.display =
                "none";

        }


        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    }


    /* =====================================================
       MARK ALL READ
    ====================================================== */

    function markAllRead() {

        const selectedBatch =
            batchSelect?.value;

        notifications.forEach(
            notification => {

                if (
                    notification.batch ===
                    selectedBatch
                ) {
                    notification.unread =
                        false;
                }

            }
        );

        renderNotifications();
        updateNotificationDot();

    }


    /* =====================================================
       HEADER NOTIFICATION DOT
    ====================================================== */

    function updateNotificationDot() {

        if (!notificationButton) {
            return;
        }

        const hasUnread =
            notifications.some(
                notification =>
                    notification.unread
            );

        notificationButton.classList.toggle(
            "has-notifications",
            hasUnread
        );

    }


    /* =====================================================
       HEADER BUTTON
    ====================================================== */

    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openNotificationsPage();

            }
        );

    }


    /* =====================================================
       DRAWER → NOTIFICATION
    ====================================================== */

    if (drawerNotificationButton) {

        drawerNotificationButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                openNotificationsPage();

            }
        );

    }


    /* =====================================================
       BACK BUTTON
    ====================================================== */

    if (notificationBack) {

        notificationBack.addEventListener(
            "click",
            event => {

                event.preventDefault();

                backToStudy();

            }
        );

    }


    /* =====================================================
       BATCH CHANGE
    ====================================================== */

    if (batchSelect) {

        batchSelect.addEventListener(
            "change",
            () => {

                renderNotifications();

            }
        );

    }


    /* =====================================================
       MARK ALL
    ====================================================== */

    if (markAllButton) {

        markAllButton.addEventListener(
            "click",
            markAllRead
        );

    }


    /* =====================================================
       DETAIL CLOSE
    ====================================================== */

    if (detailClose) {

        detailClose.addEventListener(
            "click",
            closeNotification
        );

    }


    if (detailOverlay) {

        detailOverlay.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    detailOverlay
                ) {
                    closeNotification();
                }

            }
        );

    }
/* =====================================================
   NOTIFICATION SETTINGS
===================================================== */

const notificationSettings = {};

const settingsBatches = [
    "11th JEE Ardhshatak (Bihar+JH)",
    "11th JEE - NCERT Punch",
    "PW Shiksha (2026-27)",
    "Vidyapeeth 12-AJ257MA 2026",
    "Vidyapeeth 12-ARE51AB 2026",
    "Vidyapeeth 11th Jee Momentum"
];


/* =====================================================
   LOAD SAVED SETTINGS
===================================================== */

function loadNotificationSettings() {

    settingsBatches.forEach(
        batch => {

            const saved =
                localStorage.getItem(
                    "kedu_notification_" +
                    batch
                );

            notificationSettings[batch] =
                saved === null
                    ? true
                    : saved === "true";

        }
    );

}


/* =====================================================
   RENDER SETTINGS
===================================================== */

function renderNotificationSettings() {

    if (!notificationSettingsList) {
        return;
    }

    notificationSettingsList.innerHTML = "";


    settingsBatches.forEach(
        batch => {

            const row =
                document.createElement(
                    "div"
                );

            row.className =
                "notification-setting-row";


            const name =
                document.createElement(
                    "span"
                );

            name.className =
                "notification-setting-name";

            name.textContent =
                batch;


            /* =========================================
               SWITCH
            ========================================== */

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                "notification-setting-switch";


            const input =
                document.createElement(
                    "input"
                );

            input.type =
                "checkbox";

            input.checked =
                notificationSettings[
                    batch
                ];


            const slider =
                document.createElement(
                    "span"
                );

            slider.className =
                "notification-setting-slider";


            input.addEventListener(
                "change",
                () => {

                    notificationSettings[
                        batch
                    ] =
                        input.checked;


                    localStorage.setItem(
                        "kedu_notification_" +
                        batch,
                        input.checked
                    );

                }
            );


            label.appendChild(
                input
            );

            label.appendChild(
                slider
            );


            row.appendChild(
                name
            );

            row.appendChild(
                label
            );


            notificationSettingsList.appendChild(
                row
            );

        }
    );

}


/* =====================================================
   OPEN SETTINGS
===================================================== */

function openNotificationSettings() {

    if (!notificationSettingsOverlay) {
        return;
    }

    renderNotificationSettings();


    notificationSettingsOverlay.classList.add(
        "active"
    );

    notificationSettingsOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.style.overflow =
        "hidden";

}


/* =====================================================
   CLOSE SETTINGS
===================================================== */

function closeNotificationSettings() {

    if (!notificationSettingsOverlay) {
        return;
    }

    notificationSettingsOverlay.classList.remove(
        "active"
    );

    notificationSettingsOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.style.overflow =
        "";

}


/* =====================================================
   SETTINGS BUTTON
===================================================== */

if (notificationSettingsButton) {

    notificationSettingsButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            openNotificationSettings();

        }
    );

}


/* =====================================================
   CLOSE BY TAPPING OUTSIDE
===================================================== */

if (notificationSettingsOverlay) {

    notificationSettingsOverlay.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                notificationSettingsOverlay
            ) {

                closeNotificationSettings();

            }

        }
    );

}


/* =====================================================
   ESCAPE
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeNotificationSettings();

        }

    }
);


/* =====================================================
   INITIAL LOAD
===================================================== */

loadNotificationSettings();
    /* =====================================================
       INITIALIZE
    ====================================================== */

    updateNotificationDot();

    console.log(
        "KEDU Notifications Ready"
    );

});