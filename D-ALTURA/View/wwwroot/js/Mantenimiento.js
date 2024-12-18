document.getElementById('btn-guardar-backup').addEventListener('click', () => {
    fetch('https://localhost:5000/api/Backup/CrearBackup')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup.bak'; // Cambia si usas otro nombre
            a.click();
        })
        .catch(error => console.error('Error al guardar el respaldo:', error));
});

document.getElementById('btn-cargar-backup').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('backup', file);

    fetch('https://localhost:5000/api/Backup/CargarBackup', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => alert(data.message || 'Respaldo restaurado exitosamente.'))
        .catch(error => console.error('Error al cargar el respaldo:', error));
});

