/* =========================================================
   KEDU PW — STUDY
   CLASS CARDS → BATCH PAGE
   FINAL NAVIGATION VERSION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const studyPage =
        document.getElementById("home-page");

    const detailPage =
        document.getElementById("class-detail-page");

    const detailTitle =
        document.getElementById("class-detail-title");

    const detailCategory =
        document.getElementById("class-detail-category");

    const backButton =
        document.getElementById("class-detail-back");

    const cards =
        document.querySelectorAll(".study-card");

    const sections =
        document.querySelectorAll(".batches-section");

    const comingSoon =
        document.getElementById("batches-coming-soon");


    /* =====================================================
       SAFETY CHECK
       ===================================================== */

    if (
        !studyPage ||
        !detailPage ||
        !cards.length
    ) {
        console.error(
            "KEDU PW: Study navigation elements not found."
        );

        return;
    }


    /* =====================================================
       SET STUDY NAVIGATION ACTIVE
       ===================================================== */

    function setStudyActive() {

        document
            .querySelectorAll(".bottom-nav-item")
            .forEach(function (item) {

                const section =
                    item.dataset.section;

                item.classList.toggle(
                    "active",
                    section === "study"
                );

            });


        document
            .querySelectorAll(
                '.drawer-item[data-section="study"]'
            )
            .forEach(function (item) {

                item.classList.add(
                    "active"
                );

            });

    }


    /* =====================================================
       HIDE ALL MAIN PAGES
       ===================================================== */

    function hideAllPages() {

        document
            .querySelectorAll(
                ".page"
            )
            .forEach(function (page) {

                page.style.display =
                    "none";

                page.classList.remove(
                    "active"
                );

                page.setAttribute(
                    "aria-hidden",
                    "true"
                );

            });


        /* Schedule */

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


        /* Subjects */

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


        /* Class Detail */

        detailPage.style.display =
            "none";

        detailPage.classList.remove(
            "active"
        );

        detailPage.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================================
       OPEN CLASS → BATCH PAGE
       ===================================================== */

    function openClass(card) {

        if (!card) {
            return;
        }


        const title =
            card.dataset.studyTitle ||
            "Class";


        const category =
            card.dataset.studyCategory ||
            "School";


        const sectionId =
            card.dataset.batchSection ||
            "";


        /* ================================================
           SAVE SELECTED CLASS
           ================================================ */

        sessionStorage.setItem(
            "keduSelectedStudyTitle",
            title
        );

        sessionStorage.setItem(
            "keduSelectedStudyCategory",
            category
        );

        sessionStorage.setItem(
            "keduSelectedBatchSection",
            sectionId
        );


        /* ================================================
           UPDATE HEADER
           ================================================ */

        if (detailTitle) {

            detailTitle.textContent =
                title;

        }


        if (detailCategory) {

            detailCategory.textContent =
                category;

        }


        /* ================================================
           HIDE EVERY PAGE FIRST
           ================================================ */

        hideAllPages();


        /* ================================================
           HIDE ALL BATCH SECTIONS
           ================================================ */

        sections.forEach(
            function (section) {

                section.classList.remove(
                    "active"
                );

                section.style.display =
                    "none";

            }
        );


        /* ================================================
           FIND SELECTED BATCH SECTION
           ================================================ */

        let selectedSection = null;


        if (sectionId) {

            selectedSection =
                document.getElementById(
                    sectionId
                );

        }


        /* ================================================
           SHOW SELECTED BATCH SECTION
           ================================================ */

        if (selectedSection) {

            selectedSection.style.display =
                "block";

            selectedSection.classList.add(
                "active"
            );


            if (comingSoon) {

                comingSoon.hidden =
                    true;

            }

        }

        else {

            if (comingSoon) {

                comingSoon.hidden =
                    false;

            }

        }


        /* ================================================
           SHOW CLASS DETAIL PAGE
           ================================================ */

        detailPage.style.display =
            "flex";

        detailPage.classList.add(
            "active"
        );

        detailPage.setAttribute(
            "aria-hidden",
            "false"
        );


        /* ================================================
           STUDY PAGE HIDDEN
           ================================================ */

        studyPage.classList.add(
            "class-page-hidden"
        );


        /* ================================================
           RESET BATCH SEARCH
           ================================================ */

        if (
            typeof window.keduResetBatchSearch ===
            "function"
        ) {

            window.keduResetBatchSearch();

        }


        /* ================================================
           RESET SORT
           ================================================ */

        if (
            typeof window.keduCloseSort ===
            "function"
        ) {

            window.keduCloseSort();

        }


        /* ================================================
           SCROLL TO TOP
           ================================================ */

        const content =
            document.getElementById(
                "class-detail-content"
            );

        if (content) {

            content.scrollTop = 0;

        }


        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });


        setStudyActive();

    }


    /* =====================================================
       CLOSE CLASS → CLASS CARDS
       ===================================================== */

    function closeClass() {

        detailPage.style.display =
            "none";

        detailPage.classList.remove(
            "active"
        );

        detailPage.setAttribute(
            "aria-hidden",
            "true"
        );


        sections.forEach(
            function (section) {

                section.classList.remove(
                    "active"
                );

                section.style.display =
                    "none";

            }
        );


        studyPage.style.display =
            "block";

        studyPage.classList.remove(
            "class-page-hidden"
        );

        studyPage.classList.add(
            "active"
        );

        studyPage.setAttribute(
            "aria-hidden",
            "false"
        );


        setStudyActive();


        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant"
        });

    }


    /* =====================================================
       CLASS CARD CLICK
       ===================================================== */

    cards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function (event) {

                    /* Do not treat a favourite button
                       as a class-card click */

                    if (
                        event.target.closest(
                            ".study-card-favourite"
                        ) ||
                        event.target.closest(
                            ".study-favourite-btn"
                        )
                    ) {

                        return;

                    }


                    event.preventDefault();
                    event.stopPropagation();


                    openClass(card);

                }
            );

        }
    );


    /* =====================================================
       BACK BUTTON
       ===================================================== */

    if (backButton) {

        backButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                closeClass();

            }
        );

    }


    /* =====================================================
       PUBLIC FUNCTIONS
       ===================================================== */

    window.keduOpenClass =
        openClass;

    window.keduCloseClass =
        closeClass;

    window.keduSetStudyActive =
        setStudyActive;


    /* =====================================================
       INITIAL STATE
       ===================================================== */

    setStudyActive();

});