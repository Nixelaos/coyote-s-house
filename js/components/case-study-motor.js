/**
 * Componente: CaseStudyMotor (<case-study-motor>)
 * Página dedicada para el Caso Técnico #01.
 * - Descarga secuencial ordenada de fotos (1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7) al ingresar a la página.
 * - Selector numérico limpio (1..7) sin textos redundantes.
 * - Sin descripciones debajo de la foto.
 * - Modal Lightbox fijado directamente al viewport (Body Teleport) para abrirse exactamente donde está el scroll.
 */

class CaseStudyMotor extends HTMLElement {
  constructor() {
    super();
    this.currentStep = 0;
    this.isLightboxOpen = false;
    this.loadedImages = new Set();
    this.preloadQueueRunning = false;
    this.lightboxModal = null;

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
    this.setupLightboxTeleport();
    this.initEvents();
    this.loadStepPhoto(0);
    this.startSequentialPreload();
  }

  setupLightboxTeleport() {
    // Si había una modal previa en el body de una navegación anterior, limpiarla
    const orphanModal = document.body.querySelector(':scope > .case-lightbox-modal');
    if (orphanModal && orphanModal !== this.lightboxModal) {
      orphanModal.remove();
    }

    // Mover la modal interna directamente al body para desacoplarla de cualquier contenedor
    const modalInComponent = this.querySelector('.case-lightbox-modal');
    if (modalInComponent) {
      this.lightboxModal = modalInComponent;
      document.body.appendChild(this.lightboxModal);
    }
  }

