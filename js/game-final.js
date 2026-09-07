// Partículas mágicas

for (let i = 0; i < 50; i++) {

    const p = document.createElement("div");

    p.className = "magic";

    p.style.left = Math.random() * 100 + "vw";

    p.style.animationDuration = (8 + Math.random() * 15) + "s";

    p.style.animationDelay = Math.random() * 8 + "s";

    document.body.appendChild(p);
}


// Cargar pista

const pista = new URLSearchParams(window.location.search).get("pista") || "1";

let datos = preguntas[pista];
let numeroQuiz = 1;

const numerosPreguntas = Object.keys(preguntas)
    .map(Number)
    .sort((a, b) => a - b);

const posicionPregunta = numerosPreguntas.indexOf(Number(pista));

document.getElementById("progreso").textContent = pista === "1"
    ? `Prueba 1 · Pregunta ${numeroQuiz} de ${numerosPreguntas.length}`
    : `Prueba ${pista} · Minijuego`;

document.getElementById("bg").style.backgroundImage =
    `url('${datos.img}')`;

document.getElementById("localizacion").textContent =
    datos.localizacion;

document.getElementById("pregunta").textContent =
    datos.pregunta;

// Crear respuestas

let intentos = 0;

const mensajes = {
    runas: "Descifra la secuencia de runas para abrir el acceso mágico.",
    guardianes: "Despierta a los nueve guardianes en orden, del 1 al 9.",
    anden: "Encuentra la ruta secreta del andén.",
    pocion: "Controla el tren y llega hasta Via Júlia.",
    snitch: "Caza la Snitch dorada tres veces. Cada intento será más rápido.",
    hechizo: "Memoriza las secuencias mágicas y repítelas en el orden correcto."
};

if (datos.tipo) {
    prepararMinijuego();
} else {
    crearRespuestas();
}

function prepararMinijuego() {
    document.getElementById("pregunta").textContent = mensajes[datos.tipo];
    document.getElementById("minijuego").style.display = "block";
    document.getElementById("respuestas").style.display = "none";

    const juegos = {
        runas: pintarRunas,
        pocion: pintarPocion,
        guardianes: pintarGuardianes,
        anden: pintarAnden,
        snitch: pintarSnitch,
        hechizo: pintarHechizo
    };

    juegos[datos.tipo]();
}

function crearRespuestas() {

    for (const letra in datos.respuestas) {

        const b = document.createElement("button");

        b.className = "opcion";

        b.id = letra;

        b.innerHTML =
            `<strong>${letra})</strong> ${datos.respuestas[letra]}`;

        b.onclick = () => comprobar(letra);

        document.getElementById("respuestas").appendChild(b);
    }
}

// Comprobar respuesta

function comprobar(letra) {

    lanzarRelampago(letra === datos.correcta ? "acierto" : "error");

    if (letra === datos.correcta) {

        document.getElementById(letra)
            .classList.add("correcta");

        if (pista === "1") {
            document.getElementById("resultado").innerHTML = numeroQuiz === numerosPreguntas.length
                ? "✅ ¡Lo has conseguido! Has completado la Prueba 1."
                : "✅ ¡Correcto!<br><br><button class=\"siguiente\" onclick=\"siguientePregunta()\">➡️ Siguiente pregunta</button>";
        } else {
            document.getElementById("resultado").innerHTML = mensajeCorrecto();
        }

        desactivar();

        return;
    }

    intentos++;

    document.getElementById(letra)
        .classList.add("incorrecta");

    if (intentos >= 2) {

        document.getElementById(datos.correcta)
            .classList.add("correcta");

        document.getElementById("resultado")
            .innerHTML =
            "❌ Has agotado tus intentos.<br><br>La respuesta correcta era: <strong>" +
            datos.correcta + ") " +
            datos.respuestas[datos.correcta] +
            "</strong>" +
            (pista === "1" && numeroQuiz < numerosPreguntas.length
                ? "<br><br><button class=\"siguiente\" onclick=\"siguientePregunta()\">➡️ Siguiente pregunta</button>"
                : "");

        desactivar();

    } else {

        document.getElementById("resultado")
            .innerHTML =
            "❌ Incorrecto. Te queda un intento.";
    }
}

function siguientePregunta() {
    numeroQuiz++;
    datos = preguntas[numeroQuiz];
    intentos = 0;
    document.getElementById("progreso").textContent =
        `Prueba 1 · Pregunta ${numeroQuiz} de ${numerosPreguntas.length}`;
    document.getElementById("bg").style.backgroundImage =
        `url('${datos.img}')`;
    document.getElementById("localizacion").textContent = "📍 Harry Walker";
    document.getElementById("pregunta").textContent = datos.pregunta;
    document.getElementById("resultado").textContent = "";
    document.getElementById("respuestas").innerHTML = "";
    crearRespuestas();
}

