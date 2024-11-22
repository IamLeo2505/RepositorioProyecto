document.addEventListener("DOMContentLoaded", () => {
    const tablaUsuarios = document.getElementById('tablaUsuarios');
    const nuevoButton = document.querySelector(".btn-nuevo");
    const registroForm = document.querySelector(".registro");
    const backgroundContainer = document.querySelector(".background");
    const cancelarBtn = document.getElementById('cancelarBtn');
    const formUsuario = document.getElementById('form-usuario');
    const searchBox = document.querySelector(".search-box");
    const clearIcon = document.querySelector(".clear-icon");
    const buscarBtn = document.querySelector(".btn.buscar");
    const radioButtons = document.querySelectorAll("input[name='search']");
    
    // Cargar la lista de usuarios al cargar la página
    listarUsuarios();

    // Función para listar los usuarios
    function listarUsuarios() {
        fetch('https://localhost:5000/api/Usuarios/ListadeUsuarios')
            .then(response => {
                if (!response.ok) throw new Error('Error al obtener los usuarios');
                return response.json();
            })
            .then(data => {
                const usuarios = data.response;
                tablaUsuarios.innerHTML = '';  // Limpiar tabla

                usuarios.forEach(usuario => {
                    const fila = document.createElement('tr');
                    fila.id = `usuario-${usuario.idusuario}`;
                    fila.innerHTML = `
                        <td>${usuario.usuario}</td>
                        <td>${usuario.pass}</td>
                        <td>${usuario.acceso}</td>
                        <td>${usuario.estado}</td>
                        <td>${usuario.idempleado}</td>
                        <td>
                            <button class="btn-editar" onclick="editarUsuario(${usuario.idusuario})">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.idusuario})">
                                <i class="fa fa-trash"></i>
                            </button>
                        </td>
                    `;
                    tablaUsuarios.appendChild(fila);
                });
            })
            .catch(error => {
                console.error('Error al listar usuarios:', error);
                alert('No se pudo cargar el listado de usuarios.');
            });
    }

    // Función para eliminar un usuario
    let isDeleting = false;

    function eliminarUsuario(id) {
        if (isDeleting) {
            console.log('Ya se está procesando la eliminación.');
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

        isDeleting = true;

        fetch(`https://localhost:5000/api/Usuarios/EliminarDatos/${id}`, {
            method: 'DELETE',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        })
            .then(response => {
                if (!response.ok) throw new Error(`Error ${response.status}`);
                return response.json();
            })
            .then(() => {
                alert('Usuario eliminado correctamente.');
                listarUsuarios();
            })
            .catch(error => {
                console.error('Error al eliminar el usuario:', error);
                alert('Error al eliminar el usuario.');
            })
            .finally(() => {
                isDeleting = false;
            });
    }

    // Función para editar un usuario
    function editarUsuario(id) {
        const fila = document.querySelector(`#usuario-${id}`);
        const celdas = fila.querySelectorAll('td');
        const usuarioData = {
            usuario: celdas[0].innerText,
            pass: celdas[1].innerText,
            acceso: celdas[2].innerText,
            estado: celdas[3].innerText,
            idempleado: celdas[4].innerText
        };

        // Rellenar el formulario con los datos del usuario
        formUsuario.usuario.value = usuarioData.usuario;
        formUsuario.pass.value = usuarioData.pass;
        formUsuario.acceso.value = usuarioData.acceso;
        formUsuario.estado.querySelector(`[value="${usuarioData.estado}"]`).checked = true;
        formUsuario.idempleado.value = usuarioData.idempleado;

        // Cambiar el botón de "Nuevo" a "Guardar"
        const guardarButton = document.getElementById('guardar');
        guardarButton.innerHTML = 'Guardar';
        guardarButton.setAttribute('onclick', `guardarEdicion(${id})`);
    }

    // Función para guardar la edición de un usuario
    async function guardarEdicion(id) {
        const usuario = formUsuario.usuario.value.trim();
        const pass = formUsuario.pass.value.trim();
        const acceso = formUsuario.acceso.value;
        const estado = formUsuario.querySelector('input[name="estado"]:checked')?.value;
        const idempleado = formUsuario.idempleado.value.trim();

        if (!usuario || !pass || !acceso || !estado || !idempleado) {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const usuarioData = { usuario, pass, acceso, estado, idempleado };

        try {
            const response = await fetch(`https://localhost:5000/api/Usuario/Editar/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarioData)
            });

            if (!response.ok) throw new Error('Error al editar el usuario.');

            alert('Usuario editado correctamente.');
            listarUsuarios();  // Refrescar la lista de usuarios
        } catch (error) {
            console.error('Error al editar el usuario:', error);
            alert('Error al editar el usuario.');
        }
    }

    // Evento para mostrar el formulario de registro
    nuevoButton.addEventListener("click", () => {
        registroForm.style.display = "block";
        backgroundContainer.classList.remove("centered");
        backgroundContainer.classList.add("side-by-side");
    });

    // Evento para cancelar el registro
    cancelarBtn.addEventListener("click", () => {
        registroForm.style.display = "none";
    });

    // Evento para buscar usuarios
    buscarBtn.addEventListener("click", () => {
        const busqueda = searchBox.value.trim();
        const criterio = Array.from(radioButtons).find(radio => radio.checked)?.value;

        if (!busqueda || !criterio) {
            alert("Por favor, ingrese un valor para buscar y seleccione un criterio.");
            return;
        }

        buscarUsuario(criterio, busqueda);
    });

    // Función para realizar la búsqueda de usuarios
    function buscarUsuario(criterio, valor) {
        const url = `https://localhost:5000/api/Usuario/Buscar?criterio=${criterio}&valor=${valor}`;

        fetch(url)
            .then(response => {
                if (!response.ok) throw new Error('Error al buscar usuarios.');
                return response.json();
            })
            .then(data => {
                const usuarios = data.response;
                tablaUsuarios.innerHTML = '';

                if (usuarios.length === 0) {
                    tablaUsuarios.innerHTML = '<tr><td colspan="6">No se encontraron resultados.</td></tr>';
                } else {
                    usuarios.forEach(usuario => {
                        const fila = document.createElement('tr');
                        fila.id = `usuario-${usuario.idusuario}`;
                        fila.innerHTML = `
                            <td>${usuario.usuario}</td>
                            <td>${usuario.pass}</td>
                            <td>${usuario.acceso}</td>
                            <td>${usuario.estado}</td>
                            <td>${usuario.idempleado}</td>
                            <td>
                                <button class="btn-editar" onclick="editarUsuario(${usuario.idusuario})">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn-eliminar" onclick="eliminarUsuario(${usuario.idusuario})">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        `;
                        tablaUsuarios.appendChild(fila);
                    });
                }
            })
            .catch(error => {
                console.error('Error al realizar la búsqueda:', error);
                alert('Ocurrió un error al realizar la búsqueda.');
            });
    }
});
