# 🌿 Guía de Git Workflow

Esta guía explica el flujo de trabajo con Git para el proyecto, desde lo más básico hasta situaciones avanzadas.

## 📚 Índice

- [Conceptos Básicos](#conceptos-básicos)
- [Flujo de Trabajo Diario](#flujo-de-trabajo-diario)
- [Comandos Esenciales](#comandos-esenciales)
- [Resolución de Conflictos](#resolución-de-conflictos)
- [Situaciones Comunes](#situaciones-comunes)
- [Buenas Prácticas](#buenas-prácticas)

## 🎓 Conceptos Básicos

### ¿Qué es una rama (branch)?

Una rama es una línea de desarrollo independiente. Piensa en ella como una copia del código donde puedes hacer cambios sin afectar el código principal.

```
main (producción)
  |
  |--- feature/nueva-funcionalidad (tu trabajo)
  |
  |--- fix/corregir-bug (trabajo de otro)
```

### Ramas Principales

- **main**: Código en producción, siempre debe estar estable
- **develop**: Código en desarrollo (opcional, según el equipo)
- **feature/**: Nuevas funcionalidades
- **fix/**: Correcciones de bugs
- **hotfix/**: Correcciones urgentes en producción

## 🔄 Flujo de Trabajo Diario

### 1. Comenzar el Día

```bash
# Asegúrate de estar en main
git checkout main

# Obtén los últimos cambios
git pull origin main

# Verifica en qué rama estás
git branch
```

### 2. Crear una Nueva Rama

```bash
# Crea y cambia a una nueva rama
git checkout -b feature/mi-nueva-funcionalidad

# Verifica que estás en la rama correcta
git branch
# * feature/mi-nueva-funcionalidad  <- el asterisco indica tu rama actual
#   main
```

### 3. Hacer Cambios

```bash
# Trabaja en tu código...
# Guarda los archivos en tu editor

# Ver qué archivos cambiaron
git status

# Ver los cambios específicos
git diff
```

### 4. Guardar Cambios (Commit)

```bash
# Añadir archivos específicos
git add src/components/Header.astro
git add src/components/Footer.astro

# O añadir todos los archivos modificados
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat(header): añadir menú de navegación responsive"

# Ver el historial de commits
git log --oneline
```

### 5. Subir Cambios al Repositorio

```bash
# Primera vez que subes la rama
git push origin feature/mi-nueva-funcionalidad

# Las siguientes veces
git push
```

### 6. Crear Pull Request

1. Ve a GitHub
2. Verás un botón "Compare & pull request"
3. Completa la plantilla del PR
4. Asigna revisores
5. Espera feedback

### 7. Después del Merge

```bash
# Vuelve a main
git checkout main

# Actualiza main con los cambios mergeados
git pull origin main

# Elimina tu rama local (ya está en main)
git branch -d feature/mi-nueva-funcionalidad

# Elimina la rama remota (opcional, GitHub lo hace automáticamente)
git push origin --delete feature/mi-nueva-funcionalidad
```

## 🛠️ Comandos Esenciales

### Ver Estado

```bash
# Estado actual (archivos modificados, staged, etc.)
git status

# Historial de commits
git log --oneline --graph --all

# Ver ramas
git branch -a
```

### Trabajar con Ramas

```bash
# Crear rama
git branch nombre-rama

# Cambiar de rama
git checkout nombre-rama

# Crear y cambiar en un solo comando
git checkout -b nombre-rama

# Eliminar rama local
git branch -d nombre-rama

# Eliminar rama remota
git push origin --delete nombre-rama
```

### Actualizar tu Código

```bash
# Obtener cambios sin aplicarlos
git fetch origin

# Obtener y aplicar cambios
git pull origin main

# Rebase (alternativa a merge, mantiene historial limpio)
git rebase main
```

### Deshacer Cambios

```bash
# Descartar cambios en un archivo (antes de add)
git checkout -- archivo.txt

# Quitar archivo del staging (después de add, antes de commit)
git reset HEAD archivo.txt

# Deshacer último commit (mantiene cambios)
git reset --soft HEAD~1

# Deshacer último commit (descarta cambios) ⚠️ CUIDADO
git reset --hard HEAD~1

# Revertir un commit específico (crea nuevo commit)
git revert abc123
```

## 🔥 Resolución de Conflictos

### ¿Qué es un Conflicto?

Un conflicto ocurre cuando dos personas modifican las mismas líneas de código.

### Ejemplo de Conflicto

```javascript
<<<<<<< HEAD (tus cambios)
const title = "Mi Título";
=======
const title = "Otro Título";
>>>>>>> main (cambios en main)
```

### Cómo Resolverlo

1. **Abre el archivo con conflicto**
   ```bash
   # Git te dirá qué archivos tienen conflictos
   git status
   ```

2. **Edita el archivo**
   - Elimina las marcas `<<<<<<<`, `=======`, `>>>>>>>`
   - Decide qué código mantener
   - Guarda el archivo

3. **Marca como resuelto**
   ```bash
   git add archivo-con-conflicto.js
   git commit -m "fix: resolver conflicto en título"
   ```

### Prevenir Conflictos

```bash
# Mantén tu rama actualizada frecuentemente
git checkout main
git pull origin main
git checkout tu-rama
git rebase main
```

## 🎯 Situaciones Comunes

### "Olvidé crear una rama y trabajé en main"

```bash
# Guarda tus cambios en una nueva rama
git checkout -b feature/mi-trabajo

# Ahora tus cambios están en la nueva rama
git add .
git commit -m "feat: mi trabajo"

# Vuelve main al estado original
git checkout main
git reset --hard origin/main
```

### "Necesito cambios de main en mi rama"

```bash
# Opción 1: Rebase (recomendado, historial limpio)
git checkout tu-rama
git rebase main

# Opción 2: Merge (más simple, pero historial más complejo)
git checkout tu-rama
git merge main
```

### "Hice commit en la rama equivocada"

```bash
# Guarda el hash del commit
git log --oneline  # copia el hash, ej: abc123

# Ve a la rama correcta
git checkout rama-correcta

# Aplica el commit
git cherry-pick abc123

# Vuelve a la rama incorrecta y elimina el commit
git checkout rama-incorrecta
git reset --hard HEAD~1
```

### "Quiero descartar todos mis cambios locales"

```bash
# ⚠️ CUIDADO: Esto elimina TODO tu trabajo no commiteado
git reset --hard HEAD
git clean -fd
```

### "Mi push fue rechazado"

```bash
# Alguien más hizo push antes que tú
# Primero obtén los cambios
git pull --rebase origin tu-rama

# Resuelve conflictos si hay
# Luego intenta push de nuevo
git push origin tu-rama
```

### "Necesito cambiar el mensaje del último commit"

```bash
# Si NO has hecho push
git commit --amend -m "nuevo mensaje"

# Si YA hiciste push (⚠️ solo si nadie más usa la rama)
git commit --amend -m "nuevo mensaje"
git push --force-with-lease
```

## ✅ Buenas Prácticas

### Commits

- ✅ Haz commits pequeños y frecuentes
- ✅ Cada commit debe tener un propósito claro
- ✅ Usa mensajes descriptivos
- ❌ No hagas commits gigantes con muchos cambios

```bash
# ✅ BIEN
git commit -m "feat(header): añadir logo"
git commit -m "feat(header): añadir menú de navegación"
git commit -m "style(header): ajustar espaciado"

# ❌ MAL
git commit -m "cambios en header"  # muy vago
git commit -m "feat: añadir header completo con logo, menú, estilos, responsive, animaciones..."  # demasiado
```

### Ramas

- ✅ Usa nombres descriptivos
- ✅ Mantén las ramas actualizadas con main
- ✅ Elimina ramas después del merge
- ❌ No trabajes directamente en main

```bash
# ✅ BIEN
feature/add-contact-form
fix/mobile-menu-not-closing
docs/update-readme

# ❌ MAL
test
mi-rama
cambios
```

### Pull Requests

- ✅ PRs pequeños (< 500 líneas)
- ✅ Descripción clara de qué y por qué
- ✅ Screenshots si hay cambios visuales
- ✅ Responde a comentarios de revisión
- ❌ No hagas PRs gigantes

### Sincronización

```bash
# Actualiza tu rama frecuentemente (al menos una vez al día)
git checkout main
git pull origin main
git checkout tu-rama
git rebase main
```

## 🆘 Comandos de Emergencia

### "¡Ayuda! Rompí todo"

```bash
# Ver el historial de TODO lo que hiciste
git reflog

# Volver a un estado anterior
git reset --hard HEAD@{5}  # el número viene de reflog
```

### "Necesito guardar cambios temporalmente"

```bash
# Guardar cambios sin commit
git stash

# Ver qué guardaste
git stash list

# Recuperar cambios
git stash pop

# Descartar cambios guardados
git stash drop
```

## 📖 Recursos Adicionales

- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)
- [Visualizing Git](https://git-school.github.io/visualizing-git/)
- [Oh Shit, Git!?!](https://ohshitgit.com/) - Soluciones a problemas comunes
- [Learn Git Branching](https://learngitbranching.js.org/) - Tutorial interactivo

## 💬 ¿Necesitas Ayuda?

- **Antes de hacer algo drástico**: Pregunta al equipo
- **Si algo salió mal**: No entres en pánico, casi todo se puede recuperar
- **Usa `git reflog`**: Es tu red de seguridad

---

Recuerda: Git es una herramienta poderosa, pero también es tu amigo. Con práctica, estos comandos se volverán segunda naturaleza. 🚀
