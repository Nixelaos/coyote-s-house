/**
 * Componente: CaseStudyMotor (<case-study-motor>)
 * Página dedicada para el Caso Técnico #01: Ajuste Completo y Solución de Fuga de Aceite.
 * Visor de fotos ligero con carga bajo demanda (on-demand) y diseño 100% responsivo en español.
 */

class CaseStudyMotor extends HTMLElement {
  constructor() {
    super();
    this.currentStep = 0;
    this.loadedImages = new Set();

    this.postData = {
      tag: 'Caso de Taller #01',
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
        {
          src: 'assets/1-motor-desarmado-completo.webp',
          step: 'Foto 01',
          desc: 'Desmonte íntegro de la unidad de motor para inspección general y localización de la fuga de aceite activa.'
        },
        {
          src: 'assets/2-motor-analizando.webp',
          step: 'Foto 02',
          desc: 'Evaluación visual detallada de desgaste en componentes, tolerancias y estado de sellos.'
        },
        {
          src: 'assets/3-motor-analizando-2.webp',
          step: 'Foto 03',
          desc: 'Inspección del estado de rodamientos internos, juego axial y verificación de holguras mecánicas.'
        },
        {
          src: 'assets/4-motor-desamblaje.webp',
          step: 'Foto 04',
          desc: 'Separación técnica de componentes; preparación de culata y cilindro para rectificadora.'
        },
        {
          src: 'assets/5-motor-talado-desatornillando-2.webp',
          step: 'Foto 05',
          desc: 'Desmontaje controlado de embrague y piñones con herramientas de precisión.'
        },
        {
          src: 'assets/6-motor-taladro-atornillando.webp',
          step: 'Foto 06',
          desc: 'Instalación de nueva cadenilla de distribución, piñón antivibración y kit completo de empaquetaduras y sellos.'
        },
        {
          src: 'assets/7-motor-armado-completo.webp',
          step: 'Foto 07',
          desc: 'Unidad de motor 100% armada, sellada y testeada con tolerancias originales y óptimo rendimiento.'
        }
      ]
    };
  }

  connectedCallback() {
    this.render();
    this.initEvents();
    // Cargar la primera foto al inicio de la página del caso
    this.loadStepPhoto(0);
  }

  disconnectedCallback() {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
    }
  }

  initEvents() {
    const prevBtn = this.querySelector('.js-case-prev');
    const nextBtn = this.querySelector('.js-case-next');
    const stepBtns = this.querySelectorAll('.step-tab-btn');

    prevBtn?.addEventListener('click', () => this.prevPhoto());
    nextBtn?.addEventListener('click', () => this.nextPhoto());

    stepBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        this.loadStepPhoto(idx);
      });
    });

    this.keydownHandler = (e) => {
      if (e.key === 'ArrowLeft') this.prevPhoto();
      if (e.key === 'ArrowRight') this.nextPhoto();
    };
    document.addEventListener('keydown', this.keydownHandler);
  }

  loadStepPhoto(index) {
    if (index < 0) index = this.postData.photos.length - 1;
    if (index >= this.postData.photos.length) index = 0;
    this.currentStep = index;

    const photo = this.postData.photos[index];
    const imgEl = this.querySelector('.reader-current-img');
    const spinner = this.querySelector('.reader-img-spinner');
    const descEl = this.querySelector('.reader-photo-desc');
    const stepEl = this.querySelector('.reader-step-badge');
    const counterEl = this.querySelector('.reader-counter');
    const stepBtns = this.querySelectorAll('.step-tab-btn');

    if (descEl) descEl.textContent = photo.desc;
    if (stepEl) stepEl.textContent = photo.step;
    if (counterEl) counterEl.textContent = `Foto ${index + 1} de ${this.postData.photos.length}`;

    stepBtns.forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });

    if (imgEl) {
      if (imgEl.src !== photo.src && !imgEl.src.endsWith(photo.src)) {
        if (spinner) spinner.style.display = 'flex';
        imgEl.style.opacity = '0.2';

        const temp = new Image();
        temp.onload = () => {
          imgEl.src = photo.src;
          imgEl.alt = `Registro fotográfico ${photo.step}`;
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
                <span class="badge-post-case">🔧 ${post.tag}</span>
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

            <!-- Visor de Fotos Ligero (Carga Bajo Demanda sin Títulos) -->
            <section class="case-photo-viewer">
              
              <div class="viewer-section-header">
                <div>
                  <h2 class="viewer-heading">📸 Registro Fotográfico Paso a Paso</h2>
                  <p class="viewer-sub">Selecciona cada foto para visualizarla en alta resolución.</p>
                </div>
                <span class="reader-counter">Foto 1 de 7</span>
              </div>

              <!-- Botones Selector 1 a 7 -->
              <div class="step-tabs-strip">
                ${post.photos.map((p, idx) => `
                  <button class="step-tab-btn ${idx === 0 ? 'active' : ''}" data-step="${idx}" aria-label="Ver foto ${idx + 1}">
                    <span class="tab-step-num">${idx + 1}</span>
                    <span class="tab-step-label">Foto ${idx + 1}</span>
                  </button>
                `).join('')}
              </div>

              <!-- Escenario de la Fotografía -->
              <div class="viewer-stage-box">
                <button class="viewer-nav-btn nav-prev js-case-prev" aria-label="Foto anterior">❮</button>
                <button class="viewer-nav-btn nav-next js-case-next" aria-label="Foto siguiente">❯</button>

                <div class="viewer-image-frame">
                  <div class="reader-img-spinner" style="display: none;">
                    <div class="spinner-circle"></div>
                    <span>Cargando fotografía...</span>
                  </div>
                  <img class="reader-current-img" src="" alt="Registro fotográfico del caso de taller" loading="eager">
                </div>

                <!-- Pie Descriptivo (Sin Títulos) -->
                <div class="viewer-caption-box">
                  <div class="caption-header">
                    <span class="reader-step-badge">Foto 01</span>
                  </div>
                  <p class="reader-photo-desc">Desmonte íntegro de la unidad de motor para inspección general y localización de la fuga de aceite activa.</p>
                </div>
              </div>

            </section>

            <!-- Llamado a la Acción y Cotización -->
            <div class="case-cta-box">
              <div class="cta-info">
                <h3 class="cta-title">¿Tu moto presenta fugas de aceite o pérdida de compresión?</h3>
                <p class="cta-desc">Diagnóstico honesto, instrumental técnico y atención personalizada por Alberto Pizarro.</p>
              </div>
              <div class="cta-btns">
                <a href="https://wa.me/56954750993?text=Hola%20Alberto%2C%20estuve%20viendo%20el%20Caso%20%2301%20de%20ajuste%20de%20motor%20en%20la%20web%20y%20quiero%20cotizar%20un%20diagnóstico%20para%20mi%20moto" target="_blank" rel="noopener" class="btn btn-whatsapp btn-lg">
                  <span>💬</span> Consultar este Procedimiento
                </a>
                <a href="cotizador.html" class="btn btn-outline btn-lg">
                  <span>⚡</span> Cotizador en Línea
                </a>
              </div>
            </div>

          </article>

        </div>
      </section>
    `;
  }
}

customElements.define('case-study-motor', CaseStudyMotor);
