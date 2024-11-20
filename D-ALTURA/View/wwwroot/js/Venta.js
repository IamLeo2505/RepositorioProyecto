document.addEventListener("DOMContentLoaded", () => {
    const buscarClienteBtn = document.getElementById("buscar-cliente");

    buscarClienteBtn.addEventListener("click", async () => {
        const idcliente = document.getElementById("id-cliente").value.trim();

        // Validar que se haya ingresado un ID
        if (!idcliente) {
            alert("Por favor, ingresa un ID de cliente.");
            return;
        }

        try {
            // Llamada a la API (ajusta la URL según tu entorno)
            const response = await fetch(`https://localhost:5000/api/Cliente/BuscarCliente/${idcliente}`);
            
            if (!response.ok) {
                throw new Error("Cliente no encontrado.");
            }

            // Obtener datos de la API
            const data = await response.json();

            // Verificar si existe el objeto 'response' en los datos
            if (!data.response) {
                throw new Error("Estructura de respuesta inesperada.");
            }

            // Obtener los datos del cliente
            const cliente = data.response;

            // Validar que los campos existen
            const nombre = cliente.nombre || "No disponible";
            const apellidos = cliente.apellidos || "No disponible";

            // Combinar nombre y apellidos
            const nombreCompleto = `${nombre} ${apellidos}`;

            // Asignar el nombre completo al campo de texto
            document.getElementById("cliente").value = nombreCompleto;

        } catch (error) {
            alert(error.message);
            // Limpiar el campo si ocurre un error
            document.getElementById("cliente").value = "";
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const buscarUsuarioBtn = document.getElementById("buscar-usuario");

    buscarUsuarioBtn.addEventListener("click", async () => {
        const idusuario = document.getElementById("id-usuario").value.trim();

        // Validar que se haya ingresado un ID
        if (!idusuario) {
            alert("Por favor, ingresa un ID de usuario.");
            return;
        }

        try {
            // Llamada a la API (ajusta la URL según tu entorno)
            const response = await fetch(`https://localhost:5000/api/Usuarios/BuscarUsuario/${idusuario}`);
            
            if (!response.ok) {
                throw new Error("Usuario no encontrado.");
            }

            // Obtener datos de la API
            const data = await response.json();

            // Verificar si existe el objeto 'response' en los datos
            if (!data.response) {
                throw new Error("Estructura de respuesta inesperada.");
            }

            // Obtener los datos del usuario
            const miusuario = data.response;

            // Validar que el campo 'usuario' existe
            const usuario = miusuario.usuario || "No disponible";

            // Asignar el usuario al campo de texto
            document.getElementById("usuario").value = usuario;

        } catch (error) {
            alert(error.message);
            // Limpiar el campo si ocurre un error
            document.getElementById("usuario").value = "";
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const registrarVentaBtn = document.getElementById("registrar-venta");

    registrarVentaBtn.addEventListener("click", async () => {
        // Capturar datos del formulario
        const fecha = document.getElementById("fecha-factura").value.trim();
        const numDocumento = document.getElementById("num-factura").value.trim();
        const subtotal = parseFloat(document.getElementById("subtotal-factura").value.trim());
        const iva = parseFloat(document.getElementById("iva-factura").value.trim());
        const total = parseFloat(document.getElementById("total-factura").value.trim());
        const estado = document.getElementById("estado").value.trim();
        const idusuario = parseInt(document.getElementById("id-usuario").value.trim());
        const idcliente = parseInt(document.getElementById("id-cliente").value.trim());

        // Capturar detalles de la venta (de una tabla o lista)
        const detalleVentaRows = document.querySelectorAll("#detalle-ventas tbody tr");
        const detalleVentas = Array.from(detalleVentaRows).map(row => {
            const cantidad = parseInt(row.querySelector(".cantidad").textContent.trim());
            const precio = parseFloat(row.querySelector(".precio").textContent.trim());
            const totalDetalle = parseFloat(row.querySelector(".total").textContent.trim());
            const idproducto = parseInt(row.querySelector(".id-producto").textContent.trim());

            return {
                iddetalleventa: 0, // Se genera en el backend
                cantidad,
                precio,
                total: totalDetalle,
                idventa: 0, // Se genera en el backend
                idproducto
            };
        });

        // Construir el cuerpo del request
        const ventaCompleta = {
            venta: {
                idventa: 0, // Se genera en el backend
                fecha,
                num_documento: numDocumento,
                subtotal,
                iva,
                total,
                estado,
                idusuario,
                idcliente
            },
            detalleVentas
        };

        try {
            // Llamada a la API para registrar la venta
            const response = await fetch("https://localhost:5000/api/Venta/RegistrarVentaCompleta", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ventaCompleta)
            });

            if (!response.ok) {
                throw new Error("Error al registrar la venta.");
            }

            const data = await response.json();
            alert("Venta registrada correctamente.");
            console.log(data);

            // Limpiar el formulario o realizar otras acciones
        } catch (error) {
            alert(`Ocurrió un error: ${error.message}`);
        }
    });
});
