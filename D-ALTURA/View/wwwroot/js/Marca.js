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
            Codigo: ${marca.codigo}
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

//Pendiente para revisar
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-marca').addEventListener('submit', function (event) {
        event.preventDefault();

        const nombremarca = document.getElementById('nombremarca').value;
        

        // Validar si hay algún campo vacío
        if (!nombremarca) {
            alert('Por favor, agregue una marca.');
            return;
        }

        // Realizar la solicitud fetch
        fetch('https://localhost:5000/api/Marca/GuardarCambios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombremarca: nombremarca
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

//Pendiente para Revisar, de aqui para abajo
// Evento para guardar una marca
document.getElementById('form-marca').addEventListener('submit', async function (event) {
    event.preventDefault();
    const codigo = document.getElementById('codigo').value.trim();
    const nombreproducto = document.getElementById('nombreproducto').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const f_ingreso = document.getElementById('f_ingreso').value.trim();
    const f_vencimiento = document.getElementById('f_vencimiento').value.trim();
    const stock = document.getElementById('stock').value.trim();
    const precio_compra = document.getElementById('precio_compra').value.trim();
    const precio_venta = document.getElementById('precio_venta').value.trim();
    const estado = document.querySelector('input[name="estado"]:checked')?.value;
    const idcategoria = document.getElementById('idcategoria').value.trim();

    // Validar campos
    if (!codigo || !nombreproducto || !descripcion || !f_ingreso || !f_vencimiento || !stock || !precio_compra || !precio_venta || !estado || !idcategoria) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch('https://localhost:5000/api/Proveedor/Guardar Cambios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, nombreproducto, descripcion, f_ingreso, f_vencimiento, stock, precio_compra, precio_venta, estado, idcategoria })
        });

        if (!response.ok) throw new Error('Error al guardar los datos.');

        const data = await response.json();
        alert('Marca guardada exitosamente.');
        console.log(data);

        // Vaciar los campos del formulario
        document.getElementById('codigo').value = '';
        document.getElementById('nombreproducto').value = '';
        document.getElementById('descripcion').value = '';
        document.getElementById('f_ingreso').value = '';
        document.getElementById('f_vencimiento').value = '';
        document.getElementById('stock').value = '';
        document.getElementById('precio_compra').value = '';
        document.getElementById('precio_venta').value = '';
        document.querySelector('input[name="estado"]:checked').checked = false;
        document.getElementById('idcategoria').value = '';

        // Mensaje en la consola
        console.log("Hola mundo");

        listarInventario(); // Refresca la lista
    } catch (error) {
        console.error('Error al guardar la marca:', error);
        alert('No se pudo guardar la marca.');
    }
});


// Función para editar una marca
function editarProducto(idmarca) {
    // Prevenir la recarga de página accidental si el botón está dentro de un formulario
    event.preventDefault();  // Añadido para evitar recarga

    // Obtener la fila correspondiente ala marca
    const fila = document.querySelector(`#marca-${idmarca}`);
    const celdas = fila.querySelectorAll('td');

    // Convertir las celdas en inputs para permitir la edición
    celdas[0].innerHTML = `<input type="text" value="${celdas[0].innerText}" />`; // Codigo
    celdas[1].innerHTML = `<input type="text" value="${celdas[1].innerText}" />`; // Nombre
    celdas[2].innerHTML = `<input type="text" value="${celdas[2].innerText}" />`; // Descripcion
    celdas[3].innerHTML = `<input type="datetime-local" value="${celdas[3].innerText}" />`; // Fecha Ing
    celdas[4].innerHTML = `<input type="datetime-local" value="${celdas[4].innerText}" />`; // Fecha Ven
    celdas[5].innerHTML = `<input type="number" value="${celdas[5].innerText}" />`; // Stock
    celdas[6].innerHTML = `<input type="number" value="${celdas[6].innerText}" />`; // Precio Com
    celdas[7].innerHTML = `<input type="number" value="${celdas[7].innerText}" />`; // Precio Vent
    celdas[8].innerHTML = `<input type="text" value="${celdas[8].innerText}" />`; // Estado
    celdas[9].innerHTML = `<input type="number" value="${celdas[9].innerText}" />`; // IDCategoria

    // Cambiar el botón de "Editar" a "Guardar"
    const botones = celdas[10].querySelectorAll('button');
    botones[0].innerHTML = '<i class="fa fa-save"></i>';  // Cambiar a icono de guardar
    botones[0].setAttribute('onclick', `guardarEdicion(${idmarca})`);
}


