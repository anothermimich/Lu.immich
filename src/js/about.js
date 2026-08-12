gsap.registerPlugin(ScrollTrigger);

const initAnimations = () => {
  let mm = gsap.matchMedia();

  mm.add(
    {
      isMobile: "(max-width: 1000px)",
      isDesktop: "(min-width: 1001px)",
    },
    (context) => {
      let { isMobile } = context.conditions;

      gsap.utils.toArray(".slide-up").forEach((el) => {
        // 💡 Verifica se o elemento tem a nova classe restritiva
        const isMobileOnly = el.classList.contains("mobile-only-slide");

        // Trava a animação no desktop se a classe estiver presente
        if (isMobileOnly && !isMobile) {
          gsap.set(el, { y: 0, opacity: 1 });
          return;
        }

        // Código GSAP mantido exatamente como estava
        const isHeroText = el.closest(".hero__col-right");

        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: isHeroText ? 1.8 : 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: isHeroText ? "top 80%" : "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    },
  );

  // 2. Parallax Fluido (Mantido intacto, rodando universalmente)
  const parallaxContainers = gsap.utils.toArray(".project__image-mask, .footer__image-mask");

  parallaxContainers.forEach((container) => {
    const img = container.querySelector(".parallax-img");

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

document.addEventListener("DOMContentLoaded", initAnimations);

window.addEventListener("load", () => ScrollTrigger.refresh());
