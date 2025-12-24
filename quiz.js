// ----------------------------
// 1. Data Structure
// ----------------------------
const questionBank = {
    easy: [
        { q: "What is 5 + 5?", a: ["10", "15", "20", "5"], correct: "10" },
        { q: "Capital of France?", a: ["London", "Berlin", "Paris", "Rome"], correct: "Paris" },
        { q: "What color is the sky?", a: ["Blue", "Green", "Red", "Yellow"], correct: "Blue" },
        { q: "How many days are in a week?", a: ["5", "6", "7", "8"], correct: "7" },
        { q: "What is the largest mammal?", a: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], correct: "Blue Whale" },
        { q: "What is the boiling point of water?", a: ["90°C", "100°C", "110°C", "120°C"], correct: "100°C" },
        
    ],
    medium: [
        { q: "Which planet is known as the Red Planet?", a: ["Venus", "Mars", "Jupiter", "Saturn"], correct: "Mars" },
        {q: "What is the chemical symbol for water?", a: ["O2", "H2O", "CO2", "NaCl"], correct: "H2O" },
        { q: "Who painted the Mona Lisa?", a: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"], correct: "Leonardo da Vinci" },
        { q: "Who wrote 'Hamlet'?", a: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: "William Shakespeare" },
        { q: "What is the capital of Japan?", a: ["Seoul", "Beijing", "Tokyo", "Bangkok"], correct: "Tokyo" },
        { q: "What is the largest organ in the human body?", a: ["Heart", "Liver", "Skin", "Lungs"], correct: "Skin" },
    ],
    hard: [
        { q: "What is the square root of 144?", a: ["10", "11", "12", "14"], correct: "12" },
        { q: "Who wrote 'Hamlet'?", a: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"], correct: "William Shakespeare" },
        { q: "What is the capital of Japan?", a: ["Seoul", "Beijing", "Tokyo", "Bangkok"], correct: "Tokyo" },
        // ... add more questions
    ]
};

// ----------------------------
// 2. State Variables
// ----------------------------
let currentLevel = 'easy';
let questionIdx = 0;
let score = 0;
let timer;
let timeLeft;

// Level configuration
const levelsConfig = {
    easy: { time: 20, next: 'medium' },
    medium: { time: 15, next: 'hard' },
    hard: { time: 10, next: null }
};

// Points per question per level
const pointsConfig = {
    easy: 2,
    medium: 3,
    hard: 4
};

// ----------------------------
// 3. Selectors
// ----------------------------
const questionEl = document.getElementById('question-text');
const answerBox = document.getElementById('answer-buttons');
const startBtn = document.getElementById('start-btn');
const timeEl = document.getElementById('time-left');
const levelEl = document.getElementById('level-name');
const scoreEl = document.getElementById('score');

// ----------------------------
// 4. Game Functions
// ----------------------------
startBtn.addEventListener('click', startGame);

function startGame() {
    startBtn.style.display = 'none';
    currentLevel = 'easy';
    questionIdx = 0;
    score = 0;
    updateScoreDisplay();
    loadQuestion();
}

function loadQuestion() {
    clearInterval(timer);
    const total = questionBank[currentLevel].length;

    if (questionIdx >= total) {
        nextLevel();
        return;
    }

    const data = questionBank[currentLevel][questionIdx];
    if (!data) {
        handleGameOver('No question data available');
        return;
    }

    questionEl.innerText = data.q;
    answerBox.innerHTML = '';
    levelEl.innerText = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    levelEl.className = currentLevel;

    data.a.forEach(choice => {
        const btn = document.createElement('button');
        btn.innerText = choice;
        btn.onclick = () => checkAnswer(choice, data.correct);
        answerBox.appendChild(btn);
    });

    updateScoreDisplay();
    setAnswersDisabled(false);
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

// ----------------------------
// 5. Check Answer (modified for points)
// ----------------------------
function checkAnswer(selected, correct) {
    setAnswersDisabled(true);
    clearInterval(timer);

    if (selected === correct) {
        score += pointsConfig[currentLevel]; // points per question
        questionIdx++;
        updateScoreDisplay();

        const total = questionBank[currentLevel].length;
        if (questionIdx >= total) {
            nextLevel();
        } else {
            setTimeout(loadQuestion, 150);
        }
    } else {
        handleGameOver("Wrong Answer!");
    }
}

// ----------------------------
// 6. Next Level
// ----------------------------
function nextLevel() {
    const next = levelsConfig[currentLevel].next;

    if (next) {
        alert(`Level Complete! Get ready for ${next} mode.`);
        currentLevel = next;
        questionIdx = 0;
        score = 0; // reset score per level
        loadQuestion();
    } else {
        alert("Victory! You completed the Hardest level!");
        resetGame();
    }
}

// ----------------------------
// 7. Game Over
// ----------------------------
function handleGameOver(msg) {
    clearInterval(timer);
    alert(`${msg} Game Over. Final Level: ${currentLevel}`);
    resetGame();
}

// ----------------------------
// 8. Reset Game
// ----------------------------
function resetGame() {
    currentLevel = 'easy';
    questionIdx = 0;
    questionEl.innerText = "Press the button below to start!";
    answerBox.innerHTML = '';
    startBtn.style.display = 'block';
    score = 0;
    updateScoreDisplay();
    timeEl.innerText = levelsConfig[currentLevel].time;
}

// ----------------------------
// 9. Update Score Display (modified)
// ----------------------------
function updateScoreDisplay() {
    if (!questionBank[currentLevel]) return;

    const totalQuestions = questionBank[currentLevel].length;
    const pointsPerQuestion = pointsConfig[currentLevel];
    const totalScore = totalQuestions * pointsPerQuestion;

    scoreEl.innerText = `${score}/${totalScore}`;
}

// ----------------------------
// 10. Disable buttons helper
// ----------------------------
function setAnswersDisabled(disabled) {
    const buttons = answerBox.querySelectorAll('button');
    buttons.forEach(b => b.disabled = disabled);
}
