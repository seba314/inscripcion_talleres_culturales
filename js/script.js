/* ============================================================
   TALLERES CULTURALES COMUNITARIOS
   ============================================================ */

/* ------------------------------------------------------------
   Manipulación del DOM
   ------------------------------------------------------------ */

/*Recorre todas las insignias de cupos (.taller-badge) y suma
 * el valor del atributo data-cupos de cada una.
 * @returns {number} total de cupos disponibles entre todos los talleres
 */
function calcularCuposTotales() {
  const badges = document.querySelectorAll(".taller-badge[data-cupos]");
  let total = 0;

  badges.forEach((badge) => {
    total += Number(badge.dataset.cupos);
  });

  return total;
}

/*Crea (o actualiza) un párrafo con el resumen de cupos totales
 * disponibles y lo inserta en el DOM, debajo de la intro de "Talleres".
 */
function mostrarResumenCupos() {
  const intro = document.querySelector("#talleres .section-intro");
  if (!intro) return;

  const total = calcularCuposTotales();

  let resumen = document.getElementById("cupos-resumen");
  if (!resumen) {
    resumen = document.createElement("p");
    resumen.id = "cupos-resumen";
    intro.insertAdjacentElement("afterend", resumen);
  }

  resumen.textContent = `📋 Actualmente hay ${total} cupos disponibles en total.`;
}

/* ------------------------------------------------------------
   Manejo de eventos
   ------------------------------------------------------------ */

/* Resalta el link del menú correspondiente a la sección visible.
 */
function resaltarLinkActivo() {
  const secciones = document.querySelectorAll("main section[id], footer[id]");
  const links = document.querySelectorAll(".nav-link");

  const referencia = window.scrollY + 120;
  let idActual = secciones[0]?.id;

  secciones.forEach((seccion) => {
    if (referencia >= seccion.offsetTop) {
      idActual = seccion.id;
    }
  });

  links.forEach((link) => {
    const esActivo = link.getAttribute("href") === `#${idActual}`;
    link.classList.toggle("is-active", esActivo);
  });
}

/**Al hacer clic en una tarjeta de taller, preselecciona ese taller
 * en el <select> del formulario y baja suavemente hasta él.
 * 
 * @param {MouseEvent} evento
 */
function manejarClicTaller(evento) {
  const tarjeta = evento.currentTarget;
  const tallerId = tarjeta.dataset.taller;
  const select = document.getElementById("taller");

  if (!select || !tallerId) return;

  select.value = tallerId;
  document.getElementById("inscripcion")?.scrollIntoView({ behavior: "smooth" });
}

/*Engancha los listeners de eventos a los elementos correspondientes.
 */
function inicializarEventos() {
  document.querySelectorAll(".taller-card[data-taller]").forEach((tarjeta) => {
    tarjeta.addEventListener("click", manejarClicTaller);
  });
}


/* ------------------------------------------------------------
   Validación del formulario
   ------------------------------------------------------------ */

function obtenerMensajeError(campo) {
  const v = campo.validity;
  if (v.valueMissing) return "Este campo es obligatorio.";
  if (v.typeMismatch) return "El formato ingresado no es válido.";
  if (v.patternMismatch) return "El formato no coincide con lo esperado.";
  if (v.rangeUnderflow) return `El valor mínimo es ${campo.min}.`;
  if (v.rangeOverflow) return `El valor máximo es ${campo.max}.`;
  if (v.tooShort) return `Debe tener al menos ${campo.minLength} caracteres.`;
  return "Revisa este campo.";
}

function obtenerContenedorCampo(campo) {
  return campo.closest(".form-group") || campo.parentElement;
}

function mostrarError(campo, mensaje) {
  const grupo = obtenerContenedorCampo(campo);
  let error = grupo.querySelector(".form-error");
  if (!error) {
    error = document.createElement("small");
    error.className = "form-error";
    grupo.appendChild(error);
  }
  error.textContent = mensaje;
}

function limpiarError(campo) {
  const grupo = obtenerContenedorCampo(campo);
  const error = grupo.querySelector(".form-error");
  if (error) error.remove();
}

