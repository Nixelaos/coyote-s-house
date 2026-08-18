/**
 * Componente: WhatsappCotizador (<whatsapp-cotizador>)
 * Cotizador interactivo en tiempo real con previsualización fidedigna y espaciosa de WhatsApp.
 */

class WhatsappCotizador extends HTMLElement {
  connectedCallback() {
    this.WHATSAPP_PHONE = '56954750993';
    this.render();
    this.initCotizador();
    this.initGlobalServiceListener();
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }

  getQuoteData() {
    const motoBrand = this.querySelector('#motoBrand');
    const motoModel = this.querySelector('#motoModel');
    const motoMileage = this.querySelector('#motoMileage');
    const serviceType = this.querySelector('#serviceType');
    const clientNotes = this.querySelector('#clientNotes');

    const rawBrand = (motoBrand && motoBrand.value) ? motoBrand.value.trim() : '';
    const rawModel = (motoModel && motoModel.value) ? motoModel.value.trim() : '';
    const rawMileage = (motoMileage && motoMileage.value) ? motoMileage.value.trim() : '';
    const service = (serviceType && serviceType.options[serviceType.selectedIndex]) 
      ? serviceType.options[serviceType.selectedIndex].text 
      : 'Mantenimiento Preventivo / Pauta por KM';
    const rawNotes = (clientNotes && clientNotes.value) ? clientNotes.value.trim() : '';

    return {
      brand: rawBrand,
      model: rawModel,
      mileage: rawMileage,
      service: service,
      notes: rawNotes
    };
  }

  generateWhatsAppMessage() {
    const data = this.getQuoteData();
    const brandText = data.brand || 'Por confirmar';
    const modelText = data.model || 'Por confirmar';
    const mileageText = data.mileage || 'Por confirmar';
    const notesText = data.notes ? `\n💬 *Detalle / Síntoma:* ${data.notes}` : '';

    const message = `¡Hola Alberto! 👋 Quisiera cotizar y agendar un servicio en *Coyote's House*:\n\n` +
      `🏍️ *Marca:* ${brandText}\n` +
      `📌 *Modelo / Año:* ${modelText}\n` +
      `🛣️ *Kilometraje:* ${mileageText}\n` +
      `🔧 *Servicio:* ${data.service}` +
      `${notesText}\n\n` +
      `¿Podrías indicarme disponibilidad de hora y presupuesto estimado? ¡Muchas gracias!`;

    return message;
  }

