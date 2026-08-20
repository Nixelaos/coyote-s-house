/**
 * Componente: WorkshopGallery (<workshop-gallery>)
 * Galería de fotos del taller con publicaciones de casos técnicos reales,
 * desglose secuencial paso a paso (1 a 7) y visor lightbox interactivo.
 */

class WorkshopGallery extends HTMLElement {
  constructor() {
    super();
    this.currentLightboxIndex = 0;
    this.galleryImages = [
      {
        src: 'assets/1-motor-desarmado-completo.webp',
        step: 'Paso 01',
        title: 'Desmontaje Completo del Motor',
        desc: 'Desmonte íntegro de la unidad de motor para inspección general y localización de la fuga de aceite activa.'
      },
      {
        src: 'assets/2-motor-analizando.webp',
        step: 'Paso 02',
        title: 'Inspección Técnica & Diagnóstico',
        desc: 'Evaluación visual detallada de desgaste en componentes, tolerancias y estado de sellos.'
      },
      {
        src: 'assets/3-motor-analizando-2.webp',
        step: 'Paso 03',
        title: 'Revisión de Rodamientos y Tolerancias',
        desc: 'Inspección del estado de rodamientos internos, juego axial y verificación de holguras mecánicas.'
      },
      {
        src: 'assets/4-motor-desamblaje.webp',
        step: 'Paso 04',
        title: 'Desensamblaje y Preparación de Piezas',
        desc: 'Separación técnica de componentes; preparación de culata y cilindro para rectificadora.'
      },
      {
        src: 'assets/5-motor-talado-desatornillando-2.webp',
        step: 'Paso 05',
        title: 'Desajuste Técnico con Instrumental',
        desc: 'Desmontaje controlado de embrague y piñones con herramientas de precisión.'
      },
      {
        src: 'assets/6-motor-taladro-atornillando.webp',
        step: 'Paso 06',
        title: 'Armado, Torreado y Sustitución',
        desc: 'Instalación de nueva cadenilla de distribución, piñón antivibración y kit completo de empaquetaduras y sellos.'
      },
      {
        src: 'assets/7-motor-armado-completo.webp',
        step: 'Paso 07',
        title: 'Motor Reacondicionado y Armado Completo',
        desc: 'Unidad de motor 100% armada, sellada y testeada con tolerancias originales y óptimo rendimiento.'
      }
    ];
  }

  connectedCallback() {
    this.render();
    this.initGalleryEvents();
  }

  disconnectedCallback() {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
  }

