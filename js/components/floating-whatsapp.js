/**
 * Componente: FloatingWhatsapp (<floating-whatsapp>)
 * Botón flotante interactivo de WhatsApp con popup de consultas rápidas.
 * Utiliza el icono oficial vectorial de WhatsApp.
 */

class FloatingWhatsapp extends HTMLElement {
  connectedCallback() {
    this.WHATSAPP_PHONE = '56954750993';
    this.render();
    this.initFloatingWidget();
  }

  initFloatingWidget() {
    const floatingBtn = this.querySelector('#floatingWhatsappBtn');
    const floatingPopup = this.querySelector('#whatsappPopup');
    const popupClose = this.querySelector('#popupClose');
    const quickMessageBtns = this.querySelectorAll('.quick-msg-btn');

    if (floatingBtn && floatingPopup) {
      floatingBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        floatingPopup.classList.toggle('show');
      });

      popupClose?.addEventListener('click', (e) => {
        e.stopPropagation();
        floatingPopup.classList.remove('show');
      });

      document.addEventListener('click', (e) => {
        if (!floatingPopup.contains(e.target) && e.target !== floatingBtn) {
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
      <div class="floating-whatsapp">
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
              🔧 Pedir hora de mantención
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-msg-btn" data-text="¡Hola Alberto! 👋 Necesito cotizar una revisión de frenos o motor para mi moto." style="justify-content: flex-start; text-align: left; font-size: 0.82rem;">
              🛠️ Revisión de frenos o motor
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-msg-btn" data-text="¡Hola Alberto! 👋 Quisiera hacer una consulta para mi moto." style="justify-content: flex-start; text-align: left; font-size: 0.82rem;">
              💬 Otros
            </button>
          </div>
          <a href="https://wa.me/56954750993" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="width: 100%; margin-top: 0.25rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" fill="currentColor">
              <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
            </svg>
            <span>Abrir Chat en WhatsApp</span>
          </a>
        </div>

        <button class="floating-whatsapp-btn" id="floatingWhatsappBtn" aria-label="Contactar por WhatsApp">
          <svg class="whatsapp-btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="34" height="34" fill="#ffffff">
            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
          </svg>
          <span class="floating-whatsapp-badge">1</span>
        </button>
      </div>
    `;
  }
}

customElements.define('floating-whatsapp', FloatingWhatsapp);
