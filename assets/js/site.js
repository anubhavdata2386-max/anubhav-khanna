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
   Contact form — saves to Supabase, falls back to email.
   Keys live in assets/js/config.js
   ============================================================ */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  if (!form) return;

  var cfg = window.SITE_CONFIG || {};
  var TO = cfg.CONTACT_EMAIL || "anubhav2386@gmail.com";
  var configured = cfg.SUPABASE_URL &&
                   cfg.SUPABASE_URL.indexOf("YOUR-PROJECT-REF") === -1 &&
                   cfg.SUPABASE_ANON_KEY &&
                   cfg.SUPABASE_ANON_KEY.indexOf("YOUR-ANON") === -1;

  var btn = form.querySelector('button[type="submit"]');
  var status = document.getElementById("form-status");
  var btnLabel = btn ? btn.innerHTML : "";

  function say(kind, msg) {
    if (!status) return;
    status.className = "form__status is-" + kind;
    status.textContent = msg;
  }

  function mailtoFallback(d) {
    var subject = d.inquiry ? d.inquiry + " enquiry from " + d.name
                            : "Website enquiry from " + d.name;
    var body = [
      "Name: " + d.name,
      "Email: " + d.email,
      d.company ? "Company: " + d.company : null,
      d.inquiry ? "Inquiry type: " + d.inquiry : null,
      "",
      d.message
    ].filter(Boolean).join("\n");
    window.location.href = "mailto:" + TO +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(form);

    // honeypot: real people never fill this, bots almost always do
    if ((fd.get("website") || "").trim() !== "") {
      say("ok", "Thanks — your message has been sent.");
      form.reset();
      return;
    }

    var d = {
      name: (fd.get("name") || "").trim(),
      email: (fd.get("email") || "").trim(),
      company: (fd.get("company") || "").trim(),
      inquiry: (fd.get("inquiry") || "").trim(),
      message: (fd.get("message") || "").trim()
    };

    if (!d.name || !d.email || !d.message) {
      say("err", "Please fill in your name, email and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) {
      say("err", "That email address doesn't look right.");
      return;
    }

    var w3key = cfg.WEB3FORMS_KEY && cfg.WEB3FORMS_KEY.indexOf("YOUR-") === -1
                  ? cfg.WEB3FORMS_KEY : null;

    if (!configured && !w3key) { mailtoFallback(d); return; }

    if (btn) { btn.disabled = true; btn.textContent = "Sending\u2026"; }
    say("busy", "Sending\u2026");

    function withTimeout(promise, ms) {
      var ctrl = new AbortController();
      var timer = setTimeout(function () { ctrl.abort(); }, ms);
      return { signal: ctrl.signal, done: function () { clearTimeout(timer); } };
    }

    var jobs = [];

    /* 1 — store it in your own database */
    if (configured) {
      var a = withTimeout(null, 12000);
      jobs.push(
        fetch(cfg.SUPABASE_URL.replace(/\/+$/, "") + "/rest/v1/contact_messages", {
          method: "POST",
          signal: a.signal,
          headers: {
            "Content-Type": "application/json",
            "apikey": cfg.SUPABASE_ANON_KEY,
            "Authorization": "Bearer " + cfg.SUPABASE_ANON_KEY,
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({
            name: d.name,
            email: d.email,
            company: d.company || null,
            inquiry_type: d.inquiry || null,
            message: d.message,
            source_page: location.pathname,
            user_agent: navigator.userAgent.slice(0, 300)
          })
        }).then(function (r) {
          a.done();
          if (!r.ok) throw new Error("supabase " + r.status);
          return "supabase";
        })
      );
    }

    /* 2 — email it to you straight away */
    if (w3key) {
      var b = withTimeout(null, 12000);
      jobs.push(
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          signal: b.signal,
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            access_key: w3key,
            subject: (d.inquiry ? d.inquiry + " enquiry" : "Website enquiry") + " from " + d.name,
            from_name: "anubhavkhanna.com",
            replyto: d.email,
            name: d.name,
            email: d.email,
            company: d.company || "\u2014",
            inquiry_type: d.inquiry || "\u2014",
            message: d.message,
            page: location.pathname
          })
        }).then(function (r) {
          b.done();
          if (!r.ok) throw new Error("web3forms " + r.status);
          return "email";
        })
      );
    }

    Promise.allSettled(jobs).then(function (results) {
      var ok = results.some(function (r) { return r.status === "fulfilled"; });
      if (btn) { btn.innerHTML = btnLabel; btn.disabled = false; }

      if (ok) {
        form.reset();
        say("ok", "Thanks \u2014 your message is with me. I'll reply to " + d.email + " shortly.");
      } else {
        // both routes failed — never lose the lead
        say("err", "Couldn't send that automatically \u2014 opening your email app instead.");
        mailtoFallback(d);
      }
    });
  });
})();

