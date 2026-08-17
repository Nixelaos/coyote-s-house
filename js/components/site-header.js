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
    if (this.outsideClickHandler) {
      document.removeEventListener('click', this.outsideClickHandler);
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
      this.toggleHandler = (e) => {
        e.stopPropagation();
        const isOpen = navMenu.classList.toggle('open');
        mobileToggle.classList.toggle('active', isOpen);
      };

      mobileToggle.addEventListener('click', this.toggleHandler);

      this.linkClickHandler = () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('open');
      };

      navLinks.forEach(link => {
        link.addEventListener('click', this.linkClickHandler);
      });

      this.outsideClickHandler = (e) => {
        if (navMenu.classList.contains('open') && !this.contains(e.target)) {
          mobileToggle.classList.remove('active');
          navMenu.classList.remove('open');
        }
      };

      document.addEventListener('click', this.outsideClickHandler);
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
            </div>
          </a>

          <nav class="nav-menu" id="navMenu">
            <a href="index.html" class="nav-link" data-page="inicio">Inicio</a>
            <a href="servicios.html" class="nav-link" data-page="servicios">Servicios</a>
            <a href="sobre-alberto.html" class="nav-link" data-page="sobre-alberto">Alberto Pizarro</a>
            <a href="cotizador.html" class="nav-link" data-page="cotizador">COTIZADOR</a>
            <a href="galeria.html" class="nav-link" data-page="galeria">Taller</a>
            <a href="contacto.html" class="nav-link" data-page="contacto">Ubicación</a>
          </nav>

          <div class="nav-actions">
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
