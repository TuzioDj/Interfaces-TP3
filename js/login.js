const form = document.querySelectorAll('.form');
const botonAlternativa = document.querySelectorAll('.botonAlternativa');
const botonesRegistro = document.querySelectorAll('.botonRegistrarse');
var waitTime = 4000
const successAnimation = document.querySelector('.successAnimation')
const checkmark = document.querySelector('.checkmark');
const checkmarkCircle = document.querySelector('.checkmarkCircle');
const checkmarkCheck = document.querySelector('.checkmarkCheck');

botonesRegistro.forEach(boton => {
    boton.addEventListener('click', () => {
        successAnimation.classList.toggle('successAnimationAppear');
        checkmark.classList.toggle('checkmarkAnimation');
        checkmarkCircle.classList.toggle('checkmarkCircleAnimation');
        checkmarkCheck.classList.toggle('checkmarkCheckAnimation');
        setTimeout(() => {
            cambioDeForm()
            successAnimation.classList.toggle('successAnimationAppear');
            checkmark.classList.toggle('checkmarkAnimation');
            checkmarkCircle.classList.toggle('checkmarkCircleAnimation');
            checkmarkCheck.classList.toggle('checkmarkCheckAnimation');    
        }, waitTime);
    });
})


botonAlternativa.forEach(boton => {
    boton.addEventListener('click', cambioDeForm)
})


function cambioDeForm() {
    form.forEach(element => {
        element.classList.toggle('formHidden')
    });
}

