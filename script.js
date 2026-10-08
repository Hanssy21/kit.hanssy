/* =========================================================
   kit.hanssy
   Reloj + Calendario + Notas + Calculadora
========================================================= */


/* =========================================================
   RELOJ
========================================================= */

const hora =
    document.getElementById("hora");

const minuto =
    document.getElementById("minuto");

const segundo =
    document.getElementById("segundo");

const digital =
    document.getElementById("digital");

const clock =
    document.querySelector(".clock");

const clockMarks =
    document.querySelector(".clock-marks");


/*
    Crear las 60 marcas del reloj.
*/

for (let i = 0; i < 60; i++) {

    const mark =
        document.createElement("div");

    mark.className =
        "clock-mark";

    if (i % 5 === 0) {

        mark.classList.add(
            "major"
        );
    }


    /*
        Cada minuto equivale a 6 grados.
    */

    const angle =
        i * 6;


    mark.style.transform =
        `
        translate(-50%, -50%)
        rotate(${angle}deg)
        translateY(-150px)
        `;


    clockMarks.appendChild(mark);
}


/*
    Actualizar el reloj.
*/

function actualizarReloj() {

    const ahora =
        new Date();


    const h =
        ahora.getHours();

    const m =
        ahora.getMinutes();

    const s =
        ahora.getSeconds();


    /*
        Movimiento de la aguja horaria.
    */

    const gradosHora =
        (h % 12) * 30
        +
        m * 0.5;


    /*
        Movimiento de la aguja minutera.
    */

    const gradosMinuto =
        m * 6
        +
        s * 0.1;


    /*
        Movimiento de la aguja segundera.
    */

    const gradosSegundo =
        s * 6;


    hora.style.transform =
        `rotate(${gradosHora}deg)`;


    minuto.style.transform =
        `rotate(${gradosMinuto}deg)`;


    segundo.style.transform =
        `rotate(${gradosSegundo}deg)`;


    /*
        Reloj digital.
    */

    digital.textContent =
        `${String(h).padStart(2, "0")}:` +
        `${String(m).padStart(2, "0")}:` +
        `${String(s).padStart(2, "0")}`;
}


/*
    Ejecutar inmediatamente.
*/

actualizarReloj();


/*
    Actualizar cada segundo.
*/

setInterval(
    actualizarReloj,
    1000
);



/* =========================================================
   CALENDARIO
========================================================= */

const anterior =
    document.getElementById("prev");

const siguiente =
    document.getElementById("next");

const tituloMes =
    document.getElementById("mes");

const grid =
    document.getElementById("grid");

const nota =
    document.getElementById("nota");

const guardar =
    document.getElementById("guardar");


/*
    Fecha que estamos visualizando.
*/

let fecha =
    new Date();


/*
    Día seleccionado.
*/

let seleccionado =
    null;


/*
    Recuperar notas.

    localStorage permite que las notas
    permanezcan guardadas en ese navegador.
*/

let notas = {};


try {

    notas =
        JSON.parse(
            localStorage.getItem(
                "kitHanssyNotas"
            )
        ) || {};

} catch (error) {

    notas = {};
}


/*
    Dibujar calendario.
*/

