gsap.registerPlugin(ScrollTrigger, TextPlugin, Draggable);

// DUPLICAMOS EL TEXTO PARA EVITAR CORTES EN EL MARQUEE
const banner = document.querySelector(".mcportfolio-banner-title-tracker");
if (banner) banner.innerHTML += banner.innerHTML;

const isMobile = window.innerWidth <= 991;


// FUNCIONES PARA ANIMACIONES
const createMarquee = () => gsap.to(".mcportfolio-banner-title-tracker", { x: "-50%", duration: 25, ease: "linear", repeat: -1, paused: true });
const revealHeader = () => gsap.to("#headerSection", { duration: 1.5, ease: "power2.out", clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", paused: true });
const revealSection1 = () => gsap.to("#section1", { scrollTrigger: { trigger: "#section1", start: "top 80%", end: "top 0%", toggleActions: "restart none none reverse" }, clipPath: "circle(100% at 50% 50%)", duration: 2.5, ease: "power2.out", opacity: 1, paused: true });

const animateProjects = () => gsap.to(".mcportfolio-proyects-card", { opacity: 1, stagger: 0.3, duration: 0.3, scrollTrigger: ".mcportfolio-proyects-section", rotation: 350 });
const animateText = (id, text) => gsap.to(id, { duration: 3, text, ease: "none", yoyo: true, repeat: -1, repeatDelay: 2, scrollTrigger: { trigger: id } });

// EJECUTAR ANIMACIONES
const marqueeAnimation = gsap.to(".mcportfolio-banner-title-tracker", {
    xPercent: -50, // Más eficiente que "x: '-50%'"
    duration: isMobile ? 50 : 35,
    ease: "linear",
    repeat: -1
});
const headerAnimation = revealHeader();
const section1Animation = revealSection1();
animateProjects();
animateText("#TitleProyects", "Proyects ~/*");
animateText("#offcanvasNavbarLabel", "🅜🅔🅝🅤");

// EFECTO HOVER PARA BOTÓN PRINCIPAL
const primaryButton = document.querySelector(".mcportfolio-button");
if (primaryButton) {
    primaryButton.addEventListener("mouseover", () => gsap.to(primaryButton, { scale: 1.1, duration: 0.3, ease: "power1.out" }));
    primaryButton.addEventListener("mouseout", () => gsap.to(primaryButton, { scale: 1, duration: 0.3, ease: "power1.out" }));
}

// DRAG & DROP PARA ÍCONOS TECNOLÓGICOS
const icons = document.querySelectorAll(".mcportfolio-tech");
icons.forEach(icon => {
    Draggable.create(icon, { type: "x,y", inertia: true, bounds: ".mcportfolio-tech-stack-container", edgeResistance: 0.7, onDrag: detectCollisions, onThrowUpdate: detectCollisions });
});

function detectCollisions() {
    icons.forEach(icon1 => {
        let rect1 = icon1.getBoundingClientRect();
        icons.forEach(icon2 => {
            if (icon1 !== icon2 && isColliding(rect1, icon2.getBoundingClientRect())) {
                resolveCollision(icon1, icon2);
            }
        });
    });
}

const isColliding = (rect1, rect2) => !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
const resolveCollision = (icon1, icon2) => gsap.to(icon2, { x: `+=${Math.cos(Math.atan2(icon2.offsetTop - icon1.offsetTop, icon2.offsetLeft - icon1.offsetLeft)) * 10}`, y: `+=${Math.sin(Math.atan2(icon2.offsetTop - icon1.offsetTop, icon2.offsetLeft - icon1.offsetLeft)) * 10}`, duration: 0.2 });

// ACTIVE MENU SEGÚN SCROLL
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".mcportfolio-navbar-offcanvas-list-item a");
sections.forEach(section => {
    ScrollTrigger.create({ trigger: section, start: "top 50%", end: "bottom 50%", onEnter: () => setActive(section), onEnterBack: () => setActive(section) });
});
function setActive(section) {
    navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${section.id}`));
}

// CONTROL PANTALLA DE CARGA
window.modelsToLoad = 4;
window.modelsLoaded = 0;
window.checkAllModelsLoaded = function () {
    console.log(`📊 Cargando: ${window.modelsLoaded} / ${window.modelsToLoad}`);
    if (window.modelsLoaded >= window.modelsToLoad) {
        let loader = document.getElementById("pageLoader");
        if (loader) {
            loader.style.display = "none";
            console.log("🎉 Modelos cargados. Ocultando loader.");
            marqueeAnimation.play();
            headerAnimation.play();
            section1Animation.play();
        } else {
            console.error("❌ Error: No se encontró #pageLoader");
        }
    }
};
