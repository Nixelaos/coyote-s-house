/**
 * Componente: CustomerReviews (<customer-reviews>)
 * Sección de opiniones de clientes en estado 'Próximamente'.
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
            <span class="section-tag">Testimonios</span>
            <h2 class="section-title">Opiniones de <span class="highlight-red">Nuestros Clientes</span></h2>
            <p class="section-subtitle center-block">La experiencia de quienes confían el cuidado de sus motocicletas en Coyote's House.</p>
          </div>

          <div class="reviews-coming-soon">
            <span style="font-size: 2.8rem; line-height: 1;">💬</span>
            <span class="placeholder-tag" style="font-size: 0.9rem; padding: 0.35rem 1rem;">Próximamente</span>
            <h3 style="font-size: 1.35rem; color: var(--color-text-title); margin-top: 0.25rem;">Sección de Opiniones en Construcción</h3>
            <p style="color: var(--color-text-muted); font-size: 0.98rem; max-width: 520px; line-height: 1.6;">
              Muy pronto compartiremos las valoraciones y testimonios verificados de nuestra comunidad de motociclistas.
            </p>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('customer-reviews', CustomerReviews);