function dibujarCalendario() {

    /*
        Limpiar calendario anterior.
    */

    grid.innerHTML = "";


    const año =
        fecha.getFullYear();

    const mesActual =
        fecha.getMonth();


    /*
        Nombre del mes.
    */

    tituloMes.textContent =
        fecha.toLocaleDateString(
            "es-ES",
            {
                month: "long",
                year: "numeric"
            }
        );


    /*
        Día de la semana
        en que empieza el mes.

        Domingo = 0
        Lunes = 1
        ...
    */

    const primero =
        new Date(
            año,
            mesActual,
            1
        ).getDay();


    /*
        Total de días del mes.
    */

    const total =
        new Date(
            año,
            mesActual + 1,
            0
        ).getDate();


    /*
        Espacios antes del primer día.
    */

    for (
        let i = 0;
        i < primero;
        i++
    ) {

        const vacio =
            document.createElement(
                "div"
            );

        grid.appendChild(
            vacio
        );
    }


    /*
        Crear los días.
    */

    for (
        let d = 1;
        d <= total;
        d++
    ) {

        const dia =
            document.createElement(
                "div"
            );

        dia.className =
            "day";

        dia.textContent =
            d;


        /*
            Crear una clave única.

            Ejemplo:

            2026-8-12
        */

        const clave =
            `${año}-${mesActual + 1}-${d}`;


        /*
            Si tiene nota,
            iluminamos el día.
        */

        if (
            notas[clave] &&
            notas[clave].trim() !== ""
        ) {

            dia.style.boxShadow =
                "0 0 10px cyan";
        }


        /*
            Si era el día seleccionado,
            mantenerlo seleccionado.
        */

        if (
            seleccionado === clave
        ) {

            dia.classList.add(
                "selected"
            );
        }


        /*
            Seleccionar día.
        */

        dia.addEventListener(
            "click",
            () => {

                seleccionado =
                    clave;


                /*
                    Quitar selección anterior.
                */

                document
                    .querySelectorAll(
                        ".day"
                    )
                    .forEach(
                        elemento => {

                            elemento
                                .classList
                                .remove(
                                    "selected"
                                );
                        }
                    );


                /*
                    Seleccionar actual.
                */

                dia.classList.add(
                    "selected"
                );


                /*
                    Cargar nota.
                */

                nota.value =
                    notas[clave] || "";

            }
        );


        grid.appendChild(
            dia
        );
    }
}


/*
    Guardar nota.
*/

guardar.addEventListener(
    "click",
    () => {

        if (!seleccionado) {

            alert(
                "Selecciona primero un día del calendario."
            );

            return;
        }


        /*
            Guardar texto.
        */

        notas[seleccionado] =
            nota.value;


        /*
            Guardar en navegador.
        */

        localStorage.setItem(
            "kitHanssyNotas",
            JSON.stringify(notas)
        );


        /*
            Redibujar.
        */

        dibujarCalendario();
    }
);


/*
    Mes anterior.
*/

anterior.addEventListener(
    "click",
    () => {

        fecha.setMonth(
            fecha.getMonth() - 1
        );

        seleccionado = null;

        nota.value = "";

        dibujarCalendario();
    }
);


/*
    Mes siguiente.
*/

siguiente.addEventListener(
    "click",
    () => {

        fecha.setMonth(
            fecha.getMonth() + 1
        );

        seleccionado = null;

        nota.value = "";

        dibujarCalendario();
    }
);


/*
    Dibujar calendario inicialmente.
*/

dibujarCalendario();



/* =========================================================
   CALCULADORA
========================================================= */

const display =
    document.getElementById(
        "calc-display"
    );

const resultado =
    document.getElementById(
        "calc-result"
    );

const clear =
    document.getElementById(
        "clear"
    );

const calculate =
    document.getElementById(
        "calculate"
    );


/*
    Obtener botones.
*/

const botones =
    document.querySelectorAll(
        ".calc-buttons button[data-value]"
    );


/*
    Cuando se pulsa un número
    u operador.
*/

botones.forEach(
    boton => {

        boton.addEventListener(
            "click",
            () => {

                display.value +=
                    boton.dataset.value;

                display.focus();
            }
        );
    }
);



/* =========================================================
   VALIDACIÓN DE OPERACIONES
========================================================= */


/*
    Solamente permitimos:

    números
    +
    -
    *
    /
    .
    paréntesis
    espacios

    Esto impide introducir
    código JavaScript.
*/

function expresionValida(
    expresion
) {

    return /^[0-9+\-*/().\s]+$/.test(
        expresion
    );
}


/*
    Calcular expresión.
*/

