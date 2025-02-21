document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-btn");
    const introText = document.getElementById("intro-text");
    const countdownTimer = document.getElementById("countdown");
    const challengeSection = document.getElementById("challenge");
    const questionElement = document.getElementById("question");
    const answerInput = document.getElementById("answer");
    const submitButton = document.querySelector(".submit-btn");
    const resultElement = document.getElementById("result");

    const riddles = [
        { question: "I start out green but turn to red, some say I make your face turn red. What am I?", answer: "jalapeno", scoville: 8000 },
        { question: "I’m named after a ghost, but I’m not dead. I burn your mouth and make you sweat. What am I?", answer: "ghost pepper", scoville: 1000000 },
        { question: "I sound sweet but leave you burning all night. What am I?", answer: "carolina reaper", scoville: 2200000 }
    ];

    let currentQuestion = localStorage.getItem("currentQuestion") ? parseInt(localStorage.getItem("currentQuestion")) : 0;
    let currentScoville = localStorage.getItem("currentScoville") ? parseInt(localStorage.getItem("currentScoville")) : 0;
    let startTime = localStorage.getItem("startTime") ? parseInt(localStorage.getItem("startTime")) : null;
    let countdownInterval;
    const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days

    function startGame() {
        startButton.style.display = "none";
        introText.style.display = "none";
        countdownTimer.style.display = "block";
        challengeSection.style.display = "block";

        if (!startTime) {
            startTime = new Date().getTime();
            localStorage.setItem("startTime", startTime);
        }

        showQuestion();
        updateScovilleMeter();
        startCountdown();
    }

    function showQuestion() {
        if (currentQuestion < riddles.length) {
            questionElement.innerText = riddles[currentQuestion].question;
            resultElement.innerText = "";
            answerInput.value = "";
        } else {
            resultElement.innerHTML = "🎉 Congratulations! You've conquered the heat! 🔥";
            localStorage.removeItem("currentQuestion");
            localStorage.removeItem("startTime");
            localStorage.removeItem("currentScoville");
            clearInterval(countdownInterval);
        }
    }

    function checkAnswer() {
        let userAnswer = answerInput.value.trim().toLowerCase();
        if (userAnswer === riddles[currentQuestion].answer) {
            resultElement.innerText = "✅ Correct! Moving to next heat level...";
            currentScoville += riddles[currentQuestion].scoville;
            currentQuestion++;
            localStorage.setItem("currentQuestion", currentQuestion);
            localStorage.setItem("currentScoville", currentScoville);
            updateScovilleMeter();
            addFireEffect();
            setTimeout(showQuestion, 1500);
        } else {
            resultElement.innerText = "❌ Wrong! Try again.";
        }
    }

    function updateScovilleMeter() {
        let maxScoville = 2200000;
        let meterPercentage = (currentScoville / maxScoville) * 100;
        meterPercentage = meterPercentage > 100 ? 100 : meterPercentage;

        document.getElementById("meter-fill").style.width = meterPercentage + "%";
        document.getElementById("scoville-value").innerText = currentScoville.toLocaleString() + " Scoville Units";
    }

    function addFireEffect() {
        const meter = document.getElementById("meter-fill");
        meter.style.boxShadow = "0 0 20px yellow, 0 0 40px red";
        setTimeout(() => {
            meter.style.boxShadow = "0 0 10px red";
        }, 1000);
    }

    function startCountdown() {
        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            let now = new Date().getTime();
            let timeLeft = (startTime + weekInMilliseconds) - now;

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

        countdownTimer.innerText = `⏳ Time Left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    function gameOver() {
        questionElement.innerText = "🔥 Time's up! You couldn't handle the heat! 🔥";
        answerInput.disabled = true;
        submitButton.disabled = true;
        resultElement.innerText = "Game Over!";
    }

    if (localStorage.getItem("startTime")) {
        startButton.style.display = "none";
        introText.style.display = "none";
        countdownTimer.style.display = "block";
        challengeSection.style.display = "block";
        showQuestion();
        startCountdown();
    }

    updateScovilleMeter();

    // **Fix: Attach functions to window so HTML can access them**
    window.startGame = startGame;
    window.checkAnswer = checkAnswer;
});
