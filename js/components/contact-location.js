/**
 * Componente: ContactLocation (<contact-location>)
 * Información de contacto, ubicación, botones de navegación GPS (Google Maps, Waze) y mapa embebido.
 */

class ContactLocation extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="contact-section" id="contacto">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Encuéntranos</span>
            <h2 class="section-title">Ubicación y <span class="highlight-accent">Contacto Directo</span></h2>
            <p class="section-subtitle center-block">Ubicados estratégicamente en Macul con fácil acceso desde las principales avenidas de Santiago.</p>
          </div>

          <div class="contact-grid">
            <div class="contact-info-card">
              <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                <div class="info-item">
                  <div class="info-icon-box">📍</div>
                  <div class="info-text">
                    <h4>Dirección del Taller</h4>
                    <p>Av. Macul 5847, Macul, Región Metropolitana, Santiago de Chile.</p>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon-box">🕒</div>
                  <div class="info-text">
                    <h4>Horario de Atención</h4>
                    <p>Lunes a Viernes: <strong>09:00 a 17:00 hrs</strong><br>Sábados, Domingos y Festivos: Cerrado</p>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon-box">💬</div>
                  <div class="info-text">
                    <h4>WhatsApp de Atención</h4>
                    <p><a href="https://wa.me/56954750993" target="_blank" rel="noopener">+56 9 5475 0993</a> (Alberto Pizarro)</p>
                  </div>
                </div>
              </div>

              <div class="nav-buttons-row">
                <a href="https://maps.app.goo.gl/e7bNXcAvnVxL1CTN9" target="_blank" rel="noopener" class="btn btn-primary" style="flex: 1;">
                  <span>🗺️</span> Abrir en Google Maps
                </a>
                <a href="https://waze.com/ul?q=Av.+Macul+5847+Macul+Santiago" target="_blank" rel="noopener" class="btn btn-outline" style="flex: 1;">
                  <span>🚗</span> Abrir en Waze
                </a>
              </div>

              <div class="social-links-row">
                <span style="font-size: 0.88rem; font-weight: 700;">Síguenos:</span>
                <a href="https://www.instagram.com/tallercoyoteshouse/" target="_blank" rel="noopener" class="social-btn">
                  <span>📸</span> Instagram (@tallercoyoteshouse)
                </a>
                <a href="https://www.facebook.com/CoyotesHouse/" target="_blank" rel="noopener" class="social-btn">
                  <span>👥</span> Facebook
                </a>
              </div>
            </div>

            <div class="map-card-wrapper">
              <iframe 
                src="https://maps.google.com/maps?q=Av.+Macul+5847,+Macul,+Santiago,+Chile&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
                title="Mapa Taller Coyote's House en Macul">
              </iframe>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('contact-location', ContactLocation);
