/**
 * COYOTE'S HOUSE - TALLER MECÁNICO DE MOTOCICLETAS
 * Motor SPA Ligero: Pre-carga en RAM, Transiciones Suaves y 0ms de Espera
 * Teléfono Taller: +56 9 5475 0993 (Alberto Pizarro)
 */

(function () {
  'use strict';

  // Memoria RAM para almacenar páginas completas en 0ms
  const pageCache = new Map();

  // Lista de páginas del sitio
  const sitePages = [
    'index.html',
    'servicios.html',
    'sobre-alberto.html',
    'cotizador.html',
    'galeria.html',
    'resenas.html',
    'caso-ajuste-motor.html',
    'faq.html',
    'contacto.html'
  ];

  // Componentes para precargar en background
  const componentScripts = [
    'js/components/workshop-topbar.js',
    'js/components/site-header.js',
    'js/components/hero-section.js',
    'js/components/features-section.js',
    'js/components/customer-reviews.js',
    'js/components/services-catalog.js',
    'js/components/about-alberto.js',
    'js/components/whatsapp-cotizador.js',
    'js/components/workshop-gallery.js',
    'js/components/case-study-motor.js',
    'js/components/faq-accordion.js',
    'js/components/contact-location.js',
    'js/components/site-footer.js',
    'js/components/floating-whatsapp.js'
  ];

  // Obtiene el nombre del archivo actual (ej: "servicios.html" o "index.html")
  function getCurrentPageName(urlStr) {
    const url = urlStr || window.location.pathname;
    const parts = url.split('/').filter(Boolean);
    const lastPart = parts.pop() || 'index.html';
    return lastPart.includes('.html') ? lastPart : 'index.html';
  }

  // Extrae y guarda la página actual en la memoria RAM
  function cacheCurrentPage() {
    const main = document.querySelector('main');
    if (!main) return;

    const pageName = getCurrentPageName();
    const siteHeader = document.querySelector('site-header');
    const activeNav = siteHeader ? siteHeader.getAttribute('active') : pageName.replace('.html', '');

    pageCache.set(pageName, {
      title: document.title,
      mainHtml: main.innerHTML,
      activeNav: activeNav
    });
  }

  // Pre-carga silenciosa de scripts de componentes
  function preloadComponentScripts() {
    componentScripts.forEach(src => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        document.head.appendChild(script);
      }
    });
  }

  // Descarga y almacena una página en memoria RAM
  async function fetchAndCachePage(pageName) {
    if (pageCache.has(pageName)) return pageCache.get(pageName);

    try {
      const response = await fetch(pageName);
      if (!response.ok) return null;

      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');

      const mainEl = doc.querySelector('main');
      const headerEl = doc.querySelector('site-header');
      const title = doc.querySelector('title')?.textContent || document.title;
      const activeNav = headerEl ? headerEl.getAttribute('active') : pageName.replace('.html', '');

      if (mainEl) {
        const data = {
          title: title,
          mainHtml: mainEl.innerHTML,
          activeNav: activeNav
        };
        pageCache.set(pageName, data);
        return data;
      }
    } catch (e) {
      console.warn(`[Coyote's House SPA] No se pudo precargar ${pageName}:`, e);
    }
    return null;
  }

  // Inicia la precarga de todas las demás páginas en reposo
  function startBackgroundPreload() {
    preloadComponentScripts();

    const idleRunner = window.requestIdleCallback || ((cb) => setTimeout(cb, 1000));
    idleRunner(() => {
      sitePages.forEach((page, idx) => {
        if (page !== getCurrentPageName()) {
          setTimeout(() => fetchAndCachePage(page), idx * 120);
        }
      });
    });
  }

  // Actualiza la clase activa en los menús de navegación
  function updateActiveNavigation(activeNavName) {
    // Header links
    document.querySelectorAll('site-header .nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkPage = getCurrentPageName(href);
      const isTarget = linkPage.includes(activeNavName) || (activeNavName === 'inicio' && linkPage === 'index.html');
      link.classList.toggle('active', isTarget);
    });

    // Site header component attribute
    const siteHeader = document.querySelector('site-header');
    if (siteHeader) {
      siteHeader.setAttribute('active', activeNavName);
    }
  }

  // Realiza el cambio fluido de contenido (Cross-fade agradable)
  async function transitionToPage(pageName, pushToHistory = true) {
    const main = document.querySelector('main');
    if (!main) return;

    // Si ya estamos en la página solicitada, solo hacemos scroll arriba suave
    if (getCurrentPageName() === pageName && !pushToHistory) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Cerrar menú móvil si está abierto
    const navMenu = document.querySelector('.nav-menu');
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (mobileToggle) {
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    }

    // Iniciar desvanecimiento suave
    main.classList.add('is-transitioning');

    // Obtener datos desde RAM (o fetch si no está listo)
    let pageData = pageCache.get(pageName);
    if (!pageData) {
      pageData = await fetchAndCachePage(pageName);
    }

    // Esperar 90ms para el desvanecimiento elegante
    setTimeout(() => {
      if (pageData) {
        // Reemplazar contenido
        main.innerHTML = pageData.mainHtml;
        document.title = pageData.title;

        // Actualizar URL en barra de direcciones
        if (pushToHistory) {
          window.history.pushState({ page: pageName }, pageData.title, pageName);
        }

        // Actualizar estado activo en navegación
        updateActiveNavigation(pageData.activeNav);

        // Scroll al tope inmediato sin saltos
        window.scrollTo(0, 0);
      } else {
        // Fallback de navegación estándar si falla fetch
        window.location.href = pageName;
        return;
      }

      // Quitar clase de transición para fundir la nueva página con suavidad
      requestAnimationFrame(() => {
        main.classList.remove('is-transitioning');
      });
    }, 90);
  }

  // Interceptor de clics en enlaces internos
  function setupLinkInterceptor() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Ignorar enlaces externos, whatsapp, tel, anclas puras (#) o javascript
      if (
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        href.startsWith('wa.me') ||
        href.startsWith('javascript:') ||
        href.startsWith('#') ||
        link.getAttribute('target') === '_blank'
      ) {
        return;
      }

      const targetPage = getCurrentPageName(href);
      if (sitePages.includes(targetPage)) {
        e.preventDefault();
        transitionToPage(targetPage, true);
      }
    });

    // Soporte para botones Atrás / Adelante del navegador
    window.addEventListener('popstate', () => {
      const targetPage = getCurrentPageName();
      transitionToPage(targetPage, false);
    });
  }

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    cacheCurrentPage();
    setupLinkInterceptor();
    startBackgroundPreload();
  });
})();
