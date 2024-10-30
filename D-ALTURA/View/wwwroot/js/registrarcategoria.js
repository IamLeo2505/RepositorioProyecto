document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('form-categoria').addEventListener('submit', function (event) {
        event.preventDefault();

        const descripcion = document.getElementById('descripcion').value;
        

        // Validar si hay algún campo vacío
        if (!descripcion) {
            alert('Por favor, agregue una categoría.');
            return;
        }

        // Realizar la solicitud fetch
        fetch('https://localhost:5000/api/Categoría/GuardarCambios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                descripcion: descripcion
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

