document.addEventListener("DOMContentLoaded", () => {
  const splashOverlay = document.getElementById("splash-overlay");
  const appWrapper = document.getElementById("app-wrapper");
  const siteHeader = document.getElementById("site-header");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const iconMenu = document.getElementById("icon-menu");
  const iconClose = document.getElementById("icon-close");
  const navLinks = document.querySelectorAll("[data-nav-section]");
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  /* --------------------------------------------------------------------------
     1. Splash Screen (Solo se ejecuta la primera vez que el usuario entra)
     -------------------------------------------------------------------------- */
  const markPortfolioVisited = () => {
    try {
      sessionStorage.setItem("fc_portfolio_visited", "true");
    } catch (e) {}
    try {
      if (!window.name || window.name.indexOf("fc_portfolio_visited") === -1) {
        window.name = "fc_portfolio_visited";
      }
    } catch (e) {}
  };

  let alreadyVisited = document.documentElement.classList.contains("skip-splash");
  if (!alreadyVisited) {
    try {
      alreadyVisited =
        sessionStorage.getItem("fc_portfolio_visited") === "true" ||
        (window.name && window.name.indexOf("fc_portfolio_visited") !== -1);
    } catch (e) {}
  }

  // Guardamos el estado de visita en cuanto carga cualquier página del portafolio
  markPortfolioVisited();

  if (alreadyVisited) {
    document.documentElement.classList.add("skip-splash");
    if (splashOverlay) {
      splashOverlay.classList.add("hidden");
    }
    if (appWrapper) {
      appWrapper.classList.add("visible");
    }
  } else {
    setTimeout(() => {
      if (splashOverlay) {
        splashOverlay.classList.add("hidden");
      }
      if (appWrapper) {
        appWrapper.classList.add("visible");
      }
    }, 4500);
  }

  /* --------------------------------------------------------------------------
     1b. Transiciones Suaves entre Páginas (Inicio <-> Proyectos)
     -------------------------------------------------------------------------- */
  let isNavigating = false;

  const navigateSmoothly = (url) => {
    if (!url || isNavigating) return;
    isNavigating = true;
    markPortfolioVisited();
    document.body.classList.add("page-leaving");
    setTimeout(() => {
      window.location.href = url;
    }, 220);
  };

  window.addEventListener("pageshow", () => {
    isNavigating = false;
    document.body.classList.remove("page-leaving");
  });

  const internalPageLinks = document.querySelectorAll("a[href]");
  internalPageLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      if (link.hasAttribute("download") || link.getAttribute("target") === "_blank") {
        return;
      }

      const rawHref = link.getAttribute("href");
      if (
        !rawHref ||
        rawHref.startsWith("#") ||
        rawHref.startsWith("http://") ||
        rawHref.startsWith("https://") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      e.preventDefault();
      navigateSmoothly(rawHref);
    });
  });

  /* --------------------------------------------------------------------------
     2. Estado de Scroll en Barra de Navegación
     -------------------------------------------------------------------------- */
  const handleScroll = () => {
    if (!siteHeader) return;
    if (window.scrollY > 20) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  /* --------------------------------------------------------------------------
     3. Menú Móvil (Hamburguesa)
     -------------------------------------------------------------------------- */
  let menuOpen = false;

  const setMenuState = (isOpen) => {
    menuOpen = isOpen;
    if (!mobileMenu || !iconMenu || !iconClose) return;

    if (menuOpen) {
      mobileMenu.classList.add("open");
      iconMenu.style.display = "none";
      iconClose.style.display = "block";
    } else {
      mobileMenu.classList.remove("open");
      iconMenu.style.display = "block";
      iconClose.style.display = "none";
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => {
      setMenuState(!menuOpen);
    });
  }

  /* --------------------------------------------------------------------------
     4. Smooth Scroll en Enlaces Internos
     -------------------------------------------------------------------------- */
  smoothScrollLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetHref = link.getAttribute("href");
      if (!targetHref || targetHref === "#") return;

      const targetEl = document.querySelector(targetHref);
      if (targetEl) {
        e.preventDefault();
        setMenuState(false);
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* --------------------------------------------------------------------------
     5. Scroll Spy (IntersectionObserver para sección activa)
     -------------------------------------------------------------------------- */
  const sectionIds = ["inicio", "especialidades", "proyectos", "contacto"];

  const setActiveNav = (activeId) => {
    navLinks.forEach((link) => {
      const section = link.getAttribute("data-nav-section");
      if (section === activeId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  if ("IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) spyObserver.observe(el);
    });
  }

  /* --------------------------------------------------------------------------
     6. Animaciones de Aparición al Hacer Scroll (Reveal on Scroll)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  /* --------------------------------------------------------------------------
     7. Formulario de Contacto, Alerta Superior y Pop-up de Éxito
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById("contact-form");
  const topAlert = document.getElementById("top-alert");
  const successModal = document.getElementById("success-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  let alertTimeout = null;

  const showTopAlert = () => {
    if (!topAlert) return;
    topAlert.classList.add("show");
    if (alertTimeout) clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
      topAlert.classList.remove("show");
    }, 3500);
  };

  const hideTopAlert = () => {
    if (!topAlert) return;
    topAlert.classList.remove("show");
    if (alertTimeout) clearTimeout(alertTimeout);
  };

  const openSuccessModal = () => {
    if (!successModal) return;
    successModal.classList.add("show");
    successModal.setAttribute("aria-hidden", "false");
  };

  const closeSuccessModal = () => {
    if (!successModal) return;
    successModal.classList.remove("show");
    successModal.setAttribute("aria-hidden", "true");
  };

  if (contactForm) {
    const fields = [
      document.getElementById("contact-name"),
      document.getElementById("contact-email"),
      document.getElementById("contact-phone"),
      document.getElementById("contact-service"),
      document.getElementById("contact-details"),
    ];

    fields.forEach((field) => {
      if (!field) return;
      const clearError = () => field.classList.remove("input-error");
      field.addEventListener("input", clearError);
      field.addEventListener("change", clearError);
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let hasEmptyField = false;

      fields.forEach((field) => {
        if (!field) return;
        const val = field.value ? field.value.trim() : "";
        if (!val) {
          field.classList.add("input-error");
          hasEmptyField = true;
        } else {
          field.classList.remove("input-error");
        }
      });

      if (hasEmptyField) {
        showTopAlert();
        return;
      }

      hideTopAlert();
      contactForm.reset();
      openSuccessModal();
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closeSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSuccessModal();
    }
  });

  /* --------------------------------------------------------------------------
     8. Clic en Cards de Proyectos -> Navegación al Caso de Estudio
     -------------------------------------------------------------------------- */
  const projectCards = document.querySelectorAll(".project-card[data-project-href]");

  projectCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // Si el clic fue en un botón o enlace interno, el listener de enlaces maneja la transición
      if (e.target.closest("a")) return;

      const href = card.getAttribute("data-project-href");
      if (href) {
        navigateSmoothly(href);
      }
    });
  });

  /* --------------------------------------------------------------------------
     9. Scroll Spy para Índice Lateral en Páginas de Detalle de Proyecto
     -------------------------------------------------------------------------- */
  const caseTocLinks = document.querySelectorAll(".case-toc-link[data-case-section]");
  const caseSectionIds = ["problema", "proceso", "conclusiones"];

  if (caseTocLinks.length > 0 && "IntersectionObserver" in window) {
    const setCaseActive = (activeId) => {
      caseTocLinks.forEach((link) => {
        if (link.getAttribute("data-case-section") === activeId) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    };

    const caseObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCaseActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: 0,
      }
    );

    caseSectionIds.forEach((id) => {
      const sec = document.getElementById(id);
      if (sec) caseObserver.observe(sec);
    });
  }

  /* --------------------------------------------------------------------------
     10. Interacciones Caso de Estudio CNS Mobile (Pasos y Accesibilidad)
     -------------------------------------------------------------------------- */
  const cnsStepCards = document.querySelectorAll(".cns-step-card[data-cns-step]");
  const cnsBreadcrumbs = document.querySelectorAll(".cns-bc-item[data-cns-bc]");

  if (cnsStepCards.length > 0) {
    cnsStepCards.forEach((card) => {
      card.addEventListener("click", () => {
        const step = card.getAttribute("data-cns-step");
        cnsStepCards.forEach((c) => {
          c.classList.toggle("active", c.getAttribute("data-cns-step") === step);
        });
        cnsBreadcrumbs.forEach((bc) => {
          bc.classList.toggle("active", bc.getAttribute("data-cns-bc") === step);
        });
      });
    });
  }

  const guideToggleBtn = document.getElementById("cns-guide-toggle");
  const targetBoxes = document.querySelectorAll(".cns-target-box");

  if (guideToggleBtn && targetBoxes.length > 0) {
    guideToggleBtn.addEventListener("click", () => {
      const isActive = guideToggleBtn.classList.toggle("active");
      guideToggleBtn.setAttribute("aria-pressed", String(isActive));
      targetBoxes.forEach((box) => box.classList.toggle("show-guide", isActive));
    });
  }

  const simulateErrorBtn = document.getElementById("btn-cns-simulate");
  const toastDemo = document.getElementById("cns-toast-demo");
  const toastRetryBtn = document.getElementById("cns-toast-retry");

  if (simulateErrorBtn && toastDemo) {
    simulateErrorBtn.addEventListener("click", () => {
      toastDemo.classList.add("visible");
    });
  }

  if (toastRetryBtn && toastDemo) {
    toastRetryBtn.addEventListener("click", () => {
      toastDemo.classList.remove("visible");
    });
  }
});

