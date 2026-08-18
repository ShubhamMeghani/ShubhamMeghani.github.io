(function () {
  "use strict";

  // The browser's own automatic per-history-entry scroll restoration can
  // race with (and override) the scrollIntoView calls below on Back/Forward.
  // We manage scroll position ourselves for every navigation, so disable it.
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  var nav = document.getElementById("primary-nav");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var MENU_ANIM_MS = 280;
  var closeTimer = null;

  var linkByHref = {};
  navLinks.forEach(function (link) {
    linkByHref[link.getAttribute("href").slice(1)] = link;
  });

  function setActiveLink(id) {
    var link = linkByHref[id];
    if (!link) return;
    navLinks.forEach(function (l) {
      l.removeAttribute("aria-current");
    });
    link.setAttribute("aria-current", "page");
  }

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

  function scrollToSection(id) {
    var target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
    // Set the active link immediately rather than waiting on the
    // IntersectionObserver below: for a programmatic (non-user-scroll)
    // jump — especially an instant one under reduced-motion — the
    // observer is not guaranteed to fire promptly, which left the
    // highlight stale after Back/Forward in testing. The observer still
    // owns highlighting during organic mouse/trackpad scrolling.
    setActiveLink(id);
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = link.getAttribute("href").slice(1);
      if (!document.getElementById(targetId)) return;
      event.preventDefault();

      if (toggle.getAttribute("aria-expanded") === "true") {
        closeMenu({ returnFocus: false });
      }

      scrollToSection(targetId);
      if (location.hash !== "#" + targetId) {
        history.pushState({ section: targetId }, "", "#" + targetId);
      }
    });
  });

  // Back/Forward: the browser has already moved the history pointer and
  // updated location.hash by the time this fires, so we only scroll —
  // pushing/replacing history here would create duplicate entries.
  window.addEventListener("popstate", function () {
    if (toggle.getAttribute("aria-expanded") === "true") {
      closeMenu({ returnFocus: false });
    }
    var id = location.hash ? location.hash.slice(1) : "home";
    scrollToSection(id);
  });

  // Active-section highlighting during organic (mouse/trackpad) scrolling.
  // Programmatic navigation (clicks, Back/Forward) sets the active link
  // directly via setActiveLink() in scrollToSection() above instead of
  // relying on this observer, which is not guaranteed to fire promptly
  // for instant/reduced-motion scroll jumps.
  var activeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        setActiveLink(entry.target.id);
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
