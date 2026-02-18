# Guía de Contribución

¡Gracias por tu interés en contribuir a Ganex! Esta guía te ayudará a hacer contribuciones efectivas, sin importar tu nivel de experiencia.

## Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Primeros Pasos](#primeros-pasos)
- [Flujo de Trabajo](#flujo-de-trabajo)
- [Estándares de Código](#estándares-de-código)
- [Commits y Pull Requests](#commits-y-pull-requests)
- [Revisión de Código](#revisión-de-código)

## Código de Conducta

- Sé respetuoso y profesional
- Acepta críticas constructivas
- Enfócate en lo mejor para el proyecto
- Ayuda a otros miembros del equipo

## Primeros Pasos

### Requisitos Previos

- Node.js 18+ instalado
- Git configurado
- Editor de código (recomendado: VS Code)

### Configuración Inicial

```bash
# 1. Clona el repositorio
git clone https://github.com/tu-org/ganex-tu-negocio-en-la-web.git
cd ganex-tu-negocio-en-la-web

# 2. Instala dependencias
npm install

# 3. Copia el archivo de variables de entorno
cp .env.example .env

# 4. Inicia el servidor de desarrollo
npm run dev
```

## Flujo de Trabajo

### 1. Crear una Rama

Siempre trabaja en una rama nueva. Nunca hagas commits directamente a `main`.

```bash
# Actualiza main
git checkout main
git pull origin main

# Crea tu rama con un nombre descriptivo
git checkout -b tipo/descripcion-corta
```

**Tipos de ramas:**

- `feature/` - Nueva funcionalidad
- `fix/` - Corrección de bugs
- `docs/` - Cambios en documentación
- `refactor/` - Refactorización de código
- `style/` - Cambios de estilos/formato
- `test/` - Añadir o modificar tests

**Ejemplos:**

```bash
git checkout -b feature/add-contact-form
git checkout -b fix/header-mobile-menu
git checkout -b docs/update-readme
```

### 2. Hacer Cambios

- Haz commits pequeños y frecuentes
- Cada commit debe tener un propósito claro
- Prueba tus cambios localmente

```bash
# Verifica qué archivos cambiaron
git status

# Añade los archivos modificados
git add src/components/Header.astro

# Haz commit con un mensaje descriptivo
git commit -m "fix: corregir menú móvil en Header"
```

### 3. Mantén tu Rama Actualizada

```bash
# Obtén los últimos cambios de main
git checkout main
git pull origin main

# Vuelve a tu rama
git checkout tu-rama

# Integra los cambios (rebase es preferido)
git rebase main

# Si hay conflictos, resuélvelos y continúa
git add .
git rebase --continue
```

### 4. Subir Cambios

```bash
# Primera vez
git push origin tu-rama

# Si hiciste rebase
git push origin tu-rama --force-with-lease
```

## Estándares de Código

### Estructura de Archivos

```
src/
├── components/     # Componentes reutilizables
├── layouts/        # Layouts de página
├── pages/          # Páginas de la aplicación
├── content/        # Contenido (blog, i18n)
└── assets/         # Recursos estáticos
```

### Convenciones de Nombres

- **Componentes Astro/Vue**: PascalCase (`Header.astro`, `BookingModal.vue`)
- **Archivos JS/TS**: camelCase (`utils.ts`, `apiClient.ts`)
- **Carpetas**: kebab-case (`app-development/`, `digital-marketing/`)
- **CSS**: kebab-case (`.hero-section`, `.contact-form`)

### Estilo de Código

```astro
---
// BIEN: Imports organizados
import Layout from '@/layouts/Layout.astro';
import Header from '@/components/Header.astro';
import { getCollection } from 'astro:content';

// Variables con nombres descriptivos
const blogPosts = await getCollection('blog');
const title = 'Mi Página';
---

<!-- HTML semántico e indentado -->
<Layout title={title}>
  <Header />
  <main class="container mx-auto">
    <h1 class="text-3xl font-bold">{title}</h1>
  </main>
</Layout>
```

```vue
<script setup>
// BIEN: Composables y props claros
import { ref, computed } from "vue";

const props = defineProps({
  title: String,
  isOpen: Boolean,
});

const emit = defineEmits(["close", "submit"]);

const formData = ref({
  name: "",
  email: "",
});
</script>

<template>
  <div class="modal">
    <h2>{{ title }}</h2>
    <!-- Contenido del modal -->
  </div>
</template>
```

### Tailwind CSS

```html
<!-- BIEN: Clases ordenadas (layout → spacing → typography → colors) -->
<div class="flex items-center gap-4 p-6 text-lg font-semibold text-gray-900">
  <!-- ❌ MAL: Clases desordenadas -->
  <div
    class="text-gray-900 flex p-6 font-semibold items-center text-lg gap-4"
  ></div>
</div>
```

## Commits y Pull Requests

### Formato de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(scope): descripción corta

Descripción más detallada si es necesario.

Fixes #123
```

**Tipos:**

- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, punto y coma faltantes, etc.
- `refactor`: Refactorización de código
- `test`: Añadir tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**

```bash
feat(contact): añadir formulario de contacto
fix(header): corregir menú móvil que no cerraba
docs(readme): actualizar instrucciones de instalación
refactor(api): simplificar llamadas a Supabase
style(home): ajustar espaciado en hero section
```

### Crear un Pull Request

1. **Título Descriptivo**

   ```
   feat: Añadir formulario de contacto con validación
   fix: Corregir error en menú móvil del header
   ```

2. **Descripción Completa**

   Usa esta plantilla:

   ```markdown
   ## Descripción

   Breve descripción de qué hace este PR.

   ## Tipo de Cambio

   - [ ] 🐛 Bug fix
   - [ ] ✨ Nueva funcionalidad
   - [ ] 📝 Documentación
   - [ ] 🎨 Estilos
   - [ ] ♻️ Refactorización

   ## ¿Cómo se ha probado?

   - [ ] Probado en desarrollo local
   - [ ] Probado en diferentes navegadores
   - [ ] Probado en móvil

   ## Screenshots (si aplica)

   [Añade capturas de pantalla]

   ## Checklist

   - [ ] Mi código sigue los estándares del proyecto
   - [ ] He revisado mi propio código
   - [ ] He comentado código complejo
   - [ ] He actualizado la documentación
   - [ ] Mis cambios no generan warnings
   - [ ] He probado en local que todo funciona

   ## Issues Relacionados

   Closes #123
   ```

3. **Tamaño del PR**
   - ✅ Pequeño: 1-200 líneas (ideal)
   - ⚠️ Mediano: 200-500 líneas (aceptable)
   - ❌ Grande: 500+ líneas (dividir en PRs más pequeños)

## Revisión de Código

### Para el Autor

- Revisa tu propio código antes de pedir revisión
- Responde a todos los comentarios
- No tomes las críticas como algo personal
- Haz los cambios solicitados o explica por qué no

### Para el Revisor

- Sé constructivo y específico
- Explica el "por qué" de tus sugerencias
- Aprueba cuando esté listo, no busques perfección
- Usa estos prefijos en comentarios:
  - `[BLOCKER]` - Debe corregirse antes de merge
  - `[SUGERENCIA]` - Opcional, pero recomendado
  - `[PREGUNTA]` - Necesito clarificación
  - `[NITPICK]` - Detalle menor, no bloqueante

**Ejemplo de buen comentario:**

```
[SUGERENCIA] Considera usar `computed` en lugar de `ref` aquí,
ya que este valor se deriva de otros. Esto hace el código más
declarativo y evita actualizaciones manuales.
```

## ¿Necesitas Ayuda?

- **Trainee/Junior**: No dudes en preguntar. Todos empezamos así.
- **Dudas técnicas**: Abre un issue con la etiqueta `question`
- **Problemas con Git**: Pide ayuda antes de forzar cambios
- **Code review**: Si no entiendes un comentario, pregunta

## Recursos Útiles

- [Documentación de Astro](https://docs.astro.build)
- [Documentación de Vue 3](https://vuejs.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

---

¡Gracias por contribuir!
