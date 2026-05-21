const GUTTER_VALUE = 1;

(function () {
  // Array para armazenar as instâncias de cada grid
  let grids = [];

  function initAllGrids() {
    // Seleciona todos os contêineres pela classe em comum presente no HTML
    const containers = document.querySelectorAll(".archive-item-container");

    // Limpa a array caso a função seja chamada novamente
    grids = [];

    containers.forEach((container) => {
      // O Minigrid pede um seletor. Como seus contêineres têm IDs únicos, usamos eles.
      if (!container.id) return;

      const grid = new Minigrid({
        container: `#${container.id}`,
        item: ".archive-item",
        gutter: GUTTER_VALUE,
        done: function () {
          document.dispatchEvent(new Event("minigrid:layout"));
        },
      });

      grid.mount();
      grids.push(grid); // Salva a instância para podermos atualizar no resize
    });
  }

  function updateAllGrids() {
    grids.forEach((grid) => grid.mount());
  }

  // Debounce para evitar layout thrashing durante o resize
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Gatilhos de Inicialização
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllGrids);
  } else {
    initAllGrids();
  }

  // Re-calcula após carregar todas as imagens e fontes
  window.addEventListener("load", initAllGrids);

  // Atualiza todos os grids de uma vez ao redimensionar a tela, protegido pelo debounce
  window.addEventListener("resize", debounce(updateAllGrids, 150));
})();
