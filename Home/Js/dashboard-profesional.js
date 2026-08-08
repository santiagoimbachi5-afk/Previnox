function mostrarSeccion(id) {
  // Oculta todas las secciones
  const secciones = document.querySelectorAll('.seccion');
  secciones.forEach(sec => sec.style.display = "none");

  // Muestra solo la sección seleccionada
  const activa = document.getElementById(id);
  if (activa) {
    activa.style.display = "block";
  } else {
    console.error("No existe la sección con id:", id);
  }
}
//Progamacion de citas
const logoutBtn = document.querySelector(".logout");

logoutBtn.addEventListener("click", () => {
    window.location.href = "index.html"; 
});
function mostrarEntidades() {
  const entidades = document.getElementById("entidades");
  entidades.classList.toggle("oculto");
}
function agendarCita() {
  const fecha = document.getElementById("fechaCita").value;
  const hora = document.getElementById("horaCita").value;

  if (fecha && hora) {
    const lista = document.getElementById("listaCitas");
    const nuevaCita = document.createElement("li");
    nuevaCita.textContent = `Paciente asignado → Consulta → ${fecha} ${hora}`;
    lista.appendChild(nuevaCita);
  } else {
    alert("Por favor selecciona fecha y hora.");
  }
}

function asignarProfesional() {
  alert("Profesional asignado automáticamente a la cita.");
}
//Atender emergencias
function atenderEmergencia() {
  const lista = document.getElementById("listaAlertas");
  if (lista.firstElementChild) {
    const alerta = lista.firstElementChild.textContent;
    alert("Atendiendo: " + alerta);
    lista.removeChild(lista.firstElementChild);
  } else {
    alert("No hay emergencias activas.");
  }
}
// Reportes Generados 
document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("graficoCitas").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
      datasets: [{
        label: "Número de citas",
        data: [5, 8, 6, 10],
        backgroundColor: "#0a74da"
      }]
    }
  });
});

// Funciones de botones
function visualizarReportes() {
  alert("Mostrando reportes clínicos...");
}

function analizarReportes() {
  alert("Analizando datos de pacientes y servicios...");
}

function descargarPDF() {
  alert("Descargando reportes en PDF...");
}

function descargarExcel() {
  alert("Descargando reportes en Excel...");
}
//Solicitudes de USUARIO
function clasificarSolicitud() {
  alert("Solicitud clasificada según tipo: información, soporte o documentos.");
}

function responderSolicitud() {
  alert("Respuesta enviada al usuario.");
}

function asignarResponsable() {
  alert("Solicitud asignada a un responsable del área.");
}
//Gestionar Planes de Tratamiento 
function suspenderPlan(btn) {
  const plan = btn.closest("li");
  alert("Plan suspendido: " + plan.textContent);
}

function modificarPlan(btn) {
  const plan = btn.closest("li");
  alert("Modificar detalles del " + plan.textContent);
}

function terminarPlan(btn) {
  const plan = btn.closest("li");
  plan.remove();
  alert("Plan terminado y eliminado de la lista.");
}

function reemplazarPlan(btn) {
  const plan = btn.closest("li");
  plan.textContent = "Plan de tratamiento REEMPLAZADO → Avance 0%";
  alert("Plan reemplazado por uno nuevo.");
}






