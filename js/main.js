/**
 * HCR Hyderabad Cab Rentals — main site script.
 * Vanilla JS only. Depends on window.SITE_CONFIG from config.js.
 */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG || {};

  /* ------------------------------------------------------------------
   * Utility: read a dotted path like "address.full" from an object
   * ------------------------------------------------------------------ */
  function getPath(obj, path) {
    return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : ""), obj);
  }

  function whatsappUrl(message) {
    const base = `https://wa.me/${CFG.whatsappNumber}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  }

  function telUrl() {
    return `tel:${CFG.phoneRaw}`;
  }

  function mailUrl() {
    return `mailto:${CFG.email}`;
  }

  /* ------------------------------------------------------------------
   * 1. Apply configuration values to the DOM
   * ------------------------------------------------------------------ */
  function applyConfig() {
    document.querySelectorAll("[data-cfg]").forEach((el) => {
      const value = getPath(CFG, el.getAttribute("data-cfg"));
      if (value !== "" && value !== undefined) el.textContent = value;
    });

    document.querySelectorAll("[data-cfg-href]").forEach((el) => {
      const type = el.getAttribute("data-cfg-href");
      const msg = el.getAttribute("data-cfg-message") || "";
      let href = "#";
      if (type === "tel") href = telUrl();
      else if (type === "whatsapp") href = whatsappUrl(msg);
      else if (type === "mail") href = mailUrl();
      else if (type === "maps") href = CFG.googleMapsDirectionsUrl;
      el.setAttribute("href", href);
    });

    document.querySelectorAll("[data-cfg-src]").forEach((el) => {
      const value = getPath(CFG, el.getAttribute("data-cfg-src"));
      if (value) el.setAttribute("src", value);
    });

    document.querySelectorAll("[data-cfg-href-social]").forEach((el) => {
      const platform = el.getAttribute("data-cfg-href-social");
      const url = CFG.social && CFG.social[platform];
      if (url) {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        el.classList.add("hidden");
      }
    });

    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });

    const mapFrame = document.getElementById("gmap-embed");
    if (mapFrame && CFG.googleMapsEmbed) mapFrame.src = CFG.googleMapsEmbed;
  }

  /* ------------------------------------------------------------------
   * 2. Page loader
   * ------------------------------------------------------------------ */
  function initPageLoader() {
    const loader = document.getElementById("page-loader");
    if (!loader) return;
    window.addEventListener("load", () => {
      setTimeout(() => loader.classList.add("loaded"), 250);
    });
  }

  /* ------------------------------------------------------------------
   * 3. Sticky navbar + mobile menu
   * ------------------------------------------------------------------ */
  function initNavbar() {
    const nav = document.getElementById("site-navbar");
    if (!nav) return;
    const logo = document.getElementById("nav-logo");
    const navLinks = nav.querySelectorAll(".nav-link");
    const isTransparentHome = nav.hasAttribute("data-transparent");

    function onScroll() {
      const scrolled = window.scrollY > 24;
      if (isTransparentHome) {
        nav.classList.toggle("bg-white/95", scrolled);
        nav.classList.toggle("backdrop-blur-md", scrolled);
        nav.classList.toggle("shadow-soft", scrolled);
        nav.classList.toggle("bg-transparent", !scrolled);
        navLinks.forEach((l) => l.classList.toggle("scrolled", scrolled));
        if (logo) logo.src = CFG.logo;
        const menuIcon = document.getElementById("mobile-menu-btn");
        if (menuIcon) menuIcon.classList.toggle("text-primary", scrolled);
        if (menuIcon) menuIcon.classList.toggle("text-white", !scrolled);
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener("click", () => {
        const isOpen = mobileMenu.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("overflow-hidden", isOpen);
      });
      mobileMenu.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          mobileMenu.classList.remove("open");
          menuBtn.setAttribute("aria-expanded", "false");
          document.body.classList.remove("overflow-hidden");
        })
      );
    }

    // Active-section highlighting for one-page anchors
    const sections = document.querySelectorAll("main [id]");
    if (sections.length && "IntersectionObserver" in window) {
      const map = new Map();
      navLinks.forEach((l) => {
        const href = l.getAttribute("href") || "";
        if (href.includes("#")) map.set(href.split("#")[1], l);
      });
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const link = map.get(entry.target.id);
            if (!link) return;
            if (entry.isIntersecting) {
              navLinks.forEach((l) => l.classList.remove("active"));
              link.classList.add("active");
            }
          });
        },
        { rootMargin: "-45% 0px -50% 0px" }
      );
      sections.forEach((s) => obs.observe(s));
    }
  }

  /* ------------------------------------------------------------------
   * 3b. Fleet filter tabs (All / Sedan / SUV / Premium SUV / Group Travel)
   * ------------------------------------------------------------------ */
  function initFleetFilter() {
    const buttons = document.querySelectorAll("[data-fleet-filter]");
    const groups = document.querySelectorAll("[data-fleet-group]");
    if (!buttons.length || !groups.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-fleet-filter");
        buttons.forEach((b) => b.classList.toggle("active", b === btn));
        groups.forEach((g) => {
          const match = filter === "all" || g.getAttribute("data-fleet-group") === filter;
          g.classList.toggle("hidden", !match);
        });
      });
    });
  }

  /* ------------------------------------------------------------------
   * 4. Scroll-reveal animations (Intersection Observer)
   * ------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal, .reveal-zoom");
    if (!targets.length) return;
    if (!("IntersectionObserver" in window)) {
      targets.forEach((t) => t.classList.add("in-view"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px 150px 0px" }
    );
    targets.forEach((t) => obs.observe(t));

    // Safety net: fast/momentum scrolls can outrun the observer on some
    // devices. Force-reveal anything left un-triggered once the user
    // reaches the bottom of the page.
    window.addEventListener(
      "scroll",
      () => {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50) {
          document.querySelectorAll(".reveal:not(.in-view), .reveal-zoom:not(.in-view)").forEach((el) => {
            el.classList.add("in-view");
            obs.unobserve(el);
          });
        }
      },
      { passive: true }
    );
  }

  /* ------------------------------------------------------------------
   * 5. Animated stat counters
   * ------------------------------------------------------------------ */
  function initCounters() {
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    function animateCounter(el) {
      const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const duration = 1600;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      counters.forEach(animateCounter);
      return;
    }
    const obs = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => obs.observe(c));
  }

  /* ------------------------------------------------------------------
   * 6. Testimonials slider
   * ------------------------------------------------------------------ */
  function initTestimonialSlider() {
    const track = document.getElementById("testimonial-track");
    const slider = document.getElementById("testimonial-slider");
    if (!track || !slider) return;
    const slides = Array.from(track.children);
    const dotsWrap = document.getElementById("testimonial-dots");
    let index = 0;
    let perView = getPerView();
    let autoplayId;

    function getPerView() {
      if (window.innerWidth >= 1024) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }

    function maxIndex() {
      return Math.max(0, slides.length - perView);
    }

    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (let i = 0; i <= maxIndex(); i++) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to testimonial ${i + 1}`);
        dot.className =
          "h-2.5 rounded-full transition-all duration-300 " +
          (i === index ? "w-8 bg-secondary" : "w-2.5 bg-slate-300 hover:bg-slate-400");
        dot.addEventListener("click", () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function update() {
      const slideWidth = 100 / perView;
      track.style.transform = `translateX(-${index * slideWidth}%)`;
      renderDots();
    }

    function goTo(i) {
      index = Math.min(Math.max(i, 0), maxIndex());
      update();
      resetAutoplay();
    }

    function next() {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }

    function prev() {
      index = index <= 0 ? maxIndex() : index - 1;
      update();
    }

    function resetAutoplay() {
      clearInterval(autoplayId);
      autoplayId = setInterval(next, 5000);
    }

    document.getElementById("testimonial-next")?.addEventListener("click", () => {
      next();
      resetAutoplay();
    });
    document.getElementById("testimonial-prev")?.addEventListener("click", () => {
      prev();
      resetAutoplay();
    });

    window.addEventListener("resize", () => {
      perView = getPerView();
      index = Math.min(index, maxIndex());
      update();
    });

    slides.forEach((slide) => (slide.style.flex = `0 0 ${100 / perView}%`));
    window.addEventListener("resize", () => {
      slides.forEach((slide) => (slide.style.flex = `0 0 ${100 / getPerView()}%`));
    });

    update();
    resetAutoplay();
  }

  /* ------------------------------------------------------------------
   * 7. FAQ accordion
   * ------------------------------------------------------------------ */
  function initAccordion() {
    document.querySelectorAll("[data-accordion]").forEach((wrap) => {
      const items = wrap.querySelectorAll(".faq-item");
      items.forEach((item) => {
        const btn = item.querySelector(".faq-question");
        const panel = item.querySelector(".faq-answer");
        if (!btn || !panel) return;
        btn.addEventListener("click", () => {
          const isOpen = item.getAttribute("data-open") === "true";
          items.forEach((i) => {
            i.setAttribute("data-open", "false");
            i.querySelector(".faq-answer").style.maxHeight = null;
            i.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
            i.querySelector(".faq-icon")?.classList.remove("rotate-45");
          });
          if (!isOpen) {
            item.setAttribute("data-open", "true");
            panel.style.maxHeight = panel.scrollHeight + "px";
            btn.setAttribute("aria-expanded", "true");
            item.querySelector(".faq-icon")?.classList.add("rotate-45");
          }
        });
      });
    });
  }

  /* ------------------------------------------------------------------
   * 8. Scroll-to-top button
   * ------------------------------------------------------------------ */
  function initScrollTop() {
    const btn = document.getElementById("scroll-top-btn");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => {
        btn.classList.toggle("opacity-0", window.scrollY < 400);
        btn.classList.toggle("invisible", window.scrollY < 400);
        btn.classList.toggle("opacity-100", window.scrollY >= 400);
      },
      { passive: true }
    );
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ------------------------------------------------------------------
   * 9. Ripple effect for buttons
   * ------------------------------------------------------------------ */
  function initRipple() {
    document.querySelectorAll(".btn, .btn-primary, .btn-outline, .btn-dark, .btn-whatsapp, .btn-call").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement("span");
        const size = Math.max(rect.width, rect.height);
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = e.clientX - rect.left - size / 2 + "px";
        ripple.style.top = e.clientY - rect.top - size / 2 + "px";
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /* ------------------------------------------------------------------
   * 10. Form handling (booking enquiry + contact form)
   * ------------------------------------------------------------------ */
  function showFieldError(input, message) {
    const wrap = input.closest(".field-wrap") || input.parentElement;
    const err = wrap.querySelector(".field-error");
    if (err) {
      err.textContent = message;
      err.classList.remove("hidden");
    }
    input.classList.add("border-red-500");
    input.setAttribute("aria-invalid", "true");
  }

  function clearFieldError(input) {
    const wrap = input.closest(".field-wrap") || input.parentElement;
    const err = wrap.querySelector(".field-error");
    if (err) err.classList.add("hidden");
    input.classList.remove("border-red-500");
    input.removeAttribute("aria-invalid");
  }

  function validateForm(form) {
    let valid = true;
    form.querySelectorAll("[required]").forEach((input) => {
      clearFieldError(input);
      if (!input.value.trim()) {
        showFieldError(input, "This field is required.");
        valid = false;
      }
    });

    const phone = form.querySelector('[name="phone"]');
    if (phone && phone.value.trim() && !/^[+]?[\d\s-]{10,15}$/.test(phone.value.trim())) {
      showFieldError(phone, "Enter a valid phone number.");
      valid = false;
    }

    const email = form.querySelector('[name="email"]');
    if (email && email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      showFieldError(email, "Enter a valid email address.");
      valid = false;
    }

    const journeyDate = form.querySelector('[name="journeyDate"]');
    const returnDate = form.querySelector('[name="returnDate"]');
    if (journeyDate && returnDate && journeyDate.value && returnDate.value) {
      if (new Date(returnDate.value) < new Date(journeyDate.value)) {
        showFieldError(returnDate, "Return date cannot be before the journey date.");
        valid = false;
      }
    }

    return valid;
  }

  function buildWhatsAppMessage(form, heading) {
    const data = new FormData(form);
    const lines = [`*${heading}*`];
    for (const [key, value] of data.entries()) {
      if (!value) continue;
      const label = key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
      lines.push(`${label}: ${value}`);
    }
    return lines.join("\n");
  }

  function initForms() {
    document.querySelectorAll("form[data-whatsapp-form]").forEach((form) => {
      const successBox = form.parentElement.querySelector(".form-success");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!validateForm(form)) {
          const firstError = form.querySelector(".border-red-500");
          if (firstError) firstError.focus();
          return;
        }
        const heading = form.getAttribute("data-whatsapp-form") || "New Enquiry";
        const message = buildWhatsAppMessage(form, heading);
        window.open(whatsappUrl(message), "_blank", "noopener");
        document.dispatchEvent(new CustomEvent("hcr:form-submit"));
        if (successBox) {
          successBox.classList.remove("hidden");
          setTimeout(() => successBox.classList.add("hidden"), 6000);
        }
        form.reset();
      });

      form.querySelectorAll("input, select, textarea").forEach((input) => {
        input.addEventListener("input", () => clearFieldError(input));
        input.addEventListener("change", () => clearFieldError(input));
      });
    });

    // Prevent selecting a journey/return date in the past
    const today = new Date().toISOString().split("T")[0];
    document.querySelectorAll('input[type="date"]').forEach((input) => (input.min = today));
  }

  /* ------------------------------------------------------------------
   * Marquee: continuous horizontal auto-scroll (items are cloned for a seamless loop)
   * ------------------------------------------------------------------ */
  function initMarquee() {
    document.querySelectorAll("[data-marquee]").forEach((root) => {
      const items = Array.from(root.children);
      if (!items.length) return;
      const track = document.createElement("div");
      track.className = "marquee-track";
      items.forEach((el) => track.appendChild(el));
      items.forEach((el) => {
        const clone = el.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("a, button").forEach((n) => n.setAttribute("tabindex", "-1"));
        track.appendChild(clone);
      });
      track.style.setProperty("--marquee-duration", items.length * 6 + "s");
      root.appendChild(track);
    });
  }

  /* ------------------------------------------------------------------
   * Analytics + Google Ads conversion tracking (inert until IDs are set in config.js)
   * ------------------------------------------------------------------ */
  function initTracking() {
    const cfg = CFG.analytics || {};
    const ids = [cfg.ga4Id, cfg.adsId].filter(Boolean);
    if (!ids.length) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ids[0]);
    document.head.appendChild(tag);
    window.gtag("js", new Date());
    ids.forEach((id) => window.gtag("config", id));

    const conversions = cfg.adsConversions || {};
    function track(type) {
      window.gtag("event", "generate_lead", { method: type });
      if (conversions[type]) window.gtag("event", "conversion", { send_to: conversions[type] });
    }

    document.addEventListener("click", (e) => {
      const link = e.target.closest && e.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.indexOf("tel:") === 0) track("call");
      else if (href.indexOf("wa.me") !== -1) track("whatsapp");
    });
    document.addEventListener("hcr:form-submit", () => track("form"));
  }

  /* ------------------------------------------------------------------
   * Init
   * ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    applyConfig();

    initTracking();
    initPageLoader();
    initNavbar();
    initFleetFilter();
    initMarquee();

    initScrollReveal();
    initCounters();
    initTestimonialSlider();
    initAccordion();
    initScrollTop();
    initRipple();
    initForms();
  });
})();
