/* =========================================================
   Absolute Pest Control Services - script.js
   ========================================================= */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     CONFIG - edit these values easily
     --------------------------------------------------------- */
  var WHATSAPP_NUMBER = "919663017155"; // country code + number, no "+" or spaces
  var BUSINESS_NAME = "Absolute Pest Control Services";

  // Indicative starting prices in INR (edit to match your real pricing).
  // Base price per service for a 1 BHK; multiplied by the property factor below.
  var SERVICE_BASE = {
    "Cockroach Eradication": 1200,
    "Termite Armor": 2500,
    "Bed Bug Shield": 1500,
    "Rodent Control": 1500,
    "Mosquito Shield": 1000,
    "Bee Hive Relocation": 1500,
    "Ant Defense": 1000,
    "General Disinfestation": 1800,
    "Fly Control": 1200
  };

  var PROPERTY_FACTOR = {
    "1 BHK": 1,
    "2 BHK": 1.4,
    "3 BHK": 1.8,
    "4+ BHK / Villa": 2.6,
    "Shop / Office": 1.6,
    "Restaurant / Warehouse": 2.4
  };

  /* ---------------------------------------------------------
     Helpers
     --------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  /* ---------------------------------------------------------
     Image fallback: tries alternate file names if the first 404s
     (data-fallback="Termite.jpeg|Termite.jpg")
     --------------------------------------------------------- */
  $$("img[data-fallback]").forEach(function (img) {
    var queue = img.getAttribute("data-fallback").split("|").map(function (s) { return s.trim(); }).filter(Boolean);
    img.addEventListener("error", function onError() {
      if (queue.length) {
        img.src = queue.shift();
      } else {
        img.removeEventListener("error", onError);
      }
    });
  });

  /* ---------------------------------------------------------
     Navbar: scroll shadow + mobile menu
     --------------------------------------------------------- */
  var navbar = $("#navbar");
  var menuToggle = $("#menuToggle");
  var navLinks = $("#navLinks");

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  $$("a", navLinks).forEach(function (a) { a.addEventListener("click", closeMenu); });
  document.addEventListener("click", function (e) {
    if (!navbar.contains(e.target)) closeMenu();
  });

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------------------------------------------------------
     Animated counters
     --------------------------------------------------------- */
  var counters = $$("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString("en-IN");
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString("en-IN");
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { countObs.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.getAttribute("data-count"); });
  }

  /* ---------------------------------------------------------
     Showcase slider (images + videos)
     --------------------------------------------------------- */
  var slider = $("#slider");
  var slides = $$(".slide", slider);
  var dotsWrap = $("#dots");
  var current = 0;
  var timer = null;
  var IMAGE_DELAY = 4500;
  var VIDEO_DELAY = 9000;

  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", "Go to slide " + (i + 1));
    dot.addEventListener("click", function () { goTo(i, true); });
    dotsWrap.appendChild(dot);
  });
  var dots = $$(".dot", dotsWrap);

  function playVideo(slide) {
    var v = $("video", slide);
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.currentTime = 0;
    var p = v.play();
    if (p && typeof p.catch === "function") p.catch(function () { /* autoplay blocked - ignore */ });
  }

  function pauseVideo(slide) {
    var v = $("video", slide);
    if (v) v.pause();
  }

  function goTo(index, userAction) {
    pauseVideo(slides[current]);
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");

    current = (index + slides.length) % slides.length;

    slides[current].classList.add("active");
    dots[current].classList.add("active");
    playVideo(slides[current]);

    // Preload neighbouring video for smoother transitions
    var next = slides[(current + 1) % slides.length];
    var nv = $("video", next);
    if (nv && nv.preload !== "auto") nv.preload = "auto";

    schedule();
    if (userAction) { /* timer is restarted by schedule() */ }
  }

  function schedule() {
    clearTimeout(timer);
    var hasVideo = !!$("video", slides[current]);
    timer = setTimeout(function () { goTo(current + 1); }, hasVideo ? VIDEO_DELAY : IMAGE_DELAY);
  }

  $("#prevBtn").addEventListener("click", function () { goTo(current - 1, true); });
  $("#nextBtn").addEventListener("click", function () { goTo(current + 1, true); });

  slider.addEventListener("mouseenter", function () { clearTimeout(timer); });
  slider.addEventListener("mouseleave", schedule);

  // Keyboard support when slider is focused/hovered area
  document.addEventListener("keydown", function (e) {
    var rect = slider.getBoundingClientRect();
    var inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === "ArrowLeft") goTo(current - 1, true);
    if (e.key === "ArrowRight") goTo(current + 1, true);
  });

  // Touch swipe
  var touchStartX = 0;
  slider.addEventListener("touchstart", function (e) { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  slider.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 45) goTo(current + (dx < 0 ? 1 : -1), true);
  }, { passive: true });

  // Pause when tab hidden / slider off-screen
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { clearTimeout(timer); pauseVideo(slides[current]); }
    else { playVideo(slides[current]); schedule(); }
  });

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { playVideo(slides[current]); schedule(); }
        else { clearTimeout(timer); pauseVideo(slides[current]); }
      });
    }, { threshold: 0.25 }).observe(slider);
  } else {
    schedule();
  }

  /* ---------------------------------------------------------
     Service cards -> preselect service in quote form
     --------------------------------------------------------- */
  var form = $("#quoteForm");
  var serviceSelect = $("#service");
  var propertySelect = $("#property");
  var nameInput = $("#name");
  var phoneInput = $("#phone");
  var areaInput = $("#area");
  var estimateValue = $("#estimateValue");
  var errorBox = $("#formError");

  $$(".card-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      serviceSelect.value = btn.getAttribute("data-service");
      updateEstimate();
      var quote = $("#quote");
      quote.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function () { nameInput.focus({ preventScroll: true }); }, 600);
    });
  });

  /* ---------------------------------------------------------
     Quote calculator
     --------------------------------------------------------- */
  function roundTo(n, step) { return Math.round(n / step) * step; }

  function formatINR(n) {
    return "\u20B9" + n.toLocaleString("en-IN");
  }

  function getEstimate() {
    var base = SERVICE_BASE[serviceSelect.value];
    var factor = PROPERTY_FACTOR[propertySelect.value];
    if (!base || !factor) return null;
    var mid = base * factor;
    return { low: roundTo(mid * 0.9, 50), high: roundTo(mid * 1.2, 50) };
  }

  function estimateText() {
    var est = getEstimate();
    return est ? formatINR(est.low) + " - " + formatINR(est.high) : null;
  }

  function updateEstimate() {
    var text = estimateText();
    estimateValue.textContent = text || "Select service & property";
  }

  serviceSelect.addEventListener("change", updateEstimate);
  propertySelect.addEventListener("change", updateEstimate);

  function showError(msg) {
    errorBox.textContent = msg;
    errorBox.hidden = false;
  }

  function clearInvalid() {
    $$(".invalid", form).forEach(function (el) { el.classList.remove("invalid"); });
    errorBox.hidden = true;
  }

  [nameInput, phoneInput, serviceSelect, propertySelect].forEach(function (el) {
    el.addEventListener("input", function () { el.classList.remove("invalid"); errorBox.hidden = true; });
  });

  // Keep phone field numeric
  phoneInput.addEventListener("input", function () {
    phoneInput.value = phoneInput.value.replace(/[^\d+\s-]/g, "");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearInvalid();

    var name = nameInput.value.trim();
    var phone = phoneInput.value.replace(/\D/g, "");
    var service = serviceSelect.value;
    var property = propertySelect.value;
    var area = areaInput.value.trim();

    var bad = [];
    if (!name) bad.push(nameInput);
    if (phone.length < 10) bad.push(phoneInput);
    if (!service) bad.push(serviceSelect);
    if (!property) bad.push(propertySelect);

    if (bad.length) {
      bad.forEach(function (el) { el.classList.add("invalid"); });
      showError(phone.length > 0 && phone.length < 10 && bad.length === 1
        ? "Please enter a valid 10-digit phone number."
        : "Please fill in all required fields.");
      bad[0].focus();
      return;
    }

    var est = estimateText();
    var lines = [
      "Hello " + BUSINESS_NAME + ",",
      "I would like a quote.",
      "",
      "*Name:* " + name,
      "*Phone:* " + phone,
      "*Service:* " + service,
      "*Property:* " + property,
      "*Locality:* " + (area || "Not specified"),
      est ? "*Indicative estimate:* " + est : "",
      "",
      "Please get in touch. Thank you."
    ].filter(function (l, i, arr) { return !(l === "" && arr[i - 1] === ""); });

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener");
  });

  /* ---------------------------------------------------------
     Footer year
     --------------------------------------------------------- */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
