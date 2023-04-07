// get input element
const input = document.querySelector('input');

// get errorDisplay element
const errorDisplay = document.querySelector('.errorDisplay');

// get guess element
const guess = document.querySelector('.guess');

// get hint element
const hint = document.querySelector('.hint');

// get a nodelist of all the hidden cells
const hiddenCells = document.querySelectorAll('.hidden');

// empty array called success
let success = [];

// empty array called errorCounter
let errorCounter = [];

// get the score element
const score = document.querySelector('.score');

// function that logs the input value when a user presses 'enter'
input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        // get input value
        const inputValue = input.value;
        // check if the input value is a letter
        if (isLetter(inputValue)) {
            // check if the input value is in the word to be guessed
            if (isLetterInWord(inputValue)) {
                // clear the guess element
                guess.innerHTML = '';
                // add the input value to the success array
                success.push(inputValue);
                console.log(success);
                // loop through the word
                for (let i = 0; i < word.length; i++) {
                    // if the success array includes the letter at the current index, add that letter to the guess element
                    if (success.includes(word[i])) {
                        guess.innerHTML += word[i] + ' ';
                    } else {
                        // if the success array does not include the letter at the current index, add an underscore to the guess element
                        guess.innerHTML += '_ ';
                    }
                }
            } else {
                // add the input value to the errorCounter array
                errorCounter.push(inputValue);
                errorDisplay.innerHTML += inputValue + ' ';
                // iterate through the hidden cells nodelist with foreach
                hiddenCells.forEach(function(cell) {
                    if (cell.dataset.error === errorCounter.length.toString()) {
                        // add the class 'show' to the cell
                        cell.classList.remove('hidden');
                    }
                });

            }
        } else {
            // if the input value is not a letter, display an error message
            alert('Veuillez entrer une lettre');
        }
    }
    // clear input value
    input.value = '';
    // check if the user has won
    checkWin();
});

// function that fetches the word to be guessed when the page loads
window.onload = function() {
    fetch('https://trouve-mot.fr/api/random/1')
        .then(response => response.json())
        .then(data => { 
            console.log(data);
            // get the word to be guessed
            word = data[0].name;
            // loop through the word
            for (let i = 0; i < word.length; i++) {
                guess.innerHTML += '_ ';
            }
            // get the hint
            const category = data[0].categorie;
            hint.innerHTML = category;
        });
}

// function that checks if the input value is a letter (including french accents)
function isLetter(str) {
    return str.length === 1 && str.match(/[a-zàâçéèêëîïôûùüÿñæœ]/i);
}

// function that checks if the input value is in the word to be guessed
function isLetterInWord(str) {
    // loop through the word, if the input value is in the word, return true else return false
    for (let i = 0; i < word.length; i++) {
        if (str === word[i]) {
            return true;
        }
    }
}

// function that checks if the user has won
function checkWin() {
    // if the success array includes all the letters of the word, the user has won
    if (word.split('').every(w => success.includes(w))) {
        score.classList.remove('hidden');
        let template = `
            <h3>Gagné !</h3>
            <p>Pour jouer une nouvelle partie, clique ci-dessous 👇</p>
            <button>Rejouer</button>
        `;
        score.innerHTML += template;
        // get the button element
        const button = document.querySelector('button');
        // add an event listener to the button
        button.addEventListener('click', resetGame);
    }
    // if the errorCounter array length is equal to 11, the user has lost
    if (errorCounter.length === 11) {
        score.classList.remove('hidden');
        let template = `
            <h3>T'es mort ! 💀</h3>
            <p>Le mot était ${word}</p>
            <p>Pour jouer une nouvelle partie, clique ci-dessous 👇</p>
            <button>Rejouer</button>
        `;
        score.innerHTML += template;
        // get the button element
        const button = document.querySelector('button');
        // add an event listener to the button
        button.addEventListener('click', resetGame);
    }
}

// function that resets the game
function resetGame() {
    // clear the guess element
    guess.innerHTML = '';
    // clear the errorDisplay element
    errorDisplay.innerHTML = '';
    // clear the score element
    score.innerHTML = '';
    // clear the success array
    success = [];
    // clear the errorCounter array
    errorCounter = [];
    // add the hidden class to the score element
    score.classList.add('hidden');
    // loop through the hidden cells nodelist
    hiddenCells.forEach(function(cell) {
        // add the hidden class to the cell
        cell.classList.add('hidden');
    });
    // fetch a new word
    fetch('https://trouve-mot.fr/api/random/1')
        .then(response => response.json())
        .then(data => { 
            console.log(data);
            // get the word to be guessed
            word = data[0].name;
            // loop through the word
            for (let i = 0; i < word.length; i++) {
                guess.innerHTML += '_ ';
            }
            // get the hint
            const category = data[0].categorie;
            hint.innerHTML = category;
        });
}
