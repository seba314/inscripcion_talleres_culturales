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


 /* Manejador único para el evento "scroll" de la ventana.
 */
function manejarScroll() {
  resaltarLinkActivo();
}

/*Punto de entrada del script.
 * Se ejecuta una sola vez, cuando el DOM está completamente cargado.
 */
function init() {
  mostrarResumenCupos();
  inicializarEventos();

  window.addEventListener("scroll", manejarScroll);
  manejarScroll();
}

document.addEventListener("DOMContentLoaded", init);