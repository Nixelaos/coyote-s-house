/**
 * COYOTE'S HOUSE - TALLER MECÁNICO DE MOTOCICLETAS
 * Main Engine: Pre-carga en segundo plano, Scroll Reveal & Micro-animaciones
 * Teléfono Taller: +56 9 5475 0993 (Alberto Pizarro)
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initDynamicCounters();
  initBackgroundPrefetch();
});

/**
 * 1. PRE-CARGA EN SEGUNDO PLANO (Prefetching silencioso en reposo + Hover)
 * Asegura transiciones instantáneas a 0ms sin ralentizar la carga inicial.
 */
function initBackgroundPrefetch() {
  const pagesToPrefetch = [
    'servicios.html',
    'sobre-alberto.html',
    'cotizador.html',
    'galeria.html',
    'faq.html',
    'contacto.html'
  ];

  const prefetchedUrls = new Set();

  function prefetchUrl(url) {
    if (!url || prefetchedUrls.has(url) || window.location.pathname.endsWith(url)) return;
    prefetchedUrls.add(url);

    // Intentar prefetch nativo con link rel="prefetch"
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'document';
    document.head.appendChild(link);
  }

  // Esperar a que la página esté 100% cargada y en estado inactivo
  window.addEventListener('load', () => {
    const idleRunner = window.requestIdleCallback || ((cb) => setTimeout(cb, 1200));
    
    idleRunner(() => {
      pagesToPrefetch.forEach((page, index) => {
        setTimeout(() => prefetchUrl(page), index * 180);
      });
    });
  });

  // Hover prefetch: al pasar el mouse por un enlace del menú
  document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('a[href$=".html"]');
    if (link && !link.getAttribute('href').startsWith('http')) {
      prefetchUrl(link.getAttribute('href'));
    }
  }, { passive: true });

  // Touchstart prefetch para celulares
  document.addEventListener('touchstart', (e) => {
    const link = e.target.closest('a[href$=".html"]');
    if (link && !link.getAttribute('href').startsWith('http')) {
      prefetchUrl(link.getAttribute('href'));
    }
  }, { passive: true });
}

/**
 * 2. SCROLL REVEAL (Aparición escalonada con IntersectionObserver)
 */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  // Observar componentes y tarjetas
  function observeElements() {
    const targetSelectors = [
      '.feature-card',
      '.service-card',
      '.pauta-detail-box',
      '.brand-chip',
      '.faq-item',
      '.review-card',
      '.gallery-item',
      '.about-feature',
      '.contact-card'
    ];

    targetSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, idx) => {
        if (!el.classList.contains('reveal-on-scroll')) {
          el.classList.add('reveal-on-scroll');
          // Staggering escalonado para elementos hermanos
          const delayClass = `delay-${(idx % 4) + 1}`;
          el.classList.add(delayClass);
          observer.observe(el);
        }
      });
    });
  }

  // Ejecutar al cargar y tras renderizado de Web Components
  observeElements();
  setTimeout(observeElements, 400);
  setTimeout(observeElements, 1200);
}

/**
 * 3. CONTADOR DINÁMICO PARA MÉTRICAS (20+, 100%)
 */
function initDynamicCounters() {
  if (!('IntersectionObserver' in window)) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetText = el.textContent.trim();

        if (targetText.includes('20+')) {
          animateCount(el, 0, 20, 1000, '+');
        } else if (targetText.includes('100%')) {
          animateCount(el, 0, 100, 1100, '%');
        }

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  function animateCount(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
      const currentVal = Math.floor(easeProgress * (end - start) + start);
      element.textContent = currentVal + suffix;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end + suffix;
      }
    };
    window.requestAnimationFrame(step);
  }

  function observeCounters() {
    document.querySelectorAll('.stat-number').forEach(stat => {
      const txt = stat.textContent;
      if (txt.includes('20+') || txt.includes('100%')) {
        counterObserver.observe(stat);
      }
    });
  }

  observeCounters();
  setTimeout(observeCounters, 500);
}
