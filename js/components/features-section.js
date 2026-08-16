/**
 * Componente: FeaturesSection (<features-section>)
 * Pilares de excelencia y propuesta de valor del taller (4 tarjetas).
 */

class FeaturesSection extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="features-section">
        <div class="container">
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon-box">🎓</div>
              <h3 class="feature-title">Docente de Mecánica</h3>
              <p class="feature-desc">Atendido directamente por Alberto Pizarro, profesor formador de mecánicos en Chile. Conocimiento técnico al más alto nivel.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-box">💻</div>
              <h3 class="feature-title">Escáner & Diagnóstico OBD</h3>
              <p class="feature-desc">Equipamiento electrónico avanzado para motos de inyección (EFI), reseteo de fallas DTC, pautas de servicio y telemetría.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-box">🤝</div>
              <h3 class="feature-title">Transparencia Total</h3>
              <p class="feature-desc">Explicación clara de cada intervención, repuestos de primera línea y presupuesto previo sin cobros sorpresas.</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon-box">🏍️</div>
              <h3 class="feature-title">Todas las Cilindradas</h3>
              <p class="feature-desc">Especialistas en deportivas, naked, touring, trail, custom, scooters urbanos y motos de alta cilindrada multimarca.</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('features-section', FeaturesSection);