function calcularExpresion(
    expresion
) {

    if (
        !expresion.trim()
    ) {

        throw new Error(
            "Escribe una operación."
        );
    }


    if (
        !expresionValida(
            expresion
        )
    ) {

        throw new Error(
            "Operación no válida."
        );
    }


    /*
        Evaluar la operación matemática.

        La expresión ya fue filtrada
        para permitir únicamente
        caracteres matemáticos.
    */

    const valor =
        Function(
            `"use strict"; return (${expresion})`
        )();


    /*
        Comprobar resultado.
    */

    if (
        typeof valor !== "number"
        ||
        !Number.isFinite(valor)
    ) {

        throw new Error(
            "Resultado no válido."
        );
    }


    return valor;
}



/* =========================================================
   ANIMACIÓN ESPECIAL 88
========================================================= */

const magic88 =
    document.getElementById(
        "magic88"
    );


/*
    Activar animación.
*/

function animacion88() {

    /*
        Quitar clase para reiniciar.
    */

    magic88.classList.remove(
        "show"
    );


    /*
        Forzar al navegador a recalcular.
    */

    void magic88.offsetWidth;


    /*
        Activar.
    */

    magic88.classList.add(
        "show"
    );


    /*
        Quitar después de 3 segundos.
    */

    setTimeout(
        () => {

            magic88.classList.remove(
                "show"
            );

        },
        3000
    );
}



/* =========================================================
   CALCULAR
========================================================= */

function realizarCalculo() {

    try {

        const valor =
            calcularExpresion(
                display.value
            );


        /*
            Mostrar resultado normal.
        */

        resultado.textContent =
            `Resultado: ${valor}`;


        resultado.classList.remove(
            "success"
        );


        /*
            COMPROBACIÓN ESPECIAL.
        */

        if (
            valor === 88
        ) {

            /*
                Mostrar mensaje.
            */

            resultado.textContent =
                "✨ ¡Resultado especial: 88! ✨";


            resultado.classList.add(
                "success"
            );


            /*
                Activar animación.
            */

            animacion88();
        }

    } catch (error) {

        resultado.textContent =
            error.message;

        resultado.classList.remove(
            "success"
        );
    }
}


/*
    Botón =
*/

calculate.addEventListener(
    "click",
    realizarCalculo
);


/*
    Botón C.
*/

clear.addEventListener(
    "click",
    () => {

        display.value = "";

        resultado.textContent =
            "Resultado";

        resultado.classList.remove(
            "success"
        );

        display.focus();
    }
);


/*
    ENTER = calcular.
*/

display.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            event.preventDefault();

            realizarCalculo();
        }


        /*
            ESC = limpiar.
        */

        if (
            event.key === "Escape"
        ) {

            display.value = "";

            resultado.textContent =
                "Resultado";

            resultado.classList.remove(
                "success"
            );
        }
    }
);
/* =========================================================
   CRONÓMETRO RELOJ DE ARENA
========================================================= */

const hourglassTimer =
    document.querySelector(".hourglass-timer");

const timerDisplay =
    document.getElementById("timer-display");

const timerMinutes =
    document.getElementById("timer-minutes");

const timerStart =
    document.getElementById("timer-start");

const timerReset =
    document.getElementById("timer-reset");

const timerStatus =
    document.getElementById("timer-status");

const sandTop =
    document.getElementById("sand-top");

const sandBottom =
    document.getElementById("sand-bottom");

const sandStream =
    document.getElementById("sand-stream");


/*
    Tiempo total y tiempo restante.
*/

let tiempoTotal = 5 * 60;

let tiempoRestante = tiempoTotal;

let intervaloTimer = null;

let timerCorriendo = false;


/*
    Convertir segundos a MM:SS.
*/

function formatearTiempo(segundos) {

    const minutos =
        Math.floor(segundos / 60);

    const segundosRestantes =
        segundos % 60;

    return (
        String(minutos).padStart(2, "0") +
        ":" +
        String(segundosRestantes).padStart(2, "0")
    );
}


/*
    Actualizar pantalla.
*/

