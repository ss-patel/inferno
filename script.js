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
        { question: "Before the Aztecs, I stood tall.\nAn ancient city, known to all.\nBut you don't need to make a trip,\nYou can find me seated on a table's tip.", answer: "cholula", scoville: 1000 },
        { question: "The brick road\n+\nPeter: _____ is the word!", answer: "yellowbird", scoville: 15580 },
        { question: "🔥1111🔥", answer: "los calientes", scoville: 49000 },
        { question: "Hmmm, so many right, yet the meter stands still,\nOnly one name can break its will.\nThe heat she brings, none can deny,\nThe spiciest of all—who am I?", answer: "shivani", scoville: 2200000 }
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
            resultElement.innerHTML = "🎉 Congratulations! You are the spiciest of them all! Text: 'x12x44 🔥' to claim your prize!";
            localStorage.removeItem("currentQuestion");
            localStorage.removeItem("startTime");
            localStorage.removeItem("currentScoville");
            clearInterval(countdownInterval);
            triggerConfetti();
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

    function triggerConfetti() {
        confetti({
            particleCount: 200,
            spread: 70,
            origin: { y: 0.6 }
        });
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
    window.triggerConfetti = triggerConfetti;
});
