/* =========================================
   KEDU PW — LEFT DRAWER
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const drawer =
        document.getElementById(
            "side-drawer"
        );

    const overlay =
        document.getElementById(
            "drawer-overlay"
        );
const favoriteOpenButton =
    document.getElementById(
        "favorite-drawer-open"
    );

const downloadOpenButton =
    document.getElementById(
        "download-menu-btn"
    );
    const openButton =
        document.getElementById(
            "drawer-open"
        );

    const closeButton =
        document.getElementById(
            "drawer-close"
        );

    const settingToggle =
        document.getElementById(
            "setting-toggle"
        );

    const settingSubmenu =
        document.getElementById(
            "setting-submenu"
        );


    if (
        !drawer ||
        !overlay ||
        !openButton ||
        !closeButton
    ) {
        return;
    }


    /* =====================================
       OPEN DRAWER
    ====================================== */

    function openDrawer() {

        drawer.classList.add("open");

        overlay.classList.add("open");

        document.body.style.overflow =
            "hidden";

    }


    /* =====================================
       CLOSE DRAWER
    ====================================== */

    function closeDrawer() {

        drawer.classList.remove("open");

        overlay.classList.remove("open");

        document.body.style.overflow =
            "";

    }


    /*
     * Make helper available to
     * other navigation code.
     */

    window.keduOpenDrawer =
        openDrawer;

    window.keduCloseDrawer =
        closeDrawer;


    /* =====================================
       HAMBURGER TAP
    ====================================== */

    openButton.addEventListener(
        "click",
        openDrawer
    );

favoriteOpenButton?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        openDrawer();

    }
);

downloadOpenButton?.addEventListener(
    "click",
    event => {

        event.preventDefault();
        event.stopPropagation();

        openDrawer();

    }
);
    /* =====================================
       BACK BUTTON
    ====================================== */

    closeButton.addEventListener(
        "click",
        closeDrawer
    );


    /* =====================================
       TAP OUTSIDE
    ====================================== */

    overlay.addEventListener(
        "click",
        closeDrawer
    );


    /* =====================================
       SETTING SUBMENU
    ====================================== */

    if (
        settingToggle &&
        settingSubmenu
    ) {

        settingToggle.addEventListener(
            "click",
            event => {

                /*
                 * Do not let navigation
                 * treat Setting as a page.
                 */

                event.stopPropagation();


                settingToggle.classList.toggle(
                    "open"
                );


                settingSubmenu.classList.toggle(
                    "open"
                );

            }
        );

    }


    /* =====================================
       SWIPE DRAWER
    ====================================== */

    let drawerStartX = 0;
    let drawerStartY = 0;


    const DRAWER_SWIPE_DISTANCE = 70;


    /*
     * Swipe from left edge
     * to open drawer
     */

    document.addEventListener(
        "touchstart",
        event => {

            if (
                event.touches.length !== 1
            ) {
                return;
            }


            drawerStartX =
                event.touches[0].clientX;

            drawerStartY =
                event.touches[0].clientY;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        event => {

            if (
                event.changedTouches.length !== 1
            ) {
                return;
            }


            const endX =
                event.changedTouches[0].clientX;

            const endY =
                event.changedTouches[0].clientY;


            const deltaX =
                endX - drawerStartX;

            const deltaY =
                endY - drawerStartY;


            /*
             * Ignore vertical swipe
             */

            if (
                Math.abs(deltaY) >
                Math.abs(deltaX)
            ) {
                return;
            }


            /*
             * Open drawer:
             *
             * Start very close to
             * left edge
             *
             * Swipe toward right
             */

            if (
                !drawer.classList.contains("open") &&
                drawerStartX <= 55 &&
                deltaX >= DRAWER_SWIPE_DISTANCE
            ) {

                openDrawer();

                return;

            }


            /*
             * Close drawer:
             *
             * Start inside drawer
             *
             * Swipe toward left
             */

            if (
                drawer.classList.contains("open") &&
                drawerStartX <= drawer.offsetWidth &&
                deltaX <= -DRAWER_SWIPE_DISTANCE
            ) {

                closeDrawer();

            }

        },
        {
            passive: true
        }
    );


    /* =====================================
       ESCAPE KEY
    ====================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                drawer.classList.contains("open")
            ) {

                closeDrawer();

            }

        }
    );

});