(function () {
  "use strict";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  var nav = document.getElementById("primary-nav");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var MENU_ANIM_MS = 280;
  var closeTimer = null;

  // Mobile disclosure: the nav carries the `hidden` attribute by default in
  // the HTML itself, so it is correctly hidden from view and the
  // accessibility tree even before this script runs. CSS forces the nav
  // visible at >=768px regardless of that attribute (see layout.css).

  function onKeydown(event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  }

  function focusFirstLink() {
    var firstLink = navLinks[0];
    if (firstLink) firstLink.focus();
  }

  function openMenu() {
    window.clearTimeout(closeTimer);
    nav.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    document.addEventListener("keydown", onKeydown);

    if (prefersReducedMotion()) {
      nav.classList.add("is-open");
      focusFirstLink();
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          nav.classList.add("is-open");
          focusFirstLink();
        });
      });
    }
  }

  function closeMenu(options) {
    var returnFocus = !options || options.returnFocus !== false;

    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
    document.removeEventListener("keydown", onKeydown);

    if (prefersReducedMotion()) {
      nav.hidden = true;
    } else {
      closeTimer = window.setTimeout(function () {
        nav.hidden = true;
      }, MENU_ANIM_MS);
    }

    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href").slice(1);
      var target = document.getElementById(targetId);

      if (toggle.getAttribute("aria-expanded") === "true") {
        closeMenu({ returnFocus: false });
      }

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
        history.replaceState(null, "", "#" + targetId);
      }
    });
  });

  // Active-section highlighting
  var linkByHref = {};
  navLinks.forEach(function (link) {
    linkByHref[link.getAttribute("href").slice(1)] = link;
  });

  var activeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var link = linkByHref[entry.target.id];
        if (!link || !entry.isIntersecting) return;
        navLinks.forEach(function (l) {
          l.removeAttribute("aria-current");
        });
        link.setAttribute("aria-current", "page");
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach(function (section) {
    activeObserver.observe(section);
  });

  // Scroll-reveal
  sections.forEach(function (section) {
    section.classList.add("reveal");
  });

  if (prefersReducedMotion()) {
    sections.forEach(function (section) {
      section.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    sections.forEach(function (section) {
      revealObserver.observe(section);
    });
  }
})();
