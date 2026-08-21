/**
 * Componente: FaqAccordion (<faq-accordion>)
 * Acordeón interactivo de preguntas frecuentes con animación fluida.
 */

class FaqAccordion extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initAccordion();
  }

  initAccordion() {
    const faqItems = this.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const headerBtn = item.querySelector('.faq-header');
      const body = item.querySelector('.faq-body');

      headerBtn?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Cerrar otros
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        });

        if (!isActive) {
          item.classList.add('active');
          if (body) {
            body.style.maxHeight = body.scrollHeight + 40 + 'px';
          }
        }
      });
    });
  }

  render() {
    this.innerHTML = `
      <section class="faq-section" id="faq">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Dudas Comunes</span>
            <h2 class="section-title">Preguntas <span class="highlight-accent">Frecuentes</span></h2>
            <p class="section-subtitle center-block">Respuestas directas sobre la atención, tiempos de entrega, pauta técnica y marcas atendidas en Coyote's House.</p>
          </div>

          <div class="faq-container">
            <div class="faq-item active">
              <button class="faq-header" type="button">
                <span>¿Es necesario agendar hora previamente para llevar la moto?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body" style="max-height: 200px;">
                Sí, recomendamos agendar con anticipación por WhatsApp (+56 9 5475 0993) para reservar tu cupo en el elevador hidráulico y coordinar la entrega de tu moto en el mismo día.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Cuáles son los tiempos de entrega de los trabajos?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Los tiempos de entrega varían según el trabajo a realizar y la moto. Las mantenciones en su gran mayoría se entregan en el día (siempre que no se encuentren sorpresas). Las reparaciones de motores pequeños pueden salir en el día o de un día a otro, mientras que los más grandes suelen demorar un poco más según la disponibilidad de repuestos.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Qué motos y marcas se atienden en el taller?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Se atienden todas las motos de calle que estén homologadas para circular. Marcas de referencia habituales: Honda, Yamaha, Suzuki, Kawasaki, KTM, Bajaj, CF MOTO, Zontes, Haojue, Aprilia, Benelli, Husqvarna, BMW, Etc. Otras marcas o modelos no listados quedan a consulta técnica previa.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Qué incluye la pauta de mantención completa?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Incluye una inspección integral desde dentro hacia el exterior: revisión y/o ajuste de luz de válvulas, torque de culata, aseo a cuerpo de aceleración/carburador, aseo y test de inyector, sensores, actuadores, presión de bomba de combustible, filtro de aire, revisión y limpieza de bujías, apriete perimetral, rodamientos de masa, transmisión, dampers, test de batería, test de carga eléctrica, carga de batería al 100% durante el servicio, cables, partes móviles, scanner con lectura de parámetros y apriete general.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Se entrega presupuesto antes de realizar cualquier trabajo?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Absolutamente. Se realiza una revisión técnica transparente y te informamos el diagnóstico y presupuesto antes de intervenir tu moto. Sin cobros sorpresa.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Cuáles son los horarios de atención y ubicación?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Atendemos de Lunes a Viernes de 09:00 a 17:00 hrs en Av. Macul 5845, Macul, Santiago. Aceptamos transferencias bancarias y efectivo.
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('faq-accordion', FaqAccordion);
