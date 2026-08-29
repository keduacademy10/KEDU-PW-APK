/* =========================================
   KEDU PW — TOAST SYSTEM
========================================= */

(function () {

    function showToast(message) {

        let container =
            document.getElementById(
                "kedu-toast-container"
            );


        if (!container) {

            container =
                document.createElement(
                    "div"
                );

            container.id =
                "kedu-toast-container";

            document.body.appendChild(
                container
            );

        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "kedu-toast";


        toast.textContent =
            message;


        container.appendChild(
            toast
        );


        requestAnimationFrame(() => {

            toast.classList.add(
                "show"
            );

        });


        setTimeout(() => {

            toast.classList.remove(
                "show"
            );


            setTimeout(() => {

                toast.remove();

            }, 250);

        }, 2200);

    }


    window.keduToast =
        showToast;

})();