function lanzarRelampago(tipo) {

    const relampago = document.createElement("div");

    relampago.className = `relampago ${tipo}`;
    relampago.setAttribute("aria-hidden", "true");
    document.body.appendChild(relampago);

    relampago.addEventListener("animationend", () => relampago.remove());
}

function desactivar() {

    document
        .querySelectorAll(".opcion")
        .forEach(x => x.disabled = true);
}

function mostrarExito(mensaje) {
    const enlace = datos.tipo === "coordenadas"
        ? '<br><br><a class="enlace-mapa" href="https://www.google.com/maps/search/?api=1&query=41.442361,2.177472" target="_blank" rel="noopener noreferrer">📍 Abrir coordenadas en Google Maps</a><br><small>41°26\'32.5"N 2°10\'38.9"E</small>'
        : "";

    document.getElementById("resultado").innerHTML =
        `✅ ${mensaje}${enlace}`;
}

function pintarRunas() {
    const contenedor = document.getElementById("minijuego");
    const solucion = ["☽", "✦", "⚡", "✹"];
    const runas = [...solucion].sort(() => Math.random() - .5);
    const elegidas = [];
    const tablero = document.createElement("div");
    const estado = document.createElement("div");

    tablero.className = "runas";
    estado.className = "estado-minijuego";
    estado.textContent = "Pulsa las runas en el orden correcto.";
    contenedor.append(tablero, estado);

    runas.forEach(runa => {
        const boton = document.createElement("button");
        boton.className = "runa";
        boton.textContent = runa;
        boton.setAttribute("aria-label", `Runa ${runa}`);
        boton.onclick = () => {
            if (runa !== solucion[elegidas.length]) {
                elegidas.length = 0;
                tablero.querySelectorAll("button").forEach(x => {
                    x.disabled = false;
                    x.classList.remove("runa-correcta");
                });
                estado.textContent = "❌ La secuencia se ha reiniciado.";
                return;
            }

            elegidas.push(runa);
            boton.disabled = true;
            boton.classList.add("runa-correcta");
            if (elegidas.length === solucion.length) {
                estado.textContent = "✨ Las runas obedecen tu magia.";
                mostrarExito("¡Has descifrado la secuencia mágica!");
            }
        };
        tablero.appendChild(boton);
    });
}

function pintarGuardianes() {
    const contenedor = document.getElementById("minijuego");
    const tablero = document.createElement("div");
    const estado = document.createElement("div");
    const numeros = Array.from({ length: 9 }, (_, indice) => indice + 1)
        .sort(() => Math.random() - .5);
    let siguiente = 1;
    let bloqueado = true;

    tablero.className = "guardianes";
    estado.className = "estado-minijuego";
    estado.textContent = "Memoriza la posición de los guardianes...";
    contenedor.append(tablero, estado);

    numeros.forEach(numero => {
        const boton = document.createElement("button");
        boton.className = "guardian";
        boton.textContent = numero;
        boton.disabled = true;
        boton.onclick = () => {
            if (bloqueado) return;

            if (numero !== siguiente) {
                siguiente = 1;
                tablero.querySelectorAll("button").forEach(x => {
                    x.disabled = false;
                    x.textContent = "?";
                    x.classList.remove("guardian-despierto");
                });
                estado.textContent = "❌ Error. Vuelve a empezar por el 1.";
                return;
            }

            boton.disabled = true;
            boton.textContent = numero;
            boton.classList.add("guardian-despierto");
            siguiente++;
            estado.textContent = siguiente === 10
                ? "✨ Los nueve guardianes están despiertos."
                : `Guardián siguiente: ${siguiente}`;
            if (siguiente === 10) mostrarExito("¡Has despertado a los nueve guardianes!");
        };
        tablero.appendChild(boton);
    });

    setTimeout(() => {
        bloqueado = false;
        tablero.querySelectorAll("button").forEach(boton => {
            boton.disabled = false;
            boton.textContent = "?";
        });
        estado.textContent = "Descubre los guardianes en orden, del 1 al 9.";
    }, 2200);
}

