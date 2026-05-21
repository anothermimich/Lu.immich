// Função de Debounce para evitar "layout thrashing" ao redimensionar a tela
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function ajustarHeroDinamicamente() {
  const hero = document.querySelector(".hero");
  const footer = document.querySelector("footer");
  const nav = document.querySelector(".nav");

  // Se estivermos em uma página que não tem a hero, aborta silenciosamente
  if (!hero || !footer || !nav) return;

  const items = Array.from(hero.querySelectorAll("li"));
  if (items.length === 0) return;

  // 1. Reseta todos os itens antes do cálculo
  items.forEach((item) => item.classList.remove("vh-hidden"));

  // ==========================================
  // 🎛️ PAINEL DE CONTROLE
  // ==========================================
  const config = {
    mobileBreakpoint: 1000,
    maxMobileItens: 5,

    // Margem exigida entre o grid e o footer (em pixels)
    margemMinimaDesktop: 80,
    margemMinimaMobile: 40,
  };
  // ==========================================

  const isMobile = window.innerWidth <= config.mobileBreakpoint;
  const margemExigida = isMobile ? config.margemMinimaMobile : config.margemMinimaDesktop;

  // 2. REGRA 1: Limite máximo estático do Mobile
  if (isMobile) {
    items.forEach((item, index) => {
      if (index >= config.maxMobileItens) {
        item.classList.add("vh-hidden");
      }
    });
  }

  // 3. REGRA 2: Cálculo Matemático Seguro (Livre de pulos do Flexbox)

  // Usamos clientHeight em vez de innerHeight para ignorar as barras do navegador mobile com segurança
  const viewportHeight = document.documentElement.clientHeight;
  const navHeight = nav.getBoundingClientRect().height;
  const footerHeight = footer.getBoundingClientRect().height;

  // Como a hero tem "margin: auto 0", ela distribui o espaço vazio em cima e embaixo.
  // Para garantir a sua margem mínima apenas no footer, precisamos do dobro desse espaço livre total.
  const margemTotalNecessaria = margemExigida * 2;

  // Esta é a altura MÁXIMA que o seu grid pode ter sem estourar as margens ou a tela
  const alturaMaximaHero = viewportHeight - navHeight - footerHeight - margemTotalNecessaria;

  // Oculta de baixo para cima com base estritamente na altura do elemento
  for (let i = items.length - 1; i > 0; i--) {
    if (items[i].classList.contains("vh-hidden")) continue;

    // Mede a altura do grid neste exato momento
    const heroHeight = hero.getBoundingClientRect().height;

    // Se o grid for maior que o espaço permitido, oculta o último item
    if (heroHeight > alturaMaximaHero) {
      items[i].classList.add("vh-hidden");
    } else {
      // Se couber perfeitamente na conta, interrompe o loop
      break;
    }
  }
}

// Executa ao carregar e com debounce no redimensionamento para performance
window.addEventListener("load", ajustarHeroDinamicamente);
window.addEventListener("resize", debounce(ajustarHeroDinamicamente, 150));
