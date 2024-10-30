document.getElementById("buscarcliente").addEventListener("click", function(event) {
    event.preventDefault(); // Evita la recarga de la página
    buscarCliente(); // Llama a la función para buscar el empleado
});

async function buscarCliente() {
    const idcliente = document.getElementById("ClienteID").value;
    
    try {
        const response = await fetch(`https://localhost:5000/api/Cliente/BuscarCliente/${idcliente}`);
        
        if (response.ok) {
            const cliente = await response.json();
            console.log("Datos del cliente:", cliente); // Verifica el contenido del objeto recibido

            // Rellenar los campos solo si el objeto contiene los datos
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
