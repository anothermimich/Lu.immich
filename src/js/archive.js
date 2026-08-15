document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll("button.archive-tag-container[data-target]");
  const closeBtn = document.getElementById("close-folder-btn");
  let activeTargetId = null;

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = tab.getAttribute("data-target");

      // Se clicar na mesma pasta que já está aberta, não faz nada
      if (activeTargetId === targetId) return;

      // 1. Fechar a pasta atual (se houver uma aberta)
      if (activeTargetId) {
        closeCurrentFolder();
      }

      // 2. Registrar a nova aba ativa e puxá-la visualmente
      activeTargetId = targetId;
      tab.classList.add("is-pulled");
      tab.setAttribute("aria-expanded", "true");

      // 3. Aguarda 300ms para renderizar a pasta
      setTimeout(() => {
        const targetSheet = document.getElementById(`archive-sheet-${targetId}`);

        if (targetSheet) {
          targetSheet.classList.add("is-open");

          // 4. Calcular o Scroll Mágico com margem de 20vh no topo
          const offsetViewport = window.innerHeight * 0.2;
          const elementPosition = targetSheet.getBoundingClientRect().top;
          const finalScrollPosition = elementPosition + window.pageYOffset - offsetViewport;

          window.scrollTo({
            top: finalScrollPosition,
            behavior: "smooth",
          });

          // 5. Exibir o botão flutuante de fechar
          closeBtn.classList.add("is-visible");
        }
      }, 300);
    });
  });

  // O clique no botão "Guardar Pasta"
  closeBtn.addEventListener("click", () => {
    // Rola de volta para o Arquivo no topo
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Remove a classe do botão imediatamente para dar um feedback tátil instantâneo
    closeBtn.classList.remove("is-visible");

    // Espera o scroll terminar para sumir com a pasta
    setTimeout(() => {
      closeCurrentFolder();
    }, 600);
  });

  // ==========================================================================
  // O FECHAMENTO AUTOMÁTICO POR SCROLL (NOVO)
  // ==========================================================================
  window.addEventListener(
    "scroll",
    () => {
      // Se há uma pasta aberta e a usuária rolou manualmente até o topo (margem de 100px)
      if (activeTargetId && window.scrollY < 100) {
        closeCurrentFolder();
      }
    },
    { passive: true },
  ); // O 'passive' garante que o navegador não engasgue no scroll

  // Função isolada de limpeza de estado
  function closeCurrentFolder() {
    if (!activeTargetId) return;

    const activeTab = document.querySelector(`button[data-target="${activeTargetId}"]`);
    const activeSheet = document.getElementById(`archive-sheet-${activeTargetId}`);

    if (activeTab) {
      activeTab.classList.remove("is-pulled");
      activeTab.setAttribute("aria-expanded", "false");
    }

    if (activeSheet) {
      activeSheet.classList.remove("is-open");
    }

    closeBtn.classList.remove("is-visible");
    activeTargetId = null;
  }
});