  updatePreview() {
    const whatsappPreview = this.querySelector('#whatsappPreview');
    if (!whatsappPreview) return;

    const data = this.getQuoteData();
    let timeStr = '09:00';
    try {
      timeStr = new Intl.DateTimeFormat('es-CL', {
        timeZone: 'America/Santiago',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(new Date());
    } catch (e) {
      const now = new Date();
      timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    const brandDisplay = data.brand 
      ? `<span class="wsp-item-val">${this.escapeHtml(data.brand)}</span>`
      : `<span class="wsp-item-val" style="opacity: 0.6; font-style: italic;">Ej: Yamaha</span>`;

    const modelDisplay = data.model 
      ? `<span class="wsp-item-val">${this.escapeHtml(data.model)}</span>`
      : `<span class="wsp-item-val" style="opacity: 0.6; font-style: italic;">Ej: MT-07 2022</span>`;

    const mileageDisplay = data.mileage 
      ? `<span class="wsp-item-val">${this.escapeHtml(data.mileage)}</span>`
      : `<span class="wsp-item-val" style="opacity: 0.6; font-style: italic;">Ej: 15.000 km</span>`;

    const notesDisplay = data.notes 
      ? `<span class="wsp-item-val">${this.escapeHtml(data.notes)}</span>`
      : `<span class="wsp-item-val" style="opacity: 0.55; font-style: italic;">(Opcional) Ej: Mantención periódica...</span>`;

    whatsappPreview.innerHTML = `
      <div class="wsp-bubble-header">
        ¡Hola Alberto! 👋 Quisiera cotizar y agendar un servicio en <strong>Coyote's House</strong>:
      </div>
      <div class="wsp-bubble-list">
        <div class="wsp-item">
          <span class="wsp-item-label">🏍️ Marca:</span>
          ${brandDisplay}
        </div>
        <div class="wsp-item">
          <span class="wsp-item-label">📌 Modelo / Año:</span>
          ${modelDisplay}
        </div>
        <div class="wsp-item">
          <span class="wsp-item-label">🛣️ Kilometraje:</span>
          ${mileageDisplay}
        </div>
        <div class="wsp-item">
          <span class="wsp-item-label">🔧 Servicio:</span>
          <span class="wsp-item-val">${this.escapeHtml(data.service)}</span>
        </div>
        <div class="wsp-item">
          <span class="wsp-item-label">💬 Detalle:</span>
          ${notesDisplay}
        </div>
      </div>
      <div class="wsp-bubble-footer-text">
        ¿Podrías indicarme disponibilidad de hora y presupuesto estimado? ¡Muchas gracias!
      </div>
      <div class="whatsapp-meta-row">
        <span class="whatsapp-time">${timeStr}</span>
        <span class="whatsapp-double-check">✓✓</span>
      </div>
    `;
  }

  sendToWhatsApp(e) {
    if (e) e.preventDefault();
    const message = this.generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.WHATSAPP_PHONE}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  initCotizador() {
    const motoBrand = this.querySelector('#motoBrand');
    const motoModel = this.querySelector('#motoModel');
    const motoMileage = this.querySelector('#motoMileage');
    const serviceType = this.querySelector('#serviceType');
    const clientNotes = this.querySelector('#clientNotes');
    const btnSendQuote = this.querySelector('#btnSendQuote');
    const btnSendQuotePreview = this.querySelector('#btnSendQuotePreview');

    const updateHandler = () => this.updatePreview();

    if (motoBrand) motoBrand.addEventListener('input', updateHandler);
    if (motoModel) motoModel.addEventListener('input', updateHandler);
    if (motoMileage) motoMileage.addEventListener('input', updateHandler);
    if (serviceType) serviceType.addEventListener('change', updateHandler);
    if (clientNotes) clientNotes.addEventListener('input', updateHandler);

    if (btnSendQuote) btnSendQuote.addEventListener('click', (e) => this.sendToWhatsApp(e));
    if (btnSendQuotePreview) btnSendQuotePreview.addEventListener('click', (e) => this.sendToWhatsApp(e));

    // Leer parámetro URL si viene desde servicios.html (ej: cotizador.html?servicio=motor)
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let serviceParam = urlParams.get('servicio');
      if (serviceParam && serviceType) {
        if (serviceParam === 'mantencion') serviceParam = 'mantencion-km';
        if (serviceType.querySelector(`option[value="${serviceParam}"]`)) {
          serviceType.value = serviceParam;
        }
      }
    } catch (err) {}

    this.updatePreview();
  }

  initGlobalServiceListener() {
    window.addEventListener('select-service', (e) => {
      let selectedService = e.detail?.service;
      const serviceType = this.querySelector('#serviceType');
      if (selectedService && serviceType) {
        if (selectedService === 'mantencion') selectedService = 'mantencion-km';
        if (serviceType.querySelector(`option[value="${selectedService}"]`)) {
          serviceType.value = selectedService;
        }
        this.updatePreview();
        const quoteSection = this.querySelector('#cotizador');
        if (quoteSection) {
          quoteSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  render() {
    this.innerHTML = `
      <section class="quote-section" id="cotizador">
        <div class="container">
          <div class="text-center" style="margin-bottom: 2.5rem;">
            <span class="section-tag">Cotización Inmediata</span>
            <h2 class="section-title">Genera tu consulta para <span class="highlight-accent">WhatsApp</span></h2>
            <p class="section-subtitle center-block">Completa los datos de tu moto a continuación. Se generará un mensaje claro y ordenado para que Alberto te responda con disponibilidad y presupuesto.</p>
          </div>

          <div class="quote-box">
            <div class="quote-grid">
              <form class="quote-form" id="quoteForm" onsubmit="return false;">
                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label" for="motoBrand">🏍️ Marca de tu Moto</label>
                    <input type="text" id="motoBrand" class="form-control" placeholder="Ej: Honda, Yamaha, BMW, Kawasaki...">
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="motoModel">📌 Modelo y Año</label>
                    <input type="text" id="motoModel" class="form-control" placeholder="Ej: MT-07 2022 / Duke 390 2021">
                  </div>
                </div>

                <div class="form-row-2">
                  <div class="form-group">
                    <label class="form-label" for="motoMileage">🛣️ Kilometraje</label>
                    <input type="text" id="motoMileage" class="form-control" placeholder="Ej: 15.000 km / 25.000 km">
                  </div>

                  <div class="form-group">
                    <label class="form-label" for="serviceType">🔧 Servicio Requerido</label>
                    <select id="serviceType" class="form-control">
                      <option value="mantencion-km" selected>Mantención por Kilometraje</option>
                      <option value="mantencion-prev">Mantención Preventiva</option>
                      <option value="motor">Reparación de Motores (Mecánica Menor y Dura)</option>
                      <option value="suspension">Servicio de Suspensión</option>
                      <option value="scanner">Scanner y Electrónica</option>
                      <option value="otro">Otro Servicio / Consulta General</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="clientNotes">💬 Detalle, Síntoma o Consulta Adicional (Opcional)</label>
                  <textarea id="clientNotes" class="form-control" rows="3" placeholder="Ej: Le toca la mantención de los 20.000 km y siento un ruido leve en el freno delantero..."></textarea>
                </div>

                <button type="button" class="btn btn-whatsapp btn-lg" id="btnSendQuote" style="width: 100%;">
                  <span>💬</span> Enviar Consulta a Alberto por WhatsApp
                </button>
              </form>

              <!-- Previsualización en Vivo del Mensaje (Mockup WhatsApp Coherente y Espacioso) -->
              <div class="whatsapp-mockup-card">
                <div class="whatsapp-mockup-header">
                  <div class="whatsapp-mockup-profile">
                    <div class="avatar-placeholder" title="Insertar Foto de Perfil">👨‍🔧</div>
                    <div class="whatsapp-mockup-info">
                      <div class="whatsapp-mockup-name-row">
                        <h4>Alberto Pizarro</h4>
                        <span class="whatsapp-verified-badge" title="Taller Oficial Coyote's House">✓</span>
                      </div>
                      <span class="whatsapp-mockup-status">
                        Taller Coyote's House (+56 9 5475 0993)
                      </span>
                    </div>
                  </div>
                  <div class="whatsapp-mockup-actions">
                    <span class="wsp-action-icon" title="Llamada">📞</span>
                    <span class="wsp-action-icon" title="Opciones">⋮</span>
                  </div>
                </div>

                <div class="whatsapp-mockup-body">
                  <div class="whatsapp-date-pill">HOY</div>

                  <!-- Mensaje de bienvenida oficial -->
                  <div class="whatsapp-bubble-wrap received">
                    <div class="whatsapp-bubble whatsapp-received">
                      <p>¡Hola! 👋 Bienvenido a <strong>Coyote's House</strong>. Completa tus datos y envíame este mensaje para coordinar tu hora y darte presupuesto.</p>
                      <div class="whatsapp-meta-row">
                        <span class="whatsapp-time">09:00</span>
                      </div>
                    </div>
                  </div>

                  <!-- Mensaje saliente generado en vivo -->
                  <div class="whatsapp-bubble-wrap sent">
                    <div class="whatsapp-bubble whatsapp-sent" id="whatsappPreview">
                      <!-- Se renderiza dinámicamente -->
                    </div>
                  </div>
                </div>

                <!-- Barra inferior interactiva de WhatsApp -->
                <div class="whatsapp-mockup-footer">
                  <div class="whatsapp-mockup-input-box">
                    <span class="whatsapp-input-icon">😊</span>
                    <span class="whatsapp-input-text">Mensaje listo para enviar a WhatsApp...</span>
                    <span class="whatsapp-input-icon">📎</span>
                  </div>
                  <button type="button" class="whatsapp-send-circle-btn" id="btnSendQuotePreview" title="Enviar a WhatsApp">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('whatsapp-cotizador', WhatsappCotizador);
