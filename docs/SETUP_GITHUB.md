# 🔧 Configuración de GitHub

Guía para configurar el repositorio de GitHub con todas las herramientas necesarias.

## 📋 Checklist de Configuración

### 1. Configuración Básica del Repositorio

- [ ] Crear repositorio en GitHub
- [ ] Añadir descripción y topics
- [ ] Configurar rama principal como `main`
- [ ] Habilitar issues
- [ ] Habilitar discussions (opcional)

### 2. Protección de Ramas

Ve a: `Settings > Branches > Add branch protection rule`

**Para la rama `main`:**

- [ ] ✅ Require a pull request before merging
  - [ ] Require approvals: 1 (o más para equipos grandes)
  - [ ] Dismiss stale pull request approvals when new commits are pushed
- [ ] ✅ Require status checks to pass before merging
  - [ ] Require branches to be up to date before merging
  - [ ] Status checks: `Build Check`, `Commit Message Check`
- [ ] ✅ Require conversation resolution before merging
- [ ] ✅ Do not allow bypassing the above settings
- [ ] ⚠️ Allow force pushes: NO
- [ ] ⚠️ Allow deletions: NO

### 3. Configurar Labels

**Opción A: Manual**

Ve a: `Issues > Labels` y crea las siguientes:

| Label | Color | Descripción |
|-------|-------|-------------|
| bug | #d73a4a | Algo no funciona |
| enhancement | #a2eeef | Nueva funcionalidad |
| documentation | #0075ca | Documentación |
| good first issue | #7057ff | Para nuevos contribuidores |
| size/small | #c2e0c6 | PR < 200 líneas |
| size/medium | #f9d0c4 | PR 200-500 líneas |
| size/large | #ee0701 | PR > 500 líneas |

Ver lista completa en `.github/labels.json`

**Opción B: Automática con GitHub CLI**

```bash
# Instalar GitHub CLI si no lo tienes
# https://cli.github.com/

# Autenticarse
gh auth login

# Aplicar labels desde el archivo JSON
gh label create --repo tu-org/tu-repo --file .github/labels.json
```

### 4. Configurar Secrets

Ve a: `Settings > Secrets and variables > Actions`

Añade los siguientes secrets:

- [ ] `PUBLIC_SUPABASE_URL` - URL de Supabase
- [ ] `PUBLIC_SUPABASE_ANON_KEY` - Key anónima de Supabase

### 5. Configurar CODEOWNERS

Edita `.github/CODEOWNERS` y reemplaza `@tu-usuario-github` con:

```
# Ejemplo para un equipo
* @team-lead @senior-dev

# Ejemplo para usuarios individuales
* @usuario1 @usuario2

# Ejemplo para equipos de GitHub
* @tu-org/frontend-team
```

### 6. Habilitar GitHub Actions

- [ ] Ve a `Settings > Actions > General`
- [ ] Selecciona "Allow all actions and reusable workflows"
- [ ] En "Workflow permissions", selecciona "Read and write permissions"
- [ ] ✅ Allow GitHub Actions to create and approve pull requests

### 7. Configurar Notificaciones

**Para el equipo:**

Ve a: `Settings > Notifications`

Recomendaciones:
- [ ] Habilitar notificaciones para PRs asignados
- [ ] Habilitar notificaciones para menciones
- [ ] Habilitar notificaciones para reviews solicitadas

### 8. Configurar Vercel (Deployment)

1. Ve a [vercel.com](https://vercel.com)
2. Importa el repositorio
3. Configura variables de entorno:
   - `PUBLIC_SUPABASE_URL`
   - `PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

**Configurar Preview Deployments:**

- [ ] Habilitar preview deployments para PRs
- [ ] Añadir comentarios automáticos en PRs con link al preview

## 🤖 GitHub Actions Incluidas

### CI Workflow (`.github/workflows/ci.yml`)

Se ejecuta en cada PR y push a `main`:

- ✅ Build check - Verifica que el código compila
- ✅ PR size check - Analiza tamaño del PR
- ✅ Commit lint - Verifica formato de commits
- ✅ File check - Detecta cambios en archivos sensibles

### PR Labeler (`.github/workflows/pr-labeler.yml`)

Añade labels automáticamente basándose en:
- Archivos modificados
- Título del PR
- Tamaño del PR

## 📝 Templates Incluidos

### Pull Request Template

Ubicación: `.github/pull_request_template.md`

Se muestra automáticamente al crear un PR.

### Issue Templates

Ubicación: `.github/ISSUE_TEMPLATE/`

- `bug_report.md` - Para reportar bugs
- `feature_request.md` - Para solicitar funcionalidades

## 🔐 Permisos del Equipo

Ve a: `Settings > Collaborators and teams`

**Roles recomendados:**

| Rol | Permisos | Para quién |
|-----|----------|------------|
| Admin | Todo | Tech Lead, Project Manager |
| Maintain | Gestionar issues, PRs | Senior Developers |
| Write | Push, crear PRs | Developers |
| Triage | Gestionar issues | Junior Developers, Trainees |
| Read | Solo lectura | Stakeholders |

## 🎯 Configuración Recomendada para el Equipo

### Para Seniors/Tech Leads

```bash
# Configurar Git globalmente
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Configurar editor por defecto
git config --global core.editor "code --wait"

# Habilitar colores
git config --global color.ui auto

# Configurar aliases útiles
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.lg "log --oneline --graph --all"
```

### Para Trainees

```bash
# Configuración básica
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

# Configurar para que siempre haga pull con rebase
git config --global pull.rebase true

# Evitar commits accidentales en main
git config --global branch.main.pushRemote no_push
```

## 📊 Métricas y Monitoreo

### Insights Útiles

Ve a: `Insights` en GitHub

- **Pulse**: Actividad reciente
- **Contributors**: Contribuciones por persona
- **Traffic**: Visitas al repo
- **Network**: Gráfico de ramas

### Code Review Metrics

Monitorea:
- Tiempo promedio de revisión
- Número de comentarios por PR
- Tasa de aprobación en primer intento
- Tamaño promedio de PRs

## 🚨 Troubleshooting

### GitHub Actions no se ejecutan

1. Verifica que Actions esté habilitado
2. Revisa permisos de workflow
3. Verifica que los archivos YAML sean válidos

### Labels no se aplican automáticamente

1. Verifica que el workflow `pr-labeler.yml` esté activo
2. Revisa que los labels existan en el repo
3. Verifica permisos del workflow

### CODEOWNERS no funciona

1. Verifica que el archivo esté en `.github/CODEOWNERS`
2. Verifica que los usuarios/equipos existan
3. Verifica protección de ramas

## 📚 Recursos

- [GitHub Docs](https://docs.github.com)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

## ✅ Verificación Final

Después de configurar todo:

- [ ] Crear un PR de prueba
- [ ] Verificar que los checks se ejecutan
- [ ] Verificar que las labels se aplican
- [ ] Verificar que CODEOWNERS funciona
- [ ] Verificar que el template del PR aparece
- [ ] Verificar que no se puede hacer push directo a main
- [ ] Verificar que el preview deployment funciona

---

¡Configuración completa! Tu repositorio está listo para trabajo en equipo. 🎉
