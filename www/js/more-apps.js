/* =========================================================
   KEDU PW — MORE APPS
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const moreAppsPage =
            document.getElementById(
                "more-apps-page"
            );

        const moreAppsBack =
            document.getElementById(
                "more-apps-page-back"
            );

        const moreAppsButton =
            document.querySelector(
                '.drawer-item[data-section="more-apps"]'
            );


        /* =====================================================
           SAFETY CHECK
        ====================================================== */

        if (
            !moreAppsPage ||
            !moreAppsBack ||
            !moreAppsButton
        ) {
            console.error(
                "KEDU: More Apps elements were not found."
            );

            return;
        }


        /* =====================================================
           HIDE OTHER SECONDARY PAGES
        ====================================================== */

        function hideOtherPages() {

            const pageIds = [
                "favorite-page",
                "follow-page",
                "contact-page",
                "about-kedu-page",
                "subjects-page",
                "schedule-page",
                "class-detail-page",
                "download-page",
                "chapter-page",
                "lecture-page",
                "lecture-player-page",
                "pdf-viewer-page"
            ];


            pageIds.forEach(
                id => {

                    const page =
                        document.getElementById(
                            id
                        );

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
            );

        }


        /* =====================================================
           OPEN MORE APPS
        ====================================================== */

        function openMoreAppsPage() {

            /*
             * Close drawer first
             */

            if (
                typeof window.keduCloseDrawer ===
                "function"
            ) {

                window.keduCloseDrawer();

            }


            /*
             * Hide main application header
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
             * Hide other pages
             */

            hideOtherPages();


            /*
             * Show More Apps
             */

            moreAppsPage.style.display =
                "flex";

            moreAppsPage.setAttribute(
                "aria-hidden",
                "false"
            );


            /*
             * Reset scroll
             */

            moreAppsPage.scrollTop = 0;

            const content =
                moreAppsPage.querySelector(
                    ".more-apps-page-content"
                );

            if (content) {

                content.scrollTop = 0;

            }


            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
            });


            /*
             * Mark More Apps active
             */

            if (
                typeof window.keduSetActiveSection ===
                "function"
            ) {

                window.keduSetActiveSection(
                    "more-apps"
                );

            }

        }


        /* =====================================================
           CLOSE MORE APPS
        ====================================================== */

        function closeMoreAppsPage() {

            /*
             * Hide More Apps
             */

            moreAppsPage.style.display =
                "none";

            moreAppsPage.setAttribute(
                "aria-hidden",
                "true"
            );


            /*
             * Restore main header
             */

            const mainHeader =
                document.querySelector(
                    "main#app > .app-header"
                );

            if (mainHeader) {

                mainHeader.style.display =
                    "";

            }


            /*
             * Restore bottom navigation
             */

            const bottomNavigation =
                document.querySelector(
                    ".bottom-navigation"
                );

            if (bottomNavigation) {

                bottomNavigation.style.display =
                    "";

            }


            /*
             * Return directly to Study
             */

            if (
                typeof window.keduShowStudyPage ===
                "function"
            ) {

                window.keduShowStudyPage();

            }


            /*
             * Ensure Study is active
             */

            if (
                typeof window.keduSetActiveSection ===
                "function"
            ) {

                window.keduSetActiveSection(
                    "study"
                );

            }


            /*
             * Reset page scroll
             */

            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant"
            });

        }


        /* =====================================================
           MORE APPS DRAWER BUTTON
        ====================================================== */

        moreAppsButton.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                openMoreAppsPage();

            }
        );


        /* =====================================================
           BACK BUTTON
        ====================================================== */

        moreAppsBack.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                closeMoreAppsPage();

            }
        );


    }
);