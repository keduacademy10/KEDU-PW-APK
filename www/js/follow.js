/* =========================================================
   KEDU PW — FOLLOW PAGE
   File: js/follow.js
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       FOLLOW PAGE
    ===================================================== */

    const followPage =
        document.getElementById("follow-page");


    if (!followPage) {
        console.warn(
            "KEDU: #follow-page not found."
        );
        return;
    }


    /* =====================================================
       OPEN FOLLOW PAGE
    ===================================================== */

    function openFollowPage() {

    /*
     * =========================================
     * CLOSE DRAWER
     * =========================================
     *
     * drawer.js uses "open" for the drawer
     * and "open" for the overlay.
     */

    const drawer =
        document.getElementById("side-drawer");

    const overlay =
        document.getElementById("drawer-overlay");

    if (drawer) {
        drawer.classList.remove("open");
    }

    if (overlay) {
        overlay.classList.remove("open");
    }

    /*
     * =========================================
     * MAKE FOLLOW US ACTIVE
     * =========================================
     */

    const followButton =
        getDrawerFollowButton();

    if (followButton) {
        followButton.classList.add("active");
    }

        /*
         * Hide normal application sections
         */
        document
            .querySelectorAll(
                "main > section, main > div"
            )
            .forEach(function (section) {

                if (
                    section !== followPage &&
                    section.classList.contains(
                        "follow-page"
                    ) === false
                ) {

                    section.style.display = "none";

                }

            });


        /*
         * Show Follow page
         */
        followPage.style.display = "flex";
        followPage.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * Add active state
         */
        followPage.classList.add(
            "active"
        );


        /*
         * Scroll Follow page to top
         */
        followPage.scrollTop = 0;

        window.scrollTo({
            top: 0,
            behavior: "instant"
        });

    }


    
    /* =====================================================
   CLOSE FOLLOW PAGE
   Return directly to Study class cards
===================================================== */

function closeFollowPage() {
    /*
     * =========================================
     * REMOVE FOLLOW US ACTIVE STATE
     * =========================================
     */

    const followButton =
        getDrawerFollowButton();

    if (followButton) {
        followButton.classList.remove("active");
    }
    /* -----------------------------------------------
       Hide Follow page
    ----------------------------------------------- */

    followPage.style.display = "none";

    followPage.setAttribute(
        "aria-hidden",
        "true"
    );

    followPage.classList.remove(
        "active"
    );


    /* -----------------------------------------------
       Use the existing KEDU Study navigation
       controller.
       
       navigation.js already handles:
       - closing secondary pages
       - showing #home-page
       - showing class cards
       - activating Study
       - resetting scroll
    ----------------------------------------------- */

    if (
        typeof window.keduShowStudyPage ===
        "function"
    ) {

        window.keduShowStudyPage();

        return;
    }


    /* -----------------------------------------------
       Fallback
       Only used if navigation.js is unavailable.
    ----------------------------------------------- */

    const homePage =
        document.getElementById(
            "home-page"
        );

    if (homePage) {

        homePage.style.display =
            "block";

        homePage.classList.add(
            "active"
        );

        homePage.setAttribute(
            "aria-hidden",
            "false"
        );
    }


    window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant"
    });

}


    /* =====================================================
       FIND DRAWER FOLLOW BUTTON
    ===================================================== */

    function getDrawerFollowButton() {

        const drawerItems =
            document.querySelectorAll(
                ".drawer-item"
            );


        for (
            let i = 0;
            i < drawerItems.length;
            i++
        ) {

            const text =
                drawerItems[i]
                    .textContent
                    .trim()
                    .replace(/\s+/g, " ");


            if (
                text.toLowerCase() ===
                "follow us"
            ) {

                return drawerItems[i];

            }

        }


        return null;

    }


    /* =====================================================
       DRAWER → FOLLOW US
    ===================================================== */

    function setupDrawerFollow() {

        const button =
            getDrawerFollowButton();


        if (!button) {

            console.warn(
                "KEDU: Drawer Follow Us button not found."
            );

            return;

        }


        /*
         * Prevent duplicate binding
         */
        if (
            button.dataset.followReady ===
            "true"
        ) {

            return;

        }


        button.dataset.followReady =
            "true";


        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                openFollowPage();

            },
            true
        );

    }


    /* =====================================================
       FOLLOW PAGE BACK BUTTON
    ===================================================== */

    function setupBackButton() {

        const backButton =
            document.getElementById(
                "follow-page-back"
            );


        if (!backButton) {
            return;
        }


        if (
            backButton.dataset.followReady ===
            "true"
        ) {

            return;

        }


        backButton.dataset.followReady =
            "true";


        backButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                closeFollowPage();

            }
        );

    }


    /* =====================================================
       SOCIAL LINKS
    ===================================================== */

    function setupSocialLinks() {

        const links =
            followPage.querySelectorAll(
                "a"
            );


        links.forEach(
            function (link) {

                if (
                    link.target ===
                    "_blank"
                ) {

                    link.rel =
                        "noopener noreferrer";

                }

            }
        );

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    function initFollowPage() {

        setupDrawerFollow();

        setupBackButton();

        setupSocialLinks();

    }


    /* =====================================================
       DOM READY
    ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initFollowPage
        );

    } else {

        initFollowPage();

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.KeduFollow = {

        open:
            openFollowPage,

        close:
            closeFollowPage

    };

})();