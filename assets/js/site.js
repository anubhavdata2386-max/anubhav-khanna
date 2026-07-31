/* ============================================================
   Anubhav Khanna — portfolio
   Vanilla JS. No dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- theme ---------- */
  var STORE = "ak-theme";

  function readTheme() {
    try { return localStorage.getItem(STORE); } catch (e) { return null; }
  }
  function writeTheme(v) {
    try { localStorage.setItem(STORE, v); } catch (e) { /* private mode — ignore */ }
  }
  function applyTheme(v) {
    document.documentElement.setAttribute("data-theme", v);
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.setAttribute("aria-label", v === "light" ? "Switch to dark theme" : "Switch to light theme");
      btn.setAttribute("aria-pressed", v === "light" ? "true" : "false");
    }
  }

  applyTheme(readTheme() || "dark");

  document.addEventListener("click", function (e) {
    var t = e.target.closest(".theme-toggle");
    if (!t) return;
    var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    applyTheme(next);
    writeTheme(next);
  });

  /* ---------- nav: border on scroll ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- nav: mobile menu ---------- */
  var burger = document.querySelector(".nav__burger");
  var links = document.querySelector(".nav__links");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- experience tabs ---------- */
  var xpItems = Array.prototype.slice.call(document.querySelectorAll(".xp__item"));
  var xpPanels = Array.prototype.slice.call(document.querySelectorAll(".xp__panel"));

  var stacked = window.matchMedia("(max-width: 1080px)");

  function selectXp(index, reveal) {
    xpItems.forEach(function (item, i) {
      item.setAttribute("aria-selected", i === index ? "true" : "false");
      item.setAttribute("tabindex", i === index ? "0" : "-1");
    });
    xpPanels.forEach(function (panel, i) {
      panel.hidden = i !== index;
    });
    // stacked layout puts the panel below a tall list — scroll it into view
    if (reveal && stacked.matches && xpPanels[index]) {
      xpPanels[index].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  if (xpItems.length) {
    xpItems.forEach(function (item, i) {
      item.addEventListener("click", function () { selectXp(i, true); });
      item.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % xpItems.length;
        if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + xpItems.length) % xpItems.length;
        if (e.key === "Home") next = 0;
        if (e.key === "End") next = xpItems.length - 1;
        if (next === null) return;
        e.preventDefault();
        selectXp(next);
        xpItems[next].focus();
      });
    });
    selectXp(0);
  }

  /* ---------- reveal on scroll ---------- */
  var targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

  targets.forEach(function (el) { io.observe(el); });
})();

/* ============================================================
   Contact form — composes an email. No server, no third party.
   ============================================================ */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var name = (data.get("name") || "").trim();
    var email = (data.get("email") || "").trim();
    var company = (data.get("company") || "").trim();
    var type = (data.get("inquiry") || "").trim();
    var message = (data.get("message") || "").trim();

    var subject = type ? type + " enquiry from " + name : "Website enquiry from " + name;
    var body = [
      "Name: " + name,
      "Email: " + email,
      company ? "Company: " + company : null,
      type ? "Inquiry type: " + type : null,
      "",
      message
    ].filter(Boolean).join("\n");

    window.location.href = "mailto:anubhav2386@gmail.com"
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(body);
  });
})();
