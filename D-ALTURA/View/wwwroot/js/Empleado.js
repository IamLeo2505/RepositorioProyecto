console.log("Hola mundo")

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-empleado').addEventListener('submit', function (event) {
        event.preventDefault();

        
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const direccion = document.getElementById('direccion').value;
        const dni = document.getElementById('dni').value;
        const telefono = document.getElementById('telefono').value;
        const estado = document.querySelector('input[name="estado"]:checked')?.value;

        if (!nombre || !apellidos || !dni || !telefono || !direccion || !estado) {
            alert('Por favor, llene todos los campos.');
            return;
        }

        fetch('https://localhost:5000/api/Empleado/GuardarCambios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                apellidos: apellidos, 
                dni: dni, 
                telefono: telefono,
                direccion: direccion,
                estado: estado
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
                alert(error.message);
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
    listarEmpleados();
});

// Evento para cancelar el registro
document.getElementById('cancelarBtn').addEventListener("click", function () {
    console.log("Formulario de registro cancelado");
    window.location.reload();
});