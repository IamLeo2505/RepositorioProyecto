document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-empleado').addEventListener('submit', function (event) {
        // Evita que se recargue la página
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const dni = document.getElementById('dni').value;
        const direccion = document.getElementById('direccion').value;
        const telefono = document.getElementById('telefono').value;
        const estado = document.querySelector('input[name="estado"]:checked') ? document.querySelector('input[name="estado"]:checked').value : '';

        // Validar si hay algún campo vacío
        if (!nombre || !apellidos || !dni || !direccion || !telefono || !estado) {
            alert('Por favor, llene todos los campos.');
            return;
        }

        // Realizar la solicitud fetch
        fetch('https://localhost:5000/api/Empleado/GuardarCambios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                apellidos: apellidos,
                dni: dni, 
                direccion: direccion,
                telefono: telefono,
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
            alert('Error: ' + error.message);
            console.error('Error:', error);
        });
    });
});

