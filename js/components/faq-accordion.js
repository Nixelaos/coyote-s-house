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
      <section class="faq-section">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Dudas Comunes</span>
            <h2 class="section-title">Preguntas <span class="highlight-accent">Frecuentes</span></h2>
          </div>

          <div class="faq-container">
            <div class="faq-item active">
              <button class="faq-header" type="button">
                <span>¿Es necesario agendar hora previamente para llevar la moto?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body" style="max-height: 200px;">
                Sí, te recomendamos agendar con anticipación por WhatsApp (+56 9 5475 0993) para asegurar tu cupo en el elevador y brindarte un servicio dedicado sin esperas innecesarias.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Qué marcas y modelos de motocicletas atienden?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Atendemos todas las marcas del mercado: japonesas (Honda, Yamaha, Kawasaki, Suzuki), europeas (BMW, KTM, Ducati, Triumph), marcas en auge (Royal Enfield, Bajaj, Benelli, CF Moto) y scooters urbanos multimarca.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Se entrega presupuesto antes de realizar cualquier trabajo?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Absolutamente. Realizamos una inspección inicial, te explicamos el diagnóstico y los repuestos requeridos, y solo procedemos con tu aprobación expresa.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿En qué consiste la revisión pre-compra para motos usadas?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Es un chequeo integral de 30 puntos que incluye revisión funcional de sistemas, estado de chasis y suspensión, compresión del motor, frenos, transmisión, neumáticos y verificación de fugas. Te entregamos un informe técnico para que compres sobre seguro.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Cuáles son los horarios de atención y formas de pago?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Atendemos de Lunes a Viernes de 09:00 a 17:00 hrs. Aceptamos transferencias electrónicas bancarias y efectivo.
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('faq-accordion', FaqAccordion);
