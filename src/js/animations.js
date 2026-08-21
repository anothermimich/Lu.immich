// ==========================================================================
// ANIMAÇÕES EDITORIAIS (Slide-up & Parallax Globais)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // 1. SLIDE-UP (Monitoramento de tela)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  document.querySelectorAll(".reveal-element").forEach((el) => {
    observer.observe(el);
  });

  // 2. LAZY PARALLAX
  const parallaxWrappers = document.querySelectorAll(".funnel-img-wrapper");
  let isScrolling = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!isScrolling) {
        window.requestAnimationFrame(() => {
          const viewportHeight = window.innerHeight;

          parallaxWrappers.forEach((wrapper) => {
            const rect = wrapper.getBoundingClientRect();

            if (rect.top < viewportHeight && rect.bottom > 0) {
              const scrollProgress = rect.top / viewportHeight - 0.5;

              // O deslocamento máximo de 15% da altura atual da imagem
              const yOffset = scrollProgress * (rect.height * 0.15);

              const img = wrapper.querySelector("img");
              if (img) img.style.setProperty("--parallax-y", `${yOffset}px`);
            }
          });
          isScrolling = false;
        });
        isScrolling = true;
      }
    },
    { passive: true },
  );
});
