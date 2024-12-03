console.log("Hola mundo");

// Función para listar producto
function listarInventario() {
    fetch('https://localhost:5000/api/Producto/Listado')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener el listado');
            }
            return response.json();
        })
        .then(data => {
            const productos = data.response;
            const tablaProducto = document.getElementById('tablaProducto');
            tablaProducto.innerHTML = ''; // Limpiar tabla antes de volver a llenarla

            productos.forEach(item => {
                const fila = document.createElement('tr');
                fila.id = `producto-${item.idproducto}`; // Agregar un ID único a la fila
                fila.innerHTML = `
                    <td>${item.codigo}</td>
                    <td>${item.nombre}</td>
                    <td>${item.descripcion}</td>
                    <td>${item.f_ingreso}</td>
                    <td>${item.f_vencimiento}</td>
                    <td>${item.stock}</td>
                    <td>${item.precio_compra}</td>
                    <td>${item.precio_venta}</td>
                    <td>${item.estado}</td>
                    <td>${item.idcategoria}</td>
                    <td>
                        <button class="btn-editar" onclick="editarProducto(${item.idproducto})">
                            <i class="fa fa-edit"></i>
                        </button>
                        <button class="btn-eliminar" onclick="eliminarProducto(${item.idproducto})">
                            <i class="fa fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaProducto.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error al listar inventario:', error);
            alert('No se pudo cargar el listado de productos.');
        });
}

// Función para obtener un producto por ID
async function obtenerProducto(idproducto) {
    try {
        const response = await fetch(`https://localhost:5000/api/Producto/Obtener/${idproducto}`);
        if (!response.ok) throw new Error('Error al obtener el Producto');

        const data = await response.json();
        const producto = data.response;

        alert(`
            ID: ${producto.idproducto}
            Codigo: ${producto.codigo}
            Nombre: ${producto.nombre}
            Descripcion: ${producto.descripcion}
            FechaIngreso: ${producto.f_ingreso}
            FechaVencimiento: ${producto.f_vencimiento}
            Stocks: ${producto.stock}
            PrecioCompra: ${producto.precio_compra}
            PrecioVenta: ${producto.precio_venta}
            Estado: ${producto.estado}
            IDCategoria: ${producto.idcategoria}
        `);
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        alert('Error al obtener el producto.');
    }
}

// Función para eliminar un producto
let isDeleting = false;

function eliminarProducto(idproducto) {
    console.log(`Intentando eliminar producto con ID: ${idproducto}`);

    if (isDeleting) {
        console.log('Ya se está procesando una solicitud de eliminación. Por favor, espera.');
        return;
    }

    if (!confirm('¿Estás seguro de eliminar este Producto?')) {
        console.log('Eliminación cancelada por el usuario.');
        return;
    }

    isDeleting = true; // Marcamos que estamos en proceso de eliminación

    fetch(`https://localhost:5000/api/Producto/Eliminar/{idproducto}`, {
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
            alert(data.mensaje || 'Producto eliminado correctamente.');
            setTimeout(listarInventario, 500); // Refrescamos la lista después de eliminar
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error.message);
            alert('Ocurrió un error al intentar eliminar el producto.');
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

    // Lista los producto al cargar la página
    listarInventario();
});

// Evento para cancelar el registro
document.getElementById('cancelarBtn').addEventListener("click", function () {
    console.log("Formulario de registro cancelado");
    window.location.reload();
});

// Evento para guardar un producto
document.getElementById('form-producto').addEventListener('submit', async function (event) {
    event.preventDefault();
    const codigo = document.getElementById('codigo').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const f_ingreso = document.getElementById('f_ingreso').value.trim();
    const f_vencimiento = document.getElementById('f_vencimiento').value.trim();
    const stock = document.getElementById('stock').value.trim();
    const precio_compra = document.getElementById('precio_compra').value.trim();
    const precio_venta = document.getElementById('precio_venta').value.trim();
    const estado = document.querySelector('input[name="estado"]:checked')?.value;
    const idcategoria = document.getElementById('idcategoria').value.trim();

    // Validar campos
    if (!codigo || !nombre || !descripcion || !f_ingreso || !f_vencimiento || !stock || !precio_compra || !precio_venta || !estado || !idcategoria) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    try {
        const response = await fetch('https://localhost:5000/api/Proveedor/Guardar Cambios', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, nombre, descripcion, f_ingreso, f_vencimiento, stock, precio_compra, precio_venta, estado, idcategoria })
        });

        if (!response.ok) throw new Error('Error al guardar los datos.');

        const data = await response.json();
        alert('Producto guardado exitosamente.');
        console.log(data);

        // Vaciar los campos del formulario
        document.getElementById('codigo').value = '';
        document.getElementById('nombre').value = '';
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
        console.error('Error al guardar el producto:', error);
        alert('No se pudo guardar el producto.');
    }
});


