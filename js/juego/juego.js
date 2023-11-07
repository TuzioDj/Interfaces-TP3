"use strict";
class Juego {
    constructor(tablero, fichasAGanar, jugador1, jugador2) {
        this.tablero = tablero;
        this.fichas = [];
        this.contadorFichasUbicadas = 0;
        this.limite = fichasAGanar;
        this.ganador = null;
        //Establecemos la posicionX de cada conjunto de fichas
        this.pos1 = this.tablero.ladoImagen / 2;
        this.pos2 = this.tablero.comienzoX + this.tablero.ancho * this.tablero.ladoImagen + this.tablero.ladoImagen / 2;
        //Determinamos el tamanio del tablero
        this.tamanio = 480
        //Determinamos el radio de cada ficha en base al tamanio del tablero, en relacion con la cantidad de fichas que va a tener horizontal y verticalmente
        this.radius = (this.tamanio / (this.limite + 2)) / 2 - 5;
        this.espera;
        this.cronometro;
        this.jugador1 = jugador1;
        this.jugador2 = jugador2;
    }


    getpos1() {
        return this.pos1;
    }

    getpos2() {
        return this.pos2;
    }

    generarFichas(ficha, pos, jugador1, jugador2) {
        //Generamos las fichas de cada jugador en base a su posicion
        if (pos < (this.tablero.ancho * this.tablero.ladoImagen / 2)) {
            //Si la ficha se encuentra del lado izquierdo del tablero, sera del jugador1
            ficha = new Ficha(pos + this.radius + 5, (Math.random() * (((this.tablero.ladoImagen * this.tablero.alto)) - this.tablero.comienzoY) + this.tablero.comienzoY), '#ff0000', ctx, this.radius, `../images/4 en Linea/Tablero/Ficha ${jugador1} amarilla.png`, 1);
            this.fichas.push(ficha);
        } else {
            //Si la ficha se encuentra del lado derecho del tablero, sera del jugador2
            ficha = new Ficha(pos + this.radius + 5, (Math.random() * (((this.tablero.ladoImagen * this.tablero.alto)) - this.tablero.comienzoY) + this.tablero.comienzoY), '#ff0000', ctx, this.radius, `../images/4 en Linea/Tablero/Ficha ${jugador2} roja.png`, 2);
            //Se bloquea la ficha para que no pueda jugar el jugador2
            ficha.bloquearFicha();
            this.fichas.push(ficha);
        }
    }



    getMousePos(canvas, evt) {
        //Obtenemos y devolvemos la posicion del mouse
        let ClientRect = canvas.getBoundingClientRect();
        return {
            x: Math.round(evt.clientX - ClientRect.left),
            y: Math.round(evt.clientY - ClientRect.top)
        }
    }

    mostrarFichas() {
        //Dibujamos todas las fichas
        for (let i = 0; i < this.fichas.length; i++) {
            this.fichas[i].draw();
        }
    }

    ubicarFicha(x, y, fichaSelect, ctx) {
        let columnaValida = 0;
        //Obtenemos la columna a la que estamos apuntando, en caso de que asi sea
        columnaValida = this.tablero.esValida(x, y);
        if (columnaValida > -1 && columnaValida < this.tablero.getNroCol()) {
            //Obtenemos la fila a la que estamos apuntando
            let filaValida = this.tablero.ingresoFicha(columnaValida, fichaSelect);
            if (filaValida > -1) {
                this.tablero.caeFicha(fichaSelect, columnaValida, filaValida);
                ctx.clearRect(0, 0, width, height);
                this.tablero.draw();
                this.mostrarFichas();
                this.contadorFichasUbicadas++;
                //Comprobamos si hay un ganador
                if (this.alguienGana(this.tablero.matriz, filaValida, columnaValida, fichaSelect, this.limite)) {
                    //Seteamos el ganador y terminamos el juego
                    this.ganador = fichaSelect.getJugador();
                    this.terminar();
                    clearInterval(this.espera);
                }
                //Comprobamos si no hay mas fichas
                if (this.noHayMasFichas()) {
                    //Terminamos y frenamos el cronometro
                    this.terminar();
                    clearInterval(this.espera);
                }
            } else {
                //Si la fila obtenida no representa a la matriz, la ficha vuelve a su posicion inicial
                this.reubicarFicha(fichaSelect, ctx);
            }
        } else {
            //Si la columna obtenida no representa a la matriz, la ficha vuelve a su posicion inicial
            this.reubicarFicha(fichaSelect, ctx);
        }
    }

    reubicarFicha(fichaSelect, ctx) {
        //Reubicamos la ficha mediante las posiciones iniciales de la misma
        fichaSelect.setPosY(fichaSelect.getPosYAnt());
        fichaSelect.setPosX(fichaSelect.getPosXAnt());
        ctx.clearRect(0, 0, width, height);
        this.tablero.draw();
        this.mostrarFichas();
    }


