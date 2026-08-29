/* =========================================
   KEDU PW — NAVIGATION
   Study / Favorite / Download
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const favoritePage =
        document.getElementById(
            "favorite-page"
        );

    const studyPage =
        document.getElementById(
            "home-page"
        );

    const bottomNavItems =
        document.querySelectorAll(
            ".bottom-nav-item"
        );

    const drawerItems =
    document.querySelectorAll(
        ".drawer-item"
    );
    const favoriteDrawerButton =
        document.getElementById(
            "favorite-drawer-open"
        );

    const drawer =
    document.getElementById(
        "side-drawer"
    );

const drawerOverlay =
    document.getElementById(
        "drawer-overlay"
    );

    function openDrawer() {

    drawer?.classList.add(
        "open"
    );

    drawerOverlay?.classList.add(
        "open"
    );

    drawerOverlay?.classList.add(
        "show"
    );

    document.body.style.overflow =
        "hidden";

}


function closeDrawer() {

    /* ---------------------------------------------
       CLOSE DRAWER
       --------------------------------------------- */

    drawer?.classList.remove(
        "open"
    );


    /* ---------------------------------------------
       REMOVE EVERY OVERLAY STATE
       --------------------------------------------- */

    drawerOverlay?.classList.remove(
        "open",
        "show"
    );


    /* ---------------------------------------------
       RESTORE PAGE SCROLL
       --------------------------------------------- */

    document.body.style.overflow =
        "";

}

    /**
 * @param {string} section
 */
