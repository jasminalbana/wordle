const endpoint = "https://api.masoudkf.com/v1/wordle";
const apiKey = "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv";

async function getDictionary() {
  const res = await fetch(endpoint, {
    headers: {
      "x-api-key": apiKey,
    },
  });
  const data = await res.json();
  return data?.dictionary ?? [];
}

getDictionary().then(dictionary => {
    // for testing purposes, make sure to use the test dictionary
    console.log('dictionary:', dictionary);
  
    const state = {
      secret: dictionary[Math.floor(Math.random() * dictionary.length)],
      grid: Array(4)
        .fill()
        .map(() => Array(4).fill('')),
      currentRow: 0,
      currentCol: 0,
    };




    // import { testDictionary, realDictionary } from './dictionary.js';

    // // for testing purposes, make sure to use the test dictionary
    // console.log('test dictionary:', testDictionary);

    // const dictionary = realDictionary;
    // const state = {
    //   secret: dictionary[Math.floor(Math.random() * dictionary.length)],
    //   grid: Array(4)
    //     .fill()
    //     .map(() => Array(4).fill('')),
    //   currentRow: 0,
    //   currentCol: 0,
    // };

    function drawGrid(container) {
        const grid = document.createElement('div');
        grid.className = 'grid';

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
            drawBox(grid, i, j);
            }
        }

        container.appendChild(grid);
    }

    function updateGrid() {
        for (let i = 0; i < state.grid.length; i++) {
            for (let j = 0; j < state.grid[i].length; j++) {
            const box = document.getElementById(`box${i}${j}`);
            box.textContent = state.grid[i][j];
            }
        }
    }

    function drawBox(container, row, col, letter = '') {
        const box = document.createElement('div');
        box.className = 'box';
        box.textContent = letter;
        box.id = `box${row}${col}`;

        container.appendChild(box);
        return box;
    }

    function registerKeyboardEvents() {
        document.body.onkeydown = (e) => {
            const key = e.key;
            if (key === 'Enter') {
                if (state.currentCol === 4) {
                    const dictionary = getCurrentWord(); //binago ko 'word' yung nasa ()
                    if (isWordValid(dictionary)) {      //binago ko 'word' yung nasa ()
                        revealWord(dictionary);          //binago ko 'word' yung nasa ()
                        state.currentRow++;
                        state.currentCol = 0;
                    } else {
                        alert('Not a valid word.');
                    }
                }
            }
            if (key === 'Backspace') {
            removeLetter();
            }
            if (isLetter(key)) {
            addLetter(key);
            }

            updateGrid();
        };
    }

    function getCurrentWord() {
    return state.grid[state.currentRow].reduce((prev, curr) => prev + curr);
    }

    function isWordValid(word) {   //binago ko 'word' yung nasa ()
        const existWord = dictionary.find(dict => dict.word.toLowerCase() == word.toLowerCase())
        return existWord ? true : false
    }

    function getNumOfOccurrencesInWord(dictionary, letter) { //binago ko 'word' yung nasa ()
    let result = 0;
    for (let i = 0; i < dictionary.length; i++) {
        if (dictionary[i] === letter) {
        result++;
        }
    }
    return result;
    }

    function getPositionOfOccurrence(dictionary, letter, position) { //binago ko 'word' yung nasa ()
    let result = 0;
    for (let i = 0; i <= position; i++) {
        if (dictionary[i] === letter) {
        result++;
        }
    }
    return result;
    }

    function revealWord(guess) {
        const row = state.currentRow;
        const animation_duration = 500; // ms

        for (let i = 0; i < 4; i++) {
            const box = document.getElementById(`box${row}${i}`);
            const letter = box.textContent;
            const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
                state.secret,
                letter
            );
            const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
            const letterPosition = getPositionOfOccurrence(guess, letter, i);

            console.log(numOfOccurrencesGuess,
                numOfOccurrencesSecret,
                letterPosition,
                numOfOccurrencesSecret)
                
            setTimeout(() => {
                if (
                    numOfOccurrencesGuess > numOfOccurrencesSecret &&
                    letterPosition > numOfOccurrencesSecret
                ) {
                    box.classList.add('right');
                } else {

                    console.log(state.secret, letter)
                    if (letter === state.secret[i]) {
                        box.classList.add('right');
                    } else if (state.secret.includes(letter)) {
                        box.classList.add('wrong');
                    } else {
                        box.classList.add('empty');
                    }
                }
            }, ((i + 1) * animation_duration) / 2);

            box.classList.add('animated');
            box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
        }

        const isWinner = state.secret === guess;
        const isGameOver = state.currentRow === 4;

        setTimeout(() => {
            if (isWinner) {
            alert('Congratulations!');
            } else if (isGameOver) {
            alert(`Better luck next time! The word was ${state.secret}.`);
            }
        }, 3 * animation_duration);
    }

    function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
    }

    function addLetter(letter) {
    if (state.currentCol === 4) return;
        state.grid[state.currentRow][state.currentCol] = letter;
        state.currentCol++;
    }

    function removeLetter() {
    if (state.currentCol === 0) return;
    state.grid[state.currentRow][state.currentCol - 1] = '';
    state.currentCol--;
    }

    function startup() {
    const game = document.getElementById('game');
    drawGrid(game);

    registerKeyboardEvents();
    }

    startup();

})