function actualizarTimer() {

    timerDisplay.textContent =
        formatearTiempo(
            tiempoRestante
        );


    /*
        Porcentaje de arena restante.
    */

    const porcentaje =
        tiempoRestante / tiempoTotal;


    /*
        Arena superior.

        Nunca llega exactamente a 0
        para mantener visible la forma.
    */

    const alturaSuperior =
        Math.max(
            8,
            porcentaje * 90
        );


    sandTop.style.height =
        `${alturaSuperior}%`;


    /*
        Arena inferior.
    */

    const porcentajeLlenado =
        1 - porcentaje;

    const alturaInferior =
        Math.max(
            8,
            porcentajeLlenado * 80
        );


    sandBottom.style.height =
        `${alturaInferior}%`;
}


/*
    Iniciar cronómetro.
*/

function iniciarTimer() {

    /*
        Si ya está funcionando,
        no crear otro intervalo.
    */

    if (timerCorriendo) {
        return;
    }


    /*
        Si estaba terminado,
        volver a empezar.
    */

    if (tiempoRestante <= 0) {

        prepararNuevoTimer();
    }


    timerCorriendo = true;

    hourglassTimer.classList.remove(
        "finished"
    );

    hourglassTimer.classList.add(
        "running"
    );

    timerStart.textContent =
        "❚❚ PAUSAR";

    timerStatus.textContent =
        "Cronómetro funcionando";


    intervaloTimer =
        setInterval(
            () => {

                tiempoRestante--;

                actualizarTimer();


                /*
                    Llegó a cero.
                */

                if (
                    tiempoRestante <= 0
                ) {

                    finalizarTimer();
                }

            },
            1000
        );
}


/*
    Pausar cronómetro.
*/

function pausarTimer() {

    clearInterval(
        intervaloTimer
    );

    intervaloTimer = null;

    timerCorriendo = false;

    hourglassTimer.classList.remove(
        "running"
    );

    timerStart.textContent =
        "▶ CONTINUAR";

    timerStatus.textContent =
        "Cronómetro pausado";
}


/*
    Finalizar.
*/

function finalizarTimer() {

    clearInterval(
        intervaloTimer
    );

    intervaloTimer = null;

    timerCorriendo = false;

    tiempoRestante = 0;

    actualizarTimer();

    hourglassTimer.classList.remove(
        "running"
    );

    hourglassTimer.classList.add(
        "finished"
    );

    timerStart.textContent =
        "▶ INICIAR";

    timerStatus.textContent =
        "⏳ ¡TIEMPO TERMINADO!";
}


/*
    Preparar nuevo cronómetro.
*/

function prepararNuevoTimer() {

    const minutos =
        parseInt(
            timerMinutes.value,
            10
        );


    /*
        Validar minutos.
    */

    if (
        isNaN(minutos) ||
        minutos < 1
    ) {

        timerMinutes.value = 1;

        tiempoTotal = 60;

    } else {

        tiempoTotal =
            minutos * 60;
    }


    tiempoRestante =
        tiempoTotal;


    actualizarTimer();


    hourglassTimer.classList.remove(
        "finished"
    );

    timerStatus.textContent =
        "Listo para comenzar";
}


/*
    Botón iniciar / pausar.
*/

timerStart.addEventListener(
    "click",
    () => {

        if (timerCorriendo) {

            pausarTimer();

        } else {

            iniciarTimer();
        }
    }
);


/*
    Botón reiniciar.
*/

timerReset.addEventListener(
    "click",
    () => {

        clearInterval(
            intervaloTimer
        );

        intervaloTimer = null;

        timerCorriendo = false;

        prepararNuevoTimer();

        timerStart.textContent =
            "▶ INICIAR";
    }
);


/*
    Si cambia el número de minutos,
    actualizar el tiempo cuando
    el cronómetro no está funcionando.
*/

timerMinutes.addEventListener(
    "change",
    () => {

        if (!timerCorriendo) {

            prepararNuevoTimer();
        }
    }
);


/*
    Inicializar.
*/

