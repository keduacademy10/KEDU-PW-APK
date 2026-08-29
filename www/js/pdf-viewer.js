/* ========================================================= */
/* KEDU ACADEMY                                             */
/* PDF VIEWER                                                */
/* ========================================================= */

let currentPdfAttachment = null;
let pdfLoadToken = 0;
let activePdfRenderTask = null;
let currentPdfDocument = null;

let previousPdfPageId = null;
let previousPdfPageDisplay = "";
/* ========================================================= */
/* EMBEDDED PDF — LECTURE PLAYER                             */
/* ========================================================= */

let pdfEmbeddedInLecturePlayer =
    false;

let pdfOriginalParent =
    null;

let pdfOriginalNextSibling =
    null;
/* ========================================================= */
/* OPEN PDF VIEWER                                            */
/* ========================================================= */

function openPdfViewer(attachment){

    if(!attachment){
        return;
    }

    const page =
        document.getElementById(
            "pdf-viewer-page"
        );

    const frame =
        document.getElementById(
            "pdf-document-frame"
        );

    const title =
        document.getElementById(
            "pdf-viewer-title"
        );

    const counter =
        document.getElementById(
            "pdf-page-counter"
        );

    if(!page || !frame){
        console.error(
            "KEDU: PDF viewer elements missing."
        );

        return;
    }

    currentPdfAttachment =
        attachment;

    if(title){

        title.textContent =
            attachment.title ||
            "PDF";

    }

    if(counter){

        counter.textContent =
            "1/1";

    }

const attachmentId =
    String(
        attachment.id ||
        attachment.attachmentId ||
        ""
    ).trim();


/*
 * =====================================================
 * KEDU TEST PDF
 * =====================================================
 *
 * During testing, every downloaded material
 * can open the same temporary PDF.
 *
 * If a downloaded PDF provides attachment.file,
 * that file is used first.
 */

const KEDU_PDF_TEST_PATH =
    "assets/pdf/lecture-notes/lecture-notes.pdf";


const pdfPath =
    attachment.file ||
    KEDU_PDF_TEST_PATH;
/*
 * Remember the page from which
 * the PDF viewer was opened.
 */
const previousPage =
    document.querySelector(
        ".page.active:not(#pdf-viewer-page)"
    );

if(previousPage){
    previousPdfPageId =
        previousPage.id;

    previousPdfPageDisplay =
        previousPage.style.display;
}

/* ========================================================= */
/* LECTURE PLAYER EMBEDDED MODE                              */
/* ========================================================= */

pdfEmbeddedInLecturePlayer =
    attachment.__openInsideLecturePlayer === true;


if(pdfEmbeddedInLecturePlayer){

    const lecturePlayerPage =
        document.getElementById(
            "lecture-player-page"
        );

    const lectureVideoSection =
        document.getElementById(
            "lecture-player-video-section"
        );


    if(
        lecturePlayerPage &&
        lectureVideoSection
    ){

        /*
         * Remember original PDF page location.
         */

        if(
            !pdfOriginalParent
        ){

            pdfOriginalParent =
                page.parentElement;

            pdfOriginalNextSibling =
                page.nextSibling;

        }


        /*
         * Move PDF viewer directly
         * below the portrait video.
         */

        lectureVideoSection.insertAdjacentElement(
            "afterend",
            page
        );


        /*
         * Hide all lecture-player
         * content except video + PDF.
         */

        Array.from(
            lecturePlayerPage.children
        ).forEach(
            child => {

                if(
                    child !==
                        lectureVideoSection &&
                    child !==
                        page
                ){

                    child.classList.add(
                        "pdf-lecture-hidden"
                    );

                }

            }
        );


        lecturePlayerPage.classList.add(
            "pdf-lecture-player-mode"
        );


        page.classList.add(
            "pdf-viewer-embedded"
        );


        page.classList.add(
            "active"
        );


        page.style.display =
            "block";


        /*
         * Keep lecture player as
         * the active application page.
         */

        lecturePlayerPage.classList.add(
            "active"
        );


        document.body.style.overflow =
            "hidden";

    }

}
else{

    /*
     * NORMAL FULL PDF VIEWER
     */

    document
        .querySelectorAll(
            ".page"
        )
        .forEach(
            currentPage => {

                currentPage.classList.remove(
                    "active"
                );

                currentPage.style.display =
                    "none";

            }
        );


    page.classList.add(
        "active"
    );


    page.style.display =
        "block";


    document.body.style.overflow =
        "hidden";

}
    /*
     * Hide native iframe.
     */
    frame.style.display =
        "none";

    let pdfCanvas =
        document.getElementById(
            "kedu-pdf-canvas"
        );

    if(!pdfCanvas){

        pdfCanvas =
            document.createElement(
                "canvas"
            );

        pdfCanvas.id =
            "kedu-pdf-canvas";

        frame.parentNode.appendChild(
            pdfCanvas
        );

    }

    pdfCanvas.style.display =
        "block";

    document.body.classList.add(
        "pdf-viewer-open"
    );

    console.log(
        "KEDU: PDF Viewer opened:",
        attachment.title,
        pdfPath
    );
const pdfContainer =
    document.getElementById(
        "pdf-document-container"
    );

pdfZoomScale =
    1;

if(pdfContainer){

    pdfContainer.style.zoom =
        "1";

    pdfContainer.style.transform =
        "none";

    pdfContainer.style.transformOrigin =
        "top left";

    pdfContainer.style.width =
        "100%";

    pdfContainer.style.minHeight =
        "";

}

const pdfViewerContent =
    document.getElementById(
        "pdf-viewer-content"
    );

if(pdfViewerContent){

    pdfViewerContent.style.touchAction =
    "pan-x pan-y pinch-zoom";

}

loadKeduPdf(
    pdfPath
);
requestAnimationFrame(
    () => {

        requestAnimationFrame(
            () => {

                updatePdfPageCounter();

            }
        );

    }
);
}
/* ========================================================= */
/* CLOSE PDF VIEWER                                           */
/* ========================================================= */

function closePdfViewer(){

    const page =
        document.getElementById(
            "pdf-viewer-page"
        );

    const frame =
        document.getElementById(
            "pdf-document-frame"
        );
    /* ===================================================== */
    /* CLOSE EMBEDDED LECTURE PDF                            */
    /* ===================================================== */

    if(
        pdfEmbeddedInLecturePlayer
    ){

        const lecturePlayerPage =
            document.getElementById(
                "lecture-player-page"
            );


        /*
         * Restore hidden lecture sections.
         */

        lecturePlayerPage
            ?.querySelectorAll(
                ".pdf-lecture-hidden"
            )
            .forEach(
                element => {

                    element.classList.remove(
                        "pdf-lecture-hidden"
                    );

                }
            );


        /*
         * Remove embedded mode.
         */

        lecturePlayerPage
            ?.classList.remove(
                "pdf-lecture-player-mode"
            );


        page?.classList.remove(
            "pdf-viewer-embedded"
        );


        page?.classList.remove(
            "active"
        );


        page.style.display =
            "none";


        /*
         * Put PDF viewer back where
         * it originally belonged.
         */

        if(
            pdfOriginalParent
        ){

            if(
                pdfOriginalNextSibling &&
                pdfOriginalNextSibling.parentNode ===
                    pdfOriginalParent
            ){

                pdfOriginalParent.insertBefore(
                    page,
                    pdfOriginalNextSibling
                );

            }
            else{

                pdfOriginalParent.appendChild(
                    page
                );

            }

        }


        pdfEmbeddedInLecturePlayer =
            false;

        pdfOriginalParent =
            null;

        pdfOriginalNextSibling =
            null;


        currentPdfAttachment =
            null;


        document.body.classList.remove(
            "pdf-viewer-open"
        );


        /*
         * Lecture player remains open.
         */

        document.body.style.overflow =
            "hidden";


        return;

    }
    if(frame){
        frame.src = "";
    }

    if(page){
        page.classList.remove(
            "active"
        );

        page.style.display =
            "none";
    }

    /*
     * Restore the exact page from
     * which the PDF was opened.
     */
    if(previousPdfPageId){

        const previousPage =
            document.getElementById(
                previousPdfPageId
            );

        if(previousPage){

            previousPage.classList.add(
                "active"
            );

            previousPage.style.display =
                previousPdfPageDisplay ||
                "block";
        }
    }

    document.body.classList.remove(
        "pdf-viewer-open"
    );

    currentPdfAttachment = null;

    previousPdfPageId = null;
    previousPdfPageDisplay = "";
}

/* ========================================================= */
/* HEADER BACK BUTTON                                         */
/* ========================================================= */

document.addEventListener("click", event => {

    const backButton =
        event.target.closest("#pdf-viewer-back");

    if(!backButton){
        return;
    }

    /*
     * Close PDF viewer and return
     * to the attachment page.
     */
    closePdfViewer();

});

/* ========================================================= */
/* PDF MENU                                                    */
/* ========================================================= */

document.addEventListener("click", event => {

    const menuButton =
        event.target.closest("#pdf-viewer-menu");

    if(!menuButton){
        return;
    }

    document
        .getElementById("pdf-menu-sheet")
        ?.classList.toggle("active");

});
/* ========================================================= */
/* PDF MENU — OUTSIDE TAP                                     */
/* ========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        const menuSheet =
            document.getElementById(
                "pdf-menu-sheet"
            );


        const menuButton =
            document.getElementById(
                "pdf-viewer-menu"
            );


        if(
            !menuSheet ||
            !menuSheet.classList.contains(
                "active"
            )
        ){
            return;
        }


        if(
            menuSheet.contains(
                event.target
            )
        ){
            return;
        }


        if(
            menuButton?.contains(
                event.target
            )
        ){
            return;
        }


        menuSheet.classList.remove(
            "active"
        );

    }
);

/* ========================================================= */
/* EDIT TOOLS BUTTON                                          */
/* ========================================================= */

document.addEventListener("click", event => {

    const toolsButton =
        event.target.closest("#pdf-tools-button");

    if(!toolsButton){
        return;
    }

    const editSheet =
        document.getElementById(
            "pdf-edit-sheet"
        );

    const icon =
        toolsButton.querySelector(
            ".material-symbols-rounded"
        );

    if(!editSheet || !icon){
        return;
    }

    const isOpen =
        editSheet.classList.toggle(
            "active"
        );

    icon.textContent =
    isOpen
        ? "close"
        : "menu";

});
/* ========================================================= */
/* PDF EDIT TOOLS — OUTSIDE TAP                               */
/* ========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        const editSheet =
            document.getElementById(
                "pdf-edit-sheet"
            );


        const toolsButton =
            document.getElementById(
                "pdf-tools-button"
            );


        if(
            !editSheet ||
            !editSheet.classList.contains(
                "active"
            )
        ){
            return;
        }


        if(
            editSheet.contains(
                event.target
            )
        ){
            return;
        }


        if(
            toolsButton?.contains(
                event.target
            )
        ){
            return;
        }


        editSheet.classList.remove(
            "active"
        );


        const icon =
            toolsButton?.querySelector(
                ".material-symbols-rounded"
            );


        if(icon){

            icon.textContent =
                "menu";

        }

    }
);
/* ========================================================= */
/* PDF MARKING TOOLS                                         */
/* ========================================================= */

let activePdfTool = null;
let isPdfDrawing = false;
let lastPdfPoint = null;
let activePdfAnnotationCanvas = null;
/* ========================================================= */
/* KEDU PDF — FULL PAGE PINCH ZOOM ENGINE                    */
/* ========================================================= */

let pdfZoomScale = 1;

let pdfPinchActive =
    false;

let pdfPinchStartDistance =
    0;

let pdfPinchStartZoom =
    1;

let pdfPinchLastZoom =
    1;

let pdfZoomFrame =
    null;

const PDF_MIN_ZOOM =
    1;

const PDF_MAX_ZOOM =
    5;


/* ========================================================= */
/* ZOOM CLAMP                                                 */
/* ========================================================= */

function clampPdfZoom(
    zoom
){

    const value =
        Number(
            zoom
        );

    if(
        !Number.isFinite(
            value
        )
    ){

        return PDF_MIN_ZOOM;

    }

    return Math.min(
        PDF_MAX_ZOOM,
        Math.max(
            PDF_MIN_ZOOM,
            value
        )
    );

}


/* ========================================================= */
/* TWO FINGER DISTANCE                                        */
/* ========================================================= */

function getPdfPinchDistance(
    touchA,
    touchB
){

    const dx =
        touchB.clientX -
        touchA.clientX;

    const dy =
        touchB.clientY -
        touchA.clientY;

    return Math.hypot(
        dx,
        dy
    );

}


/* ========================================================= */
/* APPLY FULL PAGE ZOOM                                      */
/* ========================================================= */

function applyPdfZoom(
    requestedZoom,
    focusX = null,
    focusY = null
){

    const viewer =
        document.getElementById(
            "pdf-viewer-content"
        );

    const container =
        document.getElementById(
            "pdf-document-container"
        );

    if(
        !viewer ||
        !container
    ){

        return;

    }


    const oldZoom =
        pdfZoomScale;

    const newZoom =
        clampPdfZoom(
            requestedZoom
        );


    if(
        Math.abs(
            newZoom -
            oldZoom
        ) < 0.001
    ){

        return;

    }


    const viewerRect =
        viewer.getBoundingClientRect();


    const localFocusX =
        focusX === null
            ? viewerRect.width / 2
            : focusX -
              viewerRect.left;


    const localFocusY =
        focusY === null
            ? viewerRect.height / 2
            : focusY -
              viewerRect.top;


    /*
     * Save the exact PDF position
     * underneath the fingers.
     */

    const documentX =
        (
            viewer.scrollLeft +
            localFocusX
        ) / oldZoom;


    const documentY =
        (
            viewer.scrollTop +
            localFocusY
        ) / oldZoom;


    pdfZoomScale =
        newZoom;


    /*
     * Zoom EVERY PDF PAGE.
     *
     * This is the important change.
     * The complete page becomes a real
     * enlarged scrolling area.
     */

    container
        .querySelectorAll(
            ".pdf-page-layer"
        )
        .forEach(
            pageLayer => {

                pageLayer.style.zoom =
                    String(
                        pdfZoomScale
                    );

            }
        );


    /*
     * Wait for browser to recalculate
     * the new scroll dimensions.
     */

    if(pdfZoomFrame){

        cancelAnimationFrame(
            pdfZoomFrame
        );

    }


    pdfZoomFrame =
        requestAnimationFrame(
            () => {

                const newScrollLeft =
                    (
                        documentX *
                        pdfZoomScale
                    ) -
                    localFocusX;


                const newScrollTop =
                    (
                        documentY *
                        pdfZoomScale
                    ) -
                    localFocusY;


                viewer.scrollLeft =
                    Math.max(
                        0,
                        newScrollLeft
                    );


                viewer.scrollTop =
                    Math.max(
                        0,
                        newScrollTop
                    );


                updatePdfPageCounter();
requestAnimationFrame(
    () => {
        updatePdfPageCounter();
    }
);
                pdfZoomFrame =
                    null;

            }
        );

}


/* ========================================================= */
/* PINCH START                                                */
/* ========================================================= */

function startPdfPinch(
    event
){

    const viewer =
        document.getElementById(
            "pdf-viewer-content"
        );

    if(
        !viewer ||
        !viewer.contains(
            event.target
        )
    ){

        return;

    }


    if(
        event.touches.length !== 2
    ){

        return;

    }


/* ========================================================= */
/* START PINCH ZOOM                                          */
/* ========================================================= */

event.preventDefault();

/*
 * Two-finger gesture always belongs
 * to PDF zoom, never to an editor tool.
 */
pdfPinchActive =
    true;

isPdfDrawing =
    false;

pdfShapeDragging =
    false;

pdfShapeMoved =
    false;

pdfTextDragging =
    false;

pdfSelectedTextObject =
    null;

selectedPdfShape =
    null;

lastPdfPoint =
    null;

    pdfPinchStartDistance =
        getPdfPinchDistance(
            event.touches[0],
            event.touches[1]
        );


    pdfPinchStartZoom =
        pdfZoomScale;


    pdfPinchLastZoom =
        pdfZoomScale;


    /*
     * Two-finger midpoint.
     */

    pdfPinchFocusX =
        (
            event.touches[0].clientX +
            event.touches[1].clientX
        ) / 2;


    pdfPinchFocusY =
        (
            event.touches[0].clientY +
            event.touches[1].clientY
        ) / 2;


    /*
     * Disable drawing while
     * pinch zoom is active.
     */

    isPdfDrawing =
        false;

    lastPdfPoint =
        null;

}


