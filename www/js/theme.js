/* =========================================================
   KEDU PW — THEME SYSTEM
   Light / Dark / System Default
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       STORAGE
    ====================================================== */

    const THEME_STORAGE_KEY =
        "kedu-theme";


    /* =====================================================
       GET SAVED THEME
    ====================================================== */

    function getSavedTheme() {

        const saved =
            localStorage.getItem(
                THEME_STORAGE_KEY
            );

        if (
            saved === "light" ||
            saved === "dark" ||
            saved === "system"
        ) {
            return saved;
        }

        return "system";

    }


    /* =====================================================
       CHECK SYSTEM THEME
    ====================================================== */

    function systemPrefersDark() {

        return window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

    }


    /* =====================================================
       APPLY THEME
    ====================================================== */

    function applyTheme(theme) {

        let darkMode = false;


        if (theme === "dark") {

            darkMode = true;

        }
        else if (theme === "system") {

            darkMode =
                systemPrefersDark();

        }


        document.body.classList.toggle(
            "dark-mode",
            darkMode
        );


        /*
         * Update browser theme colour
         */

        const themeColor =
            document.querySelector(
                'meta[name="theme-color"]'
            );

        if (themeColor) {

            themeColor.setAttribute(
                "content",
                darkMode
                    ? "#F4B400"
                    : "#0A1F5C"
            );

        }

    }


    /* =====================================================
       APPLY SAVED THEME IMMEDIATELY
    ====================================================== */

    applyTheme(
        getSavedTheme()
    );


    /* =====================================================
       WAIT FOR DOM
    ====================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            const themeButton =
                document.getElementById(
                    "drawer-theme-button"
                );

            const overlay =
                document.getElementById(
                    "theme-dialog-overlay"
                );

            const dialog =
                document.getElementById(
                    "theme-dialog"
                );

            const cancelButton =
                document.getElementById(
                    "theme-dialog-cancel"
                );

            const confirmButton =
                document.getElementById(
                    "theme-dialog-confirm"
                );

            const options =
                document.querySelectorAll(
                    'input[name="kedu-theme"]'
                );


            if (
                !themeButton ||
                !overlay ||
                !dialog ||
                !cancelButton ||
                !confirmButton
            ) {

                console.warn(
                    "KEDU Theme: Required elements not found."
                );

                return;

            }


            /* =============================================
               CURRENT TEMPORARY SELECTION
            ============================================== */

            let selectedTheme =
                getSavedTheme();


            /* =============================================
               CLOSE DRAWER
            ============================================== */

            function closeDrawer() {

                if (
                    typeof window.keduCloseDrawer ===
                    "function"
                ) {

                    window.keduCloseDrawer();

                    return;

                }


                const drawer =
                    document.getElementById(
                        "side-drawer"
                    );

                const drawerOverlay =
                    document.getElementById(
                        "drawer-overlay"
                    );

                drawer?.classList.remove(
                    "open"
                );

                drawerOverlay?.classList.remove(
                    "open"
                );

                document.body.style.overflow =
                    "";

            }


            /* =============================================
               SELECT SAVED OPTION
            ============================================== */

            function selectSavedTheme() {

                selectedTheme =
                    getSavedTheme();


                options.forEach(
                    option => {

                        option.checked =
                            option.value ===
                            selectedTheme;

                    }
                );

            }


            /* =============================================
               OPEN DIALOG
            ============================================== */

            function openThemeDialog() {

                /*
                 * First close drawer.
                 */

                closeDrawer();


                /*
                 * Load currently saved theme.
                 */

                selectSavedTheme();


                /*
                 * Open dialogue.
                 */

                overlay.classList.add(
                    "active"
                );

                overlay.setAttribute(
                    "aria-hidden",
                    "false"
                );


                document.body.classList.add(
                    "theme-dialog-open"
                );

            }


            /* =============================================
               CLOSE DIALOG
            ============================================== */

            function closeThemeDialog() {

                overlay.classList.remove(
                    "active"
                );

                overlay.setAttribute(
                    "aria-hidden",
                    "true"
                );


                document.body.classList.remove(
                    "theme-dialog-open"
                );

            }


            /* =============================================
               THEME BUTTON
            ============================================== */

            themeButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    openThemeDialog();

                }
            );


            /* =============================================
               OPTION CHANGE
            ============================================== */

            options.forEach(
                option => {

                    option.addEventListener(
                        "change",
                        () => {

                            selectedTheme =
                                option.value;

                        }
                    );

                }
            );


            /* =============================================
               CANCEL
            ============================================== */

            cancelButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    /*
                     * Do NOT change theme.
                     */

                    closeThemeDialog();

                }
            );


            /* =============================================
               CONFIRM
            ============================================== */

            confirmButton.addEventListener(
                "click",
                event => {

                    event.preventDefault();


                    /*
                     * Save selected theme.
                     */

                    localStorage.setItem(
                        THEME_STORAGE_KEY,
                        selectedTheme
                    );


                    /*
                     * Apply it before reload.
                     */

                    applyTheme(
                        selectedTheme
                    );


                    /*
                     * Restart application.
                     */

                    window.location.reload();

                }
            );


            /* =============================================
               TAP OUTSIDE
            ============================================== */

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        overlay
                    ) {

                        closeThemeDialog();

                    }

                }
            );


            /* =============================================
               ESCAPE
            ============================================== */

            document.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Escape" &&
                        overlay.classList.contains(
                            "active"
                        )
                    ) {

                        closeThemeDialog();

                    }

                }
            );


            /* =============================================
               SYSTEM THEME CHANGE
            ============================================== */

            const mediaQuery =
                window.matchMedia
                    ? window.matchMedia(
                        "(prefers-color-scheme: dark)"
                    )
                    : null;


            function systemThemeChanged() {

                if (
                    getSavedTheme() ===
                    "system"
                ) {

                    applyTheme(
                        "system"
                    );

                }

            }


            if (mediaQuery) {

                if (
                    typeof mediaQuery.addEventListener ===
                    "function"
                ) {

                    mediaQuery.addEventListener(
                        "change",
                        systemThemeChanged
                    );

                }
                else if (
                    typeof mediaQuery.addListener ===
                    "function"
                ) {

                    mediaQuery.addListener(
                        systemThemeChanged
                    );

                }

            }


            console.log(
                "KEDU Theme System Ready"
            );

        }
    );

})();