gsap.registerPlugin(ScrollTrigger);

const initAnimations = () => {
  // 1. Slide-up Elegante
  gsap.utils.toArray(".slide-up").forEach((el) => {
    const isHeroText = el.closest(".hero__col-right");

    gsap.to(el, {
      y: 0,
      opacity: 1,
      // Durações ajustadas para trabalhar em harmonia com a curva power3
      duration: isHeroText ? 1.8 : 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: isHeroText ? "top 80%" : "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // 2. Parallax Fluido
  const parallaxContainers = gsap.utils.toArray(".project__image-mask, .footer__image-mask");

  parallaxContainers.forEach((container) => {
    const img = container.querySelector(".parallax-img");

    // Early return: se não houver imagem, ignora este ciclo
    if (!img) return;

    gsap.to(img, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  });
};

// Inicia as animações assim que o DOM estiver pronto
document.addEventListener("DOMContentLoaded", initAnimations);

// Failsafe: Recalcula as posições do GSAP após o carregamento completo
// de imagens em lazy-loading ou fontes externas, evitando quebras no scroll
window.addEventListener("load", () => ScrollTrigger.refresh());
