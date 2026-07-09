# 🎨 Talleres Culturales Comunitarios

Portal web de inscripción a talleres culturales comunitarios (pintura, danza folclórica y teatro), desarrollado como proyecto para el ramo **Desarrollo de Aplicaciones Web I** — Universidad de Talca.

Proyecto desarrollado con **HTML5, CSS3 y JavaScript puro (Vanilla JS)**, sin frameworks ni librerías externas.

---

## 📋 Descripción

El sitio permite a la comunidad conocer los talleres culturales disponibles, revisar cuándo se dictan en un calendario, dejar comentarios en un muro comunitario, y postular a través de un formulario de inscripción. Incluye interactividad implementada en JavaScript: manipulación del DOM, manejo de eventos, validación de formulario y persistencia de datos con `localStorage`.

## ✨ Funcionalidades

- **Resumen dinámico de cupos**: se calcula y muestra el total de cupos disponibles.
- **Selección rápida de taller**: clic en una tarjeta preselecciona el taller en el formulario.
- **Menú de navegación con sección activa**: se resalta el link correspondiente al hacer scroll.
- **Calendario mensual interactivo**: muestra los días de cada taller, navegable por mes.
- **Muro de la Comunidad**: comentarios guardados en el navegador (`localStorage`).
- **Lista de inscritos**: cada inscripción se guarda y se muestra en una tabla dinámica, con opción de eliminar.
- **Validación de formulario en JavaScript**: mensajes de error personalizados por campo.
- **Botón "volver arriba"**: aparece al bajar en la página.
- **Diseño responsive**: adaptado a móviles, tablets y escritorio.

## 🗂️ Estructura del proyecto
inscripcion_talleres_culturales

│
├── index.html
├── README.md
│
├── css/
│   └── styles.css
│
└── js/
└── script.js

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica |
| CSS3 | Variables, Flexbox, Grid, media queries |
| JavaScript (Vanilla) | DOM, eventos, validación, `localStorage` |

No se utilizó Bootstrap, Tailwind, jQuery ni ningún framework.

## 🚀 Cómo ejecutar el proyecto

```bash
git clone <URL-del-repositorio>
cd avance_1_web
python3 -m http.server 8000
```
Luego visita `http://localhost:8000`. También puede publicarse en **GitHub Pages**.

## 👥 Integrantes del grupo

- Shermie Ortega
- Sebastian Sepulveda

## 📚 Contexto académico

- **Asignatura:** Desarrollo de Aplicaciones Web I
- **Evaluación:** N.º 4 — Integración de HTML + CSS + JavaScript
- **Institución:** Universidad de Talca

---

Proyecto desarrollado con fines académicos.