function validarCampo(campo) {
  const esValido = campo.checkValidity();
  if (esValido) {
    limpiarError(campo);
  } else {
    mostrarError(campo, obtenerMensajeError(campo));
  }
  return esValido;
}

function mostrarMensajeFormulario(exito) {
  const form = document.getElementById("formInscripcion");
  let mensaje = document.getElementById("form-mensaje");
  if (!mensaje) {
    mensaje = document.createElement("p");
    mensaje.id = "form-mensaje";
    form.appendChild(mensaje);
  }
  mensaje.classList.toggle("form-mensaje-exito", exito);
  mensaje.classList.toggle("form-mensaje-error", !exito);
  mensaje.textContent = exito
    ? "✅ ¡Inscripción enviada con éxito! Pronto nos pondremos en contacto."
    : "⚠️ Revisa los campos marcados antes de enviar el formulario.";
}

function validarFormulario(evento) {
  evento.preventDefault();
  const form = evento.target;
  const campos = form.querySelectorAll("input[required], select[required]");

  let formularioValido = true;
  let primerCampoInvalido = null;

  campos.forEach((campo) => {
    const esValido = validarCampo(campo);
    if (!esValido && !primerCampoInvalido) primerCampoInvalido = campo;
    formularioValido = formularioValido && esValido;
  });

  mostrarMensajeFormulario(formularioValido);

  if (!formularioValido) {
    primerCampoInvalido.focus();
    return;
  }

  agregarInscrito(crearInscritoDesdeFormulario(form));
  form.reset();
}

function inicializarValidacionFormulario() {
  const form = document.getElementById("formInscripcion");
  if (!form) return;

  form.addEventListener("submit", validarFormulario);
  form.querySelectorAll("input[required], select[required]").forEach((campo) => {
    campo.addEventListener("blur", () => validarCampo(campo));
  });
}

/* ------------------------------------------------------------
   Funcionalidades interactivas
   ------------------------------------------------------------ */

function actualizarVisibilidadBotonVolverArriba() {
  const boton = document.getElementById("btnVolverArriba");
  if (!boton) return;
  boton.classList.toggle("visible", window.scrollY > 400);
}

function inicializarBotonVolverArriba() {
  const boton = document.getElementById("btnVolverArriba");
  if (!boton) return;
  boton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* Manejador único para el evento "scroll" de la ventana.
 */
function manejarScroll() {
  resaltarLinkActivo();
  actualizarVisibilidadBotonVolverArriba();
}

/* ------------------------------------------------------------
    Lista de inscritos (simulación de base de datos con localStorage)
   ------------------------------------------------------------ */

const CLAVE_STORAGE = "talleres-inscritos";

function cargarInscritos() {
  try {
    const datos = localStorage.getItem(CLAVE_STORAGE);
    return datos ? JSON.parse(datos) : [];
  } catch (error) {
    console.error("No se pudo leer localStorage:", error);
    return [];
  }
}

function guardarInscritos(inscritos) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(inscritos));
}

function crearInscritoDesdeFormulario(form) {
  const selectTaller = form.elements["taller"];
  const nombreTaller = selectTaller.options[selectTaller.selectedIndex].text;

  return {
    id: Date.now(),
    nombre: form.elements["nombre"].value.trim(),
    taller: nombreTaller,
    email: form.elements["email"].value.trim(),
    telefono: form.elements["telefono"].value.trim(),
    fecha: new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric" }),
  };
}

function agregarInscrito(inscrito) {
  const inscritos = cargarInscritos();
  inscritos.unshift(inscrito);
  guardarInscritos(inscritos);
  renderizarTablaInscritos();
}

function eliminarInscrito(id) {
  const inscritos = cargarInscritos().filter((inscrito) => inscrito.id !== id);
  guardarInscritos(inscritos);
  renderizarTablaInscritos();
}