    alguienGana(matriz, fila, columna, fichaSelect, cantFichas) {
        let enLinea = 0;

        if (matriz.length - fila >= cantFichas) {
            //Buscamos hacia abajo la cantidad de fichas del mismo jugador
            enLinea = this.abajo(matriz, fila, columna, fichaSelect, cantFichas);
        }

        if (enLinea >= cantFichas) {
            return true;
        }
        else {
            //Buscamos hacia derecha la cantidad de fichas del mismo jugador
            enLinea = this.derecha(matriz[fila], columna, fichaSelect, cantFichas);
            if (enLinea >= cantFichas) {
                return true;
            } else {
                //Si no llegamos a la cantidad en esa direccion, buscamos en la direccion opuesta a partir de la posicion original de fichaSelect
                enLinea += this.izquierda(matriz[fila], columna, fichaSelect, cantFichas) - 1;
            }
        }

        if (enLinea >= cantFichas) {
            return true;
        }
        else {
            //Buscamos en diagonal la cantidad de fichas del mismo jugador
            enLinea = this.derechaAbajo(matriz, fila, columna, fichaSelect, cantFichas);
            if (enLinea >= cantFichas) {
                return true;
            } else {
                //Si no llegamos a la cantidad en esa direccion, buscamos en la direccion opuesta a partir de la posicion original de fichaSelect
                enLinea += this.izquierdaArriba(matriz, fila, columna, fichaSelect, cantFichas) - 1;
            }
        }

        if (enLinea >= cantFichas) {
            return true;

        }
        else {
            //Buscamos en diagonal la cantidad de fichas del mismo jugador
            enLinea = this.derechaArriba(matriz, fila, columna, fichaSelect, cantFichas);
            if (enLinea >= cantFichas) {
                return true;
            } else {
                //Si no llegamos a la cantidad en esa direccion, buscamos en la direccion opuesta a partir de la posicion original de fichaSelect
                enLinea += this.izquierdaAbajo(matriz, fila, columna, fichaSelect, cantFichas) - 1;
            }
        }

        if (enLinea >= cantFichas) {
            return true;
        }
        return false;
    }

    abajo(matriz, fila, columna, fichaSelect) {
        let contador = 0;
        while (contador < this.limite && matriz[fila][columna] == fichaSelect.getJugador()) {
            fila++;
            contador++;
        }
        return contador;
    }

    derecha(arrHilera, columna, fichaSelect) {
        let contador = 0;
        while (contador < this.limite && columna < this.tablero.ancho && arrHilera[columna] == fichaSelect.getJugador()) {
            columna++;
            contador++;
        }
        return contador;
    }

    izquierda(arrHilera, columna, fichaSelect) {
        let contador = 0;
        while (contador < this.limite && columna >= 0 && arrHilera[columna] == fichaSelect.getJugador()) {
            columna--;
            contador++;
        }
        return contador;
    }

    derechaArriba(matriz, fila, columna, fichaSelect) {
        let contador = 0;
        while (contador < this.limite && fila >= 0 && columna < this.tablero.ancho && matriz[fila][columna] == fichaSelect.getJugador()) {
            fila--;
            columna++;

            contador++;
        }
        return contador;
    }

    derechaAbajo(matriz, fila, columna, fichaSelect) {
        let contador = 0;
        while (contador < this.limite && fila < this.tablero.alto && columna < this.tablero.ancho && matriz[fila][columna] == fichaSelect.getJugador()) {
            fila++;
            columna++;

            contador++;
        }
        return contador;
    }

    izquierdaArriba(matriz, fila, columna, fichaSelect) {
        let contador = 0;
        while (contador < this.limite && fila >= 0 && columna >= 0 && matriz[fila][columna] == fichaSelect.getJugador()) {
            fila--;
            columna--;

            contador++;
        }
        return contador;
    }

    izquierdaAbajo(matriz, fila, columna, fichaSelect) {
        let contador = 0;
        while (contador < this.limite && fila < this.tablero.alto && columna >= 0 && matriz[fila][columna] == fichaSelect.getJugador()) {
            fila++;
            columna--;

            contador++;
        }
        return contador;
    }

    terminar() {
        //Bloqueamos todas las fichas
        this.fichas.forEach(ficha => {
            ficha.bloquearFicha();
        })

        //Sacamos los turnos
        let turnos = document.querySelectorAll('.turno');
        turnos.forEach(turno => {
            turno.classList.remove("visible");
            turno.classList.add("invisible");
        });

        //Sacamos el timer
        let tiempo = document.querySelector("#tmp");
        tiempo.classList.add("inactive");
        
        //Mostramos el ganador
        let contenedor = document.querySelector("#quienGano");
        let ganador = document.querySelector("#theWinnerIs");
        ganador.classList.remove("inactive");
        ganador.classList.add("active");
        if (this.ganador) {
            ganador = fichaSelect.getJugador();
            if (ganador == 1) {
                contenedor.innerHTML = `Ganador: ${this.jugador1}`;
            } else {
                contenedor.innerHTML = `Ganador: ${this.jugador2}`;
            }

        } else {
            //Si no hay ganador
            contenedor.innerHTML = "¡Empataron!";
        }
        //Cortamos el cronometro
        clearInterval(this.espera);
    }



    timer() {
        let cronometro_contenedor = document.getElementById('cronometro');

        this.cronometro = new Cronometro();
        //Pedimos el tiempo del cronometro
        cronometro_contenedor.innerHTML = this.cronometro.getTiempo();

        //Vamos descontando el tiempo de a 1seg
        this.espera = setInterval(() => {
            this.cronometro.descontar();
            let tiempo = this.cronometro.getTiempo();
            if (tiempo == "0:00") {
                //Si el tiempo es 0 terminamos el juego
                clearInterval(this.espera);
                this.tiempoFinal();
            }
            cronometro_contenedor.innerHTML = tiempo;
        }, 1000);
    }

    tiempoFinal() {
        let finalizado = document.getElementById("sinTiempo");
        this.terminar();
        finalizado.innerHTML = "¡Se terminó el tiempo!";
    }

    //Chequeamos si quedan fichas por ubicar
    noHayMasFichas() {
        return this.fichas.length == this.contadorFichasUbicadas;
    }



}