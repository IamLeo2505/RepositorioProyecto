document.getElementById('buscar-cliente').addEventListener('click', async (event) => {
    event.preventDefault(); 

    const idcliente = parseInt(document.getElementById('idcliente').value);
    
    if (!isNaN(idcliente)) {
        try {
            const response = await fetch(`https://localhost:5000/api/Cliente/Obtener/${idcliente}`);
            if (response.ok) {
                const clienteData = await response.json();
                document.getElementById('nombre').value = clienteData.nombre || '   ';
                document.getElementById('apellidos').value = clienteData.apellidos || '';
            } else {
                alert("Cliente no encontrado.");
                document.getElementById('nombre').value = '';
                document.getElementById('apellidos').value = '';
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Error al conectar con la API.");
        }
    } else {
        alert("Por favor, ingresa un ID de cliente válido.");
    }
});
