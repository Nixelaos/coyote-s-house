/**
 * Componente: CustomerReviews (<customer-reviews>)
 * Testimonios y opiniones de clientes con banner de calificación Google Maps.
 */

class CustomerReviews extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="reviews-section" id="testimonios">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Prueba Social</span>
            <h2 class="section-title">La Opinión de <span class="highlight-red">Nuestros Clientes</span></h2>
            
            <div class="google-rating-banner center-block">
              <span style="font-weight: 800; font-size: 1.2rem; color: #fff;">5.0</span>
              <span class="stars">★★★★★</span>
              <span style="font-size: 0.9rem; color: var(--color-text-muted);">Calificación excelente en Google Maps</span>
            </div>
          </div>

          <div class="reviews-grid">
            <div class="review-card">
              <div>
                <div class="stars" style="margin-bottom: 0.75rem;">★★★★★</div>
                <p class="review-text">"Excelente servicio. Se nota de inmediato la experiencia pedagógica de Alberto: te explica con detalle qué tenía la moto, cómo se solucionó y qué pautas seguir. 100% recomendado en Santiago."</p>
              </div>
              <div class="reviewer">
                <div class="reviewer-avatar">MR</div>
                <div class="reviewer-info">
                  <h4>Mauricio Rojas</h4>
                  <span>Yamaha MT-09 • Cliente frecuente</span>
                </div>
              </div>
            </div>

            <div class="review-card">
              <div>
                <div class="stars" style="margin-bottom: 0.75rem;">★★★★★</div>
                <p class="review-text">"Llevé mi moto con una falla eléctrica intermitente que ningún taller lograba diagnosticar. Con el escáner y la experiencia de Alberto detectó el sensor fallido en menos de una hora. Impecable trabajo."</p>
              </div>
              <div class="reviewer">
                <div class="reviewer-avatar">CP</div>
                <div class="reviewer-info">
                  <h4>Cristián Parra</h4>
                  <span>BMW F800GS • Mantención y Diagnóstico</span>
                </div>
              </div>
            </div>

            <div class="review-card">
              <div>
                <div class="stars" style="margin-bottom: 0.75rem;">★★★★★</div>
                <p class="review-text">"Puntualidad, honestidad en los repuestos y precios totalmente justos para la calidad de atención. Coyote's House es el taller definitivo para dejar la moto con total tranquilidad."</p>
              </div>
              <div class="reviewer">
                <div class="reviewer-avatar">DA</div>
                <div class="reviewer-info">
                  <h4>Diego Álvarez</h4>
                  <span>Kawasaki Ninja 400 • Pauta por Kilometraje</span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center" style="margin-top: 2.5rem;">
            <a href="https://maps.app.goo.gl/e7bNXcAvnVxL1CTN9" target="_blank" rel="noopener" class="btn btn-outline">
              <span>⭐</span> Ver o Dejar Reseña en Google Maps
            </a>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('customer-reviews', CustomerReviews);
