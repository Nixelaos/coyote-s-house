/**
 * Componente: WorkshopTopbar (<workshop-topbar>)
 * Barra superior con horario dinámico en tiempo real y datos de contacto rápido.
 *
 * El horario lo administra el taller desde el panel y llega por
 * <site-config.js>, que resuelve el estado en la zona horaria oficial
 * 'America/Santiago' (UTC-4 / UTC-3 automático). Sin datos reales, el
 * indicador y el horario quedan ocultos: la dirección y el WhatsApp siempre se
 * ven.
 */

class WorkshopTopbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initScheduleTimer();
    this.updateCssHeight();

    this.boundResize = () => this.updateCssHeight();
    // El horario real llega unos milisegundos después del primer pintado.
    this.boundConfig = () => this.render();

    window.addEventListener('resize', this.boundResize);
    window.addEventListener('siteconfig:ready', this.boundConfig);
  }

  disconnectedCallback() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.boundResize) {
      window.removeEventListener('resize', this.boundResize);
    }
    if (this.boundConfig) {
      window.removeEventListener('siteconfig:ready', this.boundConfig);
    }
  }

  updateCssHeight() {
    requestAnimationFrame(() => {
      const height = this.offsetHeight;
      if (height > 0) {
        document.documentElement.style.setProperty('--topbar-height', `${height}px`);
      }
    });
  }

  /**
   * Estado de atención calculado a partir del horario configurado, o null si
   * no hay datos reales. Mostrar "Abierto" sin datos sería peor que no mostrar
   * el indicador.
   */
  getStatus() {
    if (window.CoyoteSiteConfig) {
      return window.CoyoteSiteConfig.getStatus();
    }
    return null;
  }

  getSummary() {
    if (window.CoyoteSiteConfig) {
      return window.CoyoteSiteConfig.getSummary();
    }
    return '';
  }

  updateWorkshopStatus() {
    const badge = this.querySelector('.status-badge');
    if (!badge) return;

    const status = this.getStatus();

    if (!status) {
      badge.hidden = true;
      this.updateCssHeight();
      return;
    }

    badge.hidden = false;
    badge.className = `status-badge ${status.isOpen ? 'open' : 'closed'}`;

    // Se reconstruye con nodos en vez de innerHTML: el texto proviene de la API.
    badge.textContent = '';

    const dot = document.createElement('span');
    dot.className = 'status-dot';
    dot.setAttribute('aria-hidden', 'true');

    const text = document.createElement('span');
    text.className = 'status-text';
    text.textContent = status.text;

    badge.appendChild(dot);
    badge.appendChild(document.createTextNode(' '));
    badge.appendChild(text);

    this.updateCssHeight();
  }

  updateScheduleLabel() {
    const label = this.querySelector('.top-schedule-text');
    if (!label) return;

    const summary = this.getSummary();
    label.textContent = summary;
    // Sin horario que mostrar, el reloj suelto no aporta nada.
    const container = this.querySelector('.top-schedule');
    if (container) container.hidden = !summary;
  }

  initScheduleTimer() {
    // El estado cambia con el reloj aunque nadie recargue la página.
    this.timer = setInterval(() => this.updateWorkshopStatus(), 60000);
  }

  render() {
    // Indicador y horario nacen ocultos y vacíos: solo aparecen con datos reales.
    this.innerHTML = `
      <div class="top-bar">
        <div class="container top-bar-container">
          <div class="top-info-left">
            <div class="status-badge closed" hidden></div>
            <span class="top-link top-address">
              📍 Av. Macul 5845, Macul, Santiago
            </span>
          </div>
          <div class="top-info-right">
            <span class="top-link top-schedule" hidden>
              🕒 <span class="top-schedule-text"></span>
            </span>
            <a href="https://wa.me/56954750993" target="_blank" rel="noopener" class="top-link top-whatsapp" style="color: var(--color-whatsapp); font-weight: 700;">
              💬 <span class="whatsapp-label">WhatsApp:</span> +56 9 5475 0993
            </a>
          </div>
        </div>
      </div>
    `;

    this.updateWorkshopStatus();
    this.updateScheduleLabel();
  }
}

customElements.define('workshop-topbar', WorkshopTopbar);
