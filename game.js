const game = {
    xTurn: true,
    xState: [],
    oState: [],
    winningStates: [
        // Rows
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],

        // Columns
        ['0', '3', '6'],
        ['1', '4', '7'],
        ['2', '5', '8'],

        // Diagonal
        ['0', '4', '8'],
        ['2', '4', '6']
    ],
    xWins: 0, // New: Track X's wins
    oWins: 0, // New: Track O's wins
    championshipWins: 5 // New: Number of wins needed to be champion
};

// to change the turn of x and o 
const changeTurn = () => {
    return turn === "X" ? "O" : "X";
}

let turn = "X";
let isgameover = false; // Tracks if the current round is over

// Get references to elements for score display and dynamically add them
const scoreContainer = document.createElement('div');
scoreContainer.classList.add('score-container');
scoreContainer.innerHTML = `
    <span class="player-score" id="x-score">X Wins: 0</span>
    <span class="player-score" id="o-score">O Wins: 0</span>
`;
// Prepend the score container to the info section
document.querySelector('.info_sec').prepend(scoreContainer);


// Function to update score display
const updateScoreDisplay = () => {
    document.getElementById('x-score').textContent = `X Wins: ${game.xWins}`;
    document.getElementById('o-score').textContent = `O Wins: ${game.oWins}`;
};

// Initial score display update when the page loads
updateScoreDisplay();


document.addEventListener('click', event => {
    const target = event.target
    const isCell = target.classList.contains('grid-cell')
    const isDisabled = target.classList.contains('disabled')

    // Only proceed if it's a grid cell and not already disabled (filled)
    if (isCell && !isDisabled) {
        const cellValue = target.dataset.value;

        // Add the cell value to the correct player's state
        game.xTurn === true
            ? game.xState.push(cellValue)
            : game.oState.push(cellValue)

        // Disable the clicked cell and add the 'x' or 'o' class for styling
        target.classList.add('disabled');
        target.classList.add(game.xTurn ? 'x' : 'o');
        
        // Change turn for the next move
        turn = changeTurn();
        game.xTurn = !game.xTurn;
    }

    let gameEndedThisRound = false; // Flag to check if the current round has ended (win or draw)

    // Check for a win in the current round
    game.winningStates.forEach(winningState => {
        const xWinsRound = winningState.every(state => game.xState.includes(state))
        const oWinsRound = winningState.every(state => game.oState.includes(state))

        if (xWinsRound || oWinsRound) {
            // Disable all cells to prevent further moves
            document.querySelectorAll('.grid-cell').forEach(cell => cell.classList.add('disabled'))
            // Show the game over overlay
            document.querySelector('.game-over').classList.add('visible')
            
            if (xWinsRound) {
                document.querySelector('.game-over-text').textContent = 'X wins this round!';
                game.xWins++; // Increment X's score
            } else {
                document.querySelector('.game-over-text').textContent = 'O wins this round!';
                game.oWins++; // Increment O's score
            }
            updateScoreDisplay(); // Update the displayed score

            isgameover = true; // Mark current round as over
            gameEndedThisRound = true;

            // Check for championship win
            if (game.xWins >= game.championshipWins) {
                document.querySelector('.game-over-text').textContent = 'X IS THE CHAMPION!';
                document.querySelector('.restart').style.display = 'none'; // Hide "Play Next Round" button
                // You might want to add a "Start New Championship" button here instead
            } else if (game.oWins >= game.championshipWins) {
                document.querySelector('.game-over-text').textContent = 'O IS THE CHAMPION!';
                document.querySelector('.restart').style.display = 'none'; // Hide "Play Next Round" button
            }
        }
    });

    // Check for a draw only if the current round hasn't ended by a win and all cells are filled
    if (!gameEndedThisRound && !document.querySelectorAll('.grid-cell:not(.disabled)').length) {
        document.querySelector('.game-over').classList.add('visible');
        document.querySelector('.game-over-text').textContent = 'It\'s a Draw!';
        isgameover = true; // Mark current round as over
        gameEndedThisRound = true;
    }

    // TO DISPLAY WHO'S TURN ONTO THE SCREEN, only if the current round is not over
    if (!isgameover) {
        document.getElementsByClassName("Info")[0].innerText = "Turn for " + turn;
    } else {
        // If game is over, ensure the turn info is cleared or shows game ended
        document.getElementsByClassName("Info")[0].innerText = "Game Over!";
    }
});


// Event listener for the "Play Next Round" button (after a win/draw)
document.querySelector('.restart').addEventListener('click', () => {
    // Hide game over overlay
    document.querySelector('.game-over').classList.remove('visible')
    // Clear all grid cells
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('disabled', 'x', 'o')
    })
    // Reset game state for the new round
    turn = "X";
    game.xTurn = true
    game.xState = []
    game.oState = []
    isgameover = false; // Reset game over status for the new round
    document.getElementsByClassName("Info")[0].innerText = "Turn for " + turn; // Reset turn info
});

// Event listener for the "Restart Current Round" button (resets current game, not scores)
document.querySelector('.frestart').addEventListener('click', () => {
    // Hide game over overlay if visible
    document.querySelector('.game-over').classList.remove('visible')
    // Clear all grid cells
    document.querySelectorAll('.grid-cell').forEach(cell => {
        cell.classList.remove('disabled', 'x', 'o')
    })
    // Reset game state for the current round
    turn = "X";
    game.xTurn = true
    game.xState = []
    game.oState = []
    isgameover = false; // Reset game over status
    document.getElementsByClassName("Info")[0].innerText = "Turn for " + turn; // Reset turn info
    
    // If championship was won and restart button was hidden, show it again
    document.querySelector('.restart').style.display = 'block'; 
});