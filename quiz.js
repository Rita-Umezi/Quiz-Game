// 1. Data Structure (Add 30 objects to each array for a full game)
const questionBank = {
    easy: [
        { q: "What is 5 + 5?", a: ["10", "15", "20", "5"], correct: "10" },
        { q: "Capital of France?", a: ["London", "Berlin", "Paris", "Rome"], correct: "Paris" },
        // ... add 28 more
    ],
    medium: [
        { q: "Which planet is known as the Red Planet?", a: ["Venus", "Mars", "Jupiter", "Saturn"], correct: "Mars" },
        // ... add 29 more
    ],
    hard: [
        { q: "What is the square root of 144?", a: ["10", "11", "12", "14"], correct: "12" },
        // ... add 29 more
    ]
};

// 2. State Variables
let currentLevel = 'easy';
let questionIdx = 0;
let score = 0;
let timer;
let timeLeft;

const levelsConfig = {
    easy: { time: 20, next: 'medium' },
    medium: { time: 15, next: 'hard' },
    hard: { time: 10, next: null }
};

// 3. Selectors
const questionEl = document.getElementById('question-text');
const answerBox = document.getElementById('answer-buttons');
const startBtn = document.getElementById('start-btn');
const timeEl = document.getElementById('time-left');
const levelEl = document.getElementById('level-name');
const scoreEl = document.getElementById('score');

// 4. Game Functions
startBtn.addEventListener('click', startGame);

function startGame() {
    startBtn.style.display = 'none';
    questionIdx = 0;
    score = 0;
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    const data = questionBank[currentLevel][questionIdx];
    
    questionEl.innerText = data.q;
    answerBox.innerHTML = '';
    scoreEl.innerText = questionIdx + 1;
    levelEl.innerText = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    levelEl.className = currentLevel;

    data.a.forEach(choice => {
        const btn = document.createElement('button');
        btn.innerText = choice;
        btn.onclick = () => checkAnswer(choice, data.correct);
        answerBox.appendChild(btn);
    });

    startTimer();
}

function startTimer() {
    timeLeft = levelsConfig[currentLevel].time;
    timeEl.innerText = timeLeft;
    timeEl.classList.remove('warning');

    timer = setInterval(() => {
        timeLeft--;
        timeEl.innerText = timeLeft;
        if (timeLeft <= 5) timeEl.classList.add('warning');
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleGameOver("Time ran out!");
        }
    }, 1000);
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        questionIdx++;
        if (questionIdx >= 30) {
            nextLevel();
        } else {
            loadQuestion();
        }
    } else {
        handleGameOver("Wrong Answer!");
    }
}

function nextLevel() {
    const next = levelsConfig[currentLevel].next;
    if (next) {
        alert(`Level Complete! Get ready for ${next} mode.`);
        currentLevel = next;
        questionIdx = 0;
        loadQuestion();
    } else {
        alert("Victory! You completed the Hardest level!");
        resetGame();
    }
}

function handleGameOver(msg) {
    clearInterval(timer);
    alert(`${msg} Game Over. Final Level: ${currentLevel}`);
    resetGame();
}

function resetGame() {
    currentLevel = 'easy';
    questionIdx = 0;
    questionEl.innerText = "Press Start to Play Again";
    answerBox.innerHTML = '';
    startBtn.style.display = 'block';
}