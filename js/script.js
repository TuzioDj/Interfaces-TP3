var pagina = document.querySelector('main')
var botonMenuHamburguesa = document.getElementById('botonMenuHamburguesa')
var menuHamburguesa = document.getElementById('menuHamburguesa')
var imagen1 = "images/svg/Hamburguesa cerrada.svg"
var imagen2 = "images/svg/Hamburguesa abierta.svg"
var contadorImagen = 0;

botonMenuHamburguesa.addEventListener('click', function () {
    menuHamburguesa.classList.toggle("menuHamburguesaAbierto");
    if (contadorImagen == 0) {
        botonMenuHamburguesa.src = imagen2;
        contadorImagen = 1;
        pagina.style.paddingLeft = '60px'
    }
    else {
        botonMenuHamburguesa.src = imagen1;
        contadorImagen = 0;
        pagina.style.paddingLeft = '0'
    }
})

var perfilHamburguesa = document.getElementById('perfilHamburguesa')
var botonPerfilHamburguesa = document.getElementById('botonPerfilHamburguesa')

botonPerfilHamburguesa.addEventListener('click', function () {
    perfilHamburguesa.classList.toggle('perfilHamburguesaAbierto');
})

