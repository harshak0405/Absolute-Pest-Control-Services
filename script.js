
/* =========================================
   ABSOLUTE PEST CONTROL SERVICES
   JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    // BUSINESS WHATSAPP NUMBER
    const whatsappNumber = "919663017155";


    // =====================================
    // 1. MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

        // Close menu after selecting a link

        navLinks.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", function () {

                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");

            });

        });

        // Close menu when clicking outside

        document.addEventListener("click", function (event) {

            if (
                !menuToggle.contains(event.target) &&
                !navLinks.contains(event.target)
            ) {

                navLinks.classList.remove("open");
                menuToggle.setAttribute("aria-expanded", "false");

            }

        });

    }


    // =====================================
    // 2. IMAGE FALLBACK SYSTEM
    // =====================================

    document.querySelectorAll("img[data-fallback]").forEach(image => {

        image.addEventListener("error", function () {

            const fallback = image.dataset.fallback;

            if (fallback && !image.dataset.fallbackUsed) {

                image.dataset.fallbackUsed = "true";
                image.src = fallback;

            } else {

                image.style.display = "none";

                console.warn(
                    "Image could not be loaded:",
                    image.src
                );

            }

        });

    });


    // =====================================
    // 3. HERO IMAGE AND VIDEO SLIDER
    // =====================================

    const slides = document.querySelectorAll(".hero-slide");

    const prevButton = document.getElementById("prevSlide");
    const nextButton = document.getElementById("nextSlide");

    const dotsContainer = document.getElementById("sliderDots");
    const slideCounter = document.getElementById("slideCounter");

    let currentSlide = 0;
    let sliderInterval;

    const totalSlides = slides.length;


    // Create slider navigation dots

    if (dotsContainer && totalSlides > 0) {

        slides.forEach((slide, index) => {

            const dot = document.createElement("button");

            dot.className = "slider-dot";

            dot.setAttribute(
                "aria-label",
                `Go to slide ${index + 1}`
            );

            dot.addEventListener("click", function () {

                goToSlide(index);

            });

            dotsContainer.appendChild(dot);

        });

    }


    const dots = document.querySelectorAll(".slider-dot");


    // Change active slide

    function goToSlide(index) {

        if (!totalSlides) return;

        currentSlide = (index + totalSlides) % totalSlides;

        slides.forEach((slide, slideIndex) => {

            const isActive = slideIndex === currentSlide;

            slide.classList.toggle("active", isActive);

            const video = slide.querySelector("video");

            if (video) {

                if (isActive) {

                    video.muted = true;

                    const playPromise = video.play();

                    if (playPromise !== undefined) {

                        playPromise.catch(() => {

                            console.log(
                                "Video autoplay is unavailable."
                            );

                        });

                    }

                } else {

                    video.pause();
                    video.currentTime = 0;

                }

            }

        });


        // Update navigation dots

        dots.forEach((dot, dotIndex) => {

            dot.classList.toggle(
                "active",
                dotIndex === currentSlide
            );

        });


        // Update counter

        if (slideCounter) {

            const current = String(currentSlide + 1).padStart(2, "0");

            const total = String(totalSlides).padStart(2, "0");

            slideCounter.textContent = `${current} / ${total}`;

        }

    }


    // Previous and next buttons

    if (prevButton) {

        prevButton.addEventListener("click", function () {

            goToSlide(currentSlide - 1);

            restartSlider();

        });

    }


    if (nextButton) {

        nextButton.addEventListener("click", function () {

            goToSlide(currentSlide + 1);

            restartSlider();

        });

    }


    // Automatic slideshow

    function startSlider() {

        clearInterval(sliderInterval);

        if (totalSlides > 1) {

            sliderInterval = setInterval(function () {

                goToSlide(currentSlide + 1);

            }, 6500);

        }

    }


    function restartSlider() {

        startSlider();

    }


    if (totalSlides > 0) {

        goToSlide(0);

        startSlider();

    }


    // Pause automatic slideshow while user interacts with media

    const heroMedia = document.getElementById("heroMedia");

    if (heroMedia) {

        heroMedia.addEventListener("mouseenter", function () {

            clearInterval(sliderInterval);

        });

        heroMedia.addEventListener("mouseleave", function () {

            startSlider();

        });

        heroMedia.addEventListener("focusin", function () {

            clearInterval(sliderInterval);

        });

        heroMedia.addEventListener("focusout", function () {

            startSlider();

        });

    }


    // =====================================
    // 4. SERVICE ENQUIRY AUTO-SELECTION
    // =====================================

    const serviceLinks = document.querySelectorAll(
        ".service-link[data-service]"
    );

    const pestSelect = document.getElementById("pestType");

    const serviceMapping = {

        "Cockroach Eradication": "Cockroaches",

        "Termite Armor": "Termites",

        "Bed Bug Shield": "Bed Bugs",

        "Rodent Control": "Rodents",

        "Mosquito Shield": "Mosquitoes",

        "Bee Hive Relocation": "Bee Hive",

        "Ant Defense": "Ants",

        "General Disinfestation": "General Pest Control",

        "Fly Control": "Flies"

    };


    serviceLinks.forEach(link => {

        link.addEventListener("click", function () {

            const serviceName = this.dataset.service;

            const matchingOption = serviceMapping[serviceName];

            if (pestSelect && matchingOption) {

                pestSelect.value = matchingOption;

            }

        });

    });


    // =====================================
    // 5. WHATSAPP QUOTATION FORM
    // =====================================

    const quoteForm = document.getElementById("quoteForm");

    if (quoteForm) {

        quoteForm.addEventListener("submit", function (event) {

            event.preventDefault();

            // Collect customer details

            const customerName = document
                .getElementById("customerName")
                .value.trim();

            const propertyType = document
                .getElementById("propertyType")
                .value;

            const pestType = document
                .getElementById("pestType")
                .value;

            const areaSize = document
                .getElementById("areaSize")
                .value;

            const location = document
                .getElementById("location")
                .value.trim();

            const urgency = document
                .getElementById("urgency")
                .value;

            const additionalDetails = document
                .getElementById("additionalDetails")
                .value.trim();


            // Basic validation

            if (
                !customerName ||
                !propertyType ||
                !pestType ||
                !location
            ) {

                alert("Please fill in all required fields.");

                return;

            }


            if (areaSize && Number(areaSize) <= 0) {

                alert("Please enter a valid property area.");

                return;

            }


            // Create WhatsApp quotation message

            const message =

`Hello Absolute Pest Control Services,

I would like to request a pest control quotation.

CUSTOMER DETAILS

Name: ${customerName}

PROPERTY DETAILS

Property Type: ${propertyType}
Pest Problem: ${pestType}
Property Area: ${areaSize ? areaSize + " sq. ft." : "Not specified"}
Location: ${location}

SERVICE REQUIREMENT

Preferred Service Time: ${urgency}

Additional Details:
${additionalDetails || "No additional details provided."}

Please contact me with the suitable treatment options and quotation.

Thank you.`;


            // Encode message for WhatsApp

            const encodedMessage = encodeURIComponent(message);

            const whatsappURL =
                `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;


            // Open WhatsApp

            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );

        });

    }


    // =====================================
    // 6. DYNAMIC COPYRIGHT YEAR
    // =====================================

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {

        currentYear.textContent = new Date().getFullYear();

    }


    // =====================================
    // 7. WHATSAPP LINK CONFIGURATION
    // =====================================

    document.querySelectorAll(".whatsapp-link").forEach(link => {

        link.href = `https://wa.me/${whatsappNumber}`;

        link.target = "_blank";

        link.rel = "noopener noreferrer";

    });


    console.log(
        "Absolute Pest Control Services website loaded successfully."
    );

});
