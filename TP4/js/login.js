"use strict"

let formularioLogin = document.querySelector("#formularioLogin");
formularioLogin.addEventListener("submit", comprobarLoginRegistro);
let botonLoginRegistro = document.querySelector("#boton-login-register");
let mensajeVerificacionCuenta = document.querySelector("#mensaje-verificacion-cuenta");

function comprobarLoginRegistro(e) {
    e.preventDefault();

    let formData = new FormData(formularioLogin);
    let email = formData.get('Email');
    let password = formData.get('Password');
    
    if (email && password == "123") {
        botonLoginRegistro.classList.remove("boton-login-register");
        mensajeVerificacionCuenta.innerHTML = "Has iniciado sesión correctamente";
        if (botonLoginRegistro.classList.contains("verificacion-fallida")) {
            botonLoginRegistro.classList.remove("verificacion-fallida");
        }
        botonLoginRegistro.classList.add("verificacion-exitosa");
    } else {
        botonLoginRegistro.classList.remove("boton-login-register");
        mensajeVerificacionCuenta.innerHTML = "Faltan datos o los datos introducidos son incorrectos";
        if (botonLoginRegistro.classList.contains("verificacion-exitosa")) {
            botonLoginRegistro.classList.remove("verificacion-exitosa");
        }
        botonLoginRegistro.classList.add("verificacion-fallida");
    
    }
}


