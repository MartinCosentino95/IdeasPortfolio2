gsap.registerPlugin(ScrollTrigger);


// Duplicamos el contenido para crear un efecto de "marquee" sin cortes
const banner = document.querySelector(".mcportfolio-banner-title-tracker");
const text = banner.innerHTML;
banner.innerHTML += text; // Duplicamos el contenido para evitar cortes

// Creamos la animación de desplazamiento infinito
gsap.to(".mcportfolio-banner-title-tracker", {
    x: "-50%",  // Mueve el contenedor a la izquierda
    duration: 12, // Ajusta la velocidad
    ease: "linear",
    repeat: -1,
});


gsap.to("#headerSection", {
    clipPath: "circle(100% at 50% 50%)",
    duration: 1.5,
    ease: "power2.out",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Rectángulo

});

window.addEventListener("load", () => {
    document.getElementById("pageLoader").style.display = "none";
  });

