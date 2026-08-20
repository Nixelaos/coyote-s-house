/**
 * Componente: CaseStudyMotor (<case-study-motor>)
 * Página dedicada para el Caso Técnico #01.
 * - Descarga secuencial ordenada de fotos (1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7) al ingresar a la página.
 * - Selector numérico limpio (1..7) sin textos redundantes.
 * - Sin descripciones debajo de la foto.
 * - Ampliación de fotografía a pantalla completa (Lightbox) al hacer clic.
 */

class CaseStudyMotor extends HTMLElement {
  constructor() {
    super();
    this.currentStep = 0;
    this.isLightboxOpen = false;
    this.loadedImages = new Set();
    this.preloadQueueRunning = false;

    this.postData = {
      tag: 'Caso de Taller • 01',
      category: 'Procedimiento Integral • Ajuste Completo de Motor',
      status: 'Finalizado',
      title: 'Diagnóstico y Solución de Fuga de Aceite: Desmontaje y Reacondicionamiento Integral de Motor',
      author: 'Alberto Pizarro',
      location: 'Taller Coyote\'s House, Macul',
      totalPhotos: 7,
      diagnostic: 'Fuga de aceite activa. Se procedió al desmontaje completo de la unidad de motor para inspección general.',
      process: [
        'Desarme íntegro y revisión del estado de rodamientos internos.',
        'Reemplazo del kit de empaquetaduras y sellos completos.',
        'Sustitución de cadenilla de distribución y piñón antivibración.',
        'Envío de culata y cilindro a rectificadora para cepillado/planeado y rectificación de superficies.'
      ],
      goal: 'Garantizar un sellado óptimo y restaurar el rendimiento del motor según los estándares solicitados por el cliente.',
      photos: [
        { src: 'assets/1-motor-desarmado-completo.webp', num: 1 },
        { src: 'assets/2-motor-analizando.webp', num: 2 },
        { src: 'assets/3-motor-analizando-2.webp', num: 3 },
        { src: 'assets/4-motor-desamblaje.webp', num: 4 },
        { src: 'assets/5-motor-talado-desatornillando-2.webp', num: 5 },
        { src: 'assets/6-motor-taladro-atornillando.webp', num: 6 },
        { src: 'assets/7-motor-armado-completo.webp', num: 7 }
      ]
    };
  }

  connectedCallback() {
    this.render();
    this.initEvents();
    // Mostrar la foto 1 de inmediato
    this.loadStepPhoto(0);
    // Iniciar descarga secuencial en orden de todas las fotos en segundo plano
    this.startSequentialPreload();
  }

  disconnectedCallback() {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
  }