function pintarAnden() {
    const contenedor = document.getElementById("minijuego");
    const ruta = ["9", "3", "4", "7"];
    const tablero = document.createElement("div");
    const secuencia = document.createElement("div");
    const estado = document.createElement("div");
    let siguiente = 0;
    let visible = true;

    tablero.className = "anden";
    secuencia.className = "secuencia-anden";
    secuencia.textContent = ruta.join(" → ");
    estado.className = "estado-minijuego";
    estado.textContent = "Memoriza la ruta secreta...";
    contenedor.append(secuencia, tablero, estado);

    setTimeout(() => {
        visible = false;
        secuencia.textContent = "? → ? → ? → ?";
        estado.textContent = "Repite la ruta tocando los andenes.";
    }, 2200);

    ["1", "2", "3", "4", "5", "6", "7", "8", "9"].forEach(numero => {
        const boton = document.createElement("button");
        boton.className = "acceso-anden";
        boton.textContent = numero;
        boton.onclick = () => {
            if (visible) return;
            if (numero !== ruta[siguiente]) {
                siguiente = 0;
                visible = true;
                secuencia.textContent = ruta.join(" → ");
                estado.textContent = "❌ Ruta incorrecta. Memorízala otra vez.";
                tablero.querySelectorAll("button").forEach(x => {
                    x.disabled = false;
                    x.classList.remove("acceso-correcto");
                });
                setTimeout(() => {
                    visible = false;
                    secuencia.textContent = "? → ? → ? → ?";
                    estado.textContent = "Repite la ruta tocando los andenes.";
                }, 1800);
                return;
            }
            boton.disabled = true;
            boton.classList.add("acceso-correcto");
            siguiente++;
            if (siguiente === ruta.length) {
                estado.textContent = "✨ Has atravesado el andén mágico.";
                mostrarExito("¡Has encontrado el andén 9 y 3/4!");
            }
        };
        tablero.appendChild(boton);
    });
}

function pintarPocion() {
    const contenedor = document.getElementById("minijuego");
    const tramos = [
        { salida: "La Pau", correcta: "Verneda", alternativas: ["Poblenou", "Via Júlia"] },
        { salida: "Verneda", correcta: "La Salut", alternativas: ["Besòs", "Trinitat Nova"] },
        { salida: "La Salut", correcta: "Llucmajor", alternativas: ["Poblenou", "Barceloneta"] },
        { salida: "Llucmajor", correcta: "Via Júlia", alternativas: ["Joanic", "La Pau"] }
    ];
    const ruta = document.createElement("div");
    const tren = document.createElement("div");
    const opciones = document.createElement("div");
    const estado = document.createElement("div");
    let tramoActual = 0;

    ruta.className = "ruta-tren";
    tren.className = "tren-en-marcha";
    opciones.className = "opciones-tren";
    estado.className = "estado-minijuego";
    contenedor.append(ruta, tren, opciones, estado);

    function pintarTramo() {
        const tramo = tramos[tramoActual];
        const destinos = [tramo.correcta, ...tramo.alternativas]
            .sort(() => Math.random() - .5);

        ruta.innerHTML = `<span class="estacion-tren">🚉 ${tramo.salida}</span>` +
            `<span class="linea-tren">L4</span>` +
            `<span class="estacion-tren">🏁 Via Júlia</span>`;
        tren.textContent = "🚇";
        tren.classList.remove("tren-error", "tren-llegada");
        estado.textContent = `Tramo ${tramoActual + 1} de ${tramos.length}: elige la siguiente estación.`;
        opciones.innerHTML = "";

        destinos.forEach(destino => {
            const boton = document.createElement("button");
            boton.className = "destino-tren";
            boton.textContent = `🚇 ${destino}`;
            boton.onclick = () => {
                opciones.querySelectorAll("button").forEach(x => x.disabled = true);

                if (destino !== tramo.correcta) {
                    tramoActual = 0;
                    tren.classList.add("tren-error");
                    estado.textContent = "❌ Te has equivocado de vía. El tren vuelve a La Pau.";
                    setTimeout(pintarTramo, 900);
                    return;
                }

                boton.classList.add("destino-correcto");
                tren.classList.add("tren-llegada");
                tramoActual++;
                if (tramoActual === tramos.length) {
                    estado.textContent = "✨ El tren ha llegado a Via Júlia.";
                    mostrarExito("¡Has llegado a Via Júlia en tren!");
                    return;
                }

                estado.textContent = "✅ Cambio de vía correcto. Preparando el siguiente tramo...";
                setTimeout(pintarTramo, 700);
            };
            opciones.appendChild(boton);
        });
    }

    pintarTramo();
}

