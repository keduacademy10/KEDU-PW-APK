/* =========================================================
   KEDU PW — ABOUT KEDU PAGE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =====================================================
           ELEMENTS
        ===================================================== */

        const aboutPage =
            document.getElementById(
                "about-kedu-page"
            );

        const aboutBackButton =
            document.getElementById(
                "about-kedu-back"
            );

        const drawer =
            document.getElementById(
                "side-drawer"
            );

        const drawerOverlay =
            document.getElementById(
                "drawer-overlay"
            );

        const mainAppHeader =
            document.querySelector(
                "main#app > .app-header"
            );

        const bottomNavigation =
            document.querySelector(
                ".bottom-navigation"
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

        const contactPage =
            document.getElementById(
                "contact-page"
            );

        const downloadPage =
            document.getElementById(
                "download-page"
            );


        /* =====================================================
           FIND ABOUT KEDU DRAWER BUTTON
           
           The current HTML does not have
           data-section="about".
           
           So find it by its visible text.
        ===================================================== */

        const drawerItems =
            document.querySelectorAll(
                ".drawer-item"
            );

        let aboutDrawerButton = null;

        drawerItems.forEach(
            item => {

                const text =
                    item.textContent
                        .trim()
                        .replace(
                            /\s+/g,
                            " "
                        );

                if (
                    text ===
                    "About KEDU"
                ) {

                    aboutDrawerButton =
                        item;

                }

            }
        );


        /* =====================================================
           CLOSE DRAWER
        ===================================================== */

        function closeDrawer() {

            drawer?.classList.remove(
                "open"
            );

            drawerOverlay?.classList.remove(
                "open",
                "show"
            );

            document.body.style.overflow =
                "";

            /*
             * Also use the existing global
             * drawer controller when available.
             */

            if (
                typeof window.keduCloseDrawer ===
                "function"
            ) {

                window.keduCloseDrawer();

            }

        }


        /* =====================================================
           HIDE PAGE
        ===================================================== */

        function hidePage(
            page
        ) {

            if (!page) {
                return;
            }

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


        /* =====================================================
           HIDE OTHER PAGES
        ===================================================== */

        function hideOtherPages() {

            hidePage(
                studyPage
            );

            hidePage(
                favoritePage
            );

            hidePage(
                followPage
            );

            hidePage(
                contactPage
            );

            hidePage(
                downloadPage
            );

        }


        /* =====================================================
           SHOW ABOUT KEDU
        ===================================================== */

        function showAboutKedu() {

            if (!aboutPage) {

                console.error(
                    "KEDU: #about-kedu-page was not found in HTML."
                );

                return;

            }


            /*
             * Close drawer first.
             */

            closeDrawer();


            /*
             * Hide all normal pages.
             */

            hideOtherPages();


            /*
             * Hide main app header.
             */

            if (mainAppHeader) {

                mainAppHeader.style.display =
                    "none";

            }


            /*
             * Hide bottom navigation.
             */

            if (bottomNavigation) {

                bottomNavigation.style.display =
                    "none";

            }


            /*
             * Remove leftover drawer overlay.
             */

            drawer?.classList.remove(
                "open"
            );

            drawerOverlay?.classList.remove(
                "open",
                "show"
            );


            /*
             * Allow page scrolling.
             */

            document.body.style.overflow =
                "";


            /*
             * Show About KEDU.
             */

            aboutPage.style.display =
                "flex";

            aboutPage.classList.add(
                "active"
            );

            aboutPage.setAttribute(
                "aria-hidden",
                "false"
            );


            /*
             * Start from top.
             */

            aboutPage.scrollTop =
                0;

            const content =
                aboutPage.querySelector(
                    ".about-kedu-content"
                );

            if (content) {

                content.scrollTop =
                    0;

            }


            window.scrollTo({
                top:0,
                left:0,
                behavior:"instant"
            });


            /*
             * Body scroll remains normal because
             * the About page itself handles scrolling.
             */

            document.body.style.overflow =
                "";


            /*
             * Remember current page.
             */

            window.__keduAboutPageOpen =
                true;

        }


        /* =====================================================
           CLOSE ABOUT KEDU
        ===================================================== */

        function closeAboutKedu() {

            if (!aboutPage) {
                return;
            }


            /*
             * Hide About page.
             */

            aboutPage.style.display =
                "none";

            aboutPage.classList.remove(
                "active"
            );

            aboutPage.setAttribute(
                "aria-hidden",
                "true"
            );


            /*
             * Show main header again.
             */

            if (mainAppHeader) {

                mainAppHeader.style.display =
                    "";

            }


            /*
             * Restore bottom navigation.
             */

            if (bottomNavigation) {

                bottomNavigation.style.display =
                    "";

            }


            /*
             * Clear state.
             */

            window.__keduAboutPageOpen =
                false;


            /*
             * Return to Study/Home.
             *
             * Use the existing navigation controller
             * when available.
             */

            if (
                typeof window.keduShowStudyPage ===
                "function"
            ) {

                window.keduShowStudyPage();

            }
            else {

                /*
                 * Fallback if navigation.js
                 * has not loaded.
                 */

                if (studyPage) {

                    studyPage.style.display =
                        "block";

                    studyPage.classList.add(
                        "active"
                    );

                    studyPage.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                }

            }


            window.scrollTo({
                top:0,
                left:0,
                behavior:"instant"
            });

        }


        /* =====================================================
           ABOUT DRAWER BUTTON
        ===================================================== */

        if (aboutDrawerButton) {

            aboutDrawerButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    showAboutKedu();

                }
            );

        }
        else {

            console.warn(
                "KEDU: About KEDU drawer button was not found."
            );

        }


        /* =====================================================
           ABOUT BACK BUTTON
        ===================================================== */

        if (aboutBackButton) {

            aboutBackButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    event.stopPropagation();

                    closeAboutKedu();

                }
            );

        }


        /* =====================================================
           ESC KEY
        ===================================================== */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape" &&
                    window.__keduAboutPageOpen
                ) {

                    closeAboutKedu();

                }

            }
        );


        /* =====================================================
           PUBLIC API
        ===================================================== */

        window.keduShowAboutKedu =
            showAboutKedu;

        window.keduCloseAboutKedu =
            closeAboutKedu;


        /* =====================================================
           INITIAL STATE
        ===================================================== */

        if (aboutPage) {

            aboutPage.style.display =
                "none";

            aboutPage.classList.remove(
                "active"
            );

            aboutPage.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    }
);