/* =========================================================
   KEDU PW — CONTACT US
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const contactPage =
            document.getElementById(
                "contact-page"
            );

        const contactBack =
            document.getElementById(
                "contact-page-back"
            );

        const contactForm =
            document.getElementById(
                "kedu-contact-form"
            );

        const subject =
            document.getElementById(
                "contact-subject"
            );

        const otherWrapper =
            document.getElementById(
                "contact-other-wrapper"
            );

        const otherSubject =
            document.getElementById(
                "contact-other"
            );

        const message =
            document.getElementById(
                "contact-message"
            );

        const submitButton =
            document.getElementById(
                "contact-submit-button"
            );

        const status =
            document.getElementById(
                "contact-form-status"
            );


        /* =====================================================
           OPEN CONTACT PAGE
        ====================================================== */

        function openContactPage() {

            if (!contactPage) {
                return;
            }


            /* Hide main app header */

            const mainHeader =
                document.querySelector(
                    "main#app > .app-header"
                );

            if (mainHeader) {
                mainHeader.style.display =
                    "none";
            }


            /* Hide study */

            const studyPage =
                document.getElementById(
                    "home-page"
                );

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


            /* Hide favorite */

            const favoritePage =
                document.getElementById(
                    "favorite-page"
                );

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

            const followPage =
                document.getElementById(
                    "follow-page"
                );

            if (followPage) {

                followPage.style.display =
                    "none";

                followPage.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }


            /* Hide contact's secondary pages */

            [
                "subjects-page",
                "schedule-page",
                "class-detail-page",
                "download-page"
            ].forEach(
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

/* =====================================================
   HIDE BOTTOM NAVIGATION
   Contact is a full-screen secondary page.
====================================================== */

const bottomNavigation =
    document.querySelector(
        ".bottom-navigation"
    );

if (bottomNavigation) {

    bottomNavigation.style.display =
        "none";

}
            /* Show Contact */

            contactPage.style.display =
                "flex";

            contactPage.setAttribute(
                "aria-hidden",
                "false"
            );


            /* Scroll to top */

            contactPage.scrollTop = 0;

            window.scrollTo(
                0,
                0
            );


            /* Drawer active state */

            if (
                typeof window.keduSetActiveSection ===
                "function"
            ) {

                window.keduSetActiveSection(
                    "contact"
                );

            }


            /* =====================================================
   CLOSE DRAWER BEFORE SHOWING CONTACT PAGE
====================================================== */

if (
    typeof window.keduCloseDrawer ===
    "function"
) {

    window.keduCloseDrawer();

}
else {

    /*
     * Fallback only if drawer.js
     * is not available.
     */

    const navigationDrawer =
        document.getElementById(
            "navigation-drawer"
        );

    const drawerOverlay =
        document.getElementById(
            "drawer-overlay"
        );

    navigationDrawer?.classList.remove(
        "open"
    );

    drawerOverlay?.classList.remove(
        "open",
        "show"
    );

    document.body.style.overflow =
        "";

}

        /* =====================================================
   CLOSE CONTACT PAGE
====================================================== */


function closeContactPage() {

    /* =============================================
       1. HIDE CONTACT PAGE
       ============================================= */

    if (contactPage) {

        contactPage.style.display = "none";

        contactPage.classList.remove("active");

        contactPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =============================================
       2. CLOSE DRAWER + OVERLAY
       ============================================= */

    const drawer =
        document.getElementById(
            "side-drawer"
        );

    const overlay =
        document.getElementById(
            "drawer-overlay"
        );

    drawer?.classList.remove("open");

    overlay?.classList.remove(
        "open",
        "show"
    );

    document.body.style.overflow = "";


    /* =============================================
       3. USE MAIN NAVIGATION CONTROLLER
       ============================================= */

    if (
        typeof window.keduShowStudyPage ===
        "function"
    ) {

        window.keduShowStudyPage();

        return;

    }


    /* =============================================
       4. FALLBACK
       ============================================= */

    const studyPage =
        document.getElementById(
            "home-page"
        );

    if (studyPage) {

        studyPage.style.display = "block";

        studyPage.classList.add("active");

        studyPage.setAttribute(
            "aria-hidden",
            "false"
        );

        studyPage.scrollTop = 0;

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    }

}
        

        /* =====================================================
           SUBJECT — OTHER
        ====================================================== */

        subject?.addEventListener(
            "change",
            () => {

                const isOther =
                    subject.value ===
                    "Other";


                if (isOther) {

                    otherWrapper.hidden =
                        false;

                    otherSubject.required =
                        true;

                    setTimeout(
                        () => {
                            otherSubject.focus();
                        },
                        50
                    );

                }
                else {

                    otherWrapper.hidden =
                        true;

                    otherSubject.required =
                        false;

                    otherSubject.value =
                        "";

                }

            }
        );


        /* =====================================================
           AUTO EXPANDING MESSAGE
        ====================================================== */

        function resizeMessage() {

            if (!message) {
                return;
            }

            message.style.height =
                "auto";

            message.style.height =
                message.scrollHeight +
                "px";

        }


        message?.addEventListener(
            "input",
            resizeMessage
        );


        /* =====================================================
           CLEAR ERROR
        ====================================================== */

        function clearError(
            inputId,
            errorId
        ) {

            const input =
                document.getElementById(
                    inputId
                );

            const error =
                document.getElementById(
                    errorId
                );

            if (!input) {
                return;
            }

            input
                .closest(
                    ".contact-form-group"
                )
                ?.classList.remove(
                    "has-error"
                );

            if (error) {
                error.textContent =
                    "";
            }

        }


        document
            .getElementById(
                "contact-name"
            )
            ?.addEventListener(
                "input",
                () => {
                    clearError(
                        "contact-name",
                        "contact-name-error"
                    );
                }
            );


        document
            .getElementById(
                "contact-email"
            )
            ?.addEventListener(
                "input",
                () => {
                    clearError(
                        "contact-email",
                        "contact-email-error"
                    );
                }
            );


        subject?.addEventListener(
            "change",
            () => {
                clearError(
                    "contact-subject",
                    "contact-subject-error"
                );
            }
        );


        message?.addEventListener(
            "input",
            () => {
                clearError(
                    "contact-message",
                    "contact-message-error"
                );
            }
        );


        otherSubject?.addEventListener(
            "input",
            () => {
                clearError(
                    "contact-other",
                    "contact-other-error"
                );
            }
        );


        /* =====================================================
           VALIDATION
        ====================================================== */

        function showError(
            inputId,
            errorId,
            text
        ) {

            const input =
                document.getElementById(
                    inputId
                );

            const error =
                document.getElementById(
                    errorId
                );

            input
                ?.closest(
                    ".contact-form-group"
                )
                ?.classList.add(
                    "has-error"
                );

            if (error) {
                error.textContent =
                    text;
            }

        }


        function validateForm() {

            let valid =
                true;


            const name =
                document.getElementById(
                    "contact-name"
                );

            const email =
                document.getElementById(
                    "contact-email"
                );


            /* Name */

            if (
                !name.value.trim()
            ) {

                showError(
                    "contact-name",
                    "contact-name-error",
                    "Please enter your name."
                );

                valid = false;

            }


            /* Email */

            const emailValue =
                email.value.trim();

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailValue) {

                showError(
                    "contact-email",
                    "contact-email-error",
                    "Please enter your email."
                );

                valid = false;

            }
            else if (
                !emailPattern.test(
                    emailValue
                )
            ) {

                showError(
                    "contact-email",
                    "contact-email-error",
                    "Please enter a valid email address."
                );

                valid = false;

            }


            /* Subject */

            if (
                !subject.value
            ) {

                showError(
                    "contact-subject",
                    "contact-subject-error",
                    "Please select a subject."
                );

                valid = false;

            }


            /* Other */

            if (
                subject.value ===
                "Other" &&
                !otherSubject.value.trim()
            ) {

                showError(
                    "contact-other",
                    "contact-other-error",
                    "Please specify your subject."
                );

                valid = false;

            }


            /* Message */

            if (
                !message.value.trim()
            ) {

                showError(
                    "contact-message",
                    "contact-message-error",
                    "Please write your message."
                );

                valid = false;

            }


            return valid;

        }


        /* =====================================================
           FORM SUBMIT
        ====================================================== */

        contactForm?.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                if (!validateForm()) {

                    status.textContent =
                        "Please check the highlighted fields.";

                    status.className =
                        "contact-form-status error";

                    return;

                }


                /*
                 * Backend/API is not connected yet.
                 *
                 * This keeps the Contact page ready
                 * for the future KEDU Admin Panel.
                 */

                const formData = {

                    name:
                        document
                            .getElementById(
                                "contact-name"
                            )
                            .value
                            .trim(),

                    email:
                        document
                            .getElementById(
                                "contact-email"
                            )
                            .value
                            .trim(),

                    subject:
                        subject.value,

                    otherSubject:
                        otherSubject.value
                            .trim(),

                    message:
                        message.value
                            .trim(),

                    createdAt:
                        new Date()
                            .toISOString()

                };


                /*
                 * Temporary local event.
                 *
                 * Replace this section later
                 * with your backend API request.
                 */

                console.log(
                    "KEDU Contact Message:",
                    formData
                );


                submitButton.disabled =
                    true;

                submitButton.querySelector(
                    "span:first-child"
                ).textContent =
                    "Message Ready";


                status.textContent =
                    "Your message is ready to be connected to KEDU Support.";

                status.className =
                    "contact-form-status success";


                /*
                 * Reset after successful validation.
                 */

                contactForm.reset();

                otherWrapper.hidden =
                    true;

                otherSubject.required =
                    false;

                message.style.height =
                    "auto";


                setTimeout(
                    () => {

                        submitButton.disabled =
                            false;

                        submitButton.querySelector(
                            "span:first-child"
                        ).textContent =
                            "Send Message";

                    },
                    1800
                );

            }
        );


        /* =====================================================
           INITIAL STATE
        ====================================================== */

        if (contactPage) {

            contactPage.style.display =
                "none";

            contactPage.setAttribute(
                "aria-hidden",
                "true"
            );

        }

                /* =====================================================
           GLOBAL ACCESS
        ====================================================== */

        window.keduOpenContactPage =
            openContactPage;

        window.keduCloseContactPage =
            closeContactPage;

            }
    }
);
/* =========================================================
   KEDU PW — CONTACT BACK BUTTON
   GLOBAL / DIRECT NAVIGATION FIX
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const backButton =
            event.target.closest(
                "#contact-page-back"
            );

        if (!backButton) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();


        /* =============================================
           1. HIDE CONTACT PAGE
        ============================================= */

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


        /* =============================================
           2. CLOSE DRAWER / OVERLAY
        ============================================= */

        const drawer =
            document.getElementById(
                "side-drawer"
            );

        const overlay =
            document.getElementById(
                "drawer-overlay"
            );

        drawer?.classList.remove(
            "open"
        );

        overlay?.classList.remove(
            "open",
            "show"
        );

        document.body.style.overflow =
            "";


        /* =============================================
           3. RESTORE MAIN APP HEADER
        ============================================= */

        const mainHeader =
            document.querySelector(
                "main#app > .app-header"
            );

        if (mainHeader) {

            mainHeader.style.display =
                "";

        }


        /* =============================================
           4. RESTORE BOTTOM NAVIGATION
        ============================================= */

        const bottomNavigation =
            document.querySelector(
                ".bottom-navigation"
            );

        if (bottomNavigation) {

            bottomNavigation.style.display =
                "";

        }


        /* =============================================
           5. HIDE OTHER PAGES
        ============================================= */

        [
            "favorite-page",
            "follow-page",
            "subjects-page",
            "schedule-page",
            "class-detail-page",
            "download-page"
        ].forEach(
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


        /* =============================================
           6. SHOW STUDY PAGE
           #home-page = STUDY / CLASS CARDS
        ============================================= */

        const studyPage =
            document.getElementById(
                "home-page"
            );

        if (!studyPage) {

            console.error(
                "KEDU: #home-page not found."
            );

            return;

        }


        studyPage.style.display =
            "block";

        studyPage.classList.add(
            "active"
        );

        studyPage.setAttribute(
            "aria-hidden",
            "false"
        );


        /* =============================================
           7. ACTIVATE STUDY NAVIGATION
        ============================================= */

        document
            .querySelectorAll(
                ".bottom-nav-item, .drawer-item"
            )
            .forEach(
                item => {

                    item.classList.toggle(
                        "active",
                        item.dataset.section ===
                        "study"
                    );

                }
            );


        /* =============================================
           8. RESET STUDY PAGE SCROLL
        ============================================= */

        studyPage.scrollTop = 0;

        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });


        console.log(
            "KEDU: Contact Back → Study Page"
        );

    },
    true
);