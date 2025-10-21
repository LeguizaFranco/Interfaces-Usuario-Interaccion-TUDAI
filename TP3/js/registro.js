"use strict"

let selectDias = document.querySelector('#select-fecha-nacimiento-dias');
let selectMeses = document.querySelector('#select-fecha-nacimiento-meses');

const cantidadDias = 31;
const cantidadMeses = 12;

generarOpciones(selectDias,cantidadDias);
generarOpciones(selectMeses, cantidadMeses);

function generarOpciones(select, cantidadOpciones) {
    for (let opcion=1; opcion <= cantidadOpciones; opcion++) {
        select.innerHTML += `<option value="${opcion}">${opcion}</option>`;
    }
}

let formularioRegistro = document.querySelector("#formularioRegistro");
formularioRegistro.addEventListener("submit", comprobarLoginRegistro);
let botonLoginRegistro = document.querySelector("#boton-login-register");
let mensajeVerificacionCuenta = document.querySelector("#mensaje-verificacion-cuenta");

function comprobarLoginRegistro(e) {
    e.preventDefault();

    let formData = new FormData(formularioRegistro);
    let nombre = formData.get('Nombre');
    let apellido = formData.get('Apellido');
    let email = formData.get('Email');
    let password = formData.get('Password');
    let passwordRepetida = formData.get('RepetirPassword');
    
    if (nombre && apellido && email && password && passwordRepetida && (password == passwordRepetida)) {
        botonLoginRegistro.classList.remove("boton-login-register");
        mensajeVerificacionCuenta.innerHTML = "Tu cuenta se ha creado con éxito";
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


