/* =========================================
   KEDU PW — FAVORITE BATCH SYSTEM
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const STORAGE_KEY =
            "keduPWFavoriteBatches";


        const favoriteList =
            document.getElementById(
                "favorite-batch-list"
            );


        const favoriteEmpty =
            document.getElementById(
                "favorite-empty"
            );


        const favoriteSearch =
            document.getElementById(
                "favorite-search-input"
            );


        function getFavorites() {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        STORAGE_KEY
                    )
                ) || [];

            } catch {

                return [];

            }

        }


        function saveFavorites(
            favorites
        ) {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    favorites
                )
            );

        }


        function getBatchCards() {

            return Array.from(
                document.querySelectorAll(
                    ".batch-card[data-batch]"
                )
            );

        }


        function updateCardState(
            card,
            active
        ) {

            if (!card) {
                return;
            }

            const button =
                card.querySelector(
                    ".batch-favourite-btn"
                );

            if (!button) {
                return;
            }

            button.classList.toggle(
                "active",
                active
            );

            button.setAttribute(
                "aria-pressed",
                active
                    ? "true"
                    : "false"
            );

        }


        function toggleFavorite(
            card
        ) {

            if (!card) {
                return;
            }

            const id =
                card.dataset.batch;

            if (!id) {
                return;
            }

            let favorites =
                getFavorites();


            const exists =
                favorites.includes(id);


            if (exists) {

                favorites =
                    favorites.filter(
                        item =>
                            item !== id
                    );

                updateCardState(
                    card,
                    false
                );

                showToast(
                    "Removed From Favorite"
                );

            } else {

                favorites.push(
                    id
                );

                updateCardState(
                    card,
                    true
                );

                showToast(
                    "Added To Favorite"
                );

            }


            saveFavorites(
                favorites
            );


            renderFavoritePage();

        }


        function showToast(
            message
        ) {

            if (
                typeof window.keduToast ===
                "function"
            ) {

                window.keduToast(
                    message
                );

            }

        }


        function restoreFavoriteStates() {

            const favorites =
                getFavorites();


            getBatchCards()
                .forEach(
                    card => {

                        const id =
                            card.dataset.batch;

                        updateCardState(
                            card,
                            favorites.includes(
                                id
                            )
                        );

                    }
                );

        }


        function createFavoriteCard(
            originalCard
        ) {

            const clone =
                originalCard.cloneNode(
                    true
                );


            const id =
                originalCard.dataset.batch;


            const button =
                clone.querySelector(
                    ".batch-favourite-btn"
                );


            if (button) {

                button.classList.add(
                    "active"
                );


                button.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        event.stopPropagation();


                        const original =
                            document.querySelector(
                                `.batch-card[data-batch="${id}"]`
                            );


                        if (original) {

                            toggleFavorite(
                                original
                            );

                        }

                    }
                );

            }


            return clone;

        }


        function renderFavoritePage() {

            if (
                !favoriteList ||
                !favoriteEmpty
            ) {
                return;
            }


            favoriteList.innerHTML =
                "";


            const favorites =
                getFavorites();


            const cards =
                getBatchCards();


            let count = 0;


            cards.forEach(
                card => {

                    const id =
                        card.dataset.batch;


                    if (
                        !id ||
                        !favorites.includes(
                            id
                        )
                    ) {
                        return;
                    }


                    const clone =
                        createFavoriteCard(
                            card
                        );


                    favoriteList.appendChild(
                        clone
                    );


                    count++;

                }
            );


            favoriteEmpty.classList.toggle(
                "hidden",
                count > 0
            );


            favoriteList.style.display =
                count > 0
                    ? ""
                    : "none";


            filterFavoriteCards();

        }


        function filterFavoriteCards() {

            if (!favoriteList) {
                return;
            }


            const query =
                favoriteSearch
                    ? favoriteSearch.value
                        .trim()
                        .toLowerCase()
                    : "";


            const cards =
                favoriteList.querySelectorAll(
                    ".batch-card"
                );


            let visibleCount = 0;


            cards.forEach(
                card => {

                    const text =
                        card.textContent
                            .trim()
                            .toLowerCase();


                    const match =
                        !query ||
                        text.includes(
                            query
                        );


                    card.style.display =
                        match
                            ? ""
                            : "none";


                    if (match) {
                        visibleCount++;
                    }

                }
            );


            if (
                favoriteEmpty &&
                getFavorites().length > 0
            ) {

                favoriteEmpty.classList.toggle(
                    "hidden",
                    visibleCount > 0
                );

            }

        }


        document
            .querySelectorAll(
                ".batch-favourite-btn"
            )
            .forEach(
                button => {

                    /*
                       Remove any old
                       onclick handler
                       from app.js.
                    */

                    button.onclick =
                        null;


                    button.addEventListener(
                        "click",
                        event => {

                            event.preventDefault();

                            event.stopPropagation();


                            const card =
                                button.closest(
                                    ".batch-card"
                                );


                            toggleFavorite(
                                card
                            );

                        }
                    );

                }
            );


        favoriteSearch?.addEventListener(
            "input",
            filterFavoriteCards
        );


        window.keduRenderFavorites =
            renderFavoritePage;


        window.keduIsFavorite =
            id =>
                getFavorites().includes(
                    id
                );


        restoreFavoriteStates();

        renderFavoritePage();

    }
);