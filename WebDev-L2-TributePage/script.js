document.addEventListener("DOMContentLoaded", function () {

    const message = document.getElementById("message");

    if (message) {
        message.textContent = "Thank you for visiting this tribute page.";
    }

    console.log("C. V. Raman Tribute Page loaded successfully!");

    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            console.log("Navigation clicked:", link.textContent);

        });

    });

    const heroButton = document.querySelector(".hero-button");

    if (heroButton) {

        heroButton.addEventListener("click", function () {

            console.log("Exploring C. V. Raman's journey...");

        });

    }

});
