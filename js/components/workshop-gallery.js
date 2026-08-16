/**
 * Componente: WorkshopGallery (<workshop-gallery>)
 * Galería de fotos del taller, elevadores y procedimientos con overlays descriptivos.
 */

class WorkshopGallery extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="gallery-section" id="galeria">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Galería del Taller</span>
            <h2 class="section-title">Trabajos y <span class="highlight-gold">Procedimientos en Taller</span></h2>
            <p class="section-subtitle center-block">Un vistazo a nuestras instalaciones, instrumental de precisión y el cuidado que brindamos a cada moto.</p>
          </div>

          <div class="gallery-grid">
            <div class="gallery-item">
              <div class="image-placeholder gallery-placeholder">
                <span class="placeholder-icon">📷</span>
                <span class="placeholder-tag">Insertar Imagen</span>
                <span class="placeholder-desc">Instalaciones de Servicio y Elevadores</span>
                <span class="placeholder-spec">800 x 600 px</span>
              </div>
              <div class="gallery-overlay">
                <div class="gallery-caption-title">Instalaciones de Servicio</div>
                <div class="gallery-caption-sub">Elevadores hidráulicos y espacio técnico ordenado</div>
              </div>
            </div>

            <div class="gallery-item">
              <div class="image-placeholder gallery-placeholder">
                <span class="placeholder-icon">📷</span>
                <span class="placeholder-tag">Insertar Imagen</span>
                <span class="placeholder-desc">Mantenimiento Preventivo y Pauta por KM</span>
                <span class="placeholder-spec">800 x 600 px</span>
              </div>
              <div class="gallery-overlay">
                <div class="gallery-caption-title">Puesta a Punto & Fluidos</div>
                <div class="gallery-caption-sub">Cambio de aceites sintéticos, filtros y bujías</div>
              </div>
            </div>

            <div class="gallery-item">
              <div class="image-placeholder gallery-placeholder">
                <span class="placeholder-icon">📷</span>
                <span class="placeholder-tag">Insertar Imagen</span>
                <span class="placeholder-desc">Torque y Calibración de Motores</span>
                <span class="placeholder-spec">800 x 600 px</span>
              </div>
              <div class="gallery-overlay">
                <div class="gallery-caption-title">Ajuste de Válvulas y Distribución</div>
                <div class="gallery-caption-sub">Torquímetros de precisión según manual de taller</div>
              </div>
            </div>

            <div class="gallery-item">
              <div class="image-placeholder gallery-placeholder">
                <span class="placeholder-icon">📷</span>
                <span class="placeholder-tag">Insertar Imagen</span>
                <span class="placeholder-desc">Mantenimiento de Horquillas y Frenos</span>
                <span class="placeholder-spec">800 x 600 px</span>
              </div>
              <div class="gallery-overlay">
                <div class="gallery-caption-title">Suspensión & Frenos</div>
                <div class="gallery-caption-sub">Horquillas invertidas, retenes y purgado hidráulico</div>
              </div>
            </div>

            <div class="gallery-item">
              <div class="image-placeholder gallery-placeholder">
                <span class="placeholder-icon">📷</span>
                <span class="placeholder-tag">Insertar Imagen</span>
                <span class="placeholder-desc">Transmisión, Cadena y Kit de Arrastre</span>
                <span class="placeholder-spec">800 x 600 px</span>
              </div>
              <div class="gallery-overlay">
                <div class="gallery-caption-title">Transmisión & Rodamientos</div>
                <div class="gallery-caption-sub">Alineación, tensión y lubricación técnica</div>
              </div>
            </div>

            <div class="gallery-item">
              <div class="image-placeholder gallery-placeholder">
                <span class="placeholder-icon">📷</span>
                <span class="placeholder-tag">Insertar Imagen</span>
                <span class="placeholder-desc">Atención Personalizada en Taller</span>
                <span class="placeholder-spec">800 x 600 px</span>
              </div>
              <div class="gallery-overlay">
                <div class="gallery-caption-title">Atención Personalizada</div>
                <div class="gallery-caption-sub">Garantía de servicio por Alberto Pizarro</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('workshop-gallery', WorkshopGallery);
