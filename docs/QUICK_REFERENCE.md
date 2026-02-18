# ⚡ Guía Rápida de Referencia

Comandos y flujos más comunes para el día a día.

## 🚀 Inicio Rápido

```bash
# Configuración inicial (solo primera vez)
git clone <repo-url>
cd ganex-tu-negocio-en-la-web
npm install
cp .env.example .env
npm run dev

# Día a día
git checkout main
git pull origin main
git checkout -b feature/mi-tarea
# ... hacer cambios ...
git add .
git commit -m "feat: descripción"
git push origin feature/mi-tarea
# Crear PR en GitHub
```

## 📝 Formato de Commits

```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: formato, estilos CSS
refactor: refactorización de código
test: añadir tests
chore: tareas de mantenimiento
```

## 🌿 Comandos Git Esenciales

```bash
# Ver estado
git status
git log --oneline

# Crear y cambiar rama
git checkout -b feature/nombre

# Guardar cambios
git add .
git commit -m "tipo: mensaje"

# Subir cambios
git push origin nombre-rama

# Actualizar rama
git checkout main
git pull origin main
git checkout tu-rama
git rebase main

# Deshacer cambios
git checkout -- archivo.txt        # Descartar cambios
git reset HEAD archivo.txt         # Quitar de staging
git reset --soft HEAD~1            # Deshacer último commit

# Guardar temporalmente
git stash                          # Guardar
git stash pop                      # Recuperar
```

## 🔥 Resolver Conflictos

```bash
# 1. Actualizar rama
git checkout main
git pull origin main
git checkout tu-rama
git rebase main

# 2. Si hay conflictos
# - Abre archivos con conflictos
# - Edita y elimina marcas <<<<, ====, >>>>
# - Guarda archivos

# 3. Continuar
git add .
git rebase --continue

# 4. Subir cambios
git push origin tu-rama --force-with-lease
```

## 📋 Checklist Pre-PR

```bash
# 1. Probar localmente
npm run dev

# 2. Verificar build
npm run build
npm run preview

# 3. Revisar cambios
git diff main...tu-rama

# 4. Actualizar rama
git rebase main

# 5. Verificar commits
git log --oneline

# 6. Push
git push origin tu-rama
```

## 🎯 Tamaños de PR

- 🟢 Pequeño: < 200 líneas (ideal)
- 🟡 Mediano: 200-500 líneas (ok)
- 🔴 Grande: > 500 líneas (dividir)

## 👀 Prefijos en Code Review

```
[BLOCKER]     - Debe corregirse
[SUGERENCIA]  - Recomendado
[PREGUNTA]    - Necesito clarificación
[NITPICK]     - Detalle menor
```

## 🆘 Comandos de Emergencia

```bash
# Ver historial completo
git reflog

# Volver a estado anterior
git reset --hard HEAD@{n}

# Descartar TODO (⚠️ cuidado)
git reset --hard HEAD
git clean -fd

# Cambiar último commit
git commit --amend -m "nuevo mensaje"

# Aplicar commit de otra rama
git cherry-pick <commit-hash>
```

## 📁 Estructura de Archivos

```
src/
├── components/
│   ├── blocks/          # Bloques de contenido
│   ├── shared/          # Componentes compartidos
│   ├── Header.astro
│   └── Footer.astro
├── content/
│   ├── blog/            # Posts
│   ├── i18n/            # Traducciones
│   └── pages/           # Contenido páginas
├── layouts/             # Layouts
└── pages/               # Rutas
```

## 🎨 Convenciones de Nombres

```
Componentes:    PascalCase    Header.astro, Modal.vue
Archivos JS:    camelCase     utils.ts, apiClient.ts
Carpetas:       kebab-case    app-development/
CSS:            kebab-case    .hero-section
```

## 🔗 Links Útiles

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guía completa
- [GIT_WORKFLOW.md](./GIT_WORKFLOW.md) - Git en detalle
- [PR_BEST_PRACTICES.md](./PR_BEST_PRACTICES.md) - PRs en detalle

## 💡 Tips Rápidos

- Commits pequeños y frecuentes
- PRs pequeños (< 200 líneas)
- Actualiza tu rama diariamente
- Revisa tu propio código antes del PR
- Usa nombres descriptivos
- Añade screenshots en PRs visuales
- Responde a comentarios de revisión
- Pregunta si tienes dudas

## 🎓 Para Trainees

**Tu primer día:**
1. Clona el repo
2. Instala dependencias
3. Corre `npm run dev`
4. Lee CONTRIBUTING.md
5. Haz un PR pequeño (fix typo, actualizar docs)

**Preguntas comunes:**
- "¿En qué rama trabajo?" → Crea una nueva desde main
- "¿Cómo subo cambios?" → `git push origin tu-rama`
- "¿Cuándo crear PR?" → Cuando tu código funciona y está probado
- "¿Qué hago con conflictos?" → Ver sección "Resolver Conflictos"

## 📞 ¿Necesitas Ayuda?

1. Revisa esta guía
2. Lee la documentación completa
3. Pregunta al equipo
4. Abre un issue con label `question`

---

**Recuerda:** Es mejor preguntar que romper algo. ¡Todos estamos aquí para ayudar! 🚀
