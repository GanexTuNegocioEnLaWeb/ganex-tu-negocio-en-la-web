Actúa como arquitecto UX senior, copywriter de conversión y desarrollador full-stack experto en Astro + Vue.
Voy a construir una Landing Page Conversacional de Ventas, NO una web tradicional.
# OBJETIVO

Convertir tráfico de anuncios en leads calificados, usando un flujo conversacional paso a paso, sin scroll infinito.

# CONTEXTO
Marca: Ganex
Sitio principal: https://www.ganexbo.com/es
Servicio: Páginas web y marketing digital orientados a ventas
Público: emprendedores, profesionales y empresas
Stack:
Astro
Vue 3
Supabase (ya instalado)

# EXPERIENCIA DE USUARIO (OBLIGATORIA)
Una sola pregunta por pantalla
Navegación tipo wizard / conversación
Avance fluido, sin scroll manual
Mobile-first
Sin menú
Sin footer tradicional
Sin links externos
Enfoque absoluto en conversión
El usuario debe sentir que la página le habla directamente.
Con animaciones que hagan que tenga buena primera impresión

# ESTRUCTURA EXACTA DEL FLUJO
PASO 1 – HERO
Headline corto, directo y vendedor
Subheadline orientado a beneficio
Botón principal grande: “Empezar ahora”

PASO 2 – NECESIDAD
Pregunta:
¿Qué estás buscando hoy?
Opciones (botones):
Página web
Marketing digital
Embudo de ventas
No estoy seguro

PASO 3 – TIPO DE NEGOCIO
Pregunta:
¿Para qué tipo de negocio?
Opciones:
Emprendimiento
Profesional independiente
Empresa
Marca personal

PASO 4 – OBJETIVO
Pregunta:
¿Cuál es tu objetivo principal?
Opciones:
Conseguir más clientes
Vender online
Posicionarme en Google
Automatizar contactos

PASO 5 – CONFIANZA
Mostrar solo:
1 frase de autoridad
1 beneficio fuerte
Sin testimonios largos.
Máximo 2 líneas.

PASO 6 – CAPTURA
Formulario mínimo:
Nombre
WhatsApp
Botón CTA:
Quiero que me contacten
Mostrar mensaje:
Respondemos en menos de 60 minutos

# BACKEND — SUPABASE
TABLA: leads
Campos:
id → uuid (primary key)
need → text
business_type → text
goal → text
name → text
whatsapp → text
created_at → timestamp with time zone
Requisitos:
Insertar lead al finalizar el flujo
Validación básica
Manejo de errores
Código SQL incluido

# IMPLEMENTACIÓN TÉCNICA
Astro como framework principal
Vue 3 para el flujo conversacional
Estado centralizado del formulario
Componentes desacoplados
Animaciones ligeras
Código limpio y escalable

# SEO & PERFORMANCE
HTML semántico
Title y meta description orientados a intención comercial
Carga rápida
Optimización sin afectar conversión

# ENTREGA OBLIGATORIA
Devuélveme:
Copy final listo para producción
Estructura de carpetas Astro
Componentes Vue del flujo
Lógica completa del wizard
Código de inserción Supabase
SQL de la tabla leads

# REGLAS
NO expliques teoría
NO hagas una web tradicional
NO agregues secciones innecesarias
PIENSA COMO UN EXPERTO EN CONVERSIÓN
Este proyecto debe estar diseñado para vender, no para decorar.
Entrégalo listo para implementar.