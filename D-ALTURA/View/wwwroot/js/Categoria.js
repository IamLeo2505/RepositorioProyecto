// Pendiente temporalmente
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-categoria').addEventListener('submit', function (event) {
        event.preventDefault();

        const descripcion = document.getElementById('descripcion').value;
        

        // Validar si hay algún campo vacío
        if (!descripcion) {
            alert('Por favor, agregue una categoría.');
            return;
        }

        // Realizar la solicitud fetch
        fetch('https://localhost:5000/api/Categoría/GuardarCambios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                descripcion: descripcion
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            alert('Los datos se han guardado exitosamente.');
            console.log(data);
        })
        .catch(error => {
            alert('Error: ' + error.message);
            console.error('Error:', error);
        });
    });
});

// Función para listar Categoria
function listarCategoria() {
    fetch('https://localhost:5000/api/Categoría/Listado de Categorías')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el listado');
            }
            return response.json();
        })
        .then(data => {
            const categorias = data.response;
            const tablaCategoria = document.getElementById('tablaCategoria');
            tablaCategoria.innerHTML = ''; // Limpiar tabla antes de volver a llenarla

            categorias.forEach(item => {
                const fila = document.createElement('tr');
                fila.id = `categoria-${item.idcategoria}`; // Agregar un ID único a la fila
                fila.innerHTML = `
                    <td>${item.descripcion}</td>
                    <td>
                        <button class="btn-editar" onclick="editarProducto(${item.idcategoria})">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn-eliminar" onclick="eliminarProducto(${item.idcategoria})">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaCategoria.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al listar inventario:', error);
            alert('No se pudo cargar el listado de categorias.');
        });
}

// Función para obtener una categoria por ID
async function obtenerMarca(idcategoria) {
    try {
        const response = await fetch(`https://localhost:5000/api/Categoría/Obtener/${idcategoria}`);
        if (!response.ok) throw new Error('Error al obtener la Categoria');

        const data = await response.json();
        const categoria = data.response;

        alert(`
            ID: ${categoria.idcategoria}
            Descripcion: ${categoria.descripcion}
        `);
    } catch (error) {
        console.error('Error al obtener la categoria:', error);
        alert('Error al obtener la categoria.');
    }
}

// Función para eliminar una categoria
let isDeleting = false;

function eliminarMarca(idcategoria) {
    console.log(`Intentando eliminar categoria con ID: ${idcategoria}`);

    if (isDeleting) {
        console.log('Ya se está procesando una solicitud de eliminación. Por favor, espera.');
        return;
    }

    if (!confirm('¿Estás seguro de eliminar esta Categoria?')) {
        console.log('Eliminación cancelada por el usuario.');
        return;
    }

    isDeleting = true; // Marcamos que estamos en proceso de eliminación

    fetch(`https://localhost:5000/api/Categoría/EliminarDatos/${idcategoria}`, {
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
            alert(data.mensaje || 'Categoria eliminada correctamente.');
            setTimeout(listarMarcas, 500); // Refrescamos la lista después de eliminar
        })
        .catch(error => {
            console.error('Error al eliminar la categoria:', error.message);
            alert('Ocurrió un error al intentar eliminar la categoria.');
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
    listarCategoria();
});

// Evento para cancelar el registro
document.getElementById('cancelarBtn').addEventListener("click", function () {
    console.log("Formulario de registro cancelado");
    window.location.reload();
});

// Evento para guardar una categoria
document.getElementById('form-categoria').addEventListener('submit', async function (event) {
    event.preventDefault();
    const descripcion = document.getElementById('descripcion').value.trim();

    // Validar campos
    if (!descripcion) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch('https://localhost:5000/api/Categoría/GuardarCambios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ descripcion })
        });

        if (!response.ok) throw new Error('Error al guardar los datos.');

        const data = await response.json();
        alert('Categoria guardada exitosamente.');
        console.log(data);

        // Vaciar los campos del formulario
        document.getElementById('descripcion').value = '';

        // Mensaje en la consola
        console.log("Hola mundo");

        listarCategoria(); // Refresca la lista
    } catch (error) {
        console.error('Error al guardar la categoria:', error);
        alert('No se pudo guardar la categoria.');
    }
});


// Función para editar una categoria
function editarMarca(idcategoria) {
    // Prevenir la recarga de página accidental si el botón está dentro de un formulario
    event.preventDefault();  // Añadido para evitar recarga

    // Obtener la fila correspondiente ala categoria
    const fila = document.querySelector(`#categoria-${idcategoria}`);
    const celdas = fila.querySelectorAll('td');

    // Convertir las celdas en inputs para permitir la edición
    celdas[0].innerHTML = `<input type="text" value="${celdas[0].innerText}" />`; // ID Categoria
    celdas[1].innerHTML = `<input type="text" value="${celdas[1].innerText}" />`; // Nombre Categoria

    // Cambiar el botón de "Editar" a "Guardar"
    const botones = celdas[2].querySelectorAll('button');
    botones[0].innerHTML = '<i class="fa fa-save"></i>';  // Cambiar a icono de guardar
    botones[0].setAttribute('onclick', `guardarEdicion(${idcategoria})`);
}


async function guardarEdicion(idcategoria) {
    // Obtener la fila correspondiente ala categoria
    const fila = document.querySelector(`#categoria-${idcategoria}`);
    const celdas = fila.querySelectorAll('td');

    // Obtener los valores de los campos editados
    const descripcion = celdas[1].querySelector('input').value.trim();

    // Validar campos
    if (!descripcion) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Objeto que vamos a enviar al backend
    const marcaData = {
        descripcion: descripcion
    };

    console.log('Datos a enviar:', marcaData);

    try {
        // Cambiar el color del botón a verde mientras se guarda
        const botonGuardar = celdas[2].querySelector('button');
        botonGuardar.classList.add('btn-guardar-verde');

        // Enviar los datos al servidor para editar la categoria
        const response = await fetch('https://localhost:5000/api/Categoría/EditarDatos', {
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
            throw new Error('Error al editar la categoria.');
        }

        // Respuesta exitosa
        const data = await response.json();
        console.log('Categoria editada correctamente:', data);
        alert('Categoria editada correctamente.');

        // Actualizar los valores en la tabla
        celdas[0].innerHTML = idcategoria;
        celdas[1].innerText = descripcion;

        // Cambiar el botón de "Guardar" de vuelta a "Editar"
        celdas[2].querySelector('button').innerHTML = 'Editar';
        celdas[2].querySelector('button').setAttribute('onclick', `editarProducto(${idcategoria})`);

        // Opcional: remover la clase después de un breve tiempo para que el color verde desaparezca
        setTimeout(() => {
            botonGuardar.classList.remove('btn-guardar-verde');
        }, 2000); // Remover el verde después de 2 segundos (ajusta según lo que necesites)

    } catch (error) {
        console.error('Error al editar la categoria:', error);
        alert('La edición fue realizada con éxito.');
    }
}


document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.querySelector(".search-box");
    const clearIcon = document.querySelector(".clear-icon");
    const buscarBtn = document.querySelector(".btn.buscar");
    const radioButtons = document.querySelectorAll("input[name='search']");
    const tablaCategoria = document.getElementById("tablaCategoria");

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
        const url = `https://localhost:5000/api/Categoría/BuscarCategoria/?busqueda=${encodeURIComponent(valor)}&criterio=${encodeURIComponent(criterio)}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al buscar categoria.");
                }
                return response.json();
            })
            .then(data => {
                const categorias = data.response; // Asume que la API devuelve un objeto con "response" como clave.
                tablaCategoria.innerHTML = "";
    
                if (categorias.length === 0) {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `<td colspan="11">No se encontraron resultados.</td>`;
                    tablaCategoria.appendChild(fila);
                } else {
                    categorias.forEach(categoria => {
                        const fila = document.createElement("tr");
                        fila.innerHTML = `
                            <td>${categoria.idcategoria}</td>
                            <td>${categoria.descripcion}</td>
                            <td>
                                <button class="btn-editar" onclick="editarProducto(${categoria.idcategoria})">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn-eliminar" onclick="eliminarProducto(${categoria.idcategoria})">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        `;
                        tablaCategoria.appendChild(fila);
                    });
                }
            })
            .catch(error => {
                console.error("Error al realizar la búsqueda:", error);
                alert("Ocurrió un error al realizar la búsqueda.");
            });
    }    
});