console.log("Hola mundo")

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const pass = document.getElementById('pass').value;

        if (!usuario || !pass) {
            alert('Por favor, ingrese su usuario y contrase�a.');
            return;
        }

        fetch('http://localhost:5000/api/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                usuario: usuario,
                pass: pass
            }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                return response.json();
            })
            .then(data => {
                alert('Inicio de sesion exitoso');
                console.log(data); 
                window.location.href = 'usuarios.html';
            })
            .catch(error => {
                alert(error.message); 
                console.error('Error:', error);
            });
    });
});
