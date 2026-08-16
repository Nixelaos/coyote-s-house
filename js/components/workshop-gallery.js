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
                <span class="placeholder-desc">Diagnóstico y Escáner Electrónico OBD</span>
                <span class="placeholder-spec">800 x 600 px</span>
              </div>
              <div class="gallery-overlay">
                <div class="gallery-caption-title">Diagnóstico Computarizado</div>
                <div class="gallery-caption-sub">Detección de sensores y calibración electrónica</div>
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
                <div class="gallery-caption-sub">Torquímetros digitales según manual de taller</div>
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
                <div class="gallery-caption-sub">Horquillas invertidas, retenes y purgado de ABS</div>
              </div>
            </div>

            <div class="gallery-item">
              <div class="image-placeholder gallery-placeholder">
                <span class="placeholder-icon">📷</span>
                <span class="placeholder-tag">Insertar Imagen</span>
                <span class="placeholder-desc">Banco Ultrasónico de Inyección EFI</span>
                <span class="placeholder-spec">800 x 600 px</span>
              </div>
              <div class="gallery-overlay">
                <div class="gallery-caption-title">Banco Ultrasónico de Inyección</div>
                <div class="gallery-caption-sub">Limpieza y ecualización de inyectores EFI</div>
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