function setActive(
    section
) {

        bottomNavItems.forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item.dataset.section ===
                    section
                );

            }
        );


        drawerItems.forEach(
            item => {

                item.classList.toggle(
                    "active",
                    item.dataset.section ===
                    section
                );

            }
        );

    }


    function showStudyPage() {

    if (!studyPage) {
        return;
    }

    /* =====================================================
       RESTORE MAIN KEDU HEADER
       Study page uses the normal header
    ===================================================== */

    const mainAppHeader =
        document.querySelector(
            "main#app > .app-header"
        );

    if (mainAppHeader) {
        mainAppHeader.style.display = "";
    }


    /* =====================================================
       SHOW BOTTOM NAVIGATION
    ===================================================== */

    const bottomNavigation =
        document.querySelector(
            ".bottom-navigation"
        );

    if (bottomNavigation) {
        bottomNavigation.style.display = "";
    }


    /* =====================================================
       CLOSE ALL SECONDARY PAGES
    ===================================================== */

    const subjectsPage =
        document.getElementById(
            "subjects-page"
        );

    const schedulePage =
        document.getElementById(
            "schedule-page"
        );

    const classDetailPage =
        document.getElementById(
            "class-detail-page"
        );

    const downloadPage =
        document.getElementById(
            "download-page"
        );

    const contactPage =
        document.getElementById(
            "contact-page"
        );


    /* =====================================================
       HIDE FAVORITE
    ===================================================== */

    if (favoritePage) {

        favoritePage.style.display =
            "none";

        favoritePage.classList.remove(
            "active"
        );

        favoritePage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       HIDE SUBJECTS
    ===================================================== */

    if (subjectsPage) {

        subjectsPage.style.display =
            "none";

        subjectsPage.classList.remove(
            "active"
        );

        subjectsPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       HIDE SCHEDULE
    ===================================================== */

    if (schedulePage) {

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


    /* =====================================================
       HIDE CLASS DETAIL
    ===================================================== */

    if (classDetailPage) {

        classDetailPage.style.display =
            "none";

        classDetailPage.classList.remove(
            "active"
        );

        classDetailPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       HIDE DOWNLOAD
    ===================================================== */

    if (downloadPage) {

        downloadPage.style.display =
            "none";

        downloadPage.classList.remove(
            "active"
        );

        downloadPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       HIDE CONTACT
    ===================================================== */

    if (contactPage) {

        contactPage.style.display =
            "none";

        contactPage.classList.remove(
            "active"
        );

        contactPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       SHOW STUDY / HOME
    ===================================================== */

    studyPage.style.display =
        "block";

    studyPage.classList.add(
        "active"
    );

    studyPage.setAttribute(
        "aria-hidden",
        "false"
    );


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    setActive(
        "study"
    );


    /* =====================================================
       RESET SCROLL
    ===================================================== */

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });


    /* =====================================================
       CLOSE DRAWER
    ===================================================== */

    closeDrawer();

}
    

    function showFavoritePage() {

    if (!favoritePage) {
        return;
    }


    /* =====================================================
       HIDE MAIN KEDU HEADER
       Favorite has its own header
    ===================================================== */

    const mainAppHeader =
        document.querySelector(
            "main#app > .app-header"
        );

    if (mainAppHeader) {

        mainAppHeader.style.display =
            "none";

    }


    /* =====================================================
       SHOW BOTTOM NAVIGATION
    ===================================================== */

    const bottomNavigation =
        document.querySelector(
            ".bottom-navigation"
        );

    if (bottomNavigation) {

        bottomNavigation.style.display =
            "";

    }


    /* =====================================================
       HIDE STUDY PAGE
    ===================================================== */

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


    /* =====================================================
       HIDE SUBJECTS
    ===================================================== */

    const subjectsPage =
        document.getElementById(
            "subjects-page"
        );

    if (subjectsPage) {

        subjectsPage.style.display =
            "none";

        subjectsPage.classList.remove(
            "active"
        );

        subjectsPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       HIDE SCHEDULE
    ===================================================== */

    const schedulePage =
        document.getElementById(
            "schedule-page"
        );

    if (schedulePage) {

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


    /* =====================================================
       HIDE CLASS DETAIL
    ===================================================== */

    const classDetailPage =
        document.getElementById(
            "class-detail-page"
        );

    if (classDetailPage) {

        classDetailPage.style.display =
            "none";

        classDetailPage.classList.remove(
            "active"
        );

        classDetailPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       HIDE DOWNLOAD
    ===================================================== */

    const downloadPage =
        document.getElementById(
            "download-page"
        );

    if (downloadPage) {

        downloadPage.style.display =
            "none";

        downloadPage.classList.remove(
            "active"
        );

        downloadPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       HIDE CONTACT
    ===================================================== */

    const contactPage =
        document.getElementById(
            "contact-page"
        );

    if (contactPage) {

        contactPage.style.display =
            "none";

        contactPage.classList.remove(
            "active"
        );

        contactPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       SHOW FAVORITE PAGE
    ===================================================== */

    favoritePage.style.display =
        "block";

    favoritePage.classList.add(
        "active"
    );

    favoritePage.setAttribute(
        "aria-hidden",
        "false"
    );


    /* =====================================================
       ACTIVE NAVIGATION
    ===================================================== */

    setActive(
        "favorite"
    );


    /* =====================================================
       CLOSE DRAWER
    ===================================================== */

    closeDrawer();


    /* =====================================================
       REFRESH FAVORITE BATCHES
    ===================================================== */

    if (
        typeof window.keduRenderFavorites ===
        "function"
    ) {

        window.keduRenderFavorites();

    }


    /* =====================================================
       REMOVE SEARCH FOCUS
    ===================================================== */

    const search =
        document.getElementById(
            "favorite-search-input"
        );

    if (search) {

        search.blur();

    }


    /* =====================================================
       RESET FAVORITE SCROLL
    ===================================================== */

    favoritePage.scrollTop =
        0;

}


    function showDownloadPage() {

    /*
     * Download has its own complete
     * page controller in download.js.
     *
     * Do NOT manually show the page here.
     */

    if (
        window.KEDUDownload &&
        typeof window.KEDUDownload.open ===
            "function"
    ) {

        window.KEDUDownload.open(
            "lecture"
        );

        return;
    }

}


    bottomNavItems.forEach(
        item => {

            item.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const section =
                        item.dataset.section;

                    if (
                        section ===
                        "favorite"
                    ) {

                        showFavoritePage();

                    }

                    else if (
                        section ===
                        "study"
                    ) {

                        showStudyPage();

                    }

                    else if (
                        section ===
                        "download"
                    ) {

                        showDownloadPage();

                    }

                }
            );

        }
    );


        /* =====================================================
       DRAWER NAVIGATION
       Study / Favorite / Download / Contact
    ====================================================== */

    drawerItems.forEach(
        item => {

            item.addEventListener(
                "click",
                event => {

                    const section =
                        item.dataset.section;

                    if (!section) {
                        return;
                    }

                    event.preventDefault();
                    event.stopPropagation();


                    /* =================================================
   CONTACT US
================================================= */

if (
    section ===
    "contact"
) {

    event.preventDefault();
    event.stopPropagation();

    /* ---------------------------------------------
   CLOSE DRAWER + REMOVE ANY LEFTOVER OVERLAY
   --------------------------------------------- */

closeDrawer();

if (
    typeof window.keduCloseDrawer ===
    "function"
) {

    window.keduCloseDrawer();

}

    /* ---------------------------------------------
       OPEN CONTACT PAGE DIRECTLY
       --------------------------------------------- */

    const contactPage =
        document.getElementById(
            "contact-page"
        );

    const mainAppHeader =
        document.querySelector(
            "main#app > .app-header"
        );

    const studyPage =
        document.getElementById(
            "home-page"
        );

    const favoritePage =
        document.getElementById(
            "favorite-page"
        );

    const followPage =
        document.getElementById(
            "follow-page"
        );

    /* Hide main header */
    if (mainAppHeader) {

        mainAppHeader.style.display =
            "none";

    }

    /* Hide Study */
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

    /* Hide Favorite */
    if (favoritePage) {

        favoritePage.style.display =
            "none";

        favoritePage.classList.remove(
            "active"
        );

        favoritePage.setAttribute(
            "aria-hidden",
            "true"
        );

    }

    /* Hide Follow Us */
    if (followPage) {

        followPage.style.display =
            "none";

        followPage.classList.remove(
            "active"
        );

        followPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }

    /* Hide bottom navigation */
    const bottomNavigation =
        document.querySelector(
            ".bottom-navigation"
        );

    if (bottomNavigation) {

        bottomNavigation.style.display =
            "none";

    }
/* ---------------------------------------------
   FINAL OVERLAY CLEANUP
   Contact must NEVER open underneath
   the drawer overlay.
   --------------------------------------------- */

drawerOverlay?.classList.remove(
    "open",
    "show"
);

document.body.style.overflow =
    "";
    /* Show Contact */
    if (contactPage) {

        contactPage.style.display =
            "flex";

        contactPage.classList.add(
            "active"
        );

        contactPage.setAttribute(
            "aria-hidden",
            "false"
        );

        contactPage.scrollTop = 0;

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

        /* Mark Contact active */
        setActive("contact");

    }
    else {

        console.error(
            "KEDU: #contact-page was not found in HTML."
        );

    }

    return;
}
                    /* =================================================
                       FAVORITE
                    ================================================= */

                    if (
                        section ===
                        "favorite"
                    ) {

                        closeDrawer();

                        showFavoritePage();

                        return;
                    }


                    /* =================================================
                       STUDY
                    ================================================= */

                    if (
                        section ===
                        "study"
                    ) {

                        closeDrawer();

                        showStudyPage();

                        return;
                    }


                    /* =================================================
                       DOWNLOAD
                    ================================================= */

                    if (
                        section ===
                        "download"
                    ) {

                        closeDrawer();

                        showDownloadPage();

                        return;
                    }

                }
            );

        }
    );


    
    window.keduShowFavoritePage =
        showFavoritePage;

    window.keduShowStudyPage =
        showStudyPage;

    window.keduSetActiveSection =
        setActive;
/* =========================================================
   PAGE SWIPE NAVIGATION
   Study → Favorite → Download
   ========================================================= */

let pageSwipeStartX = 0;
let pageSwipeStartY = 0;
let pageSwipeTracking = false;

const PAGE_SWIPE_DISTANCE = 70;

document.addEventListener(
    "touchstart",
    event => {

        if (
            event.touches.length !== 1
        ) {
            pageSwipeTracking =
                false;

            return;
        }

        /*
         * Download filter chips already have
         * their own horizontal swipe/scroll.
         */
        if (
            event.target.closest(
                "#download-filter-chips"
            )
        ) {

            pageSwipeTracking =
                false;

            window.__keduPageSwipe =
                false;

            return;

        }

        /*
         * Do not start page swipe from
         * buttons, inputs or menu controls.
         */
        if (
            event.target.closest(
                "button, input, textarea, select, a"
            )
        ) {

            pageSwipeTracking =
                false;

            window.__keduPageSwipe =
                false;

            return;

        }

        pageSwipeStartX =
            event.touches[0].clientX;

        pageSwipeStartY =
            event.touches[0].clientY;

        pageSwipeTracking =
            true;

        /*
         * Tell Download's old filter-swipe
         * controller that this gesture is
         * a page-navigation gesture.
         */
        window.__keduPageSwipe =
            true;

    },
    {
        passive:true
    }
);


document.addEventListener(
    "touchend",
    event => {

        if (
            !pageSwipeTracking ||
            !event.changedTouches.length
        ) {

            pageSwipeTracking =
                false;

            window.__keduPageSwipe =
                false;

            return;

        }

        pageSwipeTracking =
            false;

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
         */
        if (
            Math.abs(deltaY) >
            Math.abs(deltaX)
        ) {

            window.__keduPageSwipe =
                false;

            return;

        }

        /*
         * Ignore short movement.
         */
        if (
            Math.abs(deltaX) <
            PAGE_SWIPE_DISTANCE
        ) {

            window.__keduPageSwipe =
                false;

            return;

        }

        /*
         * LEFT SWIPE
         * Study → Favorite
         * Favorite → Download
         */
        if (
            deltaX < 0
        ) {

            if (
                favoritePage &&
                favoritePage.classList.contains(
                    "active"
                )
            ) {

                showDownloadPage();

            }
            else if (
                studyPage &&
                studyPage.classList.contains(
                    "active"
                )
            ) {

                showFavoritePage();

            }

        }

        /*
         * RIGHT SWIPE
         * Download → Favorite
         * Favorite → Study
         */
        else {

            const downloadPage =
                document.getElementById(
                    "download-page"
                );

            if (
                downloadPage &&
                downloadPage.classList.contains(
                    "active"
                )
            ) {

                showFavoritePage();

            }
            else if (
                favoritePage &&
                favoritePage.classList.contains(
                    "active"
                )
            ) {

                showStudyPage();

            }

        }

        window.__keduPageSwipe =
            false;

    },
    {
        passive:true
    }
);


document.addEventListener(
    "touchcancel",
    () => {

        pageSwipeTracking =
            false;

        window.__keduPageSwipe =
            false;

    },
    {
        passive:true
    }
);

    /*
       Initial state:
       Study is always active.
    */

    showStudyPage();

});