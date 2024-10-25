document.addEventListener('DOMContentLoaded', function (){
    document.getElementById('form-usuario').addEventListener('click', function (event){
        event.preventDefault();
    })

    fetch('http://localhost:5000/api/Empleado/ObtenerForEmpleado/{idempleado}')
        .then(response => response.json())
        .then(data => {
            if (data) {
                document.getElementById('nombreempleado').value = data.nombre;
                document.getElementById('apellidoempleado').value = data.apellidos;
            } else {
                alert('Empleado no encontrado');
            }
        })
        .catch(error => console.error('Error:', error));
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-usuario').addEventListener('submit', function (event) {
        event.preventDefault();

        
        const acceso = document.getElementById('acceso').value;
        const usuario = document.getElementById('usuario').value;
        const pass = document.getElementById('pass').value;
        const idempleado = document.getElementById('idempleado').value;
        const estado = document.querySelector('input[name="estado"]:checked')?.value;

        fetch('http://localhost:5000/api/Usuarios/GuardarCambios', {
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
                alert(error.message);
                console.error('Error:', error);
            });
    });
});
