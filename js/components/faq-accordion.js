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
                <span>¿Cuáles son los tiempos de entrega habituales?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Las mantenciones preventivas y por kilometraje se entregan en su gran mayoría durante el mismo día (siempre que no surjan imprevistos mecánicos). Las reparaciones de motores pequeños salen de 24 a 48 hrs, mientras que cilindradas mayores dependen de la disponibilidad de repuestos específicos.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Qué marcas y tipos de motocicletas atienden?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Atendemos motocicletas de calle homologadas para circular de las principales marcas: Honda, Yamaha, Suzuki, Kawasaki, KTM, BMW, Bajaj, CFMOTO, Zontes, Haojue, Aprilia, Benelli, Husqvarna, etc. Otras marcas y modelos quedan sujetos a consulta técnica previa.
              </div>
            </div>

            <div class="faq-item">
              <button class="faq-header" type="button">
                <span>¿Qué incluye la pauta de mantención completa?</span>
                <span class="faq-icon">+</span>
              </button>
              <div class="faq-body">
                Es una inspección integral de más de 25 puntos desde el interior hacia el exterior: ajuste/luz de válvulas, torque de culata, aseo de inyector/carburador, prueba de chispa de bujías en probador específico en banco, carga de batería al 100%, scanner con lectura de parámetros, y relubricación de rodamientos y pistas de caliper.
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
                Atendemos de Lunes a Viernes de 09:00 a 17:00 hrs en Av. Macul 5847, Macul, Santiago. Aceptamos transferencias bancarias y efectivo.
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('faq-accordion', FaqAccordion);
