/**
 * Bundle CSS Script para Coyote's House
 * Concatena los módulos CSS en css/styles.css para eliminar la cascada de 18 @import
 * y lograr 1 solo roundtrip de red con 0ms de bloqueo y renderizado instantáneo.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootCssDir = path.join(__dirname, '..', 'css');

const cssFiles = [
  'variables.css',
  'base.css',
  'typography.css',
  'components/buttons.css',
  'components/announcement-banner.css',
  'components/topbar.css',
  'components/header.css',
  'components/placeholders.css',
  'components/floating-whatsapp.css',
  'components/footer.css',
  'sections/hero.css',
  'sections/features.css',
  'sections/services.css',
  'sections/about.css',
  'sections/cotizador.css',
  'sections/gallery.css',
  'sections/reviews.css',
  'sections/faq.css',
  'sections/contact.css',
  'responsive.css'
];

let bundledContent = `/* ==========================================================================
   COYOTE'S HOUSE - MASTER BUNDLED STYLESHEET
   Generado para alto rendimiento (1 solo round-trip HTTP, 0 bloqueos @import)
   ========================================================================== */\n\n`;

for (const relPath of cssFiles) {
  const fullPath = path.join(rootCssDir, relPath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    bundledContent += `/* --- File: ${relPath} --- */\n${content}\n\n`;
  } else {
    console.warn(`[bundle-css] Archivo no encontrado: ${fullPath}`);
  }
}

// Guardar copia de respaldo de imports para desarrollo
const importsPath = path.join(rootCssDir, 'styles.imports.css');
if (!fs.existsSync(importsPath)) {
  const currentStyles = fs.readFileSync(path.join(rootCssDir, 'styles.css'), 'utf8');
  fs.writeFileSync(importsPath, currentStyles, 'utf8');
}

// Escribir el nuevo styles.css compilado
const targetPath = path.join(rootCssDir, 'styles.css');
fs.writeFileSync(targetPath, bundledContent, 'utf8');

console.log(`[bundle-css] Compilación exitosa en ${targetPath} (${bundledContent.length} bytes)`);
