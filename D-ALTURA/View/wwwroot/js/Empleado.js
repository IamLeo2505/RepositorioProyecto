// Función para listar clientes
function listarEmpleados() {
    fetch('https://localhost:5000/api/Empleado/ListadeEmpleados')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el listado');
            }
            return response.json();
        })
        .then(data => {
            const empleados = data.response;
            const tablaEmpleado = document.getElementById('tablaEmpleado');
            tablaEmpleado.innerHTML = ''; // Limpiar tabla antes de volver a llenarla

            empleados.forEach(item => {
                const fila = document.createElement('tr');
                fila.id = `empleado-${item.idempleado}`; // Agregar un ID único a la fila
                fila.innerHTML = `
                    <td>${item.nombre}</td>
                    <td>${item.apellidos}</td>
                    <td>${item.dni}</td>
                    <td>${item.telefono}</td>
                    <td>${item.direccion}</td>
                    <td>${item.estado}</td>
                    <td>
                        <button class="btn-editar" onclick="editarEmpleado(${item.idempleado})">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn-eliminar" onclick="eliminarEmpleado(${item.idempleado})">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaEmpleado.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al listar empleados:', error);
            alert('No se pudo cargar el listado de empleados.');
        });
}

// Función para obtener un cliente por ID
async function obtenerEmpleado(idempleado) {
    try {
        const response = await fetch(`https://localhost:5000/api/Empleado/Obtener/${idempleado}`);
        if (!response.ok) throw new Error('Error al obtener el empleado');

        const data = await response.json();
        const empleado = data.response;

        alert(`
            ID: ${empleado.idempleado}
            Nombre: ${empleado.nombre}
            Apellidos: ${empleado.apellidos}
            DNI: ${empleado.dni}
            Teléfono: ${empleado.telefono}
            Dirección: ${empleado.direccion}
            Estado: ${empleado.estado}
        `);
    } catch (error) {
        console.error('Error al obtener el empleado:', error);
        alert('Error al obtener el empleado.');
    }
}

// Función para eliminar un cliente
let isDeleting = false;

function eliminarEmpleado(idempleado) {
    console.log(`Intentando eliminar empleado con ID: ${idempleado}`);

    if (isDeleting) {
        console.log('Ya se está procesando una solicitud de eliminación. Por favor, espera.');
        return;
    }

    if (!confirm('¿Estás seguro de eliminar este empleado?')) {
        console.log('Eliminación cancelada por el usuario.');
        return;
    }

    isDeleting = true; // Marcamos que estamos en proceso de eliminación

    fetch(`https://localhost:5000/api/Empleado/EliminarDatos/${idempleado}`, {
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
            alert(data.mensaje || 'Empleado eliminado correctamente.');
            setTimeout(listarEmpleados, 500); // Refrescamos la lista después de eliminar
        })
        .catch(error => {
            console.error('Error al eliminar el empleado:', error.message);
            alert('Ocurrió un error al intentar eliminar el empleado.');
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
    listarEmpleados();
});

// Evento para cancelar el registro
document.getElementById('cancelarBtn').addEventListener("click", function () {
    console.log("Formulario de registro cancelado");
    window.location.reload();
});

// Evento para guardar un cliente
document.getElementById('form-empleado').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const estado = document.querySelector('input[name="estado"]:checked')?.value;

    // Validar campos
    if (!nombre || !apellidos || !dni || !telefono || !direccion || !estado) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch('https://localhost:5000/api/Empleado/GuardarCambios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, apellidos, dni, telefono, direccion, estado })
        });

        if (!response.ok) throw new Error('Error al guardar los datos.');

        const data = await response.json();
        alert('Empleado guardado exitosamente.');
        console.log(data);

        // Vaciar los campos del formulario
        document.getElementById('nombre').value = '';
        document.getElementById('apellidos').value = '';
        document.getElementById('dni').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('direccion').value = '';
        document.querySelector('input[name="estado"]:checked').checked = false;

        // Mensaje en la consola
        console.log("Hola mundo");

        listarClientes(); // Refresca la lista
    } catch (error) {
        console.error('Error al guardar el empleado:', error);
        alert('No se pudo guardar el empleado.');
    }
});


// Función para editar un cliente
function editarEmpleado(idempleado) {
    // Prevenir la recarga de página accidental si el botón está dentro de un formulario
    event.preventDefault();  // Añadido para evitar recarga

    // Obtener la fila correspondiente al cliente
    const fila = document.querySelector(`#empleado-${idempleado}`);
    const celdas = fila.querySelectorAll('td');

    // Convertir las celdas en inputs para permitir la edición
    celdas[0].innerHTML = `<input type="text" value="${celdas[0].innerText}" />`; // Nombre
    celdas[1].innerHTML = `<input type="text" value="${celdas[1].innerText}" />`; // Apellidos
    celdas[2].innerHTML = `<input type="text" value="${celdas[2].innerText}" />`; // RUC
    celdas[3].innerHTML = `<input type="text" value="${celdas[3].innerText}" />`; // DNI
    celdas[4].innerHTML = `<input type="text" value="${celdas[4].innerText}" />`; // Teléfono
    celdas[5].innerHTML = `<input type="text" value="${celdas[5].innerText}" />`; // Estado

    // Cambiar el botón de "Editar" a "Guardar"
    const botones = celdas[6].querySelectorAll('button');
    botones[0].innerHTML = '<i class="fa fa-save"></i>';  // Cambiar a icono de guardar
    botones[0].setAttribute('onclick', `guardarEdicion(${idempleado})`);
}

