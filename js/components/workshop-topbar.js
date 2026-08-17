/**
 * Componente: WorkshopTopbar (<workshop-topbar>)
 * Barra superior con horario dinámico en tiempo real y datos de contacto rápido.
 * Utiliza zona horaria oficial 'America/Santiago' (Chile UTC-4 / UTC-3 automático).
 */

class WorkshopTopbar extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initScheduleTimer();
    this.updateCssHeight();
    this.boundResize = () => this.updateCssHeight();
    window.addEventListener('resize', this.boundResize);
  }

  disconnectedCallback() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.boundResize) {
      window.removeEventListener('resize', this.boundResize);
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
        statusText = 'Abierto hoy hasta 17:00';
      } else if (currentTime < 9.0) {
        statusText = 'Cerrado (Abre 09:00 hrs)';
      } else {
        if (day === 5) {
          statusText = 'Cerrado (Abre lunes 09:00)';
        } else {
          statusText = 'Cerrado (Abre mañana 09:00)';
        }
      }
    } else {
      statusText = 'Cerrado (Abre lunes 09:00)';
    }

    badge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
    badge.innerHTML = `<span class="status-dot"></span> <span class="status-text">${statusText}</span>`;
    this.updateCssHeight();
  }

  initScheduleTimer() {
    this.updateWorkshopStatus();
    this.timer = setInterval(() => this.updateWorkshopStatus(), 60000);
  }

  render() {
    this.innerHTML = `
      <div class="top-bar">
        <div class="container top-bar-container">
          <div class="top-info-left">
            <div class="status-badge open">
              <span class="status-dot"></span> <span class="status-text">Abierto hoy hasta 17:00</span>
            </div>
            <span class="top-link top-address">
              📍 Av. Macul 5847, Macul, Santiago
            </span>
          </div>
          <div class="top-info-right">
            <span class="top-link top-schedule">
              🕒 Lun a Vie: 09:00 a 17:00 hrs
            </span>
            <a href="https://wa.me/56954750993" target="_blank" rel="noopener" class="top-link top-whatsapp" style="color: var(--color-whatsapp); font-weight: 700;">
              💬 <span class="whatsapp-label">WhatsApp:</span> +56 9 5475 0993
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('workshop-topbar', WorkshopTopbar);
