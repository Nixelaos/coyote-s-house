# Coyote's House 🐺🏍️

> **Plataforma web integral para taller mecánico de motocicletas.**  
> Combina un sitio web estático para clientes con un backend headless ligero y panel de administración en tiempo real.

---

## ⚡ En 1 Minuto

### 1. ¿Qué hace y qué problema resuelve?
* **El problema:** La mayoría de los sitios web de talleres mecánicos son páginas estáticas con horarios desactualizados (feriados no reflejados, avisos urgentes inexistentes) o dependen de CMS pesados (como WordPress) que encarecen el hosting, son lentos y requieren constante mantenimiento de seguridad y bases de datos.
* **La solución:** **Coyote's House** desacopla la experiencia:
  1. Un **sitio web estático para clientes** con máxima velocidad de carga (SEO local optimizado para Macul/Santiago, cotizador interactivo por WhatsApp, catálogo de servicios y casos reales).
  2. Un **backend administrativo minimalista** que permite al dueño del taller modificar horarios de atención, excepciones por feriados y publicar banners de anuncios de emergencia en tiempo real desde su celular mediante Google OAuth, **sin tocar código ni redesplegar el sitio**.

---

## 🏗️ Stack y Arquitectura

```
                        ┌────────────────────────────────────────────────────────┐
                        │                     Arquitectura                       │
                        └────────────────────────────────────────────────────────┘

  [ Cliente / Navegador ]                                       [ Administrador ]
             │                                                          │
             ├─────────────► [ Frontend Estático ]                      │
             │               HTML5 · CSS3 · ES6 Vanilla                 │
             │               (Cacheado en Cloudflare / Nginx)           │
             │                                                          │
             │  GET /api/public/site-config                             │  Login Google OAuth 2.0
             └───────────────────────┬────────────────────────┐         │
                                     ▼                        ▼         ▼
                       [ Backend Fastify :3000 ] ◄────── [ Panel /admin/ ]
                                     │
                                     ▼
                       [ Almacenamiento Atómico ]
                       data/schedule.json  ·  data/banner.json
```

### Tecnologías principales
* **Frontend:** HTML5 semántico, CSS3 modular (tokens de diseño, responsive, animaciones CSS puras), JavaScript modular (ES6 Vanilla) estructurado en componentes web sin frameworks ni dependencias de construcción (*buildless*).
* **Backend:** Node.js (>=20.11), **Fastify 5** (servidor HTTP de alto rendimiento y bajo consumo).
* **Seguridad & Auth:** **Google OAuth 2.0** con verificación de lista blanca en memoria (`ADMIN_ALLOWED_EMAILS`), `@fastify/jwt` en cookies HttpOnly/Secure, `@fastify/helmet` (políticas CSP estrictas) y `@fastify/rate-limit`.

### Decisiones técnicas clave

| Decisión | Enfoque elegido | ¿Por qué no otra alternativa? |
|---|---|---|
| **Almacenamiento** | **Archivos JSON atómicos locales** (`schedule.json`, `banner.json`) | El dominio de datos es diminuto (1 horario y 1 banner). Integrar PostgreSQL o MongoDB añade latencia de red, costo y mantenimiento de migraciones. Se implementó una cola de escritura con renombrado atómico (`fs.rename` sobre `.tmp`), garantizando integridad total y lecturas en microsegundos. |
| **Arquitectura** | **Frontend Estático + API Headless** | Permite que el sitio público viva 100% cacheado en Nginx/Cloudflare CDN. Si el backend se detuviera por mantenimiento, el sitio sigue funcionando con degradación elegante (*graceful fallback*): simplemente oculta el banner sin romperse. |
| **Cálculo de Horario** | **Procesamiento en el Cliente (Browser)** | El backend entrega el horario semanal crudo (`America/Santiago`); el navegador evalúa el estado *"Abierto hoy hasta las 17:00"* con su reloj local. Así, una pestaña abierta cambia su estado dinámicamente sin saturar la API con polling constante. |
| **Autenticación** | **Google OAuth 2.0 + Whitelist** | Elimina el riesgo de filtraciones de credenciales: no se guardan contraseñas ni tablas de usuarios. Solo correos autorizados pueden operar el panel. |

---

## 📁 Estructura del Repositorio

```text
coyoteshouse/
├── coyote-s-house/                  # 🌐 FRONTEND PÚBLICO
│   ├── index.html                   # Página principal (SEO y Schema.org)
│   ├── servicios.html               # Catálogo de mantenciones y scanner
│   ├── cotizador.html               # Cotizador interactivo guiado
│   ├── caso-ajuste-motor.html       # Caso de estudio técnico con evidencia fotográfica
│   ├── resenas.html, contacto.html  # Reseñas verificadas, mapa y FAQ
│   ├── css/                         # Sistema de diseño, layout y componentes
│   └── js/
│       ├── components/              # Componentes de UI (cotizador, banner, reseñas, etc.)
│       └── lib/site-config.js       # Consumo de la API y renderizado dinámico de estado
│
└── backend-coyote-s-house/          # ⚙️ BACKEND & PANEL ADMIN
    ├── src/
    │   ├── server.js                # Punto de entrada y manejo de errores
    │   ├── plugins/                 # Plugins de Auth (Google/JWT) y Seguridad (Helmet/Rate-limit)
    │   ├── routes/                  # /api/public, /auth, /api/admin
    │   ├── repositories/            # Almacenamiento JSON con escrituras atómicas en cola
    │   └── schemas/                 # Validación estricta con JSON Schema
    ├── public/admin/                # Panel de administración web (SPA Vanilla)
    └── data/                        # Persistencia local (schedule.json y banner.json)
```

---

## 🚀 Cómo Ejecutarlo Localmente

### Prerrequisitos
* **Node.js** >= 20.11
* **Python 3** (o extensión *Live Server* de VS Code / `http-server`)

---

### Paso 1: Iniciar el Backend

1. Entra a la carpeta del backend e instala las dependencias:
   ```bash
   cd backend-coyote-s-house
   npm install
   ```

2. Configura las variables de entorno:
   ```bash
   cp .env.example .env
   ```
   > *Nota: Para pruebas locales de la API no requieres credenciales de Google obligatorias (el panel mostrará aviso de credenciales ausentes pero el endpoint público funcionará).*

3. Ejecuta el servidor en modo desarrollo:
   ```bash
   npm run dev
   ```

* **API Pública:** <http://localhost:3000/api/public/site-config>  
* **Panel de Administración:** <http://localhost:3000/admin/>  
* **Health Check:** <http://localhost:3000/health>

---

### Paso 2: Iniciar el Frontend

En una **segunda terminal**, corre un servidor estático para el cliente:

```bash
cd coyote-s-house
python -m http.server 5500
```

Abre en tu navegador:
👉 <http://localhost:5500/>

> El frontend en `localhost` detecta automáticamente el entorno y consulta los datos a `http://localhost:3000`.

---

## 🧪 Pruebas y Validación

El backend cuenta con una suite de pruebas de paridad matemática entre la lógica del servidor y la lógica del navegador:

```bash
cd backend-coyote-s-house
npm test
```

* **`api.test.mjs`:** Validación de endpoints, control de acceso RBAC, códigos HTTP ante archivos ausentes o dañados.
* **`paridad.test.mjs`:** Ejecuta más de **2.300 comparaciones algorítmicas** barriendo días y semanas completas para asegurar que el cálculo de horario del backend y el del cliente nunca discrepen.

---

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Desarrollado para **Coyote's House - Taller Mecánico de Motocicletas**.
