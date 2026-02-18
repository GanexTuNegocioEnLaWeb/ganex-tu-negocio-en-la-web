# Ganex - Tu Negocio en la Web

Sitio web corporativo de Ganex, desarrollado con Astro, Vue 3 y Tailwind CSS.

## Tabla de Contenidos

- [Ganex - Tu Negocio en la Web](#ganex---tu-negocio-en-la-web)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características](#características)
  - [Tecnologías](#tecnologías)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Desarrollo](#desarrollo)
  - [Contribuir](#contribuir)
    - [Flujo de Trabajo Rápido](#flujo-de-trabajo-rápido)
    - [Documentación](#documentación)
  - [Estructura del Proyecto](#estructura-del-proyecto)
  - [Scripts Disponibles](#scripts-disponibles)
  - [Convenciones de Código](#convenciones-de-código)
  - [Testing](#testing)
  - [Contacto](#contacto)

## Características

- Sitio multiidioma (Español/Inglés)
- Diseño responsive
- Optimizado para performance
- Componentes reutilizables con Vue 3
- Blog con Markdown
- SEO optimizado
- Integración con Supabase

## Tecnologías

- [Astro](https://astro.build) - Framework web
- [Vue 3](https://vuejs.org) - Framework de componentes
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [Supabase](https://supabase.com) - Backend as a Service
- [Vercel](https://vercel.com) - Hosting y deployment

## Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Git

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-org/ganex-tu-negocio-en-la-web.git
cd ganex-tu-negocio-en-la-web

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Configurar variables de entorno en .env
# PUBLIC_SUPABASE_URL=tu-url
# PUBLIC_SUPABASE_ANON_KEY=tu-key
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

El sitio estará disponible en `http://localhost:4321`

## Contribuir

¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](CONTRIBUTING.md) antes de empezar.

### Flujo de Trabajo Rápido

1. Crea una rama: `git checkout -b feature/mi-funcionalidad`
2. Haz tus cambios y commits: `git commit -m "feat: descripción"`
3. Push a tu rama: `git push origin feature/mi-funcionalidad`
4. Abre un Pull Request

### Documentación

- [Guía de Contribución](CONTRIBUTING.md) - Cómo contribuir al proyecto
- [Git Workflow](docs/GIT_WORKFLOW.md) - Guía completa de Git
- [PR Best Practices](docs/PR_BEST_PRACTICES.md) - Mejores prácticas para PRs

## Estructura del Proyecto

```
ganex-tu-negocio-en-la-web/
├── .github/                    # GitHub Actions y templates
│   ├── workflows/              # CI/CD workflows
│   ├── ISSUE_TEMPLATE/         # Templates para issues
│   └── pull_request_template.md
├── docs/                       # Documentación del proyecto
├── public/                     # Archivos estáticos
│   ├── images/                 # Imágenes
│   └── favicon.svg
├── src/
│   ├── assets/                 # Assets (CSS, SVG, etc.)
│   ├── components/             # Componentes reutilizables
│   │   ├── blocks/             # Bloques de contenido
│   │   ├── shared/             # Componentes compartidos
│   │   ├── Header.astro
│   │   └── Footer.astro
│   ├── content/                # Contenido (blog, i18n, pages)
│   │   ├── blog/               # Posts del blog
│   │   ├── i18n/               # Traducciones
│   │   └── pages/              # Contenido de páginas
│   ├── layouts/                # Layouts de página
│   └── pages/                  # Rutas de la aplicación
├── CONTRIBUTING.md             # Guía de contribución
├── package.json
└── README.md
```

## Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build para producción
npm run preview   # Preview del build
npm run astro     # CLI de Astro
```

## Convenciones de Código

- Componentes Astro/Vue: PascalCase (`Header.astro`, `Modal.vue`)
- Archivos JS/TS: camelCase (`utils.ts`, `api.ts`)
- Carpetas: kebab-case (`app-development/`, `digital-marketing/`)
- CSS: kebab-case (`.hero-section`, `.contact-form`)

## Testing

```bash
# Verificar TypeScript
npx astro check

# Build test
npm run build
```

## Contacto

- Website: [https://www.ganexbo.com](https://www.ganexbo.com)
- Email: oficial@ganexbo.com

---

Hecho con ❤️ por el equipo de Ganex
