gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(TextPlugin);
gsap.registerPlugin(Draggable);
// gsap.registerPlugin(InertiaPlugin);
// gsap.config({ trialWarn: false });

// Duplicamos el contenido para crear un efecto de "marquee" sin cortes
const banner = document.querySelector(".mcportfolio-banner-title-tracker");
const text = banner.innerHTML;
banner.innerHTML += text; // Duplicamos el contenido para evitar cortes

// Animación de desplazamiento infinito (PAUSADA AL INICIO)
const marqueeAnimation = gsap.to(".mcportfolio-banner-title-tracker", {
    x: "-50%",
    duration: 25,
    ease: "linear",
    repeat: -1,
    paused: true,
});

// Animación de revelado del header (PAUSADA AL INICIO)
const headerAnimation = gsap.to("#headerSection", {
    duration: 1.5,
    ease: "power2.out",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    paused: true,
});

// Animación de section1 con ScrollTrigger (PAUSADA AL INICIO)
const section1Animation = gsap.to("#section1", {
    scrollTrigger: {
        trigger: "#section1",
        scroll: "body",
        start: "top 80%",
        end: "top 0%",
        markers: false,
        toggleActions: "restart none none reverse"
    },
    clipPath: "circle(100% at 50% 50%)",
    duration: 2.5,
    ease: "power2.out",
    opacity: 1,
    paused: true,
});

gsap.to(".mcportfolio-proyects-card", {

    opacity: 1,
    stagger: {
        each: 0.3
    },
    duration: 0.3,
    scrollTrigger: ".mcportfolio-proyects-section",
    rotation: 350,

})


gsap.to("#TitleProyects", {
    duration: 3,
    text: "Proyects ~/*",
    ease: "none",
    yoyo: true,
    repeat: -1,
    repeatDelay: 2,
    scrollTrigger: {
        trigger: "#TitleProyects"
    }

})

gsap.to("#offcanvasNavbarLabel", {
    duration: 1.3,
    delay: 1,
    text: "🅜🅔🅝🅤",
    ease: "none",
    yoyo: true,
    repeat: -1,
    repeatDelay: 2

})

// gsap.to(".mcportfolio-tech", {
//     duration: 0.3,
//     y: 0,
//     scrollsTrigger:".mcportfolio-tech",
//     stagger:{
//         each:0.1,
//         from: "edges"
//     }


// })

// gsap.to("#TitleAboutMe", {
//     duration: 3,
//     delay: 1,
//     // text: "Sobre mi  ~/*",
//     // ease: "none",
//     // repeat: -1, 
//     // yoyo: true, 
// });

// gsap.to(".mcportfolio-tech-stack-container", {
//     // x: "-50%",

//     duration: 25,
//     ease: "linear",
//     repeat: -1,
//     paused: true,
//     scrollTrigger: {
//         trigger: ".mcportfolio-tech-stack-container"
//     }

// })

// Selecciona la card
const PrimaryButton = document.querySelector('.mcportfolio-button');

// Efecto hover
gsap.fromTo(PrimaryButton,
    {
        scale: 1,
        // backgroundColor: "#3498db"
    },
    {
        scale: 1.1,
        //   backgroundColor: "#2980b9", 
        duration: 0.3,
        ease: "power1.out",
        paused: true
    });

// Activar el hover
PrimaryButton.addEventListener('mouseenter', () => {
    gsap.to(PrimaryButton, {
        scale: 1.1,
        // backgroundColor: "#2980b9",
        duration: 0.3, ease: "power1.out"
    });
});

// Desactivar el hover
PrimaryButton.addEventListener('mouseleave', () => {
    gsap.to(PrimaryButton, {
        scale: 1,
        //  backgroundColor: "#3498db",
        duration: 0.3, ease: "power1.out"
    });
});
// DRAG AND DROP TECHS

const icons = document.querySelectorAll(".mcportfolio-tech");

// Crea arrastrabilidad en cada ícono
icons.forEach(icon => {
    Draggable.create(icon, {
        type: "x,y",
        inertia: true,
        bounds: ".mcportfolio-tech-stack-container",
        edgeResistance: 0.7,
        throwProps: true,
        onDrag: detectCollisions,
        onThrowUpdate: detectCollisions
    });
});

function detectCollisions() {
    icons.forEach(icon1 => {
        let rect1 = icon1.getBoundingClientRect();

        icons.forEach(icon2 => {
            if (icon1 !== icon2) {
                let rect2 = icon2.getBoundingClientRect();

                if (isColliding(rect1, rect2)) {
                    resolveCollision(icon1, icon2);
                }
            }
        });
    });
}

function isColliding(rect1, rect2) {
    return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
    );
}

function resolveCollision(icon1, icon2) {
    let dx = icon2.offsetLeft - icon1.offsetLeft;
    let dy = icon2.offsetTop - icon1.offsetTop;

    let angle = Math.atan2(dy, dx);
    let moveX = Math.cos(angle) * 10;
    let moveY = Math.sin(angle) * 10;

    gsap.to(icon2, { x: `+=  ${moveX}, y: +=${moveY} `, duration: 0.2 });
}

// 

// Script para marcar el active en el menú

document.addEventListener("DOMContentLoaded", function () {
    gsap.registerPlugin(ScrollTrigger); // Asegura que ScrollTrigger está activo

    let sections = document.querySelectorAll("section"); // Todas las secciones
    let navLinks = document.querySelectorAll(".mcportfolio-navbar-offcanvas-list-item a");

    sections.forEach((section) => {
        ScrollTrigger.create({
            trigger: section,
            start: "top 50%", // Activa cuando la sección está en la mitad superior de la pantalla
            end: "bottom 50%", // Se desactiva cuando la sección sale de la mitad inferior
            toggleActions: "play none none none", // Asegura que solo se activa una vez
            onEnter: () => setActive(section), // Llama a setActive al entrar
            onEnterBack: () => setActive(section), // También al hacer scroll hacia arriba
        });
    });

    function setActive(section) {
        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${section.id}`) {
                link.classList.add("active");
            }
        });
    }
});



// 🕒 Control de la pantalla de carga
window.modelsToLoad = 4;  // Número total de modelos
window.modelsLoaded = 0;  // Contador de modelos ya cargados

window.checkAllModelsLoaded = function () {
    console.log(`📊 Verificando carga: ${window.modelsLoaded} / ${window.modelsToLoad}`);

    if (window.modelsLoaded >= window.modelsToLoad) {
        let loader = document.getElementById("pageLoader");
        if (loader) {
            loader.style.display = "none";  // Ocultar el loader
            console.log("🎉 ¡Todos los modelos están listos! Ocultando loader.");

            // 🔥 Activamos las animaciones después de que la pantalla de carga desaparezca
            marqueeAnimation.play();
            headerAnimation.play();
            section1Animation.play();
        } else {
            console.error("❌ Error: No se encontró el elemento #pageLoader en el DOM.");
        }
    }
};

