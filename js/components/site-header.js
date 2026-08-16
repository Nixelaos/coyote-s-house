/**
 * Componente: SiteHeader (<site-header>)
 * Navegación principal multipágina, logo oficial, menú responsive y detección de página activa.
 */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initHeaderEvents();
    this.highlightActivePage();
  }

  disconnectedCallback() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }

  highlightActivePage() {
    const navLinks = this.querySelectorAll('.nav-link');
    const activeAttr = this.getAttribute('active');

    // Obtener el nombre del archivo actual (ej: servicios.html)
    let currentPath = window.location.pathname.split('/').pop();
    if (!currentPath || currentPath === '' || currentPath === '/') {
      currentPath = 'index.html';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      const linkPage = href ? href.split('#')[0] : '';
      const pageKey = link.getAttribute('data-page');

      if (activeAttr && (activeAttr === pageKey || activeAttr === linkPage)) {
        link.classList.add('active');
      } else if (!activeAttr && (currentPath === linkPage || (currentPath === 'index.html' && linkPage === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }

  initHeaderEvents() {
    const header = this.querySelector('.site-header');
    const mobileToggle = this.querySelector('.mobile-toggle');
    const navMenu = this.querySelector('.nav-menu');
    const navLinks = this.querySelectorAll('.nav-link');

    this.scrollHandler = () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', this.scrollHandler);

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
      });

      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          mobileToggle.classList.remove('active');
          navMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }
  }

  render() {
    this.innerHTML = `
      <header class="site-header">
        <div class="container nav-container">
          <a href="index.html" class="brand-logo" title="Coyote's House - Taller de Motos">
            <div class="logo-circle-wrapper">
              <img src="assets/logo.jpg" alt="Logo Coyote's House" width="52" height="52">
            </div>
            <div class="brand-text">
              <span class="brand-name">Coyote's <span>House</span></span>
              <span class="brand-sub">Taller Mecánico de Motos</span>
            </div>
          </a>

          <nav class="nav-menu" id="navMenu">
            <a href="index.html" class="nav-link" data-page="inicio">Inicio</a>
            <a href="servicios.html" class="nav-link" data-page="servicios">Servicios</a>
            <a href="sobre-alberto.html" class="nav-link" data-page="sobre-alberto">Alberto Pizarro</a>
            <a href="cotizador.html" class="nav-link" data-page="cotizador">Cotizador WhatsApp</a>
            <a href="galeria.html" class="nav-link" data-page="galeria">Taller</a>
            <a href="contacto.html" class="nav-link" data-page="contacto">Ubicación</a>
          </nav>

          <div class="nav-actions">
            <a href="https://wa.me/56954750993?text=Hola%20Alberto%2C%20quisiera%20pedir%20una%20hora%20para%20mi%20moto" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm">
              <span>💬</span> Pedir Hora
            </a>
            <button class="mobile-toggle" id="mobileToggle" aria-label="Abrir Menú de Navegación">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
    `;
  }
}

customElements.define('site-header', SiteHeader);
