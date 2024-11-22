console.log("Hola mundo");

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('loginForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const pass = document.getElementById('pass').value;
        var psw = CryptoJS.MD5(pass).toString(CryptoJS.enc.Base64);
        console.log(psw);

        if (!usuario || !pass) {
            Swal.fire({
                title: 'Campos vacíos',
                text: 'Por favor, ingrese su usuario y contraseña.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        fetch('https://localhost:5000/api/Usuarios/ListadeUsuarios')
            .then(response => response.json())
            .then(data => {
                let usuarioValido = false;

                data.response.forEach(item => {
                    if (item.usuario == usuario && item.pass == pass) {
                        usuarioValido = true;
                        const token = "tokenIS";
                        sessionStorage.setItem("token", token);

                        Swal.fire({
                            title: '¡Bienvenido!',
                            html: `<strong>Hola, ${usuario}</strong><br>Has iniciado sesión correctamente.`,
                            icon: 'success',
                            /*imageUrl: 'file:///C:/Users/Usuario/Documents/WEB/RepositorioProyecto/D-ALTURA/View/wwwroot/IMG/cheque.png', // Cambia esta URL por una imagen personalizada
                            imageWidth: 200,
                            imageHeight: 200,
                            imageAlt: 'Imagen de bienvenida',*/
                            confirmButtonText: 'Continuar'
                        }).then(() => {
                            window.location.href = 'interfazprincipal.html';
                        });
                    }
                });

                if (!usuarioValido) {
                    Swal.fire({
                        title: 'Error de inicio de sesión',
                        text: 'Usuario o contraseña incorrectos.',
                        icon: 'error',
                        confirmButtonText: 'Intentar nuevamente'
                    });
                }
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error del servidor',
                    text: `Hubo un problema al procesar la solicitud: ${error.message}`,
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
                console.error('Error:', error);
            });
    });
});
