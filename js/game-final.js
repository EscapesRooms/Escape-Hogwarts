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

const datos = preguntas[pista];

document.getElementById("bg").style.backgroundImage =
    `url('${datos.img}')`;

document.getElementById("localizacion").textContent =
    datos.localizacion;

document.getElementById("pregunta").textContent =
    datos.pregunta;

// Crear respuestas

let intentos = 0;

for (const letra in datos.respuestas) {

    const b = document.createElement("button");

    b.className = "opcion";

    b.id = letra;

    b.innerHTML =
        `<strong>${letra})</strong> ${datos.respuestas[letra]}`;

    b.onclick = () => comprobar(letra);

    document.getElementById("respuestas").appendChild(b);
}

// Comprobar respuesta

function comprobar(letra) {

    if (letra === datos.correcta) {

        document.getElementById(letra)
            .classList.add("correcta");

        document.getElementById("resultado")
            .innerHTML =
            "✅ ¡Correcto! Continúa hacia la siguiente pista.";

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
            "❌ Has agotado tus intentos.";

        desactivar();

    } else {

        document.getElementById("resultado")
            .innerHTML =
            "❌ Incorrecto. Te queda un intento.";
    }
}

function desactivar() {

    document
        .querySelectorAll(".opcion")
        .forEach(x => x.disabled = true);
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
