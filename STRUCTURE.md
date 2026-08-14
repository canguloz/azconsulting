# STRUCTURE.md — Mapa del repositorio

Mapa técnico del sitio [AZCONSULTING](https://azconsultingperu.com) para quien lo mantiene o desarrolla. Para saber qué es el sitio y qué contiene, ver el [README.md](README.md).

## Árbol general

```
├── index.html                     Portada: hero, servicios, stack, cobertura, planes, testimonios, FAQ, contacto
├── 404.html                       Página de error 404
├── manifest.json                  Manifiesto PWA (nombre, colores, iconos, atajos)
├── service-worker.js              Service worker PWA (precache + estrategia de caché, v6)
├── sitemap.xml                    Sitemap de todas las páginas (home, 9 blogs, 8 servicios)
├── robots.txt                     Permite todo, excluye /workers/ y /docs/, apunta al sitemap
├── CNAME                          Dominio azconsultingperu.com (despliegue)
├── SEO_AUDIT.md                   Auditoría SEO histórica (2026-07)
├── blog/                          Artículos del blog
├── servicios/                     Página por servicio (8 carpetas, cada una con index.html)
├── assets/                        Recursos del sitio principal
├── workers/                       Cloudflare Worker del chatbot
├── docs/                          Guías internas (EmailJS)
└── .vscode/                       Configuración local de VS Code
```

## Dónde se edita cada contenido

| Contenido | Archivo(s) |
| --- | --- |
| Hero, servicios, stack, cobertura, planes, testimonios, FAQ, contacto | `index.html` |
| Textos y estructura de los artículos del blog | `blog/blog-<tema>.html` |
| Página de cada servicio | `servicios/<servicio>/index.html` |
| Página 404 | `404.html` |
| Sitemap (nuevas páginas o artículos) | `sitemap.xml` |
| Datos de la PWA (nombre, iconos, colores, atajos) | `manifest.json` |
| Lista de recursos precacheados (nuevos artículos) | `service-worker.js` (constante `PRECACHE_URLS`) |

## Estilos y scripts

- `assets/css/styles.css` — estilos de la portada y páginas de servicios.
- `blog/assets/css/blog.css` — estilos de los artículos del blog (accordions FAQ, heroes, fondos).
- `assets/js/main.js` — lógica principal de la portada.
- `assets/js/enhancements.js` — mejoras de interacción y animaciones.
- `assets/js/azchat-proxy.js` — cliente del chatbot (apunta a la URL del Cloudflare Worker).
- `blog/assets/js/chatbot.js` — variante del chatbot para los artículos del blog.
- `assets/vendor/aos/` — librería AOS (animaciones al hacer scroll) copiada localmente.

## Chatbot (chat inteligente)

El chatbot funciona con un Cloudflare Worker con RAG + fallback:

- `workers/azchat-proxy.js` — código del Worker: chunks de contexto (servicios, planes, blog), rate limit, respuestas con IA y mensaje de respaldo. Se despliega pegando el código en Cloudflare Workers y definiendo las variables `GROQ_API_KEY` y `MISTRAL_API_KEY` en la configuración del Worker.
- Al añadir un artículo al blog, sus chunks RAG se agregan al array `CHUNKS` del Worker y su URL al `PRECACHE_URLS` del `service-worker.js`.

## Recursos multimedia

- `assets/img/` — imágenes de la portada, organizadas en subcarpetas por formato: `avif/`, `webp/`, `jpg/`, `jpeg/`, `png/`, `ico/` y `socios/` (logos de socios: AWS, Google, Microsoft, Cisco, Dell, Oracle, Amazon).
- `blog/assets/img/` — fondos de los artículos en `avif/`, `webp/` y `jpg/`.
- Las imágenes se sirven con `picture` + `<source>` en AVIF/WebP y fallback a JPG/PNG; las rutas son relativas al origen.

## Otros

- `docs/emailjs-setup.md` — guía de configuración de EmailJS para el formulario de contacto (templates `template_cliente` y `template_empresa`).
- `robots.txt` excluye `workers/` y `docs/` del rastreo.
