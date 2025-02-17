const riddles = [
    { question: "I start out green but turn to red, some say I make your face turn red. What am I?", answer: "jalapeno", scoville: 8000 },
    { question: "I’m named after a ghost, but I’m not dead. I burn your mouth and make you sweat. What am I?", answer: "ghost pepper", scoville: 1000000 },
    { question: "I sound sweet but leave you burning all night. What am I?", answer: "carolina reaper", scoville: 2200000 }
];

// 🔥 Set a Fixed Deadline (Adjust as needed)
const deadline = new Date("February 20, 2025 23:59:59").getTime();
localStorage.setItem("challengeDeadline", deadline);

let currentQuestion = localStorage.getItem("currentQuestion") ? parseInt(localStorage.getItem("currentQuestion")) : 0;
let currentScoville = localStorage.getItem("currentScoville") ? parseInt(localStorage.getItem("currentScoville")) : 0;

// Countdown Timer
function updateCountdown() {
    let now = new Date().getTime();
    let timeLeft = deadline - now;

    if (timeLeft <= 0) {
        document.getElementById("countdown").innerHTML = "🔥 Time’s Up! You Lost the Challenge! 🔥";
        document.getElementById("challenge").style.display = "none";
        return;
    }

    let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById("countdown").innerHTML = `⏳ Time Left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Start Countdown on Page Load
setInterval(updateCountdown, 1000);

// Start Game
function startGame() {
    document.getElementById("challenge").style.display = "block";
    showQuestion();
    updateScovilleMeter();
}

// Show Question
function showQuestion() {
    if (currentQuestion < riddles.length) {
        document.getElementById("question").innerText = riddles[currentQuestion].question;
    } else {
        document.getElementById("result").innerHTML = "🎉 Congratulations! You've reached maximum heat! 🔥";
        localStorage.removeItem("currentQuestion");
        localStorage.removeItem("currentScoville");
    }
}

// Check Answer
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

// Update Scoville Meter
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

// Reset Progress
function resetProgress() {
    localStorage.removeItem("currentQuestion");
    localStorage.removeItem("currentScoville");
    currentQuestion = 0;
    currentScoville = 0;
    updateScovilleMeter();
    showQuestion();
}

// Auto-load progress on page load
document.addEventListener("DOMContentLoaded", () => {
    if (currentQuestion > 0) {
        document.getElementById("challenge").style.display = "block";
        showQuestion();
    }
    updateScovilleMeter();
});
