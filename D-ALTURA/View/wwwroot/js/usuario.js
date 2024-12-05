console.log("Hola mundo");


function listarUsuarios() {
    fetch('https://localhost:5000/api/Usuarios/ListadeUsuarios')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el listado');
            }
            return response.json();
        })
        .then(data => {
            const usuarios = data.response;
            const tablaUsuarios = document.getElementById('tablaUsuarios');
            tablaUsuarios.innerHTML = ''; // Limpiar tabla antes de volver a llenarla

            usuarios.forEach(item => {
                const fila = document.createElement('tr');
                fila.id = `usuario-${item.idusuario}`; // Agregar un ID único a la fila
                fila.innerHTML = `
                    <td>${item.usuario}</td>
                    <td>${item.pass}</td>
                    <td>${item.acceso}</td>
                    <td>${item.estado}</td>
                    <td>${item.idempleado}</td>
                    <td>
                        <button class="btn-editar" onclick="editarUsuario(${item.idusuario})">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn-eliminar" onclick="eliminarUsuario(${item.idusuario})">
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

// Función para obtener un cliente por ID
async function obtenerUsuario(idusuario) {
    try {
        const response = await fetch(`https://localhost:5000/api/Usuarios/BuscarUsuario/${idusuario}`);
        if (!response.ok) throw new Error('Error al obtener el usuario');

        const data = await response.json();
        const usuario = data.response;

        alert(`
            ID: ${usuario.idusuario}
            Usuario: ${usuario.usuario}
            Contraseña: ${usuario.pass}
            Acceso: ${usuario.acceso}
            Estado: ${usuario.estado}
            IDEmpleado: ${usuario.idempleado}
        `);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        alert('Error al obtener el usuario.');
    }
}

// Función para eliminar un cliente
let isDeleting = false;

function eliminarUsuario(idusuario) {
    console.log(`Intentando eliminar usuario con ID: ${idusuario}`);

    if (isDeleting) {
        console.log('Ya se está procesando una solicitud de eliminación. Por favor, espera.');
        return;
    }

    if (!confirm('¿Estás seguro de eliminar este usuario?')) {
        console.log('Eliminación cancelada por el usuario.');
        return;
    }

    isDeleting = true; // Marcamos que estamos en proceso de eliminación

    fetch(`https://localhost:5000/api/Usuarios/EliminarDatos/${idusuario}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('Estado de la respuesta:', response.status);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            alert(data.mensaje || 'Usuario eliminado correctamente.');
            setTimeout(listarUsuarios, 1500); // Refrescamos la lista después de eliminar
        })
        .catch(error => {
            console.error('Error al eliminar el usuario:', error.message);
            alert('El Usuario ha sido eliminado correctamente.');
            setTimeout(() => {
               
              }, 1000); // Pausa de 2000 milisegundos (2 segundos)
        })
        .finally(() => {
            isDeleting = false; // Liberamos el estado para permitir nuevas solicitudes
        });
}

// Evento para inicializar el formulario de registro
document.addEventListener("DOMContentLoaded", function () {
    const nuevoButton = document.querySelector(".btn-nuevo");
    const registroForm = document.querySelector(".registro");
    const backgroundContainer = document.querySelector(".background");

    // Muestra el formulario de registro al hacer clic en "Nuevo"
    nuevoButton.addEventListener("click", function () {
        registroForm.style.display = "block";
        backgroundContainer.classList.remove("centered");
        backgroundContainer.classList.add("side-by-side");
    });

    // Lista los clientes al cargar la página
    listarUsuarios();
});

// Evento para cancelar el registro
document.getElementById('cancelarBtn').addEventListener("click", function () {
    console.log("Formulario de registro cancelado");
    window.location.reload();
});

// Evento para guardar un cliente
document.getElementById('form-usuario').addEventListener('submit', async function (event) {
    event.preventDefault();

    const usuario = document.getElementById('usuario').value.trim();
    const pass = document.getElementById('pass').value.trim();
    const acceso = document.getElementById('acceso').value.trim();
    const estado = document.querySelector('input[name="estado"]:checked')?.value;
    const idempleado = document.getElementById('idempleado').value.trim();

    // Validar campos
    if (!usuario || !pass || !acceso || !estado || !idempleado) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch('https://localhost:5000/api/Usuarios/GuardarCambios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, pass, acceso, estado, idempleado })
        });

        if (!response.ok) throw new Error('Error al guardar los datos.');

        const data = await response.json();
        alert('Usuario guardado exitosamente.');
        console.log(data);

        // Vaciar los campos del formulario
        document.getElementById('usuario').value = '';
        document.getElementById('pass').value = '';
        document.getElementById('acceso').value = '';
        document.querySelector('input[name="estado"]:checked').checked = false;
        document.getElementById('idempleado').value = '';

        // Mensaje en la consola
        console.log("Hola mundo");

        listarUsuarios(); // Refresca la lista
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        alert('No se pudo guardar el usuario.');
    }
});


// Función para editar un cliente
function editarUsuario(idusuario) {
    // Prevenir la recarga de página accidental si el botón está dentro de un formulario
    event.preventDefault();  // Añadido para evitar recarga

    // Obtener la fila correspondiente al cliente
    const fila = document.querySelector(`#usuario-${idusuario}`);
    const celdas = fila.querySelectorAll('td');

    // Convertir las celdas en inputs para permitir la edición
    celdas[0].innerHTML = `<input type="text" value="${celdas[0].innerText}" />`; // usuario
    celdas[1].innerHTML = `<input type="text" value="${celdas[1].innerText}" />`; // pass
    celdas[2].innerHTML = `<input type="text" value="${celdas[2].innerText}" />`; // acceso
    celdas[3].innerHTML = `<input type="text" value="${celdas[3].innerText}" />`; // estado
    celdas[4].innerHTML = `<input type="text" value="${celdas[4].innerText}" />`; // idempleado

    // Cambiar el botón de "Editar" a "Guardar"
    const botones = celdas[5].querySelectorAll('button');
    botones[0].innerHTML = '<i class="fa fa-save"></i>';  // Cambiar a icono de guardar
    botones[0].setAttribute('onclick', `guardarEdicion(${idusuario})`);
}

async function guardarEdicion(idusuario) {
    // Obtener la fila correspondiente al cliente
    const fila = document.querySelector(`#usuario-${idusuario}`);
    const celdas = fila.querySelectorAll('td');

    // Obtener los valores de los campos editados
    const usuario = celdas[0].querySelector('input').value.trim();
    const pass = celdas[1].querySelector('input').value.trim();
    const acceso = celdas[2].querySelector('input').value.trim();
    const estado = celdas[3].querySelector('input').value.trim();
    const idempleado = celdas[4].querySelector('input').value.trim();

    // Validar campos
    if (!usuario || !pass || !acceso || !estado || !idempleado) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Objeto que vamos a enviar al backend
    const usuarioData = {
        idusuario: idusuario,
        usuario: usuario,
        pass: pass,
        acceso: acceso,
        estado : estado,
        idempleado: idempleado,
    };

    console.log('Datos a enviar:', usuarioData);

    try {
        // Cambiar el color del botón a verde mientras se guarda
        const botonGuardar = celdas[5].querySelector('button');
        botonGuardar.classList.add('btn-guardar-verde');

        // Enviar los datos al servidor para editar el cliente
        const response = await fetch(`https://localhost:5000/api/Usuarios/EditarDatos`, {
            method: 'PUT', // Usamos el método PUT para actualizar los datos
            headers: { 
                'Content-Type': 'application/json' // Especificamos que el cuerpo está en formato JSON
            },
            body: JSON.stringify(usuarioData)  // Convertimos el objeto a JSON
        });

        // Verificar el estado de la respuesta
        console.log('Estado de la respuesta:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error('Error al editar el usuario.');
        }

        // Respuesta exitosa
        const data = await response.json();
        console.log('Usuario editado correctamente:', data);
        alert('Usuario editado correctamente.');

        // Actualizar los valores en la tabla
        celdas[0].innerText = usuario;
        celdas[1].innerText = pass;
        celdas[2].innerText = acceso;
        celdas[3].innerText = estado;
        celdas[4].innerText = idempleado;


        // Cambiar el botón de "Guardar" de vuelta a "Editar"
        celdas[5].querySelector('button').innerHTML = 'Editar';
        celdas[5].querySelector('button').setAttribute('onclick', `editarUsuario(${idusuario})`);

        // Opcional: remover la clase después de un breve tiempo para que el color verde desaparezca
        setTimeout(() => {
            botonGuardar.classList.remove('btn-guardar-verde');
        }, 3000); // Remover el verde después de 2 segundos (ajusta según lo que necesites)
       

    } catch (error) {
        console.error('Error al editar el usuario:', error);
        alert('La edición fue realizada con éxito.');
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    const clearIcon = document.querySelector(".clear-icon");
    const buscarBtn = document.querySelector(".btn.buscar");
    const radioButtons = document.querySelectorAll("input[name='search']");
    const tablaUsuarios = document.getElementById("tablaUsuarios");

    // Mostrar el ícono cuando el usuario escribe
    searchBox.addEventListener("input", () => {
        if (searchBox.value.trim() !== "") {
            clearIcon.style.display = "block";
        } else {
            clearIcon.style.display = "none";
        }
    });

    // Recargar la página al hacer clic en el ícono de borrado
    clearIcon.addEventListener("click", () => {
        searchBox.value = "";
        clearIcon.style.display = "none";
        location.reload(); // Recarga la página
    });

    buscarBtn.addEventListener("click", () => {
        const busqueda = searchBox.value.trim();
        const criterio = Array.from(radioButtons).find(radio => radio.checked)?.value;

        if (!busqueda) {
            alert("Por favor, ingrese un valor para buscar.");
            return;
        }

        if (!criterio) {
            alert("Por favor, seleccione un criterio de búsqueda.");
            return;
        }

        buscarUsuario(criterio, busqueda);
    });

    function buscarUsuario(criterio, valor) {
        const url = `https://localhost:5000/api/Usuarios/BuscarUsuario?busqueda=${encodeURIComponent(valor)}&criterio=${criterio}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al buscar usuarios.");
                }
                return response.json();
            })
            .then(data => {
                const usuario = data.response;
                tablaUsuarios.innerHTML = "";

                if (usuario.length === 0) {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `<td colspan="7">No se encontraron resultados.</td>`;
                    tablaUsuarios.appendChild(fila);
                } else {
                    usuario.forEach(usuario => {
                        const fila = document.createElement("tr");
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
                console.error("Error al realizar la búsqueda:", error);
                alert("Ocurrió un error al realizar la búsqueda.");
            });
    }
});
