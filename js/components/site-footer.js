/**
 * Componente: SiteFooter (<site-footer>)
 * Pie de página oficial con enlaces a las páginas del sitio, logo y copyright.
 */

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.render();

    // El horario lo administra el taller desde el panel; puede llegar despues
    // del primer pintado.
    this.boundConfig = () => this.updateSchedule();
    window.addEventListener('siteconfig:ready', this.boundConfig);
  }

  disconnectedCallback() {
    if (this.boundConfig) {
      window.removeEventListener('siteconfig:ready', this.boundConfig);
    }
  }

  /** Sin datos reales la línea del horario se oculta: no hay horario de respaldo. */
  updateSchedule() {
    const item = this.querySelector('.footer-schedule-item');
    const label = this.querySelector('.footer-schedule');
    if (!item || !label) return;

    const summary = window.CoyoteSiteConfig ? window.CoyoteSiteConfig.getSummary() : '';
    label.textContent = summary;
    item.hidden = !summary;
  }

  render() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-top">
            <div class="footer-brand">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="logo-circle-wrapper" style="width: 44px; height: 44px;">
                  <img src="assets/logo.jpg" alt="Logo Coyote's House" width="44" height="44">
                </div>
                <span class="brand-name" style="font-size: 1.2rem;">Coyote's <span>House</span></span>
              </div>
              <p>Taller mecánico especializado en motocicletas modernas con altos estándares de calidad, atendido directamente por Alberto Pizarro.</p>
            </div>

            <div class="footer-links">
              <h4>Navegación Rápida</h4>
              <ul>
                <li><a href="index.html">Inicio</a></li>
                <li><a href="servicios.html">Servicios y Especialidades</a></li>
                <li><a href="sobre-alberto.html">Sobre Alberto Pizarro</a></li>
                <li><a href="cotizador.html">Solicitar Agendamiento o Cotización</a></li>
                <li><a href="galeria.html">Galería de Trabajos</a></li>
                <li><a href="resenas.html">Reseñas de Google</a></li>
                <li><a href="faq.html">Preguntas Frecuentes</a></li>
                <li><a href="contacto.html">Ubicación y Horarios</a></li>
              </ul>
            </div>

            <div class="footer-links">
              <h4>Contacto Oficial</h4>
              <ul>
                <li>📍 Av. Macul 5845, Macul, Santiago</li>
                <li>💬 WhatsApp: <a href="https://wa.me/56954750993" target="_blank" rel="noopener" style="color: var(--color-whatsapp);">+56 9 5475 0993</a></li>
                <li class="footer-schedule-item" hidden>🕒 <span class="footer-schedule"></span></li>
                <li>📸 <a href="https://www.instagram.com/tallercoyoteshouse/" target="_blank" rel="noopener">@tallercoyoteshouse</a></li>
              </ul>
            </div>
          </div>

          <div class="footer-bottom">
            <div>
              © 2026 <strong>Coyote's House</strong> — Taller Mecánico de Motocicletas. Todos los derechos reservados.
            </div>
            <div>
              Dirección Técnica: Alberto Pizarro | Macul, Santiago de Chile
            </div>
          </div>
        </div>
      </footer>
    `;

    this.updateSchedule();
  }
}

customElements.define('site-footer', SiteFooter);
