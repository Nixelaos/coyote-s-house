/**
 * COYOTE'S HOUSE - CONFIGURACIÓN DINÁMICA DEL SITIO
 *
 * Punto único de acceso al horario y al banner que el taller edita desde el
 * panel de administración. Los pide a /api/public/site-config al cargar.
 *
 * REGLA DE ORO: nunca datos inventados. Sin datos reales (el backend no
 * responde, responde 503 o la respuesta no trae el horario completo) no hay
 * horario ni anuncio que mostrar: getStatus() devuelve null, getSummary() una
 * cadena vacía y los componentes se ocultan. No existe un horario de respaldo.
 *
 * La última respuesta buena se guarda 5 minutos en sessionStorage: evita una
 * petición por página y es lo máximo que tarda un cambio del panel en verse
 * para quien ya está navegando. Pasado ese plazo, sin respuesta nueva no se
 * muestra nada.
 *
 * Este archivo debe cargarse ANTES que los componentes que lo consumen.
 */

(function () {
  'use strict';

  // ======================================================================
  // Configuración
  // ======================================================================

  /**
   * Dirección del backend, según dónde se esté sirviendo el sitio.
   * Se puede forzar desde el HTML declarando window.COYOTE_API_BASE antes de
   * cargar este archivo; es lo que conviene para pruebas puntuales, en vez de
   * editar este archivo y arriesgarse a subir el cambio sin querer.
   */
  var API_BASE = (function () {
    if (typeof window.COYOTE_API_BASE === 'string') return window.COYOTE_API_BASE;

    var host = window.location.hostname;

    // Desarrollo: el backend corre aparte, en su propio puerto.
    if (host === 'localhost' || host === '127.0.0.1' || host === '') {
      return 'http://localhost:3000';
    }

    // Producción: nginx sirve el sitio y hace de proxy al backend bajo el mismo
    // origen, así que una ruta relativa basta y no hay CORS de por medio.
    return '';
  })();

  var ENDPOINT = API_BASE + '/api/public/site-config';
  var CLAVE_CACHE = 'coyote:site-config';
  var VIGENCIA_CACHE_MS = 5 * 60 * 1000;
  var TIEMPO_LIMITE_MS = 3000;

  /** setTimeout no admite esperas más largas (unos 24,8 días). */
  var ESPERA_MAXIMA_MS = 2147483647;

  var DIA_CORTO = { 0: 'Dom', 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb' };
  var DIA_LARGO = {
    0: 'Domingo',
    1: 'Lunes',
    2: 'Martes',
    3: 'Miércoles',
    4: 'Jueves',
    5: 'Viernes',
    6: 'Sábado'
  };
  var NOMBRE_SCHEMA = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  };
  var ORDEN_SEMANA = [1, 2, 3, 4, 5, 6, 0];

  // ======================================================================
  // Cálculo de estado
  //
  // Espeja src/lib/schedule-status.js del backend. Se recalcula en el
  // navegador cada minuto para que el badge "Abierto/Cerrado" cambie solo,
  // sin volver a consultar la API.
  // ======================================================================

  function aMinutos(hora) {
    var m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hora || '');
    return m ? Number(m[1]) * 60 + Number(m[2]) : null;
  }

  /** Momento actual en la zona horaria del taller, no en la del visitante. */
  function ahoraEnChile() {
    try {
      var partes = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Santiago',
        weekday: 'short',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).formatToParts(new Date());

      var mapa = {};
      for (var i = 0; i < partes.length; i += 1) mapa[partes[i].type] = partes[i].value;

      var indices = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var hora = parseInt(mapa.hour, 10);
      if (!isFinite(hora) || hora === 24) hora = 0;

      return {
        fecha: mapa.year + '-' + mapa.month + '-' + mapa.day,
        dia: indices[mapa.weekday],
        minutos: hora * 60 + (parseInt(mapa.minute, 10) || 0)
      };
    } catch (e) {
      var ahora = new Date();
      return {
        fecha:
          ahora.getFullYear() +
          '-' +
          String(ahora.getMonth() + 1).padStart(2, '0') +
          '-' +
          String(ahora.getDate()).padStart(2, '0'),
        dia: ahora.getDay(),
        minutos: ahora.getHours() * 60 + ahora.getMinutes()
      };
    }
  }

  function sumarDias(fecha, cantidad) {
    var p = fecha.split('-');
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]) + cantidad * 86400000);
    return {
      fecha:
        d.getUTCFullYear() +
        '-' +
        String(d.getUTCMonth() + 1).padStart(2, '0') +
        '-' +
        String(d.getUTCDate()).padStart(2, '0'),
      dia: d.getUTCDay()
    };
  }

  /** Las excepciones (feriados) mandan por sobre el horario semanal. */
  function diaEfectivo(horario, dia, fecha) {
    var excepciones = horario.exceptions || [];

    for (var i = 0; i < excepciones.length; i += 1) {
      if (excepciones[i].date !== fecha) continue;

      if (excepciones[i].closed) {
        return { closed: true, label: excepciones[i].label || '', esExcepcion: true };
      }
      if (excepciones[i].open && excepciones[i].close) {
        return {
          closed: false,
          open: excepciones[i].open,
          close: excepciones[i].close,
          label: excepciones[i].label || '',
          esExcepcion: true
        };
      }
    }

    var base = horario.days[dia];
    if (!base || base.closed) return { closed: true, label: '', esExcepcion: false };
    return { closed: false, open: base.open, close: base.close, label: '', esExcepcion: false };
  }

  /** "Lun a Vie: 09:00 a 17:00 hrs · Sáb: 09:00 a 13:00 hrs" */
  function resumirHorario(horario) {
    var grupos = [];
    var actual = null;

    for (var i = 0; i < ORDEN_SEMANA.length; i += 1) {
      var dia = ORDEN_SEMANA[i];
      var d = horario.days[dia];

      if (!d || d.closed) {
        actual = null;
        continue;
      }

      if (actual && actual.open === d.open && actual.close === d.close) {
        actual.dias.push(dia);
      } else {
        actual = { open: d.open, close: d.close, dias: [dia] };
        grupos.push(actual);
      }
    }

    if (grupos.length === 0) return 'Cerrado temporalmente';

    return grupos
      .map(function (g) {
        var etiqueta =
          g.dias.length === 1
            ? DIA_CORTO[g.dias[0]]
            : DIA_CORTO[g.dias[0]] + ' a ' + DIA_CORTO[g.dias[g.dias.length - 1]];
        return etiqueta + ': ' + g.open + ' a ' + g.close + ' hrs';
      })
      .join(' · ');
  }

  /** Versión larga para la página de contacto: una línea por grupo de días. */
  function detalleHorario(horario) {
    var lineas = [];
    var grupos = [];
    var actual = null;
    var cerrados = [];

    for (var i = 0; i < ORDEN_SEMANA.length; i += 1) {
      var dia = ORDEN_SEMANA[i];
      var d = horario.days[dia];

      if (!d || d.closed) {
        cerrados.push(DIA_LARGO[dia]);
        actual = null;
        continue;
      }

      if (actual && actual.open === d.open && actual.close === d.close) {
        actual.dias.push(dia);
      } else {
        actual = { open: d.open, close: d.close, dias: [dia] };
        grupos.push(actual);
      }
    }

    for (var j = 0; j < grupos.length; j += 1) {
      var g = grupos[j];
      var etiqueta =
        g.dias.length === 1
          ? DIA_LARGO[g.dias[0]]
          : DIA_LARGO[g.dias[0]] + ' a ' + DIA_LARGO[g.dias[g.dias.length - 1]];
      lineas.push({ dias: etiqueta, horario: g.open + ' a ' + g.close + ' hrs' });
    }

    return { abiertos: lineas, cerrados: cerrados };
  }

  function calcularEstado(horario) {
    var ahora = ahoraEnChile();
    var hoy = diaEfectivo(horario, ahora.dia, ahora.fecha);
    var resumen = resumirHorario(horario);

    if (!hoy.closed) {
      var abre = aMinutos(hoy.open);
      var cierra = aMinutos(hoy.close);

      if (abre !== null && cierra !== null) {
        if (ahora.minutos >= abre && ahora.minutos < cierra) {
          return { isOpen: true, text: 'Abierto hoy hasta ' + hoy.close, summary: resumen };
        }
        if (ahora.minutos < abre) {
          return { isOpen: false, text: 'Cerrado (Abre ' + hoy.open + ' hrs)', summary: resumen };
        }
      }
    }

    var proximo = null;
    for (var i = 1; i <= 7 && !proximo; i += 1) {
      var siguiente = sumarDias(ahora.fecha, i);
      var dia = diaEfectivo(horario, siguiente.dia, siguiente.fecha);
      if (!dia.closed) proximo = { dia: siguiente.dia, open: dia.open, offset: i };
    }

    var cuando = proximo
      ? proximo.offset === 1
        ? 'mañana'
        : DIA_LARGO[proximo.dia].toLowerCase()
      : null;

    // El motivo del cierre se informa aunque no haya proxima apertura a la
    // vista: durante unas vacaciones largas "Cerrado por Vacaciones" explica
    // mucho mas que un "Cerrado temporalmente" a secas.
    if (hoy.closed && hoy.esExcepcion && hoy.label) {
      return {
        isOpen: false,
        text: proximo
          ? 'Cerrado por ' + hoy.label + ' (Abre ' + cuando + ' ' + proximo.open + ')'
          : 'Cerrado por ' + hoy.label,
        summary: resumen
      };
    }

    if (!proximo) return { isOpen: false, text: 'Cerrado temporalmente', summary: resumen };

    return {
      isOpen: false,
      text: 'Cerrado (Abre ' + cuando + ' ' + proximo.open + ')',
      summary: resumen
    };
  }

  // ======================================================================
  // Vigencia del banner
  //
  // Espeja src/lib/banner-visibility.js del backend; la prueba de paridad
  // compara las dos. La API entrega el banner con sus fechas y la decisión se
  // toma aquí, para que una pestaña abierta muestre u oculte el anuncio justo
  // cuando empieza o termina.
  // ======================================================================

  function bannerVisible(banner, ahoraMs) {
    if (!banner || !banner.enabled || !banner.message) return false;

    if (banner.startsAt) {
      var inicio = Date.parse(banner.startsAt);
      if (isFinite(inicio) && ahoraMs < inicio) return false;
    }

    if (banner.endsAt) {
      var fin = Date.parse(banner.endsAt);
      if (isFinite(fin) && ahoraMs > fin) return false;
    }

    return true;
  }

  // ======================================================================
  // Validación y caché en sessionStorage
  //
  // Todo lo que toca sessionStorage va envuelto en try/catch porque en modo
  // incógnito el acceso puede lanzar excepción.
  // ======================================================================

  /**
   * Acepta la respuesta solo si trae los 7 días. Nada se completa por defecto:
   * una respuesta incompleta cuenta como "sin datos".
   */
  function normalizar(datos) {
    var horario = datos && datos.schedule;
    if (!horario || !horario.days) return null;

    for (var dia = 0; dia < 7; dia += 1) {
      if (!horario.days[dia]) return null;
    }

    return {
      schedule: {
        timezone: horario.timezone || 'America/Santiago',
        days: horario.days,
        exceptions: horario.exceptions || []
      },
      banner: datos.banner || null
    };
  }

  function leerCache() {
    try {
      var crudo = window.sessionStorage.getItem(CLAVE_CACHE);
      if (!crudo) return null;

      var guardado = JSON.parse(crudo);
      if (!guardado || Date.now() - guardado.t > VIGENCIA_CACHE_MS) return null;

      return normalizar(guardado.v);
    } catch (e) {
      return null;
    }
  }

  function escribirCache(valor) {
    try {
      window.sessionStorage.setItem(CLAVE_CACHE, JSON.stringify({ t: Date.now(), v: valor }));
    } catch (e) {
      // Sin almacenamiento disponible simplemente se pedirá de nuevo.
    }
  }

  function borrarCache() {
    try {
      window.sessionStorage.removeItem(CLAVE_CACHE);
    } catch (e) {
      // Nada que borrar.
    }
  }

  // ======================================================================
  // Estado del módulo
  // ======================================================================

  /** Datos reales vigentes, o null si no los hay. */
  var config = leerCache();
  var temporizadorVigencia = null;

  function anunciarCambio() {
    window.dispatchEvent(
      new CustomEvent('siteconfig:ready', {
        detail: { config: config }
      })
    );
  }

  /**
   * Programa un aviso para el próximo inicio o término de la vigencia del
   * banner: así los componentes se repintan sin recargar la página.
   */
  function programarCambioDeVigencia() {
    clearTimeout(temporizadorVigencia);
    temporizadorVigencia = null;

    var banner = config && config.banner;
    if (!banner || !banner.enabled || !banner.message) return;

    var ahora = Date.now();
    var proxima = null;

    [banner.startsAt, banner.endsAt].forEach(function (iso) {
      var instante = iso ? Date.parse(iso) : NaN;
      if (isFinite(instante) && instante > ahora && (proxima === null || instante < proxima)) {
        proxima = instante;
      }
    });

    if (proxima === null) return;

    // Un segundo de margen: el término se compara con "después de", así que en
    // el instante exacto el anuncio todavía se ve.
    var espera = proxima - ahora + 1000;
    if (espera > ESPERA_MAXIMA_MS) return; // Faltan más de 24 días: lo resuelve una recarga.

    temporizadorVigencia = setTimeout(function () {
      anunciarCambio();
      programarCambioDeVigencia();
    }, espera);
  }

  /**
   * Mantiene el JSON-LD de Schema.org con el horario real. El HTML no trae un
   * horario escrito: se agrega aquí cuando hay datos y se quita cuando no.
   */
  function actualizarDatosEstructurados() {
    var bloque = document.querySelector('script[type="application/ld+json"]');
    if (!bloque) return;

    try {
      var datos = JSON.parse(bloque.textContent);

      if (!config) {
        delete datos.openingHoursSpecification;
      } else {
        var especificaciones = [];
        var grupos = {};

        for (var i = 0; i < ORDEN_SEMANA.length; i += 1) {
          var dia = ORDEN_SEMANA[i];
          var d = config.schedule.days[dia];
          if (!d || d.closed) continue;

          var clave = d.open + '-' + d.close;
          if (!grupos[clave]) {
            grupos[clave] = { opens: d.open, closes: d.close, dayOfWeek: [] };
            especificaciones.push(grupos[clave]);
          }
          grupos[clave].dayOfWeek.push(NOMBRE_SCHEMA[dia]);
        }

        datos.openingHoursSpecification = especificaciones.map(function (spec) {
          return {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: spec.dayOfWeek,
            opens: spec.opens,
            closes: spec.closes
          };
        });
      }

      bloque.textContent = JSON.stringify(datos, null, 2);
    } catch (e) {
      // Un JSON-LD malformado no debe impedir que el sitio funcione.
    }
  }

  async function cargar() {
    var controlador = new AbortController();
    var temporizador = setTimeout(function () {
      controlador.abort();
    }, TIEMPO_LIMITE_MS);

    try {
      var respuesta = await fetch(ENDPOINT, {
        signal: controlador.signal,
        credentials: 'omit',
        mode: 'cors'
      });

      if (respuesta.status === 503) {
        // El backend responde y dice que no hay horario publicado (nadie lo
        // ha guardado o el archivo no es válido). Es definitivo: también se
        // descarta la copia de esta sesión.
        config = null;
        borrarCache();
        return;
      }

      if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

      var normalizado = normalizar(await respuesta.json());
      if (!normalizado) throw new Error('Respuesta sin horario completo');

      config = normalizado;
      escribirCache(normalizado);
    } catch (e) {
      // Backend caído o lento: vale la copia real de esta sesión si sigue
      // vigente; si no la hay, no se muestra nada.
      config = leerCache();
      if (!config && window.console && window.console.info) {
        window.console.info('[Coyote] Sin datos del horario: no se muestra horario ni anuncio.');
      }
    } finally {
      clearTimeout(temporizador);
      actualizarDatosEstructurados();
      programarCambioDeVigencia();
      anunciarCambio();
    }
  }

  // ======================================================================
  // API pública del módulo
  // ======================================================================

  window.CoyoteSiteConfig = {
    /** true si hay datos reales que mostrar. */
    hasData: function () {
      return config !== null;
    },

    /** Datos reales vigentes, o null. */
    get: function () {
      return config;
    },

    getSchedule: function () {
      return config ? config.schedule : null;
    },

    /**
     * El banner, solo si corresponde mostrarlo en este instante (interruptor,
     * mensaje y vigencia). En cualquier otro caso, null.
     */
    getBanner: function () {
      return config && bannerVisible(config.banner, Date.now()) ? config.banner : null;
    },

    /** Estado del taller en este instante, o null sin datos. */
    getStatus: function () {
      return config ? calcularEstado(config.schedule) : null;
    },

    /** "Lun a Vie: 09:00 a 17:00 hrs", o cadena vacía sin datos. */
    getSummary: function () {
      return config ? resumirHorario(config.schedule) : '';
    },

    /** Desglose por grupos de días para contacto y FAQ, o null sin datos. */
    getDetail: function () {
      return config ? detalleHorario(config.schedule) : null;
    },

    /** Ejecuta el callback ahora y de nuevo cada vez que cambien los datos. */
    onReady: function (callback) {
      callback(config);
      window.addEventListener('siteconfig:ready', function () {
        callback(config);
      });
    }
  };

  cargar();
})();
