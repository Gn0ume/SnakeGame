// constants block
const FIELD_SIZE = SnakeCanvas.getSize();
const DEFAULT_TICK = 300;
// variables block
let tick;
let intervalID;
let matrix;
let bodyQueue;

drawLogo();

function drawLogo() {
    SnakeCanvas.draw(SnakeCanvas.getSnakeSign());
}

// functions block
SnakeCanvas.onStart(() => {
    matrix = createFieldMatrix();
    eraseBodyQueue();
    tick = DEFAULT_TICK;
    const currentHeadPosition = initialPosition();
    bodyQueue.push(currentHeadPosition);
    beginTicks();
});


SnakeCanvas.onStop(() => {
    drawLogo();
    stopTicks();
});

function stopTicks() {
    // clear timer
    clearInterval(intervalID);
}

function createFieldMatrix() {
    const matrix = [];
    for (let i = 0; i <= FIELD_SIZE; i++) {
        const row = [];
        for (let j = 0; j <= FIELD_SIZE; j++) {
            row.push(SnakeCanvas.cell_types.empty);
        }
        matrix.push(row);
    }
    return matrix;
}

function initialPosition() {
    const center = Math.floor((FIELD_SIZE) / 2);
    return {
        x: center,
        y: center
    };
}

function beginTicks() {
    // initiate timer
    intervalID = setInterval(() => {
        nextStep();
    }, tick);
}


function nextStep() {
    goToNextCell();
    drawBody();
    SnakeCanvas.draw(matrix);
}

function goToNextCell() {
    const currentHeadPosition = {...bodyQueue[bodyQueue.length - 1]};
    currentHeadPosition.y++;
    bodyQueue.push(currentHeadPosition);
}

function eraseBodyQueue() {
    bodyQueue = [];
}

function drawBody() {
    bodyQueue.map(chunk => {
        matrix[chunk.x][chunk.y] = SnakeCanvas.cell_types.body;
    })
}