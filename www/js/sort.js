/* =========================================
   KEDU PW — BATCH SORT
   Default / A-Z / Z-A / Favourites First
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const sortButton =
        document.getElementById(
            "batch-sort-button"
        );

    const sortSheet =
        document.getElementById(
            "sort-sheet"
        );

    const sortOverlay =
        document.getElementById(
            "sort-overlay"
        );

    const sortOptions =
        document.querySelectorAll(
            ".sort-option"
        );

    if (
        !sortButton ||
        !sortSheet
    ) {
        return;
    }

    const originalOrders =
        new WeakMap();

    function getActiveSection() {

        return document.querySelector(
            ".batches-section.active"
        );

    }

    function saveOriginalOrder(
        section
    ) {

        if (
            !section ||
            originalOrders.has(section)
        ) {
            return;
        }

        originalOrders.set(
            section,
            Array.from(
                section.querySelectorAll(
                    ".batch-card"
                )
            )
        );

    }

    function openSortSheet() {

        const section =
            getActiveSection();

        saveOriginalOrder(
            section
        );

        sortSheet.classList.add(
            "active"
        );

        sortSheet.setAttribute(
            "aria-hidden",
            "false"
        );

        if (sortOverlay) {

            sortOverlay.classList.add(
                "active"
            );

        }

        sortButton.classList.add(
            "active"
        );

        sortButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }

    function closeSortSheet() {

        sortSheet.classList.remove(
            "active"
        );

        sortSheet.setAttribute(
            "aria-hidden",
            "true"
        );

        if (sortOverlay) {

            sortOverlay.classList.remove(
                "active"
            );

        }

        sortButton.classList.remove(
            "active"
        );

        sortButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

    function getCards(section) {

        return Array.from(
            section.querySelectorAll(
                ".batch-card"
            )
        );

    }

    function sortCards(
        type
    ) {

        const section =
            getActiveSection();

        if (!section) {
            return;
        }

        saveOriginalOrder(
            section
        );

        const original =
            originalOrders.get(
                section
            ) || [];

        let cards =
            getCards(section);

        if (type === "default") {

            original.forEach(card => {

                section.appendChild(
                    card
                );

            });

        } else {

            cards.sort(
                (a, b) => {

                    const aTitle =
                        a.querySelector(
                            ".batch-title"
                        )
                        ?.textContent
                        .trim()
                        .toLowerCase() || "";

                    const bTitle =
                        b.querySelector(
                            ".batch-title"
                        )
                        ?.textContent
                        .trim()
                        .toLowerCase() || "";

                    if (type === "za") {

                        return bTitle.localeCompare(
                            aTitle
                        );

                    }

                    if (
                        type ===
                        "favourites"
                    ) {

                        const aFav =
                            a.classList.contains(
                                "favourite"
                            );

                        const bFav =
                            b.classList.contains(
                                "favourite"
                            );

                        if (
                            aFav !== bFav
                        ) {

                            return aFav
                                ? -1
                                : 1;

                        }

                        return 0;

                    }

                    return aTitle.localeCompare(
                        bTitle
                    );

                }
            );

            cards.forEach(card => {

                section.appendChild(
                    card
                );

            });

        }

        if (
            typeof window.keduUpdateBatchSearch ===
            "function"
        ) {

            window.keduUpdateBatchSearch();

        }

        showToast(
            getSortMessage(type)
        );

    }

    function getSortMessage(type) {

        switch (type) {

            case "az":
                return "Batches Sorted A–Z";

            case "za":
                return "Batches Sorted Z–A";

            case "favourites":
                return "Favourites First";

            default:
                return "Default Order Restored";

        }

    }

    function setSelectedOption(
        selected
    ) {

        sortOptions.forEach(option => {

            option.classList.toggle(
                "active",
                option === selected
            );

        });

    }

    function showToast(message) {

        if (
            typeof window.keduToast ===
            "function"
        ) {

            window.keduToast(
                message
            );

        }

    }

    sortButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            if (
                sortSheet.classList.contains(
                    "active"
                )
            ) {

                closeSortSheet();

            } else {

                openSortSheet();

            }

        }
    );

    if (sortOverlay) {

        sortOverlay.addEventListener(
            "click",
            closeSortSheet
        );

    }

    sortOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                const type =
                    option.dataset.sort ||
                    "default";

                setSelectedOption(
                    option
                );

                sortCards(
                    type
                );

                closeSortSheet();

            }
        );

    });

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sortSheet.classList.contains(
                    "active"
                )
            ) {

                closeSortSheet();

            }

        }
    );

    window.keduCloseSort =
        closeSortSheet;

});