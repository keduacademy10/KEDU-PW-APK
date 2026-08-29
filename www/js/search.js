/* =========================================================
   KEDU PW — BATCH SEARCH
   ========================================================= */

"use strict";


/* =========================================================
   ELEMENTS
   ========================================================= */

const batchSearchInput =
    document.getElementById(
        "batch-search-input"
    );

const batchSearchClear =
    document.getElementById(
        "batch-search-clear"
    );

const studyBatchesContainer =
    document.getElementById(
        "study-batches-container"
    );


/* =========================================================
   NORMALIZE SEARCH
   Same basic idea as KEDU Academy search
   ========================================================= */

function normalizeBatchSearch(text){

    return String(text || "")
        .toLowerCase()
        .replace(/\s+/g,"")
        .replace(/[^a-z0-9]/g,"");

}


/* =========================================================
   FUZZY MATCH
   ========================================================= */

function batchFuzzyMatch(
    text,
    keyword
){

    const normalizedText =
        normalizeBatchSearch(text);

    const normalizedKeyword =
        normalizeBatchSearch(keyword);


    if(
        !normalizedText ||
        !normalizedKeyword
    ){

        return false;

    }


    /* Exact / contains */

    if(
        normalizedText.includes(
            normalizedKeyword
        )
    ){

        return true;

    }


    /*
     * Small typo tolerance.
     *
     * Example:
     * udaaan → udaan
     */

    if(
        normalizedKeyword.length >= 4 &&
        normalizedText.startsWith(
            normalizedKeyword.slice(0,-1)
        )
    ){

        return true;

    }


    return false;

}


/* =========================================================
   HIGHLIGHT SEARCH TEXT
   ========================================================= */

function highlightBatchSearchText(
    element,
    keyword
){

    if(!element){
        return;
    }


    const originalText =
        element.dataset.originalText ||
        element.textContent;


    if(
        !element.dataset.originalText
    ){

        element.dataset.originalText =
            originalText;

    }


    if(
        !keyword ||
        keyword.trim().length < 1
    ){

        element.textContent =
            originalText;

        return;

    }


    const escaped =
        keyword.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );


    const regex =
        new RegExp(
            `(${escaped})`,
            "ig"
        );


    /*
     * Only highlight the actual
     * typed text.
     *
     * If fuzzy matching succeeds
     * through typo tolerance, we
     * simply keep the normal title.
     */

    if(
        !originalText.match(regex)
    ){

        element.textContent =
            originalText;

        return;

    }


    element.innerHTML =
        originalText.replace(
            regex,
            `<span class="batch-search-highlight">$1</span>`
        );

}


/* =========================================================
   GET ALL BATCH CARDS
   ========================================================= */

function getAllBatchCards(){

    if(!studyBatchesContainer){

        return [];

    }


    return Array.from(
        studyBatchesContainer.querySelectorAll(
            ".batch-card"
        )
    );

}


/* =========================================================
   EMPTY STATE
   ========================================================= */

function getBatchSearchEmptyState(){

    let empty =
        document.getElementById(
            "batch-search-empty"
        );


    if(empty){

        return empty;

    }


    empty =
        document.createElement(
            "div"
        );


    empty.id =
        "batch-search-empty";

    empty.className =
        "batch-search-empty";


    empty.innerHTML = `

        <div class="batch-search-empty-icon">

            <span class="material-symbols-rounded">
                search_off
            </span>

        </div>

        <h3>
            No Batches Found
        </h3>

        <p>
            Try searching with another batch name.
        </p>

    `;


    if(
        studyBatchesContainer
    ){

        studyBatchesContainer.appendChild(
            empty
        );

    }


    return empty;

}


/* =========================================================
   SEARCH BATCHES
   ========================================================= */

function searchBatches(){

    if(!batchSearchInput){

        return;

    }


    const keyword =
        batchSearchInput.value.trim();


    const cards =
        getAllBatchCards();


    let visibleCount = 0;


    cards.forEach(
        card => {

            const titleElement =
                card.querySelector(
                    ".batch-title"
                );


            if(!titleElement){

                return;

            }


            const batchTitle =
                titleElement.dataset.originalText ||
                titleElement.textContent.trim();


            /*
             * Restore original title
             * before every search.
             */

            titleElement.textContent =
                batchTitle;


            if(!keyword){

                card.classList.remove(
                    "batch-search-hidden"
                );

                visibleCount++;

                return;

            }


            const matched =
                batchFuzzyMatch(
                    batchTitle,
                    keyword
                );


            if(matched){

                card.classList.remove(
                    "batch-search-hidden"
                );

                highlightBatchSearchText(
                    titleElement,
                    keyword
                );

                visibleCount++;

            }else{

                card.classList.add(
                    "batch-search-hidden"
                );

            }

        }
    );


    /*
     * Clear button
     */

    if(batchSearchClear){

        batchSearchClear.hidden =
            keyword.length === 0;

    }


    /*
     * Empty state
     */

    const empty =
        getBatchSearchEmptyState();


    if(
        keyword &&
        visibleCount === 0
    ){

        empty.style.display =
            "block";

    }else{

        empty.style.display =
            "none";

    }

}


/* =========================================================
   INPUT EVENT
   ========================================================= */

batchSearchInput?.addEventListener(
    "input",
    searchBatches
);


/* =========================================================
   CLEAR SEARCH
   ========================================================= */

batchSearchClear?.addEventListener(
    "click",
    ()=>{

        if(!batchSearchInput){

            return;

        }


        batchSearchInput.value = "";


        searchBatches();


        batchSearchInput.focus();

    }
);


/* =========================================================
   ESCAPE KEY
   ========================================================= */

batchSearchInput?.addEventListener(
    "keydown",
    event => {

        if(
            event.key === "Escape"
        ){

            batchSearchInput.value =
                "";

            searchBatches();

        }

    }
);


/* =========================================================
   RESET SEARCH WHEN CLASS PAGE OPENS
   ========================================================= */

function resetBatchSearch(){

    if(!batchSearchInput){

        return;

    }


    batchSearchInput.value =
        "";

    searchBatches();

}


/*
 * Make the function available
 * to other KEDU PW files.
 */

window.resetBatchSearch =
    resetBatchSearch;


/* =========================================================
   INITIALIZE
   ========================================================= */

searchBatches();