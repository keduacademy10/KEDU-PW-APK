/* =========================================
   KEDU PW — BATCH SEARCH SYSTEM
   New Batch Structure
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput =
        document.getElementById("batch-search-input");

    function getActiveSection() {
        return document.querySelector(
            ".batches-section.active"
        );
    }

    function getCards() {

        const section = getActiveSection();

        if (!section) {
            return [];
        }

        return Array.from(
            section.querySelectorAll(".batch-card")
        );
    }

    function filterCards() {

        const query =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";

        getCards().forEach(card => {

            const searchableText =
                card.textContent
                    .trim()
                    .toLowerCase();

            const matches =
                !query ||
                searchableText.includes(query);

            card.style.display =
                matches ? "" : "none";

        });

        updateComingSoonState();
    }

    function updateComingSoonState() {

        const section = getActiveSection();

        const comingSoon =
            document.getElementById(
                "batches-coming-soon"
            );

        if (!section || !comingSoon) {
            return;
        }

        const cards =
            Array.from(
                section.querySelectorAll(".batch-card")
            );

        const visibleCards =
            cards.filter(card => {
                return card.style.display !== "none";
            });

        const hasCards =
            cards.length > 0;

        const hasVisibleCards =
            visibleCards.length > 0;

        if (!hasCards) {
            comingSoon.hidden = false;
            return;
        }

        if (!hasVisibleCards) {
            comingSoon.hidden = false;
        } else {
            comingSoon.hidden = true;
        }
    }

    function resetSearch() {

        if (searchInput) {
            searchInput.value = "";
        }

        getCards().forEach(card => {
            card.style.display = "";
        });

        updateComingSoonState();
    }

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterCards
        );

    }

    window.keduFilterBatches =
        filterCards;

    window.keduResetBatchSearch =
        resetSearch;

    window.keduUpdateBatchSearch =
        updateComingSoonState;

});