# CHANGELOG

## [2026-09-29]

### Corregido (modo oscuro)

- Caja CTA del blog: el selector dark no matcheaba `background: #ffffff` (con espacio); ahora cubre variantes con/sin espacio y `#fff`/`#ffffff`.
- Navbar en scroll y `hero-team-card`: overrides dark con `!important` espejo para que ganen al fondo claro (afectaba móvil/tablet).
- Regla dark genérica `body.dark-mode .card` (antes atada a `.container .card.border-0`).
- Bloque dark para contenido editorial (`table`, `code`/`pre`, `blockquote`, `.blog-cta`) y fondo dark para `#mapFacade`.
- Snippet anti-destello en los 9 artículos del blog y soporte de tema (toggle + estilos) en `404.html`.

### Agregado (rendimiento y accesibilidad, reporte PageSpeed 2026-09-29)

- Variantes responsive 360w/720w (AVIF/WebP + fallback JPG) de fotos del equipo y `about`, con `srcset`/`sizes` en portada.
- Logos en WebP (`<picture>` + `width`/`height` explícitos) en navbar, loader y footer de las 18 páginas.
- AOS CSS diferido (preload + `media=print` + `noscript`); guard anti-CDN en carga de `tsparticles`.
- Reflows agrupados en `main.js`/`enhancements.js` (lectura antes de mutar DOM, scroll por frame).
- Token `--accent-strong` para contraste AA en ambos temas (badges, links, botones, títulos) y encabezados re-nivelados sin saltos (`h1` único).
- No minificado `main.js` (sin toolchain en el repo; ahorro marginal de 2,3 KiB).

## [2026-08-14]

### Agregado

- Documentación del repositorio: `README.md` (ficha descriptiva del sitio y de AZCONSULTING), `STRUCTURE.md` (mapa técnico para mantenimiento) y este `CHANGELOG.md`.
