/**
 * Componente: WorkshopTopbar (<workshop-topbar>)
 * Barra superior con horario dinámico en tiempo real y datos de contacto rápido.
 * Utiliza zona horaria oficial 'America/Santiago' (Chile UTC-4 / UTC-3 automático).
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

  getChileTime() {
    const now = new Date();
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Santiago',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
      });

      const parts = formatter.formatToParts(now);
      const partMap = {};
      for (const p of parts) {
        partMap[p.type] = p.value;
      }

      const daysMap = { 'Sun': 0, 'Mon': 1, 'Tue': 2, 'Wed': 3, 'Thu': 4, 'Fri': 5, 'Sat': 6 };
      const day = daysMap[partMap.weekday] ?? now.getDay();
      let hour = parseInt(partMap.hour, 10);
      if (hour === 24) hour = 0;
      const minutes = parseInt(partMap.minute, 10) || 0;

      return { day, hour, minutes, currentTime: hour + minutes / 60 };
    } catch (e) {
      // Fallback a horario local si Intl no estuviera disponible
      const day = now.getDay();
      const hour = now.getHours();
      const minutes = now.getMinutes();
      return { day, hour, minutes, currentTime: hour + minutes / 60 };
    }
  }

  updateWorkshopStatus() {
    const badge = this.querySelector('.status-badge');
    if (!badge) return;

    const { day, currentTime } = this.getChileTime();

    let isOpen = false;
    let statusText = '';

    // Lunes (1) a Viernes (5) de 09:00 a 17:00 (Hora de Santiago de Chile)
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
