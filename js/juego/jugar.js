"use strict";

let canvas = /** @type { HTMLcanvasElement} */ document.getElementById("canvas");
let ctx = canvas.getContext('2d');
let width = 0;
let height = 0;
let fichas = [];
let fichaSelect;
let arrastrar = false;
let tablero;
let juego;
let jugador1;
let jugador2;
let jugabilidad;



function oMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: Math.round(evt.clientX - rect.left),
        y: Math.round(evt.clientY - rect.top),
    }
}


document.addEventListener('DOMContentLoaded', () => {
    let btnPlay = document.getElementById('btn_play');
    let contenedor_menu = document.getElementById('init_juego');
    let contenedor_juego = document.getElementById('contenedor_juego');
    let tablero_cont = document.getElementById('tablero');
    btnPlay.addEventListener('click', () => {
        contenedor_menu.classList.add('inactive');
        contenedor_juego.classList.remove('inactive');
        jugabilidad = document.querySelector('input[name="boardSize"]:checked').value; 
        jugador1 = document.querySelector('input[name="jugador1"]:checked').value;
        jugador2 = document.querySelector('input[name="jugador2"]:checked').value;
        tablero_cont.classList.remove('invisible');
        cargarJuego(Number(jugabilidad), jugador1, jugador2);
    });
});




function cargarJuego(jugabilidad, jugador1, jugador2) {
    //Determinamos la cantidad de fichas que tendra cada jugador
    let cantfichas = (((jugabilidad + 2) * (jugabilidad + 2)) / 2);

    //Creamos el tablero y el juego
    tablero = new Tablero(ctx, jugabilidad);
    juego = new Juego(tablero, jugabilidad, jugador1, jugador2);

    //Determinamos el tamanio del canvas
    width = juego.pos2 + tablero.ladoImagen + 40;
    height = (jugabilidad + 3) * tablero.ladoImagen;
    canvas.width = width;
    canvas.height = height;

    //Generamos las fichas segun la modalidad. En caso de que sea impar, se debe hacer una ficha menos en el jugador2, ya que sino sobra una
    if (jugabilidad % 2 === 0) {
        for (let i = 0; i < cantfichas; i++) {
            juego.generarFichas('ficha1', juego.getpos1(), jugador1, jugador2);
            juego.generarFichas('ficha2', juego.getpos2(), jugador1, jugador2);
        }        
    } else {
        for (let i = 0; i < cantfichas -1; i++) {
            juego.generarFichas('ficha1', juego.getpos1(), jugador1, jugador2);
            juego.generarFichas('ficha2', juego.getpos2(), jugador1, jugador2);
        }
        juego.generarFichas('ficha1', juego.getpos1(), jugador1, jugador2);
    }

    //Generamos el contenido del HTML segun los jugadores elegidos
    document.querySelector('#turno1').innerHTML = `${jugador1}`;
    document.querySelector('#turno2').innerHTML = `${jugador2}`;
    document.querySelector('#fichaPlayer1').src = `/images/4 en Linea/Tablero/Ficha ${jugador1} amarilla.png`
    document.querySelector('#fichaPlayer2').src = `/images/4 en Linea/Tablero/Ficha ${jugador2} roja.png`
    
    //Llamamos a mostrar las fichas y los tableros cuando ya todas las imagenes esten cargadas
    juego.fichas[juego.fichas.length-1].image.onload = () => {
        juego.mostrarFichas();
    };
    tablero.image.onload = () => {
        tablero.imageArrow.onload = () => {
            tablero.draw();
        }
    }
    //Iniciamos el cronometro
    juego.timer();
}


function resetGame(){
    //Limpiamos el canvas para poder volver a jugar
    ctx.clearRect(0, 0, width, height);

    //Volvemos a poner el turno del jugador1, independiente de cual fue el ultimo turno antes de reiniciar
    let turno = document.getElementById("player1");
    let noTurno = document.getElementById("player2");
    turno.classList.remove("invisible");
    turno.classList.add("visible");
    noTurno.classList.remove("visible");
    noTurno.classList.add("invisible");

    //Reiniciamos el cronometro
    clearInterval(juego.espera);

    //Volvemos al inicio por si el reinicio se hizo luego de un ganador, independiente de si hubo ganador o no
    let mensajes = document.querySelectorAll("#theWinnerIs h2");
    let ganador = document.querySelector("#theWinnerIs");
    let tiempo = document.querySelector("#tmp");
    tiempo.classList.remove("inactive");
    ganador.classList.remove("active");
    ganador.classList.add("inactive");
    mensajes.forEach(mje => {
        mje.innerHTML = '';
    });
}

let reset = document.querySelector("#btn_reset");
reset.addEventListener('click', () => {
    //Reiniciamos y volvemos a cargar el juego con la misma modalidad y jugadores
    resetGame();
    cargarJuego(Number(jugabilidad), jugador1, jugador2);
})


let exit = document.querySelector("#btn_exit");
exit.addEventListener('click', () => {
    //Reiniciamos e intercambiamos el juego con el menu
    resetGame();
    let contenedor_menu = document.getElementById('init_juego');
    let contenedor_juego = document.getElementById('contenedor_juego');
    contenedor_menu.classList.remove('inactive');
    contenedor_juego.classList.add('inactive');
})



canvas.addEventListener('mousedown', (evt) => {
    //Obtenemos la posicion del mouse
    var mousePos = oMousePos(canvas, evt);
    //Obtenemos la ficha clickeada
    for (let i = juego.fichas.length - 1; i >= 0; i--) {
        let ficha = juego.fichas[i];
        //Si se hizo click en la ficha y no esta ubicada se genera un arrastre
        if (ficha.isClickedCirculo(mousePos)) {
            if (!ficha.estaUbicada() && !ficha.estaBloqueada()) {
                //Permitimos el arrastre en la ficha
                arrastrar = true;
                //Seteamos la nueva posicion de ficha y dibujamos
                fichaSelect = ficha;
                fichaSelect.setPosX(mousePos.x);
                fichaSelect.setPosY(mousePos.y);
                ctx.clearRect(0, 0, width, height);
                tablero.draw();
                juego.mostrarFichas();
                break;
            }
        }
    }


}, false);

canvas.addEventListener("mousemove", function(evt) {
    //Hacemos que cuando se mueva el mouse, la ficha se vaya redibujando haciendo un seguimiento del mismo
    let mousePos = oMousePos(canvas, evt);
    if (arrastrar) {
        ctx.clearRect(0, 0, width, height);
        fichaSelect.setPosX(mousePos.x);
        fichaSelect.setPosY(mousePos.y);
        tablero.draw();
        juego.mostrarFichas();
    }
}, false);

canvas.addEventListener("mouseup", function(evt) {
    //Hacemos que cuando se levante el click, se ubique la ficha y la deseleccionamos
    let mousePos = oMousePos(canvas, evt);
    arrastrar = false;
    if (fichaSelect) {
        juego.ubicarFicha(mousePos.x, mousePos.y, fichaSelect, ctx);
    }
    fichaSelect = null;
}, false);

canvas.addEventListener("mouseout", function() {
    //En caso de que el mouse salga del canvas, volvemos la ficha a su posicion inicial y la deseleccionamos
    if (arrastrar) {
        arrastrar = false;
        ctx.clearRect(0, 0, width, height);
        fichaSelect.setPosX(fichaSelect.getPosXAnt());
        fichaSelect.setPosY(fichaSelect.getPosYAnt());
        tablero.draw();
        juego.mostrarFichas();
    }
    if (fichaSelect) {
        fichaSelect = null;
    }
}, false);