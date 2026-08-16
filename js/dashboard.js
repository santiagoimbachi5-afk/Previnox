function ir(id, btn) {
    document.querySelectorAll('.dinamic-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    
    document.getElementById(id).classList.add('active');
    if(btn) btn.classList.add('active');
    
    const titulos = {
        inicio: 'Panel de Administración', 
        usuarios: 'Gestión de Usuarios', 
        reportes: 'Generar Reportes', 
        alertas: 'Monitorizar Alertas y SOS', 
        profesionales: 'Asignación de Profesionales', 
        contenido: 'Aprobar Contenido',
        campañas: 'Publicar Campañas'
    };
    
    document.getElementById('titulo').innerText = titulos[id];
}