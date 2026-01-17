const hangmanImage = document.querySelector(".hangman-box img");
const wordDisply = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");
const resetBtn = document.querySelector(".resetBtn");

let currentWord, correctLetters, wrongGuessCount;
const maxGuesses=6;

let score = parseInt(localStorage.getItem("score"))||0;
document.getElementById("score").textContent=score;

const addScore = () =>{
    const scoreEl = document.getElementById("score");
    if(scoreEl){
        scoreEl.textContent=score;
    } 
}

const resetScore = () =>{
    score=0;
    localStorage.setItem("score",score);
    addScore();
}

const resetGame = ()=>{
    //Resseting  all variables
    correctLetters=[];
    wrongGuessCount=0;
    hangmanImage.src=`img/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText=`${wrongGuessCount}/${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn=>btn.disabled=false);
    wordDisply.innerHTML= currentWord.split("").map(()=>`<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");
}

const getRandomWord = () =>{
    // Select random word from the word list
    const{word, hint}= wordList[Math.floor(Math.random() * wordList.length)];
    currentWord=word;
    console.log(word);
    document.querySelector(".hint-text b").innerText= hint;
    resetGame();
}

const gameOver = (isVictory)=>{
    //After completing the game, popUp window shows relevant details
        setTimeout(()=>{
        const modalText = isVictory ? `You found the word:` : `The correct word was:`;
        gameModal.querySelector("img").src = `img/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Congrats!' : 'Game Over!'}`;
        gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
        },300);

        if(isVictory){
            score++;
            localStorage.setItem("score",score);
            addScore();
        }
}

const initGame=(button, clickedLetter)=>{
    //Check if the letter exist in the word or not
    if(currentWord.includes(clickedLetter)){
        //Show all correct letters 
       [...currentWord].forEach((letter, index)=>{
            if(letter === clickedLetter){
                correctLetters.push(letter);
                wordDisply.querySelectorAll("li")[index].innerText=letter;
                wordDisply.querySelectorAll("li")[index].classList.add("guessed");
            }
       })
    }else{
        // If choosen character does not exist in the word, then hangman image is beeing displayed
        wrongGuessCount++;
        hangmanImage.src=`img/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled=true;
    guessesText.innerText=`${wrongGuessCount}/${maxGuesses}`;

    //GameOver Function if one of this events happens
    if(wrongGuessCount===maxGuesses)return gameOver(false);
    if(correctLetters.length===currentWord.length)return gameOver(true);
    if(correctLetters.length===currentWord.length)addScore;
}

// Loop for creating the keyboard and event listeners
for (let i = 97; i <=122; i++) {
    const button = document.createElement("button");
    button.innerText=String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target,String.fromCharCode(i)))
}

getRandomWord();
addScore();
playAgainBtn.addEventListener("click", getRandomWord);
resetBtn.addEventListener("click", resetScore);

