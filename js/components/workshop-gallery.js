/**
 * Componente: WorkshopGallery (<workshop-gallery>)
 * Galería del taller y catálogo de casos técnicos.
 * Muestra la publicación destacada con Foto 1 de portada que enlaza a su página dedicada (caso-ajuste-motor.html).
 */

class WorkshopGallery extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="gallery-section" id="galeria">
        <div class="container">
          
          <!-- Encabezado Principal -->
          <div class="text-center gallery-header-wrap">
            <span class="section-tag">Bitácora Técnica & Galería</span>
            <h1 class="section-title">Trabajos y <span class="highlight-accent">Casos en Taller</span></h1>
            <p class="section-subtitle center-block">
              Registro documentado paso a paso de procedimientos de alta complejidad realizados por Alberto Pizarro en Coyote's House.
            </p>
          </div>

          <!-- Publicación Destacada (Enlace Directo a la Página del Caso) -->
          <div class="featured-post-wrapper">
            <article class="featured-post-card">
              
              <!-- Barra Superior de Etiquetas (Arriba de la Foto) -->
              <div class="featured-card-badges-top">
                <span class="badge-post-case">Publicación Destacada</span>
                <span class="badge-post-status">✓ 7 Fotos Documentadas</span>
              </div>

              <!-- Portada con Foto 1 -->
              <a href="caso-ajuste-motor.html" class="featured-post-cover" title="Ver caso de ajuste de motor">
                <img src="assets/1-motor-desarmado-completo.webp" alt="Foto 1: Desmontaje y ajuste de motor" class="featured-cover-img" loading="lazy" width="450" height="320">
                <div class="cover-gradient-overlay"></div>
                <div class="cover-hover-prompt">
                  <span class="prompt-icon">🔍</span>
                  <span class="prompt-text">Ver Publicación Completa</span>
                </div>
              </a>

              <!-- Contenido de la Vista Previa -->
              <div class="featured-post-body">
                <div class="post-meta-line">
                  <span class="badge-post-tag">Procedimiento Integral • Ajuste de Motor</span>
                  <span class="meta-time">Caso 01</span>
                </div>

                <h2 class="featured-post-title">
                  <a href="caso-ajuste-motor.html" class="title-link">
                    Diagnóstico y Solución de Fuga de Aceite: Desmontaje y Reacondicionamiento Integral de Motor
                  </a>
                </h2>

                <p class="featured-post-summary">
                  <strong>Diagnóstico inicial:</strong> Fuga de aceite activa. Se procedió al desmontaje completo de la unidad de motor para inspección general.
                </p>

                <!-- Píldoras de Trabajos Destacados -->
                <div class="featured-highlights-list">
                  <div class="highlight-pill">⚙️ Desarme y revisión de rodamientos</div>
                  <div class="highlight-pill">🔧 Rectificación de culata y cilindro</div>
                  <div class="highlight-pill">⚡ Distribución y sellado completo</div>
                </div>

                <!-- Barra de Autor & Botón -->
                <div class="featured-post-footer">
                  <div class="post-author-chip">
                    <span class="author-avatar">👨‍🔧</span>
                    <div>
                      <span class="author-name">Alberto Pizarro</span>
                      <span class="author-sub">Taller Coyote's House, Macul</span>
                    </div>
                  </div>

                  <a href="caso-ajuste-motor.html" class="btn btn-primary">
                    <span>📖</span> Ver Publicación Completa (7 Fotos)
                  </a>
                </div>
              </div>

            </article>
          </div>

        </div>
      </section>
    `;
  }
}

customElements.define('workshop-gallery', WorkshopGallery);
