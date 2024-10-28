console.log("Hola mundo!");

document.addEventListener("DOMContentLoaded", function() {
    let timeLeft = 60; // 1 minuto = 60 segundos
    let timerInterval;

    const timeDisplay = document.querySelector(".time");
    const inputs = document.querySelectorAll(".inputs .input");
    const submitButton = document.querySelector(".submit");
    const resendLink = document.querySelector(".reenviar");

    // Desactivar el botón de envío inicialmente
    submitButton.disabled = true;

    function startTimer() {
        // Limpiar cualquier temporizador anterior antes de iniciar uno nuevo
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            // Formatear para mostrar siempre dos dígitos
            const formattedMinutes = minutes.toString().padStart(2, '0');
            const formattedSeconds = seconds.toString().padStart(2, '0');

            // Actualizar el contenido del span con el tiempo restante
            timeDisplay.textContent = `${formattedMinutes}:${formattedSeconds}`;

            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(timerInterval);
                timeDisplay.textContent = "00:00";
                alert("El código de verificación ha caducado. Por favor, vuelva a intentarlo."); // Mostrar alerta
                disableInputs(); // Deshabilitar inputs
            }
        }, 1000); // Actualizar cada segundo
    }

    function disableInputs() {
        inputs.forEach(input => input.disabled = true);
        submitButton.disabled = true;
    }

    function checkInputs() {
        const allFilled = Array.from(inputs).every(input => input.value !== "");
        submitButton.disabled = !allFilled; // Habilita el botón solo si todos los campos están llenos
    }

    // --- Código para manejar el auto-enfoque en los inputs ---
    inputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            if (input.value.length > 1) {
                input.value = input.value.slice(0, 1); // Limitar a un solo dígito
            }
            if (input.value && index < inputs.length - 1) {
                inputs[index + 1].focus(); // Enfocar el siguiente campo
            }
            checkInputs(); // Verificar si el botón debe habilitarse
        });

        input.addEventListener("keydown", (event) => {
            if (event.key === "Backspace" && !input.value && index > 0) {
                inputs[index - 1].focus(); // Enfocar el campo anterior en caso de borrar
            }
            checkInputs(); // Verificar si el botón debe habilitarse
        });
    });

    // Reiniciar el temporizador al hacer clic en el enlace de "reenviar"
    resendLink.addEventListener("click", function(event) {
        event.preventDefault(); // Evitar el comportamiento por defecto del enlace
        timeLeft = 60; // Reiniciar el tiempo a 60 segundos
        startTimer(); // Iniciar el temporizador nuevamente
        alert("Se ha reenviado el código de verificación."); // Mostrar alerta de reenvío
    });

    // --- Verificar el código ingresado al hacer clic en el botón de "Reestablecer Contraseña" ---
    submitButton.addEventListener("click", function(event) {
        event.preventDefault(); // Evitar el envío del formulario

        // Concatenar los valores de los inputs para formar el código ingresado
        const enteredCode = Array.from(inputs).map(input => input.value).join('');

        // Validar que todos los campos estén completos
        if (enteredCode.length < 6) {
            alert("Por favor complete todos los campos.");
            return;
        }

        // Validar si el código ingresado es "000000"
        if (enteredCode === "000000") {
            alert("Se ha reestablecido exitosamente su contraseña.");
            window.location.href = "../index.html"; // Redirigir al login
        } else {
            alert("Código inválido.");
        }
    });

    startTimer(); // Iniciar el temporizador
});
