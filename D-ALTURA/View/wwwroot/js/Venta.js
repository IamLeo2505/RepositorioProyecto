// Función para calcular el total
function calculartotal(subtotalproducto, impuestoproducto) {
    const subtotal = parseFloat(document.getElementById("subtotal").innerText) + subtotalproducto;
    const impuesto = parseFloat(document.getElementById("impuesto").innerText) + impuestoproducto;
    const total = subtotal + impuesto;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("impuesto").innerText = impuesto.toFixed(2);
    document.getElementById("total").innerText = total.toFixed(2);
}

// Función para buscar cliente
async function buscarCliente() {
    const idcliente = document.getElementById("ClienteID").value;
    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Usuario no autenticado");
        return;
    }

    try {
        const response = await fetch(`https://localhost:5000/api/Cliente/BuscarCliente/${idcliente}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            const cliente = await response.json();
            if (cliente.response && cliente.response.nombre && cliente.response.apellidos) {
                document.getElementById("nombre").value = cliente.response.nombre;
                document.getElementById("apellidos").value = cliente.response.apellidos;
            } else {
                alert("Datos del cliente no encontrados.");
            }
        } else {
            alert("Cliente no encontrado");
        }
    } catch (error) {
        console.error("Error al buscar el cliente:", error);
    }
}

// Función para buscar producto
async function buscarProducto() {
    const codigo = document.getElementById("codigoProducto").value;
    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Usuario no autenticado");
        return;
    }

    try {
        const response = await fetch(`https://localhost:5000/api/Producto/BuscarProducto/${codigo}`);
        if (response.ok) {
            const producto = await response.json();
            if (producto.response) {
                document.getElementById("nombreproducto").value = producto.response.nombre;
                document.getElementById("stock").value = producto.response.stock;
                document.getElementById("precioventa").value = producto.response.precio_venta;
            } else {
                alert("Datos del producto no encontrados.");
            }
        } else {
            alert("Producto no encontrado.");
        }
    } catch (error) {
        console.error("Error al buscar el producto:", error);
    }
}

// Función para decodificar el token JWT
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

// Eventos
document.getElementById("buscarcliente").addEventListener("click", function (event) {
    event.preventDefault();
    buscarCliente();
});

document.getElementById("buscarproducto").addEventListener("click", function (event) {
    event.preventDefault();
    buscarProducto();
});

document.querySelector(".btnagregar").addEventListener("click", function (event) {
    event.preventDefault();

    const precio_venta = parseFloat(document.getElementById("precioventa").value);
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!isNaN(precio_venta) && cantidad > 0) {
        const totalproducto = precio_venta * cantidad;
        const impuestoproducto = totalproducto * (IVA / 100);

        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `
            <td>${document.getElementById("codigoProducto").value}</td>
            <td>${document.getElementById("nombreproducto").value}</td>
            <td>${precio_venta.toFixed(2)}</td>
            <td>${cantidad}</td>
            <td>${(impuestoproducto).toFixed(2)}</td>
            <td>${(totalproducto + impuestoproducto).toFixed(2)}</td>
        `;
        document.querySelector("#productos-table tbody").appendChild(tableRow);
        calculartotal(totalproducto, impuestoproducto);

        document.getElementById("codigoProducto").value = "";
        document.getElementById("nombreproducto").value = "";
        document.getElementById("cantidad").value = "";
    } else {
        alert("Por favor, completa todos los campos.");
    }
});

// Evento para guardar la venta
document.getElementById('venta').addEventListener('submit', async function (event) {
    event.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
        alert("Usuario no autenticado");
        return;
    }

    const decodedToken = parseJwt(token);
    const idusuario = decodedToken.idusuario;

    const ventaData = {
        fecha: document.getElementById("fecha-venta").value,
        serie: document.getElementById("serie").value,
        num_documento: document.getElementById("n-comprobante").value,
        subtotal: parseFloat(document.getElementById("subtotal").innerText),
        iva: parseFloat(document.getElementById("impuesto").innerText),
        total: parseFloat(document.getElementById("total").innerText),
        estado: "activo",
        idusuario: idusuario,
        idcliente: document.getElementById("ClienteID").value
    };

    try {
        const ventaResponse = await fetch("https://localhost:5000/api/Venta/Guardar", {
            method: "POST",
            headers: {
                "accept": "*/*",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(ventaData)
        });

        if (ventaResponse.ok) {
            alert("Venta guardada con éxito");

            // Obtener el ID de la venta recién creada
            const ventaResult = await ventaResponse.json();
            const ventaId = ventaResult.idventa;

            // Guardar el detalle de la venta
            const productosRows = document.querySelectorAll("#productos-table tbody tr");
            for (let row of productosRows) {
                const detalleVenta = {
                    idventa: ventaId,
                    codigo_producto: row.cells[0].innerText,
                    nombre_producto: row.cells[1].innerText,
                    precio_venta: parseFloat(row.cells[2].innerText),
                    cantidad: parseInt(row.cells[3].innerText),
                    impuesto: parseFloat(row.cells[4].innerText),
                    total: parseFloat(row.cells[5].innerText)
                };

                await fetch("https://localhost:5000/api/DetalleVenta/Guardar", {
                    method: "POST",
                    headers: {
                        "accept": "*/*",
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(detalleVenta)
                });
            }
        } else {
            alert("Error al guardar la venta");
        }
    } catch (error) {
        console.error("Error al guardar la venta y sus detalles:", error);
    }
});

// Eliminar último producto agregado
document.querySelector(".btneliminar").addEventListener("click", function () {
    const row = document.querySelector("#productos-table tbody").lastChild;
    if (row) {
        const totalproducto = parseFloat(row.cells[5].innerText);
        const impuestoproducto = parseFloat(row.cells[4].innerText);
        const subtotalproducto = totalproducto - impuestoproducto;
        document.querySelector("#productos-table tbody").removeChild(row);
        calculartotal(-subtotalproducto, -impuestoproducto);
    }
});
