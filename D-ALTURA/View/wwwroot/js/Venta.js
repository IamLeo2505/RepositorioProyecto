function calculartotal(subtotalproducto, impuestoproducto){
    const subtotal = parseFloat(document.getElementById("subtotal").innerText) + subtotalproducto;
    const impuesto = parseFloat(document.getElementById("impuesto").innerText) + impuestoproducto;
    const total = subtotal + impuesto;

    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("impuesto").innerText = impuesto.toFixed(2);
    document.getElementById("total").innerText = total.toFixed(2);
}



async function buscarCliente() {
    const idcliente = document.getElementById("ClienteID").value;
    const token = sessionStorage.getItem("token");

    if (!token) {
        alert("Usuario no autenticado");
        return;
    }

    try {
        const response = await fetch(`https://localhost:5000/api/Cliente/BuscarCliente/${idcliente}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
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


function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
document.getElementById("buscarcliente").addEventListener("click", function(event) {
    event.preventDefault();
    buscarCliente();
});

document.getElementById("buscarproducto").addEventListener("click", function(event) {
        event.preventDefault();
        buscarProducto();
});

document.querySelector(".btnagregar").addEventListener("click", async function(event) {
    event.preventDefault();
    
    // Asegúrate de que precio_venta y cantidad están definidos
    const precio_venta = parseFloat(document.getElementById("precioventa").value);
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!isNaN(precio_venta) && cantidad > 0) {
        const totalproducto = precio_venta * cantidad;
        const impuestoproducto = totalproducto * (IVA / 100); // Asegúrate de que IVA está definido

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

        // Limpiar campos
        document.getElementById("codigoProducto").value = "";
        document.getElementById("nombreproducto").value = "";
        document.getElementById("cantidad").value = ""; // Limpiar también la cantidad
    } else {
        alert("Por favor, completa todos los campos.");
    }


}

,document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('venta').addEventListener('submit', async function (event) {
            // Evita que se recargue la página
            event.preventDefault();


            // Guardar venta
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
            const response = await fetch("https://localhost:5000/api/Venta/Guardar", {
            method: "POST",
                headers: {
                    "accept": "*/*",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(ventaData)
            });
        
            if (response.ok) {
                alert("Venta guardada con éxito");
            } else {
                alert("Error al guardar la venta");
            }
        } catch (error) {
        console.error("Error:", error);
        }; 
    });
}),



document.querySelector(".btneliminar").addEventListener("click", async function() {
    const row = document.querySelector("#productos-table tbody").lastChild;
    if (row) {
        const totalproducto = parseFloat(row.cells[5].innerText); 
        const impuestoproducto = parseFloat(row.cells[4].innerText); 
        const subtotalproducto = totalproducto - impuestoproducto;
        document.querySelector("#productos-table tbody").removeChild(row);
        calculartotal(-subtotalproducto, -impuestoproducto);
    }
}))