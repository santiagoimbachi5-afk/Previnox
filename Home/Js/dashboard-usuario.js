// Función para cambiar de sección según el botón presionado
function showSection(sectionId, element) {
  // Ocultar todas las secciones
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => section.classList.remove('active'));

  // Quitar la clase 'active' de todos los botones
  const buttons = document.querySelectorAll('.menu-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  // Mostrar la sección seleccionada
  document.getElementById(sectionId).classList.add('active');

  // Activar el botón presionado
  element.classList.add('active');
}

// Función para activar el Botón de Pánico
function triggerPanicAlert() {
  const statusOutput = document.getElementById('panic-status');
  
  statusOutput.style.display = 'block';
  statusOutput.style.backgroundColor = '#fee2e2';
  statusOutput.style.color = '#991b1b';
  statusOutput.style.border = '1px solid #fca5a5';
  
  statusOutput.innerHTML = `
    ⏳ Enviando señal de pánico...
  `;

  setTimeout(() => {
    statusOutput.style.backgroundColor = '#dcfce7';
    statusOutput.style.color = '#166534';
    statusOutput.style.border = '1px solid #86efac';
    statusOutput.innerHTML = `
      ✅ <strong>¡ALERTA ENVIADA CON ÉXITO!</strong><br>
      Se ha notificado al representante (Dr. Carlos Pérez). Se pondrá en contacto contigo de inmediato.
    `;
  }, 1500);
}
// Selecciona el botón por su clase
const logoutBtn = document.querySelector(".logout-btn");

// Agrega el evento de clic
logoutBtn.addEventListener("click", () => {
    // Redirige al archivo index.html
    window.location.href = "index.html";
});
