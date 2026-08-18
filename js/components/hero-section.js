/**
 * Componente: HeroSection (<hero-section>)
 * Sección principal de impacto con propuesta de valor, CTAs y enlaces a páginas.
 */

class HeroSection extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="hero-section" id="inicio">
        <div class="container">
          <div class="hero-badge-wrap">
            <span class="hero-badge">
              ⚡ Taller Especializado en Motocicletas
            </span>
          </div>

          <div class="hero-grid">
            <div class="hero-content">
              <h1 class="hero-title">
                TU MOTO EN MANOS DE UN PROFESIONAL CALIFICADO
              </h1>

              <p class="hero-desc">
                En <strong>Coyote's House</strong> combinamos más de <strong>20 años de trayectoria</strong> con dedicación, método riguroso y altos estándares de precisión. Cuidado experto para todo tipo de marcas y cilindradas en Macul, Santiago.
              </p>

              <div class="hero-cta-group">
                <a href="cotizador.html" class="btn btn-primary btn-lg">
                  <span>💬</span> Generar Cotización WhatsApp
                </a>
                <a href="contacto.html" class="btn btn-outline btn-lg">
                  <span>📍</span> Cómo Llegar
                </a>
              </div>
            </div>

            <div class="hero-media">
              <div class="hero-image-frame">
                <img src="assets/workshop-hero.jpg" alt="Taller Coyote's House - Motocicleta en elevador hidráulico y scanner de diagnóstico" loading="eager" width="904" height="910" decoding="async">
              </div>
            </div>
          </div>

          <div class="hero-stats-row">
            <div class="stat-item">
              <span class="stat-number">20+</span>
              <span class="stat-label">Años de experiencia profesional</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">100%</span>
              <span class="stat-label">Atención directa por su dueño</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">Garantizado</span>
              <span class="stat-label">Trabajo transparente y sin cobros sorpresa</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('hero-section', HeroSection);