/* ========================================================= */
/* PINCH MOVE                                                 */
/* ========================================================= */

function movePdfPinch(
    event
){

    if(
        !pdfPinchActive
    ){

        return;

    }


    if(
        event.touches.length !== 2
    ){

        return;

    }


    event.preventDefault();


    const currentDistance =
        getPdfPinchDistance(
            event.touches[0],
            event.touches[1]
        );


    if(
        pdfPinchStartDistance <= 0
    ){

        return;

    }


    /*
     * Finger distance controls
     * zoom level.
     */

    const zoomRatio =
        currentDistance /
        pdfPinchStartDistance;


    const requestedZoom =
        pdfPinchStartZoom *
        zoomRatio;


    /*
     * Current finger midpoint.
     */

    const focusX =
        (
            event.touches[0].clientX +
            event.touches[1].clientX
        ) / 2;


    const focusY =
        (
            event.touches[0].clientY +
            event.touches[1].clientY
        ) / 2;


    /*
     * Avoid unnecessary DOM updates.
     */

    const clampedZoom =
        clampPdfZoom(
            requestedZoom
        );


    if(
        Math.abs(
            clampedZoom -
            pdfPinchLastZoom
        ) < 0.005
    ){

        return;

    }


    pdfPinchLastZoom =
        clampedZoom;


    applyPdfZoom(
        clampedZoom,
        focusX,
        focusY
    );

}


/* ========================================================= */
/* PINCH END                                                   */
/* ========================================================= */

function endPdfPinch(
    event
){

    if(
        event &&
        event.touches &&
        event.touches.length >= 2
    ){

        return;

    }


    pdfPinchActive =
        false;


    pdfPinchStartDistance =
        0;


    pdfPinchStartZoom =
        pdfZoomScale;


    pdfPinchLastZoom =
        pdfZoomScale;


    pdfPinchFocusX =
        0;


    pdfPinchFocusY =
        0;

}



/* ========================================================= */
/* TOUCH EVENTS — PDF VIEWER ONLY                              */
/* ========================================================= */

const pdfZoomViewer =
    document.getElementById(
        "pdf-viewer-content"
    );


if(pdfZoomViewer){

    pdfZoomViewer.addEventListener(
        "touchstart",
        startPdfPinch,
        {
            passive:false
        }
    );


    pdfZoomViewer.addEventListener(
        "touchmove",
        movePdfPinch,
        {
            passive:false
        }
    );


    pdfZoomViewer.addEventListener(
        "touchend",
        endPdfPinch,
        {
            passive:false
        }
    );


    pdfZoomViewer.addEventListener(
        "touchcancel",
        endPdfPinch,
        {
            passive:false
        }
    );

}
/* ========================================================= */
/* PDF EDITOR SETTINGS                                       */
/* ========================================================= */

let pdfEditorSize = 4;
let pdfEditorColor = "#0A1F5C";
let pdfEditorOpacity = 35;
/* ========================================================= */
/* PDF UNDO / REDO HISTORY                                    */
/* ========================================================= */

const pdfUndoHistory =
    new WeakMap();

const pdfRedoHistory =
    new WeakMap();

const PDF_HISTORY_LIMIT =
    30;
/* ========================================================= */
/* PDF HISTORY HELPERS                                        */
/* ========================================================= */

function getPdfHistoryStack(
    map,
    canvas
){

    if(!canvas){
        return [];
    }

    let stack =
        map.get(canvas);

    if(!stack){

        stack = [];

        map.set(
            canvas,
            stack
        );

    }

    return stack;
}


/* ========================================================= */
/* SAVE CANVAS STATE FOR UNDO                                  */
/* ========================================================= */

function savePdfUndoState(
    canvas
){

    if(!canvas){
        return;
    }

    const undoStack =
        getPdfHistoryStack(
            pdfUndoHistory,
            canvas
        );

    const redoStack =
        getPdfHistoryStack(
            pdfRedoHistory,
            canvas
        );

    try{

        undoStack.push(
            canvas
                .getContext("2d")
                .getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                )
        );

        if(
            undoStack.length >
            PDF_HISTORY_LIMIT
        ){

            undoStack.shift();

        }

        /* New edit removes redo states. */

        redoStack.length = 0;

    }
    catch(error){

        console.error(
            "KEDU: Unable to save PDF history.",
            error
        );

    }

}

/* ========================================================= */
/* PDF EDIT SAVE                                              */
/* ========================================================= */

function getPdfSaveKey(){

    if(!currentPdfAttachment){
        return null;
    }

    const pdfId =
        currentPdfAttachment.id ||
        currentPdfAttachment.file ||
        currentPdfAttachment.title ||
        "unknown";

    return (
        "kedu_pdf_edits_" +
        String(pdfId)
    );

}


function savePdfEdits(){

    const saveKey =
        getPdfSaveKey();

    if(!saveKey){
        return;
    }

    const pages = [];

    document
        .querySelectorAll(
            ".pdf-page-layer"
        )
        .forEach(
            pageLayer => {

                const annotationCanvas =
                    pageLayer.querySelector(
                        ".pdf-annotation-canvas"
                    );

                const shapeCanvas =
                    pageLayer.querySelector(
                        ".pdf-shape-canvas"
                    );

                const shapes =
                    shapeCanvas
                        ? (
                            pdfShapeObjects.get(
                                shapeCanvas
                            ) || []
                        ).map(
                            shape => ({
                                type:
                                    shape.type,

                                x:
                                    shape.x,

                                y:
                                    shape.y,

                                width:
                                    shape.width,

                                height:
                                    shape.height,

                                fill:
                                    shape.fill,

                                fillColor:
                                    shape.fillColor,

                                fillOpacity:
                                    shape.fillOpacity,

                                border:
                                    shape.border,

                                borderColor:
                                    shape.borderColor,

                                borderOpacity:
                                    shape.borderOpacity,

                                borderWidth:
                                    shape.borderWidth
                            })
                        )
                        : [];

                pages.push({

                    pageNumber:
                        Number(
                            pageLayer.dataset.pageNumber
                        ),

                    width:
                        annotationCanvas
                            ? annotationCanvas.width
                            : 0,

                    height:
                        annotationCanvas
                            ? annotationCanvas.height
                            : 0,

                    image:
                        annotationCanvas
                            ? annotationCanvas.toDataURL(
                                "image/png"
                            )
                            : null,

                    shapes

                });

            }
        );

    try{

        localStorage.setItem(
            saveKey,
            JSON.stringify({

                version: 2,

                pages

            })
        );

        console.log(
            "KEDU PDF edits saved with shapes."
        );

    }
    catch(error){

        console.error(
            "KEDU: Unable to save PDF edits.",
            error
        );

    }

}
/* ========================================================= */
/* RESTORE PDF EDITS                                         */
/* ========================================================= */

function restorePdfEdits(){

    const saveKey =
        getPdfSaveKey();

    if(!saveKey){
        return;
    }

    let savedData = null;

    try{

        const rawData =
            localStorage.getItem(
                saveKey
            );

        if(!rawData){
            return;
        }

        savedData =
            JSON.parse(
                rawData
            );

    }
    catch(error){

        console.error(
            "KEDU: Unable to read saved PDF edits.",
            error
        );

        return;

    }

    if(
        !savedData ||
        !Array.isArray(
            savedData.pages
        )
    ){
        return;
    }
selectedPdfShape =
    null;

pdfShapeDragging =
    false;

pdfShapeMoved =
    false;
    savedData.pages.forEach(
        savedPage => {

            const pageLayer =
                document.querySelector(
                    `.pdf-page-layer[data-page-number="${savedPage.pageNumber}"]`
                );

            if(!pageLayer){
                return;
            }

            const annotationCanvas =
                pageLayer.querySelector(
                    ".pdf-annotation-canvas"
                );

            const shapeCanvas =
                pageLayer.querySelector(
                    ".pdf-shape-canvas"
                );

            /*
             * Restore annotation image.
             */

            if(
                annotationCanvas &&
                savedPage.image
            ){

                const image =
                    new Image();

                image.onload = () => {

                    const context =
                        annotationCanvas.getContext(
                            "2d"
                        );

                    context.clearRect(
                        0,
                        0,
                        annotationCanvas.width,
                        annotationCanvas.height
                    );

                    context.drawImage(
                        image,
                        0,
                        0,
                        annotationCanvas.width,
                        annotationCanvas.height
                    );

                };

                image.src =
                    savedPage.image;

            }

            /*
             * Restore editable shapes.
             */

            if(
                shapeCanvas &&
                Array.isArray(
                    savedPage.shapes
                )
            ){

                const restoredShapes =
                    savedPage.shapes.map(
                        shape => ({
                            type:
                                shape.type,

                            x:
                                shape.x,

                            y:
                                shape.y,

                            width:
                                shape.width,

                            height:
                                shape.height,

                            fill:
                                Boolean(
                                    shape.fill
                                ),

                            fillColor:
                                shape.fillColor ||
                                "#0A1F5C",

                            fillOpacity:
                                Number(
                                    shape.fillOpacity ?? 35
                                ),

                            border:
                                Boolean(
                                    shape.border
                                ),

                            borderColor:
                                shape.borderColor ||
                                "#0A1F5C",

                            borderOpacity:
                                Number(
                                    shape.borderOpacity ?? 100
                                ),

                            borderWidth:
                                Number(
                                    shape.borderWidth ?? 3
                                )
                        })
                    );

                pdfShapeObjects.set(
                    shapeCanvas,
                    restoredShapes
                );

                redrawPdfShapes(
                    shapeCanvas
                );

            }

        }
    );

    console.log(
        "KEDU PDF edits restored."
    );

}
/* ========================================================= */
/* RESTORE CANVAS STATE                                       */
/* ========================================================= */

function restorePdfCanvasState(
    canvas,
    imageData
){

    if(
        !canvas ||
        !imageData
    ){
        return;
    }

    const context =
        canvas.getContext("2d");

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    context.putImageData(
        imageData,
        0,
        0
    );

}


/* ========================================================= */
/* PDF UNDO                                                    */
/* ========================================================= */

function undoPdfEdit(){

const canvas =
    activePdfAnnotationCanvas;

    if(!canvas){
        return;
    }

    const undoStack =
        getPdfHistoryStack(
            pdfUndoHistory,
            canvas
        );

    const redoStack =
        getPdfHistoryStack(
            pdfRedoHistory,
            canvas
        );

    if(!undoStack.length){
        return;
    }

    try{

        const currentState =
            canvas
                .getContext("2d")
                .getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

        redoStack.push(
            currentState
        );

        const previousState =
            undoStack.pop();

        restorePdfCanvasState(
            canvas,
            previousState
        );

    }
    catch(error){

        console.error(
            "KEDU: PDF undo failed.",
            error
        );

    }

}


/* ========================================================= */
/* PDF REDO                                                    */
/* ========================================================= */

function redoPdfEdit(){

const canvas =
    activePdfAnnotationCanvas;

    if(!canvas){
        return;
    }

    const redoStack =
        getPdfHistoryStack(
            pdfRedoHistory,
            canvas
        );

    const undoStack =
        getPdfHistoryStack(
            pdfUndoHistory,
            canvas
        );

    if(!redoStack.length){
        return;
    }

    try{

        const currentState =
            canvas
                .getContext("2d")
                .getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

        undoStack.push(
            currentState
        );

        const nextState =
            redoStack.pop();

        restorePdfCanvasState(
            canvas,
            nextState
        );

    }
    catch(error){

        console.error(
            "KEDU: PDF redo failed.",
            error
        );

    }

} 
/* ========================================================= */
/* PDF TEXT STATE                                             */
/* ========================================================= */

let pdfTextContent = "";

let pdfTextFontSize = 18;

let pdfTextFontFamily =
    "Arial";

let pdfTextBold = false;

let pdfTextItalic = false;

let pdfTextUnderline = false;

let pdfTextColor =
    "#0A1F5C";

let pdfActiveTextElement = null;
/* ========================================================= */
/* PDF TEXT OBJECTS                                           */
/* ========================================================= */

let pdfTextObjects = [];

let pdfSelectedTextObject = null;

let pdfTextDragOffsetX = 0;

let pdfTextDragOffsetY = 0;

let pdfTextDragging = false;
/* ========================================================= */
/* PDF SHAPE STATE                                           */
/* ========================================================= */

let activePdfShape = "rectangle";

let pdfShapeStartPoint = null;
let pdfShapePreviewImage = null;

let pdfShapeFill = false;
let pdfShapeBorder = true;

let pdfShapeBorderWidth = 3;
/* ========================================================= */
/* PDF EDITABLE SHAPE OBJECT SYSTEM                          */
/* ========================================================= */

const pdfShapeObjects =
    new WeakMap();

let selectedPdfShape = null;

let pdfShapeDragging = false;
let pdfShapeMoved = false;

let pdfShapeDragOffsetX = 0;
let pdfShapeDragOffsetY = 0;

let pdfShapeColorTarget = "fill";
/* ========================================================= */
/* PDF SHAPE UNDO / REDO HISTORY                             */
/* ========================================================= */

const pdfShapeUndoHistory =
    new WeakMap();

const pdfShapeRedoHistory =
    new WeakMap();

function clonePdfShapes(
    shapes
){

    return (
        shapes || []
    ).map(
        shape => ({
            ...shape
        })
    );

}

function getPdfShapeHistoryStack(
    map,
    shapeCanvas
){

    if(!shapeCanvas){
        return [];
    }

    let stack =
        map.get(
            shapeCanvas
        );

    if(!stack){

        stack = [];

        map.set(
            shapeCanvas,
            stack
        );

    }

    return stack;

}

function savePdfShapeUndoState(
    shapeCanvas
){

    if(!shapeCanvas){
        return;
    }

    const shapes =
        pdfShapeObjects.get(
            shapeCanvas
        ) || [];

    const undoStack =
        getPdfShapeHistoryStack(
            pdfShapeUndoHistory,
            shapeCanvas
        );

    const redoStack =
        getPdfShapeHistoryStack(
            pdfShapeRedoHistory,
            shapeCanvas
        );

    undoStack.push(
        clonePdfShapes(
            shapes
        )
    );

    if(
        undoStack.length >
        PDF_HISTORY_LIMIT
    ){

        undoStack.shift();

    }

    redoStack.length = 0;

}

function undoPdfShapeEdit(){

    const canvas =
        activePdfAnnotationCanvas;

    if(!canvas){
        return;
    }

    const shapeCanvas =
        canvas.parentElement
            ?.querySelector(
                ".pdf-shape-canvas"
            );

    if(!shapeCanvas){
        return;
    }

    const undoStack =
        getPdfShapeHistoryStack(
            pdfShapeUndoHistory,
            shapeCanvas
        );

    const redoStack =
        getPdfShapeHistoryStack(
            pdfShapeRedoHistory,
            shapeCanvas
        );

    if(!undoStack.length){
        return;
    }

    const currentShapes =
        pdfShapeObjects.get(
            shapeCanvas
        ) || [];

    redoStack.push(
        clonePdfShapes(
            currentShapes
        )
    );

    const previousShapes =
        undoStack.pop();

    pdfShapeObjects.set(
        shapeCanvas,
        clonePdfShapes(
            previousShapes
        )
    );

    selectedPdfShape =
        null;

    redrawPdfShapes(
        shapeCanvas
    );

}