async function guardarEdicion(idempleado) {
    // Obtener la fila correspondiente al cliente
    const fila = document.querySelector(`#empleado-${idempleado}`);
    const celdas = fila.querySelectorAll('td');

    // Obtener los valores de los campos editados
    const nombre = celdas[0].querySelector('input').value.trim();
    const apellidos = celdas[1].querySelector('input').value.trim();
    const dni = celdas[2].querySelector('input').value.trim();
    const telefono = celdas[3].querySelector('input').value.trim();
    const direccion = celdas[4].querySelector('input').value.trim();
    const estado = celdas[5].querySelector('input').value.trim();

    // Validar campos
    if (!nombre || !apellidos || !dni || !telefono || !direccion || !estado) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Objeto que vamos a enviar al backend
    const empleadoData = {
        idempleado: idempleado,
        nombre: nombre,
        apellidos: apellidos,
        dni: dni,
        telefono: telefono,
        direccion: direccion,
        estado: estado
    };

    console.log('Datos a enviar:', empleadoData);

    try {
        // Cambiar el color del botón a verde mientras se guarda
        const botonGuardar = celdas[6].querySelector('button');
        botonGuardar.classList.add('btn-guardar-verde');

        // Enviar los datos al servidor para editar el cliente
        const response = await fetch(`https://localhost:5000/api/Empleado/EditarDatos`, {
            method: 'PUT', // Usamos el método PUT para actualizar los datos
            headers: { 
                'Content-Type': 'application/json' // Especificamos que el cuerpo está en formato JSON
            },
            body: JSON.stringify(empleadoData)  // Convertimos el objeto a JSON
        });

        // Verificar el estado de la respuesta
        console.log('Estado de la respuesta:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error('Error al editar el empleado.');
        }

        // Respuesta exitosa
        const data = await response.json();
        console.log('Empleado editado correctamente:', data);
        alert('Empleado editado correctamente.');

        // Actualizar los valores en la tabla
        celdas[1].innerText = nombre;
        celdas[2].innerText = apellidos;
        celdas[3].innerText = dni;
        celdas[4].innerText = telefono;
        celdas[5].innerText = direccion;
        celdas[6].innerText = estado;

        // Cambiar el botón de "Guardar" de vuelta a "Editar"
        celdas[6].querySelector('button').innerHTML = 'Editar';
        celdas[6].querySelector('button').setAttribute('onclick', `editarEmpleado(${idempleado})`);

        // Opcional: remover la clase después de un breve tiempo para que el color verde desaparezca
        setTimeout(() => {
            botonGuardar.classList.remove('btn-guardar-verde');
        }, 2000); // Remover el verde después de 2 segundos (ajusta según lo que necesites)

    } catch (error) {
        console.error('Error al editar el Empleado:', error);
        alert('La edición fue realizada con éxito.');
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    const clearIcon = document.querySelector(".clear-icon");
    const buscarBtn = document.querySelector(".btn.buscar");
    const radioButtons = document.querySelectorAll("input[name='search']");
    const tablaCliente = document.getElementById("tablaCliente");

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

        buscarEmpleado(criterio, busqueda);
    });

    function buscarEmpleado(criterio, valor) {
        const url = `https://localhost:5000/api/Empleado/BuscarEmpleado?busqueda=${encodeURIComponent(valor)}&criterio=${criterio}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al buscar empleados.");
                }
                return response.json();
            })
            .then(data => {
                const empleados = data.response;
                tablaEmpleado.innerHTML = "";

                if (empleados.length === 0) {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `<td colspan="7">No se encontraron resultados.</td>`;
                    tablaEmpleado.appendChild(fila);
                } else {
                    empleados.forEach(empleado => {
                        const fila = document.createElement("tr");
                        fila.innerHTML = `
                            <td>${cliente.nombre}</td>
                            <td>${cliente.apellidos}</td>
                            <td>${cliente.dni}</td>
                            <td>${cliente.telefono}</td>
                            <td>${cliente.direccion}</td>
                            <td>${cliente.estado}</td>
                            <td>
                                <button class="btn-editar" onclick="editarEmpleado(${empleado.idempleado})">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn-eliminar" onclick="eliminarEmpleado(${empleado.idempleado})">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        `;
                        tablaEmpleado.appendChild(fila);
                    });
                }
            })
            .catch(error => {
                console.error("Error al realizar la búsqueda:", error);
                alert("Ocurrió un error al realizar la búsqueda.");
            });
    }
});