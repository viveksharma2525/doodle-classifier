// Define constants for the guess types
const DONUT = 0;
const HEADPHONES = 1;
const APPLE = 2;
const SKULL = 3;
const TRACTOR = 4;

// Initialize arrays to store data for mistakes and raw guesses
let mistakesData = [];
let rawGuessesData = [];

// Function to update the mistakes table
export function updateMistakesTable() {
    const mistakesTableBody = document.querySelector('#mistakes-table tbody');
    mistakesTableBody.innerHTML = ''; // Clear existing rows

    mistakesData.forEach(mistake => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${mistake.label}</td>
            <td>${mistake.classification}</td>
            <td>${mistake.count}</td>
        `;
        mistakesTableBody.appendChild(row);
    });
}

// Function to update the raw guesses table
export function updateRawGuessesTable() {
    const rawGuessesTableBody = document.querySelector('#raw-guesses-table tbody');
    rawGuessesTableBody.innerHTML = ''; // Clear existing rows

    rawGuessesData.forEach(guess => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${guess.index}</td>
            <td>${guess.doodleNum}</td>
            <td>${guess.label}</td>
            <td>${guess.classification}</td>
            <td>${guess.guessDonut}</td>
            <td>${guess.guessHeadphones}</td>
            <td>${guess.guessApple}</td>
            <td>${guess.guessSkull}</td>
            <td>${guess.guessTractor}</td>
        `;
        rawGuessesTableBody.appendChild(row);
    });
}

// Function to update the mistake tracking when a misclassification occurs
export function updateMistakes(label, classification) {
    // Check if the mistake already exists in the mistakesData
    let mistake = mistakesData.find(m => m.label === label && m.classification === classification);
    if (mistake) {
        mistake.count++; // Increment the count if mistake already exists
    } else {
        mistakesData.push({ label, classification, count: 1 }); // Add a new mistake entry
    }
}

// Function to update raw guesses
function updateRawGuesses(index, doodleNum, label, classification, guesses) {
    // Ensure guesses are valid and unpacked
    if (!Array.isArray(guesses) || guesses.length !== 5) {
        console.error("Invalid guesses data");
        return;
    }

    rawGuessesData.push({
        index,
        doodleNum,
        label,
        classification,
        guessDonut: guesses[DONUT],
        guessHeadphones: guesses[HEADPHONES],
        guessApple: guesses[APPLE],
        guessSkull: guesses[SKULL],
        guessTractor: guesses[TRACTOR]
    });
}