/* ============================================================
   Layer 1 — depth and motion
   Progressive enhancement: no JS, no effects, site works fine.
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- cursor spotlight + 3D tilt ---------- */
  if (fine && !reduced) {
    var SEL = ".stat, .skillcard, .ach, .tmz, .brand, .cert, .cc, .metric," +
              " .channel, .tl, .tile, .proudof";
    var cards = Array.prototype.slice.call(document.querySelectorAll(SEL));

    cards.forEach(function (card) {
      card.classList.add("fx");
      var raf = null, rect = null;

      card.addEventListener("mouseenter", function () { rect = card.getBoundingClientRect(); });

      card.addEventListener("mousemove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          if (!rect) rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          card.style.setProperty("--mx", x + "px");
          card.style.setProperty("--my", y + "px");
          // bigger cards get less tilt, so the effect reads the same at any size
          var amp = rect.width > 520 ? 3.5 : 6.5;
          var rx = ((y / rect.height) - 0.5) * -amp;
          var ry = ((x / rect.width) - 0.5) * amp;
          card.style.transform = "perspective(1100px) rotateX(" + rx.toFixed(2) +
                                 "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
        });
      });

      card.addEventListener("mouseleave", function () {
        rect = null;
        card.style.transform = "";
      });
    });

    /* ---------- magnetic primary buttons ---------- */
    Array.prototype.slice.call(document.querySelectorAll(".btn--primary")).forEach(function (btn) {
      var r = null;
      btn.addEventListener("mouseenter", function () { r = btn.getBoundingClientRect(); });
      btn.addEventListener("mousemove", function (e) {
        if (!r) r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22;
        var y = (e.clientY - r.top - r.height / 2) * 0.35;
        btn.style.transform = "translate(" + x.toFixed(1) + "px," + y.toFixed(1) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        r = null;
        btn.style.transform = "";
      });
    });
  }

  /* ---------- stat numbers count up when they scroll into view ---------- */
  var nums = Array.prototype.slice.call(document.querySelectorAll(".stat__num, .metric__val"));
  if (!nums.length) return;

  if (reduced || !("IntersectionObserver" in window)) return;

  function run(el) {
    // split "$300M+" into prefix "$", value 300, suffix "M+"
    var m = /^(\D*?)(\d+(?:\.\d+)?)(.*)$/.exec(el.textContent.trim());
    if (!m) return;
    var pre = m[1], target = parseFloat(m[2]), suf = m[3];
    var decimals = (m[2].split(".")[1] || "").length;
    if (target <= 1) return;
    var start = null, dur = 1200;

    el.style.minWidth = el.getBoundingClientRect().width + "px";

    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = target * eased;
      el.textContent = pre + (decimals ? v.toFixed(decimals) : Math.round(v)) + suf;
      if (p < 1) requestAnimationFrame(frame);
      else el.style.minWidth = "";
    }
    requestAnimationFrame(frame);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      run(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  nums.forEach(function (el) { io.observe(el); });
})();
