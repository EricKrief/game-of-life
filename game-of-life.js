let board = [];
let tdReferences = [];
let liveCells = 0;
let table = document.createElement('table');
let interval = null;
let firstGame = true;
let pause = false;
let toggleGreen = false;
let random = false;
let choseRadioButton = false;
let started = false;
let numberOfRows = 0;
let numberOfColumns = 0;

function createBoard() {

    for (let row = 0; row < numberOfRows; row++) {
        let tr = document.createElement('tr');
        let singleBoardRow = [];
        let singleTdRow = [];

        for (let col = 0; col < numberOfColumns; col++) {
            let td = document.createElement('td');
            td.row = row;
            td.col = col;
            td.addEventListener("click", clickTd);
            singleBoardRow.push(0);
            singleTdRow.push(td);
            tr.appendChild(td);
        }

        board.push(singleBoardRow);
        tdReferences.push(singleTdRow);
        table.appendChild(tr);
    }
    table.border = "1px solid black";
    document.body.appendChild(table);
}

function clickTd(event) {
    if (event.target.bgColor === "black") {
        event.target.bgColor = "white";
        board[event.target.row][event.target.col] = 0;
    }

    else {
        event.target.bgColor = "black";
        board[event.target.row][event.target.col] = 1;
    }


}


function initializeBoard() { //randomly choose 10% of cells to start off alive

    deleteBoard();
    let counter = 0;
    while (counter < (numberOfRows * numberOfColumns * 0.1)) {
        let rowNum = Math.floor(Math.random() * numberOfRows);
        let colNum = Math.floor(Math.random() * numberOfColumns);
        if (board[rowNum][colNum] !== 1) {
            board[rowNum][colNum] = 1;
            counter++;
        }
    }
}

function deleteBoard() {
    for (let row = 0; row < board.length; row++) {

        for (let col = 0; col < board[0].length; col++) {

            board[row][col] = 0;
            tdReferences[row][col].bgColor = "white";
        }
    }
}

function radio(event) {

    choseRadioButton = true;
    if (event.value === "choose") {
        random = false;
    }
    else {
        random = true;
    }


}

function start() {

    if (!choseRadioButton) {
        alert("You must select Random / Choose Cells");
    }
    else {
        started = true;
        let buttons = document.querySelectorAll("button");
        let radioButtons = document.querySelectorAll(".radio");
        buttons[0].disabled = false;
        buttons[1].disabled = false;
        radioButtons[0].disabled = true;
        radioButtons[1].disabled = true;
        radioButtons[0].checked = false;

        if (random) {
            initializeBoard();
        }
        play();
    }

}

function draw() {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {
            if (board[row][col] === 1) {
                tdReferences[row][col].bgColor = "black";
            }
            else {
                tdReferences[row][col].bgColor = "white";
            }
        }
    }
}

function calculateNextGeneration() {

    let neighboursMatrix = countNeighbours();

    liveCells = 0;
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[0].length; col++) {

            if (tdReferences[row][col].bgColor === "black") {
                if (neighboursMatrix[row][col] < 2 || neighboursMatrix[row][col] > 3) {
                    board[row][col] = 0;
                }

                else {
                    liveCells++;
                }

            }

            if (tdReferences[row][col].bgColor === "white" && neighboursMatrix[row][col] === 3) {
                board[row][col] = 1;
                liveCells++;
            }

        }
    }

    document.querySelector(".header-span-num").innerHTML = liveCells;
}


function countNeighbours() {
    let neighboursMatrix = [];
    for (let row = 0; row < tdReferences.length; row++) {
        let singleRowNeibours = [];
        for (let col = 0; col < tdReferences[0].length; col++) {

            let counter = 0;

            if (row > 0 && col > 0) {
                if (tdReferences[row - 1][col - 1].bgColor === "black") //top left corner
                    counter++;
            }

            if (row > 0) {
                if (tdReferences[row - 1][col].bgColor === "black") //above
                    counter++;
            }

            if (row > 0 && col < board[0].length - 1) {  //top right corner
                if (tdReferences[row - 1][col + 1].bgColor === "black")
                    counter++;
            }

            if (col < board[0].length - 1) {
                if (tdReferences[row][col + 1].bgColor === "black") //right side
                    counter++;
            }

            if (row < board.length - 1 && col < board[0].length - 1) { //bottom right corner
                if (tdReferences[row + 1][col + 1].bgColor === "black")
                    counter++;
            }

            if (row < board.length - 1) {
                if (tdReferences[row + 1][col].bgColor === "black") //under
                    counter++;
            }

            if (row < board.length - 1 && col > 0) {
                if (tdReferences[row + 1][col - 1].bgColor === "black") //bottom left corner
                    counter++;
            }

            if (col > 0) {
                if (tdReferences[row][col - 1].bgColor === "black")// left side
                    counter++;
            }
            singleRowNeibours.push(counter);
        }
        neighboursMatrix.push(singleRowNeibours);
    }
    return neighboursMatrix;
}

function play() {

    if (!pause && random) {
        initializeBoard();
    }
    draw();
    interval = setInterval(function () { tick(); }, 100);
}

function tick() {
    calculateNextGeneration();
    draw();
}

function handleDimensions() {
    let dimensions = document.querySelectorAll(".dimensions");
    if (dimensions[0].value.length !== 0 & dimensions[1].value.length !== 0) {
        if (dimensions[0].value < 10 || dimensions[0].value > 80 || dimensions[1].value < 10 || dimensions[1].value > 160 || dimensions[0].value === null || dimensions[1].value === null) {
            alert("Minimum dimensions 10x10" + "\n" + "Maximum dimensions 80x160");
            return;
        }
        numberOfRows = dimensions[0].value;
        numberOfColumns = dimensions[1].value;
        createBoard();

    }


}

function newGame() {
    let dimensions = document.querySelectorAll(".dimensions");
    dimensions[0].value = 0;
    dimensions[1].value = 0;
    document.querySelector("table").parentNode.removeChild(document.querySelector("table"));
    document.querySelector(".header-button-pause").innerHTML = "Pause";
    document.querySelector(".header-button-pause").bgColor = "red";
    let buttons = document.querySelectorAll("button");
    let radioButtons = document.querySelectorAll(".radio");
    buttons[0].disabled = true;
    buttons[1].disabled = true;
    radioButtons[0].disabled = false;
    radioButtons[0].checked = false;
    radioButtons[1].disabled = false;
    radioButtons[1].checked = false;
    choseRadioButton = false;
    clearInterval(interval);
    deleteBoard();
    if (toggleGreen) {
        document.querySelector(".header-button-pause").classList.toggle("green");
        toggleGreen = false;
        pause = false;
    }
}

function togglePause() {
    if (pause) {
        document.querySelector(".header-button-pause").innerHTML = "Pause";
        document.querySelector(".header-button-pause").classList.toggle("green");
        play();
        pause = false;
        toggleGreen = false;
    }

    else {
        document.querySelector(".header-button-pause").innerHTML = "Resume";
        document.querySelector(".header-button-pause").classList.toggle("green");
        pause = true;
        toggleGreen = true;
        clearInterval(interval);
    }


}



