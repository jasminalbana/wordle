const endpoint = "https://api.masoudkf.com/v1/wordle";
const apiKey = "sw0Tr2othT1AyTQtNDUE06LqMckbTiKWaVYhuirv";
const animation_duration = 500;
const instButton = document.getElementById('inst')
const hintButton = document.getElementById('hint')
const resetButton = document.getElementById('resetButton');

//start Over button
resetButton.addEventListener('click', function() {
    location.reload();
  });

//change background
function changeBackgroundColor() {
    if(document.body.style.backgroundColor === 'gray'){
        document.body.style.backgroundColor = 'white';
    } else{
        document.body.style.backgroundColor = 'gray';
    }  
  }
  const icon = document.getElementById('changeBG'); 
  icon.addEventListener('click', changeBackgroundColor);
    

//Game Instructions
instButton.onclick = () => {
    const img = document.getElementById("myImage");
    if (img.style.display === "none") {
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }
  }

    //Game Play
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
        console.log('dictionary:', dictionary);
        let state = {
            secret: dictionary[Math.floor(Math.random() * dictionary.length)],
            grid: Array(4)
                .fill()
                .map(() => Array(4).fill('')),
            currentRow: 0,
            currentCol: 0,
        };  

        console.log(state)

        function cleanUp() {
            for (let i = 0; i < state.grid.length; i++) {
                for (let j = 0; j < state.grid[i].length; j++) {
                const box = document.getElementById(`box${i}${j}`);
                box.classList = 'box'
                box.textContent = state.grid[i][j];
                }
            }
        }

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
                        const dictionary = getCurrentWord();
                            revealWord(dictionary);          
                            state.currentRow++;
                            state.currentCol = 0;
                    }  else {
                        alert('first complete the word!');
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

        function isWordValid(word) {  
            return word.toLowerCase() == state.secret.word.toLowerCase()
        }
        //hint Icon
        hintButton.onclick = () => {  
            const hint = document.createElement('hint')
                hint.textContent = `${state.secret.hint.toUpperCase()}`;
                hint.classList.add('hint');
                document.body.appendChild(hint);
        }

        function getNumOfOccurrencesInWord(dictionary, letter) { 
            let result = 0;

            for (let i = 0; i < dictionary.length; i++) {
                if (dictionary[i] === letter) {
                result++;
                }
            }
            return result;
        }

        function getPositionOfOccurrence(dictionary, letter, position) { 
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
            
            const isValid = isWordValid(guess)

            checkEndGame(guess)

            for (let i = 0; i < 4; i++) {
                const box = document.getElementById(`box${row}${i}`);
                const letter = box.textContent;
                const numOfOccurrencesSecret = getNumOfOccurrencesInWord(
                    state.secret,
                    letter
                );
                const numOfOccurrencesGuess = getNumOfOccurrencesInWord(guess, letter);
                const letterPosition = getPositionOfOccurrence(guess, letter, i);
                
                setTimeout(() => {
                    const secretWord = state.secret.word.toLowerCase()
                    const currentLetter = letter.toLowerCase()
                    if(isValid) {
                        box.classList.add('right');
                    } else {
                        const includesLetter = secretWord.includes(currentLetter)
                        const letterMatch = currentLetter == secretWord[i]
                
                        if (letterMatch) {
                            box.classList.add('right');
                        } else if (includesLetter && !letterMatch) {
                            box.classList.add('wrong');
                        } else {
                            box.classList.add('empty');
                        }
                    }
                }, ((i + 1) * animation_duration) / 2);

                box.classList.add('animated');
                box.style.animationDelay = `${(i * animation_duration) / 2}ms`;
            }

            
        }

        function checkEndGame(guess) {
            const isWinner = isWordValid(guess)
            const isGameOver = state.currentRow + 1 === 4;
        
            setTimeout(() => {
                //congratulations
                if (isWinner) {
                var modal = document.getElementById("myModal");
                modal.style.display = "block"; 
                }     
                //lose       
                else if(isGameOver){
                const message = document.createElement('lost');
                message.textContent = `You missed the word ${state.secret.word.toUpperCase()} and lost!`;
                message.classList.add('message');
                document.body.appendChild(message);          
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
