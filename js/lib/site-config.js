/**
 * COYOTE'S HOUSE - CONFIGURACIÓN DINÁMICA DEL SITIO
 *
 * Punto único de acceso al horario y al banner que el taller edita desde el
 * panel de administración.
 *
 * REGLA DE ORO: el sitio nunca puede romperse porque el backend esté caído.
 * Por eso el horario que hoy está escrito a mano vive aquí como respaldo, la
 * respuesta se guarda en sessionStorage y la petición tiene un tiempo límite
 * corto. En el peor de los casos el visitante ve exactamente lo de siempre.
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

    // Ensayo en Vercel: el sitio y el backend son dos proyectos distintos, así
    // que hay que nombrar al backend. Rellenar tras desplegarlo.
    if (/\.vercel\.app$/.test(host)) {
      return 'https://BACKEND-EN-VERCEL.vercel.app';
    }

    // Producción: nginx sirve el sitio y hace de proxy al backend bajo el mismo
    // origen, así que una ruta relativa basta y no hay CORS de por medio.
    return '';
  })();

  var ENDPOINT = API_BASE + '/api/public/site-config';
  var CLAVE_CACHE = 'coyote:site-config';
  var VIGENCIA_CACHE_MS = 5 * 60 * 1000;
  var TIEMPO_LIMITE_MS = 3000;

  /** Horario vigente antes de que existiera el panel: el respaldo de siempre. */
  var CONFIG_POR_DEFECTO = {
    schedule: {
      timezone: 'America/Santiago',
      days: {
        0: { open: '09:00', close: '13:00', closed: true },
        1: { open: '09:00', close: '17:00', closed: false },
        2: { open: '09:00', close: '17:00', closed: false },
        3: { open: '09:00', close: '17:00', closed: false },
        4: { open: '09:00', close: '17:00', closed: false },
        5: { open: '09:00', close: '17:00', closed: false },
        6: { open: '09:00', close: '13:00', closed: true }
      },
      exceptions: []
    },
    banner: { enabled: false, message: '', linkUrl: '', speed: 'normal' }
  };

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
  // Caché en sessionStorage
  //
  // Evita una petición por cada navegación del SPA. Todo va envuelto en
  // try/catch porque en modo incógnito el acceso puede lanzar excepción.
  // ======================================================================

  function leerCache() {
    try {
      var crudo = window.sessionStorage.getItem(CLAVE_CACHE);
      if (!crudo) return null;

      var guardado = JSON.parse(crudo);
      if (!guardado || Date.now() - guardado.t > VIGENCIA_CACHE_MS) return null;

      return guardado.v;
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

  // ======================================================================
  // Estado del módulo
  // ======================================================================

  var config = leerCache() || CONFIG_POR_DEFECTO;
  var esRespaldo = true;

  function normalizar(datos) {
    if (!datos || !datos.schedule || !datos.schedule.days) return null;

    return {
      schedule: {
        timezone: datos.schedule.timezone || 'America/Santiago',
        days: datos.schedule.days,
        exceptions: datos.schedule.exceptions || []
      },
      banner: datos.banner || CONFIG_POR_DEFECTO.banner
    };
  }

  function anunciarCambio() {
    window.dispatchEvent(
      new CustomEvent('siteconfig:ready', {
        detail: { config: config, esRespaldo: esRespaldo }
      })
    );
  }

  /**
   * Mantiene sincronizado el JSON-LD de Schema.org con el horario real.
   * Si no se actualizara, Google seguiría mostrando en los resultados de
   * búsqueda un horario que el taller ya cambió.
   */
  function actualizarDatosEstructurados() {
    var bloque = document.querySelector('script[type="application/ld+json"]');
    if (!bloque) return;

    try {
      var datos = JSON.parse(bloque.textContent);
      if (!datos.openingHoursSpecification) return;

      var nombresSchema = {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday'
      };

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
        grupos[clave].dayOfWeek.push(nombresSchema[dia]);
      }

      datos.openingHoursSpecification = especificaciones.map(function (spec) {
        return {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: spec.dayOfWeek,
          opens: spec.opens,
          closes: spec.closes
        };
      });

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

      if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);

      var normalizado = normalizar(await respuesta.json());
      if (!normalizado) throw new Error('Respuesta sin horario');

      config = normalizado;
      esRespaldo = false;
      escribirCache(normalizado);
    } catch (e) {
      // Silencio deliberado: el respaldo ya está en pantalla y una consola
      // llena de errores rojos no ayuda a nadie que visite el taller.
      if (window.console && window.console.info) {
        window.console.info('[Coyote] Horario servido desde el respaldo local.');
      }
    } finally {
      clearTimeout(temporizador);
      actualizarDatosEstructurados();
      anunciarCambio();
    }
  }

  // ======================================================================
  // API pública del módulo
  // ======================================================================

  window.CoyoteSiteConfig = {
    /** Configuración vigente (respaldo, caché o servidor). Nunca es null. */
    get: function () {
      return config;
    },

    getSchedule: function () {
      return config.schedule;
    },

    getBanner: function () {
      return config.banner;
    },

    /** Estado del taller en este instante. */
    getStatus: function () {
      return calcularEstado(config.schedule);
    },

    /** "Lun a Vie: 09:00 a 17:00 hrs" */
    getSummary: function () {
      return resumirHorario(config.schedule);
    },

    /** Desglose por grupos de días para la página de contacto. */
    getDetail: function () {
      return detalleHorario(config.schedule);
    },

    /** true mientras se muestren los valores por defecto. */
    isFallback: function () {
      return esRespaldo;
    },

    /** Ejecuta el callback ahora y de nuevo cuando lleguen los datos reales. */
    onReady: function (callback) {
      callback(config);
      window.addEventListener('siteconfig:ready', function () {
        callback(config);
      });
    }
  };

  cargar();
})();
