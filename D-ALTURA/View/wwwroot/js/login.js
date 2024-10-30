console.log("Hola mundo")

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const pass = document.getElementById('pass').value;
        var psw = CryptoJS.MD5(pass).toString(CryptoJS.enc.Base64)
        console.log(psw)

        if (!usuario || !pass) {
            alert('Por favor, ingrese su usuario y contrase�a.');
            return;
        }

        fetch('https://localhost:5000/api/Usuarios/ListadeUsuarios')
            .then(response => response.json())
            .then(data => {
                data.response.forEach(item => {
                    if (item.usuario == usuario && item.pass == pass) {
                        alert('Inicio de sesion exitoso');
                        window.location.href = 'interfazprincipal.html';
                    }
                })
            })
            .catch(error => {
                alert(error.message);
                console.error('Error:', error);
            });
    });
});