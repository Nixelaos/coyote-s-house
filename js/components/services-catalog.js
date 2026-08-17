/**
 * Componente: ServicesCatalog (<services-catalog>)
 * Catálogo oficial de servicios especializados, desglose de pauta completa y marcas atendidas.
 */

class ServicesCatalog extends HTMLElement {
  connectedCallback() {
    this.render();
    this.initServiceButtons();
  }

  initServiceButtons() {
    const serviceCtaButtons = this.querySelectorAll('.btn-service-select');
    serviceCtaButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedService = btn.getAttribute('data-service');
        if (selectedService) {
          const quoteElement = document.querySelector('#cotizador') || document.querySelector('whatsapp-cotizador');
          if (quoteElement) {
            window.dispatchEvent(new CustomEvent('select-service', {
              detail: { service: selectedService }
            }));
            quoteElement.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = `cotizador.html?servicio=${encodeURIComponent(selectedService)}`;
          }
        }
      });
    });
  }

  render() {
    this.innerHTML = `
      <section class="services-section" id="servicios">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Servicios Oficiales</span>
            <h2 class="section-title">Especialidades del <span class="highlight-accent">Taller</span></h2>
            <p class="section-subtitle center-block">Procedimientos ejecutados bajo especificaciones de manual técnico, instrumental de diagnóstico y herramientas dedicadas.</p>
          </div>

          <div class="services-grid">
            <!-- Servicio 1 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">🏍️</span>
                  <span class="placeholder-tag">Pauta Integral</span>
                  <span class="placeholder-desc">Mantención Preventiva & por KM</span>
                  <span class="placeholder-spec">Entrega en el día</span>
                </div>
                <span class="service-badge">Entrega en el Día</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Mantención por Kilometraje</h3>
                <p class="service-desc">Inspección exhaustiva desde el interior hacia el exterior. Se testea la moto en su totalidad para garantizar un andar 100% seguro.</p>
                <ul class="service-features-list">
                  <li>Cambio de aceite, filtro y revisión de presión</li>
                  <li>Limpieza y prueba de chispa de bujías con probador específico</li>
                  <li>Aseo de cuerpo de aceleración/carburador e inyector</li>
                  <li>Carga de batería al 100% y test de carga eléctrica</li>
                  <li>Aseo, tensión y lubricación de transmisión y rodamientos</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="mantencion" style="width: 100%;">
                    Cotizar Mantención
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 2 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">⚙️</span>
                  <span class="placeholder-tag">Mecánica Menor y Pesada</span>
                  <span class="placeholder-desc">Reparación Integral de Motores</span>
                  <span class="placeholder-spec">Prensa y Soldadura</span>
                </div>
                <span class="service-badge">Mecánica Dura</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Reparación de Motores</h3>
                <p class="service-desc">Reparación completa y ajuste fino con herramientas específicas, extractores dedicados, prensa hidráulica y máquinas de soldar.</p>
                <ul class="service-features-list">
                  <li>Revisión y/o ajuste de luz de válvulas y holguras</li>
                  <li>Revisión de torque de culata según manual técnico</li>
                  <li>Reparación de embrague, transmisión y compresión</li>
                  <li>Mecánica dura y reconstrucción con prensa y soldadura</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="motor" style="width: 100%;">
                    Cotizar Reparación de Motor
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 3 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">💻</span>
                  <span class="placeholder-tag">Diagnóstico OBD</span>
                  <span class="placeholder-desc">Scanner y Electrónica Avanzada</span>
                  <span class="placeholder-spec">Lectura en Tiempo Real</span>
                </div>
                <span class="service-badge">Diagnóstico Digital</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Scanner y Electrónica</h3>
                <p class="service-desc">Diagnóstico computarizado para detección precisa de fallas en sensores, inyección electrónica y actuadores de la moto.</p>
                <ul class="service-features-list">
                  <li>Lectura de parámetros en vivo y borrado de códigos de error</li>
                  <li>Test de actuadores, sensores y bomba de combustible</li>
                  <li>Diagnóstico de vida útil de batería con instrumental dedicado</li>
                  <li>Test de carga eléctrica de estator y regulador</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="scanner" style="width: 100%;">
                    Cotizar Scanner
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 4 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">🛑</span>
                  <span class="placeholder-tag">Seguridad Vial</span>
                  <span class="placeholder-desc">Mantenimiento de Frenos y Suspensión</span>
                  <span class="placeholder-spec">Desarme y Lubricación</span>
                </div>
                <span class="service-badge">Seguridad Total</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Frenos y Suspensión</h3>
                <p class="service-desc">Mantenimiento integral para máxima respuesta de detención y absorción de impacto en ruta y ciudad.</p>
                <ul class="service-features-list">
                  <li>Limpieza y lubricación de pistas de deslizamiento de calipers</li>
                  <li>Inspección de líquido de frenos y purgado de circuito</li>
                  <li>Inspección y servicio de suspensión (horquillas y monoshock)</li>
                  <li>Cambio de pastillas, discos y retenes de suspensión</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="frenos" style="width: 100%;">
                    Cotizar Frenos o Suspensión
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Banner Detallado de la Pauta Completa -->
          <div class="pauta-detail-box" style="margin-top: 3.5rem; background: rgba(13, 21, 38, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: var(--radius-xl); padding: 2.5rem; box-shadow: var(--shadow-md);">
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem;">
              <span style="font-size: 1.8rem;">📋</span>
              <div>
                <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 800; font-style: italic; color: #ffffff; text-transform: uppercase; margin: 0;">Pauta de Mantención Completa Coyote's House</h3>
                <span style="font-size: 0.88rem; color: var(--color-text-muted);">Inspección rigurosa desde el interior hacia el exterior</span>
              </div>
            </div>

            <p style="color: var(--color-text-body); font-size: 0.96rem; line-height: 1.65; margin-bottom: 1.75rem;">
              <em>"La moto se inspecciona completa: se cambia lo que esté con desgaste y se mantiene lo que puede seguir en buen funcionamiento. Los elementos se prueban fuera de la moto con instrumental específico para garantizar un andar 100% seguro."</em> — <strong>Alberto Pizarro</strong>
            </p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; font-size: 0.88rem; color: var(--color-text-muted);">
              <div style="background: rgba(8, 12, 20, 0.6); padding: 1.25rem; border-radius: var(--radius-md); border-left: 3px solid var(--color-accent);">
                <strong style="color: #ffffff; display: block; margin-bottom: 0.5rem;">🔧 Motor y Combustión</strong>
                <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.55;">
                  <li>Ajuste/luz de válvulas y torque de culata</li>
                  <li>Aseo cuerpo aceleración / carburador</li>
                  <li>Aseo y test de inyector y actuadores</li>
                  <li>Test de presión de bomba de combustible</li>
                  <li>Prueba de chispa de bujías en banco</li>
                  <li>Cambio de aceite, filtro y refrigerante</li>
                </ul>
              </div>

              <div style="background: rgba(8, 12, 20, 0.6); padding: 1.25rem; border-radius: var(--radius-md); border-left: 3px solid var(--color-accent);">
                <strong style="color: #ffffff; display: block; margin-bottom: 0.5rem;">⚡ Electrónica y Batería</strong>
                <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.55;">
                  <li>Scanner computarizado y sensores</li>
                  <li>Lectura de parámetros en vivo</li>
                  <li>Test de vida útil de batería</li>
                  <li>Test de carga del sistema eléctrico</li>
                  <li><strong>Carga de batería al 100% incluida</strong></li>
                  <li>Lubricación de cables y mandos</li>
                </ul>
              </div>

              <div style="background: rgba(8, 12, 20, 0.6); padding: 1.25rem; border-radius: var(--radius-md); border-left: 3px solid var(--color-accent);">
                <strong style="color: #ffffff; display: block; margin-bottom: 0.5rem;">🛑 Frenos, Chasis y Rodado</strong>
                <ul style="margin: 0; padding-left: 1.2rem; line-height: 1.55;">
                  <li>Lubricación de pistas de caliper</li>
                  <li>Inspección de líquido de frenos</li>
                  <li>Limpieza y relubricación de rodamientos</li>
                  <li>Aseo, tensión y lubricación de cadena</li>
                  <li>Inspección de dampers y dirección</li>
                  <li>Revisión de suspensión y neumáticos</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Marcas Atendidas -->
          <div style="margin-top: 3rem; text-align: center;">
            <span class="section-tag" style="margin-bottom: 0.75rem;">Motos Homologadas de Calle</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; font-style: italic; color: #ffffff; text-transform: uppercase; margin-bottom: 1rem;">Marcas Atendidas en Coyote's House</h3>
            <p style="color: var(--color-text-muted); font-size: 0.92rem; max-width: 700px; margin: 0 auto 1.5rem;">
              Atención a motocicletas de calle homologadas para circular. Marcas de referencia habituales en taller:
            </p>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.65rem; max-width: 800px; margin: 0 auto;">
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Honda</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Yamaha</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Suzuki</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Kawasaki</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">KTM</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">BMW</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Bajaj</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">CFMOTO</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Zontes</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Haojue</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Aprilia</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Benelli</span>
              <span class="brand-chip" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); padding: 0.4rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; color: #ffffff; font-size: 0.85rem;">Husqvarna</span>
            </div>
            <p style="color: var(--color-text-muted); font-size: 0.8rem; margin-top: 1rem; font-style: italic;">
              *Otras marcas y modelos homologados sujetos a consulta técnica previa.
            </p>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('services-catalog', ServicesCatalog);

