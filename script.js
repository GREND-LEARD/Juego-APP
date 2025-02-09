const emojis = ["🐍", "☕", "🌐", "💎", "🔧", "⚙️", "📜", "🚀"];
const cards = [...emojis, ...emojis];
let flippedCards = [];
let moves = 0;
let time = 0;
let timer;
let gameActive = true;

// Elementos del DOM
const grid = document.getElementById("grid");
const movesElement = document.getElementById("moves");
const timeElement = document.getElementById("time");
const resetButton = document.getElementById("reset");
const winModal = document.getElementById("winModal");
const winTime = document.getElementById("winTime");
const winMoves = document.getElementById("winMoves");
const playAgainButton = document.getElementById("playAgain");

// Crear tablero
function createBoard() {
    cards.sort(() => Math.random() - 0.5);
    grid.innerHTML = "";
    
    cards.forEach((emoji, index) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">${emoji}</div>
                <div class="card-back"></div>
            </div>
        `;
        card.addEventListener("click", () => flipCard(card, index));
        grid.appendChild(card);
    });
}

// Voltear carta
function flipCard(card, index) {
    if (!gameActive || card.classList.contains("flipped") || flippedCards.length === 2) return;

    card.classList.add("flipped");
    flippedCards.push({ card, index });

    if (flippedCards.length === 2) {
        moves++;
        movesElement.textContent = moves;
        checkMatch();
    }
}

// Verificar coincidencia
function checkMatch() {
    const [card1, card2] = flippedCards;
    
    if (cards[card1.index] === cards[card2.index]) {
        flippedCards = [];
        if (document.querySelectorAll(".flipped").length === cards.length) {
            gameActive = false;
            clearInterval(timer);
            showWinModal();
        }
    } else {
        gameActive = false;
        setTimeout(() => {
            card1.card.classList.remove("flipped");
            card2.card.classList.remove("flipped");
            flippedCards = [];
            gameActive = true;
        }, 1000);
    }
}

// Temporizador
function updateTimer() {
    time++;
    const minutes = Math.floor(time / 60).toString().padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    timeElement.textContent = `${minutes}:${seconds}`;
}

// Mostrar modal de victoria
function showWinModal() {
    winTime.textContent = timeElement.textContent;
    winMoves.textContent = moves;
    winModal.style.display = "flex";
}

// Reiniciar juego
function resetGame() {
    clearInterval(timer);
    time = 0;
    moves = 0;
    flippedCards = [];
    gameActive = true;
    movesElement.textContent = "0";
    timeElement.textContent = "00:00";
    winModal.style.display = "none";
    timer = setInterval(updateTimer, 1000);
    createBoard();
}

// Event Listeners
resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);

// Iniciar juego
timer = setInterval(updateTimer, 1000);
createBoard();

// Agrega esto al inicio del script
const backgroundMusic = document.getElementById("backgroundMusic");
const musicButton = document.getElementById("musicButton");
let isMusicOn = false;

// Controlar música
musicButton.addEventListener("click", () => {
    if (isMusicOn) {
        backgroundMusic.pause();
        musicButton.textContent = "🎵 Activar Música";
    } else {
        backgroundMusic.play().catch(error => {
            console.log("Debes interactuar primero con la página para reproducir audio.");
        });
        musicButton.textContent = "🎵 Desactivar Música";
    }
    isMusicOn = !isMusicOn;
});

// Modifica el evento click por touchstart en las cartas
card.addEventListener("touchstart", (e) => {
    e.preventDefault(); // Evitar zoom accidental
    flipCard(card, index);
});

// Mantén también el click para desktop
card.addEventListener("click", () => flipCard(card, index));