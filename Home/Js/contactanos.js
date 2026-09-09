// Mensaje de éxito
const form = document.getElementById('formContacto');
const mensajeExito = document.getElementById('mensajeExito');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Evita recargar la página
  mensajeExito.style.display = 'block';
  form.reset(); // Limpia el formulario
});