function crearFilaInscrito(inscrito) {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td>${inscrito.nombre}</td>
    <td><span class="taller-tag">${inscrito.taller}</span></td>
    <td>${inscrito.email}<br>${inscrito.telefono}</td>
    <td>${inscrito.fecha}</td>
    <td><button type="button" class="btn-eliminar" data-id="${inscrito.id}">Eliminar</button></td>
  `;
  return fila;
}

function renderizarTablaInscritos() {
  const cuerpo = document.getElementById("cuerpoTablaInscritos");
  const tabla = document.getElementById("tablaInscritos");
  const mensajeVacio = document.getElementById("inscritosVacio");
  if (!cuerpo) return;

  const inscritos = cargarInscritos();
  cuerpo.innerHTML = "";

  if (inscritos.length === 0) {
    tabla.hidden = true;
    mensajeVacio.hidden = false;
    return;
  }

  tabla.hidden = false;
  mensajeVacio.hidden = true;
  inscritos.forEach((inscrito) => cuerpo.appendChild(crearFilaInscrito(inscrito)));
}

function inicializarTablaInscritos() {
  const cuerpo = document.getElementById("cuerpoTablaInscritos");
  if (!cuerpo) return;

  cuerpo.addEventListener("click", (evento) => {
    if (!evento.target.classList.contains("btn-eliminar")) return;
    eliminarInscrito(Number(evento.target.dataset.id));
  });

  renderizarTablaInscritos();
}

/* ------------------------------------------------------------
   Muro de la Comunidad (localStorage)
   ------------------------------------------------------------ */

function inicializarMuro() {
  const form = document.getElementById("formComentario");
  const lista = document.getElementById("listaComentarios");

  if (!form || !lista) return;

  let comentarios = [];
  try {
    const guardados = localStorage.getItem("muro-comentarios");
    comentarios = guardados ? JSON.parse(guardados) : [];
  } catch (e) {
    console.error("Error al leer el muro desde localStorage", e);
  }

  const renderizarComentarios = () => {
    lista.innerHTML = "";

    if (comentarios.length === 0) {
      lista.innerHTML = '<p class="inscritos-vacio">El muro está vacío. ¡Sé el primero en dejar un mensaje!</p>';
      return;
    }

    comentarios.forEach((c) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "comentario-tarjeta";

      const nombreMinuscula = c.nombre.toLowerCase();
      if (nombreMinuscula.includes("admin") || nombreMinuscula.includes("organiza") || nombreMinuscula.includes("profe")) {
        tarjeta.classList.add("organizador");
      }

      tarjeta.innerHTML = `
        <span class="comentario-fecha">${c.fecha}</span>
        <div class="comentario-autor">👤 ${c.nombre}</div>
        <p class="comentario-texto">${c.mensaje}</p>
      `;
      lista.appendChild(tarjeta);
    });
  };

  form.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nombreInput = document.getElementById("muroNombre");
    const mensajeInput = document.getElementById("muroMensaje");

    if (!nombreInput.value.trim() || !mensajeInput.value.trim()) return;

    const nuevoComentario = {
      nombre: nombreInput.value.trim(),
      mensaje: mensajeInput.value.trim(),
      fecha: new Date().toLocaleDateString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    };

    comentarios.unshift(nuevoComentario);
    localStorage.setItem("muro-comentarios", JSON.stringify(comentarios));

    renderizarComentarios();
    form.reset();
  });

  renderizarComentarios();
}

/* ------------------------------------------------------------
   Calendario de talleres
   ------------------------------------------------------------ */

/**
 * Pone en mayúscula solo la primera letra de un texto (útil para
 * los nombres de mes/día que Date.toLocaleDateString entrega en
 * minúscula, como corresponde en español).
 */
function capitalizarPrimeraLetra(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Horario recurrente de cada taller. "dias" usa el mismo formato
 * que Date.getDay(): 0 = domingo, 1 = lunes, ... 6 = sábado.
 */
const TALLERES_HORARIO = [
  { id: "pintura", nombre: "Pintura para Principiantes", icono: "🖌️", dias: [2, 4], horario: "10:00 – 12:00 hrs" },
  { id: "danza", nombre: "Danza Folclórica", icono: "💃", dias: [1, 3, 5], horario: "18:00 – 19:30 hrs" },
  { id: "teatro", nombre: "Teatro Comunitario", icono: "🎭", dias: [6], horario: "09:00 – 12:00 hrs" },
];

let mesVisible = new Date().getMonth();
let anioVisible = new Date().getFullYear();

function obtenerTalleresDelDia(diaSemana) {
  return TALLERES_HORARIO.filter((taller) => taller.dias.includes(diaSemana));
}

function crearCeldaDia(numeroDia, fecha) {
  const celda = document.createElement("button");
  celda.type = "button";
  celda.className = "dia-celda";
  celda.textContent = numeroDia;

  const hoy = new Date();
  const esHoy =
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear();
  if (esHoy) celda.classList.add("dia-hoy");

  const talleresDelDia = obtenerTalleresDelDia(fecha.getDay());

  if (talleresDelDia.length > 0) {
    celda.classList.add("dia-con-evento");

    const puntos = document.createElement("span");
    puntos.className = "dia-puntos";
    talleresDelDia.forEach((taller) => {
      const punto = document.createElement("i");
      punto.className = `punto punto-${taller.id}`;
      puntos.appendChild(punto);
    });
    celda.appendChild(puntos);

    celda.addEventListener("click", () => mostrarDetalleDia(fecha, talleresDelDia, celda));
  }

  return celda;
}

function mostrarDetalleDia(fecha, talleres, celda) {
  const detalle = document.getElementById("calendarioDetalle");

  document.querySelectorAll(".dia-celda.dia-seleccionado").forEach((el) => el.classList.remove("dia-seleccionado"));
  celda.classList.add("dia-seleccionado");

  const fechaTexto = capitalizarPrimeraLetra(
    fecha.toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })
  );
  const itemsHTML = talleres
    .map((taller) => `<li>${taller.icono} <strong>${taller.nombre}</strong> — ${taller.horario}</li>`)
    .join("");

  detalle.innerHTML = `<h4>${fechaTexto}</h4><ul>${itemsHTML}</ul>`;
  detalle.hidden = false;
}

function renderizarCalendario() {
  const grid = document.getElementById("calendarioGrid");
  const titulo = document.getElementById("calendarioTitulo");
  if (!grid || !titulo) return;

  grid.innerHTML = "";
  document.getElementById("calendarioDetalle").hidden = true;

  const primerDiaDelMes = new Date(anioVisible, mesVisible, 1);
  const diasEnElMes = new Date(anioVisible, mesVisible + 1, 0).getDate();
  const celdasVacias = (primerDiaDelMes.getDay() + 6) % 7;

  for (let i = 0; i < celdasVacias; i++) {
    const vacio = document.createElement("span");
    vacio.className = "dia-celda dia-vacio";
    grid.appendChild(vacio);
  }

  for (let dia = 1; dia <= diasEnElMes; dia++) {
    const fecha = new Date(anioVisible, mesVisible, dia);
    grid.appendChild(crearCeldaDia(dia, fecha));
  }

  const nombreMes = primerDiaDelMes.toLocaleDateString("es-CL", { month: "long", year: "numeric" });
  titulo.textContent = capitalizarPrimeraLetra(nombreMes);
}

function cambiarMes(delta) {
  mesVisible += delta;

  if (mesVisible < 0) {
    mesVisible = 11;
    anioVisible -= 1;
  } else if (mesVisible > 11) {
    mesVisible = 0;
    anioVisible += 1;
  }

  renderizarCalendario();
}

function inicializarCalendario() {
  const grid = document.getElementById("calendarioGrid");
  if (!grid) return;

  document.getElementById("mesAnterior").addEventListener("click", () => cambiarMes(-1));
  document.getElementById("mesSiguiente").addEventListener("click", () => cambiarMes(1));

  renderizarCalendario();
}

/**
 * Punto de entrada del script.
 * Se ejecuta una sola vez, cuando el DOM está completamente cargado.
 */
function init() {
  mostrarResumenCupos();
  inicializarEventos();
  inicializarValidacionFormulario();
  inicializarTablaInscritos();
  inicializarBotonVolverArriba();
  inicializarMuro();
  inicializarCalendario();

  window.addEventListener("scroll", manejarScroll);
  manejarScroll();
}

document.addEventListener("DOMContentLoaded", init);