function redoPdfShapeEdit(){

    const canvas =
        activePdfAnnotationCanvas;

    if(!canvas){
        return;
    }

    const shapeCanvas =
        canvas.parentElement
            ?.querySelector(
                ".pdf-shape-canvas"
            );

    if(!shapeCanvas){
        return;
    }

    const redoStack =
        getPdfShapeHistoryStack(
            pdfShapeRedoHistory,
            shapeCanvas
        );

    const undoStack =
        getPdfShapeHistoryStack(
            pdfShapeUndoHistory,
            shapeCanvas
        );

    if(!redoStack.length){
        return;
    }

    const currentShapes =
        pdfShapeObjects.get(
            shapeCanvas
        ) || [];

    undoStack.push(
        clonePdfShapes(
            currentShapes
        )
    );

    const nextShapes =
        redoStack.pop();

    pdfShapeObjects.set(
        shapeCanvas,
        clonePdfShapes(
            nextShapes
        )
    );

    selectedPdfShape =
        null;

    redrawPdfShapes(
        shapeCanvas
    );

}
/* ========================================================= */
/* SELECTED SHAPE UPDATE                                      */
/* ========================================================= */

function updateSelectedPdfShape(){

    if(!selectedPdfShape){
        return;
    }


    if(
        pdfShapeColorTarget ===
        "fill"
    ){

        selectedPdfShape.fill =
            true;

        selectedPdfShape.fillColor =
            pdfEditorColor ===
            "transparent"
                ? "#0A1F5C"
                : pdfEditorColor;

        selectedPdfShape.fillOpacity =
            pdfEditorOpacity;

    }


    if(
        pdfShapeColorTarget ===
        "border"
    ){

        selectedPdfShape.border =
            true;

        selectedPdfShape.borderColor =
            pdfEditorColor ===
            "transparent"
                ? "#0A1F5C"
                : pdfEditorColor;

        selectedPdfShape.borderOpacity =
            pdfEditorOpacity;

    }


    const shapeCanvas =
        document.querySelector(
            ".pdf-shape-canvas"
        );


    if(
        shapeCanvas &&
        selectedPdfShape
    ){

        /*
         * Find the actual canvas
         * containing this shape.
         */

        let targetCanvas =
            null;


        document
            .querySelectorAll(
                ".pdf-shape-canvas"
            )
            .forEach(
                canvas => {

                    const shapes =
                        pdfShapeObjects.get(
                            canvas
                        ) || [];


                    if(
                        shapes.includes(
                            selectedPdfShape
                        )
                    ){

                        targetCanvas =
                            canvas;

                    }

                }
            );


        if(targetCanvas){

            redrawPdfShapes(
                targetCanvas
            );
savePdfEdits();
        }

    }

}
document.addEventListener(
    "click",
    event => {

        const toolButton =
            event.target.closest(
                "[data-pdf-tool]"
            );

        if(!toolButton){
            return;
        }


        activePdfTool =
            toolButton.dataset.pdfTool;


        const editSheet =
            document.getElementById(
                "pdf-edit-sheet"
            );


        const editorPanel =
            document.getElementById(
                "pdf-editor-panel"
            );


        const toolsButton =
            document.getElementById(
                "pdf-tools-button"
            );


        const toolsIcon =
            toolsButton?.querySelector(
                ".material-symbols-rounded"
            );


        const toolName =
            document.getElementById(
                "pdf-editor-tool-name"
            );


        const toolIcon =
            document.getElementById(
                "pdf-editor-tool-icon"
            );


        const shapeControl =
            document.getElementById(
                "pdf-shape-control"
            );


        const fillControl =
            document.getElementById(
                "pdf-shape-fill-control"
            );


        const opacityControl =
            document.getElementById(
                "pdf-shape-opacity-control"
            );


        const borderControl =
            document.getElementById(
                "pdf-shape-border-control"
            );


        /*
         * Close the main editor feature menu.
         */

        if(editSheet){

            editSheet.classList.remove(
                "active"
            );

        }


        /*
         * Open selected tool's
         * bottom editor panel.
         */

        if(editorPanel){

            editorPanel.classList.add(
                "active"
            );

        }


        /*
         * Reset tool-specific
         * controls first.
         */

        if(shapeControl){

            shapeControl.hidden =
                true;

        }


        if(fillControl){

            fillControl.hidden =
                true;

        }


        if(opacityControl){

            opacityControl.hidden =
                true;

        }


        if(borderControl){

            borderControl.hidden =
                true;

        }
const textControls =
    document.getElementById(
        "pdf-text-controls"
    );

if(textControls){

    textControls.hidden =
        true;

}

        /*
         * Remove previous mode classes.
         */

        editorPanel?.classList.remove(
            "editor-doodle-mode",
            "editor-highlight-mode",
            "editor-shape-mode",
            "editor-text-mode"
        );


        /*
         * Doodle
         */

        if(
            activePdfTool ===
            "doodle"
        ){

            if(toolName){

                toolName.textContent =
                    "Doodle";

            }


            if(toolIcon){

                toolIcon.textContent =
                    "draw";

            }


            editorPanel?.classList.add(
                "editor-doodle-mode"
            );

        }


        /*
         * Highlight
         */

        if(
            activePdfTool ===
            "highlight"
        ){

            if(toolName){

                toolName.textContent =
                    "Highlight";

            }


            if(toolIcon){

                toolIcon.textContent =
                    "highlight";

            }


            editorPanel?.classList.add(
                "editor-highlight-mode"
            );

        }


        /*
         * Shape
         */

        if(
            activePdfTool ===
            "shape"
        ){

            if(toolName){

                toolName.textContent =
                    "Shape";

            }


            if(toolIcon){

                toolIcon.textContent =
                    "shapes";

            }


            if(shapeControl){

                shapeControl.hidden =
                    false;

            }


            if(fillControl){

                fillControl.hidden =
                    false;

            }


            if(opacityControl){

                opacityControl.hidden =
                    false;

            }


            if(borderControl){

                borderControl.hidden =
                    false;

            }


            editorPanel?.classList.add(
                "editor-shape-mode"
            );

        }


        /*
         * Text
         */

        if(
            activePdfTool ===
            "text"
        ){

            if(toolName){

                toolName.textContent =
                    "Text";

            }


            if(toolIcon){

                toolIcon.textContent =
                    "text_fields";

            }


            editorPanel?.classList.add(
                "editor-text-mode"
            );

        }


        /*
         * The horizontal tools button
         * stays available.
         */

        if(toolsIcon){

            toolsIcon.textContent =
                "menu";

        }


        /*
         * Reconnect annotation canvas
         * to the selected tool.
         */

        setupPdfAnnotationCanvas();

    }
);
/* ========================================================= */
/* PDF ANNOTATION CANVAS — ALL PAGES                          */
/* ========================================================= */

function setupPdfAnnotationCanvas(){

    const annotationCanvases =
        document.querySelectorAll(
            ".pdf-page-layer .pdf-annotation-canvas"
        );


    if(!annotationCanvases.length){
        return;
    }


    annotationCanvases.forEach(
        annotationCanvas => {

            annotationCanvas.style.pointerEvents =
                activePdfTool
                    ? "auto"
                    : "none";
annotationCanvas.style.touchAction =
    activePdfTool
        ? "none"
        : "pan-x pan-y";

            annotationCanvas.onpointerdown =
                startPdfMark;


            annotationCanvas.onpointermove =
                drawPdfMark;


            annotationCanvas.onpointerup =
                stopPdfMark;


            annotationCanvas.onpointercancel =
                stopPdfMark;

        }
    );

}
/* ========================================================= */
/* PDF EDITOR CONTROLS                                       */
/* ========================================================= */

document.addEventListener(
    "input",
    event => {

        if(
            event.target.id ===
            "pdf-editor-size"
        ){

            pdfEditorSize =
                Number(
                    event.target.value
                );

            return;
        }


        if(
            event.target.id ===
            "pdf-shape-opacity"
        ){

            pdfEditorOpacity =
                Number(
                    event.target.value
                );

            const value =
                document.getElementById(
                    "pdf-shape-opacity-value"
                );
if(value){

    value.textContent =
        `${pdfEditorOpacity}%`;
}
if(
    activePdfTool ===
    "shape" &&
    selectedPdfShape
){

    updateSelectedPdfShape();

}

        }

    }
);
/* ========================================================= */
/* PDF TEXT FORMATTING CONTROLS                              */
/* ========================================================= */

document.addEventListener(
    "input",
    event => {

        if(
            event.target.id ===
            "pdf-text-size"
        ){

            pdfTextFontSize =
                Number(
                    event.target.value
                );

            return;
        }

    }
);


/* ========================================================= */
/* PDF TEXT COLOR                                             */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        const colorButton =
            event.target.closest(
                ".pdf-editor-color"
            );


        if(
            !colorButton ||
            activePdfTool !==
            "text"
        ){
            return;
        }


        const color =
            colorButton.dataset
                .editorColor;


        if(
            !color ||
            color ===
            "transparent"
        ){

            pdfTextColor =
                "#0A1F5C";

        }else{

            pdfTextColor =
                color;

        }


        document
            .querySelectorAll(
                ".pdf-editor-color"
            )
            .forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                }
            );


        colorButton.classList.add(
            "active"
        );
if(
    activePdfTool ===
    "shape" &&
    selectedPdfShape
){

    updateSelectedPdfShape();

}
    }
);


/* ========================================================= */
/* PDF TEXT STYLE                                             */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        if(
            activePdfTool !==
            "text"
        ){
            return;
        }


        const boldButton =
            event.target.closest(
                "#pdf-text-bold"
            );


        if(boldButton){

            pdfTextBold =
                !pdfTextBold;


            boldButton.setAttribute(
                "aria-pressed",
                String(
                    pdfTextBold
                )
            );


            return;
        }


        const italicButton =
            event.target.closest(
                "#pdf-text-italic"
            );


        if(italicButton){

            pdfTextItalic =
                !pdfTextItalic;


            italicButton.setAttribute(
                "aria-pressed",
                String(
                    pdfTextItalic
                )
            );


            return;
        }


        const underlineButton =
            event.target.closest(
                "#pdf-text-underline"
            );


        if(underlineButton){

            pdfTextUnderline =
                !pdfTextUnderline;


            underlineButton.setAttribute(
                "aria-pressed",
                String(
                    pdfTextUnderline
                )
            );

        }

    }
);
document.addEventListener(
    "click",
    event => {

        const colorButton =
            event.target.closest(
                ".pdf-editor-color"
            );

        if(!colorButton){
            return;
        }


        const selectedColor =
            colorButton.dataset.editorColor;


        if(
            !selectedColor ||
            selectedColor ===
            "transparent"
        ){

            pdfEditorColor =
                "transparent";

        }else{

            pdfEditorColor =
                selectedColor;

        }


        document
            .querySelectorAll(
                ".pdf-editor-color"
            )
            .forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                }
            );


        colorButton.classList.add(
            "active"
        );

    }
);
/* ========================================================= */
/* PDF SHAPE SELECTION                                       */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        const shapeButton =
            event.target.closest(
                ".pdf-shape-option"
            );

        if(!shapeButton){
            return;
        }


        const selectedShape =
            shapeButton.dataset.shape;


        if(!selectedShape){
            return;
        }


        activePdfShape =
            selectedShape;


        document
            .querySelectorAll(
                ".pdf-shape-option"
            )
            .forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                }
            );


        shapeButton.classList.add(
            "active"
        );


        activePdfTool =
            "shape";


        setupPdfAnnotationCanvas();

    }
);
/* ========================================================= */
/* PDF SHAPE FILL / BORDER                                   */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        const fillButton =
            event.target.closest(
                "#pdf-shape-fill-toggle"
            );


if(fillButton){

    pdfShapeColorTarget =
        "fill";


    pdfShapeFill =
        !pdfShapeFill;


    fillButton.setAttribute(
        "aria-pressed",
        String(
            pdfShapeFill
        )
    );


    if(selectedPdfShape){

        updateSelectedPdfShape();

    }


    return;
}


        const borderButton =
            event.target.closest(
                "#pdf-shape-border-toggle"
            );


if(borderButton){

    pdfShapeColorTarget =
        "border";


    pdfShapeBorder =
        !pdfShapeBorder;


    borderButton.setAttribute(
        "aria-pressed",
        String(
            pdfShapeBorder
        )
    );


    if(selectedPdfShape){

        updateSelectedPdfShape();

    }

}

    }
);
/* ========================================================= */
/* PDF TEXT PLACEMENT                                         */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        if(
            activePdfTool !==
            "text"
        ){
            return;
        }

const textControls =
    document.getElementById(
        "pdf-text-controls"
    );

if(textControls){

    textControls.hidden =
        false;

}
        const annotationCanvas =
            event.target.closest(
                ".pdf-annotation-canvas"
            );


        if(!annotationCanvas){
            return;
        }


        const point =
            getPdfPoint(
                annotationCanvas,
                event
            );


        openPdfTextInput(
            annotationCanvas,
            point
        );

    }
);
function openPdfTextInput(
    canvas,
    point
){

    if(
        pdfActiveTextElement
    ){
        pdfActiveTextElement.remove();

        pdfActiveTextElement =
            null;
    }


    const input =
        document.createElement(
            "textarea"
        );


    input.className =
        "pdf-text-input";


    input.placeholder =
        "Type here...";


    input.value =
        "";


    input.style.position =
        "absolute";


    input.style.left =
        `${point.x}px`;


    input.style.top =
        `${point.y}px`;


    input.style.minWidth =
        "160px";


    input.style.minHeight =
        "42px";


    input.style.fontSize =
        `${pdfTextFontSize}px`;


    input.style.fontFamily =
        pdfTextFontFamily;


    input.style.color =
        pdfTextColor;


    input.style.fontWeight =
        pdfTextBold
            ? "700"
            : "400";


    input.style.fontStyle =
        pdfTextItalic
            ? "italic"
            : "normal";


    input.style.zIndex =
        "50";


    canvas.parentElement.appendChild(
        input
    );


    pdfActiveTextElement =
        input;


    input.focus();
/* ========================================================= */
/* KEEP TEXT INPUT ABOVE KEYBOARD + EDITOR PANEL             */
/* ========================================================= */

function keepPdfTextInputVisible(){

    const input =
        pdfActiveTextElement;

    if(!input){
        return;
    }

    const editorPanel =
        document.getElementById(
            "pdf-editor-panel"
        );

    requestAnimationFrame(() => {

        input.style.transform =
            "translateY(0)";

        const inputRect =
            input.getBoundingClientRect();

        let safeBottom =
            window.innerHeight - 12;

        if(
            editorPanel &&
            editorPanel.classList.contains(
                "active"
            )
        ){

            const panelRect =
                editorPanel.getBoundingClientRect();

            safeBottom =
                Math.min(
                    safeBottom,
                    panelRect.top - 12
                );

        }

        if(
            window.visualViewport
        ){

            const viewportBottom =
                window.visualViewport.height +
                window.visualViewport.offsetTop -
                12;

            safeBottom =
                Math.min(
                    safeBottom,
                    viewportBottom
                );

        }

        const overlap =
            inputRect.bottom -
            safeBottom;

        if(overlap > 0){

            input.style.transform =
                `translateY(-${overlap + 12}px)`;

        }

    });

}


/* Initial adjustment */

setTimeout(
    keepPdfTextInputVisible,
    120
);


/* Keyboard open / close */

if(window.visualViewport){

    window.visualViewport.addEventListener(
        "resize",
        keepPdfTextInputVisible
    );

    window.visualViewport.addEventListener(
        "scroll",
        keepPdfTextInputVisible
    );

}

    input.addEventListener(
        "keydown",
        event => {
if(
    event.key ===
    "Enter" &&
    !event.shiftKey
){

    event.preventDefault();

    commitPdfTextInput();

    return;
}
            if(
                event.key ===
                "Escape"
            ){

                input.remove();

                pdfActiveTextElement =
                    null;

            }

        }
    );

}
/* ========================================================= */
/* PDF TEXT COMMIT                                            */
/* ========================================================= */

