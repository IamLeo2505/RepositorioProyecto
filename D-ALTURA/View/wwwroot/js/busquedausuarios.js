document.querySelector('.buscar').addEventListener('click', () => {
    const criterio = document.querySelector('input[name="criterio"]:checked').value; // 'nombre' o 'dni'
    const query = document.querySelector('.search-box').value;
    fetchUsuarios(criterio, query);
});

function fetchUsuarios(criterio, query) {
    fetch(`/api/usuarios?${criterio}=${query}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('#usuariosTable tbody');
            tbody.innerHTML = ''; // Limpiar resultados previos
            data.forEach(usuario => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.usuario}</td>
                    <td>
                        <button class="editar" onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button class="eliminar" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error al obtener usuarios:', error));
}
