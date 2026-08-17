/**
 * COYOTE'S HOUSE - TALLER MECÁNICO DE MOTOCICLETAS
 * Main Engine: Pre-carga silenciosa en segundo plano para navegación instantánea
 * Teléfono Taller: +56 9 5475 0993 (Alberto Pizarro)
 */

document.addEventListener('DOMContentLoaded', () => {
  initBackgroundPrefetch();
});

/**
 * PRE-CARGA EN SEGUNDO PLANO (Prefetching silencioso en reposo + Hover)
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
