document.addEventListener("DOMContentLoaded", () => {
  // Seleciona todos os livros da estante
  const books = document.querySelectorAll(".book-item");

  books.forEach((book) => {
    book.addEventListener("click", function () {
      // Verifica se o livro clicado já está aberto
      const isAlreadyOpen = this.classList.contains("is-open");

      // Passo 1: Remove a classe 'is-open' de TODOS os livros
      books.forEach((b) => b.classList.remove("is-open"));

      // Passo 2: Se o livro clicado NÃO estava aberto, nós o abrimos agora.
      if (!isAlreadyOpen) {
        this.classList.add("is-open");

        // Passo 3: O Pulo do Gato de UX para Mobile
        // Verifica se a tela tem 1000px ou menos (modo celular/tablet)
        if (window.innerWidth <= 1000) {
          // Espera 300 milissegundos para a animação do CSS começar
          // a expandir o bloco, e então centraliza na tela.
          setTimeout(() => {
            this.scrollIntoView({
              behavior: "smooth", // Desliza suavemente
              block: "center", // Crava o livro exatamente no meio da tela
            });
          }, 300);
        }
      }
    });
  });
});
