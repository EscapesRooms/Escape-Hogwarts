
for(let i=0;i<50;i++){

const p=document.createElement("div");

p.className="magic";

p.style.left=Math.random()*100+"vw";

p.style.animationDuration=(8+Math.random()*15)+"s";

p.style.animationDelay=Math.random()*8+"s";

document.body.appendChild(p);

}

const preguntas={

1:{
img:"loc1.jpg",
localizacion:"📍 Harry Walker",
pregunta:"¿Qué forma adopta el Patronus de Luna Lovegood?",
correcta:"D",
respuestas:{
A:"Cisne",
B:"Cierva",
C:"Gato",
D:"Liebre"
}
},

2:{
img:"loc2.jpg",
localizacion:"📍 Zona Verde",
pregunta:"¿Qué objeto perteneció originalmente a Salazar Slytherin y acabó convertido en Horrocrux?",
correcta:"B",
respuestas:{
A:"Un Anillo",
B:"Un Guardapelo",
C:"Una Espada",
D:"Una Copa"
}
},

3:{
img:"loc3.jpg",
localizacion:"📍 Nou Pins",
pregunta:"¿Cómo se llama el centauro que ayuda a Harry en el Bosque Prohibido?",
correcta:"C",
respuestas:{
A:"Bane",
B:"Ronan",
C:"Firenze",
D:"Magorian"
}
},

4:{
img:"loc4.jpg",
localizacion:"📍 Metro Via Júlia",
pregunta:"¿Cuál es el nombre de la madre de Sirius Black?",
correcta:"C",
respuestas:{
A:"Bellatrix Black",
B:"Druella Black",
C:"Walburga Black",
D:"Andromeda Black"
}
},

5:{
img:"loc5.jpg",
localizacion:"📍 Fuentes Via Júlia",
pregunta:"¿Quién le da a Harry las branquialgas para realizar la segunda prueba del Torneo de los Tres Magos?",
correcta:"A",
respuestas:{
A:"Dobby",
B:"Neville",
C:"Ron",
D:"Hermione"
}
},

6:{
img:"loc6.jpg",
localizacion:"📍 Ángel Pestaña",
pregunta:"¿Cuál es el nombre completo de Albus Dumbledore?",
correcta:"B",
respuestas:{
A:"Albus Percival Walfred Brian Dumbledore",
B:"Albus Percival Wulfric Brian Dumbledore",
C:"Albus Percival Wilfred Brian Dumbledore",
D:"Albus Percival Wulfric Brayan Dumbledore"
}
}

};

const pista=new URLSearchParams(window.location.search).get("pista")||"1";

const datos=preguntas[pista];

document.getElementById("bg").style.backgroundImage=
`url('${datos.img}')`;

document.getElementById("localizacion").textContent=
datos.localizacion;

document.getElementById("pregunta").textContent=
datos.pregunta;

let intentos=0;

for(const letra in datos.respuestas){

const b=document.createElement("button");

b.className="opcion";

b.id=letra;

b.innerHTML=
`<strong>${letra})</strong> ${datos.respuestas[letra]}`;

b.onclick=()=>comprobar(letra);

document.getElementById("respuestas").appendChild(b);
}

function comprobar(letra){

if(letra===datos.correcta){

document.getElementById(letra)
.classList.add("correcta");

document.getElementById("resultado")
.innerHTML=
"✅ ¡Correcto! Continúa hacia la siguiente pista.";

desactivar();

return;
}

intentos++;

document.getElementById(letra)
.classList.add("incorrecta");

if(intentos>=2){

document.getElementById(datos.correcta)
.classList.add("correcta");

document.getElementById("resultado")
.innerHTML=
"❌ Has agotado tus intentos.";

desactivar();

}else{

document.getElementById("resultado")
.innerHTML=
"❌ Incorrecto. Te queda un intento.";
}
}

function desactivar(){

document.querySelectorAll(".opcion")
.forEach(x=>x.disabled=true);

}

const music = document.getElementById("music");
const musicBtn = document.getElementById("musicBtn");

function toggleMusic(){

    if(music.paused){

        music.play()
        .then(() => {
            musicBtn.innerHTML = "🔇 Silenciar Magia";
        })
        .catch(err => {
            console.log(err);
        });

    }else{

        music.pause();
        musicBtn.innerHTML = "🎵 Activar Magia";
    }
}

function iniciarMusica(){

    music.play()
    .then(() => {
        musicBtn.innerHTML = "🔇 Silenciar Magia";
    })
    .catch(() => {});
}

document.addEventListener("touchstart", iniciarMusica, {once:true});
document.addEventListener("click", iniciarMusica, {once:true});
