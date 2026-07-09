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

/*Punto de entrada del script.
 * Se ejecuta una sola vez, cuando el DOM está completamente cargado.
 */
function init() {
  mostrarResumenCupos();
  inicializarEventos();
  inicializarValidacionFormulario();
  inicializarBotonVolverArriba();

  window.addEventListener("scroll", manejarScroll);
  manejarScroll();
}

document.addEventListener("DOMContentLoaded", init);