/**
 * Componente: AnnouncementBanner (<announcement-banner>)
 *
 * Franja naranja en la parte superior del sitio con el anuncio del taller
 * desplazándose de forma continua. El contenido se administra desde el panel
 * (backend-coyote-s-house) y llega a través de <site-config.js>.
 *
 * Si no hay anuncio activo el componente no ocupa ningún espacio y el sitio
 * queda exactamente como estaba antes de que existiera esta barra.
 */

class AnnouncementBanner extends HTMLElement {
  connectedCallback() {
    // Píxeles por segundo según la velocidad elegida en el panel. Derivar la
    // duración del ancho real (y no fijarla) mantiene constante la velocidad
    // de lectura: un mensaje corto no debe salir volando.
    this.velocidades = { slow: 55, normal: 90, fast: 150 };

    this.render();

    this.alRedimensionar = this.debounce(() => this.render(), 200);
    this.alActualizarConfig = () => this.render();

    window.addEventListener('resize', this.alRedimensionar);
    window.addEventListener('siteconfig:ready', this.alActualizarConfig);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this.alRedimensionar);
    window.removeEventListener('siteconfig:ready', this.alActualizarConfig);
    this.fijarAltura(0);
  }

  debounce(fn, espera) {
    let temporizador;
    return (...args) => {
      clearTimeout(temporizador);
      temporizador = setTimeout(() => fn(...args), espera);
    };
  }

  /**
   * Publica la altura real de la barra como variable CSS.
   * Las capas fijas de abajo (topbar y header) se posicionan a partir de ella,
   * así que si esto no se actualiza, el header se superpone al contenido.
   */
  fijarAltura(altura) {
    document.documentElement.style.setProperty('--banner-height', `${altura}px`);
  }

  /**
   * Solo se aceptan rutas del propio sitio o URLs http(s).
   * El backend ya valida el enlace, pero la respuesta también puede venir de
   * la caché del navegador: conviene no confiar a ciegas en lo que se pinta.
   */
  esEnlaceSeguro(url) {
    if (!url) return false;

    const valor = url.trim();
    if (!valor) return false;

    for (let i = 0; i < valor.length; i += 1) {
      const codigo = valor.charCodeAt(i);
      if (codigo <= 32 || codigo === 127) return false;
    }

    const esquema = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(valor);
    if (!esquema) return true; // Ruta relativa del sitio.

    const nombre = esquema[1].toLowerCase();
    return nombre === 'http' || nombre === 'https';
  }

  crearItem(mensaje, decorativo) {
    const item = document.createElement('span');
    item.className = 'announcement-item';
    // textContent y nunca innerHTML: el mensaje es contenido externo.
    item.textContent = mensaje;
    // Las copias existen solo para el efecto visual; un lector de pantalla
    // leería el mismo anuncio muchas veces seguidas.
    if (decorativo) item.setAttribute('aria-hidden', 'true');
    return item;
  }

  render() {
    const config = window.CoyoteSiteConfig;
    const banner = config ? config.getBanner() : null;
    const mensaje = banner && banner.enabled ? (banner.message || '').trim() : '';

    if (!mensaje) {
      this.textContent = '';
      this.hidden = true;
      this.fijarAltura(0);
      return;
    }

    this.hidden = false;
    this.textContent = '';

    const enlaceValido = this.esEnlaceSeguro(banner.linkUrl);

    const barra = document.createElement(enlaceValido ? 'a' : 'div');
    barra.className = 'announcement-bar';
    barra.setAttribute('role', 'region');
    barra.setAttribute('aria-label', 'Anuncio del taller');

    if (enlaceValido) {
      barra.href = banner.linkUrl.trim();
      barra.classList.add('announcement-bar--link');
      if (/^https?:/i.test(banner.linkUrl.trim())) {
        barra.target = '_blank';
        barra.rel = 'noopener';
      }
    }

    const pista = document.createElement('div');
    pista.className = 'announcement-track';
    barra.appendChild(pista);
    this.appendChild(barra);

    this.rellenarPista(pista, mensaje, banner.speed);
  }

  /**
   * Rellena la pista con suficientes copias del mensaje y calcula la duración.
   *
   * El truco del marquee continuo: se pinta el mismo bloque de copias dos
   * veces y se desplaza la pista un -50%. Cuando la animación reinicia, la
   * segunda mitad está exactamente donde estaba la primera, así que el bucle
   * no tiene salto ni deja un hueco vacío al final.
   */
  rellenarPista(pista, mensaje, velocidad) {
    // Se mide una copia real antes de decidir cuántas hacen falta: un mensaje
    // corto necesita muchas para cubrir una pantalla ancha.
    const sonda = this.crearItem(mensaje, true);
    pista.appendChild(sonda);

    requestAnimationFrame(() => {
      const anchoItem = sonda.getBoundingClientRect().width;

      // Si la medicion falla (fuente todavia sin cargar, elemento oculto, el
      // ancho vuelve 0) se usa el minimo: calcular copias a partir de un ancho
      // de 1px generaria miles de nodos y colgaria la pestana. El tope de 30
      // cubre pantallas ultra anchas con mensajes muy cortos.
      const copias =
        anchoItem > 1
          ? Math.min(30, Math.max(2, Math.ceil(window.innerWidth / anchoItem) + 1))
          : 2;

      pista.textContent = '';
      for (let bloque = 0; bloque < 2; bloque += 1) {
        for (let i = 0; i < copias; i += 1) {
          // Solo la primera copia es la que anuncian los lectores de pantalla.
          pista.appendChild(this.crearItem(mensaje, !(bloque === 0 && i === 0)));
        }
      }

      const recorrido = pista.scrollWidth / 2;
      const pxPorSegundo = this.velocidades[velocidad] || this.velocidades.normal;

      if (recorrido > 0) {
        pista.style.setProperty('--marquee-duration', `${recorrido / pxPorSegundo}s`);
      }

      requestAnimationFrame(() => this.fijarAltura(this.offsetHeight));
    });
  }
}

customElements.define('announcement-banner', AnnouncementBanner);