  /**
   * Descarga secuencial ordenada (1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7)
   */
  async startSequentialPreload() {
    if (this.preloadQueueRunning) return;
    this.preloadQueueRunning = true;

    for (let i = 0; i < this.postData.photos.length; i++) {
      const src = this.postData.photos[i].src;
      if (!this.loadedImages.has(src)) {
        await new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            this.loadedImages.add(src);
            resolve();
          };
          img.onerror = () => {
            resolve();
          };
          img.src = src;
        });
      }
    }
    this.preloadQueueRunning = false;
  }

  initEvents() {
    const prevBtn = this.querySelector('.js-case-prev');
    const nextBtn = this.querySelector('.js-case-next');
    const stepBtns = this.querySelectorAll('.step-tab-btn');
    const imageFrame = this.querySelector('.viewer-image-frame');
    const stageBox = this.querySelector('.viewer-stage-box');
    const lightbox = this.querySelector('.case-lightbox-modal');
    const lightboxBody = this.querySelector('.case-lightbox-body');
    const lightboxClose = this.querySelector('.js-lightbox-close');
    const lightboxPrev = this.querySelector('.js-lightbox-prev');
    const lightboxNext = this.querySelector('.js-lightbox-next');

    // Navegación con botones
    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prevPhoto();
    });

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nextPhoto();
    });

    stepBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const step = parseInt(btn.getAttribute('data-step'), 10);
        this.loadStepPhoto(step);
      });
    });

    // Control táctil (Swipe) para celular en el visor principal
    this.setupTouchSwipe(stageBox, () => this.nextPhoto(), () => this.prevPhoto());

    // Abrir Lightbox solo al hacer tap / clic (no al deslizar)
    let touchMoveDetected = false;
    imageFrame?.addEventListener('touchstart', () => {
      touchMoveDetected = false;
    }, { passive: true });

    imageFrame?.addEventListener('touchmove', () => {
      touchMoveDetected = true;
    }, { passive: true });

    imageFrame?.addEventListener('click', () => {
      if (!touchMoveDetected) {
        this.openLightbox();
      }
    });

    // Control táctil (Swipe) dentro del Lightbox ampliado
    this.setupTouchSwipe(lightboxBody, () => this.nextPhoto(), () => this.prevPhoto());

    // Cerrar y navegar en Lightbox
    lightboxClose?.addEventListener('click', () => this.closeLightbox());
    lightboxPrev?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prevPhoto();
    });
    lightboxNext?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nextPhoto();
    });

    lightbox?.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('case-lightbox-backdrop')) {
        this.closeLightbox();
      }
    });

    // Teclas Flechas y Escape
    this.keydownHandler = (e) => {
      if (e.key === 'Escape' && this.isLightboxOpen) {
        this.closeLightbox();
        return;
      }
      if (e.key === 'ArrowLeft') this.prevPhoto();
      if (e.key === 'ArrowRight') this.nextPhoto();
    };
    document.addEventListener('keydown', this.keydownHandler);
  }

  /**
   * Detector de deslizamiento táctil (Swipe) fluido para móviles
   */
  setupTouchSwipe(element, onSwipeLeft, onSwipeRight) {
    if (!element) return;
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isTracking = false;

    element.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        endX = startX;
        endY = startY;
        isTracking = true;
      }
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
      if (!isTracking || e.touches.length !== 1) return;
      endX = e.touches[0].clientX;
      endY = e.touches[0].clientY;
    }, { passive: true });

    element.addEventListener('touchend', () => {
      if (!isTracking) return;
      isTracking = false;
      const diffX = endX - startX;
      const diffY = endY - startY;

      // Deslizamiento horizontal mínimo de 35px y mayor que el vertical
      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.1) {
        if (diffX < 0) {
          // Deslizar hacia la izquierda -> Siguiente
          onSwipeLeft();
        } else {
          // Deslizar hacia la derecha -> Anterior
          onSwipeRight();
        }
      }
    }, { passive: true });
  }

  openLightbox() {
    const lightbox = this.querySelector('.case-lightbox-modal');
    if (!lightbox) return;
    this.isLightboxOpen = true;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateLightboxImage();
  }

  closeLightbox() {
    const lightbox = this.querySelector('.case-lightbox-modal');
    if (!lightbox) return;
    this.isLightboxOpen = false;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  updateLightboxImage() {
    if (!this.isLightboxOpen) return;
    const photo = this.postData.photos[this.currentStep];
    const lightboxImg = this.querySelector('.case-lightbox-img');
    const lightboxCounter = this.querySelector('.case-lightbox-counter');

    if (lightboxImg) {
      lightboxImg.classList.remove('loaded');
      lightboxImg.classList.add('loading');

      const temp = new Image();
      temp.onload = () => {
        lightboxImg.src = photo.src;
        lightboxImg.alt = `Fotografía ${photo.num} de ${this.postData.photos.length}`;
        requestAnimationFrame(() => {
          lightboxImg.classList.remove('loading');
          lightboxImg.classList.add('loaded');
        });
      };
      temp.onerror = () => {
        lightboxImg.src = photo.src;
        lightboxImg.classList.remove('loading');
        lightboxImg.classList.add('loaded');
      };
      temp.src = photo.src;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${this.currentStep + 1} / ${this.postData.photos.length}`;
    }
  }

  loadStepPhoto(index) {
    if (index < 0) index = this.postData.photos.length - 1;
    if (index >= this.postData.photos.length) index = 0;
    this.currentStep = index;

    const photo = this.postData.photos[index];
    const imgEl = this.querySelector('.reader-current-img');
    const spinner = this.querySelector('.reader-img-spinner');
    const counterEl = this.querySelector('.reader-counter');
    const stepBtns = this.querySelectorAll('.step-tab-btn');

    if (counterEl) counterEl.textContent = `Foto ${index + 1} de ${this.postData.photos.length}`;

    stepBtns.forEach((btn, idx) => {
      const isActive = idx === index;
      btn.classList.toggle('active', isActive);
      if (isActive) {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });

    if (imgEl) {
      // Iniciar transición fluida suave
      imgEl.classList.remove('loaded');
      imgEl.classList.add('loading');

      if (!this.loadedImages.has(photo.src)) {
        if (spinner) spinner.style.display = 'flex';
      }

      const temp = new Image();
      temp.onload = () => {
        imgEl.src = photo.src;
        imgEl.alt = `Registro fotográfico paso ${photo.num}`;
        this.loadedImages.add(photo.src);
        if (spinner) spinner.style.display = 'none';

        // Animación suave de aparición fluida
        requestAnimationFrame(() => {
          setTimeout(() => {
            imgEl.classList.remove('loading');
            imgEl.classList.add('loaded');
          }, 30);
        });
      };
      temp.onerror = () => {
        imgEl.src = photo.src;
        if (spinner) spinner.style.display = 'none';
        imgEl.classList.remove('loading');
        imgEl.classList.add('loaded');
      };
      temp.src = photo.src;
    }

    if (this.isLightboxOpen) {
      this.updateLightboxImage();
    }
  }

  prevPhoto() {
    this.loadStepPhoto(this.currentStep - 1);
  }

  nextPhoto() {
    this.loadStepPhoto(this.currentStep + 1);
  }

  render() {
    const post = this.postData;

    this.innerHTML = `
      <section class="case-study-section">
        <div class="container">
          
          <!-- Botón de Retorno -->
          <div class="case-back-nav">
            <a href="galeria.html" class="btn btn-outline btn-sm">
              <span>←</span> Volver a la Galería
            </a>
          </div>

          <!-- Tarjeta Principal del Caso -->
          <article class="case-study-card">
            
            <!-- Encabezado del Caso -->
            <header class="case-study-header">
              <div class="case-meta-badges">
                <span class="badge-post-case">${post.tag}</span>
                <span class="badge-post-tag">${post.category}</span>
                <span class="badge-post-status">✓ ${post.status}</span>
              </div>

              <h1 class="case-study-title">${post.title}</h1>

              <div class="case-author-bar">
                <span>👨‍🔧 <strong>Mecánico Responsable:</strong> ${post.author}</span>
                <span>📍 <strong>Ubicación:</strong> ${post.location}</span>
                <span>📷 <strong>Registro:</strong> ${post.totalPhotos} Fotografías Técnicas</span>
              </div>
            </header>

            <!-- Ficha Técnica del Informe (3 Bloques Solicitados) -->
            <div class="case-report-grid">
              
              <!-- 1. Diagnóstico Inicial -->
              <div class="report-block report-diag">
                <div class="report-block-header">
                  <span class="block-icon">🔍</span>
                  <h2 class="block-title">Diagnóstico Inicial</h2>
                </div>
                <p class="block-text">
                  <strong>Fuga de aceite activa.</strong> Se procedió al desmontaje completo de la unidad de motor para inspección general.
                </p>
              </div>

              <!-- 2. Trabajos en Proceso -->
              <div class="report-block report-process">
                <div class="report-block-header">
                  <span class="block-icon">⚙️</span>
                  <h2 class="block-title">Trabajos en Proceso</h2>
                </div>
                <ul class="block-list">
                  <li>
                    <span class="bullet">▪</span>
                    <span>Desarme íntegro y revisión del estado de rodamientos internos.</span>
                  </li>
                  <li>
                    <span class="bullet">▪</span>
                    <span>Reemplazo del kit de empaquetaduras y sellos completos.</span>
                  </li>
                  <li>
                    <span class="bullet">▪</span>
                    <span>Sustitución de cadenilla de distribución y piñón antivibración.</span>
                  </li>
                  <li>
                    <span class="bullet">▪</span>
                    <span>Envío de culata y cilindro a rectificadora para cepillado/planeado y rectificación de superficies.</span>
                  </li>
                </ul>
              </div>

              <!-- 3. Objetivo -->
              <div class="report-block report-goal">
                <div class="report-block-header">
                  <span class="block-icon">🎯</span>
                  <h2 class="block-title">Objetivo</h2>
                </div>
                <p class="block-text">
                  Garantizar un sellado óptimo y restaurar el rendimiento del motor según los estándares solicitados por el cliente.
                </p>
              </div>

            </div>

            <!-- Visor de Fotos Limpio (Selector 1..7 sin Descripciones) -->
            <section class="case-photo-viewer">
              
              <div class="viewer-section-header">
                <div>
                  <h2 class="viewer-heading">📸 Registro Fotográfico</h2>
                  <p class="viewer-sub">Desliza o haz clic sobre la foto para ampliarla a pantalla completa.</p>
                </div>
                <span class="reader-counter">Foto 1 de 7</span>
              </div>

              <!-- Selector Numérico Limpio (1 al 7) -->
              <div class="step-tabs-strip">
                ${post.photos.map((p, idx) => `
                  <button class="step-tab-btn ${idx === 0 ? 'active' : ''}" data-step="${idx}" aria-label="Ver foto ${p.num}">
                    ${p.num}
                  </button>
                `).join('')}
              </div>

              <!-- Escenario de la Fotografía con Clic para Ampliar y Deslizamiento Táctil -->
              <div class="viewer-stage-box">
                <button class="viewer-nav-btn nav-prev js-case-prev" aria-label="Foto anterior">❮</button>
                <button class="viewer-nav-btn nav-next js-case-next" aria-label="Foto siguiente">❯</button>

                <div class="viewer-image-frame" title="Toca o haz clic para ampliar">
                  <div class="reader-img-spinner" style="display: none;">
                    <div class="spinner-circle"></div>
                    <span>Cargando fotografía...</span>
                  </div>
                  <img class="reader-current-img" src="" alt="Registro fotográfico del caso de taller" loading="eager">
                  
                  <div class="frame-zoom-hint">
                    <span>🔍 Clic para ampliar</span>
                  </div>
                </div>
              </div>

            </section>

            <!-- Llamado a la Acción / Cotizador -->
            <div class="case-cta-box">
              <div class="cta-info">
                <h3 class="cta-title">¿Tu moto presenta fugas de aceite o requiere ajuste de motor?</h3>
                <p class="cta-desc">Diagnóstico honesto, instrumental técnico y atención personalizada por Alberto Pizarro.</p>
              </div>
              <div class="cta-btns">
                <a href="cotizador.html" class="btn btn-primary btn-lg">
                  <span>⚡</span> Cotizador en Línea
                </a>
              </div>
            </div>

          </article>

        </div>

        <!-- MODAL LIGHTBOX DE AMPLIACIÓN A PANTALLA COMPLETA CON SWIPE -->
        <div class="case-lightbox-modal" role="dialog" aria-modal="true" aria-label="Fotografía ampliada">
          <div class="case-lightbox-backdrop"></div>
          <div class="case-lightbox-dialog">
            
            <div class="case-lightbox-topbar">
              <span class="case-lightbox-counter">1 / 7</span>
              <button class="case-lightbox-close js-lightbox-close" aria-label="Cerrar ampliación">✕ Cerrar</button>
            </div>

            <div class="case-lightbox-body">
              <button class="case-lightbox-nav nav-prev js-lightbox-prev" aria-label="Foto anterior">❮</button>
              <button class="case-lightbox-nav nav-next js-lightbox-next" aria-label="Foto siguiente">❯</button>
              <img class="case-lightbox-img" src="" alt="Fotografía ampliada en alta resolución">
            </div>

          </div>
        </div>

      </section>
    `;
  }
}

customElements.define('case-study-motor', CaseStudyMotor);

