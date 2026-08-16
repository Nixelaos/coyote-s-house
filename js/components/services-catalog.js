/**
 * Componente: ServicesCatalog (<services-catalog>)
 * Catálogo de servicios especializados con placeholders e interacción para cotizar.
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
          window.dispatchEvent(new CustomEvent('select-service', {
            detail: { service: selectedService }
          }));

          const quoteElement = document.querySelector('#cotizador') || document.querySelector('whatsapp-cotizador');
          if (quoteElement) {
            quoteElement.scrollIntoView({ behavior: 'smooth' });
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
            <span class="section-tag">Especialidades del Taller</span>
            <h2 class="section-title">Servicios con <span class="highlight-red">Estándares de Calidad</span></h2>
            <p class="section-subtitle center-block">Cada procedimiento se realiza siguiendo especificaciones técnicas de manual de taller de cada fabricante.</p>
          </div>

          <div class="services-grid">
            <!-- Servicio 1 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">📷</span>
                  <span class="placeholder-tag">Insertar Imagen</span>
                  <span class="placeholder-desc">Mantenimiento Preventivo / Pauta por KM</span>
                  <span class="placeholder-spec">600 x 400 px</span>
                </div>
                <span class="service-badge">Pauta Oficial</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Mantenimiento Preventivo</h3>
                <p class="service-desc">Revisiones por kilometraje según pauta del fabricante para mantener la salud, rendimiento y vida útil de tu motor.</p>
                <ul class="service-features-list">
                  <li>Cambio de aceite sintético/semisintético y filtros</li>
                  <li>Revisión y lubricación de transmisión y cadena</li>
                  <li>Ajuste de cables, bujías y niveles de refrigerante</li>
                  <li>Chequeo de aprietes y torque de seguridad</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="mantenimiento" style="width: 100%;">
                    Cotizar este Servicio
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 2 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">📷</span>
                  <span class="placeholder-tag">Insertar Imagen</span>
                  <span class="placeholder-desc">Escáner & Diagnóstico Electrónico OBD</span>
                  <span class="placeholder-spec">600 x 400 px</span>
                </div>
                <span class="service-badge">Alta Tecnología</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Escáner & Diagnóstico Electrónico</h3>
                <p class="service-desc">Lectura avanzada de centralitas ECU en motocicletas modernas de inyección. Diagnóstico certero sin prueba y error.</p>
                <ul class="service-features-list">
                  <li>Lectura y reseteo de códigos de falla DTC</li>
                  <li>Reseteo de indicador de intervalo de servicio</li>
                  <li>Monitoreo de sensores (TPS, O2, temperatura, MAP)</li>
                  <li>Calibración de cuerpos de aceleración electrónicos</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="escaner" style="width: 100%;">
                    Cotizar este Servicio
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 3 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">📷</span>
                  <span class="placeholder-tag">Insertar Imagen</span>
                  <span class="placeholder-desc">Ajuste y Reparación de Motores</span>
                  <span class="placeholder-spec">600 x 400 px</span>
                </div>
                <span class="service-badge">20+ Años de Experiencia</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Motores & Sincronización</h3>
                <p class="service-desc">Ajuste fino y reconstrucción de motores monocilíndricos, bicilíndricos, tricilíndricos y tetracilíndricos.</p>
                <ul class="service-features-list">
                  <li>Reglaje y calibración de holgura de válvulas</li>
                  <li>Cambio de kit de embrague y resortes</li>
                  <li>Cambio de cadena y tensores de distribución</li>
                  <li>Reconstrucción completa y rectificación</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="motor" style="width: 100%;">
                    Cotizar este Servicio
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 4 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">📷</span>
                  <span class="placeholder-tag">Insertar Imagen</span>
                  <span class="placeholder-desc">Frenos y Suspensión Especializada</span>
                  <span class="placeholder-spec">600 x 400 px</span>
                </div>
                <span class="service-badge">Seguridad Vial</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Frenos & Suspensión</h3>
                <p class="service-desc">El sistema más crítico para tu seguridad. Servicio especializado en horquillas invertidas, monoshock y frenos hidráulicos/ABS.</p>
                <ul class="service-features-list">
                  <li>Cambio de retenes, guardapolvos y aceite de horquilla</li>
                  <li>Purgado y reemplazo de líquido de frenos DOT 4/5.1</li>
                  <li>Cambio de pastillas y rectificación/cambio de discos</li>
                  <li>Ajuste de precarga y rebote para tu peso</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="frenos" style="width: 100%;">
                    Cotizar este Servicio
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 5 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">📷</span>
                  <span class="placeholder-tag">Insertar Imagen</span>
                  <span class="placeholder-desc">Inyección Electrónica (EFI) & Ultrasonido</span>
                  <span class="placeholder-spec">600 x 400 px</span>
                </div>
                <span class="service-badge">Rendimiento Óptimo</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Inyección (EFI) & Ultrasonido</h3>
                <p class="service-desc">Limpieza y calibración de sistemas de alimentación para recuperar potencia y optimizar el consumo de combustible.</p>
                <ul class="service-features-list">
                  <li>Limpieza y prueba en banco ultrasónico de inyectores</li>
                  <li>Sincronización por vacío de cuerpos de aceleración</li>
                  <li>Diagnóstico de bombas y reguladores de presión</li>
                  <li>Servicio integral a carburadores clásicos</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="inyeccion" style="width: 100%;">
                    Cotizar este Servicio
                  </button>
                </div>
              </div>
            </div>

            <!-- Servicio 6 -->
            <div class="service-card">
              <div class="service-img-wrap">
                <div class="image-placeholder service-placeholder">
                  <span class="placeholder-icon">📷</span>
                  <span class="placeholder-tag">Insertar Imagen</span>
                  <span class="placeholder-desc">Inspección Pre-Compra (30 Puntos)</span>
                  <span class="placeholder-spec">600 x 400 px</span>
                </div>
                <span class="service-badge">Compra Segura</span>
              </div>
              <div class="service-body">
                <h3 class="service-title">Inspección Pre-Compra (30 Puntos)</h3>
                <p class="service-desc">¿Vas a comprar una moto usada? Traela antes a Coyote's House y recibe un informe técnico completo de su estado real.</p>
                <ul class="service-features-list">
                  <li>Escáner de fallas ocultas en centralita ECU</li>
                  <li>Revisión de chasis, compresión y fugas de fluidos</li>
                  <li>Estado de neumáticos, rodamientos y transmisión</li>
                  <li>Estimación de costos de mantención futura</li>
                </ul>
                <div class="service-footer">
                  <button class="btn btn-outline btn-sm btn-service-select" data-service="precompra" style="width: 100%;">
                    Cotizar este Servicio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('services-catalog', ServicesCatalog);
