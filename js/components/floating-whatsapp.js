/**
 * Componente: FloatingWhatsapp (<floating-whatsapp>)
 * Botones flotantes de Redes Sociales (Instagram, Facebook) y WhatsApp con flecha para ocultar/desplegar.
 */

class FloatingWhatsapp extends HTMLElement {
  connectedCallback() {
    this.WHATSAPP_PHONE = '56954750993';
    this.INSTAGRAM_URL = 'https://www.instagram.com/tallercoyoteshouse/';
    this.FACEBOOK_URL = 'https://www.facebook.com/CoyotesHouse/';
    this.render();
    this.initFloatingWidget();
  }

  initFloatingWidget() {
    const widget = this.querySelector('#floatingSocialWidget');
    const toggleBtn = this.querySelector('#floatingToggleBtn');
    const floatingWhatsappBtn = this.querySelector('#floatingWhatsappBtn');
    const floatingPopup = this.querySelector('#whatsappPopup');
    const popupClose = this.querySelector('#popupClose');
    const quickMessageBtns = this.querySelectorAll('.quick-msg-btn');

    // Toggle para ocultar / mostrar todos los botones
    if (toggleBtn && widget) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = widget.classList.toggle('collapsed');
        toggleBtn.setAttribute('title', isCollapsed ? 'Mostrar redes y WhatsApp' : 'Ocultar botones');
        toggleBtn.setAttribute('aria-label', isCollapsed ? 'Mostrar redes y WhatsApp' : 'Ocultar botones');
        if (isCollapsed && floatingPopup) {
          floatingPopup.classList.remove('show');
        }
      });
    }

    // Popup WhatsApp
    if (floatingWhatsappBtn && floatingPopup) {
      floatingWhatsappBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        floatingPopup.classList.toggle('show');
      });

      popupClose?.addEventListener('click', (e) => {
        e.stopPropagation();
        floatingPopup.classList.remove('show');
      });

      document.addEventListener('click', (e) => {
        if (!floatingPopup.contains(e.target) && e.target !== floatingWhatsappBtn) {
          floatingPopup.classList.remove('show');
        }
      });

      quickMessageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const text = btn.getAttribute('data-text') || '¡Hola Alberto! Quisiera hacer una consulta para mi moto.';
          const url = `https://wa.me/${this.WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
          window.open(url, '_blank');
          floatingPopup.classList.remove('show');
        });
      });
    }
  }

  render() {
    this.innerHTML = `
      <div class="floating-social-widget" id="floatingSocialWidget">
        
        <!-- Popup WhatsApp -->
        <div class="whatsapp-popup" id="whatsappPopup">
          <div class="popup-header">
            <h5 style="display: flex; align-items: center; gap: 0.5rem; margin: 0;">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="var(--color-whatsapp)">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
              </svg>
              <span>Habla con Alberto Pizarro</span>
            </h5>
            <button class="popup-close" id="popupClose" aria-label="Cerrar">&times;</button>
          </div>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0;">
            ¡Hola! Selecciona una opción rápida o escribe tu consulta para responderte a la brevedad:
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.45rem;">
            <button type="button" class="btn btn-outline btn-sm quick-msg-btn" data-text="¡Hola Alberto! 👋 Quisiera pedir hora para mantención de mi moto." style="justify-content: flex-start; text-align: left; font-size: 0.82rem;">
              <span>🔧 Pedir hora de mantención</span>
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-msg-btn" data-text="¡Hola Alberto! 👋 Quisiera agendar una visita al taller para revisar el motor o frenos de mi moto." style="justify-content: flex-start; text-align: left; font-size: 0.82rem;">
              <span>🛠️ Revisión de motor o frenos</span>
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-msg-btn" data-text="¡Hola Alberto! 👋 Quisiera hacer una consulta para mi moto." style="justify-content: flex-start; text-align: left; font-size: 0.82rem;">
              <span>💬 Consulta general</span>
            </button>
          </div>
          <a href="https://wa.me/56954750993" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="width: 100%; margin-top: 0.25rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            <span>Abrir Chat en WhatsApp</span>
          </a>
        </div>

        <!-- Grupo de Botones de Redes y WhatsApp -->
        <div class="floating-buttons-group" id="floatingButtonsGroup">
          <!-- Botón Instagram -->
          <a href="${this.INSTAGRAM_URL}" target="_blank" rel="noopener" class="floating-btn-item instagram" title="Síguenos en Instagram" aria-label="Instagram de Coyote's House">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="22" height="22" fill="#ffffff">
              <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
            </svg>
          </a>

          <!-- Botón Facebook -->
          <a href="${this.FACEBOOK_URL}" target="_blank" rel="noopener" class="floating-btn-item facebook" title="Síguenos en Facebook" aria-label="Facebook de Coyote's House">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="22" height="22" fill="#ffffff">
              <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
            </svg>
          </a>

          <!-- Botón WhatsApp Principal -->
          <button class="floating-btn-item whatsapp" id="floatingWhatsappBtn" title="Chatea por WhatsApp" aria-label="Contactar por WhatsApp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="28" height="28" fill="#ffffff">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            <span class="floating-whatsapp-badge">1</span>
          </button>
        </div>

        <!-- Flechita para Esconder / Mostrar Todo -->
        <button class="floating-toggle-btn" id="floatingToggleBtn" title="Ocultar botones" aria-label="Ocultar botones flotantes">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

      </div>
    `;
  }
}

customElements.define('floating-whatsapp', FloatingWhatsapp);