async function guardarEdicion(idmarca) {
    // Obtener la fila correspondiente ala marca
    const fila = document.querySelector(`#marca-${idmarca}`);
    const celdas = fila.querySelectorAll('td');

    // Obtener los valores de los campos editados
    const codigo = celdas[0].querySelector('input').value.trim();
    const nombreproducto = celdas[1].querySelector('input').value.trim();
    const descripcion = celdas[2].querySelector('input').value.trim();
    const f_ingreso = celdas[3].querySelector('input').value.trim();
    const f_vencimiento = celdas[4].querySelector('input').value.trim();
    const stock = celdas[5].querySelector('input').value.trim();
    const precio_compra = celdas[6].querySelector('input').value.trim();
    const precio_venta = celdas[7].querySelector('input').value.trim();
    const estado = celdas[8].querySelector('input').value.trim();
    const idcategoria = celdas[9].querySelector('input').value.trim();

    // Validar campos
    if (!codigo || !nombreproducto || !descripcion || !f_ingreso || !f_vencimiento || !stock || !precio_compra || !precio_venta || !estado || !idcategoria) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Objeto que vamos a enviar al backend
    const productoData = {
        codigo: codigo,
        nombreproducto: nombreproducto,
        descripcion: descripcion,
        f_ingreso: f_ingreso,
        f_vencimiento: f_vencimiento,
        stock: stock,
        precio_compra: precio_compra,
        precio_venta: precio_venta,
        estado: estado,
        idcategoria: idcategoria
    };

    console.log('Datos a enviar:', productoData);

    try {
        // Cambiar el color del botón a verde mientras se guarda
        const botonGuardar = celdas[10].querySelector('button');
        botonGuardar.classList.add('btn-guardar-verde');

        // Enviar los datos al servidor para editar la marca
        const response = await fetch('https://localhost:5000/api/Producto/Editar', {
            method: 'PUT', // Usamos el método PUT para actualizar los datos
            headers: { 
                'Content-Type': 'application/json' // Especificamos que el cuerpo está en formato JSON
            },
            body: JSON.stringify(productoData)  // Convertimos el objeto a JSON
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
        celdas[0].innerText = codigo;
        celdas[1].innerText = nombreproducto;
        celdas[2].innerText = descripcion;
        celdas[3].innerText = f_ingreso;
        celdas[4].innerText = f_vencimiento;
        celdas[5].innerText = stock;
        celdas[6].innerText = precio_compra;
        celdas[7].innerText = precio_venta;
        celdas[8].innerText = estado;
        celdas[9].innerText = idcategoria

        // Cambiar el botón de "Guardar" de vuelta a "Editar"
        celdas[10].querySelector('button').innerHTML = 'Editar';
        celdas[10].querySelector('button').setAttribute('onclick', `editarProducto(${idmarca})`);

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
    const tablaProducto = document.getElementById("tablaProducto");

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

        buscarProducto(criterio, busqueda);
    });

    function buscarProducto(criterio, valor) {
        const url = `https://localhost:5000/api/Producto/BuscarProducto/?busqueda=${encodeURIComponent(valor)}&criterio=${encodeURIComponent(criterio)}`;
        
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error al buscar marca.");
                }
                return response.json();
            })
            .then(data => {
                const productos = data.response; // Asume que la API devuelve un objeto con "response" como clave.
                tablaProducto.innerHTML = "";
    
                if (productos.length === 0) {
                    const fila = document.createElement("tr");
                    fila.innerHTML = `<td colspan="11">No se encontraron resultados.</td>`;
                    tablaProducto.appendChild(fila);
                } else {
                    productos.forEach(marca => {
                        const fila = document.createElement("tr");
                        fila.innerHTML = `
                            <td>${marca.codigo}</td>
                            <td>${marca.nombreproducto}</td>
                            <td>${marca.descripcion}</td>
                            <td>${marca.f_ingreso}</td>
                            <td>${marca.f_vencimiento}</td>
                            <td>${marca.stock}</td>
                            <td>${marca.precio_compra}</td>
                            <td>${marca.precio_venta}</td>
                            <td>${marca.estado}</td>
                            <td>${marca.idcategoria}</td>
                            <td>
                                <button class="btn-editar" onclick="editarProducto(${marca.idmarca})">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn-eliminar" onclick="eliminarProducto(${marca.idmarca})">
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        `;
                        f_ingreso
                        tablaProducto.appendChild(fila);
                    });
                }
            })
            .catch(error => {
                console.error("Error al realizar la búsqueda:", error);
                alert("Ocurrió un error al realizar la búsqueda.");
            });
    }    
});