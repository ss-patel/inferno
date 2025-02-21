const riddles = [
    { question: "I start out green but turn to red, some say I make your face turn red. What am I?", answer: "jalapeno", scoville: 8000 },
    { question: "I’m named after a ghost, but I’m not dead. I burn your mouth and make you sweat. What am I?", answer: "ghost pepper", scoville: 1000000 },
    { question: "I sound sweet but leave you burning all night. What am I?", answer: "carolina reaper", scoville: 2200000 }
];

let currentQuestion = localStorage.getItem("currentQuestion") ? parseInt(localStorage.getItem("currentQuestion")) : 0;
let currentScoville = localStorage.getItem("currentScoville") ? parseInt(localStorage.getItem("currentScoville")) : 0;
let startTime = localStorage.getItem("startTime") ? parseInt(localStorage.getItem("startTime")) : null;
let countdownInterval;

const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

function startGame() {
    document.getElementById("challenge").style.display = "block";
    showQuestion();
    updateScovilleMeter();

    // Start timer if it's not already set
    if (!startTime) {
        startTime = new Date().getTime();
        localStorage.setItem("startTime", startTime);
    }

    startCountdown();
}

function showQuestion() {
    if (currentQuestion < riddles.length) {
        document.getElementById("question").innerText = riddles[currentQuestion].question;
    } else {
        document.getElementById("result").innerHTML = "🎉 Congratulations! You've conquered the heat! 🔥";
        localStorage.removeItem("currentQuestion");
        localStorage.removeItem("currentScoville");
        localStorage.removeItem("startTime");
        clearInterval(countdownInterval); // Stop the timer
    }
}

function checkAnswer() {
    let userAnswer = document.getElementById("answer").value.trim().toLowerCase();
    if (userAnswer === riddles[currentQuestion].answer) {
        document.getElementById("result").innerText = "✅ Correct! Moving to next heat level...";
        currentScoville += riddles[currentQuestion].scoville;
        currentQuestion++;
        localStorage.setItem("currentQuestion", currentQuestion);
        localStorage.setItem("currentScoville", currentScoville);
        updateScovilleMeter();
        addFireEffect();
        setTimeout(showQuestion, 1500);
    } else {
        document.getElementById("result").innerText = "❌ Wrong! Try again.";
    }
}

function updateScovilleMeter() {
    let maxScoville = 2200000;
    let meterPercentage = (currentScoville / maxScoville) * 100;
    meterPercentage = meterPercentage > 100 ? 100 : meterPercentage;

    document.getElementById("meter-fill").style.width = meterPercentage + "%";
    document.getElementById("scoville-value").innerText = currentScoville.toLocaleString() + " Scoville Units";
}

// 🔥 Fire Effect on Correct Answer
function addFireEffect() {
    const meter = document.getElementById("meter-fill");
    meter.style.boxShadow = "0 0 20px yellow, 0 0 40px red";
    setTimeout(() => {
        meter.style.boxShadow = "0 0 10px red";
    }, 1000);
}

// 🕒 Countdown Timer Logic
function startCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        let now = new Date().getTime();
        let timeElapsed = now - startTime;
        let timeLeft = weekInMilliseconds - timeElapsed;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            gameOver();
        } else {
            updateCountdownDisplay(timeLeft);
        }
    }, 1000);
}

function updateCountdownDisplay(timeLeft) {
    let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerText = `⏳ Time Left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// 🛑 Game Over when Time Runs Out
function gameOver() {
    document.getElementById("question").innerText = "🔥 Time's up! You couldn't handle the heat! 🔥";
    document.getElementById("answer").disabled = true;
    document.querySelector(".submit-btn").disabled = true;
}

// Auto-load progress on page load
document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("startTime")) {
        startTime = parseInt(localStorage.getItem("startTime"));
        document.getElementById("challenge").style.display = "block";
        showQuestion();
        startCountdown();
    }
    updateScovilleMeter();
});
