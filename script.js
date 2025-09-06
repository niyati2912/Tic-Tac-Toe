const cells= document.querySelectorAll('.cell');
//this selects all elements of html with the class .cell  nodelist type 
const statusText= document.querySelector('#statusText');
//we made a div with the id statusText so we can select it here
const restartBtn= document.querySelector('#restartBtn');
//this grabs the restart button 
let options= ["", "", "", "", "", "", "", "", ""];
//game board memory
//array with 9 empty strings -- one for each cell
let currentPlayer= "X";
//keeps track of whose turn it is
let running= true;
//to check if the game is running or not (start as true)


const winConditions = [
[0,1,2], [3,4,5], [6,7,8], // rows
[0,3,6], [1,4,7], [2,5,8], // cols
[0,4,8], [2,4,6]           // diagonals
];

// Add event listeners
cells.forEach(cell => cell.addEventListener("click", cellClicked));
restartBtn.addEventListener("click", restartGame);

// Show whose turn
statusText.textContent = `${currentPlayer}'s turn`;

function cellClicked() {
const cellIndex = this.getAttribute("cellIndex");

if (options[cellIndex] !== "" || !running) {
return;
}

updateCell(this, cellIndex);
checkWinner();
}

function updateCell(cell, index) {
options[index] = currentPlayer;
cell.textContent = currentPlayer;  // <--- THIS SHOWS X or O
}

function changePlayer() {
currentPlayer = (currentPlayer === "X") ? "O" : "X";
statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
let roundWon = false;
let winningCells = [];

//vertical
for (let condition of winConditions) {
const [a, b, c] = condition;
if (options[a] && options[a] === options[b] && options[a] === options[c]) {
    roundWon = true;
    winningCells = condition;
    break;
}
}

if (roundWon) {
statusText.textContent = `${currentPlayer} wins!`;
running = false;
drawWinLine(winningCells);
} else if (!options.includes("")) {
statusText.textContent = "It's a Draw!";
running = false;
} else {
changePlayer();
}
}

//TO STRIKE THRU THE WINNING LINES
const winLine = document.querySelector("#winLine");

function drawWinLine(cells) {
winLine.style.width = "0"; // reset

const [a, , c] = cells;
const cellElements = document.querySelectorAll(".cell");
const container = document.querySelector("#gameContainer").getBoundingClientRect();

// get center of first and last winning cells
const startCell = cellElements[a].getBoundingClientRect();
const endCell = cellElements[c].getBoundingClientRect();

const startX = startCell.left + startCell.width / 2 - container.left;
const startY = startCell.top + startCell.height / 2 - container.top;
const endX = endCell.left + endCell.width / 2 - container.left;
const endY = endCell.top + endCell.height / 2 - container.top;

// calculate distance and angle
const dx = endX - startX;
const dy = endY - startY;
const length = Math.sqrt(dx * dx + dy * dy);
const angle = Math.atan2(dy, dx) * (180 / Math.PI);

// apply styles
winLine.style.top = `${startY}px`;
winLine.style.left = `${startX}px`;
winLine.style.width = `${length}px`;
winLine.style.transformOrigin = "0 50%"; // pivot at left middle
winLine.style.transform = `rotate(${angle}deg)`;
}

function restartGame() {
currentPlayer = "X";
options = ["", "", "", "", "", "", "", "", ""];
statusText.textContent = `${currentPlayer}'s turn`;
cells.forEach(cell => cell.textContent = "");
winLine.style.width = "0"; // hide line
running = true;
}
