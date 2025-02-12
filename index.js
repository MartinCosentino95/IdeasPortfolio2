gsap.registerPlugin(ScrollTrigger);

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

// 🕒 Control de la pantalla de carga
window.modelsToLoad = 3;  // Número total de modelos
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
