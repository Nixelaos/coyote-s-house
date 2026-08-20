/**
 * Componente: WorkshopGallery (<workshop-gallery>)
 * Vista inicial compacta con 1 publicación destacada.
 * Las fotos y detalles se cargan bajo demanda (on-demand) solo al abrir la publicación y recorrer cada foto.
 */

class WorkshopGallery extends HTMLElement {
  constructor() {
    super();
    this.currentStep = 0;
    this.loadedImages = new Set(); // Caché en memoria de fotos ya solicitadas

    this.postData = {
      id: 'overhaul-motor-01',
      tag: 'Caso de Taller #01',
      category: 'Procedimiento Integral • Overhaul de Motor',
      status: 'Finalizado',
      title: 'Diagnóstico y Solución de Fuga de Aceite: Desmontaje y Reacondicionamiento Integral de Motor',
      author: 'Alberto Pizarro',
      location: 'Taller Coyote\'s House, Macul',
      cover: 'assets/1-motor-desarmado-completo.webp',
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
        {
          src: 'assets/1-motor-desarmado-completo.webp',
          step: 'Paso 01',
          shortTitle: 'Desmontaje',
          title: 'Desmontaje Completo del Motor',
          desc: 'Desmonte íntegro de la unidad de motor para inspección general y localización de la fuga de aceite activa.'
        },
        {
          src: 'assets/2-motor-analizando.webp',
          step: 'Paso 02',
          shortTitle: 'Diagnóstico',
          title: 'Inspección Técnica & Diagnóstico',
          desc: 'Evaluación visual detallada de desgaste en componentes, tolerancias y estado de sellos.'
        },
        {
          src: 'assets/3-motor-analizando-2.webp',
          step: 'Paso 03',
          shortTitle: 'Rodamientos',
          title: 'Revisión de Rodamientos y Tolerancias',
          desc: 'Inspección del estado de rodamientos internos, juego axial y verificación de holguras mecánicas.'
        },
        {
          src: 'assets/4-motor-desamblaje.webp',
          step: 'Paso 04',
          shortTitle: 'Piezas & Rectificación',
          title: 'Desensamblaje y Preparación de Piezas',
          desc: 'Separación técnica de componentes; preparación de culata y cilindro para rectificadora.'
        },
        {
          src: 'assets/5-motor-talado-desatornillando-2.webp',
          step: 'Paso 05',
          shortTitle: 'Desajuste Técnico',
          title: 'Desajuste Técnico con Instrumental',
          desc: 'Desmontaje controlado de embrague y piñones con herramientas de precisión.'
        },
        {
          src: 'assets/6-motor-taladro-atornillando.webp',
          step: 'Paso 06',
          shortTitle: 'Armado & Calibración',
          title: 'Armado, Torreado y Sustitución',
          desc: 'Instalación de nueva cadenilla de distribución, piñón antivibración y kit completo de empaquetaduras y sellos.'
        },
        {
          src: 'assets/7-motor-armado-completo.webp',
          step: 'Paso 07',
          shortTitle: 'Motor Listo',
          title: 'Motor Reacondicionado y Armado Completo',
          desc: 'Unidad de motor 100% armada, sellada y testeada con tolerancias originales y óptimo rendimiento.'
        }
      ]
    };
  }

  connectedCallback() {
    this.render();
    this.initEvents();
  }

  disconnectedCallback() {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
  }

  initEvents() {
    const openBtn = this.querySelector('.js-open-post');
    const featuredCard = this.querySelector('.featured-post-card');
    const modal = this.querySelector('.post-reader-modal');
    const closeBtn = this.querySelector('.js-close-post');
    const prevBtn = this.querySelector('.js-photo-prev');
    const nextBtn = this.querySelector('.js-photo-next');
    const stepBtns = this.querySelectorAll('.step-tab-btn');

    // Abrir publicación
    const handleOpen = (e) => {
      e?.preventDefault();
      this.openPostModal();
    };

    openBtn?.addEventListener('click', handleOpen);
    featuredCard?.addEventListener('click', (e) => {
      // Si no es un enlace directo
      if (!e.target.closest('a:not(.js-open-post)')) {
        handleOpen(e);
      }
    });

    // Cerrar publicación
    closeBtn?.addEventListener('click', () => this.closePostModal());

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closePostModal();
      }
    });

    // Navegación de fotos bajo demanda
    prevBtn?.addEventListener('click', () => this.prevPhoto());
    nextBtn?.addEventListener('click', () => this.nextPhoto());

    stepBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        this.loadStepPhoto(idx);
      });
    });

    // Teclado
    this.keydownHandler = (e) => {
      if (!modal?.classList.contains('active')) return;
      if (e.key === 'Escape') this.closePostModal();
      if (e.key === 'ArrowLeft') this.prevPhoto();
      if (e.key === 'ArrowRight') this.nextPhoto();
    };
    document.addEventListener('keydown', this.keydownHandler);
  }

  openPostModal() {
    const modal = this.querySelector('.post-reader-modal');
    modal?.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Carga la primera foto solo ahora que el usuario abrió la publicación
    this.loadStepPhoto(this.currentStep);
  }

  closePostModal() {
    const modal = this.querySelector('.post-reader-modal');
    modal?.classList.remove('active');
    document.body.style.overflow = '';
  }

  loadStepPhoto(index) {
    if (index < 0) index = this.postData.photos.length - 1;
    if (index >= this.postData.photos.length) index = 0;
    this.currentStep = index;

    const photo = this.postData.photos[index];
    const imgEl = this.querySelector('.reader-current-img');
    const spinner = this.querySelector('.reader-img-spinner');
    const titleEl = this.querySelector('.reader-photo-title');
    const descEl = this.querySelector('.reader-photo-desc');
    const stepEl = this.querySelector('.reader-step-badge');
    const counterEl = this.querySelector('.reader-counter');
    const stepBtns = this.querySelectorAll('.step-tab-btn');

    // Actualiza textos
    if (titleEl) titleEl.textContent = photo.title;
    if (descEl) descEl.textContent = photo.desc;
    if (stepEl) stepEl.textContent = photo.step;
    if (counterEl) counterEl.textContent = `Foto ${index + 1} de ${this.postData.photos.length}`;

    // Actualiza tabs
    stepBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });

    // Carga bajo demanda: solo si no estaba cargada
    if (imgEl) {
      if (imgEl.src !== photo.src && !imgEl.src.endsWith(photo.src)) {
        if (spinner) spinner.style.display = 'flex';
        imgEl.style.opacity = '0.2';

        const temp = new Image();
        temp.onload = () => {
          imgEl.src = photo.src;
          imgEl.alt = photo.title;
          imgEl.style.opacity = '1';
          if (spinner) spinner.style.display = 'none';
          this.loadedImages.add(photo.src);
        };
        temp.onerror = () => {
          imgEl.src = photo.src;
          imgEl.style.opacity = '1';
          if (spinner) spinner.style.display = 'none';
        };
        temp.src = photo.src;
      } else {
        imgEl.style.opacity = '1';
        if (spinner) spinner.style.display = 'none';
      }
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

          <!-- ÚNICA PUBLICACIÓN DESTACADA EN VISTA PREVIA -->
          <div class="featured-post-wrapper">
            <article class="featured-post-card" tabindex="0" role="button" aria-label="Abrir publicación destacada de reparación de motor">
              
              <!-- Portada de la publicación (carga diferida) -->
              <div class="featured-post-cover">
                <div class="cover-image-placeholder">
                  <span class="cover-icon">🏍️</span>
                  <span class="cover-hint">Registro Fotográfico</span>
                </div>
                <div class="cover-badge-top">
                  <span class="badge-post-case">📌 Publicación Destacada</span>
                  <span class="badge-post-status">✓ 7 Fotos Documentadas</span>
                </div>
                <div class="cover-hover-prompt">
                  <span class="prompt-icon">📖</span>
                  <span class="prompt-text">Ingresar a la Publicación</span>
                </div>
              </div>

              <!-- Contenido de la Vista Previa -->
              <div class="featured-post-body">
                <div class="post-meta-line">
                  <span class="badge-post-tag">${post.category}</span>
                  <span class="meta-time">Caso Técnico #01</span>
                </div>

                <h2 class="featured-post-title">
                  ${post.title}
                </h2>

                <p class="featured-post-summary">
                  <strong>Diagnóstico inicial:</strong> ${post.diagnostic}
                </p>

                <!-- Resumen de Trabajos Destacados -->
                <div class="featured-highlights-list">
                  <div class="highlight-pill">⚙️ Desarme y revisión de rodamientos</div>
                  <div class="highlight-pill">🔧 Rectificación de culata y cilindro</div>
                  <div class="highlight-pill">⚡ Distribución y sellado completo</div>
                </div>

                <!-- Barra de Autor & CTA -->
                <div class="featured-post-footer">
                  <div class="post-author-chip">
                    <span class="author-avatar">👨‍🔧</span>
                    <div>
                      <span class="author-name">${post.author}</span>
                      <span class="author-sub">${post.location}</span>
                    </div>
                  </div>

                  <button class="btn btn-primary js-open-post" aria-haspopup="dialog">
                    <span>📖</span> Ver Publicación Completa (7 Fotos)
                  </button>
                </div>
              </div>

            </article>
          </div>

        </div>

        <!-- MODAL DE PUBLICACIÓN COMPLETA (CARGA BAJO DEMANDA) -->
        <div class="post-reader-modal" role="dialog" aria-modal="true" aria-label="Detalle de Publicación Técnica">
          <div class="post-reader-dialog">
            
            <!-- Barra Superior del Lector -->
            <div class="reader-topbar">
              <div class="reader-top-info">
                <span class="badge-post-case">🔧 Caso #01</span>
                <span class="reader-top-category">${post.category}</span>
              </div>
              <button class="reader-close-btn js-close-post" aria-label="Cerrar Publicación">✕ Cerrar</button>
            </div>

            <!-- Contenedor con Scroll de la Publicación -->
            <div class="reader-scrollable-content">
              
              <!-- Encabezado de la Publicación -->
              <header class="reader-header">
                <h2 class="reader-title">${post.title}</h2>
                <div class="reader-meta-row">
                  <span>👨‍🔧 <strong>Mecánico Responsable:</strong> ${post.author}</span>
                  <span>📍 <strong>Taller:</strong> ${post.location}</span>
                  <span>📷 <strong>Secuencia:</strong> 7 Fotografías Técnicas</span>
                </div>
              </header>

              <!-- FICHA TÉCNICA DEL INFORME (3 Bloques Solicitados) -->
              <div class="reader-report-grid">
                
                <!-- 1. Diagnóstico Inicial -->
                <div class="report-block report-diag">
                  <div class="report-block-header">
                    <span class="block-icon">🔍</span>
                    <h3 class="block-title">Diagnóstico Inicial</h3>
                  </div>
                  <p class="block-text">
                    <strong>Fuga de aceite activa.</strong> Se procedió al desmontaje completo de la unidad de motor para inspección general.
                  </p>
                </div>

                <!-- 2. Trabajos en Proceso -->
                <div class="report-block report-process">
                  <div class="report-block-header">
                    <span class="block-icon">⚙️</span>
                    <h3 class="block-title">Trabajos en Proceso</h3>
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
                    <h3 class="block-title">Objetivo</h3>
                  </div>
                  <p class="block-text">
                    Garantizar un sellado óptimo y restaurar el rendimiento del motor según los estándares solicitados por el cliente.
                  </p>
                </div>

              </div>

              <!-- VISOR INTERACTIVO DE FOTOS (CARGA PROGRESIVA BAJO DEMANDA) -->
              <section class="reader-photo-viewer">
                
                <div class="viewer-section-header">
                  <div>
                    <h3 class="viewer-heading">📸 Secuencia Fotográfica Paso a Paso</h3>
                    <p class="viewer-sub">Las fotografías se cargan individualmente a medida que seleccionas cada paso.</p>
                  </div>
                  <span class="reader-counter">Foto 1 de 7</span>
                </div>

                <!-- Botones de Paso (Selector Rápido) -->
                <div class="step-tabs-strip">
                  ${post.photos.map((p, idx) => `
                    <button class="step-tab-btn ${idx === 0 ? 'active' : ''}" data-step="${idx}" aria-label="Ir a ${p.step}: ${p.shortTitle}">
                      <span class="tab-step-num">${idx + 1}</span>
                      <span class="tab-step-label">${p.shortTitle}</span>
                    </button>
                  `).join('')}
                </div>

                <!-- Escenario Principal de Fotografía -->
                <div class="viewer-stage-box">
                  
                  <button class="viewer-nav-btn nav-prev js-photo-prev" aria-label="Foto anterior">❮</button>
                  <button class="viewer-nav-btn nav-next js-photo-next" aria-label="Foto siguiente">❯</button>

                  <div class="viewer-image-frame">
                    <div class="reader-img-spinner" style="display: none;">
                      <div class="spinner-circle"></div>
                      <span>Cargando fotografía...</span>
                    </div>
                    <!-- La imagen se asigna por JS bajo demanda -->
                    <img class="reader-current-img" src="" alt="Fotografía del caso de taller" loading="eager">
                  </div>

                  <!-- Pie Descriptivo del Paso Actual -->
                  <div class="viewer-caption-box">
                    <div class="caption-header">
                      <span class="reader-step-badge">Paso 01</span>
                      <h4 class="reader-photo-title">Cargando...</h4>
                    </div>
                    <p class="reader-photo-desc">Selecciona un paso para cargar la fotografía correspondiente.</p>
                  </div>

                </div>

              </section>

              <!-- CTA de Consulta Técnica -->
              <div class="reader-cta-box">
                <div class="cta-info">
                  <h4 class="cta-title">¿Tu moto tiene una fuga de aceite o necesita ajuste de motor?</h4>
                  <p class="cta-desc">Atención honesta y especializada directamente por Alberto Pizarro.</p>
                </div>
                <div class="cta-btns">
                  <a href="https://wa.me/56954750993?text=Hola%20Alberto%2C%20vi%20la%20publicación%20del%20desarme%20de%20motor%20y%20quiero%20cotizar%20un%20diagnóstico" target="_blank" rel="noopener" class="btn btn-whatsapp">
                    <span>💬</span> Consultar este Diagnóstico
                  </a>
                  <a href="cotizador.html" class="btn btn-outline">
                    <span>⚡</span> Cotizador Online
                  </a>
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