prepararNuevoTimer();
/*/* =========================================================
   MANEKI NEKO
   Pata móvil + tecla 8 + flores de cerezo
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* =====================================================
           ELEMENTOS
        ===================================================== */

        const manekiStage =
            document.getElementById(
                "maneki-stage"
            );

        const manekiPaw =
            document.getElementById(
                "maneki-paw"
            );

        const sakuraContainer =
            document.getElementById(
                "sakura-container"
            );


        /* =====================================================
           COMPROBAR ELEMENTOS
        ===================================================== */

        if (!manekiPaw) {

            console.error(
                "Maneki Neko: no se encontró #maneki-paw"
            );

            return;
        }


        if (!sakuraContainer) {

            console.error(
                "Maneki Neko: no se encontró #sakura-container"
            );
        }


        /* =====================================================
           MOVER PATA
        ===================================================== */

        function moverPataManeki() {

            /*
                Reiniciar animación.
            */

            manekiPaw.classList.remove(
                "waving"
            );


            /*
                Forzar al navegador a
                reiniciar la animación.
            */

            void manekiPaw.offsetWidth;


            /*
                Activar animación.
            */

            manekiPaw.classList.add(
                "waving"
            );


            /*
                Crear flores.
            */

            crearFloresSakura();
        }


        /* =====================================================
           CREAR FLORES DE CEREZO
        ===================================================== */

        function crearFloresSakura() {

            if (!sakuraContainer) {
                return;
            }


            /*
                Crear 8 flores.
            */

            for (
                let i = 0;
                i < 8;
                i++
            ) {

                const flor =
                    document.createElement(
                        "div"
                    );


                flor.className =
                    "sakura";


                /*
                    Posición horizontal.
                */

                const x =
                    10 +
                    Math.random() * 80;


                /*
                    Posición vertical.
                */

                const y =
                    5 +
                    Math.random() * 30;


                flor.style.left =
                    `${x}%`;

                flor.style.top =
                    `${y}%`;


                /*
                    Dirección de caída.
                */

                const fallX =
                    -100 +
                    Math.random() * 200;


                const fallY =
                    180 +
                    Math.random() * 220;


                flor.style.setProperty(
                    "--fall-x",
                    `${fallX}px`
                );


                flor.style.setProperty(
                    "--fall-y",
                    `${fallY}px`
                );


                /*
                    Retraso aleatorio.
                */

                const delay =
                    Math.random() * 0.4;


                flor.style.animationDelay =
                    `${delay}s`;


                /*
                    Duración aleatoria.
                */

                const duracion =
                    2.5 +
                    Math.random() * 1.5;


                flor.style.animationDuration =
                    `${duracion}s`;


                /*
                    Tamaño aleatorio.
                */

                const tamaño =
                    10 +
                    Math.random() * 12;


                flor.style.width =
                    `${tamaño}px`;


                flor.style.height =
                    `${tamaño}px`;


                /*
                    Añadir al escenario.
                */

                sakuraContainer.appendChild(
                    flor
                );


                /*
                    Eliminar después
                    de terminar.
                */

                setTimeout(
                    () => {

                        flor.remove();

                    },
                    4500
                );
            }
        }


  /* =====================================================
   CLICK / TOQUE EN EL GATO
   PC + CELULAR
===================================================== */

const manekiNeko =
    document.querySelector(".maneki-neko");

if (manekiNeko) {

    manekiNeko.style.cursor = "pointer";

}


/*
    pointerup funciona con:

    🖱️ Mouse
    👆 Pantalla táctil
    🖊️ Lápiz táctil
*/

document.addEventListener(
    "pointerup",
    event => {

        if (
            event.target.closest(".maneki-neko")
        ) {

            moverPataManeki();

        }

    }
);


/* =====================================================
   TECLA 8
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        /*
            8 del teclado normal.
        */

        if (
            event.key === "8"
        ) {

            moverPataManeki();

            return;
        }


        /*
            8 del teclado numérico.
        */

        if (
            event.code === "Numpad8"
        ) {

            moverPataManeki();

        }

    }
);


/* =====================================================
   PRUEBA
===================================================== */

console.log(
    "Maneki Neko funcionando correctamente"
);

    }
);
/* =========================================================
   JUEGO DE DADOS
   2 dados + jugadores + turnos + ranking
========================================================= */

const diceGame =
    document.getElementById("dice-game");

