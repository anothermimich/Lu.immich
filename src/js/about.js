// ==========================================================================
// CÓPIA DE E-MAIL NO DESKTOP (CLIPBOARD API)
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  const emailLink = document.querySelector('.cv-contact a[href^="mailto:"]');

  if (emailLink) {
    emailLink.addEventListener("click", (e) => {
      // Detecta se o dispositivo é desktop (possui mouse e suporte a hover)
      const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      if (isDesktop) {
        e.preventDefault();

        // Extrai o endereço de e-mail do href limpando o "mailto:"
        const email = emailLink
          .getAttribute("href")
          .replace(/^mailto:/i, "")
          .split("?")[0];

        // Copia para a área de transferência
        navigator.clipboard
          .writeText(email)
          .then(() => {
            const originalText = emailLink.textContent;
            emailLink.textContent = "E-mail copiado :)";

            setTimeout(() => {
              emailLink.textContent = originalText;
            }, 2000);
          })
          .catch((err) => {
            console.error("Erro ao copiar e-mail: ", err);
          });
      }
    });
  }
});
