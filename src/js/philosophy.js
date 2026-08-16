document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. SISTEMA DE CLIQUE E ACORDEÃO
  // ==========================================================================
  const books = document.querySelectorAll(".book-item");

  books.forEach((book) => {
    book.addEventListener("click", function () {
      const isAlreadyOpen = this.classList.contains("is-open");

      // Remove a classe 'is-open' de TODOS os livros
      books.forEach((b) => b.classList.remove("is-open"));

      // Se não estava aberto, abre agora
      if (!isAlreadyOpen) {
        this.classList.add("is-open");

        // Regra de rolagem suave para Mobile/Tablet (mantida)
        if (window.innerWidth <= 1000) {
          setTimeout(() => {
            this.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }, 300);
        }
      }
    });
  });

  // ==========================================================================
  // 2. MOTOR MATEMÁTICO DE CORTE DE TEXTO (AGORA BLINDADO CONTRA ZUMBIS)
  // ==========================================================================

  const clampObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      // 1. Agora o alvo é o contêiner PAI (a página inteira do livro)
      const bookContent = entry.target;
      const excerpt = bookContent.querySelector(".book-excerpt");

      if (!excerpt) continue;

      // 2. Resetamos a tesoura temporariamente
      excerpt.style.webkitLineClamp = "unset";

      // 3. O Truque: Forçamos o texto a esticar apenas neste milissegundo
      // para o JavaScript conseguir medir qual é o espaço físico disponível
      excerpt.style.flexGrow = "1";
      const availableHeight = excerpt.clientHeight;

      // 4. Removemos o estiramento IMEDIATAMENTE.
      // Isso encolhe a caixa de volta e extermina as "Linhas Zumbis"
      excerpt.style.flexGrow = "0";

      // 5. Executamos a matemática com o espaço que medimos
      const computedStyle = window.getComputedStyle(excerpt);
      const lineHeight = parseFloat(computedStyle.lineHeight);

      if (lineHeight > 0) {
        const maxLines = Math.floor(availableHeight / lineHeight);
        excerpt.style.webkitLineClamp = maxLines > 0 ? maxLines : 1;
      }
    }
  });

  // 🚨 ATENÇÃO AQUI: Nós engatamos o observador na classe .book-content (O Pai),
  // e não mais no .book-excerpt. Isso impede que o JS entre em loop infinito.
  const bookContents = document.querySelectorAll(".book-content");
  bookContents.forEach((content) => clampObserver.observe(content));
});