function commitPdfTextInput(){

    const input =
        pdfActiveTextElement;


    if(!input){
        return;
    }


    const text =
        input.value.trim();


    if(!text){

        input.remove();

        pdfActiveTextElement =
            null;

        return;
    }


    const canvas =
        input.parentElement
            ?.querySelector(
                ".pdf-annotation-canvas"
            );


    if(!canvas){

        input.remove();

        pdfActiveTextElement =
            null;

        return;
    }


    const context =
        canvas.getContext("2d");


    const left =
        parseFloat(
            input.style.left
        );


    const top =
        parseFloat(
            input.style.top
        );

const textObject = {

    canvas,

    text,

    x: left,

    y: top,

    fontSize:
        pdfTextFontSize,

    fontFamily:
        pdfTextFontFamily,

    color:
        pdfTextColor,

    bold:
        pdfTextBold,

    italic:
        pdfTextItalic,

    underline:
        pdfTextUnderline

};

pdfTextObjects.push(
    textObject
);
    context.save();


    context.globalCompositeOperation =
        "source-over";


    context.globalAlpha =
        1;


    context.fillStyle =
        pdfTextColor ===
        "transparent"
            ? "#0A1F5C"
            : pdfTextColor;


    context.font =
        `${pdfTextItalic ? "italic " : ""}${pdfTextBold ? "bold " : ""}${pdfTextFontSize}px ${pdfTextFontFamily}`;


    context.textBaseline =
        "top";


    const lines =
        text.split("\n");


    const lineHeight =
        pdfTextFontSize * 1.25;


    lines.forEach(
        (line, index) => {

            context.fillText(
                line,
                left,
                top +
                index *
                lineHeight
            );

        }
    );


    /*
     * Underline
     */

    if(pdfTextUnderline){

        const textWidth =
            Math.max(
                ...lines.map(
                    line =>
                        context.measureText(
                            line
                        ).width
                )
            );


        context.beginPath();


        context.moveTo(
            left,
            top +
            pdfTextFontSize +
            2
        );


        context.lineTo(
            left +
            textWidth,
            top +
            pdfTextFontSize +
            2
        );


        context.lineWidth =
            Math.max(
                1,
                pdfTextFontSize / 12
            );


        context.strokeStyle =
            pdfTextColor ===
            "transparent"
                ? "#0A1F5C"
                : pdfTextColor;


        context.stroke();

    }


    context.restore();


    input.remove();


    pdfActiveTextElement =
        null;

}
/* ========================================================= */
/* PDF TEXT SELECTION                                        */
/* ========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        if(
            activePdfTool !==
            "text"
        ){
            return;
        }


        const canvas =
            event.target.closest(
                ".pdf-annotation-canvas"
            );


        if(!canvas){
            return;
        }


        const point =
            getPdfPoint(
                canvas,
                event
            );


        const objects =
            pdfTextObjects.filter(
                object =>
                    object.canvas ===
                    canvas
            );


        for(
            let i =
                objects.length - 1;
            i >= 0;
            i--
        ){

            const object =
                objects[i];


            const context =
                canvas.getContext(
                    "2d"
                );


            context.font =
                `${object.italic ? "italic " : ""}${object.bold ? "bold " : ""}${object.fontSize}px ${object.fontFamily}`;


            const textWidth =
                context.measureText(
                    object.text
                ).width;


            const textHeight =
                object.fontSize *
                1.4;


            if(
                point.x >=
                    object.x - 8 &&
                point.x <=
                    object.x +
                    textWidth + 8 &&
                point.y >=
                    object.y - 8 &&
                point.y <=
                    object.y +
                    textHeight + 8
            ){

                pdfSelectedTextObject =
                    object;


                pdfTextDragging =
                    true;


                pdfTextDragOffsetX =
                    point.x -
                    object.x;


                pdfTextDragOffsetY =
                    point.y -
                    object.y;


                canvas.setPointerCapture(
                    event.pointerId
                );


                return;

            }

        }

    }
);
document.addEventListener(
    "pointermove",
    event => {

        if(
            !pdfTextDragging ||
            !pdfSelectedTextObject
        ){
            return;
        }


        const canvas =
            pdfSelectedTextObject.canvas;


        const point =
            getPdfPoint(
                canvas,
                event
            );


        pdfSelectedTextObject.x =
            point.x -
            pdfTextDragOffsetX;


        pdfSelectedTextObject.y =
            point.y -
            pdfTextDragOffsetY;


        redrawPdfTextObjects(
            canvas
        );

    }
);
document.addEventListener(
    "pointerup",
    event => {

        if(
            !pdfTextDragging
        ){
            return;
        }


        pdfTextDragging =
            false;


        pdfSelectedTextObject =
            null;


        pdfTextDragOffsetX =
            0;


        pdfTextDragOffsetY =
            0;

    }
);
function redrawPdfTextObjects(
    canvas
){

    const context =
        canvas.getContext(
            "2d"
        );


    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    const objects =
        pdfTextObjects.filter(
            object =>
                object.canvas ===
                canvas
        );


    objects.forEach(
        object => {

            context.save();


            context.globalAlpha =
                1;


            context.fillStyle =
                object.color ===
                "transparent"
                    ? "#0A1F5C"
                    : object.color;


            context.font =
                `${object.italic ? "italic " : ""}${object.bold ? "bold " : ""}${object.fontSize}px ${object.fontFamily}`;


            context.textBaseline =
                "top";


            context.fillText(
                object.text,
                object.x,
                object.y
            );


            if(
                object.underline
            ){

                const width =
                    context.measureText(
                        object.text
                    ).width;


                context.beginPath();


                context.moveTo(
                    object.x,
                    object.y +
                    object.fontSize +
                    2
                );


                context.lineTo(
                    object.x +
                    width,
                    object.y +
                    object.fontSize +
                    2
                );


                context.lineWidth =
                    Math.max(
                        1,
                        object.fontSize /
                        12
                    );


                context.strokeStyle =
                    object.color;


                context.stroke();

            }


            context.restore();

        }
    );

}
/* ========================================================= */
/* PDF DRAWING                                               */
/* ========================================================= */

function getPdfPoint(
    canvas,
    event
){

    const rect =
        canvas.getBoundingClientRect();

    return {
        x:
            (event.clientX - rect.left) *
            (canvas.width / rect.width),

        y:
            (event.clientY - rect.top) *
            (canvas.height / rect.height)
    };
}

/* ========================================================= */
/* PDF SHAPE RENDERER                                        */
/* ========================================================= */

function drawPdfShape(
    context,
    start,
    end
){

    const x =
        Math.min(
            start.x,
            end.x
        );


    const y =
        Math.min(
            start.y,
            end.y
        );


    const width =
        Math.abs(
            end.x -
            start.x
        );


    const height =
        Math.abs(
            end.y -
            start.y
        );


    context.globalCompositeOperation =
        "source-over";


    context.globalAlpha =
        pdfEditorOpacity / 100;


    context.strokeStyle =
        pdfEditorColor ===
        "transparent"
            ? "#0A1F5C"
            : pdfEditorColor;


    context.fillStyle =
        pdfEditorColor ===
        "transparent"
            ? "#0A1F5C"
            : pdfEditorColor;


    context.lineWidth =
        pdfShapeBorderWidth;


    context.beginPath();


    /*
     * =======================================================
     * RECTANGLE
     * =======================================================
     */

    if(
        activePdfShape ===
        "rectangle"
    ){

        context.rect(
            x,
            y,
            width,
            height
        );

    }


    /*
     * =======================================================
     * ROUNDED RECTANGLE
     * =======================================================
     */

    else if(
        activePdfShape ===
        "rounded-rectangle"
    ){

        const radius =
            Math.min(
                18,
                width / 2,
                height / 2
            );


        context.roundRect(
            x,
            y,
            width,
            height,
            radius
        );

    }


    /*
     * =======================================================
     * CIRCLE
     * =======================================================
     */

    else if(
        activePdfShape ===
        "circle"
    ){

        const diameter =
            Math.min(
                width,
                height
            );


        const centerX =
            start.x +
            (
                end.x >= start.x
                    ? diameter / 2
                    : -diameter / 2
            );


        const centerY =
            start.y +
            (
                end.y >= start.y
                    ? diameter / 2
                    : -diameter / 2
            );


        context.arc(
            centerX,
            centerY,
            diameter / 2,
            0,
            Math.PI * 2
        );

    }


    /*
     * =======================================================
     * OVAL
     * =======================================================
     */

    else if(
        activePdfShape ===
        "oval"
    ){

        context.ellipse(
            x + width / 2,
            y + height / 2,
            width / 2,
            height / 2,
            0,
            0,
            Math.PI * 2
        );

    }


else if(
    activePdfShape ===
    "line"
){

    context.moveTo(
        start.x,
        start.y
    );

    context.lineTo(
        end.x,
        end.y
    );

}


else if(
    activePdfShape ===
    "arrow"
){

    drawPdfArrowHead(
        context,
        start,
        end
    );

}


else if(
    activePdfShape ===
    "double-arrow"
){

    drawPdfArrowHead(
        context,
        start,
        end
    );


    drawPdfArrowHead(
        context,
        end,
        start
    );

}
else if(
    activePdfShape ===
    "triangle"
){

    context.moveTo(
        x + width / 2,
        y
    );

    context.lineTo(
        x + width,
        y + height
    );

    context.lineTo(
        x,
        y + height
    );

    context.closePath();

}
else if(
    activePdfShape ===
    "star"
){

    drawPdfStar(
        context,
        x,
        y,
        width,
        height
    );

}
else if(
    activePdfShape ===
    "cloud"
){

    drawPdfCloud(
        context,
        x,
        y,
        width,
        height
    );

}
else if(
    activePdfShape ===
    "underline"
){

    context.moveTo(
        x,
        y + height / 2
    );

    context.lineTo(
        x + width,
        y + height / 2
    );

}


else if(
    activePdfShape ===
    "double-underline"
){

    const firstY =
        y + height * 0.38;

    const secondY =
        y + height * 0.62;


    context.moveTo(
        x,
        firstY
    );

    context.lineTo(
        x + width,
        firstY
    );


    context.moveTo(
        x,
        secondY
    );

    context.lineTo(
        x + width,
        secondY
    );

}


else if(
    activePdfShape ===
    "bracket"
){

    drawPdfBracket(
        context,
        x,
        y,
        width,
        height,
        "both"
    );

}


else if(
    activePdfShape ===
    "left-bracket"
){

    drawPdfBracket(
        context,
        x,
        y,
        width,
        height,
        "left"
    );

}


else if(
    activePdfShape ===
    "right-bracket"
){

    drawPdfBracket(
        context,
        x,
        y,
        width,
        height,
        "right"
    );

}


else if(
    activePdfShape ===
    "top-bracket"
){

    drawPdfBracket(
        context,
        x,
        y,
        width,
        height,
        "top"
    );

}


else if(
    activePdfShape ===
    "bottom-bracket"
){

    drawPdfBracket(
        context,
        x,
        y,
        width,
        height,
        "bottom"
    );

}


else if(
    activePdfShape ===
    "callout"
){

    drawPdfCallout(
        context,
        x,
        y,
        width,
        height
    );

}


else if(
    activePdfShape ===
    "speech-bubble"
){

    drawPdfSpeechBubble(
        context,
        x,
        y,
        width,
        height
    );

}


else if(
    activePdfShape ===
    "thought-bubble"
){

    drawPdfThoughtBubble(
        context,
        x,
        y,
        width,
        height
    );

}


else{

    return;

}


    /*
     * Fill only when enabled.
     */

    if(pdfShapeFill){

        context.fill();

    }


    /*
     * Border only when enabled.
     */

    if(pdfShapeBorder){

        context.stroke();

    }


    context.globalAlpha =
        1;

}
/* ========================================================= */
/* DRAW ONE EDITABLE SHAPE OBJECT                             */
/* ========================================================= */

function drawPdfShapeObject(
    context,
    shape
){

    if(
        !context ||
        !shape
    ){
        return;
    }


    const oldShape =
        activePdfShape;

    const oldColor =
        pdfEditorColor;

    const oldOpacity =
        pdfEditorOpacity;

    const oldFill =
        pdfShapeFill;

    const oldBorder =
        pdfShapeBorder;

    const oldBorderWidth =
        pdfShapeBorderWidth;


    activePdfShape =
        shape.type;

    pdfShapeBorderWidth =
        shape.borderWidth;


    /*
     * Fill
     */

    if(shape.fill){

        pdfEditorColor =
            shape.fillColor;

        pdfEditorOpacity =
            shape.fillOpacity;

        pdfShapeFill =
            true;

        pdfShapeBorder =
            false;

        drawPdfShape(
            context,
            {
                x:shape.x,
                y:shape.y
            },
            {
                x:
                    shape.x +
                    shape.width,

                y:
                    shape.y +
                    shape.height
            }
        );
    }


    /*
     * Border
     */

    if(shape.border){

        pdfEditorColor =
            shape.borderColor;

        pdfEditorOpacity =
            shape.borderOpacity;

        pdfShapeFill =
            false;

        pdfShapeBorder =
            true;

        drawPdfShape(
            context,
            {
                x:shape.x,
                y:shape.y
            },
            {
                x:
                    shape.x +
                    shape.width,

                y:
                    shape.y +
                    shape.height
            }
        );
    }


    /*
     * Restore editor state
     */

    activePdfShape =
        oldShape;

    pdfEditorColor =
        oldColor;

    pdfEditorOpacity =
        oldOpacity;

    pdfShapeFill =
        oldFill;

    pdfShapeBorder =
        oldBorder;

    pdfShapeBorderWidth =
        oldBorderWidth;
}


/* ========================================================= */
/* REDRAW ALL SHAPES                                          */
/* ========================================================= */

function redrawPdfShapes(
    shapeCanvas
){

    if(!shapeCanvas){
        return;
    }

    const context =
        shapeCanvas.getContext(
            "2d"
        );

    if(!context){
        return;
    }

    context.clearRect(
        0,
        0,
        shapeCanvas.width,
        shapeCanvas.height
    );

    const shapes =
        pdfShapeObjects.get(
            shapeCanvas
        ) || [];


    shapes.forEach(
        shape => {

            drawPdfShapeObject(
                context,
                shape
            );

        }
    );


    /*
     * Selected shape outline
     */

    if(selectedPdfShape){

        context.save();

        context.globalAlpha =
            1;

        context.strokeStyle =
            "#F4B400";

        context.lineWidth =
            2;

        context.setLineDash([
            7,
            5
        ]);

        context.strokeRect(
            selectedPdfShape.x - 4,
            selectedPdfShape.y - 4,
            selectedPdfShape.width + 8,
            selectedPdfShape.height + 8
        );

        context.restore();

    }

}


/* ========================================================= */
/* SHAPE HIT TEST                                             */
/* ========================================================= */

function getPdfShapeAtPoint(
    shapeCanvas,
    point
){

    const shapes =
        pdfShapeObjects.get(
            shapeCanvas
        ) || [];


    /*
     * Reverse order so the
     * top-most shape wins.
     */

    for(
        let i =
            shapes.length - 1;

        i >= 0;

        i--
    ){

        const shape =
            shapes[i];


        const left =
            Math.min(
                shape.x,
                shape.x +
                shape.width
            );

        const right =
            Math.max(
                shape.x,
                shape.x +
                shape.width
            );

        const top =
            Math.min(
                shape.y,
                shape.y +
                shape.height
            );

        const bottom =
            Math.max(
                shape.y,
                shape.y +
                shape.height
            );


        if(
            point.x >= left &&
            point.x <= right &&
            point.y >= top &&
            point.y <= bottom
        ){

            return shape;

        }

    }


    return null;

}
/* ========================================================= */
/* PDF STAR SHAPE                                             */
/* ========================================================= */

function drawPdfStar(
    context,
    x,
    y,
    width,
    height
){

    const centerX =
        x + width / 2;

    const centerY =
        y + height / 2;

    const outerRadius =
        Math.min(
            width,
            height
        ) / 2;

    const innerRadius =
        outerRadius * 0.42;

    const points = 10;


    context.moveTo(
        centerX +
        outerRadius,
        centerY
    );


    for(
        let i = 1;
        i < points;
        i++
    ){

        const angle =
            -Math.PI / 2 +
            i * Math.PI / 5;

        const radius =
            i % 2 === 0
                ? outerRadius
                : innerRadius;


        context.lineTo(
            centerX +
            Math.cos(angle) *
            radius,

            centerY +
            Math.sin(angle) *
            radius
        );

    }


    context.closePath();

}
/* ========================================================= */
/* PDF CLOUD SHAPE                                            */
/* ========================================================= */

