document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.getElementById("start-btn");
    const introText = document.getElementById("intro-text");
    const countdownTimer = document.getElementById("countdown");
    const challengeSection = document.getElementById("challenge");

    if (!startButton) {
        console.error("Error: Start button not found!");
        return;
    }

    startButton.addEventListener("click", startGame);

    function startGame() {
        startButton.style.display = "none"; // Hide start button
        introText.style.display = "none"; // Hide intro text
        countdownTimer.style.display = "block"; // Show timer
        challengeSection.style.display = "block"; // Show riddle

        // Start timer if it's not already set
        if (!localStorage.getItem("startTime")) {
            let startTime = new Date().getTime();
            localStorage.setItem("startTime", startTime);
        }

        showQuestion();
        updateScovilleMeter();
        startCountdown();
    }

    function showQuestion() {
        let currentQuestion = localStorage.getItem("currentQuestion") ? parseInt(localStorage.getItem("currentQuestion")) : 0;
        const riddles = [
            { question: "I start out green but turn to red, some say I make your face turn red. What am I?", answer: "jalapeno", scoville: 8000 },
            { question: "I’m named after a ghost, but I’m not dead. I burn your mouth and make you sweat. What am I?", answer: "ghost pepper", scoville: 1000000 },
            { question: "I sound sweet but leave you burning all night. What am I?", answer: "carolina reaper", scoville: 2200000 }
        ];

        if (currentQuestion < riddles.length) {
            document.getElementById("question").innerText = riddles[currentQuestion].question;
        } else {
            document.getElementById("result").innerHTML = "🎉 Congratulations! You've conquered the heat! 🔥";
            localStorage.removeItem("currentQuestion");
            localStorage.removeItem("startTime");
        }
    }

    function startCountdown() {
        let startTime = parseInt(localStorage.getItem("startTime"));
        const weekInMilliseconds = 7 * 24 * 60 * 60 * 1000; // 7 days

        function updateCountdown() {
            let now = new Date().getTime();
            let timeLeft = (startTime + weekInMilliseconds) - now;

            if (timeLeft <= 0) {
                document.getElementById("question").innerText = "🔥 Time's up! You couldn't handle the heat! 🔥";
                document.getElementById("answer").disabled = true;
                document.querySelector(".submit-btn").disabled = true;
                clearInterval(countdownInterval);
            } else {
                let days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                let hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                countdownTimer.innerText = `⏳ Time Left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
        }

        updateCountdown();
        let countdownInterval = setInterval(updateCountdown, 1000);
    }

    function updateScovilleMeter() {
        let currentScoville = localStorage.getItem("currentScoville") ? parseInt(localStorage.getItem("currentScoville")) : 0;
        let maxScoville = 2200000;
        let meterPercentage = (currentScoville / maxScoville) * 100;
        meterPercentage = meterPercentage > 100 ? 100 : meterPercentage;

        document.getElementById("meter-fill").style.width = meterPercentage + "%";
        document.getElementById("scoville-value").innerText = currentScoville.toLocaleString() + " Scoville Units";
    }

    // Auto-load progress if game was already started
    if (localStorage.getItem("startTime")) {
        startButton.style.display = "none";
        introText.style.display = "none";
        countdownTimer.style.display = "block";
        challengeSection.style.display = "block";
        showQuestion();
        startCountdown();
    }

    updateScovilleMeter();
});
