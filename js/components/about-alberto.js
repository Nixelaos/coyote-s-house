/**
 * Componente: AboutAlberto (<about-alberto>)
 * Sección biográfica, trayectoria docente, origen de Coyote's House y filosofía técnica.
 * Texto y vivencias de Alberto Pizarro.
 */

class AboutAlberto extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="about-section" id="sobre-alberto">
        <div class="container">
          
          <!-- 1. Presentación Principal -->
          <div class="about-hero-grid">
            <div class="about-image-card">
              <div class="about-photo-wrapper">
                <img src="assets/alberto-pizarro.webp" alt="Alberto Pizarro en el taller Coyote's House" loading="eager" width="600" height="700" decoding="async">
              </div>
              <div class="experience-sticker">
                <span class="experience-tag">Mecánico</span>
              </div>
            </div>

            <div class="about-content">
              <span class="section-tag">Liderazgo Técnico & Pasión</span>
              <h1 class="section-title">Alberto Pizarro: <span class="highlight-accent">Motociclista y Mecánico</span></h1>

              <div class="about-quote">
                "Antes de ser mecánico, primero que todo soy motociclista de corazón. A su servicio."
              </div>

              <p style="color: var(--color-text-body); font-size: 1.02rem; line-height: 1.7;">
                Detrás de <strong>Coyote's House</strong> está <strong>Alberto Pizarro</strong>, profesional con amplia trayectoria en la mecánica de motocicletas y una sólida experiencia previa como formador e instructor técnico. Su trabajo une la pasión pura por las dos ruedas con el rigor técnico, la precisión y la transparencia absoluta en cada diagnóstico y reparación.
              </p>

              <div style="margin-top: 0.75rem;">
                <a href="cotizador.html" class="btn btn-primary">
                  <span>📅</span> Agendar / Cotizar con Alberto
                </a>
              </div>
            </div>
          </div>

          <!-- 2. Historia & Origen de Coyote's House -->
          <div class="history-wrap-box">
            <div class="history-header">
              <div class="history-header-icon">🏍️</div>
              <div>
                <span class="section-tag" style="margin-bottom: 0.35rem;">Historia del Taller</span>
                <h2 style="font-family: var(--font-heading); font-size: 1.45rem; font-weight: 900; font-style: italic; color: var(--color-text-title); text-transform: uppercase; margin: 0;">
                  El Origen de Coyote's House: <span class="highlight-accent">De la Necesidad a la Vocación</span>
                </h2>
              </div>
            </div>

            <div class="history-body-paragraphs">
              <p>
                <strong>Coyote's House</strong> nace originalmente como un pequeño taller en la casa de <strong>Alberto Pizarro</strong>, apodado <em>"Coyote"</em> —de ahí su nombre, que significa literalmente <em>"La Casa de Coyote"</em>.
              </p>

              <p>
                El proyecto surgió ante una necesidad real: tras vivir reiteradas malas experiencias y una constante falta de honestidad en talleres de motos del sector de Lira, Ñuñoa y los alrededores de su domicilio en La Florida, Alberto decidió tomar las riendas. Comenzó a estudiar a fondo la lógica y el funcionamiento de la motocicleta como concepto integral, realizando los primeros arreglos en su propia máquina y en las de sus amigos cercanos.
              </p>

              <p>
                Con el tiempo, esa dedicación pasó de ser un trabajo de medio tiempo a una vocación definitiva. Respaldado por un estudio riguroso y la adquisición constante de herramientas de calidad, Alberto tomó la decisión de dejar su empleo convencional para dedicarse por completo a la mecánica de motocicletas.
              </p>

              <p>
                El taller creció hasta lograr la representación técnica oficial de una prestigiosa marca de motos, lo que impulsó la apertura de su primer local comercial fuera de casa, expandiéndose luego a un local de mayor envergadura en La Florida y posteriormente a otra sucursal en Maipú, forjando un sólido prestigio en el rubro.
              </p>

              <div class="history-highlight-box">
                <p style="margin: 0; font-style: italic;">
                  "Agobiado por las malas prácticas habituales en las grandes marcas representantes y la competencia desleal en la venta de motocicletas, decidí dar un paso firme y volver a lo que realmente me apasiona: <strong>la mecánica pura</strong>. Comencé nuevamente desde el paso uno, esta vez con un taller completo, dotado de herramientas de alta precisión y con la experiencia de años de dedicación. Volver a las raíces: a solucionar para los clientes con honestidad, criterio y buen servicio."
                </p>
              </div>
            </div>
          </div>

          <!-- 3. Trayectoria Docente & Filosofía de Trabajo -->
          <div class="about-pillars-grid">
            
            <!-- Pilar 1: Trayectoria Docente -->
            <div class="pillar-card">
              <div class="pillar-header">
                <span class="pillar-icon">🎓</span>
                <h3 class="pillar-title">Experiencia Docente</h3>
              </div>
              <ul class="pillar-list">
                <li>
                  <div>
                    <strong style="color: var(--color-text-title); display: block;">Profesor e Instructor Técnico</strong>
                    Fue docente validado en Mecánica y Electrónica de Motocicletas, participando en la formación técnica de nuevas generaciones de mecánicos.
                  </div>
                </li>
                <li>
                  <div>
                    <strong style="color: var(--color-text-title); display: block;">Formación de Profesionales</strong>
                    Estuvo a cargo de la preparación teórica y práctica en institutos técnicos especializados del rubro de las dos ruedas.
                  </div>
                </li>
                <li>
                  <div>
                    <strong style="color: var(--color-text-title); display: block;">Cursos y Capacitaciones</strong>
                    Dictó cursos intensivos y programas de perfeccionamiento para entidades del motociclismo y mecánicos particulares.
                  </div>
                </li>
              </ul>
            </div>

            <!-- Pilar 2: Filosofía de Trabajo -->
            <div class="pillar-card">
              <div class="pillar-header">
                <span class="pillar-icon">🔍</span>
                <h3 class="pillar-title">Filosofía de Trabajo</h3>
              </div>
              <ul class="pillar-list">
                <li>
                  <div>
                    <strong style="color: var(--color-text-title); display: block;">Atención Personalizada y Transparente</strong>
                    Se le explica al cliente la falla, sus razones de origen y el método exacto de solución técnica.
                  </div>
                </li>
                <li>
                  <div>
                    <strong style="color: var(--color-text-title); display: block;">Pedagogía en Taller</strong>
                    Apoyado en su experiencia docente previa, explica el paso a paso entregándole conocimiento además del arreglo mecánico o electrónico.
                  </div>
                </li>
                <li>
                  <div>
                    <strong style="color: var(--color-text-title); display: block;">Seguimiento con Fotos y Videos</strong>
                    Durante todo el proceso se mantiene al cliente informado mediante registros audiovisuales en tiempo real.
                  </div>
                </li>
              </ul>
            </div>

          </div>

          <!-- 4. Pasión por las Dos Ruedas y el Estudio Continuo -->
          <div class="passion-quote-box">
            <p class="passion-text">
              "Me inicié en el mundo de la mecánica a partir de mi pasión por las motos: me fascina recorrer los caminos y desconectarme de todo mientras viajo en mi motocicleta. Trabajar en ellas es descubrir continuamente los avances tecnológicos aplicados a los nuevos modelos: poder estudiarlos, entender su funcionamiento y resolver problemáticas que significan un verdadero desafío técnico. Así voy alimentando mi conocimiento, basado en el estudio detallado de cada manual y de cada motocicleta nueva en el mercado."
            </p>
            <span class="passion-author">— Alberto Pizarro (Coyote)</span>
          </div>

        </div>
      </section>
    `;
  }
}

customElements.define('about-alberto', AboutAlberto);
