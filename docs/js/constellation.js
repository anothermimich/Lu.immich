// ============================================================================
// 1. VARIÁVEIS DE CONFIGURAÇÃO (Ajuste para mudar a densidade e o visual)
// ============================================================================
const CONFIG = {
  totalStars: 350, // Quantidade alvo de estrelas no mapa
  minDistance: 60, // Distância mínima (em pixels) entre uma estrela e outra
  starRadius: 10, // Tamanho do ponto (raio em pixels)
  margin: 200, // Margem em branco ao redor do papel (evita corte na impressora)
  maxAttempts: 500, // Prevenção de loop infinito se a densidade for alta demais
};

// ============================================================================
// 2. SETUP DO CANVAS E CONTEXTO
// ============================================================================
const canvas = document.getElementById("skyCanvas");
const ctx = canvas.getContext("2d");

// Resolução A3 a 300 DPI (Garante a nitidez da impressão)
canvas.width = 3508;
canvas.height = 4960;

// Array para armazenar as coordenadas válidas
let stars = [];

// ============================================================================
// 3. FUNÇÕES AUXILIARES
// ============================================================================

// Calcula a distância euclidiana entre dois pontos
function getDistance(p1, p2) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Verifica se um novo ponto está longe o suficiente de todos os existentes
function isValidPosition(newStar) {
  for (let i = 0; i < stars.length; i++) {
    if (getDistance(newStar, stars[i]) < CONFIG.minDistance) {
      return false; // Muito perto de outra estrela
    }
  }
  return true; // Posição válida
}

// ============================================================================
// 4. MOTOR DE GERAÇÃO
// ============================================================================
function generateSky() {
  // 4.1 Limpar o canvas (Fundo Branco Absoluto)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars = []; // Resetar o array
  ctx.fillStyle = "#000000"; // Cor da estrela (Preto Absoluto)

  // 4.2 Loop de geração
  while (stars.length < CONFIG.totalStars) {
    let attempt = 0;
    let starPlaced = false;

    while (attempt < CONFIG.maxAttempts && !starPlaced) {
      // Gera coordenadas aleatórias dentro da área útil (respeitando a margem)
      const randomX = CONFIG.margin + Math.random() * (canvas.width - CONFIG.margin * 2);
      const randomY = CONFIG.margin + Math.random() * (canvas.height - CONFIG.margin * 2);

      const newStar = { x: randomX, y: randomY };

      // Se a posição for válida, adiciona ao array e encerra as tentativas para essa estrela
      if (isValidPosition(newStar)) {
        stars.push(newStar);
        starPlaced = true;
      }
      attempt++;
    }

    // Failsafe: se falhou repetidas vezes, a tela está muito cheia. Para a geração.
    if (!starPlaced) {
      console.warn(`Geração interrompida. O mapa encheu com ${stars.length} estrelas.`);
      break;
    }
  }

  // 4.3 Desenhar as estrelas validadas no canvas
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, CONFIG.starRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ============================================================================
// 5. EXPORTAÇÃO PARA PDF (Requer jsPDF importado no HTML)
// ============================================================================
function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a3"); // Formato Retrato, Milímetros, Folha A3

  // Converte o canvas para imagem mantendo o contraste máximo (PNG)
  const imgData = canvas.toDataURL("image/png");

  // Injeta a imagem no PDF (X, Y, Largura, Altura)
  pdf.addImage(imgData, "PNG", 0, 0, 297, 420);
  pdf.save("Ceu_Noturno_Mapeamento.pdf");
}

// Inicializa a primeira geração ao carregar a página
generateSky();

// Event Listeners para a sua interface HTML
document.getElementById("btn-generate").addEventListener("click", generateSky);
document.getElementById("btn-download").addEventListener("click", downloadPDF);