if (diceGame) {

    const dicePlayerName =
    document.getElementById(
        "dice-player-name"
    );

const diceAddPlayer =
    document.getElementById(
        "dice-add-player"
    );

const diceRemovePlayer =
    document.getElementById(
        "dice-remove-player"
    );

const diceRoll =
    document.getElementById(
        "dice-roll"
    );

    const diceNextTurn =
        document.getElementById(
            "dice-next-turn"
        );

    const diceNewGame =
        document.getElementById(
            "dice-new-game"
        );

    const diceOne =
        document.getElementById(
            "dice-one"
        );

    const diceTwo =
        document.getElementById(
            "dice-two"
        );

    const diceCurrentPlayer =
        document.getElementById(
            "dice-current-player"
        );

    const diceRoundResult =
        document.getElementById(
            "dice-round-result"
        );

    const diceMessage =
        document.getElementById(
            "dice-message"
        );

    const diceTotalScore =
        document.getElementById(
            "dice-total-score"
        );

    const diceRankingList =
        document.getElementById(
            "dice-ranking-list"
        );


    /* =====================================================
       ESTADO DEL JUEGO
    ===================================================== */

    let dicePlayers = [];

    let diceCurrentIndex = 0;

    let diceHasRolled = false;

    let diceRolling = false;


    /* =====================================================
       VALOR INICIAL
    ===================================================== */

    let diceValueOne = 1;

    let diceValueTwo = 1;


    /* =====================================================
       MOSTRAR PUNTOS DEL DADO
    ===================================================== */

    function mostrarDado(
        dado,
        valor
    ) {

        const puntos =
            dado.querySelectorAll(
                "span"
            );


        /*
            Posiciones de los puntos.

            1 = centro
            2 = esquinas diagonales
            etc.
        */

        const posiciones = {

            1: [5],

            2: [1, 9],

            3: [1, 5, 9],

            4: [1, 3, 7, 9],

            5: [1, 3, 5, 7, 9],

            6: [1, 3, 4, 6, 7, 9]

        };


        puntos.forEach(
            punto => {

                punto.style.opacity =
                    "0";

                punto.style.transform =
                    "scale(.4)";
            }
        );


        posiciones[valor]
            .forEach(
                posicion => {

                    const punto =
                        puntos[
                            posicion - 1
                        ];

                    punto.style.opacity =
                        "1";

                    punto.style.transform =
                        "scale(1)";
                }
            );
    }


    /* =====================================================
       ACTUALIZAR JUGADOR ACTUAL
    ===================================================== */

   function actualizarJugadorActual() {

    const jugador =
        dicePlayers[
            diceCurrentIndex
        ];

    /*
        No hay jugadores.
    */

    if (!jugador) {

        diceCurrentPlayer.innerHTML =
            `Jugador actual: <strong>Ningún jugador</strong>`;

        diceTotalScore.textContent =
            "0";

        return;
    }


    /*
        Mostrar jugador actual.
    */

    diceCurrentPlayer.innerHTML =
        `Jugador actual: <strong>${escaparTexto(jugador.name)}</strong>`;


    /*
        Mostrar puntuación.
    */

    diceTotalScore.textContent =
        jugador.score;
}


    /* =====================================================
       ESCAPAR TEXTO
       Evita insertar HTML proveniente
       del nombre del jugador.
    ===================================================== */

    function escaparTexto(texto) {

        const temporal =
            document.createElement(
                "div"
            );

        temporal.textContent =
            texto;

        return temporal.innerHTML;
    }


    /* =====================================================
       RANKING
    ===================================================== */

    function actualizarRanking() {

        diceRankingList.innerHTML =
            "";


        const ranking =
            [...dicePlayers]
                .sort(
                    (a, b) =>
                        b.score - a.score
                );


        ranking.forEach(
            (jugador, index) => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "dice-ranking-item";


                /*
                    Saber si este jugador
                    es el jugador actual.
                */

                const indiceOriginal =
                    dicePlayers.indexOf(
                        jugador
                    );


                if (
                    indiceOriginal ===
                    diceCurrentIndex
                ) {

                    item.classList.add(
                        "active"
                    );
                }


                const posicion =
                    document.createElement(
                        "span"
                    );

                posicion.className =
                    "dice-ranking-position";

                posicion.textContent =
                    `${index + 1}º`;


                const nombre =
                    document.createElement(
                        "span"
                    );

                nombre.className =
                    "dice-ranking-name";

                nombre.textContent =
                    jugador.name;


                const puntos =
                    document.createElement(
                        "span"
                    );

                puntos.className =
                    "dice-ranking-score";

                puntos.textContent =
                    `${jugador.score} puntos`;


                item.appendChild(
                    posicion
                );

                item.appendChild(
                    nombre
                );

                item.appendChild(
                    puntos
                );


                diceRankingList.appendChild(
                    item
                );
            }
        );
    }


    /* =====================================================
       LANZAMIENTO ALEATORIO
    ===================================================== */

    function lanzarDado() {

        /*
            Número entero entre 1 y 6.
        */

        return Math.floor(
            Math.random() * 6
        ) + 1;
    }


    /* =====================================================
       LANZAR LOS DOS DADOS
    ===================================================== */

    function lanzarDadosJuego() {

        if (diceRolling) {
            return;
        }


        if (
            dicePlayers.length === 0
        ) {

            diceMessage.textContent =
                "Agrega al menos un jugador.";

            return;
        }


        /*
            Evitar lanzar dos veces
            en el mismo turno.
        */

        if (diceHasRolled) {

            diceMessage.textContent =
                "Pulsa SIGUIENTE TURNO para continuar.";

            return;
        }


        diceRolling = true;


        diceOne.classList.remove(
            "rolling"
        );

        diceTwo.classList.remove(
            "rolling"
        );


        /*
            Reiniciar animación.
        */

        void diceOne.offsetWidth;

        void diceTwo.offsetWidth;


        diceOne.classList.add(
            "rolling"
        );

        diceTwo.classList.add(
            "rolling"
        );


        /*
            Generar resultados.
        */

        diceValueOne =
            lanzarDado();

        diceValueTwo =
            lanzarDado();


        const total =
            diceValueOne +
            diceValueTwo;


        const jugador =
            dicePlayers[
                diceCurrentIndex
            ];


        /*
            Mostrar dados después
            de la pequeña animación.
        */

        setTimeout(
            () => {

                mostrarDado(
                    diceOne,
                    diceValueOne
                );

                mostrarDado(
                    diceTwo,
                    diceValueTwo
                );


                /*
                    Sumar puntuación.
                */

                jugador.score +=
                    total;


                diceHasRolled = true;

                diceRolling = false;


                /*
                    Resultado.
                */

                diceRoundResult.textContent =
                    `🎲 ${diceValueOne} + ${diceValueTwo} = ${total} puntos`;


                diceMessage.textContent =
                    `${jugador.name} sacó ${total} puntos.`;


                diceTotalScore.textContent =
                    jugador.score;


                actualizarRanking();

            },
            550
        );
    }


    /* =====================================================
       SIGUIENTE TURNO
    ===================================================== */

    function siguienteTurnoJuego() {

        if (diceRolling) {
            return;
        }


        if (!diceHasRolled) {

            diceMessage.textContent =
                "Primero lanza los dados.";

            return;
        }


        /*
            Pasar al siguiente jugador.
        */

        diceCurrentIndex =
            (
                diceCurrentIndex + 1
            ) %
            dicePlayers.length;


        diceHasRolled = false;


        const jugador =
            dicePlayers[
                diceCurrentIndex
            ];


        diceRoundResult.textContent =
            "Lanza los dados";


        diceMessage.textContent =
            `Turno de ${jugador.name}`;


        actualizarJugadorActual();

        actualizarRanking();
    }


    /* =====================================================
       AGREGAR JUGADOR
    ===================================================== */

    function agregarJugador() {

        const nombre =
            dicePlayerName.value
                .trim();


        if (!nombre) {

            diceMessage.textContent =
                "Escribe un nombre.";

            dicePlayerName.focus();

            return;
        }


        if (
            dicePlayers.length >= 8
        ) {

            diceMessage.textContent =
                "Máximo 8 jugadores.";

            return;
        }


        /*
            Evitar nombres duplicados.
        */

        const existe =
            dicePlayers.some(
                jugador =>
                    jugador.name
                        .toLowerCase() ===
                    nombre.toLowerCase()
            );


        if (existe) {

            diceMessage.textContent =
                "Ese jugador ya existe.";

            dicePlayerName.select();

            return;
        }


       const primerJugador =
    dicePlayers.length === 0;

dicePlayers.push({
    name: nombre,
    score: 0
});

if (primerJugador) {
    diceCurrentIndex = 0;
    diceHasRolled = false;
}


        dicePlayerName.value =
            "";


        diceMessage.textContent =
            `${nombre} fue agregado a la partida.`;


        actualizarRanking();
        actualizarJugadorActual();

        dicePlayerName.focus();
    }

