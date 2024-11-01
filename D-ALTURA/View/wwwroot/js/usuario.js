document.getElementById("btnbuscar").addEventListener("click", function(event) {
    event.preventDefault(); // Evita la recarga de la página
    buscarEmpleado(); // Llama a la función para buscar el empleado
});

async function buscarEmpleado() {
    const idempleado = document.getElementById("EmpleadoID").value;
    
    try {
        const response = await fetch(`https://localhost:5000/api/Empleado/ObtenerForEmpleado/${idempleado}`);
        
        if (response.ok) {
            const empleado = await response.json();
            console.log("Datos del empleado:", empleado); // Verifica el contenido del objeto recibido

            // Rellenar los campos solo si el objeto contiene los datos
            if (empleado.response && empleado.response.nombre && empleado.response.apellidos) {
                document.getElementById("nombre").value = empleado.response.nombre;
                document.getElementById("apellidos").value = empleado.response.apellidos;
            } else {
                alert("Datos de empleado no encontrados.");
            }
        } else {
            alert("Empleado no encontrado");
        }
    } catch (error) {
        console.error("Error al buscar el empleado:", error);
    }
}




document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('userForm').addEventListener('submit', function (event) {
        // Evita que se recargue la página
        event.preventDefault();

        const idempleado = document.getElementById('EmpleadoID').value;
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const usuario = document.getElementById('usuario').value;
        const pass = document.getElementById('pass').value;
        const acceso = document.getElementById('acceso').value;
        const estado = document.querySelector('input[name="estado"]:checked') ? document.querySelector('input[name="estado"]:checked').value : '';
        

        // Validar si hay algún campo vacío
        if (!nombre || !apellidos || !usuario || !pass || !acceso || !idempleado || !estado) {
            alert('Por favor, llene todos los campos.');
            return;
        }

        // Realizar la solicitud fetch
        fetch('https://localhost:5000/api/Usuarios/GuardarCambios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({

                usuario: usuario,
                pass: pass,
                acceso: acceso,
                estado: estado,
                idempleado: idempleado
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

