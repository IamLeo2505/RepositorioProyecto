document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-marca').addEventListener('submit', function (event) {
        event.preventDefault();

        const nombremarca = document.getElementById('nombremarca').value;
        

        // Validar si hay algún campo vacío
        if (!nombremarca) {
            alert('Por favor, agregue una marca.');
            return;
        }

        // Realizar la solicitud fetch
        fetch('http://localhost:5000/api/Marca/GuardarCambios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nombremarca: nombremarca
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

