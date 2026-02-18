# 🎯 Mejores Prácticas para Pull Requests

Guía completa para crear y revisar Pull Requests de calidad.

## 📋 Índice

- [Antes de Crear un PR](#antes-de-crear-un-pr)
- [Creando un Buen PR](#creando-un-buen-pr)
- [Revisando PRs](#revisando-prs)
- [Después del Merge](#después-del-merge)
- [Ejemplos](#ejemplos)

## 🚀 Antes de Crear un PR

### Checklist Pre-PR

```bash
# 1. Asegúrate de que tu código funciona
npm run dev
# Prueba manualmente todas las funcionalidades

# 2. Verifica que el build funciona
npm run build
npm run preview

# 3. Revisa tus cambios
git diff main...tu-rama

# 4. Actualiza tu rama con main
git checkout main
git pull origin main
git checkout tu-rama
git rebase main

# 5. Limpia tu historial de commits si es necesario
git log --oneline
# Si tienes muchos commits pequeños, considera hacer squash
```

### Auto-Revisión

Antes de pedir que otros revisen tu código, revísalo tú mismo:

- [ ] ¿El código hace lo que dice que hace?
- [ ] ¿Hay console.logs olvidados?
- [ ] ¿Los nombres de variables son claros?
- [ ] ¿Hay código comentado que debería eliminarse?
- [ ] ¿Hay código duplicado que podría refactorizarse?
- [ ] ¿Las funciones son pequeñas y tienen un solo propósito?
- [ ] ¿Actualizaste las traducciones (en/es)?

## 📝 Creando un Buen PR

### 1. Título Descriptivo

```
✅ BIEN:
feat: añadir formulario de contacto con validación
fix: corregir error de scroll en menú móvil
refactor: simplificar lógica de autenticación

❌ MAL:
cambios
fix
update
arreglos varios
```

### 2. Descripción Completa

Una buena descripción responde:

- **¿Qué?** - Qué cambios se hicieron
- **¿Por qué?** - Por qué eran necesarios
- **¿Cómo?** - Cómo se implementó (si no es obvio)
- **¿Impacto?** - Qué áreas del código se ven afectadas

**Ejemplo de buena descripción:**

```markdown
## 📝 Descripción

Añade un formulario de contacto en la página principal que permite a los 
usuarios enviar consultas. Los datos se guardan en Supabase y se envía un 
email de confirmación.

## 🎯 Motivación

Los usuarios no tenían forma de contactarnos directamente desde el sitio. 
Esto causaba que muchos potenciales clientes nos contactaran por redes 
sociales, donde era más difícil dar seguimiento.

## 🔧 Implementación

- Nuevo componente `ContactForm.vue` con validación de campos
- Integración con Supabase para guardar leads
- Validación de email con regex
- Mensajes de error y éxito
- Responsive design

## 🧪 Cómo Probar

1. Ve a la página principal
2. Scroll hasta el formulario de contacto
3. Intenta enviar sin llenar campos (debe mostrar errores)
4. Llena el formulario correctamente y envía
5. Verifica que aparece mensaje de éxito
6. Verifica en Supabase que se guardó el registro

## 📸 Screenshots

[Añadir capturas del formulario]
```

### 3. Tamaño del PR

**Regla de oro: Más pequeño es mejor**

| Tamaño | Líneas | Tiempo de Revisión | Recomendación |
|--------|--------|-------------------|---------------|
| 🟢 Pequeño | < 200 | 10-15 min | Ideal |
| 🟡 Mediano | 200-500 | 30-45 min | Aceptable |
| 🔴 Grande | > 500 | 1-2 horas | Dividir |

**Cómo dividir PRs grandes:**

```
❌ MAL: Un PR gigante
feat: implementar sistema completo de autenticación
- Login
- Registro  
- Recuperar contraseña
- Perfil de usuario
- Cambiar contraseña
- Logout

✅ BIEN: Varios PRs pequeños
PR 1: feat: añadir página de login
PR 2: feat: añadir página de registro
PR 3: feat: añadir recuperación de contraseña
PR 4: feat: añadir página de perfil
```

### 4. Commits Limpios

**Un commit = Un cambio lógico**

```bash
# ✅ BIEN: Commits separados por propósito
feat(contact): añadir estructura del formulario
feat(contact): añadir validación de campos
feat(contact): integrar con Supabase
style(contact): ajustar estilos responsive

# ❌ MAL: Todo en un commit
feat: formulario de contacto completo con validación, estilos, integración...
```

**Squash commits si es necesario:**

```bash
# Si tienes muchos commits pequeños tipo "fix typo", "oops", etc.
git rebase -i HEAD~5  # Los últimos 5 commits

# En el editor, cambia "pick" por "squash" en los commits que quieres combinar
pick abc123 feat: añadir formulario
squash def456 fix typo
squash ghi789 oops forgot file
squash jkl012 fix another typo
```

### 5. Screenshots y Videos

**Cuándo incluir:**

- ✅ Cambios visuales (siempre)
- ✅ Nueva funcionalidad interactiva
- ✅ Corrección de bugs visuales (antes/después)
- ✅ Cambios responsive
- ❌ Cambios solo en backend/lógica

**Herramientas útiles:**

- Screenshots: Windows Snipping Tool, macOS Screenshot
- GIFs: [ScreenToGif](https://www.screentogif.com/), [Kap](https://getkap.co/)
- Videos: [Loom](https://www.loom.com/), OBS Studio

## 👀 Revisando PRs

### Para Revisores

#### 1. Qué Revisar

**Funcionalidad:**
- [ ] ¿El código hace lo que dice que hace?
- [ ] ¿Hay casos edge que no se consideraron?
- [ ] ¿Funciona en diferentes navegadores?
- [ ] ¿Funciona en móvil?

**Código:**
- [ ] ¿Es legible y mantenible?
- [ ] ¿Sigue los estándares del proyecto?
- [ ] ¿Hay código duplicado?
- [ ] ¿Las funciones son pequeñas y enfocadas?
- [ ] ¿Los nombres son descriptivos?

**Performance:**
- [ ] ¿Hay operaciones costosas innecesarias?
- [ ] ¿Se optimizaron las imágenes?
- [ ] ¿Hay memory leaks potenciales?

**Seguridad:**
- [ ] ¿Se validan los inputs del usuario?
- [ ] ¿Hay datos sensibles expuestos?
- [ ] ¿Se sanitizan los datos antes de mostrarlos?

#### 2. Cómo Comentar

**Usa prefijos claros:**

```markdown
[BLOCKER] Esto debe corregirse antes del merge
Ejemplo: [BLOCKER] Esta función puede causar un memory leak

[SUGERENCIA] Opcional pero recomendado
Ejemplo: [SUGERENCIA] Considera usar useMemo aquí para mejor performance

[PREGUNTA] Necesito clarificación
Ejemplo: [PREGUNTA] ¿Por qué elegiste este approach en lugar de X?

[NITPICK] Detalle menor, no bloqueante
Ejemplo: [NITPICK] Falta un espacio aquí
```

**Sé específico y constructivo:**

```markdown
❌ MAL:
"Este código está mal"
"No me gusta esto"
"Cambia esto"

✅ BIEN:
"Esta función hace demasiadas cosas. Considera dividirla en:
- validateEmail()
- saveToDatabase()
- sendConfirmation()
Esto hará el código más testeable y mantenible."

"Usar Promise.all() aquí mejoraría el performance porque las 
llamadas son independientes y pueden ejecutarse en paralelo."
```

**Reconoce el buen trabajo:**

```markdown
✅ "Excelente manejo de errores aquí 👍"
✅ "Me gusta cómo estructuraste este componente"
✅ "Buen uso de TypeScript types"
```

#### 3. Niveles de Revisión

**Revisión Rápida (< 100 líneas):**
- 5-10 minutos
- Enfócate en lógica y bugs obvios
- Verifica que funciona

**Revisión Normal (100-500 líneas):**
- 20-30 minutos
- Revisa funcionalidad completa
- Verifica estándares de código
- Prueba localmente si es necesario

**Revisión Profunda (> 500 líneas):**
- 1+ hora
- Checkout del código localmente
- Prueba exhaustivamente
- Revisa arquitectura y diseño
- Considera pedir dividir el PR

### Para Autores

#### Respondiendo a Comentarios

**Tipos de respuestas:**

```markdown
✅ "Buen punto, lo cambié en abc123"
✅ "Tienes razón, pero prefiero X porque Y. ¿Qué opinas?"
✅ "No estoy seguro de entender. ¿Podrías elaborar?"
✅ "Esto es intencional porque [razón]. ¿Tiene sentido?"

❌ "No"
❌ "Así está bien"
❌ "No tengo tiempo para eso"
```

**Marca comentarios como resueltos:**
- Solo el autor debe marcar como resuelto
- Marca después de hacer el cambio o explicar por qué no
- Si no estás de acuerdo, discute antes de marcar

#### Actualizando el PR

```bash
# Haz los cambios solicitados
# Commit normalmente
git add .
git commit -m "fix: aplicar feedback de code review"

# Push
git push origin tu-rama

# GitHub automáticamente actualiza el PR
```

## ✅ Después del Merge

### 1. Limpieza

```bash
# Vuelve a main
git checkout main

# Actualiza
git pull origin main

# Elimina tu rama local
git branch -d tu-rama

# Verifica que tus cambios están en main
git log --oneline
```

### 2. Monitoreo

- Verifica que el deploy fue exitoso
- Revisa que no hay errores en producción
- Monitorea métricas si es relevante

### 3. Comunicación

- Notifica al equipo si es un cambio importante
- Actualiza documentación si es necesario
- Cierra issues relacionados

## 📚 Ejemplos

### Ejemplo 1: PR Pequeño y Perfecto

```markdown
# feat: añadir botón de scroll to top

## 📝 Descripción
Añade un botón flotante que aparece cuando el usuario hace scroll 
hacia abajo y permite volver al inicio de la página con un clic.

## 🎯 Tipo de Cambio
- [x] ✨ Nueva funcionalidad

## 🧪 ¿Cómo se ha probado?
- [x] Probado en Chrome, Firefox, Safari
- [x] Probado en móvil (iOS y Android)
- [x] Verificado que aparece después de 300px de scroll
- [x] Verificado animación suave

## 📸 Screenshots
[GIF mostrando el botón en acción]

## 📋 Checklist
- [x] Código sigue estándares
- [x] Revisé mi código
- [x] Probado en múltiples navegadores
- [x] Funciona en móvil
```

**Archivos cambiados:**
- `src/components/ScrollToTop.vue` (nuevo, 45 líneas)
- `src/layouts/Layout.astro` (1 línea añadida)

**Total: 46 líneas** ✅

### Ejemplo 2: PR que Necesita Mejoras

```markdown
# cambios

cambios varios en el header

## Archivos cambiados:
- Header.astro (250 líneas)
- Footer.astro (180 líneas)
- global.css (320 líneas)
- 15 archivos más...

Total: 1,200 líneas
```

**Problemas:**
- ❌ Título vago
- ❌ Sin descripción
- ❌ Demasiado grande
- ❌ Mezcla múltiples cambios
- ❌ Sin screenshots

**Cómo mejorar:**
Dividir en 3 PRs:
1. `refactor(header): simplificar estructura del menú`
2. `style(footer): actualizar diseño responsive`
3. `style(global): reorganizar estilos base`

## 🎓 Tips para Trainees

### Primer PR

Tu primer PR puede ser intimidante. Aquí algunos tips:

1. **Empieza pequeño**: Corrección de typos, actualizar docs
2. **Pide ayuda**: Pregunta antes de empezar si no estás seguro
3. **No te preocupes por la perfección**: Todos aprendemos
4. **Lee PRs de otros**: Aprende viendo cómo otros lo hacen

### Preguntas Comunes

**"¿Cuándo está listo mi PR?"**
- Cuando pasa todos los checks automáticos
- Cuando has probado todo manualmente
- Cuando has revisado tu propio código
- Cuando has completado la plantilla del PR

**"¿Qué hago si mi PR tiene conflictos?"**
- Ver [docs/GIT_WORKFLOW.md](./GIT_WORKFLOW.md#resolución-de-conflictos)
- Pide ayuda si es tu primer conflicto

**"¿Cuánto tiempo debo esperar por una revisión?"**
- PRs pequeños: 24 horas
- PRs medianos: 48 horas
- PRs grandes: 3-5 días
- Si es urgente, menciona al revisor

## 🎯 Tips para Seniors

### Mentoreando en PRs

- Explica el "por qué", no solo el "qué"
- Comparte recursos y documentación
- Reconoce el buen trabajo
- Sé paciente con juniors

### Revisiones Efectivas

- Prioriza: Bloqueantes primero, nitpicks después
- Usa ejemplos de código en tus sugerencias
- Si algo es muy complejo, ofrece pair programming
- Aprueba cuando esté "suficientemente bien", no perfecto

### Liderando con el Ejemplo

- Haz PRs pequeños y bien documentados
- Responde rápido a comentarios
- Acepta feedback con humildad
- Comparte conocimiento en descripciones

## 📖 Recursos

- [Google Engineering Practices](https://google.github.io/eng-practices/review/)
- [The Art of Code Review](https://www.alexandra-hill.com/2018/06/25/the-art-of-giving-and-receiving-code-reviews/)
- [How to Make Your Code Reviewer Fall in Love with You](https://mtlynch.io/code-review-love/)

---

Recuerda: Un buen PR no es solo código que funciona, es código que otros pueden entender, revisar y mantener. 🚀
