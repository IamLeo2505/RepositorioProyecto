console.log("Esperemos que funcione.")

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-cliente').addEventListener('submit', function (event) {
        event.preventDefault();

        
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const RUC = document.getElementById('RUC').value;
        const documento = document.getElementById('Documento').value;
        const telefono = document.getElementById('telefono').value;
        const estado = document.querySelector('input[name="estado"]:checked')?.value;

        if (!nombre || !apellidos || !RUC || !documento || !telefono || !estado) {
            alert('Por favor, llene todos los campos.');
            return;
        }

        fetch('http://localhost:5000/api/Cliente/GuardarCambios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombre: nombre,
                apellidos: apellidos, 
                ruc: RUC,
                dni: documento,
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
                alert(error.message);
                console.error('Error:', error);
            });
    });
});