  disconnectedCallback() {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
    }
    if (this.lightboxModal && this.lightboxModal.parentElement === document.body) {
      this.lightboxModal.remove();
      this.lightboxModal = null;
    }
    document.documentElement.classList.remove('lightbox-active');
    document.body.classList.remove('lightbox-active');
  }

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

    const modal = this.lightboxModal || document.querySelector('.case-lightbox-modal');
    const lightboxBody = modal?.querySelector('.case-lightbox-body');
    const lightboxClose = modal?.querySelector('.js-lightbox-close');
    const lightboxPrev = modal?.querySelector('.js-lightbox-prev');
    const lightboxNext = modal?.querySelector('.js-lightbox-next');
    const lightboxBackdrop = modal?.querySelector('.case-lightbox-backdrop');
    const lightboxThumbBtns = modal?.querySelectorAll('.lightbox-thumb-btn');

    // Navegación con botones del visor de la página
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

    // Abrir Lightbox al hacer clic en la foto
    imageFrame?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.openLightbox();
    });

    // Navegación y cierre del Lightbox
    lightboxClose?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.closeLightbox();
    });

    lightboxBackdrop?.addEventListener('click', () => {
      this.closeLightbox();
    });

    lightboxPrev?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prevPhoto();
    });

    lightboxNext?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nextPhoto();
    });

    lightboxThumbBtns?.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const step = parseInt(btn.getAttribute('data-step'), 10);
        this.loadStepPhoto(step);
      });
    });

    // Control táctil (Swipe) dentro del Lightbox ampliado
    this.setupTouchSwipe(lightboxBody, () => this.nextPhoto(), () => this.prevPhoto());

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

    // Soporte para botón "Atrás" del celular y del navegador
    this.popstateHandler = () => {
      if (this.isLightboxOpen) {
        this.closeLightbox(false);
      }
    };
    window.addEventListener('popstate', this.popstateHandler);
  }

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

      if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.1) {
        if (diffX < 0) {
          onSwipeLeft();
        } else {
          onSwipeRight();
        }
      }
    }, { passive: true });
  }

  openLightbox() {
    const modal = this.lightboxModal || document.querySelector('.case-lightbox-modal');
    if (!modal) return;

    this.isLightboxOpen = true;
    modal.classList.add('active');
    document.body.classList.add('lightbox-active');

    try {
      history.pushState({ caseLightboxOpen: true }, '');
    } catch (e) {}

    this.updateLightboxImage();
  }

  closeLightbox(shouldPopHistory = true) {
    const modal = this.lightboxModal || document.querySelector('.case-lightbox-modal');
    if (!modal || !this.isLightboxOpen) return;
    this.isLightboxOpen = false;
    modal.classList.remove('active');

    document.body.classList.remove('lightbox-active');

    if (shouldPopHistory && history.state?.caseLightboxOpen) {
      try {
        history.back();
      } catch (e) {}
    }
  }

  updateLightboxImage() {
    if (!this.isLightboxOpen) return;
    const photo = this.postData.photos[this.currentStep];
    const modal = this.lightboxModal || document.querySelector('.case-lightbox-modal');
    if (!modal) return;

    const lightboxImg = modal.querySelector('.case-lightbox-img');
    const lightboxCounter = modal.querySelector('.case-lightbox-counter');
    const lightboxThumbBtns = modal.querySelectorAll('.lightbox-thumb-btn');

    lightboxThumbBtns?.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === this.currentStep);
    });

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
      lightboxCounter.textContent = `Foto ${this.currentStep + 1} de ${this.postData.photos.length}`;
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

    const modal = this.lightboxModal || document.querySelector('.case-lightbox-modal');
    const lightboxThumbBtns = modal?.querySelectorAll('.lightbox-thumb-btn');

    if (counterEl) counterEl.textContent = `Foto ${index + 1} de ${this.postData.photos.length}`;

    stepBtns.forEach((btn, idx) => {
      const isActive = idx === index;
      btn.classList.toggle('active', isActive);
      if (isActive) {
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    });

    lightboxThumbBtns?.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });

    if (imgEl) {
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

            <!-- Ficha Técnica del Informe (3 Bloques) -->
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

            <!-- Visor de Fotos Limpio (Selector 1..7) -->
            <section class="case-photo-viewer">
              
              <div class="viewer-section-header">
                <div>
                  <h2 class="viewer-heading">📸 Registro Fotográfico</h2>
                  <p class="viewer-sub">Haz clic sobre la foto para ampliarla a pantalla completa.</p>
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

              <!-- Escenario de la Fotografía -->
              <div class="viewer-stage-box">
                <button class="viewer-nav-btn nav-prev js-case-prev" aria-label="Foto anterior">❮</button>
                <button class="viewer-nav-btn nav-next js-case-next" aria-label="Foto siguiente">❯</button>

                <div class="viewer-image-frame" title="Haz clic para ampliar la foto">
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

        <!-- MODAL LIGHTBOX DE AMPLIACIÓN A PANTALLA COMPLETA -->
        <div class="case-lightbox-modal" role="dialog" aria-modal="true" aria-label="Fotografía ampliada">
          <div class="case-lightbox-backdrop" title="Clic para cerrar"></div>
          
          <div class="case-lightbox-dialog">
            
            <!-- Barra Superior del Lightbox con Contador y Botón 'X' -->
            <div class="case-lightbox-topbar">
              <div class="case-lightbox-badge-wrap">
                <span class="badge-post-case">Caso #01</span>
                <span class="case-lightbox-counter">Foto 1 de 7</span>
              </div>
              
              <button class="case-lightbox-close-btn js-lightbox-close" aria-label="Cerrar ampliación" title="Cerrar (Esc)">
                <span class="close-icon">✕</span>
                <span class="close-label">Cerrar</span>
              </button>
            </div>

            <!-- Cuerpo del Lightbox con Flechas y Foto Ampliada -->
            <div class="case-lightbox-body">
              <button class="case-lightbox-nav nav-prev js-lightbox-prev" aria-label="Foto anterior (Flecha izquierda)" title="Anterior">❮</button>
              <button class="case-lightbox-nav nav-next js-lightbox-next" aria-label="Foto siguiente (Flecha derecha)" title="Siguiente">❯</button>
              
              <div class="case-lightbox-img-wrapper">
                <img class="case-lightbox-img" src="" alt="Fotografía ampliada en alta resolución">
              </div>
            </div>

            <!-- Selector Numérico Inferior en el Lightbox -->
            <div class="case-lightbox-bottombar">
              <div class="lightbox-thumbs-strip">
                ${post.photos.map((p, idx) => `
                  <button class="lightbox-thumb-btn ${idx === 0 ? 'active' : ''}" data-step="${idx}" aria-label="Ir a foto ${p.num}">
                    ${p.num}
                  </button>
                `).join('')}
              </div>
            </div>

          </div>
        </div>

      </section>
    `;
  }
}

customElements.define('case-study-motor', CaseStudyMotor);