function drawPdfCloud(
    context,
    x,
    y,
    width,
    height
){

    const baseY =
        y + height * 0.72;


    context.moveTo(
        x + width * 0.18,
        baseY
    );


    /*
     * Left lower curve
     */

    context.bezierCurveTo(
        x + width * 0.04,
        baseY,
        x + width * 0.04,
        y + height * 0.48,
        x + width * 0.20,
        y + height * 0.42
    );


    /*
     * Left cloud bump
     */

    context.bezierCurveTo(
        x + width * 0.20,
        y + height * 0.18,
        x + width * 0.48,
        y + height * 0.12,
        x + width * 0.56,
        y + height * 0.34
    );


    /*
     * Top-right cloud bump
     */

    context.bezierCurveTo(
        x + width * 0.72,
        y + height * 0.12,
        x + width * 0.96,
        y + height * 0.25,
        x + width * 0.88,
        y + height * 0.50
    );


    /*
     * Right lower curve
     */

    context.bezierCurveTo(
        x + width * 1.04,
        y + height * 0.58,
        x + width * 0.96,
        baseY,
        x + width * 0.76,
        baseY
    );


    /*
     * Bottom cloud line
     */

    context.lineTo(
        x + width * 0.18,
        baseY
    );


    context.closePath();

}
/* ========================================================= */
/* PDF BRACKET SHAPES                                         */
/* ========================================================= */

function drawPdfBracket(
    context,
    x,
    y,
    width,
    height,
    type
){

    const curve =
        Math.min(
            width,
            height
        ) * 0.12;


    if(
        type ===
        "left" ||
        type ===
        "both"
    ){

        context.moveTo(
            x + curve,
            y
        );

        context.quadraticCurveTo(
            x,
            y,
            x,
            y + curve
        );

        context.lineTo(
            x,
            y + height - curve
        );

        context.quadraticCurveTo(
            x,
            y + height,
            x + curve,
            y + height
        );

    }


    if(
        type ===
        "right" ||
        type ===
        "both"
    ){

        const right =
            x + width;


        context.moveTo(
            right - curve,
            y
        );

        context.quadraticCurveTo(
            right,
            y,
            right,
            y + curve
        );

        context.lineTo(
            right,
            y + height - curve
        );

        context.quadraticCurveTo(
            right,
            y + height,
            right - curve,
            y + height
        );

    }


    if(
        type ===
        "top"
    ){

        context.moveTo(
            x,
            y + curve
        );

        context.quadraticCurveTo(
            x,
            y,
            x + curve,
            y
        );

        context.lineTo(
            x + width - curve,
            y
        );

        context.quadraticCurveTo(
            x + width,
            y,
            x + width,
            y + curve
        );

    }


    if(
        type ===
        "bottom"
    ){

        const bottom =
            y + height;


        context.moveTo(
            x,
            bottom - curve
        );

        context.quadraticCurveTo(
            x,
            bottom,
            x + curve,
            bottom
        );

        context.lineTo(
            x + width - curve,
            bottom
        );

        context.quadraticCurveTo(
            x + width,
            bottom,
            x + width,
            bottom - curve
        );

    }

}
/* ========================================================= */
/* PDF CALLOUT                                                */
/* ========================================================= */

function drawPdfCallout(
    context,
    x,
    y,
    width,
    height
){

    const radius =
        Math.min(
            width,
            height
        ) * 0.12;


    const tailX =
        x + width * 0.28;


    const tailY =
        y + height;


    context.moveTo(
        x + radius,
        y
    );


    context.lineTo(
        x + width - radius,
        y
    );


    context.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );


    context.lineTo(
        x + width,
        y + height - radius
    );


    context.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );


    context.lineTo(
        tailX + 22,
        tailY
    );


    context.lineTo(
        tailX,
        tailY + 18
    );


    context.lineTo(
        tailX - 4,
        tailY
    );


    context.lineTo(
        x + radius,
        y + height
    );


    context.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );


    context.lineTo(
        x,
        y + radius
    );


    context.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );


    context.closePath();

}
/* ========================================================= */
/* PDF SPEECH BUBBLE                                          */
/* ========================================================= */

function drawPdfSpeechBubble(
    context,
    x,
    y,
    width,
    height
){

    const radius =
        Math.min(
            width,
            height
        ) * 0.16;


    const tailX =
        x + width * 0.24;


    const tailY =
        y + height;


    context.moveTo(
        x + radius,
        y
    );


    context.lineTo(
        x + width - radius,
        y
    );


    context.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );


    context.lineTo(
        x + width,
        y + height - radius
    );


    context.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );


    context.lineTo(
        tailX + 20,
        tailY
    );


    context.lineTo(
        tailX,
        tailY + 20
    );


    context.lineTo(
        tailX - 2,
        tailY
    );


    context.lineTo(
        x + radius,
        y + height
    );


    context.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );


    context.lineTo(
        x,
        y + radius
    );


    context.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );


    context.closePath();

}
/* ========================================================= */
/* PDF THOUGHT BUBBLE                                         */
/* ========================================================= */

function drawPdfThoughtBubble(
    context,
    x,
    y,
    width,
    height
){

    const centerX =
        x + width * 0.52;

    const centerY =
        y + height * 0.45;


    const radiusX =
        width * 0.42;

    const radiusY =
        height * 0.34;


    context.ellipse(
        centerX,
        centerY,
        radiusX,
        radiusY,
        0,
        0,
        Math.PI * 2
    );


    /*
     * Thought bubbles.
     */

    context.moveTo(
        x + width * 0.25,
        y + height * 0.70
    );

    context.arc(
        x + width * 0.22,
        y + height * 0.76,
        Math.min(
            width,
            height
        ) * 0.055,
        0,
        Math.PI * 2
    );


    context.moveTo(
        x + width * 0.18,
        y + height * 0.83
    );

    context.arc(
        x + width * 0.15,
        y + height * 0.87,
        Math.min(
            width,
            height
        ) * 0.035,
        0,
        Math.PI * 2
    );

}
/* ========================================================= */
/* PDF ARROW HEAD                                            */
/* ========================================================= */

function drawPdfArrowHead(
    context,
    from,
    to
){

    const angle =
        Math.atan2(
            to.y - from.y,
            to.x - from.x
        );


    const arrowLength =
        Math.max(
            14,
            pdfEditorSize * 4
        );


    const arrowAngle =
        Math.PI / 7;


    /*
     * Draw the main line.
     */

    context.moveTo(
        from.x,
        from.y
    );

    context.lineTo(
        to.x,
        to.y
    );


    /*
     * First arrow wing.
     */

    context.moveTo(
        to.x,
        to.y
    );

    context.lineTo(
        to.x -
        arrowLength *
        Math.cos(
            angle - arrowAngle
        ),

        to.y -
        arrowLength *
        Math.sin(
            angle - arrowAngle
        )
    );


    /*
     * Second arrow wing.
     */

    context.moveTo(
        to.x,
        to.y
    );

    context.lineTo(
        to.x -
        arrowLength *
        Math.cos(
            angle + arrowAngle
        ),

        to.y -
        arrowLength *
        Math.sin(
            angle + arrowAngle
        )
    );

}

/* ========================================================= */
/* PDF DRAWING ENGINE                                        */
/* ========================================================= */

function startPdfMark(event){
if(
    pdfPinchActive
){
    return;
}
    activePdfAnnotationCanvas =
        event.currentTarget;

    if(!activePdfTool){
        return;
    }


    const canvas =
        event.currentTarget;

    const point =
        getPdfPoint(
            canvas,
            event
        );

/*
 * =======================================================
 * SHAPE ERASER
 * =======================================================
 */

if(
    activePdfTool ===
    "eraser"
){

    const shapeCanvas =
        canvas.parentElement
            ?.querySelector(
                ".pdf-shape-canvas"
            );


    if(shapeCanvas){

        const shapes =
            pdfShapeObjects.get(
                shapeCanvas
            ) || [];


        const shapeToErase =
            getPdfShapeAtPoint(
                shapeCanvas,
                point
            );


        /*
         * If the user tapped a shape,
         * remove that shape instead of
         * erasing the annotation canvas.
         */

        if(shapeToErase){

            /*
             * Save the current shape state
             * so Undo can restore it.
             */

            savePdfShapeUndoState(
                shapeCanvas
            );


            const shapeIndex =
                shapes.indexOf(
                    shapeToErase
                );


            if(
                shapeIndex !== -1
            ){

                shapes.splice(
                    shapeIndex,
                    1
                );


                /*
                 * Clear selection.
                 */

                if(
                    selectedPdfShape ===
                    shapeToErase
                ){

                    selectedPdfShape =
                        null;

                }


                pdfShapeDragging =
                    false;

                pdfShapeMoved =
                    false;


                /*
                 * Redraw the shape layer.
                 */

                redrawPdfShapes(
                    shapeCanvas
                );


                /*
                 * Save immediately so the
                 * deletion remains after the
                 * PDF is closed and reopened.
                 */

                savePdfEdits();

            }


            /*
             * Do NOT start normal eraser
             * drawing for a shape tap.
             */

            isPdfDrawing =
                false;

            lastPdfPoint =
                null;


            try{

                canvas.releasePointerCapture(
                    event.pointerId
                );

            }
            catch(error){}


            return;

        }

    }

}
    /*
     * =======================================================
     * SHAPE
     * =======================================================
     */

    if(
        activePdfTool ===
        "shape"
    ){

        const shapeCanvas =
            canvas.parentElement
                ?.querySelector(
                    ".pdf-shape-canvas"
                );


        /*
         * Check whether an existing
         * shape was touched.
         */

        const existingShape =
            shapeCanvas
                ? getPdfShapeAtPoint(
                    shapeCanvas,
                    point
                )
                : null;


        if(existingShape){
savePdfShapeUndoState(
    shapeCanvas
);
            selectedPdfShape =
                existingShape;

            pdfShapeDragging =
                true;

            pdfShapeMoved =
                false;

            pdfShapeDragOffsetX =
                point.x -
                existingShape.x;

            pdfShapeDragOffsetY =
                point.y -
                existingShape.y;


            redrawPdfShapes(
                shapeCanvas
            );


            canvas.setPointerCapture(
                event.pointerId
            );

            return;
        }


        /*
         * Start creating a new shape.
         */

        selectedPdfShape =
            null;

        pdfShapeDragging =
            false;

        pdfShapeMoved =
            false;


        isPdfDrawing =
            true;

        pdfShapeStartPoint =
            point;


        /*
         * Save annotation canvas
         * for temporary preview.
         */

        const context =
            canvas.getContext(
                "2d"
            );


        pdfShapePreviewImage =
            context.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );


        canvas.setPointerCapture(
            event.pointerId
        );

        return;
    }


    /*
     * =======================================================
     * OTHER TOOLS
     * =======================================================
     */

    isPdfDrawing =
        true;

    lastPdfPoint =
        point;


    canvas.setPointerCapture(
        event.pointerId
    );
}


function drawPdfMark(event){
if(
    pdfPinchActive
){
    return;
}
    const canvas =
        event.currentTarget;


    /*
     * =======================================================
     * SHAPE DRAGGING
     * =======================================================
     */

    if(
        activePdfTool ===
        "shape" &&
        pdfShapeDragging &&
        selectedPdfShape
    ){

        const shapeCanvas =
            canvas.parentElement
                ?.querySelector(
                    ".pdf-shape-canvas"
                );


        if(!shapeCanvas){
            return;
        }


        const point =
            getPdfPoint(
                canvas,
                event
            );


        const newX =
            point.x -
            pdfShapeDragOffsetX;

        const newY =
            point.y -
            pdfShapeDragOffsetY;


        if(
            Math.abs(
                newX -
                selectedPdfShape.x
            ) > 1 ||
            Math.abs(
                newY -
                selectedPdfShape.y
            ) > 1
        ){

            pdfShapeMoved =
                true;

        }


        selectedPdfShape.x =
            newX;

        selectedPdfShape.y =
            newY;


        redrawPdfShapes(
            shapeCanvas
        );


        return;
    }


    /*
     * =======================================================
     * NORMAL DRAWING CHECK
     * =======================================================
     */

    if(
        !isPdfDrawing ||
        !activePdfTool
    ){
        return;
    }


    const context =
        canvas.getContext(
            "2d"
        );


    const point =
        getPdfPoint(
            canvas,
            event
        );


    context.lineCap =
        "round";

    context.lineJoin =
        "round";


    /*
     * =======================================================
     * SHAPE PREVIEW
     * =======================================================
     */

    if(
        activePdfTool ===
        "shape"
    ){

        if(
            !pdfShapeStartPoint
        ){
            return;
        }


        /*
         * Restore annotation canvas
         * before drawing preview.
         */

        if(
            pdfShapePreviewImage
        ){

            context.putImageData(
                pdfShapePreviewImage,
                0,
                0
            );

        }


        drawPdfShape(
            context,
            pdfShapeStartPoint,
            point
        );


        return;
    }


    /*
     * =======================================================
     * DOODLE
     * =======================================================
     */

    if(
        activePdfTool ===
        "doodle"
    ){

        context.globalCompositeOperation =
            "source-over";

        context.strokeStyle =
            pdfEditorColor ===
            "transparent"
                ? "#0A1F5C"
                : pdfEditorColor;

        context.lineWidth =
            pdfEditorSize;

        context.globalAlpha =
            1;
    }


    /*
     * =======================================================
     * HIGHLIGHT
     * =======================================================
     */

    if(
        activePdfTool ===
        "highlight"
    ){

        context.globalCompositeOperation =
            "source-over";

        context.strokeStyle =
            pdfEditorColor ===
            "transparent"
                ? "#F4B400"
                : pdfEditorColor;

        context.lineWidth =
            pdfEditorSize;

        context.globalAlpha =
            pdfEditorOpacity / 100;
    }


    /*
     * =======================================================
     * ERASER
     * =======================================================
     */

    if(
        activePdfTool ===
        "eraser"
    ){

        context.globalCompositeOperation =
            "destination-out";

        context.lineWidth =
            pdfEditorSize;

        context.globalAlpha =
            1;
    }


    context.beginPath();

    context.moveTo(
        lastPdfPoint.x,
        lastPdfPoint.y
    );

    context.lineTo(
        point.x,
        point.y
    );

    context.stroke();


    lastPdfPoint =
        point;
}


