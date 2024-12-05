// Función para listar Marca
function listarMarca() {
    fetch('https://localhost:5000/api/Marca/Listado de Marcas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el listado');
            }
            return response.json();
        })
        .then(data => {
            const marcas = data.response;
            const tablaMarca = document.getElementById('tablaMarca');
            tablaMarca.innerHTML = ''; // Limpiar tabla antes de volver a llenarla

            marcas.forEach(item => {
                const fila = document.createElement('tr');
                fila.id = `marca-${item.idmarca}`; // Agregar un ID único a la fila
                fila.innerHTML = `
                    <td>${item.nombremarca}</td>
                    <td>
                        <button class="btn-editar" onclick="editarProducto(${item.idmarca})">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn-eliminar" onclick="eliminarProducto(${item.idmarca})">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaMarca.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al listar inventario:', error);
            alert('No se pudo cargar el listado de marcas.');
        });
}

// Función para obtener un marca por ID
async function obtenerMarca(idmarca) {
    try {
        const response = await fetch(`https://localhost:5000/api/Marca/Obtener/${idmarca}`);
        if (!response.ok) throw new Error('Error al obtener la Marca');

        const data = await response.json();
        const marca = data.response;

        alert(`
            ID: ${marca.idmarca}
            Nombremarca: ${marca.nombremarca}
        `);
    } catch (error) {
        console.error('Error al obtener la marca:', error);
        alert('Error al obtener la marca.');
    }
}

// Función para eliminar una marca
let isDeleting = false;

function eliminarMarca(idmarca) {
    console.log(`Intentando eliminar marca con ID: ${idmarca}`);

    if (isDeleting) {
        console.log('Ya se está procesando una solicitud de eliminación. Por favor, espera.');
        return;
    }

    if (!confirm('¿Estás seguro de eliminar esta Marca?')) {
        console.log('Eliminación cancelada por el usuario.');
        return;
    }

    isDeleting = true; // Marcamos que estamos en proceso de eliminación

    fetch(`https://localhost:5000/api/Marca/EliminarDatos/${idmarca}`, {
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
            alert(data.mensaje || 'Marca eliminada correctamente.');
            setTimeout(listarMarcas, 500); // Refrescamos la lista después de eliminar
        })
        .catch(error => {
            console.error('Error al eliminar la marca:', error.message);
            alert('Ocurrió un error al intentar eliminar la marca.');
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
    listarMarca();
});

// Evento para cancelar el registro
document.getElementById('cancelarBtn').addEventListener("click", function () {
    console.log("Formulario de registro cancelado");
    window.location.reload();
});

// Evento para guardar una marca
document.getElementById('form-marca').addEventListener('submit', async function (event) {
    event.preventDefault();
    const nombremarca = document.getElementById('nombremarca').value.trim();

    // Validar campos
    if (!nombremarca) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch('https://localhost:5000/api/Marca/GuardarCambios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombremarca })
        });

        if (!response.ok) throw new Error('Error al guardar los datos.');

        const data = await response.json();
        alert('Marca guardada exitosamente.');
        console.log(data);

        // Vaciar los campos del formulario
        document.getElementById('nombremarca').value = '';

        // Mensaje en la consola
        console.log("Hola mundo");

        listarMarca(); // Refresca la lista
    } catch (error) {
        console.error('Error al guardar la marca:', error);
        alert('No se pudo guardar la marca.');
    }
});


// Función para editar una marca
function editarMarca(idmarca) {
    // Prevenir la recarga de página accidental si el botón está dentro de un formulario
    event.preventDefault();  // Añadido para evitar recarga

    // Obtener la fila correspondiente ala marca
    const fila = document.querySelector(`#marca-${idmarca}`);
    const celdas = fila.querySelectorAll('td');

    // Convertir las celdas en inputs para permitir la edición
    celdas[0].innerHTML = `<input type="text" value="${celdas[0].innerText}" />`; // ID Marca
    celdas[1].innerHTML = `<input type="text" value="${celdas[1].innerText}" />`; // Nombre Marca

    // Cambiar el botón de "Editar" a "Guardar"
    const botones = celdas[2].querySelectorAll('button');
    botones[0].innerHTML = '<i class="fa fa-save"></i>';  // Cambiar a icono de guardar
    botones[0].setAttribute('onclick', `guardarEdicion(${idmarca})`);
}


async function guardarEdicion(idmarca) {
    // Obtener la fila correspondiente ala marca
    const fila = document.querySelector(`#marca-${idmarca}`);
    const celdas = fila.querySelectorAll('td');

    // Obtener los valores de los campos editados
    const nombremarca = celdas[1].querySelector('input').value.trim();

    // Validar campos
    if (!nombremarca) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Objeto que vamos a enviar al backend
    const marcaData = {
        nombremarca: nombremarca
    };

    console.log('Datos a enviar:', marcaData);

    try {
        // Cambiar el color del botón a verde mientras se guarda
        const botonGuardar = celdas[2].querySelector('button');
        botonGuardar.classList.add('btn-guardar-verde');

        // Enviar los datos al servidor para editar la marca
        const response = await fetch('https://localhost:5000/api/Marca/EditarDatos', {
            method: 'PUT', // Usamos el método PUT para actualizar los datos
            headers: { 
                'Content-Type': 'application/json' // Especificamos que el cuerpo está en formato JSON
            },
            body: JSON.stringify(marcaData)  // Convertimos el objeto a JSON
        });

        // Verificar el estado de la respuesta
        console.log('Estado de la respuesta:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error del servidor:', errorData);
            throw new Error('Error al editar la marca.');
        }

        // Respuesta exitosa
        const data = await response.json();
        console.log('Marca editado correctamente:', data);
        alert('Marca editado correctamente.');

        // Actualizar los valores en la tabla
        celdas[0].innerHTML = idmarca;
        celdas[1].innerText = nombremarca;

        // Cambiar el botón de "Guardar" de vuelta a "Editar"
        celdas[2].querySelector('button').innerHTML = 'Editar';
        celdas[2].querySelector('button').setAttribute('onclick', `editarProducto(${idmarca})`);

        // Opcional: remover la clase después de un breve tiempo para que el color verde desaparezca
        setTimeout(() => {
            botonGuardar.classList.remove('btn-guardar-verde');
        }, 2000); // Remover el verde después de 2 segundos (ajusta según lo que necesites)

    } catch (error) {
        console.error('Error al editar la marca:', error);
        alert('La edición fue realizada con éxito.');
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    const clearIcon = document.querySelector(".clear-icon");
    const buscarBtn = document.querySelector(".btn.buscar");
    const radioButtons = document.querySelectorAll("input[name='search']");
    const tablaMarca = document.getElementById("tablaMarca");

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

        buscarMarca(criterio, busqueda);
    });

    function buscarMarca(criterio, valor) {
        const url = `https://localhost:5000/api/Producto/BuscarProducto/?busqueda=${encodeURIComponent(valor)}&criterio=${encodeURIComponent(criterio)}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al buscar marca.");
                }
                return response.json();
            })
            .then(data => {
                const marcas = data.response; // Asume que la API devuelve un objeto con "response" como clave.
                tablaMarca.innerHTML = "";
    
                if (marcas.length === 0) {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `<td colspan="11">No se encontraron resultados.</td>`;
                    tablaMarca.appendChild(fila);
                } else {
                    marcas.forEach(marca => {
                        const fila = document.createElement("tr");
                        fila.innerHTML = `
                            <td>${marca.idmarca}</td>
                            <td>${marca.nombremarca}</td>
                            <td>
                                <button class="btn-editar" onclick="editarProducto(${marca.idmarca})">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn-eliminar" onclick="eliminarProducto(${marca.idmarca})">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        `;
                        tablaMarca.appendChild(fila);
                    });
                }
            })
            .catch(error => {
                console.error("Error al realizar la búsqueda:", error);
                alert("Ocurrió un error al realizar la búsqueda.");
            });
    }    
});