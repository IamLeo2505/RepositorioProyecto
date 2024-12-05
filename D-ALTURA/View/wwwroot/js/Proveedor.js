console.log("Hola mundo");


function listarProveedor() {
    fetch('https://localhost:5000/api/Proveedor/Listado')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el listado');
            }
            return response.json();
        })
        .then(data => {
            const proveedores = data.response;
            const tablaProveedor = document.getElementById('tablaProveedor');
            tablaProveedor.innerHTML = ''; // Limpiar tabla antes de volver a llenarla

            proveedores.forEach(item => {
                const fila = document.createElement('tr');
                fila.id = `proveedor-${item.idproveedor}`; // Agregar un ID único a la fila
                fila.innerHTML = `
                    <td>${item.razonsocial}</td>
                    <td>${item.dni}</td>
                    <td>${item.ruc}</td>
                    <td>${item.telefono}</td>
                    <td>${item.direccion}</td>
                    <td>${item.estado}</td>
                    <td>
                        <button class="btn-editar" onclick="editarProveedor(${item.idproveedor})">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn-eliminar" onclick="eliminarProveedor(${item.idproveedor})">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaProveedor.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al listar proveedores:', error);
            alert('No se pudo cargar el listado de proveedores.');
        });
}

// Función para obtener un cliente por ID
async function obtenerProveedor(idproveedor) {
    try {
        const response = await fetch(`https://localhost:5000/api/Proveedor/Obtener/${idproveedor}`);
        if (!response.ok) throw new Error('Error al obtener el proveedor');

        const data = await response.json();
        const proveedor = data.response;

        alert(`
            ID: ${proveedor.idproveedor}
            Razón Social: ${proveedor.razonsocial}
            DNI: ${proveedor.dni}
            RUC: ${proveedor.ruc}
            Teléfono: ${proveedor.telefono}
            Dirección: ${proveedor.direccion}
            Estado: ${proveedor.estado}
        `);
    } catch (error) {
        console.error('Error al obtener el proveedor:', error);
        alert('Error al obtener el proveedor.');
    }
}

// Función para eliminar un cliente
let isDeleting = false;

function eliminarProveedor(idproveedor) {
    console.log(`Intentando eliminar proveedor con ID: ${idproveedor}`);

    if (isDeleting) {
        console.log('Ya se está procesando una solicitud de eliminación. Por favor, espera.');
        return;
    }

    if (!confirm('¿Estás seguro de eliminar este proveedor?')) {
        console.log('Eliminación cancelada por el usuario.');
        return;
    }

    isDeleting = true; // Marcamos que estamos en proceso de eliminación

    fetch(`https://localhost:5000/api/Proveedor/EliminarDatos/${idproveedor}`, {
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
            alert(data.mensaje || 'Proveedor eliminado correctamente.');
            setTimeout(listarProveedor, 500); // Refrescamos la lista después de eliminar
        })
        .catch(error => {
            console.error('Error al eliminar el proveedor:', error.message);
            alert('Ocurrió un error al intentar eliminar el proveedor.');
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
    listarProveedor();
});

// Evento para cancelar el registro
document.getElementById('cancelarBtn').addEventListener("click", function () {
    console.log("Formulario de registro cancelado");
    window.location.reload();
});

// Evento para guardar un cliente
document.getElementById('form-proveedor').addEventListener('submit', async function (event) {
    event.preventDefault();

    const razonsocial = document.getElementById('razonsocial').value.trim();
    const dni = document.getElementById('dni').value.trim();
    const ruc = document.getElementById('ruc').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const estado = document.querySelector('input[name="estado"]:checked')?.value;

    // Validar campos
    if (!razonsocial || !dni || !ruc || !telefono || !direccion || !estado) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch('https://localhost:5000/api/Proveedor/GuardarCambios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ razonsocial, dni, ruc, telefono, direccion, estado })
        });

        if (!response.ok) throw new Error('Error al guardar los datos.');

        const data = await response.json();
        alert('Proveedor guardado exitosamente.');
        console.log(data);

        // Vaciar los campos del formulario
        document.getElementById('razonsocial').value = '';
        document.getElementById('dni').value = '';
        document.getElementById('ruc').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('direccion').value = '';
        document.querySelector('input[name="estado"]:checked').checked = false;

        // Mensaje en la consola
        console.log("Hola mundo");

        listarProveedor(); // Refresca la lista
    } catch (error) {
        console.error('Error al guardar el proveedor:', error);
        alert('No se pudo guardar el proveedor.');
    }
});


// Función para editar un cliente
function editarProveedor(idproveedor) {
    // Prevenir la recarga de página accidental si el botón está dentro de un formulario
    event.preventDefault();  // Añadido para evitar recarga

    // Obtener la fila correspondiente al cliente
    const fila = document.querySelector(`#proveedor-${idproveedor}`);
    const celdas = fila.querySelectorAll('td');

    // Convertir las celdas en inputs para permitir la edición
    celdas[0].innerHTML = `<input type="text" value="${celdas[0].innerText}" />`; // razonsocial
    celdas[1].innerHTML = `<input type="text" value="${celdas[1].innerText}" />`; // dni
    celdas[2].innerHTML = `<input type="text" value="${celdas[2].innerText}" />`; // RUC
    celdas[3].innerHTML = `<input type="text" value="${celdas[3].innerText}" />`; // telefono
    celdas[4].innerHTML = `<input type="text" value="${celdas[4].innerText}" />`; // direccion
    celdas[5].innerHTML = `<input type="text" value="${celdas[5].innerText}" />`; // Estado

    // Cambiar el botón de "Editar" a "Guardar"
    const botones = celdas[6].querySelectorAll('button');
    botones[0].innerHTML = '<i class="fa fa-save"></i>';  // Cambiar a icono de guardar
    botones[0].setAttribute('onclick', `guardarEdicion(${idproveedor})`);
}

async function guardarEdicion(idproveedor) {
    // Obtener la fila correspondiente al cliente
    const fila = document.querySelector(`#proveedor-${idproveedor}`);
    const celdas = fila.querySelectorAll('td');

    // Obtener los valores de los campos editados
    const razonsocial = celdas[0].querySelector('input').value.trim();
    const dni = celdas[1].querySelector('input').value.trim();
    const ruc = celdas[2].querySelector('input').value.trim();
    const telefono = celdas[3].querySelector('input').value.trim();
    const direccion = celdas[4].querySelector('input').value.trim();
    const estado = celdas[5].querySelector('input').value.trim();

    // Validar campos
    if (!razonsocial || !dni || !ruc || !telefono || !direccion || !estado) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Objeto que vamos a enviar al backend
    const proveedorData = {
        idproveedor: idproveedor,
        razonsocial: razonsocial,
        dni: dni,
        ruc: ruc,
        telefono : telefono,
        direccion: direccion,
        estado: estado
    };

    console.log('Datos a enviar:', proveedorData);

    try {
        // Cambiar el color del botón a verde mientras se guarda
        const botonGuardar = celdas[6].querySelector('button');
        botonGuardar.classList.add('btn-guardar-verde');

        // Enviar los datos al servidor para editar el cliente
        const response = await fetch(`https://localhost:5000/api/Proveedor/EditarDatos`, {
            method: 'PUT', // Usamos el método PUT para actualizar los datos
            headers: { 
                'Content-Type': 'application/json' // Especificamos que el cuerpo está en formato JSON
            },
            body: JSON.stringify(proveedorData)  // Convertimos el objeto a JSON
        });

        // Verificar el estado de la respuesta
        console.log('Estado de la respuesta:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error('Error al editar el proveedor.');
        }

        // Respuesta exitosa
        const data = await response.json();
        console.log('Proveedor editado correctamente:', data);
        alert('Proveedor editado correctamente.');

        // Actualizar los valores en la tabla
        celdas[0].innerText = razonsocial;
        celdas[1].innerText = dni;
        celdas[2].innerText = ruc;
        celdas[3].innerText = telefono;
        celdas[4].innerText = direccion;
        celdas[5].innerText = estado;

        // Cambiar el botón de "Guardar" de vuelta a "Editar"
        celdas[6].querySelector('button').innerHTML = 'Editar';
        celdas[6].querySelector('button').setAttribute('onclick', `editarProveedor(${idproveedor})`);

        // Opcional: remover la clase después de un breve tiempo para que el color verde desaparezca
        setTimeout(() => {
            botonGuardar.classList.remove('btn-guardar-verde');
        }, 3000); // Remover el verde después de 2 segundos (ajusta según lo que necesites)
       

    } catch (error) {
        console.error('Error al editar el proveedor:', error);
        alert('La edición fue realizada con éxito.');
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    const clearIcon = document.querySelector(".clear-icon");
    const buscarBtn = document.querySelector(".btn.buscar");
    const radioButtons = document.querySelectorAll("input[name='search']");
    const tablaProveedor = document.getElementById("tablaProveedor");

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

        buscarProveedor(criterio, busqueda);
    });

    function buscarProveedor(criterio, valor) {
        const url = `https://localhost:5000/api/Proveedor/BuscarProveedor?busqueda=${encodeURIComponent(valor)}&criterio=${criterio}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al buscar proveedores.");
                }
                return response.json();
            })
            .then(data => {
                const proveedor = data.response;
                tablaProveedor.innerHTML = "";

                if (proveedor.length === 0) {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `<td colspan="7">No se encontraron resultados.</td>`;
                    tablaProveedor.appendChild(fila);
                } else {
                    proveedor.forEach(proveedor => {
                        const fila = document.createElement("tr");
                        fila.innerHTML = `
                            <td>${proveedor.razonsocial}</td>
                            <td>${proveedor.dni}</td>
                            <td>${proveedor.ruc}</td>
                            <td>${proveedor.telefono}</td>
                            <td>${proveedor.direccion}</td>
                            <td>${proveedor.estado}</td>
                            <td>
                                <button class="btn-editar" onclick="editarProveedor(${proveedor.idproveedor})">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn-eliminar" onclick="eliminarProveedor(${proveedor.idproveedor})">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        `;
                        tablaProveedor.appendChild(fila);
                    });
                }
            })
            .catch(error => {
                console.error("Error al realizar la búsqueda:", error);
                alert("Ocurrió un error al realizar la búsqueda.");
            });
    }
});
