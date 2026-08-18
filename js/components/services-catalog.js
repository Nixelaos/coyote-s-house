/**
 * Componente: ServicesCatalog (<services-catalog>)
 * Catálogo oficial de servicios, pauta integral completa, equipamiento de taller,
 * tiempos de entrega y marcas homologadas según la información directa de Alberto Pizarro.
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
          
          <!-- Encabezado -->
          <div class="text-center services-header-wrap">
            <span class="section-tag">Coyote's House</span>
            <h1 class="section-title">Servicios del <span class="highlight-accent">Taller</span></h1>
            <p class="section-subtitle center-block">
              Mecánica menor y mecánica dura, mantenciones y reparación completa de motores atendido por Alberto Pizarro.
            </p>
          </div>

          <!-- 1. Los 5 Servicios de Don Alberto -->
          <div class="services-main-grid">
            
            <!-- Servicio 1 -->
            <div class="service-card">
              <div class="service-card-header">
                <div class="service-icon-box">🏍️</div>
                <span class="service-badge-pill">Entrega en el día*</span>
              </div>
              <div class="service-body">
                <h2 class="service-title">Mantenciones por kilometraje</h2>
                <p class="service-desc">
                  Pauta de mantención completa ejecutada desde dentro hacia el exterior para motos de calle homologadas.
                </p>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="mantencion-km" style="width: 100%;">
                    Cotizar Mantención por KM
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 2 -->
            <div class="service-card">
              <div class="service-card-header">
                <div class="service-icon-box">🛡️</div>
                <span class="service-badge-pill">Entrega en el día*</span>
              </div>
              <div class="service-body">
                <h2 class="service-title">Mantenciones preventivas</h2>
                <p class="service-desc">
                  Revisión, ajustes, limpieza y lubricación integral para evitar fallas e imprevistos en ruta.
                </p>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="mantencion-prev" style="width: 100%;">
                    Cotizar Mantención Preventiva
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 3 -->
            <div class="service-card">
              <div class="service-card-header">
                <div class="service-icon-box">⚙️</div>
                <span class="service-badge-pill">Mecánica Menor y Dura</span>
              </div>
              <div class="service-body">
                <h2 class="service-title">Reparación de motores</h2>
                <p class="service-desc">
                  Reparación completa de motores incluidos trabajos de soldadura, prensa hidráulica y extractores específicos.
                </p>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="motor" style="width: 100%;">
                    Cotizar Reparación de Motores
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 4 -->
            <div class="service-card">
              <div class="service-card-header">
                <div class="service-icon-box">🔧</div>
                <span class="service-badge-pill">Mecánica de Calle</span>
              </div>
              <div class="service-body">
                <h2 class="service-title">Servicio de suspensión</h2>
                <p class="service-desc">
                  Inspección, ajuste y servicio técnico para sistemas de suspensión y amortiguación de motocicletas de calle.
                </p>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="suspension" style="width: 100%;">
                    Cotizar Servicio de Suspensión
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 5 -->
            <div class="service-card">
              <div class="service-card-header">
                <div class="service-icon-box">💻</div>
                <span class="service-badge-pill">Diagnóstico Electrónico</span>
              </div>
              <div class="service-body">
                <h2 class="service-title">Scanner y electrónica</h2>
                <p class="service-desc">
                  Scanner con revisión de actuadores, lectura de parámetros de sensores, test de carga eléctrica y batería.
                </p>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="scanner" style="width: 100%;">
                    Cotizar Scanner y Electrónica
                  </button>
                </div>
              </div>
            </div>

          </div>

          <!-- 2. Pauta de Mantención Completa -->
          <div class="pauta-complete-wrap">
            <div class="pauta-top-header">
              <div class="pauta-header-icon">📋</div>
              <div>
                <h2 class="pauta-title">Pauta de mantención completa</h2>
                <p class="pauta-subtitle">
                  Incluye desde dentro hacia el exterior:
                </p>
              </div>
            </div>

            <div class="pauta-grid">
              <div class="pauta-column-card">
                <h3 class="pauta-col-title">🔧 Motor y Alimentación</h3>
                <ul class="pauta-items-list">
                  <li>Revisión y/o ajuste de luz de válvulas</li>
                  <li>Revisión de torque de culata</li>
                  <li>Aseo a cuerpo de aceleración / carburador</li>
                  <li>Aseo y test de inyector</li>
                  <li>Revisión de presión de bomba de combustible</li>
                  <li>Revisión de flujo de filtro de aire</li>
                  <li>Revisión y limpieza de bujías</li>
                </ul>
              </div>

              <div class="pauta-column-card">
                <h3 class="pauta-col-title">⚡ Sensores, Actuadores y Batería</h3>
                <ul class="pauta-items-list">
                  <li>Scanner con revisión de actuadores y lectura de parámetros de sensores</li>
                  <li>Revisión de sensores y actuadores</li>
                  <li>Test de vida útil de batería</li>
                  <li>Test de carga eléctrica de la moto</li>
                  <li class="pauta-highlight-item">🔋 Se carga la batería al 100% mientras se hace la mantención</li>
                  <li>Aseo, ajuste y lubricación de cables y partes móviles</li>
                </ul>
              </div>

              <div class="pauta-column-card">
                <h3 class="pauta-col-title">⚙️ Rodados, Transmisión y Aprietes</h3>
                <ul class="pauta-items-list">
                  <li>Revisión, limpieza y relubricación de rodamientos de masa</li>
                  <li>Aseo, tensión y lubricación de kit de transmisión</li>
                  <li>Inspección de dampers</li>
                  <li>Apriete perimetral</li>
                  <li>Revisión y apriete general</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 3. Sobre lo que hago: Mecánica y Equipamiento -->
          <div class="equip-section-wrap">
            <div class="text-center">
              <span class="section-tag">Taller y Equipamiento</span>
              <h2 class="section-title">Mecánica y <span class="highlight-accent">Herramientas Dedicadas</span></h2>
              <p class="section-subtitle center-block">
                Realizo mecánica menor y mecánica dura, reparación completa de motores incluidos trabajos de soldadura.
              </p>
            </div>

            <div class="equip-grid">
              <div class="equip-card">
                <span class="equip-card-icon">🔩</span>
                <h3 class="equip-card-title">Mecánica Menor y Mecánica Dura</h3>
                <p class="equip-card-desc">
                  Atención desde servicios básicos hasta desarmes y reparaciones complejas de motores.
                </p>
              </div>

              <div class="equip-card">
                <span class="equip-card-icon">⚡</span>
                <h3 class="equip-card-title">Máquinas de Soldar</h3>
                <p class="equip-card-desc">
                  Cuento con máquinas de soldar para reparación completa de motores y trabajos dedicados.
                </p>
              </div>

              <div class="equip-card">
                <span class="equip-card-icon">🏗️</span>
                <h3 class="equip-card-title">Prensa Hidráulica</h3>
                <p class="equip-card-desc">
                  Prensa hidráulica para montaje y desmontaje de rodamientos y piezas con ajuste a presión.
                </p>
              </div>

              <div class="equip-card">
                <span class="equip-card-icon">🛠️</span>
                <h3 class="equip-card-title">Extractores Específicos</h3>
                <p class="equip-card-desc">
                  Extractores específicos entre otras herramientas muy específicas y dedicadas que no están en todos los talleres.
                </p>
              </div>
            </div>
          </div>

          <!-- 4. Tiempos de Entrega -->
          <div class="delivery-section-wrap">
            <div class="text-center">
              <span class="section-tag">Plazos</span>
              <h2 class="section-title">Tiempos de <span class="highlight-accent">Entrega</span></h2>
              <p class="section-subtitle center-block">
                Los tiempos de entrega varían según el trabajo a realizar y la moto:
              </p>
            </div>

            <div class="delivery-grid">
              <div class="delivery-card">
                <span class="delivery-tag">Mismo Día</span>
                <h3 class="delivery-title">Mantenciones</h3>
                <p class="delivery-desc">
                  En su gran mayoría se entregan en el día siempre que no encuentre sorpresas.
                </p>
              </div>

              <div class="delivery-card">
                <span class="delivery-tag">Día a Día</span>
                <h3 class="delivery-title">Reparaciones de Motores Pequeños</h3>
                <p class="delivery-desc">
                  También pueden salir en el día o de un día a otro.
                </p>
              </div>

              <div class="delivery-card">
                <span class="delivery-tag">Disponibilidad Repuestos</span>
                <h3 class="delivery-title">Motores Más Grandes</h3>
                <p class="delivery-desc">
                  Los más grandes suelen demorar un poco más según la disponibilidad de repuestos.
                </p>
              </div>
            </div>
          </div>

          <!-- 5. Motos y Marcas Atendidas -->
          <div class="brands-section-wrap">
            <div class="text-center">
              <span class="section-tag">Motos de Calle</span>
              <h2 class="section-title">Motos y Marcas <span class="highlight-accent">Atendidas</span></h2>
              <p class="section-subtitle center-block">
                Atiendo todas las motos de calle que estén homologadas para circular.
              </p>
            </div>

            <div class="brands-scope-card">
              <div class="brands-notice-grid">
                <div class="notice-box accept">
                  <span class="notice-icon">✅</span>
                  <div>
                    <strong>Motos atendidas:</strong> Todas las motos de calle que estén homologadas para circular.
                  </div>
                </div>

                <div class="notice-box reject">
                  <span class="notice-icon">🚫</span>
                  <div>
                    <strong>No se atienden:</strong> Cuadrimotos ni motos fuera de homologación (las pequeñas de delivery).
                  </div>
                </div>
              </div>

              <h3 style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 800; font-style: italic; color: var(--color-text-title); text-transform: uppercase; margin-bottom: 0.75rem;">
                Marcas de Referencia a las que se da Servicio
              </h3>
              <p style="color: var(--color-text-muted); font-size: 0.9rem; max-width: 750px; margin: 0 auto 1.25rem;">
                En esta lista están las mejores marcas reconocidas y las mejores marcas chinas:
              </p>

              <div class="brand-chips-wrap">
                <span class="brand-chip">Honda</span>
                <span class="brand-chip">Yamaha</span>
                <span class="brand-chip">Suzuki</span>
                <span class="brand-chip">Kawasaki</span>
                <span class="brand-chip">KTM</span>
                <span class="brand-chip">Bajaj</span>
                <span class="brand-chip">CF MOTO</span>
                <span class="brand-chip">Zontes</span>
                <span class="brand-chip">Haojue</span>
                <span class="brand-chip">Aprilia</span>
                <span class="brand-chip">Benelli</span>
                <span class="brand-chip">Husqvarna</span>
                <span class="brand-chip">BMW</span>
                <span class="brand-chip chip-etc">Etc.</span>
              </div>

              <p class="brands-footnote">
                * Al estar esta lista, motos de otras marcas quedan a consulta técnica según evaluación para aceptar o rechazar.
              </p>
            </div>
          </div>

          <!-- Botón Cotizador -->
          <div class="text-center" style="margin-top: 4rem;">
            <a href="cotizador.html" class="btn btn-whatsapp btn-lg">
              <span>💬</span> Ir al Cotizador de WhatsApp
            </a>
          </div>

        </div>
      </section>
    `;
  }
}

customElements.define('services-catalog', ServicesCatalog);