/* =====================================================
   ELIMINAR JUGADOR
===================================================== */

function eliminarJugador() {

    /*
        No hay jugadores.
    */

    if (dicePlayers.length === 0) {

        diceMessage.textContent =
            "No hay ningún jugador para eliminar.";

        return;
    }


    /*
        Obtener jugador actual.
    */

    const jugadorEliminado =
        dicePlayers[
            diceCurrentIndex
        ];


    /*
        Eliminar jugador actual.
    */

    dicePlayers.splice(
        diceCurrentIndex,
        1
    );


    /*
        Si ya no quedan jugadores.
    */

    if (
        dicePlayers.length === 0
    ) {

        diceCurrentIndex = 0;

        diceHasRolled = false;

        diceRoundResult.textContent =
            "Lanza los dados";

        diceMessage.textContent =
            `${jugadorEliminado.name} fue eliminado. Agrega un jugador para comenzar.`;

        actualizarJugadorActual();

        actualizarRanking();

        return;
    }


    /*
        Si eliminamos al último jugador
        de la lista, volver al primero.
    */

    if (
        diceCurrentIndex >=
        dicePlayers.length
    ) {

        diceCurrentIndex = 0;
    }


    /*
        Reiniciar turno.
    */

    diceHasRolled = false;


    diceRoundResult.textContent =
        "Lanza los dados";


    diceMessage.textContent =
        `${jugadorEliminado.name} fue eliminado.`;


    actualizarJugadorActual();

    actualizarRanking();
}
    /* =====================================================
       NUEVA PARTIDA
    ===================================================== */

    function nuevaPartidaDados() {

        dicePlayers.forEach(
            jugador => {

                jugador.score = 0;
            }
        );


        diceCurrentIndex = 0;

        diceHasRolled = false;

        diceRolling = false;


        diceValueOne = 1;

        diceValueTwo = 1;


        mostrarDado(
            diceOne,
            1
        );

        mostrarDado(
            diceTwo,
            1
        );


        diceRoundResult.textContent =
            "Lanza los dados";


        diceMessage.textContent =
            "¡Nueva partida! Agrega un jugador para comenzar.by HANSSY ROY ";


        actualizarJugadorActual();

        actualizarRanking();
    }


    /* =====================================================
       EVENTOS
    ===================================================== */

    diceRoll.addEventListener(
        "click",
        lanzarDadosJuego
    );


    diceNextTurn.addEventListener(
        "click",
        siguienteTurnoJuego
    );


    diceAddPlayer.addEventListener(
        "click",
        agregarJugador
    );
    
    diceRemovePlayer.addEventListener(
    "click",
    eliminarJugador
    );


    diceNewGame.addEventListener(
        "click",
        nuevaPartidaDados
    );


    /*
        ENTER para agregar jugador.
    */

    dicePlayerName.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                agregarJugador();
            }
        }
    );


    /* =====================================================
       INICIALIZAR
    ===================================================== */

    mostrarDado(
        diceOne,
        diceValueOne
    );

    mostrarDado(
        diceTwo,
        diceValueTwo
    );

    actualizarJugadorActual();

    actualizarRanking();

}
