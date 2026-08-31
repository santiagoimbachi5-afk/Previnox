function ir(id, btn) {
    document.querySelectorAll('.dinamic-section')
        .forEach(s => s.classList.remove('active'));

    document.querySelectorAll('nav button')
        .forEach(b => b.classList.remove('active'));

    document.getElementById(id).classList.add('active');

    if (btn) btn.classList.add('active');

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


const canvas = document.getElementById('graficoUso');

if (canvas) {
    new Chart(canvas, {
        type: 'bar',

        data: {
            labels: [
                'Enero', 'Febrero', 'Marzo', 'Abril',
                'Mayo', 'Junio', 'Julio', 'Agosto'
            ],

            datasets: [{
                label: 'Usuarios activos',
                data: [180, 240, 310, 275, 390, 420, 510, 580],
                borderWidth: 1,
                borderRadius: 6
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de usuarios'
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: 'Mes'
                    }
                }
            }
        }
    });
}