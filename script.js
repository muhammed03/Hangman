const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-again");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");

const figureParts = document.querySelectorAll(".figure-part");

getWords();

let words = [];

async function getWords() {
  const res = await fetch(
    "https://random-word-api.herokuapp.com/word?number=10"
  );
  const data = await res.json();

  words = [...data];
  return words;
}

getWords().then(() => {
  gameRound();
});

function gameRound() {
  let selectedWord = words[Math.floor(Math.random() * words.length)];
  console.log(selectedWord);
  const correctLetters = [];
  const wrongLetters = [];
  function displayWord() {
    wordEl.innerHTML = `
          ${selectedWord
            .split("")
            .map(
              (letter) =>
                `<span class="letter">${
                  correctLetters.includes(letter) ? letter : ""
                }</span>`
            )
            .join("")}
      `;
    const innerWord = wordEl.innerText.replace(/\n/g, "");

    if (innerWord === selectedWord) {
      finalMessage.innerText = "Congratulations! You won! 🤩";
      popup.style.display = "flex";
    }
  }
  displayWord();
}
