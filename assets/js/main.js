AOS.init({
    duration:1200,
    once:true
});

/* ================================= */
/* NAVBAR SCROLL EFFECT */
/* ================================= */

window.addEventListener("scroll",()=>{

    const navbar =
    document.querySelector(".custom-navbar");

    if(window.scrollY > 50){

        navbar.style.boxShadow =
        "0 4px 15px rgba(0,0,0,.08)";

    }else{

        navbar.style.boxShadow =
        "none";

    }

});

const counters =
document.querySelectorAll(".counter");

counters.forEach(counter=>{

    const updateCounter=()=>{

        const target =
        +counter.getAttribute("data-target");

        const count =
        +counter.innerText;

        const increment =
        target / 100;

        if(count < target){

            counter.innerText =
            Math.ceil(count + increment);

            setTimeout(updateCounter,20);

        }else{

            counter.innerText = target;

        }

    };

    updateCounter();

});

/* Animación adicional */

const cards =
document.querySelectorAll(
'.project-card,.service-card,.testimonial-card'
);

cards.forEach(card=>{

card.addEventListener('mouseenter',()=>{

card.style.transition='0.4s';

});

});

/* ============================= */
/* PRELOADER */
/* ============================= */

window.addEventListener("load",()=>{

const preloader=
document.getElementById(
"preloader"
);

setTimeout(()=>{

preloader.style.opacity="0";

setTimeout(()=>{

preloader.style.display="none";

},500);

},1000);

});

/* ============================= */
/* GSAP */
/* ============================= */

gsap.from(".hero h1",{

y:80,
opacity:0,
duration:1.5

});

gsap.from(".hero p",{

y:40,
opacity:0,
duration:2

});

/* ============================= */
/* PARTICLES */
/* ============================= */

tsParticles.load("particles-js",{

background:{
color:"transparent"
},

particles:{

number:{
value:80
},

color:{
value:"#00c3ff"
},

links:{
enable:true,
distance:120
},

move:{
enable:true,
speed:1
}

}

});

/* ============================= */
/* SERVICE WORKER */
/* ============================= */

if('serviceWorker' in navigator){

navigator.serviceWorker.register(
'service-worker.js'
);

}