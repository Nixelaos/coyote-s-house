/**
 * Componente: FloatingWhatsapp (<floating-whatsapp>)
 * Botón flotante interactivo de WhatsApp con popup de consultas rápidas.
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
            <h5>💬 Habla con Alberto Pizarro</h5>
            <button class="popup-close" id="popupClose" aria-label="Cerrar">&times;</button>
          </div>
          <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0;">
            ¡Hola! Selecciona una opción rápida o escribe tu consulta para responderte a la brevedad:
          </p>
          <div style="display: flex; flex-direction: column; gap: 0.45rem;">
            <button type="button" class="btn btn-outline btn-sm quick-msg-btn" data-text="¡Hola Alberto! 👋 Quisiera pedir hora para mantención de mi moto." style="justify-content: flex-start; text-align: left; font-size: 0.82rem;">
              🔧 Pedir hora de mantención
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-msg-btn" data-text="¡Hola Alberto! 👋 Necesito cotizar un diagnóstico con escáner para mi moto." style="justify-content: flex-start; text-align: left; font-size: 0.82rem;">
              💻 Diagnóstico con escáner
            </button>
            <button type="button" class="btn btn-outline btn-sm quick-msg-btn" data-text="¡Hola Alberto! 👋 Quisiera consultar por una revisión pre-compra de una moto usada." style="justify-content: flex-start; text-align: left; font-size: 0.82rem;">
              🔍 Revisión pre-compra
            </button>
          </div>
          <a href="https://wa.me/56954750993" target="_blank" rel="noopener" class="btn btn-whatsapp btn-sm" style="width: 100%; margin-top: 0.25rem;">
            Abrir Chat en WhatsApp
          </a>
        </div>

        <button class="floating-whatsapp-btn" id="floatingWhatsappBtn" aria-label="Contactar por WhatsApp">
          <span>💬</span>
          <span class="floating-whatsapp-badge">1</span>
        </button>
      </div>
    `;
  }
}

customElements.define('floating-whatsapp', FloatingWhatsapp);
