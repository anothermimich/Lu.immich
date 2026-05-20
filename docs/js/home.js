function ajustarHeroDinamicamente() {
  const hero = document.querySelector(".hero");
  const footer = document.querySelector("footer");

  if (!hero || !footer) return;

  const items = Array.from(hero.querySelectorAll("li"));

  items.forEach((item) => item.classList.remove("vh-hidden"));

  // PAINEL DE CONTROLE

  const config = {
    mobileBreakpoint: 1000,
    maxMobileItens: 5,

    // Margem item e footeer (in px)
    margemMinimaDesktop: 80,
    margemMinimaMobile: 80,
  };

  const isMobile = window.innerWidth <= config.mobileBreakpoint;
  const margemExigida = isMobile ? config.margemMinimaMobile : config.margemMinimaDesktop;

  if (isMobile) {
    items.forEach((item, index) => {
      if (index >= config.maxMobileItens) {
        item.classList.add("vh-hidden");
      }
    });
  }

  // 2. REGRA DO ESPAÇO E SCROLL (Oculta os de baixo para cima)
  for (let i = items.length - 1; i > 0; i--) {
    // Se o item já foi oculto pela regra do mobile, pula ele
    if (items[i].classList.contains("vh-hidden")) continue;

    // Pega a posição exata da lista e do footer na tela
    const heroPos = hero.getBoundingClientRect();
    const footerPos = footer.getBoundingClientRect();

    // Calcula o espaço vazio que sobrou entre a lista e o footer
    const espacoLivre = footerPos.top - heroPos.bottom;

    // Checa se a página quebrou e gerou scroll (adicionamos 5px de margem de erro pro navegador)
    const temScroll = footerPos.bottom > window.innerHeight + 5;

    // Se a página tem scroll OU o espaço em branco está menor que o exigido pelas suas variáveis:
    if (temScroll || espacoLivre < margemExigida) {
      items[i].classList.add("vh-hidden");
    } else {
      // Se já cabe na tela e a margem está bonita, para o loop
      break;
    }
  }
}

// Executa o cálculo ao carregar e ao redimensionar a janela
window.addEventListener("load", ajustarHeroDinamicamente);
window.addEventListener("resize", ajustarHeroDinamicamente);
