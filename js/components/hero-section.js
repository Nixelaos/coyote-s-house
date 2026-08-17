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
          <div class="hero-grid">
            <div class="hero-content">
              <div class="hero-badge-wrap">
                <span class="hero-badge">
                  ⚡ Taller Especializado en Motocicletas
                </span>
              </div>
              
              <h1 class="hero-title">
                TU MOTO EN MANOS DE UN TÉCNICO CALIFICADO Y PROFESOR DE MECÁNICA
              </h1>

              <p class="hero-desc">
                En <strong>Coyote's House</strong> combinamos más de <strong>20 años de trayectoria</strong> con dedicación, método riguroso y altos estándares de precisión. Cuidado experto para todo tipo de marcas y cilindradas en Macul, Santiago.
              </p>

              <div class="hero-cta-group">
                <a href="cotizador.html" class="btn btn-primary btn-lg">
                  <span>🔧</span> Cotizar Servicio
                </a>
                <a href="https://wa.me/56954750993?text=Hola%20Alberto%2C%20quisiera%20consultar%20por%20un%20servicio%20para%20mi%20moto" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg">
                  <span>💬</span> WhatsApp Directo
                </a>
                <a href="contacto.html" class="btn btn-outline">
                  <span>📍</span> Cómo Llegar
                </a>
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
                  <span class="stat-number">Multimarca</span>
                  <span class="stat-label">Baja, media y alta cilindrada</span>
                </div>
              </div>
            </div>

            <div class="hero-media">
              <div class="hero-image-frame">
                <div class="image-placeholder hero-placeholder">
                  <span class="placeholder-icon">📷</span>
                  <span class="placeholder-tag">Insertar Imagen</span>
                  <span class="placeholder-desc">Taller Principal / Moto en elevador hidráulico</span>
                  <span class="placeholder-spec">Recomendado: 1200 x 800 px</span>
                </div>
                <div class="hero-floating-badge">
                  <div class="floating-icon">🐺</div>
                  <div>
                    <div class="floating-text-title">Alberto Pizarro — Taller Titular</div>
                    <div class="floating-text-sub">Atención personalizada y trabajo garantizado</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('hero-section', HeroSection);
