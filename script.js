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