function stopPdfMark(event){
if(
    pdfPinchActive
){
    return;
}
    const canvas =
        event.currentTarget;


    /*
     * =======================================================
     * SHAPE DRAGGING
     * =======================================================
     */

    if(
        activePdfTool ===
        "shape" &&
        pdfShapeDragging
    ){

        const shapeCanvas =
            canvas.parentElement
                ?.querySelector(
                    ".pdf-shape-canvas"
                );


        /*
         * If the shape was moved,
         * redraw and finish.
         */
/*
 * Tap without dragging =
 * fill the selected shape.
 */
if(
    selectedPdfShape &&
    !pdfShapeMoved
){

    const shapeCanvas =
        canvas.parentElement
            ?.querySelector(
                ".pdf-shape-canvas"
            );

    if(shapeCanvas){

        savePdfShapeUndoState(
            shapeCanvas
        );

    }
if(
    selectedPdfShape &&
    !pdfShapeMoved
){

    selectedPdfShape.fill =
        true;

    selectedPdfShape.fillColor =
        pdfEditorColor ===
        "transparent"
            ? "#0A1F5C"
            : pdfEditorColor;

    selectedPdfShape.fillOpacity =
        pdfEditorOpacity;

}
        if(shapeCanvas){

            redrawPdfShapes(
                shapeCanvas
            );

        }


        pdfShapeDragging =
            false;

        pdfShapeMoved =
            false;

        selectedPdfShape =
            null;

        pdfShapeDragOffsetX =
            0;

        pdfShapeDragOffsetY =
            0;


        try{

            canvas.releasePointerCapture(
                event.pointerId
            );

        }
        catch(error){}


        return;
    }


    /*
     * =======================================================
     * NEW SHAPE
     * =======================================================
     */

    if(
        activePdfTool ===
        "shape" &&
        isPdfDrawing
    ){

        const shapeCanvas =
            canvas.parentElement
                ?.querySelector(
                    ".pdf-shape-canvas"
                );


        const point =
            getPdfPoint(
                canvas,
                event
            );


        if(
            shapeCanvas &&
            pdfShapeStartPoint
        ){

            const width =
                Math.abs(
                    point.x -
                    pdfShapeStartPoint.x
                );

            const height =
                Math.abs(
                    point.y -
                    pdfShapeStartPoint.y
                );


            /*
             * Ignore accidental taps.
             */

            if(
                width > 4 &&
                height > 4
            ){

                const shape = {

                    type:
                        activePdfShape,

                    x:
                        Math.min(
                            pdfShapeStartPoint.x,
                            point.x
                        ),

                    y:
                        Math.min(
                            pdfShapeStartPoint.y,
                            point.y
                        ),

                    width:
                        width,

                    height:
                        height,


                    /*
                     * Fill settings
                     */

                    fill:
                        pdfShapeFill,

                    fillColor:
                        pdfEditorColor ===
                        "transparent"
                            ? "#0A1F5C"
                            : pdfEditorColor,

                    fillOpacity:
                        pdfEditorOpacity,


                    /*
                     * Border settings
                     */

                    border:
                        pdfShapeBorder,

                    borderColor:
                        pdfEditorColor ===
                        "transparent"
                            ? "#0A1F5C"
                            : pdfEditorColor,

                    borderOpacity:
                        100,

                    borderWidth:
                        pdfShapeBorderWidth

                };


                const shapes =
                    pdfShapeObjects.get(
                        shapeCanvas
                    ) || [];


savePdfShapeUndoState(
    shapeCanvas
);

shapes.push(
    shape
);

pdfShapeObjects.set(
    shapeCanvas,
    shapes
);


                redrawPdfShapes(
                    shapeCanvas
                );


                /*
                 * Save the completed
                 * shape edit.
                 */

                savePdfUndoState(
                    canvas
                );

            }

        }


        /*
         * Remove temporary preview.
         */

        if(
            pdfShapePreviewImage
        ){

            const context =
                canvas.getContext(
                    "2d"
                );

            context.putImageData(
                pdfShapePreviewImage,
                0,
                0
            );

        }


        pdfShapeStartPoint =
            null;

        pdfShapePreviewImage =
            null;

        isPdfDrawing =
            false;


        try{

            canvas.releasePointerCapture(
                event.pointerId
            );

        }
        catch(error){}


        return;
    }


    /*
     * =======================================================
     * DOODLE / HIGHLIGHT / ERASER
     * =======================================================
     */

    if(!isPdfDrawing){
        return;
    }


    if(canvas){

        savePdfUndoState(
            canvas
        );

    }


    lastPdfPoint =
        null;

    isPdfDrawing =
        false;


    try{

        canvas.releasePointerCapture(
            event.pointerId
        );

    }
    catch(error){}
}
}
/* ========================================================= */
/* PDF UNDO / REDO BUTTONS                                    */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        const undoButton =
            event.target.closest(
                "#pdf-editor-undo"
            );

if(undoButton){

    if(
        activePdfTool ===
        "shape"
    ){

        undoPdfShapeEdit();

    }else{

        undoPdfEdit();

    }

    return;
}


        const redoButton =
            event.target.closest(
                "#pdf-editor-redo"
            );

if(redoButton){

    if(
        activePdfTool ===
        "shape"
    ){

        redoPdfShapeEdit();

    }else{

        redoPdfEdit();

    }

    return;
}
const saveButton =
    event.target.closest(
        "#pdf-editor-save"
    );

if(saveButton){

    savePdfEdits();

    return;
}
    }
);
/* ========================================================= */
/* PDF ERASER BUTTON                                          */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        const eraseButton =
            event.target.closest(
                "#pdf-editor-erase"
            );


        if(!eraseButton){
            return;
        }


        /*
         * Activate eraser mode.
         */

        activePdfTool =
            "eraser";


        /*
         * Keep the editor panel open.
         */

        const editorPanel =
            document.getElementById(
                "pdf-editor-panel"
            );


        if(editorPanel){

            editorPanel.classList.add(
                "active"
            );

        }


        /*
         * Mark Erase as active.
         */

        document
            .querySelectorAll(
                "#pdf-editor-actions .pdf-editor-action-btn"
            )
            .forEach(
                button => {

                    button.classList.remove(
                        "active"
                    );

                }
            );


        eraseButton.classList.add(
            "active"
        );


        /*
         * Reconnect annotation
         * canvases to eraser mode.
         */

        setupPdfAnnotationCanvas();

    }
);

/* ========================================================= */
/* PDF EDITOR CANCEL                                          */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        const cancelButton =
            event.target.closest(
                "#pdf-editor-cancel"
            );


        if(!cancelButton){
            return;
        }


        const editorPanel =
            document.getElementById(
                "pdf-editor-panel"
            );


        const toolsButton =
            document.getElementById(
                "pdf-tools-button"
            );


        const toolsIcon =
            toolsButton?.querySelector(
                ".material-symbols-rounded"
            );


        if(editorPanel){

            editorPanel.classList.remove(
                "active"
            );

        }


        activePdfTool =
            null;


        activePdfAnnotationCanvas =
            null;


        isPdfDrawing =
            false;


        lastPdfPoint =
            null;


        if(toolsIcon){

            toolsIcon.textContent =
                "menu";

        }


        setupPdfAnnotationCanvas();

    }
);
/* ========================================================= */
/* PDF EDITOR HORIZONTAL CLOSE / CANCEL                      */
/* ========================================================= */

