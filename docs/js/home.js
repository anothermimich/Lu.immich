// Debounce protege a performance do celular
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
  const ul = hero ? hero.querySelector("ul") : null;

  if (!hero || !footer || !nav || !ul) return;

  const items = Array.from(ul.querySelectorAll("li"));
  if (items.length === 0) return;

  // PAINEL DE CONTROLE
  const config = {
    mobileBreakpoint: 1000,
    maxMobileItens: 5,
    margemMinimaDesktop: 80,
    margemMinimaMobile: 100,
  };

  items.forEach((item) => item.classList.remove("vh-hidden"));

  const isMobile = window.innerWidth <= config.mobileBreakpoint;
  const margemExigida = isMobile ? config.margemMinimaMobile : config.margemMinimaDesktop;

  // 1. ÁREA LIVRE: Mede o tamanho real da tela menos Nav, Footer e Margens
  const viewportHeight = document.documentElement.clientHeight;
  const navHeight = nav.offsetHeight;
  const footerHeight = footer.offsetHeight;

  const alturaMaximaHero = viewportHeight - navHeight - footerHeight - margemExigida * 2;

  // 2. MATEMÁTICA DA GRID: Pega o tamanho exato de 1 item e o gap(espaço) entre eles
  const itemHeight = items[0].offsetHeight;
  const gap = parseFloat(window.getComputedStyle(ul).rowGap) || 0;

  // 3. O VEREDITO: Quantos itens cabem perfeitos na tela?
  // (Altura Livre + Gap) dividido por (Altura do Item + Gap)
  let quantidadePermitida = Math.floor((alturaMaximaHero + gap) / (itemHeight + gap));

  // Regra de Segurança: Nunca permite que fiquem 0 itens na tela
  if (quantidadePermitida < 1) quantidadePermitida = 1;

  // Regra do Mobile: Respeita o seu teto máximo estipulado no painel
  if (isMobile && quantidadePermitida > config.maxMobileItens) {
    quantidadePermitida = config.maxMobileItens;
  }

  // 4. APLICA O CORTE
  items.forEach((item, index) => {
    if (index >= quantidadePermitida) {
      item.classList.add("vh-hidden");
    }
  });

  // 5. REVELA A TELA
  ul.classList.add("grid-calculado");
}

window.addEventListener("DOMContentLoaded", ajustarHeroDinamicamente);
window.addEventListener("load", ajustarHeroDinamicamente);
window.addEventListener("resize", debounce(ajustarHeroDinamicamente, 150));
