/**
 * Componente Web: CustomerReviews (<customer-reviews>)
 * Coyote's House - Taller Mecánico de Motocicletas
 * Renderiza dinámicamente reseñas reales de Google Maps desde /.netlify/functions/google-reviews
 */

// Memoria RAM compartida para evitar peticiones repetidas en la navegación SPA
let cachedReviewsData = null;
let activeFetchPromise = null;

const GOOGLE_ICON_SVG = `
  <svg class="google-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"/>
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
  </svg>
`;

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderStarsHtml(rating = 5) {
  const fullStars = Math.round(rating);
  let starsStr = '';
  for (let i = 0; i < 5; i++) {
    starsStr += i < fullStars ? '★' : '☆';
  }
  return `<span class="stars" aria-label="${rating} de 5 estrellas" title="${rating} de 5 estrellas">${starsStr}</span>`;
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return 'CH';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

class CustomerReviews extends HTMLElement {
  connectedCallback() {
    if (cachedReviewsData) {
      this.renderData(cachedReviewsData);
    } else {
      this.renderSkeleton();
      this.loadReviews();
    }
  }

  async loadReviews() {
    try {
      if (!activeFetchPromise) {
        activeFetchPromise = fetch('/api/google-reviews')
          .then((res) => {
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
          })
          .catch((err) => {
            console.warn('[customer-reviews] Aviso al cargar reseñas de Vercel API:', err.message);
            return null;
          })
          .finally(() => {
            activeFetchPromise = null;
          });
      }

      const data = await activeFetchPromise;
      if (data && (Array.isArray(data.reviews) || data.rating)) {
        cachedReviewsData = data;
        this.renderData(data);
      } else {
        this.renderFallback();
      }
    } catch (e) {
      console.warn('[customer-reviews] Error general:', e);
      this.renderFallback();
    }
  }

  renderSkeleton() {
    this.innerHTML = `
      <section class="reviews-section" id="testimonios">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Testimonios</span>
            <h2 class="section-title">Opiniones de <span class="highlight-accent">Nuestros Clientes</span></h2>
            <p class="section-subtitle center-block">La experiencia de quienes confían el cuidado de sus motocicletas en Coyote's House.</p>
            
            <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
              <div class="google-rating-banner" style="opacity: 0.7;">
                <div class="google-brand-badge">${GOOGLE_ICON_SVG} Google</div>
                <div class="skeleton-box" style="width: 140px; height: 20px; border-radius: 4px;"></div>
              </div>
            </div>
          </div>

          <div class="reviews-grid" aria-hidden="true">
            ${[1, 2, 3].map(() => `
              <div class="review-card skeleton">
                <div class="review-card-header">
                  <div class="skeleton-box skeleton-header"></div>
                  <div class="skeleton-box" style="width: 18px; height: 18px; border-radius: 50%;"></div>
                </div>
                <div class="skeleton-box skeleton-line"></div>
                <div class="skeleton-box skeleton-line"></div>
                <div class="skeleton-box skeleton-line short"></div>
                <div class="reviewer">
                  <div class="skeleton-box skeleton-avatar"></div>
                  <div class="skeleton-text-group">
                    <div class="skeleton-box skeleton-title"></div>
                    <div class="skeleton-box skeleton-subtitle"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  renderData(data) {
    const businessName = escapeHtml(data.businessName || "Coyote's House");
    const rating = typeof data.rating === 'number' ? data.rating : 5.0;
    const userRatingCount = typeof data.userRatingCount === 'number' ? data.userRatingCount : 0;
    const mapsUri = escapeHtml(data.googleMapsUri || 'https://maps.app.goo.gl/e7bNXcAvnVxL1CTN9');
    const rawReviewsList = Array.isArray(data.reviews) ? data.reviews : [];
    const reviews = rawReviewsList.filter((rev) => (typeof rev.rating === 'number' ? rev.rating : 5) >= 3);

    // Formatear texto de contador de reseñas
    const reviewCountLabel = userRatingCount > 0 ? `(${userRatingCount} opiniones en Google)` : '(Opiniones en Google Maps)';

    if (reviews.length === 0) {
      this.renderEmpty(rating, reviewCountLabel, mapsUri);
      return;
    }

    this.innerHTML = `
      <section class="reviews-section" id="testimonios">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Testimonios</span>
            <h2 class="section-title">Opiniones de <span class="highlight-accent">Nuestros Clientes</span></h2>
            <p class="section-subtitle center-block">La experiencia y valoraciones reales de quienes confían el cuidado de sus motocicletas en ${businessName}.</p>
            
            <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
              <a href="${mapsUri}" target="_blank" rel="noopener noreferrer" class="google-rating-banner" title="Ver perfil de Coyote's House en Google Maps">
                <div class="google-brand-badge">${GOOGLE_ICON_SVG} <span>Google</span></div>
                <span class="google-score">${rating.toFixed(1)}</span>
                ${renderStarsHtml(rating)}
                <span class="google-review-count">${reviewCountLabel}</span>
              </a>
            </div>
          </div>

          <div class="reviews-grid">
            ${reviews.map((rev) => {
              const author = escapeHtml(rev.author || 'Cliente de Coyote\'s House');
              const text = escapeHtml(rev.text || 'Excelente servicio y atención profesional en el mantenimiento de motocicletas.');
              const time = escapeHtml(rev.relativePublishTime || 'Reseña en Google');
              const revRating = typeof rev.rating === 'number' ? rev.rating : 5;
              const authorPhoto = rev.authorPhoto ? escapeHtml(rev.authorPhoto) : '';
              const reviewLink = escapeHtml(rev.googleMapsUri || mapsUri);
              const initials = getInitials(rev.author || 'CH');

              return `
                <article class="review-card">
                  <div class="review-card-header">
                    ${renderStarsHtml(revRating)}
                    <a href="${reviewLink}" target="_blank" rel="noopener noreferrer" title="Ver reseña en Google" class="google-brand-badge" style="gap: 0;">
                      ${GOOGLE_ICON_SVG}
                    </a>
                  </div>

                  <p class="review-text">"${text}"</p>

                  <div class="reviewer">
                    <div class="reviewer-avatar">
                      ${authorPhoto
                        ? `<img src="${authorPhoto}" alt="${author}" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove();">`
                        : initials
                      }
                    </div>
                    <div class="reviewer-info">
                      <h4>${author}</h4>
                      <span>${time}</span>
                    </div>
                  </div>
                </article>
              `;
            }).join('')}
          </div>

          <div class="reviews-cta-wrap">
            <a href="${mapsUri}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-lg">
              <span>★</span> Ver Todas las Reseñas en Google Maps
            </a>
            <div class="reviews-attribution">
              ${GOOGLE_ICON_SVG}
              <span>Reseñas reales verificadas de Google Maps</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  renderEmpty(rating, reviewCountLabel, mapsUri) {
    this.innerHTML = `
      <section class="reviews-section" id="testimonios">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Testimonios</span>
            <h2 class="section-title">Opiniones de <span class="highlight-accent">Nuestros Clientes</span></h2>
            <p class="section-subtitle center-block">La experiencia de quienes confían el cuidado de sus motocicletas en Coyote's House.</p>
            
            <div style="display: flex; justify-content: center; margin-top: 1.5rem;">
              <a href="${mapsUri}" target="_blank" rel="noopener noreferrer" class="google-rating-banner">
                <div class="google-brand-badge">${GOOGLE_ICON_SVG} <span>Google</span></div>
                <span class="google-score">${typeof rating === 'number' ? rating.toFixed(1) : '5.0'}</span>
                ${renderStarsHtml(rating || 5)}
                <span class="google-review-count">${reviewCountLabel}</span>
              </a>
            </div>
          </div>

          <div class="reviews-fallback">
            <div class="reviews-fallback-icon">⭐</div>
            <h3>Comunidad y Confianza en Coyote's House</h3>
            <p>Conoce las opiniones y calificaciones de nuestros clientes directamente en nuestro perfil oficial de Google Maps.</p>
            <a href="${mapsUri}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-lg">
              <span>★</span> Ver Opiniones en Google Maps
            </a>
          </div>
        </div>
      </section>
    `;
  }

  renderFallback() {
    const fallbackUri = 'https://maps.app.goo.gl/e7bNXcAvnVxL1CTN9';
    this.innerHTML = `
      <section class="reviews-section" id="testimonios">
        <div class="container">
          <div class="text-center">
            <span class="section-tag">Testimonios</span>
            <h2 class="section-title">Opiniones de <span class="highlight-accent">Nuestros Clientes</span></h2>
            <p class="section-subtitle center-block">La experiencia de quienes confían el cuidado de sus motocicletas en Coyote's House.</p>
          </div>

          <div class="reviews-fallback">
            <div class="reviews-fallback-icon">⭐</div>
            <h3>Opiniones Verificadas en Google Maps</h3>
            <p>Descubre las valoraciones y recomendaciones que la comunidad de motociclistas ha dejado sobre nuestro taller en Google.</p>
            <a href="${fallbackUri}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-lg">
              <span>★</span> Ver Reseñas en Google Maps
            </a>
          </div>
        </div>
      </section>
    `;
  }
}

// Registro del Web Component
if (!customElements.get('customer-reviews')) {
  customElements.define('customer-reviews', CustomerReviews);
}