// Función para editar un producto
function editarProducto(idproducto) {
    // Prevenir la recarga de página accidental si el botón está dentro de un formulario
    event.preventDefault();  // Añadido para evitar recarga

    // Obtener la fila correspondiente al producto
    const fila = document.querySelector(`#producto-${idproducto}`);
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
    botones[0].setAttribute('onclick', `guardarEdicion(${idproducto})`);
}


async function guardarEdicion(idproducto) {
    // Obtener la fila correspondiente al producto
    const fila = document.querySelector(`#producto-${idproducto}`);
    const celdas = fila.querySelectorAll('td');

    // Obtener los valores de los campos editados
    const codigo = celdas[0].querySelector('input').value.trim();
    const nombre = celdas[1].querySelector('input').value.trim();
    const descripcion = celdas[2].querySelector('input').value.trim();
    const f_ingreso = celdas[3].querySelector('input').value.trim();
    const f_vencimiento = celdas[4].querySelector('input').value.trim();
    const stock = celdas[5].querySelector('input').value.trim();
    const precio_compra = celdas[6].querySelector('input').value.trim();
    const precio_venta = celdas[7].querySelector('input').value.trim();
    const estado = celdas[8].querySelector('input').value.trim();
    const idcategoria = celdas[9].querySelector('input').value.trim();

    // Validar campos
    if (!codigo || !nombre || !descripcion || !f_ingreso || !f_vencimiento || !stock || !precio_compra || !precio_venta || !estado || !idcategoria) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    // Objeto que vamos a enviar al backend
    const productoData = {
        codigo: codigo,
        nombre: nombre,
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

        // Enviar los datos al servidor para editar el producto
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
            throw new Error('Error al editar el producto.');
        }

        // Respuesta exitosa
        const data = await response.json();
        console.log('Producto editado correctamente:', data);
        alert('Producto editado correctamente.');

        // Actualizar los valores en la tabla
        celdas[0].innerText = codigo;
        celdas[1].innerText = nombre;
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
        celdas[10].querySelector('button').setAttribute('onclick', `editarProducto(${idproducto})`);

        // Opcional: remover la clase después de un breve tiempo para que el color verde desaparezca
        setTimeout(() => {
            botonGuardar.classList.remove('btn-guardar-verde');
        }, 2000); // Remover el verde después de 2 segundos (ajusta según lo que necesites)

    } catch (error) {
        console.error('Error al editar el producto:', error);
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
                    throw new Error("Error al buscar producto.");
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
                    productos.forEach(producto => {
                        const fila = document.createElement("tr");
                        fila.innerHTML = `
                            <td>${producto.codigo}</td>
                            <td>${producto.nombre}</td>
                            <td>${producto.descripcion}</td>
                            <td>${producto.f_ingreso}</td>
                            <td>${producto.f_vencimiento}</td>
                            <td>${producto.stock}</td>
                            <td>${producto.precio_compra}</td>
                            <td>${producto.precio_venta}</td>
                            <td>${producto.estado}</td>
                            <td>${producto.idcategoria}</td>
                            <td>
                                <button class="btn-editar" onclick="editarProducto(${producto.idproducto})">
                                    <i class="fa fa-edit"></i>
                                </button>
                                <button class="btn-eliminar" onclick="eliminarProducto(${producto.idproducto})">
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