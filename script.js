/* =========================================================
   Absolute Pest Control Services - Advanced UI/UX script.js
   ========================================================= */

(function () {
  "use strict";

  var WHATSAPP_NUMBER = "919663017155";
  var BUSINESS_NAME = "Absolute Pest Control Services";

  // Base starting prices in INR for 1 BHK
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

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // ---------- Sticky Navbar Shadow on Scroll ----------
  var navbar = $("#navbar");
  var menuToggle = $("#menuToggle");
  var navLinks = $("#navLinks");

  function onScroll() {
    if (window.scrollY > 12) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Mobile Menu Toggle ----------
  function closeMenu() {
    navLinks.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      menuToggle.classList.toggle("open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
    });
    $$("a", navLinks).forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("click", function (e) {
      if (!navbar.contains(e.target)) closeMenu();
    });
  }

  // ---------- Intersection Observer Scroll Reveal ----------
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // ---------- Animated Counters ----------
  var counters = $$("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var duration = 1800;
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

  if ("IntersectionObserver" in window && counters.length > 0) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { countObs.observe(c); });
  }

  // ---------- Showcase Slider (Images & Videos) ----------
  var slider = $("#slider");
  if (slider) {
    var slides = $$(".slide", slider);
    var dotsWrap = $("#dots");
    var current = 0;
    var timer = null;
    var IMAGE_DELAY = 5000;
    var VIDEO_DELAY = 10000;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.className = "dot" + (i === 0 ? " active" : "");
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
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
      if (p && typeof p.catch === "function") p.catch(function () {});
    }

    function pauseVideo(slide) {
      var v = $("video", slide);
      if (v) v.pause();
    }

    function goTo(index) {
      pauseVideo(slides[current]);
      slides[current].classList.remove("active");
      if (dots[current]) dots[current].classList.remove("active");

      current = (index + slides.length) % slides.length;

      slides[current].classList.add("active");
      if (dots[current]) dots[current].classList.add("active");
      playVideo(slides[current]);

      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      var hasVideo = !!$("video", slides[current]);
      timer = setTimeout(function () { goTo(current + 1); }, hasVideo ? VIDEO_DELAY : IMAGE_DELAY);
    }

    var prevBtn = $("#prevBtn");
    var nextBtn = $("#nextBtn");
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(current + 1); });

    slider.addEventListener("mouseenter", function () { clearTimeout(timer); });
    slider.addEventListener("mouseleave", schedule);
    schedule();
  }

  // ---------- Interactive WhatsApp Quote Calculator & Form ----------
  var form = $("#quoteForm");
  var serviceSelect = $("#service");
  var propertySelect = $("#property");
  var nameInput = $("#name");
  var phoneInput = $("#phone");
  var areaInput = $("#area");
  var estimateValue = $("#estimateValue");
  var errorBox = $("#formError");

  // Clicking "Get Quote" on service cards automatically fills form & scrolls down
  $$(".card-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var serviceName = btn.getAttribute("data-service");
      if (serviceSelect) {
        serviceSelect.value = serviceName;
        updateEstimate();
      }
      var quoteSection = $("#quote");
      if (quoteSection) {
        quoteSection.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(function () {
          if (nameInput) nameInput.focus({ preventScroll: true });
        }, 500);
      }
    });
  });

  function roundTo(n, step) { return Math.round(n / step) * step; }
  function formatINR(n) { return "\u20B9" + n.toLocaleString("en-IN"); }

  function getEstimate() {
    if (!serviceSelect || !propertySelect) return null;
    var base = SERVICE_BASE[serviceSelect.value];
    var factor = PROPERTY_FACTOR[propertySelect.value];
    if (!base || !factor) return null;
    var mid = base * factor;
    return { low: roundTo(mid * 0.9, 50), high: roundTo(mid * 1.2, 50) };
  }

  function updateEstimate() {
    if (!estimateValue) return;
    var est = getEstimate();
    estimateValue.textContent = est ? formatINR(est.low) + " - " + formatINR(est.high) : "Select service & property";
  }

  if (serviceSelect) serviceSelect.addEventListener("change", updateEstimate);
  if (propertySelect) propertySelect.addEventListener("change", updateEstimate);

  if (phoneInput) {
    phoneInput.addEventListener("input", function () {
      phoneInput.value = phoneInput.value.replace(/[^\d+\s-]/g, "");
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      $$(".invalid", form).forEach(function (el) { el.classList.remove("invalid"); });
      if (errorBox) errorBox.hidden = true;

      var name = nameInput ? nameInput.value.trim() : "";
      var phone = phoneInput ? phoneInput.value.replace(/\D/g, "") : "";
      var service = serviceSelect ? serviceSelect.value : "";
      var property = propertySelect ? propertySelect.value : "";
      var area = areaInput ? areaInput.value.trim() : "";

      var bad = [];
      if (!name && nameInput) bad.push(nameInput);
      if (phone.length < 10 && phoneInput) bad.push(phoneInput);
      if (!service && serviceSelect) bad.push(serviceSelect);
      if (!property && propertySelect) bad.push(propertySelect);

      if (bad.length > 0) {
        bad.forEach(function (el) { el.classList.add("invalid"); });
        if (errorBox) {
          errorBox.textContent = phone.length > 0 && phone.length < 10
            ? "Please enter a valid 10-digit mobile number."
            : "Please fill in all required fields correctly.";
          errorBox.hidden = false;
        }
        bad[0].focus();
        return;
      }

      var est = getEstimate();
      var estText = est ? formatINR(est.low) + " - " + formatINR(est.high) : "";
      var lines = [
        "Hello " + BUSINESS_NAME + ",",
        "I would like to book an inspection / get a quote.",
        "",
        "*Name:* " + name,
        "*Phone:* " + phone,
        "*Service:* " + service,
        "*Property:* " + property,
        "*Locality:* " + (area || "Hebbal, Bengaluru"),
        estText ? "*Indicative Estimate:* " + estText : "",
        "",
        "Please confirm availability. Thank you!"
      ].filter(Boolean);

      var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
      window.open(url, "_blank", "noopener");
    });
  }

  // ---------- Dynamic Footer Copyright Year ----------
  var yearEl = $("#year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
