/**
 * Componente: SiteHeader (<site-header>)
 * Navegación principal, logo oficial restaurado, menú responsive y scroll highlight.
 */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initHeaderEvents();
  }

  disconnectedCallback() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
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

      // Highlight current section
      let currentSection = '';
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
          link.classList.add('active');
        }
      });
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
          <a href="#inicio" class="brand-logo" title="Coyote's House - Taller de Motos">
            <div class="logo-circle-wrapper">
              <img src="assets/logo.jpg" alt="Logo Coyote's House" width="52" height="52">
            </div>
            <div class="brand-text">
              <span class="brand-name">Coyote's <span>House</span></span>
              <span class="brand-sub">Taller Mecánico de Motos</span>
            </div>
          </a>

          <nav class="nav-menu" id="navMenu">
            <a href="#inicio" class="nav-link active">Inicio</a>
            <a href="#servicios" class="nav-link">Servicios</a>
            <a href="#sobre-alberto" class="nav-link">Alberto Pizarro</a>
            <a href="#cotizador" class="nav-link">Cotizador WhatsApp</a>
            <a href="#galeria" class="nav-link">Taller</a>
            <a href="#testimonios" class="nav-link">Opiniones</a>
            <a href="#contacto" class="nav-link">Ubicación</a>
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
