document.getElementById('buscarBtn').addEventListener('click', function() {
    const searchInput = document.getElementById('searchInput').value;
    const criterio = document.querySelector('input[name="criterio"]:checked');
    
    if (!criterio) {
        alert('Por favor, selecciona un criterio de búsqueda.');
        return;
    }

    if (searchInput === "") {
        alert('El campo de búsqueda está vacío.');
        return;
    }

    // Aquí iría la lógica para buscar los datos
    alert(`Buscando por ${criterio.value}: ${searchInput}`);
});

document.getElementById('salirBtn').addEventListener('click', function() {
    // Lógica para cerrar o salir
    window.close();
});

document.getElementById('nuevoBtn').addEventListener('click', function() {
    alert('Añadir nuevo usuario.');
    // Aquí va la lógica para agregar un nuevo usuario
});

document.getElementById('editarBtn').addEventListener('click', function() {
    alert('Editar usuario seleccionado.');
    // Aquí va la lógica para editar usuario
});

document.getElementById('anularBtn').addEventListener('click', function() {
    alert('Anular usuario seleccionado.');
    // Aquí va la lógica para anular usuario
});
