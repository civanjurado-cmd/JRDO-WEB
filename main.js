(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (err) {
      console.error("[JRDO] init failed:", name, err);
    }
  }

  function initHeader() {
    var header = document.getElementById("header");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initBurger() {
    var burger = document.getElementById("burger");
    var nav = document.getElementById("nav");
    if (!burger || !nav) return;

    var close = function () {
      nav.classList.remove("is-open");
      burger.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    };

    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll(".nav__link").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  function initSmoothAnchors() {
    var header = document.getElementById("header");
    var offset = header ? header.offsetHeight : 0;

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var y = target.getBoundingClientRect().top + window.scrollY - offset + 1;
        window.scrollTo({ top: y, behavior: "smooth" });
      });
    });
  }

  function initReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    items.forEach(function (el) { el.classList.add("reveal-ready"); });

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("reveal-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (el) { io.observe(el); });

    // Safety net: nothing should stay invisible forever.
    setTimeout(function () {
      items.forEach(function (el) { el.classList.add("reveal-in"); });
    }, 6000);
  }

  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  function initServiceModals() {
    var overlay = document.getElementById("service-modal");
    var triggers = document.querySelectorAll("[data-modal-open]");
    if (!overlay || !triggers.length) return;

    var lastTrigger = null;

    var closeAll = function () {
      var openPanel = overlay.querySelector(".modal-panel:not([hidden])");
      overlay.classList.remove("is-open");
      document.body.classList.remove("no-scroll");
      overlay.querySelectorAll(".modal-panel").forEach(function (panel) {
        panel.hidden = true;
      });
      if (openPanel && lastTrigger) lastTrigger.focus();
    };

    var openModal = function (id, trigger) {
      var panel = document.getElementById(id);
      if (!panel) return;
      overlay.querySelectorAll(".modal-panel").forEach(function (p) {
        p.hidden = (p !== panel);
      });
      overlay.classList.add("is-open");
      document.body.classList.add("no-scroll");
      lastTrigger = trigger;
      var closeBtn = panel.querySelector(".modal-close");
      if (closeBtn) closeBtn.focus();
    };

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        openModal(trigger.getAttribute("data-modal-open"), trigger);
      });
      trigger.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(trigger.getAttribute("data-modal-open"), trigger);
        }
      });
    });

    overlay.querySelectorAll(".modal-close").forEach(function (btn) {
      btn.addEventListener("click", closeAll);
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeAll();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) closeAll();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    safe(initHeader, "header");
    safe(initBurger, "burger");
    safe(initSmoothAnchors, "smooth-anchors");
    safe(initReveal, "reveal");
    safe(initYear, "year");
    safe(initServiceModals, "service-modals");
  });
})();
