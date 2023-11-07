"use strict";

class Ficha {
    constructor(posX, posY, color, ctx, radio, imagen, numJugador) {
        this.posX = posX;
        this.posY = posY;
        this.posXAnt = posX;
        this.posYAnt = posY;
        this.color = color;
        this.ctx = ctx;
        this.radio = radio;

        //Asignamos un jugador a la ficha
        this.jugador = numJugador;
        this.selected = false;
        this.bloqueada = false;
        this.posicionada = false;

        this.image = new Image();
        this.image.src = imagen;
    }

    getPosX() {
        return this.posX;
    }

    setPosX(x) {
        this.posX = x;
    }

    getPosXAnt() {
        return this.posXAnt;
    }



    getPosY() {
        return this.posY;
    }
    getPosYAnt() {
        return this.posYAnt;
    }
    setPosY(y) {
        this.posY = y;
    }


    getColor() {
        return this.color;
    }

    getJugador() {
        return this.jugador;
    }

    setColor(color) {
        this.color = color;
    }

    bloquearFicha() {
        this.bloqueada = true;
    }

    desbloquearFicha() {
        this.bloqueada = false;
    }

    posicionarFicha() {
        this.posicionada = true;
    }

    estaUbicada() {
        return this.posicionada;
    }
    estaBloqueada() {
        return this.bloqueada;
    }
    
    draw() {
        //Dibujamos la ficha dada una imagen
        this.ctx.fillStyle = this.image;

        this.ctx.arc(this.posX, this.posY, this.radio, 0, 2 * Math.PI);

        this.ctx.drawImage(this.image, this.posX - this.radio, this.posY - this.radio, this.radio * 2, this.radio * 2);
    }

    isClickedCirculo(posicion) {
        //Verificamos que el circulo se haya clickeado
        if (Math.sqrt((posicion.x - this.posX) * (posicion.x - this.posX) + (posicion.y - this.posY) * (posicion.y - this.posY)) <=
            this.radio) {
            return true;
        } else {
            return false;
        }
    }
}