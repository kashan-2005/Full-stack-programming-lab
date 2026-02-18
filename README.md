# Full-stack-programming-lab
Full Stack Programming Lab 2
<!DOCTYPE html>
<html>
<head>
    <title>Advanced JavaScript Quiz</title>

    <style>
        body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #1e3c72, #2a5298);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .card {
            background: white;
            width: 450px;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 15px 30px rgba(0,0,0,0.3);
            animation: fadeIn 0.6s ease-in-out;
        }

        h2 {
            text-align: center;
        }

        .progress-bar {
            height: 8px;
            background: #ddd;
            border-radius: 5px;
            margin-bottom: 15px;
        }

        .progress {
            height: 8px;
            width: 0%;
            background: #2a5298;
            border-radius: 5px;
            transition: 0.4s;
        }

        .timer {
            text-align: right;
            font-weight: bold;
            color: #e63946;
        }

        .options label {
            display: block;
            padding: 6px;
            margin: 5px 0;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s;
        }

        .options label:hover {
            background: #f1f1f1;
        }

        button {
            margin-top: 10px;
            padding: 8px 15px;
            border: none;
            border-radius: 20px;
            background: #2a5298;
            color: white;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
        }

        button:hover {
            background: #1e3c72;
        }

        .result-box {
            margin-top: 15px;
            padding: 10px;
            text-align: center;
            border-radius: 10px;
            font-weight: bold;
        }

        @keyframes fadeIn {
            from {opacity: 0; transform: translateY(-10px);}
            to {opacity: 1; transform: translateY(0);}
        }
    </style>

</head>
<body>

<div class="card">

    <h2>🚀 Advanced JS Quiz</h2>

    <div class="timer">Time Left: <span id="time">30</span>s</div>

    <div class="progress-bar">
        <div class="progress" id="progress"></div>
    </div>

    <div id="quiz-container"></div>

    <button onclick="nextQuestion()">Next</button>
    <button onclick="submitQuiz()">Submit</button>

    <div id="result" class="result-box"></div>

</div>

<script src="quiz.js"></script>

</body>
</html>
