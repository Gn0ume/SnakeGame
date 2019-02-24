// constants block
const FIELD_SIZE = SnakeCanvas.getSize();
const DEFAULT_TICK = 300;
// variables block
let tick;
let intervalID;
let matrix;

drawLogo();

function drawLogo(){
    SnakeCanvas.draw(SnakeCanvas.getSnakeSign());
}

// functions block
SnakeCanvas.onStart(()=>{
    matrix = createFieldMatrix();
    tick = DEFAULT_TICK;
    const currentHeadPosition = initialPosition();
    console.log(`Head position is: x ${currentHeadPosition.x}, y ${currentHeadPosition.y}`)
    matrix[currentHeadPosition.x][currentHeadPosition.y] = SnakeCanvas.cell_types.body;
    SnakeCanvas.draw(matrix);
    beginTicks();
});


SnakeCanvas.onStop(()=>{
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
        next_step();
    }, tick);
}


function next_step() {
    console.log('Step');
}