gsap.registerPlugin(ScrollTrigger);


// Duplicamos el contenido para crear un efecto de "marquee" sin cortes
const banner = document.querySelector(".mcportfolio-banner-title-tracker");
const text = banner.innerHTML;
banner.innerHTML += text; // Duplicamos el contenido para evitar cortes

// Creamos la animación de desplazamiento infinito
gsap.to(".mcportfolio-banner-title-tracker", {
    x: "-50%", // Se mueve la mitad del ancho
    duration: 25, // Velocidad de la animación
    ease: "linear",
    repeat: -1, // Se repite infinito

});


gsap.to("#headerSection", {
    duration: 1.5,
    ease: "power2.out",
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Rectángulo

});

gsap.to("#section1", {
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

});


window.addEventListener("load", () => {
    document.getElementById("pageLoader").style.display = "none";
});