function pintarSnitch() {
    const contenedor = document.getElementById("minijuego");
    contenedor.innerHTML = '<button class="boton-snitch">⚡ Comenzar la caza de la Snitch ⚡</button>' +
        '<div class="zona-snitch"><button class="snitch" aria-label="Cazar Snitch dorada">⚡</button></div>' +
        '<div class="progreso-snitch">Capturas: 0 / 3</div>';
    const boton = contenedor.querySelector(".boton-snitch");
    const zona = contenedor.querySelector(".zona-snitch");
    const snitch = contenedor.querySelector(".snitch");
    const progreso = contenedor.querySelector(".progreso-snitch");
    let capturas = 0;
    let intervalo;
    const velocidadInicial = window.matchMedia("(max-width: 600px)").matches ? 950 : 1300;

    function mover() {
        snitch.style.left = `${8 + Math.random() * Math.max(0, zona.clientWidth - 74)}px`;
        snitch.style.top = `${8 + Math.random() * Math.max(0, zona.clientHeight - 74)}px`;
    }
    boton.onclick = () => {
        boton.disabled = true;
        zona.style.display = "block";
        mover();
        intervalo = setInterval(mover, velocidadInicial);
    };
    snitch.onclick = () => {
        capturas++;
        progreso.textContent = `Capturas: ${capturas} / 3`;
        if (capturas === 3) {
            clearInterval(intervalo);
            snitch.remove();
            mostrarExito("¡Has capturado la Snitch tres veces!");
        } else {
            clearInterval(intervalo);
            intervalo = setInterval(mover, velocidadInicial - capturas * 250);
            mover();
        }
    };
}

function pintarHechizo() {
    const contenedor = document.getElementById("minijuego");
    const simbolos = ["✦", "☽", "⚡", "✹", "☄", "♜"];
    const rondas = [3, 3, 3];
    let ronda = 0;
    let secuencia = [];
    let posicion = 0;
    let bloqueado = true;
    contenedor.innerHTML = '<div class="ronda-hechizo">Ronda 1 de 3</div>' +
        '<div class="secuencia-hechizo"></div><div class="runas-hechizo"></div>' +
        '<div class="estado-minijuego">Memoriza la secuencia...</div>';
    const vista = contenedor.querySelector(".secuencia-hechizo");
    const runas = contenedor.querySelector(".runas-hechizo");
    const estado = contenedor.querySelector(".estado-minijuego");

    function nuevaRonda() {
        contenedor.querySelector(".ronda-hechizo").textContent = `Ronda ${ronda + 1} de ${rondas.length}`;
        secuencia = [...simbolos].sort(() => Math.random() - .5).slice(0, rondas[ronda]);
        posicion = 0;
        bloqueado = true;
        vista.textContent = secuencia.join("  ");
        estado.textContent = "Memoriza la secuencia...";
        runas.querySelectorAll("button").forEach(x => {
            x.disabled = true;
            x.classList.remove("runa-acertada", "runa-fallida");
        });
        setTimeout(() => {
            bloqueado = false;
            vista.textContent = Array(rondas[ronda]).fill("?").join("  ");
            estado.textContent = "Repite la secuencia tocando las runas.";
            runas.querySelectorAll("button").forEach(x => x.disabled = false);
        }, 2200);
    }
    simbolos.forEach(simbolo => {
        const boton = document.createElement("button");
        boton.className = "runa-hechizo";
        boton.textContent = simbolo;
        boton.onclick = () => {
            if (bloqueado) return;
            if (simbolo !== secuencia[posicion]) {
                estado.textContent = "❌ Secuencia incorrecta. Observa otra vez.";
                nuevaRonda();
                return;
            }
            boton.disabled = true;
            boton.classList.add("runa-acertada");
            posicion++;
            if (posicion === secuencia.length) {
                ronda++;
                if (ronda === rondas.length) {
                    mostrarExito("¡Has dominado el hechizo final!");
                } else {
                    estado.textContent = "✨ Ronda superada.";
                    setTimeout(nuevaRonda, 700);
                }
            }
        };
        runas.appendChild(boton);
    });
    nuevaRonda();
}

function mensajeCorrecto() {

    const siguiente = numerosPreguntas[posicionPregunta + 1];

    if (siguiente === undefined) {
        return "✅ ¡Lo has conseguido! Has completado la Prueba 1.";
    }

    return "✅ ¡Correcto!<br><br>" +
        `<button class="siguiente" onclick="irAPregunta(${siguiente})">➡️ Siguiente pregunta</button>`;
}

function irAPregunta(numero) {

    window.location.href = `?pista=${numero}`;
}

// Música

const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

musicBtn.addEventListener("click", toggleMusic);

function toggleMusic() {

    if (music.paused) {

        music.play()
            .then(() => {
                musicBtn.innerHTML = "🔇 Silenciar Magia";
            })
            .catch(err => console.log(err));

    } else {

        music.pause();
        musicBtn.innerHTML = "🎵 Activar Magia";
    }
}

// Primer toque en cualquier parte de la pantalla
function iniciarMusica() {

    if (music.paused) {

        music.play()
            .then(() => {
                musicBtn.innerHTML = "🔇 Silenciar Magia";
            })
            .catch(() => {});
    }
}

// Móvil
document.addEventListener("touchstart", iniciarMusica, { once: true });

// PC
document.addEventListener("click", iniciarMusica, { once: true });