  initGalleryEvents() {
    const photoItems = this.querySelectorAll('.post-photo-item');
    const modal = this.querySelector('.lightbox-modal');
    const closeBtn = this.querySelector('.lightbox-close');
    const prevBtn = this.querySelector('.lightbox-prev');
    const nextBtn = this.querySelector('.lightbox-next');
    const thumbItems = this.querySelectorAll('.lightbox-thumb');

    photoItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.openLightbox(index);
      });
    });

    closeBtn?.addEventListener('click', () => this.closeLightbox());
    prevBtn?.addEventListener('click', () => this.prevLightbox());
    nextBtn?.addEventListener('click', () => this.nextLightbox());

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeLightbox();
      }
    });

    thumbItems.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        this.setLightboxImage(index);
      });
    });

    this.keydownHandler = (e) => {
      if (!modal?.classList.contains('active')) return;
      if (e.key === 'Escape') this.closeLightbox();
      if (e.key === 'ArrowLeft') this.prevLightbox();
      if (e.key === 'ArrowRight') this.nextLightbox();
    };
    document.addEventListener('keydown', this.keydownHandler);
  }

  openLightbox(index) {
    const modal = this.querySelector('.lightbox-modal');
    this.setLightboxImage(index);
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    const modal = this.querySelector('.lightbox-modal');
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  setLightboxImage(index) {
    if (index < 0) index = this.galleryImages.length - 1;
    if (index >= this.galleryImages.length) index = 0;
    this.currentLightboxIndex = index;

    const data = this.galleryImages[index];
    const imgEl = this.querySelector('.lightbox-img');
    const titleEl = this.querySelector('.lightbox-title');
    const descEl = this.querySelector('.lightbox-desc');
    const counterEl = this.querySelector('.lightbox-counter');
    const stepEl = this.querySelector('.lightbox-step');
    const thumbItems = this.querySelectorAll('.lightbox-thumb');

    if (imgEl) imgEl.src = data.src;
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.desc;
    if (counterEl) counterEl.textContent = `${index + 1} / ${this.galleryImages.length}`;
    if (stepEl) stepEl.textContent = data.step;

    thumbItems.forEach((th, i) => {
      th.classList.toggle('active', i === index);
    });
  }

  prevLightbox() {
    this.setLightboxImage(this.currentLightboxIndex - 1);
  }

  nextLightbox() {
    this.setLightboxImage(this.currentLightboxIndex + 1);
  }

  render() {
    this.innerHTML = `
      <section class="gallery-section" id="galeria">
        <div class="container">
          
          <!-- Encabezado de la Sección -->
          <div class="text-center gallery-header-wrap">
            <span class="section-tag">Bitácora Técnica & Procedimientos</span>
            <h1 class="section-title">Trabajos y <span class="highlight-accent">Casos Reales en Taller</span></h1>
            <p class="section-subtitle center-block">
              Registro detallado de diagnósticos, desarmes, rectificaciones y puestas a punto realizadas por Alberto Pizarro en Coyote's House.
            </p>
          </div>

          <!-- Publicación: Caso Técnico #01 -->
          <article class="workshop-post-card">
            
            <!-- Encabezado de la Publicación -->
            <div class="post-header">
              <div class="post-meta-badges">
                <span class="badge-post-case">🔧 Caso de Taller #01</span>
                <span class="badge-post-tag">Procedimiento Integral • Overhaul</span>
                <span class="badge-post-status">✓ Finalizado</span>
              </div>
              <h2 class="post-title">
                Diagnóstico y Solución de Fuga de Aceite: Desmontaje y Reacondicionamiento Integral de Motor
              </h2>
              <div class="post-author-bar">
                <span class="post-author-item">👨‍🔧 <strong>Responsable Técnico:</strong> Alberto Pizarro</span>
                <span class="post-author-item">📍 <strong>Ubicación:</strong> Taller Coyote's House, Macul</span>
                <span class="post-author-item">📷 <strong>Registro:</strong> 7 Fotografías en Secuencia</span>
              </div>
            </div>

            <!-- Ficha Técnica del Informe -->
            <div class="post-report-box">
              
              <!-- 1. Diagnóstico Inicial -->
              <div class="report-card report-diag">
                <div class="report-icon-title">
                  <span class="report-icon">🔍</span>
                  <h3 class="report-heading">Diagnóstico Inicial</h3>
                </div>
                <p class="report-text">
                  <strong>Fuga de aceite activa.</strong> Se procedió al desmontaje completo de la unidad de motor para inspección general.
                </p>
              </div>

              <!-- 2. Trabajos en Proceso -->
              <div class="report-card report-process">
                <div class="report-icon-title">
                  <span class="report-icon">⚙️</span>
                  <h3 class="report-heading">Trabajos en Proceso</h3>
                </div>
                <ul class="report-list">
                  <li>
                    <span class="list-bullet">▪</span>
                    <span>Desarme íntegro y revisión del estado de rodamientos internos.</span>
                  </li>
                  <li>
                    <span class="list-bullet">▪</span>
                    <span>Reemplazo del kit de empaquetaduras y sellos completos.</span>
                  </li>
                  <li>
                    <span class="list-bullet">▪</span>
                    <span>Sustitución de cadenilla de distribución y piñón antivibración.</span>
                  </li>
                  <li>
                    <span class="list-bullet">▪</span>
                    <span>Envío de culata y cilindro a rectificadora para cepillado/planeado y rectificación de superficies.</span>
                  </li>
                </ul>
              </div>

              <!-- 3. Objetivo -->
              <div class="report-card report-goal">
                <div class="report-icon-title">
                  <span class="report-icon">🎯</span>
                  <h3 class="report-heading">Objetivo</h3>
                </div>
                <p class="report-text">
                  Garantizar un sellado óptimo y restaurar el rendimiento del motor según los estándares solicitados por el cliente.
                </p>
              </div>

            </div>

            <!-- Galería de Fotos del Caso (1 a 7 en Orden) -->
            <div class="post-gallery-block">
              <div class="post-gallery-header">
                <h3 class="post-gallery-title">
                  📸 Registro Fotográfico del Procedimiento (Fotos 1 a 7)
                </h3>
                <span class="post-gallery-hint">Haz clic en cualquier imagen para abrir el visor en alta resolución</span>
              </div>

              <div class="post-photos-grid">
                ${this.galleryImages.map((img, idx) => `
                  <div class="post-photo-item" data-index="${idx}" title="${img.title}">
                    <div class="post-photo-thumb">
                      <img src="${img.src}" alt="${img.title}" loading="lazy" width="400" height="400">
                      <span class="photo-step-badge">${img.step}</span>
                      <div class="photo-overlay-hover">
                        <span class="zoom-icon">🔍</span>
                        <span class="zoom-text">Ver en Grande</span>
                      </div>
                    </div>
                    <div class="post-photo-info">
                      <h4 class="post-photo-caption-title">${img.title}</h4>
                      <p class="post-photo-caption-desc">${img.desc}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Pie de la Publicación & CTA -->
            <div class="post-footer-cta">
              <div class="cta-text-wrap">
                <h4 class="cta-post-title">¿Tu moto presenta fugas de aceite o pérdida de compresión?</h4>
                <p class="cta-post-desc">Diagnóstico honesto, instrumental técnico y atención personalizada por Alberto Pizarro.</p>
              </div>
              <div class="cta-actions">
                <a href="https://wa.me/56954750993?text=Hola%20Alberto%2C%20vi%20la%20publicación%20del%20desarme%20de%20motor%20en%20la%20galería%20y%20quisiera%20consultar%20por%20mi%20moto" target="_blank" rel="noopener" class="btn btn-whatsapp">
                  <span>💬</span> Consultar este Procedimiento
                </a>
                <a href="cotizador.html" class="btn btn-outline">
                  <span>⚡</span> Ir al Cotizador
                </a>
              </div>
            </div>

          </article>

        </div>

        <!-- Lightbox Modal Interactivo -->
        <div class="lightbox-modal" role="dialog" aria-modal="true" aria-label="Visor de Fotografías de Taller">
          <div class="lightbox-dialog">
            
            <button class="lightbox-close" aria-label="Cerrar Visor">✕</button>
            <button class="lightbox-nav lightbox-prev" aria-label="Foto Anterior">❮</button>
            <button class="lightbox-nav lightbox-next" aria-label="Foto Siguiente">❯</button>

            <div class="lightbox-main-view">
              <div class="lightbox-image-container">
                <img class="lightbox-img" src="" alt="Fotografía del procedimiento de taller">
              </div>
              
              <div class="lightbox-details-panel">
                <div class="lightbox-meta">
                  <span class="lightbox-step">Paso 01</span>
                  <span class="lightbox-counter">1 / 7</span>
                </div>
                <h3 class="lightbox-title">Título de la Fotografía</h3>
                <p class="lightbox-desc">Descripción del paso del procedimiento.</p>
                
                <!-- Tira de Miniaturas -->
                <div class="lightbox-thumbnails-strip">
                  ${this.galleryImages.map((img, idx) => `
                    <button class="lightbox-thumb ${idx === 0 ? 'active' : ''}" data-index="${idx}" aria-label="Ver foto ${idx + 1}">
                      <img src="${img.src}" alt="${img.step}" loading="lazy" width="60" height="60">
                      <span class="thumb-number">${idx + 1}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

          </div>
        </div>

      </section>
    `;
  }
}

customElements.define('workshop-gallery', WorkshopGallery);

