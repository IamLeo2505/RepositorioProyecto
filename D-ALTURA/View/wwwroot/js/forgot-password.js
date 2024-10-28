console.log("Hola mundo");

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault(); 

    const usuario = document.getElementById('usuario').value;
    const nuevaPass = document.getElementById('nueva-pass').value;
    const confirmPass = document.getElementById('confirm-pass').value;

    // Validación de campos vacíos
    if (!usuario || !nuevaPass || !confirmPass) {
        alert('Todos los campos son obligatorios.');
        return;
    }

    // Validación de coincidencia de contraseñas
    if (nuevaPass !== confirmPass) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    // (Opcional) Validación de seguridad de la contraseña
    /*const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(nuevaPass)) {
        alert('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un símbolo especial.');
        return;
    }*/

    fetch('https://localhost:5000/api/Usuarios/ListadeUsuarios', {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la conexión con el servidor');
            }
            return response.json();
        })
        .then(data => {
            const usuarioEncontrado = data.response.find(item => item.usuario === usuario);
            if (!usuarioEncontrado) {
                alert('Usuario no encontrado.');
                return;
            }
            alert('Por favor, ingrese el código en el campo antes de que expire.');
            window.location.href = 'recover-password.html'; 
        })
    .catch(error => {
        alert(error.message); // Mostrar error en caso de que el usuario no exista
        console.error('Error:', error);
    });
});
