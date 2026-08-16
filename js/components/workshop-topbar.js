/**
 * Componente: WorkshopTopbar (<workshop-topbar>)
 * Barra superior con horario dinámico en tiempo real y datos de contacto rápido.
 */

class WorkshopTopbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initScheduleTimer();
  }

  disconnectedCallback() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  updateWorkshopStatus() {
    const badge = this.querySelector('.status-badge');
    if (!badge) return;

    const now = new Date();
    const day = now.getDay(); // 0: Domingo, 1: Lunes, ... 6: Sábado
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hour + minutes / 60;

    let isOpen = false;
    let statusText = '';

    // Lunes (1) a Viernes (5) de 09:00 a 17:00
    if (day >= 1 && day <= 5) {
      if (currentTime >= 9.0 && currentTime < 17.0) {
        isOpen = true;
        statusText = '🟢 Abierto hoy hasta las 17:00 hrs';
      } else if (currentTime < 9.0) {
        statusText = '🔴 Cerrado ahora (Abrimos a las 09:00 hrs)';
      } else {
        if (day === 5) {
          statusText = '🔴 Cerrado (Abrimos el lunes a las 09:00 hrs)';
        } else {
          statusText = '🔴 Cerrado (Abrimos mañana a las 09:00 hrs)';
        }
      }
    } else {
      statusText = '🔴 Cerrado fin de semana (Abrimos el lunes a las 09:00 hrs)';
    }

    badge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
    badge.innerHTML = `<span class="status-dot"></span> ${statusText}`;
  }

  initScheduleTimer() {
    this.updateWorkshopStatus();
    this.timer = setInterval(() => this.updateWorkshopStatus(), 60000);
  }

  render() {
    this.innerHTML = `
      <div class="top-bar">
        <div class="container">
          <div class="top-info-left">
            <div class="status-badge open">
              <span class="status-dot"></span> Abierto hoy hasta las 17:00 hrs
            </div>
            <span class="top-link">
              📍 Av. Macul 5847, Macul, Santiago
            </span>
          </div>
          <div class="top-info-right">
            <span class="top-link">
              🕒 Lun a Vie: 09:00 a 17:00 hrs
            </span>
            <a href="https://wa.me/56954750993" target="_blank" rel="noopener" class="top-link" style="color: var(--color-whatsapp); font-weight: 700;">
              💬 WhatsApp: +56 9 5475 0993
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('workshop-topbar', WorkshopTopbar);
