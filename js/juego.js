var copiarUrl = document.querySelector('.copiarUrl');
var btnCompartir = document.getElementById('btnCompartir');

btnCompartir.addEventListener('click', function () {
    copiarUrl.classList.toggle('copiarUrlAbierto');
})

let btnFullscreen = document.getElementById('btn_fullscreen');
let imagenFullscreen1 = "images/svg/Pantalla completa.svg"
let imagenFullscreen2 = "images/svg/Salir pantalla completa.svg"
let contadorImageFullscreen = 0;
let instrucciones = document.querySelector('.instrucciones');
let pantalla = document.querySelector('.pantalla');
btnFullscreen.addEventListener('click', function () {
    if (contadorImageFullscreen == 0) {
        instrucciones.classList.add('inactive');
        pantalla.classList.add('fullscreen');
        btnFullscreen.src = imagenFullscreen2;
        contadorImageFullscreen = 1;
    } else {
        instrucciones.classList.remove('inactive');
        pantalla.classList.remove('fullscreen');
        btnFullscreen.src = imagenFullscreen1;
        contadorImageFullscreen = 0;
    }
})