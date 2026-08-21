document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".mobile-menu-btn");
  const closeBtn = document.querySelector(".mobile-close-btn");
  const overlay = document.querySelector(".mobile-overlay");
  const body = document.body;

  // 1. Captura todos os links de dentro do menu
  const navLinks = document.querySelectorAll(".mobile-nav-list a");

  // Isolamos a função de fechar para podermos reutilizá-la
  const closeMenu = () => {
    overlay.classList.remove("is-active");
    body.classList.remove("modal-open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  const toggleMenu = () => {
    const isOpen = overlay.classList.contains("is-active");

    if (!isOpen) {
      overlay.classList.add("is-active");
      body.classList.add("modal-open");
      menuBtn.setAttribute("aria-expanded", "true");
    } else {
      closeMenu();
    }
  };

  if (menuBtn && closeBtn && overlay) {
    menuBtn.addEventListener("click", toggleMenu);
    closeBtn.addEventListener("click", toggleMenu);

    // CAMADA DE DEFESA UX: Clicou no link, fecha o menu imediatamente
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  // CAMADA DE DEFESA BFCACHE: Se a página for restaurada pelo botão "Voltar" do navegador
  window.addEventListener("pageshow", (event) => {
    // event.persisted indica que a página foi carregada do cache do navegador
    if (event.persisted) {
      closeMenu();
    }
  });
});