document.addEventListener(
    "pointerup",
    event => {

        const closeButton =
            event.target.closest(
                "#pdf-editor-cancel"
            );

        if(!closeButton){
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const editorPanel =
            document.getElementById(
                "pdf-editor-panel"
            );

        const toolsButton =
            document.getElementById(
                "pdf-tools-button"
            );

        const toolsIcon =
            toolsButton?.querySelector(
                ".material-symbols-rounded"
            );

        if(editorPanel){

            editorPanel.classList.remove(
                "active"
            );

        }

        activePdfTool =
            null;

        activePdfAnnotationCanvas =
            null;

        isPdfDrawing =
            false;

        lastPdfPoint =
            null;

        pdfShapeDragging =
            false;

        pdfShapeMoved =
            false;

        selectedPdfShape =
            null;

        if(pdfActiveTextElement){

            pdfActiveTextElement.remove();

            pdfActiveTextElement =
                null;

        }

        if(toolsIcon){

            toolsIcon.textContent =
                "menu";

        }

        setupPdfAnnotationCanvas();

    },
    {
        passive:false
    }
);
/* ========================================================= */
/* PDF EDITOR PANEL — SAFE OUTSIDE TAP                       */
/* ========================================================= */

document.addEventListener(
    "pointerdown",
    event => {

        const editorPanel =
            document.getElementById(
                "pdf-editor-panel"
            );

        if(
            !editorPanel ||
            !editorPanel.classList.contains(
                "active"
            )
        ){
            return;
        }

        /*
         * IMPORTANT:
         * Never close the editor panel by
         * tapping on the PDF.
         *
         * Doodle, highlight, shape and
         * eraser must continue working.
         */
        if(
            editorPanel.contains(
                event.target
            )
        ){
            return;
        }

        /*
         * Only the dedicated cancel/close
         * control is allowed to close it.
         */
        if(
            event.target.closest(
                "#pdf-editor-cancel"
            )
        ){
            return;
        }

    },
    {
        passive:true
    }
);
/* ========================================================= */
/* DOWNLOAD                                                   */
/* ========================================================= */

document.addEventListener(
    "click",
    event => {

        const downloadButton =
            event.target.closest(
                "#pdf-download-button"
            );


        if(
            !downloadButton ||
            !currentPdfAttachment
        ){

            return;

        }


        /*
         * Never send Books through
         * the PDF attachment system.
         */

        const attachmentType =
            String(
                currentPdfAttachment.type ||
                currentPdfAttachment.kind ||
                currentPdfAttachment.id ||
                ""
            )
            .trim()
            .toLowerCase();


        if(
            attachmentType ===
            "books"
        ){

            return;

        }


        /*
         * Use the central KEDU
         * PDF download manager.
         */

        if(
            window.KEDUDownload &&
            typeof
                window.KEDUDownload
                    .startPdfAttachmentDownload ===
                "function"
        ){

            window.KEDUDownload
                .startPdfAttachmentDownload(
                    currentPdfAttachment
                );

            return;

        }


        /*
         * Safety fallback if
         * download.js is unavailable.
         */

        const pdfPath =
            currentPdfAttachment.file ||
            currentPdfAttachment.url ||
            currentPdfAttachment.path ||
            currentPdfAttachment.pdf ||
            currentPdfAttachment.src ||
            `assets/pdf/lecture-notes/${currentPdfAttachment.id}.pdf`;


        const link =
            document.createElement(
                "a"
            );


        link.href =
            pdfPath;


        link.download =
            `${
                currentPdfAttachment.title ||
                "KEDU-PDF"
            }.pdf`;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();

    }
);
/* ========================================================= */
/* SHARE                                                       */
/* ========================================================= */

document.addEventListener("click", event => {

    const shareButton =
        event.target.closest("#pdf-share-button");

    if(!shareButton || !currentPdfAttachment){
        return;
    }

    const shareText =
        currentPdfAttachment.title || "KEDU Academy PDF";

    if(navigator.share){

        navigator.share({
            title:shareText,
            text:`${shareText} - KEDU Academy`
        });

    }else{

        console.log(
            "KEDU: Native sharing is not available."
        );

    }

});


/* ========================================================= */
/* ESCAPE                                                      */
/* ========================================================= */

document.addEventListener("keydown", event => {

    if(event.key !== "Escape"){
        return;
    }

    closePdfViewer();

});
/* ========================================================= */
/* ATTACHMENT PDF PREVIEW                                    */
/* ========================================================= */

function toggleAttachmentPreview(item, attachment){

    if(!item){
        return;
    }

    const wasOpen =
        item.classList.contains("pdf-expanded");

    document
        .querySelectorAll(
            "#attachment-list .attachment-material-item"
        )
        .forEach(otherItem => {

            otherItem.classList.remove(
                "pdf-expanded"
            );

        });

    if(!wasOpen){

        item.classList.add(
            "pdf-expanded"
        );

    }

}

/* ========================================================= */
/* LOAD KEDU PDF — FIXED HTTP / SAME-ORIGIN VERSION         */
/* ========================================================= */

async function loadKeduPdf(pdfPath){

    const canvas =
        document.getElementById(
            "kedu-pdf-canvas"
        );

    if(!canvas){

        console.error(
            "KEDU PDF ERROR: Canvas missing."
        );

        return;
    }


    const loadToken =
        ++pdfLoadToken;


    try{

        /* ================================================= */
        /* STOP PREVIOUS PDF RENDER                          */
        /* ================================================= */

        if(activePdfRenderTask){

            try{

                activePdfRenderTask.cancel();

            }catch(error){

                console.warn(
                    "KEDU: Previous PDF render already stopped."
                );

            }

            activePdfRenderTask =
                null;

        }


        /* ================================================= */
        /* CREATE CORRECT ABSOLUTE PDF URL                   */
        /* ================================================= */

        const safePdfPath =
            new URL(
                pdfPath,
                document.baseURI
            ).href;


        console.log(
            "KEDU: Loading PDF:",
            safePdfPath
        );


        /* ================================================= */
        /* LOAD PDF.JS FIRST                                 */
        /* ================================================= */

        if(
            typeof pdfjsLib ===
            "undefined"
        ){

            await new Promise(
                (
                    resolve,
                    reject
                ) => {

                    const script =
                        document.createElement(
                            "script"
                        );


                    script.src =
                        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";


                    script.onload =
                        resolve;


                    script.onerror =
                        () =>
                            reject(
                                new Error(
                                    "PDF.js failed to load."
                                )
                            );


                    document.head.appendChild(
                        script
                    );

                }
            );


            pdfjsLib
                .GlobalWorkerOptions
                .workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        }


        /* ================================================= */
        /* IGNORE OLD REQUEST                                */
        /* ================================================= */

        if(
            loadToken !==
            pdfLoadToken
        ){

            return;

        }


        /* ================================================= */
        /* FETCH PDF — SAME ORIGIN                          */
        /* ================================================= */

        let response =
            await fetch(
                safePdfPath,
                {
                    method:
                        "GET",

                    credentials:
                        "same-origin",

                    mode:
                        "same-origin",

                    cache:
                        "default",

                    headers:
                        {
                            "Accept":
                                "application/pdf,application/octet-stream,*/*"
                        }
                }
            );


        /* ================================================= */
        /* SECOND ATTEMPT                                    */
        /* ================================================= */

        if(
            !response.ok
        ){

            console.warn(
                "KEDU: First PDF request failed:",
                response.status,
                response.statusText
            );


            /*
             * Retry the same PDF without custom headers.
             */
            response =
                await fetch(
                    safePdfPath,
                    {
                        method:
                            "GET",

                        credentials:
                            "same-origin",

                        mode:
                            "same-origin",

                        cache:
                            "default"
                    }
                );


            /*
             * If the lecture-specific PDF is forbidden,
             * try the known working lecture-notes PDF.
             */
            if(
                !response.ok &&
                pdfEmbeddedInLecturePlayer
            ){

                const fallbackPdfPath =
                    new URL(
                        "assets/pdf/lecture-notes/lecture-notes.pdf",
                        document.baseURI
                    ).href;

                console.warn(
                    "KEDU: Trying fallback PDF:",
                    fallbackPdfPath
                );

                response =
                    await fetch(
                        fallbackPdfPath,
                        {
                            method:
                                "GET",

                            credentials:
                                "same-origin",

                            mode:
                                "same-origin",

                            cache:
                                "default"
                        }
                    );
            }
        }


        /* ================================================= */
        /* CHECK FINAL RESPONSE                              */
        /* ================================================= */

        if(
            !response.ok
        ){

            throw new Error(
                `PDF HTTP ${response.status}: ${response.statusText}`
            );
        }
        /* ================================================= */
        /* READ PDF DATA                                     */
        /* ================================================= */

        const pdfData =
            await response.arrayBuffer();


        if(
            !pdfData ||
            pdfData.byteLength === 0
        ){

            throw new Error(
                "PDF file is empty."
            );

        }


        /* ================================================= */
        /* IGNORE OLD REQUEST AGAIN                          */
        /* ================================================= */

        if(
            loadToken !==
            pdfLoadToken
        ){

            return;

        }


        console.log(
            "KEDU: PDF downloaded successfully:",
            pdfData.byteLength,
            "bytes"
        );


        /* ================================================= */
        /* RENDER PDF                                        */
        /* ================================================= */

        await renderKeduPdf(
            pdfData,
            loadToken
        );


        /* ================================================= */
        /* UPDATE PAGE TRACKER AFTER RENDER                  */
        /* ================================================= */

        requestAnimationFrame(
            () => {

                requestAnimationFrame(
                    () => {

                        updatePdfPageCounter();

                    }
                );

            }
        );


    }catch(error){

        /* ================================================= */
        /* IGNORE OLD / CANCELLED RENDER                    */
        /* ================================================= */

        if(
            loadToken !==
            pdfLoadToken
        ){

            return;

        }


        if(
            error?.name ===
            "RenderingCancelledException"
        ){

            return;

        }


        /* ================================================= */
        /* CLEAR CURRENT PDF STATE                           */
        /* ================================================= */

        currentPdfDocument =
            null;


        /* ================================================= */
        /* CONSOLE ERROR                                     */
        /* ================================================= */

        console.error(
            "KEDU PDF ERROR:",
            error?.name ||
                "UnknownError",
            error?.message ||
                error
        );


        console.error(
            "KEDU PDF PATH:",
            pdfPath
        );


        /*
         * Show a useful error instead of
         * leaving the old PDF page visible.
         */

        const counter =
            document.getElementById(
                "pdf-page-counter"
            );


        if(counter){

            counter.textContent =
                "PDF Error";

        }

    }

}


/* ========================================================= */
/* RENDER KEDU PDF START                                     */
/* ========================================================= */

/* ========================================================= */
/* RENDER KEDU PDF — LAZY / PROGRESSIVE ENGINE              */
/* ========================================================= */

let pdfRenderedPages =
    new Set();

let pdfRenderingPages =
    new Map();

let pdfPageViewportData =
    new Map();

let pdfPageObserver =
    null;

let pdfRenderQueue =
    [];

let pdfRenderQueueRunning =
    false;


/* ========================================================= */
/* CREATE PDF PAGE LAYER                                     */
/* ========================================================= */

function createKeduPdfPageLayer(
    pageNumber,
    totalPages,
    width,
    height
){

    const container =
        document.getElementById(
            "pdf-document-container"
        );

    if(!container){
        return null;
    }


    const existing =
        container.querySelector(
            `.pdf-page-layer[data-page-number="${pageNumber}"]`
        );

    if(existing){
        return existing;
    }


    const pageLayer =
        document.createElement(
            "div"
        );


    pageLayer.className =
        "pdf-page-layer";


    pageLayer.dataset.pageNumber =
        pageNumber;


    pageLayer.dataset.totalPages =
        totalPages;


    pageLayer.dataset.pdfRendered =
        "false";


    pageLayer.style.position =
        "relative";


    pageLayer.style.width =
        "100%";


    pageLayer.style.minHeight =
        `${height}px`;


    /*
     * Reserve the correct page
     * height before rendering.
     */
    pageLayer.style.aspectRatio =
        `${width} / ${height}`;


    /*
     * PDF canvas
     */
    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.className =
        "pdf-page-canvas";


    canvas.style.display =
        "block";


    canvas.style.width =
        "100%";


    canvas.style.height =
        "100%";


    canvas.style.background =
        "#ffffff";


    /*
     * Annotation canvas
     */
    const annotationCanvas =
        document.createElement(
            "canvas"
        );


    annotationCanvas.className =
        "pdf-annotation-canvas";


    annotationCanvas.style.position =
        "absolute";


    annotationCanvas.style.left =
        "0";


    annotationCanvas.style.top =
        "0";


    annotationCanvas.style.width =
        "100%";


    annotationCanvas.style.height =
        "100%";


    annotationCanvas.style.pointerEvents =
        activePdfTool
            ? "auto"
            : "none";


    annotationCanvas.style.zIndex =
        "3";


    /*
     * Shape canvas
     */
    const shapeCanvas =
        document.createElement(
            "canvas"
        );


    shapeCanvas.className =
        "pdf-shape-canvas";


    shapeCanvas.style.position =
        "absolute";


    shapeCanvas.style.left =
        "0";


    shapeCanvas.style.top =
        "0";


    shapeCanvas.style.width =
        "100%";


    shapeCanvas.style.height =
        "100%";


    shapeCanvas.style.pointerEvents =
        "none";


    shapeCanvas.style.zIndex =
        "2";


    /*
     * Keep shape storage.
     */
    pdfShapeObjects.set(
        shapeCanvas,
        []
    );


    /*
     * Add canvases.
     */
    pageLayer.appendChild(
        canvas
    );


    pageLayer.appendChild(
        shapeCanvas
    );


    pageLayer.appendChild(
        annotationCanvas
    );


    container.appendChild(
        pageLayer
    );


    /*
     * Connect drawing handlers.
     */
    annotationCanvas.onpointerdown =
        startPdfMark;


    annotationCanvas.onpointermove =
        drawPdfMark;


    annotationCanvas.onpointerup =
        stopPdfMark;


    annotationCanvas.onpointercancel =
        stopPdfMark;


    return pageLayer;
}
/* ========================================================= */
/* PDF HIGH QUALITY RENDER SETTINGS                          */
/* ========================================================= */

let pdfQualityRenderToken = 0;

function getPdfRenderScale(){

    const deviceScale =
        window.devicePixelRatio ||
        1;

    /*
     * Keep PDF text and diagrams sharp
     * on normal and high-density screens.
     *
     * Limit the value so very large PDFs
     * do not consume excessive memory.
     */
    return Math.min(
        2.5,
        Math.max(
            1.5,
            deviceScale
        )
    );

}
/* ========================================================= */
/* HIGH QUALITY PDF PAGE RENDER                              */
/* ========================================================= */

function queuePdfHighQualityRender(
    pageNumber,
    loadToken,
    qualityToken
){

    if(
        !currentPdfDocument ||
        loadToken !== pdfLoadToken ||
        qualityToken !== pdfQualityRenderToken
    ){
        return;
    }

    if(
        pdfRenderingPages.has(
            pageNumber
        )
    ){
        return;
    }

    const renderPromise =
        renderPdfPageAtQuality(
            pageNumber,
            loadToken,
            qualityToken
        );

    pdfRenderingPages.set(
        pageNumber,
        renderPromise
    );

    renderPromise
        .catch(error => {

            if(
                error?.name !==
                "RenderingCancelledException"
            ){

                console.error(
                    `KEDU HIGH QUALITY PDF PAGE ${pageNumber} ERROR:`,
                    error
                );

            }

        })
        .finally(() => {

            pdfRenderingPages.delete(
                pageNumber
            );

        });
}


async function renderPdfPageAtQuality(
    pageNumber,
    loadToken,
    qualityToken
){

    const pdf =
        currentPdfDocument;

    if(
        !pdf ||
        loadToken !== pdfLoadToken ||
        qualityToken !== pdfQualityRenderToken
    ){
        return;
    }

    const pdfPage =
        await pdf.getPage(
            pageNumber
        );

    if(
        loadToken !== pdfLoadToken ||
        qualityToken !== pdfQualityRenderToken
    ){
        return;
    }

    const pageLayer =
        document.querySelector(
            `.pdf-page-layer[data-page-number="${pageNumber}"]`
        );

    if(!pageLayer){
        return;
    }

    const canvas =
        pageLayer.querySelector(
            ".pdf-page-canvas"
        );

    if(!canvas){
        return;
    }

    const container =
        document.getElementById(
            "pdf-document-container"
        );

    if(!container){
        return;
    }

    /*
     * Display-size viewport.
     *
     * Do NOT include zoom here because
     * CSS page zoom already controls the
     * physical display size.
     */
    const availableWidth =
        Math.max(
            280,
            container.clientWidth - 24
        );

    const baseViewport =
        pdfPage.getViewport({
            scale: 1
        });

    const displayScale =
        availableWidth /
        baseViewport.width;

    const viewport =
        pdfPage.getViewport({
            scale:
                displayScale
        });

    /*
     * High-resolution backing canvas.
     *
     * Zoom increases the actual number
     * of rendered pixels instead of
     * stretching the old bitmap.
     */
    const renderScale =
        getPdfRenderScale();

    const outputWidth =
        Math.ceil(
            viewport.width *
            renderScale
        );

    const outputHeight =
        Math.ceil(
            viewport.height *
            renderScale
        );

    canvas.width =
        outputWidth;

    canvas.height =
        outputHeight;

    /*
     * Keep CSS dimensions at the normal
     * PDF page size. The pageLayer.zoom
     * handles the visual zoom.
     */
    canvas.style.width =
        "100%";

    canvas.style.height =
        "100%";

    /*
     * Render the PDF itself at high
     * resolution.
     */
    const renderViewport =
        pdfPage.getViewport({
            scale:
                displayScale *
                renderScale
        });

    const context =
        canvas.getContext(
            "2d",
            {
                alpha: false
            }
        );

    if(!context){
        return;
    }

    context.imageSmoothingEnabled =
        true;

    const renderContext = {
        canvasContext:
            context,

        viewport:
            renderViewport
    };

    const renderTask =
        pdfPage.render(
            renderContext
        );

    activePdfRenderTask =
        renderTask;

    await renderTask.promise;

    if(
        loadToken !== pdfLoadToken ||
        qualityToken !== pdfQualityRenderToken
    ){
        return;
    }

    activePdfRenderTask =
        null;

    pageLayer.dataset.pdfRendered =
        "true";

    pdfRenderedPages.add(
        pageNumber
    );

    /*
     * Shapes are vector-like objects stored
     * separately, so redraw them after the
     * PDF canvas has been resized.
     */
    const shapeCanvas =
        pageLayer.querySelector(
            ".pdf-shape-canvas"
        );

    if(shapeCanvas){

        const shapes =
            pdfShapeObjects.get(
                shapeCanvas
            ) || [];

        shapeCanvas.width =
            outputWidth;

        shapeCanvas.height =
            outputHeight;

        shapeCanvas.style.width =
            "100%";

        shapeCanvas.style.height =
            "100%";

        /*
         * Convert stored shape coordinates
         * back to display-space before drawing.
         */
redrawPdfShapes(
    shapeCanvas
);

    /*
     * Restore saved annotations after
     * the high-resolution PDF render.
     */
    restorePdfEditsForPage(
        pageNumber
    );
}

}

/* ========================================================= */
/* RENDER ONE PDF PAGE                                       */
/* ========================================================= */

async function renderKeduPdfPage(
    pageNumber,
    loadToken
){

    if(
        loadToken !==
        pdfLoadToken
    ){
        return;
    }


    if(
        pdfRenderedPages.has(
            pageNumber
        )
    ){
        return;
    }


    if(
        pdfRenderingPages.has(
            pageNumber
        )
    ){
        return;
    }


    const pdf =
        currentPdfDocument;


    if(!pdf){
        return;
    }


    const viewportData =
        pdfPageViewportData.get(
            pageNumber
        );


    if(!viewportData){
        return;
    }


    const renderPromise =
        (async () => {

            const pdfPage =
                await pdf.getPage(
                    pageNumber
                );


            if(
                loadToken !==
                pdfLoadToken
            ){
                return;
            }


            const pageLayer =
                document.querySelector(
                    `.pdf-page-layer[data-page-number="${pageNumber}"]`
                );


            if(!pageLayer){
                return;
            }


            const canvas =
                pageLayer.querySelector(
                    ".pdf-page-canvas"
                );


            const annotationCanvas =
                pageLayer.querySelector(
                    ".pdf-annotation-canvas"
                );


            const shapeCanvas =
                pageLayer.querySelector(
                    ".pdf-shape-canvas"
                );


            if(
                !canvas ||
                !annotationCanvas ||
                !shapeCanvas
            ){
                return;
            }


            /*
             * Use the same responsive
             * width calculation as the
             * original viewer.
             */
            const container =
                document.getElementById(
                    "pdf-document-container"
                );


            const availableWidth =
                Math.max(
                    280,
                    container.clientWidth - 24
                );


            const baseViewport =
                pdfPage.getViewport({
                    scale:1
                });


            const scale =
                availableWidth /
                baseViewport.width;


            const viewport =
                pdfPage.getViewport({
                    scale:scale
                });


            /*
             * Set real canvas dimensions.
             */
const renderScale =
    getPdfRenderScale();

const renderViewport =
    pdfPage.getViewport({
        scale:
            scale *
            renderScale
    });

canvas.width =
    Math.ceil(
        renderViewport.width
    );

canvas.height =
    Math.ceil(
        renderViewport.height
    );


            annotationCanvas.width =
                Math.ceil(
                    viewport.width
                );


            annotationCanvas.height =
                Math.ceil(
                    viewport.height
                );


            shapeCanvas.width =
                Math.ceil(
                    viewport.width
                );


            shapeCanvas.height =
                Math.ceil(
                    viewport.height
                );


            pageLayer.style.minHeight =
                `${viewport.height}px`;


            pageLayer.style.aspectRatio =
                `${viewport.width} / ${viewport.height}`;


            /*
             * Initial undo state.
             */
            const context =
                annotationCanvas
                    .getContext(
                        "2d"
                    );


            const undoStack =
                getPdfHistoryStack(
                    pdfUndoHistory,
                    annotationCanvas
                );


            undoStack.length = 0;


            try{

                undoStack.push(
                    context.getImageData(
                        0,
                        0,
                        annotationCanvas.width,
                        annotationCanvas.height
                    )
                );

            }catch(error){

                console.warn(
                    "KEDU: Initial PDF history state could not be created.",
                    error
                );

            }


            /*
             * Draw PDF page.
             */
            const renderContext = {
                canvasContext:
                    canvas.getContext(
                        "2d"
                    ),

                viewport:
    renderViewport
            };


            activePdfRenderTask =
                pdfPage.render(
                    renderContext
                );


            await activePdfRenderTask.promise;


            activePdfRenderTask =
                null;


            if(
                loadToken !==
                pdfLoadToken
            ){
                return;
            }


            pageLayer.dataset.pdfRendered =
                "true";


            pdfRenderedPages.add(
                pageNumber
            );


            /*
             * Restore saved edits
             * after the page exists.
             */
            restorePdfEditsForPage(
                pageNumber
            );


        })();


    pdfRenderingPages.set(
        pageNumber,
        renderPromise
    );


    try{

        await renderPromise;

    }catch(error){

        if(
            error?.name !==
            "RenderingCancelledException"
        ){

            console.error(
                `KEDU PDF PAGE ${pageNumber} ERROR:`,
                error
            );

        }

    }finally{

        pdfRenderingPages.delete(
            pageNumber
        );

        activePdfRenderTask =
            null;

    }

}


/* ========================================================= */
/* RENDER QUEUE                                               */
/* ========================================================= */

function queuePdfPageRender(
    pageNumber,
    loadToken
){

    if(
        !currentPdfDocument ||
        loadToken !== pdfLoadToken
    ){
        return;
    }


    if(
        pdfRenderedPages.has(
            pageNumber
        )
    ){
        return;
    }


    if(
        pdfRenderingPages.has(
            pageNumber
        )
    ){
        return;
    }


    if(
        pdfRenderQueue.includes(
            pageNumber
        )
    ){
        return;
    }


    pdfRenderQueue.push(
        pageNumber
    );


    runPdfRenderQueue(
        loadToken
    );

}


/* ========================================================= */
/* RUN RENDER QUEUE                                          */
/* ========================================================= */

async function runPdfRenderQueue(
    loadToken
){

    if(pdfRenderQueueRunning){
        return;
    }


    pdfRenderQueueRunning =
        true;


    try{

        while(
            pdfRenderQueue.length
        ){

            if(
                loadToken !==
                pdfLoadToken
            ){
                pdfRenderQueue.length = 0;
                break;
            }


            const pageNumber =
                pdfRenderQueue.shift();


            await renderKeduPdfPage(
                pageNumber,
                loadToken
            );

        }

    }finally{

        pdfRenderQueueRunning =
            false;

    }

}


/* ========================================================= */
/* LAZY PAGE OBSERVER                                        */
/* ========================================================= */

function setupPdfLazyRendering(
    loadToken
){

    if(pdfPageObserver){

        try{
            pdfPageObserver.disconnect();
        }catch(error){
            console.warn(
                "KEDU: Previous PDF observer could not be disconnected.",
                error
            );
        }

    }


    const viewer =
        document.getElementById(
            "pdf-viewer-content"
        );


    if(!viewer){
        return;
    }


    pdfPageObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if(
                            !entry.isIntersecting
                        ){
                            return;
                        }


                        const pageNumber =
                            Number(
                                entry
                                    .target
                                    .dataset
                                    .pageNumber
                            );


                        if(
                            !pageNumber
                        ){
                            return;
                        }


                        /*
                         * Render current page.
                         */
                        queuePdfPageRender(
                            pageNumber,
                            loadToken
                        );


                        /*
                         * Render one page
                         * before and two pages
                         * after it.
                         */
                        queuePdfPageRender(
                            pageNumber - 1,
                            loadToken
                        );


                        queuePdfPageRender(
                            pageNumber + 1,
                            loadToken
                        );


                        queuePdfPageRender(
                            pageNumber + 2,
                            loadToken
                        );

                    }
                );

            },
            {
                root:
                    viewer,

                rootMargin:
                    "1200px 0px 1200px 0px",

                threshold:
                    0.01
            }
        );


    document
        .querySelectorAll(
            ".pdf-page-layer"
        )
        .forEach(
            pageLayer => {

                pdfPageObserver.observe(
                    pageLayer
                );

            }
        );

}


