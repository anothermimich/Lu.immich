document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const closeBtn = document.querySelector(".mobile-close-btn");
  const overlay = document.querySelector(".mobile-overlay");
  const body = document.body;

  const toggleMenu = () => {
    const isOpen = overlay.classList.contains("is-active");

    if (!isOpen) {
      overlay.classList.add("is-active");
      body.classList.add("modal-open"); // Trava o scroll da página de fundo
      menuBtn.setAttribute("aria-expanded", "true");
    } else {
      overlay.classList.remove("is-active");
      body.classList.remove("modal-open"); // Libera o scroll
      menuBtn.setAttribute("aria-expanded", "false");
    }
  };

  if (menuBtn && closeBtn && overlay) {
    menuBtn.addEventListener("click", toggleMenu);
    closeBtn.addEventListener("click", toggleMenu);
  }
});
