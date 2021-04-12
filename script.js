const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const actualWord = document.getElementById("actual-word");

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
      actualWord.innerText = `The word was ${selectedWord}`;
      popup.style.display = "flex";
    }
  }

  //Update the wrong letters
  function updateWrongLettersEl() {
    // display wrong letters
    wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}`;

    // display parts
    figureParts.forEach((part, index) => {
      const errors = wrongLetters.length;

      if (index < errors) {
        part.style.display = "block";
      } else {
        part.style.display = "none";
      }
    });

    //Check if lost
    if (wrongLetters.length === figureParts.length) {
      finalMessage.innerText = "You lost! 😡 Try again!";
      actualWord.innerText = `The word was ${selectedWord}`;
      popup.style.display = "flex";
    }
  }

  //Show Notification
  function showNotification() {
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 2000);
  }

  // Keydown letter press
  window.addEventListener("keydown", (e) => {
    // console.log(e.keyCode);
    if (e.keyCode >= 65 && e.keyCode <= 90) {
      const letter = e.key;

      if (selectedWord.includes(letter)) {
        if (!correctLetters.includes(letter)) {
          correctLetters.push(letter);

          displayWord();
        } else {
          showNotification();
        }
      } else {
        if (!wrongLetters.includes(letter)) {
          wrongLetters.push(letter);

          updateWrongLettersEl();
        } else {
          showNotification();
        }
      }
    }
  });

  // Restart game
  playAgainBtn.addEventListener("click", () => {
    correctLetters.splice(0);
    wrongLetters.splice(0);

    selectedWord = words[Math.floor(Math.random() * words.length)];

    displayWord();
    updateWrongLettersEl();

    popup.style.display = "none";
  });

  displayWord();
}
