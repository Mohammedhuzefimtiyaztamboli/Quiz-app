let user = "";
let questions = [];
let current = 0;
let score = 0;
let time = 15;
let timer;

const loginBox = document.getElementById("loginBox");
const settingsBox = document.getElementById("settingsBox");
const quizBox = document.getElementById("quizBox");
const resultBox = document.getElementById("resultBox");

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const progressBar = document.getElementById("progressBar");
const timeEl = document.getElementById("time");
const leaderboardEl = document.getElementById("leaderboard");

function login() {
  const name = document.getElementById("username").value.trim();
  if (!name) return alert("Enter name");
  user = name;
  loginBox.classList.add("hidden");
  settingsBox.classList.remove("hidden");
}

async function startQuiz() {
  settingsBox.classList.add("hidden");
  quizBox.classList.remove("hidden");

  const cat = document.getElementById("category").value;
  const diff = document.getElementById("difficulty").value;

  let url = `https://opentdb.com/api.php?amount=5&type=multiple`;
  if (cat) url += `&category=${cat}`;
  if (diff) url += `&difficulty=${diff}`;

  const res = await fetch(url);
  const data = await res.json();
  questions = data.results;

  loadQuestion();
  startTimer();
}

function loadQuestion() {
  resetTimer();
  const q = questions[current];
  questionEl.innerHTML = decode(q.question);

  const answers = [...q.incorrect_answers, q.correct_answer]
    .sort(() => Math.random() - 0.5);

  optionsEl.innerHTML = "";
  answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.innerHTML = decode(ans);
    btn.onclick = () => selectAnswer(ans);
    optionsEl.appendChild(btn);
  });

  progressBar.style.width = ((current + 1) / questions.length) * 100 + "%";
}

function selectAnswer(ans) {
  if (ans === questions[current].correct_answer) score++;
  next();
}

function next() {
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function startTimer() {
  timer = setInterval(() => {
    time--;
    timeEl.innerText = time;
    if (time === 0) next();
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  time = 15;
  timeEl.innerText = time;
  startTimer();
}

function showResult() {
  clearInterval(timer);
  quizBox.classList.add("hidden");
  resultBox.classList.remove("hidden");

  saveScore();
  showLeaderboard();

  document.getElementById("scoreText").innerText =
    `${user}, your score: ${score}/${questions.length}`;
}

function saveScore() {
  let board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  board.push({ name: user, score });
  board.sort((a,b) => b.score - a.score);
  board = board.slice(0,5);
  localStorage.setItem("leaderboard", JSON.stringify(board));
}

function showLeaderboard() {
  const board = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardEl.innerHTML = "";
  board.forEach(item => {
    const li = document.createElement("li");
    li.innerText = `${item.name} - ${item.score}`;
    leaderboardEl.appendChild(li);
  });
}

function restart() {
  location.reload();
}

function toggleDark() {
  document.body.classList.toggle("dark");
}

function decode(text) {
  const t = document.createElement("textarea");
  t.innerHTML = text;
  return t.value;
}
