(function () {
  "use strict";

  // The browser's own automatic per-history-entry scroll restoration can
  // race with (and override) the scrollIntoView calls below on Back/Forward.
  // We manage scroll position ourselves for every navigation, so disable it.
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  // Seed the initial entry with a well-formed state object (it otherwise
  // stays `null` until the first pushState), so the very first Back press
  // — the most common failure point for "Back exits a single-page app"
  // reports on mobile — has a consistent state to land on instead of an
  // untagged entry.
  history.replaceState(
    { section: location.hash ? location.hash.slice(1) : "home" },
    "",
    location.href
  );

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  var nav = document.getElementById("primary-nav");
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));
  var MENU_ANIM_MS = 280;
  var closeTimer = null;
  // True while the open hamburger menu has its own pushed history entry
  // (see openMenu). Lets Back/Forward close the menu instead of leaving
  // the site, since opening the menu otherwise makes no URL/hash change
  // for Back to "undo".
  var menuOpenViaHistory = false;
  // Set right before we programmatically call history.back() to pop the
  // menu's own entry (see closeMenu), so the popstate that call triggers
  // is ignored instead of being treated as a real Back/Forward navigation.
  var suppressNextPopstate = false;

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

    // Give the open menu its own history entry (same URL, just a marker
    // state) so a mobile edge-swipe/hardware Back press closes the menu
    // first instead of immediately leaving the site.
    history.pushState(
      { menuOpen: true, section: location.hash ? location.hash.slice(1) : "home" },
      "",
      location.href
    );
    menuOpenViaHistory = true;

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
    // Set when closeMenu is called *from* the popstate handler (the user
    // already navigated away from the menu-open entry) — skip popping
    // history again in that case, or set when the caller is about to do
    // its own history.replaceState right after (nav link click) so the
    // "menu open" step and the navigation collapse into one entry.
    var viaPopstate = options && options.viaPopstate;
    var keepHistoryEntry = options && options.keepHistoryEntry;

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

    if (menuOpenViaHistory && !viaPopstate && !keepHistoryEntry) {
      // Closed directly (toggle button or Escape), not via Back/Forward or
      // a link navigation — remove the "menu open" entry we pushed so it
      // doesn't linger as a dead step in the back-stack.
      menuOpenViaHistory = false;
      suppressNextPopstate = true;
      history.back();
    } else if (!keepHistoryEntry) {
      menuOpenViaHistory = false;
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
    // Reveal the destination immediately rather than waiting on the
    // IntersectionObserver below: for an explicit jump (nav click,
    // Back/Forward) straight to a section that was never scrolled past,
    // it can land in view still in its pre-reveal state (faded out,
    // offset) for up to the 500ms reveal transition — visible as a
    // "jump then slowly settle" artifact. Explicit navigation should
    // show the destination immediately; the fade/slide-in remains for
    // sections encountered by organic scrolling.
    target.classList.add("is-visible");
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

      var wasOpenViaHistory = menuOpenViaHistory;
      if (toggle.getAttribute("aria-expanded") === "true") {
        // Close visually only — leave its history entry in place so the
        // replaceState/pushState below can fold "menu open" + "navigate"
        // into a single net back-stack step.
        closeMenu({ returnFocus: false, keepHistoryEntry: true });
      }
      menuOpenViaHistory = false;

      scrollToSection(targetId);

      if (wasOpenViaHistory) {
        history.replaceState({ section: targetId }, "", "#" + targetId);
      } else if (location.hash !== "#" + targetId) {
        history.pushState({ section: targetId }, "", "#" + targetId);
      }
    });
  });

  // Back/Forward: the browser has already moved the history pointer and
  // updated location.hash by the time this fires, so we only scroll —
  // pushing/replacing history here would create duplicate entries.
  window.addEventListener("popstate", function () {
    if (suppressNextPopstate) {
      // This popstate was triggered by our own history.back() call inside
      // closeMenu (closing the menu directly, not via Back/Forward) —
      // everything relevant already happened synchronously, so ignore it.
      suppressNextPopstate = false;
      menuOpenViaHistory = false;
      return;
    }

    var wasMenuOpen = menuOpenViaHistory;
    menuOpenViaHistory = false;

    if (toggle.getAttribute("aria-expanded") === "true") {
      closeMenu({ returnFocus: false, viaPopstate: true });
    }

    if (wasMenuOpen) {
      // We just moved off the "menu open" marker entry; opening the menu
      // never changes the hash, so the underlying section is unchanged —
      // nothing further to scroll to.
      return;
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