/* ========================================================= */
/* MAIN PDF RENDER FUNCTION                                  */
/* ========================================================= */

async function renderKeduPdf(
    pdfData,
    loadToken
){
    pdfQualityRenderToken++;

    const qualityToken =
        pdfQualityRenderToken;
    const container =
        document.getElementById(
            "pdf-document-container"
        );


    if(!container){
        return;
    }


    try{

        const pdf =
            await pdfjsLib
                .getDocument({
                    data:
                        pdfData
                })
                .promise;


        if(
            loadToken !==
            pdfLoadToken
        ){
            return;
        }


        currentPdfDocument =
            pdf;


        /*
         * Reset lazy-render state.
         */
        pdfRenderedPages.clear();

        pdfRenderingPages.clear();

        pdfPageViewportData.clear();

        pdfRenderQueue.length = 0;

        pdfRenderQueueRunning =
            false;


        /*
         * Disconnect old observer.
         */
        if(pdfPageObserver){

            try{
                pdfPageObserver.disconnect();
            }catch(error){
                console.warn(
                    "KEDU: Old PDF observer cleanup failed.",
                    error
                );
            }

            pdfPageObserver =
                null;

        }


        /*
         * Remove old page layers.
         */
        container
            .querySelectorAll(
                ".pdf-page-layer"
            )
            .forEach(
                page => page.remove()
            );


        /*
         * Remove old single canvas.
         */
        const oldCanvas =
            document.getElementById(
                "kedu-pdf-canvas"
            );


        if(oldCanvas){
            oldCanvas.remove();
        }


        /*
         * Update total page count.
         */
        const pageCounter =
            document.getElementById(
                "pdf-page-counter"
            );
const embeddedPdfPage =
    document.getElementById("pdf-viewer-page");

        if(pageCounter){

            pageCounter.textContent =
                `1/${pdf.numPages}`;

        }


        /*
         * Calculate the responsive
         * display size.
         */
        const availableWidth =
            Math.max(
                280,
                container.clientWidth - 24
            );


        /*
         * Create lightweight
         * placeholders for every page.
         *
         * IMPORTANT:
         * We get page dimensions only.
         * We DO NOT render page images here.
         */
        for(
            let pageNumber = 1;
            pageNumber <= pdf.numPages;
            pageNumber++
        ){

            if(
                loadToken !==
                pdfLoadToken
            ){
                return;
            }


            const pdfPage =
                await pdf.getPage(
                    pageNumber
                );


            const baseViewport =
                pdfPage.getViewport({
                    scale:1
                });


            const scale =
                availableWidth /
                baseViewport.width;


            const width =
                availableWidth;


            const height =
                baseViewport.height *
                scale;


            pdfPageViewportData.set(
                pageNumber,
                {
                    width,
                    height
                }
            );


            createKeduPdfPageLayer(
                pageNumber,
                pdf.numPages,
                width,
                height
            );

        }


        /*
         * Start lazy rendering.
         */
        setupPdfLazyRendering(
            loadToken
        );


        /*
         * Render the first three
         * pages immediately.
         */
        queuePdfPageRender(
            1,
            loadToken
        );


        queuePdfPageRender(
            2,
            loadToken
        );


        queuePdfPageRender(
            3,
            loadToken
        );


        /*
         * Restore saved edits for
         * pages that are already rendered.
         */
        setTimeout(
            () => {

                restorePdfEdits();

                setupPdfPageTracking();

            },
            50
        );


        console.log(
            "KEDU: PDF lazy rendering enabled:",
            pdf.numPages,
            "pages"
        );


    }catch(error){

        activePdfRenderTask =
            null;


        if(
            error?.name ===
            "RenderingCancelledException"
        ){
            return;
        }


        console.error(
            "KEDU PDF RENDER ERROR:",
            error
        );


        throw error;

    }

}


/* ========================================================= */
/* RESTORE ONE PAGE'S EDITS                                  */
/* ========================================================= */

function restorePdfEditsForPage(
    pageNumber
){

    const saveKey =
        getPdfSaveKey();


    if(!saveKey){
        return;
    }


    let savedData = null;


    try{

        const rawData =
            localStorage.getItem(
                saveKey
            );


        if(!rawData){
            return;
        }


        savedData =
            JSON.parse(
                rawData
            );

    }catch(error){

        console.error(
            "KEDU: Unable to read saved PDF edits.",
            error
        );

        return;

    }


    if(
        !savedData ||
        !Array.isArray(
            savedData.pages
        )
    ){
        return;
    }


    const savedPage =
        savedData.pages.find(
            page =>
                Number(
                    page.pageNumber
                ) ===
                Number(
                    pageNumber
                )
        );


    if(!savedPage){
        return;
    }


    const pageLayer =
        document.querySelector(
            `.pdf-page-layer[data-page-number="${pageNumber}"]`
        );


    if(!pageLayer){
        return;
    }


    const annotationCanvas =
        pageLayer.querySelector(
            ".pdf-annotation-canvas"
        );


    const shapeCanvas =
        pageLayer.querySelector(
            ".pdf-shape-canvas"
        );


    /*
     * Restore annotation image.
     */
    if(
        annotationCanvas &&
        savedPage.image
    ){

        const image =
            new Image();


        image.onload =
            () => {

                const context =
                    annotationCanvas
                        .getContext(
                            "2d"
                        );


                context.clearRect(
                    0,
                    0,
                    annotationCanvas.width,
                    annotationCanvas.height
                );


                context.drawImage(
                    image,
                    0,
                    0,
                    annotationCanvas.width,
                    annotationCanvas.height
                );

            };


        image.src =
            savedPage.image;

    }


    /*
     * Restore editable shapes.
     */
    if(
        shapeCanvas &&
        Array.isArray(
            savedPage.shapes
        )
    ){

        const restoredShapes =
            savedPage.shapes.map(
                shape => ({

                    type:
                        shape.type,

                    x:
                        shape.x,

                    y:
                        shape.y,

                    width:
                        shape.width,

                    height:
                        shape.height,

                    fill:
                        Boolean(
                            shape.fill
                        ),

                    fillColor:
                        shape.fillColor ||
                        "#0A1F5C",

                    fillOpacity:
                        Number(
                            shape.fillOpacity ??
                            35
                        ),

                    border:
                        Boolean(
                            shape.border
                        ),

                    borderColor:
                        shape.borderColor ||
                        "#0A1F5C",

                    borderOpacity:
                        Number(
                            shape.borderOpacity ??
                            100
                        ),

                    borderWidth:
                        Number(
                            shape.borderWidth ??
                            3
                        )

                })
            );


        pdfShapeObjects.set(
            shapeCanvas,
            restoredShapes
        );


        redrawPdfShapes(
            shapeCanvas
        );

    }

}
/* ========================================================= */
/* RENDER KEDU PDF END                                       */
/* ========================================================= */
/* ========================================================= */
/* PDF PAGE TRACKING                                          */
/* ========================================================= */

function getPdfTrackingScrollElement(){

    const viewer =
        document.getElementById(
            "pdf-viewer-content"
        );

    const documentContainer =
        document.getElementById(
            "pdf-document-container"
        );

    if(!viewer){
        return null;
    }

    const candidates = [
        documentContainer,
        viewer
    ].filter(Boolean);

    /*
     * Find the element that is actually
     * responsible for vertical scrolling.
     */
    for(
        const element of candidates
    ){

        const style =
            window.getComputedStyle(
                element
            );

        const canScroll =
            element.scrollHeight >
            element.clientHeight + 2 &&
            /(auto|scroll)/.test(
                style.overflowY
            );

        if(canScroll){
            return element;
        }

    }

    return viewer;

}


/* ========================================================= */
/* UPDATE EXACT PDF PAGE NUMBER                              */
/* ========================================================= */

/* ========================================================= */
/* UPDATE EXACT PDF PAGE NUMBER                              */
/* EMBEDDED + NORMAL PDF VIEWER SUPPORT                     */
/* ========================================================= */

function updatePdfPageCounter(){

    const viewer =
        document.getElementById(
            "pdf-viewer-content"
        );

const pageCounter =
    document.getElementById(
        "pdf-page-counter"
    );

const embeddedPdfPage =
    document.getElementById(
        "pdf-viewer-page"
    );

if(
    !viewer ||
    !pageCounter
){
    return;
}

if(pdfEmbeddedInLecturePlayer && embeddedPdfPage){
    pageCounter.style.top =
        `${Math.max(72, embeddedPdfPage.getBoundingClientRect().top + 72)}px`;
}

const pages =
    viewer.querySelectorAll(
        ".pdf-page-layer"
    );



    if(!pages.length){
        return;
    }

    const totalPages =
        currentPdfDocument?.numPages ||
        Number(
            pages[0]?.dataset.totalPages
        );

    if(!totalPages){
        return;
    }


    /*
     * IMPORTANT:
     * The PDF itself is always scrolled
     * inside #pdf-viewer-content.
     */
    const trackingViewport =
        viewer;

    /*
     * Do not use #lecture-player-page
     * as the PDF tracking viewport.
     */


    const viewportRect =
        trackingViewport.getBoundingClientRect();


    const viewportTop =
        Math.max(
            viewportRect.top,
            0
        );

    const viewportBottom =
        Math.min(
            viewportRect.bottom,
            window.innerHeight
        );


    if(
        viewportBottom <=
        viewportTop
    ){
        return;
    }


    const viewportCenter =
        (
            viewportTop +
            viewportBottom
        ) / 2;


    let bestPage = null;
    let bestVisibleHeight = -1;
    let bestCenterDistance = Infinity;


    pages.forEach(
        page => {

            const pageNumber =
                Number(
                    page.dataset.pageNumber
                );

            if(
                !Number.isFinite(
                    pageNumber
                )
            ){
                return;
            }


            const pageRect =
                page.getBoundingClientRect();


            /*
             * Calculate the portion of
             * this page visible inside
             * the CURRENT viewport.
             */

            const visibleTop =
                Math.max(
                    pageRect.top,
                    viewportTop
                );


            const visibleBottom =
                Math.min(
                    pageRect.bottom,
                    viewportBottom
                );


            const visibleHeight =
                Math.max(
                    0,
                    visibleBottom -
                    visibleTop
                );


            if(
                visibleHeight <= 0
            ){
                return;
            }


            const pageCenter =
                (
                    pageRect.top +
                    pageRect.bottom
                ) / 2;


            const centerDistance =
                Math.abs(
                    pageCenter -
                    viewportCenter
                );


            /*
             * Select the page occupying
             * the largest visible area.
             */

            if(
                visibleHeight >
                    bestVisibleHeight
                ||
                (
                    Math.abs(
                        visibleHeight -
                        bestVisibleHeight
                    ) < 1
                    &&
                    centerDistance <
                        bestCenterDistance
                )
            ){

                bestPage =
                    pageNumber;

                bestVisibleHeight =
                    visibleHeight;

                bestCenterDistance =
                    centerDistance;

            }

        }
    );


    /*
     * Fallback:
     * nearest page to viewport center.
     */

    if(!bestPage){

        let nearestDistance =
            Infinity;


        pages.forEach(
            page => {

                const pageNumber =
                    Number(
                        page.dataset.pageNumber
                    );

                const pageRect =
                    page.getBoundingClientRect();


                const pageCenter =
                    (
                        pageRect.top +
                        pageRect.bottom
                    ) / 2;


                const distance =
                    Math.abs(
                        pageCenter -
                        viewportCenter
                    );


                if(
                    distance <
                    nearestDistance
                ){

                    nearestDistance =
                        distance;

                    bestPage =
                        pageNumber;

                }

            }
        );

    }


    if(!bestPage){
        return;
    }


    const newText =
        `${bestPage}/${totalPages}`;


    if(
        pageCounter.textContent !==
        newText
    ){

        pageCounter.textContent =
            newText;

    }

}

/* ========================================================= */
/* PDF PAGE TRACKING                                         */
/* ========================================================= */

function setupPdfPageTracking(){

    const viewer =
        document.getElementById(
            "pdf-viewer-content"
        );

    const pageCounter =
        document.getElementById(
            "pdf-page-counter"
        );


    if(
        !viewer ||
        !pageCounter
    ){
        return;
    }


    /*
     * Remove old listeners.
     */

    if(
        window.keduPdfPageScrollHandler
    ){

        window.keduPdfPageScrollHandler
            .forEach(
                ({
                    element,
                    handler,
                    options
                }) => {

                    element.removeEventListener(
                        "scroll",
                        handler,
                        options
                    );

                }
            );

    }


    window.keduPdfPageScrollHandler =
        [];


    if(
        window.keduPdfPageResizeHandler
    ){

        window.removeEventListener(
            "resize",
            window.keduPdfPageResizeHandler
        );

    }


let lastTrackedPageText = "";


let pdfPageTrackerFrame =
    null;

const updateImmediately =
    () => {

        if(
            pdfPageTrackerFrame
        ){
            return;
        }

        pdfPageTrackerFrame =
            requestAnimationFrame(
                () => {

                    updatePdfPageCounter();

                    pdfPageTrackerFrame =
                        null;

                }
            );

    };

/*
 * Update synchronously on every
 * scroll event.
 */

updatePdfPageCounter();



    /*
     * Main PDF scrolling container.
     */

    viewer.addEventListener(
        "scroll",
        updateImmediately,
        {
            passive:true
        }
    );
    /* ========================================================= */
/* LECTURE PLAYER EMBEDDED PDF SCROLL TRACKING              */
/* ========================================================= */

const lecturePlayerPage =
    document.getElementById(
        "lecture-player-page"
    );


if(
    lecturePlayerPage
){

    lecturePlayerPage.addEventListener(
        "scroll",
        updateImmediately,
        {
            passive: true
        }
    );


    window.keduPdfPageScrollHandler
        .push({
            element:
                lecturePlayerPage,

            handler:
                updateImmediately,

            options:
                {
                    passive: true
                }
        });

}
viewer.addEventListener(
    "touchmove",
    updateImmediately,
    {
        passive:true
    }
);
viewer.addEventListener(
    "touchend",
    updateImmediately,
    {
        passive:true
    }
);

viewer.addEventListener(
    "touchcancel",
    updateImmediately,
    {
        passive:true
    }
);
    window.keduPdfPageScrollHandler
        .push({
            element:
                viewer,

            handler:
                updateImmediately,

            options:
                {
                    passive:true
                }

        });


    /*
     * PDF document container.
     */

    const documentContainer =
        document.getElementById(
            "pdf-document-container"
        );


    if(
        documentContainer &&
        documentContainer !== viewer
    ){

        documentContainer.addEventListener(
            "scroll",
            updateImmediately,
            {
                passive:true
            }
        );


        window.keduPdfPageScrollHandler
            .push({
                element:
                    documentContainer,

                handler:
                    updateImmediately,

                options:
                    {
                        passive:true
                    }

            });

    }


    /*
     * Capture scroll events from nested
     * PDF elements as well.
     */

    window.addEventListener(
        "scroll",
        updateImmediately,
        {
            passive:true,
            capture:true
        }
    );


    window.keduPdfPageScrollHandler
        .push({
            element:
                window,

            handler:
                updateImmediately,

            options:
                {
                    passive:true,
                    capture:true
                }

        });


    /*
     * Resize / orientation / zoom layout.
     */

    window.keduPdfPageResizeHandler =
        updateImmediately;


    window.addEventListener(
        "resize",
        updateImmediately,
        {
            passive:true
        }
    );


    /*
     * Track immediately.
     */

    updatePdfPageCounter();

}