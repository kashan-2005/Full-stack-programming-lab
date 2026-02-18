const questions = [
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5"],
        answer: "4"
    },
    {
        question: "Capital of Pakistan?",
        options: ["Lahore", "Islamabad", "Karachi"],
        answer: "Islamabad"
    },
    {
        question: "JavaScript is used for?",
        options: ["Styling", "Structure", "Web Development"],
        answer: "Web Development"
    }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;

function loadQuestion() {

    let q = questions[currentQuestion];

    let html = "<h3>" + q.question + "</h3><div class='options'>";

    q.options.forEach(option => {
        html += `
            <label>
                <input type="radio" name="option" value="${option}">
                ${option}
            </label>
        `;
    });

    html += "</div>";

    document.getElementById("quiz-container").innerHTML = html;

    updateProgress();
}

function nextQuestion() {

    let selected = document.querySelector("input[name='option']:checked");

    if (!selected) {
        alert("Please select an answer!");
        return;
    }

    if (selected.value === questions[currentQuestion].answer) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        submitQuiz();
    }
}

function submitQuiz() {

    clearInterval(timer);

    let resultBox = document.getElementById("result");

    resultBox.innerText = "Final Score: " + score + "/" + questions.length;

    if (score === questions.length) {
        resultBox.style.backgroundColor = "#c6f6d5";
    } else if (score >= 2) {
        resultBox.style.backgroundColor = "#fefcbf";
    } else {
        resultBox.style.backgroundColor = "#fed7d7";
    }

    document.getElementById("quiz-container").innerHTML = "";
}

function updateProgress() {
    let progressPercent = ((currentQuestion) / questions.length) * 100;
    document.getElementById("progress").style.width = progressPercent + "%";
}

function startTimer() {

    timer = setInterval(function () {

        timeLeft--;
        document.getElementById("time").innerText = timeLeft;

        if (timeLeft <= 0) {
            submitQuiz();
        }

    }, 1000);
}

loadQuestion();
startTimer();
