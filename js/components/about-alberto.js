/**
 * Componente: AboutAlberto (<about-alberto>)
 * Sección biográfica y credenciales de Alberto Pizarro (Profesor de Mecánica).
 */

class AboutAlberto extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="about-section" id="sobre-alberto">
        <div class="container">
          <div class="about-grid">
            <div class="about-image-card">
              <div class="about-photo-wrapper">
                <div class="image-placeholder about-placeholder">
                  <span class="placeholder-icon">📷</span>
                  <span class="placeholder-tag">Insertar Imagen</span>
                  <span class="placeholder-desc">Foto de Alberto Pizarro en taller técnico</span>
                  <span class="placeholder-spec">Recomendado: 800 x 1000 px</span>
                </div>
              </div>
              <div class="experience-sticker">
                <span class="experience-years">20+</span>
                <span class="experience-tag">Años de Trayectoria</span>
              </div>
            </div>

            <div class="about-content">
              <span class="section-tag">Liderazgo Técnico</span>
              <h2 class="section-title">Alberto Pizarro: <span class="highlight-gold">Pasión, Precisión y Docencia</span></h2>

              <div class="about-quote">
                "Taller mecánico especializado en motocicletas modernas con altos estándares de calidad, atendido por técnico calificado y profesor de mecánica."
              </div>

              <p style="color: var(--color-text-body); font-size: 1.05rem;">
                En el mundo de las motos, la confianza lo es todo. Detrás de <strong>Coyote's House</strong> está <strong>Alberto Pizarro</strong>, un profesional con más de dos décadas de experiencia real en el rubro automotriz y de motocicletas, además de su labor formadora como <strong>profesor de mecánica</strong>.
              </p>

              <p style="color: var(--color-text-muted);">
                Esto significa que cada moto que entra a Coyote's House no es tratada con improvisaciones: se aplican métodos rigurosos de diagnóstico, herramientas calibradas y explicaciones transparentes para que como cliente entiendas exactamente qué se le hace a tu vehículo y por qué.
              </p>

              <div class="credentials-list">
                <div class="credential-box">
                  <div class="credential-icon">👨‍🏫</div>
                  <div class="credential-info">
                    <h4>Profesor de Mecánica</h4>
                    <p>Formador de nuevos profesionales técnicos con base teórica y práctica.</p>
                  </div>
                </div>

                <div class="credential-box">
                  <div class="credential-icon">🛠️</div>
                  <div class="credential-info">
                    <h4>Mecánica de Precisión</h4>
                    <p>Uso estricto de torques de manual y herramientas especializadas.</p>
                  </div>
                </div>

                <div class="credential-box">
                  <div class="credential-icon">📋</div>
                  <div class="credential-info">
                    <h4>Transparencia y Ética</h4>
                    <p>Diagnósticos fundamentados y repuestos legítimos.</p>
                  </div>
                </div>

                <div class="credential-box">
                  <div class="credential-icon">🏍️</div>
                  <div class="credential-info">
                    <h4>Pasión Motociclista</h4>
                    <p>Entendimiento real de las necesidades del piloto de calle y ruta.</p>
                  </div>
                </div>
              </div>

              <div style="margin-top: 1rem;">
                <a href="https://wa.me/56954750993?text=Hola%20Alberto%2C%20quisiera%20hacerte%20una%20consulta%20técnica%20sobre%20mi%20moto" target="_blank" rel="noopener" class="btn btn-primary">
                  <span>💬</span> Hablar Directamente con Alberto
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('about-alberto', AboutAlberto);
