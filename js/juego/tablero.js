"use strict";

class Tablero {
    constructor(ctx, cantidad) {
        this.alto = 2 + cantidad;
        this.ancho = 2 + cantidad;
        this.tamanio = 480

        //Calculamos el tamanio de cada imagen relacionando el tamanio del tablero con la cantidad de fichas que va a tener horizontal o verticalmente
        this.ladoImagen = this.tamanio / this.ancho;

        //Determinamos la posicion del tablero
        this.comienzoX = this.ladoImagen * 2;
        this.comienzoY = this.ladoImagen;
        this.ctx = ctx;

        this.image = new Image();
        this.imageArrow = new Image();
        this.image.src = "../images/4 en Linea/Tablero/Pedazo de tablero.png";
        this.imageArrow.src = "../images/4 en Linea/Tablero/Flecha para poner ficha.png"

        //Generamos la matriz de los casilleros y el arreglo de flechas para colocar fichas
        this.matriz = this.generarMatriz();
        this.arrCol = this.generarArregloColumnas();

    }

    crearTablero() {
        //Dibujamos el tablero una vez que las imagenes estan cargadas
        this.image.onload = () => {
            this.imageArrow.onload = () => {
                this.draw();
            }
        };
    }

    generarMatriz() {
        //Generamos matriz de casilleros para la logica del juego
        let matriz = [this.alto];
        for (let i = 0; i < this.alto; i++) {
            matriz[i] = [];
            for (let j = 0; j < this.ancho; j++) {
                matriz[i][j] = 0;
            }
        }
        return matriz;
    }

    generarArregloColumnas() {
        //Generamos arreglo de flechas para tirar fichas
        let arregloColumnas = [];
        arregloColumnas[0] = this.comienzoX + this.ladoImagen;
        for (let i = 1; i < this.ancho; i++) {
            arregloColumnas[i] = (arregloColumnas[i - 1] + this.ladoImagen);
        }
        return arregloColumnas;
    }

    esValida(x, y) {
        //Preguntamos si la posicion que llega corresponde a una columna valida
        let col = -1;
        if (y > this.comienzoY - this.ladoImagen && y < this.comienzoY) {
            //Si y se encuentra dentro de una flecha de ingreso
            let i = 0;
            while (i < this.ancho) {
                //Preguntamos si x esta entre la medida donde arranca la columna y donde termina
                if (x < this.arrCol[i] && x > this.arrCol[i] - 80) {
                    col = i;
                    return col;
                }
                i++;
            }
        }
        return col;
    }

    getNroCol() {
        return this.ancho;
    }

    ingresoFicha(nroCol, ficha) {
        //Buscamos en todas las filas, desde el final hasta el inicio, una donde un jugador no tenga ficha
        let i = this.alto - 1;
        while (i >= 0) {
            if (this.matriz[i][nroCol] == 0) {
                this.matriz[i][nroCol] = ficha.getJugador();

                return i;
            }
            i--;
        }
        return i;
    }

    caeFicha(ficha, fila, columna) {
        //Calculamos la posicion en la cual se va a colocar la ficha, en base a la fila y columna en la que tiene que caer
        let x = this.comienzoX + fila * this.ladoImagen + this.ladoImagen / 2;
        let y = this.comienzoY + columna * this.ladoImagen + this.ladoImagen / 2;
        console.log(x, y);
        ficha.setPosX(x);
        ficha.setPosY(y);
        ficha.bloquearFicha();
        fichaSelect.posicionarFicha();
        //Recorremos las fichas, para ver a que jugador coresponde y manejar turnos
        let player1 = document.querySelector("#player1");
        let player2 = document.querySelector("#player2");
        juego.fichas.forEach(ficha => {
            if (ficha.getJugador() == fichaSelect.getJugador()) {
                ficha.bloquearFicha();
                if (fichaSelect.getJugador() == 1) {
                    player1.classList.remove("visible");
                    player1.classList.add("invisible");
                    player2.classList.remove("invisible");
                    player2.classList.add("visible");
                } else {
                    player2.classList.remove("visible");
                    player2.classList.add("invisible");
                    player1.classList.remove("invisible");
                    player1.classList.add("visible");
                }
            } else {
                ficha.desbloquearFicha();
            }
        });
    }

    //Dibujamos el tablero
    draw() {
        for (let fila = 0; fila < this.alto; fila++) {
            for (let columna = 0; columna < this.ancho; columna++) {
              const x = this.comienzoX + columna * this.ladoImagen; // Coordenada X en el canvas
              const y = this.comienzoY + fila * this.ladoImagen; // Coordenada Y en el canvas
          
              // Dibuja la imagen redimensionada en la posición (x, y)
              this.ctx.drawImage(this.image, x, y, this.ladoImagen, this.ladoImagen);
            }
        }
        for (let columna = 0; columna < this.ancho; columna++) {
            const x = this.comienzoX + columna * this.ladoImagen; // Coordenada X en el canvas
            const y = 0; // Coordenada Y en el canvas
        
            // Dibuja la imagen redimensionada en la posición (x, y)
            this.ctx.drawImage(this.imageArrow, x, y, this.ladoImagen, this.ladoImagen);
          }
    }
}