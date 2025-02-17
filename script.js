const riddles = [
    { question: "I start out green but turn to red, some say I make your face turn red. What am I?", answer: "jalapeno" },
    { question: "I’m named after a ghost, but I’m not dead. I burn your mouth and make you sweat. What am I?", answer: "ghost pepper" },
    { question: "I sound sweet but leave you burning all night. What am I?", answer: "carolina reaper" }
];

let currentQuestion = localStorage.getItem("currentQuestion") ? parseInt(localStorage.getItem("currentQuestion")) : 0;

function startGame() {
    document.getElementById("challenge").style.display = "block";
    showQuestion();
}

function showQuestion() {
    if (currentQuestion < riddles.length) {
        document.getElementById("question").innerText = riddles[currentQuestion].question;
    } else {
        document.getElementById("result").innerHTML = "🎉 Congratulations! You've won the Hot Sauce Inferno Challenge! 🔥";
        localStorage.removeItem("currentQuestion"); // Reset progress after winning
    }
}

function checkAnswer() {
    let userAnswer = document.getElementById("answer").value.trim().toLowerCase();
    if (userAnswer === riddles[currentQuestion].answer) {
        document.getElementById("result").innerText = "✅ Correct! Moving to next level...";
        currentQuestion++;
        localStorage.setItem("currentQuestion", currentQuestion); // Save progress
        setTimeout(showQuestion, 1500);
    } else {
        document.getElementById("result").innerText = "❌ Wrong! Try again.";
    }
}

// Auto-load progress on page load
document.addEventListener("DOMContentLoaded", () => {
    if (currentQuestion > 0) {
        document.getElementById("challenge").style.display = "block";
        showQuestion();
    }
});
