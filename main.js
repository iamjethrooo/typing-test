const RANDOM_QUOTE_API_URL = "http://api.quotable.io/random";
const quoteDisplay = document.querySelector("#quote-display");
const quoteInput = document.querySelector("#quote-input");
const timer = document.querySelector(".timer");
const wpm = document.querySelector("#wpm");
let playing = false;
let playingTime = 60; // In seconds
let words = 0;

const modal = document.querySelector(".modal");
const startMenu = document.querySelector(".start-menu");
const resultsMenu = document.querySelector(".result-menu");
const startButton = document.querySelector("#start");

quoteInput.addEventListener("input", () => {
  words = 0;
  if (!playing) {
    playing = true;
    startTimer();
  }
  const quote = quoteDisplay.querySelectorAll("span");
  const input = quoteInput.value.split("");

  let correct = true;

  quote.forEach((characterSpan, index) => {
    const character = input[index];
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("incorrect");
      correct = true;
      if (!(quote.length == input.length)) {
        if (
          quote[index + 1].innerText == " " ||
          quote[index + 1].innerText == "." ||
          quote[index + 1].innerText == "!" ||
          quote[index + 1].innerText == "?"
        ) {
          words++;
        }
      }
    } else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });

  if (correct) {
    renderNewQuote();
  }
});

function getRandomQuote() {
  return fetch(RANDOM_QUOTE_API_URL)
    .then((response) => response.json())
    .then((data) => data.content); // Fetches data from content tag in API
}

async function renderNewQuote() {
  const quote = await getRandomQuote();
  quoteDisplay.innerText = "";
  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");

    characterSpan.innerText = character;
    quoteDisplay.appendChild(characterSpan);
  });
  quoteInput.value = null;
}

let startTime;
let timerId;
function startTimer() {
  timer.innerText = 0;
  startTime = new Date();
  timerId = setInterval(() => {
    timer.innerText = getTimerTime();
    wpm.innerText = Math.round(words / (parseInt(timer.innerText) / 60));
    if (parseInt(timer.innerText) == playingTime) {
      clearTimeout(timerId);
      timer.innerText = 0;
      playing = false;
      modal.style.display = "block";
      resultsMenu.style.display = "flex";
    }
  }, 1000);
}

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  startMenu.style.display = "none";
  timer.innerText = 0;
  wpm.innerText = 0;
  renderNewQuote();
});
