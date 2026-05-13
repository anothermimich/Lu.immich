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

// ============================================================================
// MODAL DE CRONÔMETRO (Sense-Making Timer)
// ============================================================================

const modal = document.getElementById("timer-modal");
const btnOpen = document.getElementById("btn-open-timer");
const btnClose = document.getElementById("btn-close-timer");
const dotGrid = document.getElementById("dot-grid");
const timeDisplay = document.getElementById("time-display");
const btnMinus = document.getElementById("btn-time-minus");
const btnPlus = document.getElementById("btn-time-plus");
const btnStart = document.getElementById("btn-start-timer");

const TOTAL_DOTS = 60;
let defaultTimeSeconds = 120; // Padrão 2 minutos
let remainingSeconds = defaultTimeSeconds;
let timerInterval = null;
let isRunning = false;
let wakeLock = null;

// 1. Geração da Grade Visual
function createGrid() {
  dotGrid.innerHTML = "";
  for (let i = 0; i < TOTAL_DOTS; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dotGrid.appendChild(dot);
  }
}

// 2. Atualização do Display Textual
function updateDisplay() {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  timeDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

// 3. Atualização da Grade (Quais pontos ficam pretos)
function updateGrid() {
  const dots = document.querySelectorAll(".dot");
  // Quantos pontos devem ser apagados baseado na % de tempo decorrido
  const percentSpent = 1 - remainingSeconds / defaultTimeSeconds;
  const dotsToHide = Math.floor(percentSpent * TOTAL_DOTS);

  dots.forEach((dot, index) => {
    if (index < dotsToHide) {
      dot.classList.add("spent");
    } else {
      dot.classList.remove("spent");
    }
  });
}

// 4. API de Wake Lock (Mantém a tela acesa)
async function requestWakeLock() {
  try {
    if ("wakeLock" in navigator) {
      wakeLock = await navigator.wakeLock.request("screen");
    }
  } catch (err) {
    console.warn("Wake Lock falhou:", err);
  }
}

function releaseWakeLock() {
  if (wakeLock !== null) {
    wakeLock.release().then(() => {
      wakeLock = null;
    });
  }
}

// 5. Controles do Modal
btnOpen.addEventListener("click", () => {
  modal.classList.remove("hidden");
  createGrid();
  remainingSeconds = defaultTimeSeconds;
  updateDisplay();
  updateGrid();
});

btnClose.addEventListener("click", () => {
  modal.classList.add("hidden");
  clearInterval(timerInterval);
  isRunning = false;
  btnStart.textContent = "COMEÇAR";
  releaseWakeLock();
});

// 6. Controles de Tempo (+ e -)
btnPlus.addEventListener("click", () => {
  if (isRunning) return;
  defaultTimeSeconds += 30;
  remainingSeconds = defaultTimeSeconds;
  updateDisplay();
});

btnMinus.addEventListener("click", () => {
  if (isRunning || defaultTimeSeconds <= 30) return;
  defaultTimeSeconds -= 30;
  remainingSeconds = defaultTimeSeconds;
  updateDisplay();
});

// 7. Motor do Cronômetro
btnStart.addEventListener("click", async () => {
  if (isRunning) {
    // Pausar
    clearInterval(timerInterval);
    isRunning = false;
    btnStart.textContent = "RETOMAR";
    releaseWakeLock();
  } else {
    // Iniciar
    if (remainingSeconds === 0) {
      // Se estava zerado, reseta antes de rodar
      remainingSeconds = defaultTimeSeconds;
      updateGrid();
    }

    await requestWakeLock(); // Solicita manter a tela ligada
    isRunning = true;
    btnStart.textContent = "PAUSAR";

    timerInterval = setInterval(() => {
      remainingSeconds--;
      updateDisplay();
      updateGrid();

      if (remainingSeconds <= 0) {
        clearInterval(timerInterval);
        isRunning = false;
        btnStart.textContent = "RESETAR";
        releaseWakeLock();
      }
    }, 1000);
  }
});

// ============================================================================
// MODAL DA ROLETA (Simulador de 2D6 com Bell Curve)
// ============================================================================

const rollerModal = document.getElementById("roller-modal");
const btnOpenRoller = document.getElementById("btn-open-roller");
const btnCloseRoller = document.getElementById("btn-close-roller");
const rollerWheel = document.getElementById("roller-wheel");
const btnSpin = document.getElementById("btn-spin");

const NUMBERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const TOTAL_SLOTS = NUMBERS.length;
const ANGLE_PER_SLOT = 360 / TOTAL_SLOTS;

let currentRotation = 0;
let isSpinning = false;

// 1. Constrói a roleta colocando os números em círculo
function buildWheel() {
  rollerWheel.innerHTML = "";
  const radius = rollerWheel.offsetWidth / 2;

  NUMBERS.forEach((num, index) => {
    const angleDeg = index * ANGLE_PER_SLOT;
    // Posiciona os números na borda direita do círculo gigante
    const numberDiv = document.createElement("div");
    numberDiv.className = "roller-number";
    numberDiv.textContent = num.toString().padStart(2, "0"); // Formata como 02, 03...

    // A mágica matemática para colocar em círculo
    // O translate X move o número para a borda do raio
    numberDiv.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg) translateX(${radius - 70}px)`;

    rollerWheel.appendChild(numberDiv);
  });
}

// 2. A Matemática da Bell Curve (O Segredo)
function roll2D6() {
  const d1 = Math.floor(Math.random() * 6) + 1;
  const d2 = Math.floor(Math.random() * 6) + 1;
  return d1 + d2;
}

// 3. A Animação de Tensão
// 3. A Animação de Tensão
function spinWheel() {
  if (isSpinning) return;
  isSpinning = true;
  btnSpin.style.opacity = "0.5";

  // --- CORREÇÃO: Limpa o destaque do número anterior ---
  const numbers = document.querySelectorAll(".roller-number");
  numbers.forEach((num) => {
    num.style.color = "#333"; // Retorna para o cinza escuro
    num.style.transform = num.style.transform.replace(" scale(1.2)", ""); // Remove o aumento
  });
  // -----------------------------------------------------

  // Rola os dados virtuais
  const result = roll2D6();

  // Descobre qual o índice desse resultado na nossa array
  const targetIndex = NUMBERS.indexOf(result);

  // Calcula o ângulo exato para que o número alvo pare alinhado com o indicador
  const targetAngle = 360 - targetIndex * ANGLE_PER_SLOT;

  // Adiciona "voltas falsas" (spin) para gerar tensão (8 voltas completas)
  const extraSpins = 2 * 360;

  // Atualiza a rotação global acumulada
  currentRotation += extraSpins;

  // Calcula o resto da rotação atual para alinhar perfeitamente com o novo alvo
  const currentMod = currentRotation % 360;
  const adjustment = targetAngle - currentMod;

  // Se o ajuste for negativo, adiciona 360 para girar sempre para frente
  currentRotation += adjustment < 0 ? adjustment + 360 : adjustment;

  // Aplica a rotação no CSS
  rollerWheel.style.transform = `rotate(${currentRotation}deg)`;

  // Libera o botão após 7 segundos e destaca o novo número vencedor
  setTimeout(() => {
    isSpinning = false;
    btnSpin.style.opacity = "1";
    highlightWinner(targetIndex);
  }, 7000);
}

// 4. Efeito visual no número vencedor (Opcional, para reforçar a estética)
function highlightWinner(index) {
  const numbers = document.querySelectorAll(".roller-number");
  numbers.forEach((num, i) => {
    if (i === index) {
      num.style.color = "#FFFFFF"; // Fica branco absoluto
      num.style.transform += " scale(1.2)"; // Aumenta levemente
    } else {
      num.style.color = "#444444"; // Resto fica escuro
      // Remove o scale se houver
      num.style.transform = num.style.transform.replace(" scale(1.2)", "");
    }
  });
}

// 5. Controles do Modal
btnOpenRoller.addEventListener("click", () => {
  rollerModal.classList.remove("hidden");
  // Constrói a roda apenas quando o modal abre para garantir que o radius CSS já esteja calculado
  setTimeout(buildWheel, 50);
});

btnCloseRoller.addEventListener("click", () => {
  rollerModal.classList.add("hidden");
});

btnSpin.addEventListener("click", spinWheel);

// Recalcula a roda se a janela mudar de tamanho
window.addEventListener("resize", () => {
  if (!rollerModal.classList.contains("hidden")) buildWheel();
});
