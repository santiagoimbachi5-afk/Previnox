document.addEventListener("DOMContentLoaded", () => {
    const $ = id => document.getElementById(id);

    const titulos = {
        inicio: "Panel de Administración",
        usuarios: "Gestión de usuarios",
        reportes: "Generar reportes",
        alertas: "Monitorizar alertas",
        profesionales: "Asignación de profesionales",
        contenido: "Aprobar contenido",
        campañas: "Publicar campañas"
    };

    window.ir = (id, boton) => {
        document.querySelectorAll(".dinamic-section").forEach(seccion =>
            seccion.classList.toggle("active", seccion.id === id)
        );

        document.querySelectorAll("nav button").forEach(botonNav =>
            botonNav.classList.remove("active")
        );

        boton?.classList.add("active");
        if ($("titulo")) $("titulo").textContent = titulos[id] || titulos.inicio;
    };

    function mensaje(texto) {
        let aviso = $("mensajeAdmin");

        if (!aviso) {
            aviso = document.createElement("div");
            aviso.id = "mensajeAdmin";
            Object.assign(aviso.style, {
                position: "fixed",
                right: "20px",
                top: "20px",
                zIndex: "9999",
                background: "#0d9488",
                color: "white",
                padding: "12px 16px",
                borderRadius: "8px",
                boxShadow: "0 4px 15px #0003"
            });
            document.body.appendChild(aviso);
        }

        aviso.textContent = texto;
        aviso.hidden = false;
        clearTimeout(aviso.timer);
        aviso.timer = setTimeout(() => aviso.hidden = true, 3000);
    }

    // Diagrama de barras: se mantiene Chart.js.
    const grafico = $("graficoUso");
    if (grafico && typeof Chart !== "undefined") {
        new Chart(grafico, {
            type: "bar",
            data: {
                labels: ["Mar", "Abr", "May", "Jun", "Jul", "Ago"],
                datasets: [{
                    label: "Usuarios activos",
                    data: [180, 230, 270, 300, 280, 320],
                    backgroundColor: "#0d9488",
                    borderRadius: 6,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    const listaUsuarios = $("listaUsuarios");

    function actualizarUsuarios() {
        if (!listaUsuarios) return;

        const filas = [...listaUsuarios.querySelectorAll(".usuario")];
        const activos = filas.filter(fila => fila.dataset.estado === "Activo").length;
        const profesionales = filas.filter(fila => fila.dataset.rol === "Profesional").length;

        if ($("totalUsuarios")) $("totalUsuarios").textContent = filas.length;
        if ($("usuariosActivos")) $("usuariosActivos").textContent = activos;

        const contadores = document.querySelectorAll(".estadisticas-usuarios strong");
        if (contadores[2]) contadores[2].textContent = profesionales;
    }

    function filtrarUsuarios() {
        if (!listaUsuarios) return;

        const texto = $("buscarUsuario")?.value.toLowerCase().trim() || "";
        const rol = $("filtroRol")?.value || "todos";
        const estado = $("filtroEstado")?.value || "todos";

        listaUsuarios.querySelectorAll(".usuario").forEach(fila => {
            const coincide =
                fila.textContent.toLowerCase().includes(texto) &&
                (rol === "todos" || fila.dataset.rol === rol) &&
                (estado === "todos" || fila.dataset.estado === estado);

            fila.style.display = coincide ? "" : "none";
        });
    }

    ["buscarUsuario", "filtroRol", "filtroEstado"].forEach(id => {
        $(id)?.addEventListener(id === "buscarUsuario" ? "input" : "change", filtrarUsuarios);
    });

    function crearModal(titulo, contenido) {
        document.querySelector("#modalAdmin")?.remove();

        const modal = document.createElement("div");
        modal.id = "modalAdmin";
        Object.assign(modal.style, {
            position: "fixed",
            inset: "0",
            display: "grid",
            placeItems: "center",
            background: "#0008",
            padding: "20px",
            zIndex: "9998"
        });

        modal.innerHTML = `
            <section style="background:white;padding:24px;border-radius:12px;width:min(450px,100%)">
                <header style="display:flex;justify-content:space-between;align-items:center">
                    <h3>${titulo}</h3>
                    <button type="button" id="cerrarModal">×</button>
                </header>
                ${contenido}
            </section>
        `;

        document.body.appendChild(modal);
        $("cerrarModal").onclick = () => modal.remove();
        modal.onclick = e => e.target === modal && modal.remove();
    }

    function datosUsuario(fila) {
        return {
            nombre: fila.querySelector("strong")?.textContent.trim() || "",
            correo: fila.querySelector("small")?.textContent.trim() || "",
            rol: fila.dataset.rol || "Paciente",
            estado: fila.dataset.estado || "Activo"
        };
    }

    function formularioUsuario(fila = null) {
        const usuario = fila ? datosUsuario(fila) : {
            nombre: "",
            correo: "",
            rol: "Paciente",
            estado: "Activo"
        };

        crearModal(fila ? "Editar usuario" : "Nuevo usuario", `
            <form id="formUsuario">
                <p><input id="nombreUsuario" placeholder="Nombre completo" value="${usuario.nombre}" required></p>
                <p><input id="correoUsuario" type="email" placeholder="Correo electrónico" value="${usuario.correo}" required></p>
                <p>
                    <select id="rolUsuario">
                        ${["Administrador", "Profesional", "Empleado", "Paciente"]
                            .map(rol => `<option ${rol === usuario.rol ? "selected" : ""}>${rol}</option>`).join("")}
                    </select>
                </p>
                <p>
                    <select id="estadoUsuario">
                        ${["Activo", "Inactivo"]
                            .map(estado => `<option ${estado === usuario.estado ? "selected" : ""}>${estado}</option>`).join("")}
                    </select>
                </p>
                <button class="btn-action" type="submit">Guardar</button>
            </form>
        `);

        $("formUsuario").onsubmit = evento => {
            evento.preventDefault();

            const nombre = $("nombreUsuario").value.trim();
            const correo = $("correoUsuario").value.trim();
            const rol = $("rolUsuario").value;
            const estado = $("estadoUsuario").value;
            const iniciales = nombre.split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();

            if (!fila) {
                fila = document.createElement("tr");
                fila.className = "usuario";
                listaUsuarios?.appendChild(fila);
            }

            fila.dataset.rol = rol;
            fila.dataset.estado = estado;
            fila.innerHTML = `
                <td>
                    <section class="usuario-info">
                        <span class="avatar">${iniciales}</span>
                        <section><strong>${nombre}</strong><small>${correo}</small></section>
                    </section>
                </td>
                <td><span class="rol ${rol.toLowerCase()}">${rol}</span></td>
                <td><span class="estado ${estado === "Activo" ? "activo" : "inactivo"}">● ${estado}</span></td>
                <td>Ahora mismo</td>
                <td>
                    <section class="acciones">
                        <button type="button" class="accion editar">✏️</button>
                        <button type="button" class="accion clave">🔑</button>
                        <button type="button" class="accion eliminar">🗑️</button>
                    </section>
                </td>
            `;

            document.querySelector("#modalAdmin")?.remove();
            actualizarUsuarios();
            filtrarUsuarios();
            mensaje("Usuario guardado correctamente.");
        };
    }

    $("nuevoUsuario")?.addEventListener("click", () => formularioUsuario());

    listaUsuarios?.addEventListener("click", evento => {
        const boton = evento.target.closest(".accion");
        const fila = boton?.closest(".usuario");
        if (!boton || !fila) return;

        const usuario = datosUsuario(fila);

        if (boton.classList.contains("editar")) formularioUsuario(fila);

        if (boton.classList.contains("clave")) {
            mensaje(`Solicitud de recuperación enviada a ${usuario.correo}.`);
        }

        if (boton.classList.contains("eliminar") &&
            confirm(`¿Eliminar a ${usuario.nombre}?`)) {
            fila.remove();
            actualizarUsuarios();
            mensaje("Usuario eliminado.");
        }
    });

    window.generarReporte = () => {
        const inicio = $("fechaInicio")?.value;
        const fin = $("fechaFin")?.value;

        if (inicio && fin && inicio > fin) {
            mensaje("La fecha inicial no puede ser posterior a la fecha final.");
            return;
        }

        if ($("resultadoReporte")) $("resultadoReporte").style.display = "block";
        if ($("periodoReporte")) $("periodoReporte").textContent =
            inicio && fin ? `${inicio} hasta ${fin}` : "Período no especificado";

        mensaje("Reporte generado correctamente.");
    };

    window.descargarReporte = () => {
        const contenido = "Indicador,Valor\nUsuarios activos,320\nAlertas pendientes,18";
        const enlace = document.createElement("a");

        enlace.href = URL.createObjectURL(
            new Blob(["\uFEFF" + contenido], { type: "text/csv;charset=utf-8" })
        );
        enlace.download = "reporte_previnox.csv";
        enlace.click();
        mensaje("Reporte descargado.");
    };

    function filtrarAlertas() {
        const texto = $("buscarAlerta")?.value.toLowerCase().trim() || "";
        const estado = $("filtroAlerta")?.value || "todas";

        document.querySelectorAll(".alerta-card").forEach(alerta => {
            const coincide =
                alerta.textContent.toLowerCase().includes(texto) &&
                (estado === "todas" || alerta.dataset.estado === estado);

            alerta.style.display = coincide ? "" : "none";
        });
    }

    $("buscarAlerta")?.addEventListener("input", filtrarAlertas);
    $("filtroAlerta")?.addEventListener("change", filtrarAlertas);

    window.actualizarAlerta = select => {
        const tarjeta = select.closest(".alerta-card");
        if (tarjeta) tarjeta.dataset.estado = select.value;
        mensaje("Estado de alerta actualizado.");
    };

    window.atenderAlerta = boton => {
        const tarjeta = boton.closest(".alerta-card");
        const select = tarjeta?.querySelector(".estado-alerta");

        if (tarjeta) tarjeta.dataset.estado = "Atendida";
        if (select) select.value = "Atendida";
        mensaje("Alerta marcada como atendida.");
    };

    window.verCaso = usuario => mensaje(`Mostrando el caso de ${usuario}.`);
    window.asignarProfesional = () => mensaje("Profesional asignado correctamente.");
    window.aprobarContenido = () => mensaje("Contenido aprobado.");
    window.rechazarContenido = () => mensaje("Contenido rechazado.");
    window.publicarCampana = () => mensaje("Campaña publicada correctamente.");

    actualizarUsuarios();
});
const listaContenido = document.querySelector("#listaContenido");
const buscarContenido = document.querySelector("#buscarContenido");
const filtroContenido = document.querySelector("#filtroContenido");
const contadorPendientes = document.querySelector("#contadorPendientes");
const sinResultados = document.querySelector("#sinResultados");
const modalContenido = document.querySelector("#modalContenido");
const modalRechazo = document.querySelector("#modalRechazo");
const motivoRechazo = document.querySelector("#motivoRechazo");
const notificacion = document.querySelector("#notificacion");

let tarjetaActual;

function mostrarNotificacion(mensaje) {
    notificacion.textContent = mensaje;
    notificacion.classList.add("show");

    setTimeout(() => {
        notificacion.classList.remove("show");
    }, 3000);
}

function actualizarPendientes() {
    const total = listaContenido.querySelectorAll(".content-card").length;

    contadorPendientes.textContent = total;
    sinResultados.hidden = total !== 0;
}

function filtrarContenido() {
    const texto = buscarContenido.value.toLowerCase().trim();
    const tipo = filtroContenido.value;
    let visibles = 0;

    listaContenido.querySelectorAll(".content-card").forEach(tarjeta => {
        const datos = tarjeta.dataset;

        const coincideTexto =
            `${datos.titulo} ${datos.autor} ${datos.tipo}`
                .toLowerCase()
                .includes(texto);

        const coincideTipo =
            tipo === "todos" || datos.tipo === tipo;

        tarjeta.hidden = !(coincideTexto && coincideTipo);

        if (!tarjeta.hidden) {
            visibles++;
        }
    });

    sinResultados.hidden = visibles !== 0;
}

buscarContenido.addEventListener("input", filtrarContenido);
filtroContenido.addEventListener("change", filtrarContenido);

listaContenido.addEventListener("click", event => {
    const tarjeta = event.target.closest(".content-card");

    if (!tarjeta) return;

    const datos = tarjeta.dataset;

    if (event.target.closest(".ver-contenido")) {
        document.querySelector("#modalTipo").textContent = datos.tipo;
        document.querySelector("#modalTitulo").textContent = datos.titulo;
        document.querySelector("#modalAutor").textContent = datos.autor;
        document.querySelector("#modalFecha").textContent = datos.fecha;
        document.querySelector("#modalCategoria").textContent = datos.categoria;
        document.querySelector("#modalCuerpo").textContent = datos.cuerpo;

        modalContenido.showModal();
    }

    if (event.target.closest(".approve")) {
        const confirmar = confirm(
            `¿Deseas aprobar "${datos.titulo}"?`
        );

        if (confirmar) {
            tarjeta.remove();
            actualizarPendientes();
            mostrarNotificacion("Contenido aprobado correctamente.");
        }
    }

    if (event.target.closest(".reject")) {
        tarjetaActual = tarjeta;
        motivoRechazo.value = "";

        document.querySelector("#tituloRechazo").textContent =
            `Rechazar: ${datos.titulo}`;

        modalRechazo.showModal();
    }
});

document.querySelector(".cerrar-modal").addEventListener("click", () => {
    modalContenido.close();
});

document.querySelector("#confirmarRechazo").addEventListener("click", event => {
    if (!motivoRechazo.value.trim()) {
        event.preventDefault();
        motivoRechazo.reportValidity();
        return;
    }

    tarjetaActual.remove();
    actualizarPendientes();

    mostrarNotificacion("Contenido rechazado y motivo registrado.");
});
const formCampaña = document.querySelector("#formCampaña");
const tituloCampaña = document.querySelector("#tituloCampaña");
const descripcionCampaña = document.querySelector("#descripcionCampaña");
const categoriaCampaña = document.querySelector("#categoriaCampaña");
const fechaCampaña = document.querySelector("#fechaCampaña");
const archivoCampaña = document.querySelector("#archivoCampaña");

const nombreArchivo = document.querySelector("#nombreArchivo");
const previewTitulo = document.querySelector("#previewTitulo");
const previewDescripcion = document.querySelector("#previewDescripcion");
const previewCategoria = document.querySelector("#previewCategoria");
const previewFecha = document.querySelector("#previewFecha");
const previewMultimedia = document.querySelector("#previewMultimedia");
const imagenPreview = document.querySelector("#imagenPreview");
const videoPreview = document.querySelector("#videoPreview");

const listaCampañas = document.querySelector("#listaCampañas");
const sinCampañas = document.querySelector("#sinCampañas");
const contadorCampañas = document.querySelector("#contadorCampañas");

let totalCampañas = 0;

function actualizarVistaPrevia() {
    previewTitulo.textContent =
        tituloCampaña.value.trim() || "Título de la campaña";

    previewDescripcion.textContent =
        descripcionCampaña.value.trim() ||
        "La descripción de tu campaña aparecerá aquí.";

    previewCategoria.textContent = categoriaCampaña.value;

    previewFecha.textContent = fechaCampaña.value
        ? `Publicación: ${new Date(
            `${fechaCampaña.value}T12:00:00`
        ).toLocaleDateString("es-CO", {
            day: "numeric",
            month: "long",
            year: "numeric"
        })}`
        : "Publicación pendiente";
}

tituloCampaña.addEventListener("input", actualizarVistaPrevia);
descripcionCampaña.addEventListener("input", actualizarVistaPrevia);
categoriaCampaña.addEventListener("change", actualizarVistaPrevia);
fechaCampaña.addEventListener("change", actualizarVistaPrevia);

archivoCampaña.addEventListener("change", () => {
    const archivo = archivoCampaña.files[0];

    imagenPreview.hidden = true;
    videoPreview.hidden = true;
    previewMultimedia.hidden = true;

    if (!archivo) {
        nombreArchivo.textContent = "No se ha seleccionado ningún archivo";
        return;
    }

    if (archivo.size > 10 * 1024 * 1024) {
        alert("El archivo no puede superar los 10 MB.");
        archivoCampaña.value = "";
        nombreArchivo.textContent = "No se ha seleccionado ningún archivo";
        return;
    }

    nombreArchivo.textContent = archivo.name;
    previewMultimedia.hidden = false;

    const archivoURL = URL.createObjectURL(archivo);

    if (archivo.type.startsWith("image/")) {
        imagenPreview.src = archivoURL;
        imagenPreview.hidden = false;
    }

    if (archivo.type.startsWith("video/")) {
        videoPreview.src = archivoURL;
        videoPreview.hidden = false;
    }
});

formCampaña.addEventListener("submit", event => {
    event.preventDefault();

    const titulo = tituloCampaña.value.trim();
    const descripcion = descripcionCampaña.value.trim();

    if (!titulo || !descripcion || !fechaCampaña.value) {
        alert("Completa el título, la descripción y la fecha.");
        return;
    }

    const confirmar = confirm(
        `¿Deseas publicar la campaña "${titulo}"?`
    );

    if (!confirmar) return;

    totalCampañas++;

    const fecha = new Date(
        `${fechaCampaña.value}T12:00:00`
    ).toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    sinCampañas.hidden = true;

    listaCampañas.insertAdjacentHTML(
        "afterbegin",
        `
        <article class="published-card">
            <header>
                <span class="preview-category">${categoriaCampaña.value}</span>
                <span class="published-status">Publicada</span>
            </header>

            <h4>${titulo}</h4>
            <p>${descripcion}</p>

            <footer>
                <small>Publicada el ${fecha}</small>
                <button type="button" class="eliminar-campaña">
                    Eliminar
                </button>
            </footer>
        </article>
        `
    );

    contadorCampañas.textContent =
        `${totalCampañas} publicada${totalCampañas === 1 ? "" : "s"}`;

    formCampaña.reset();
    nombreArchivo.textContent = "No se ha seleccionado ningún archivo";
    previewMultimedia.hidden = true;
    actualizarVistaPrevia();

    alert("Campaña publicada correctamente.");
});

document.querySelector("#limpiarCampaña").addEventListener("click", () => {
    setTimeout(() => {
        nombreArchivo.textContent = "No se ha seleccionado ningún archivo";
        previewMultimedia.hidden = true;
        actualizarVistaPrevia();
    }, 0);
});

listaCampañas.addEventListener("click", event => {
    const boton = event.target.closest(".eliminar-campaña");

    if (!boton) return;

    if (!confirm("¿Deseas eliminar esta campaña publicada?")) return;

    boton.closest(".published-card").remove();
    totalCampañas--;

    contadorCampañas.textContent =
        `${totalCampañas} publicada${totalCampañas === 1 ? "" : "s"}`;

    sinCampañas.hidden = totalCampañas !== 0;
});