// constants block
const FIELD_SIZE = SnakeCanvas.getSize();
const DEFAULT_TICK = 300;
const STEPS_QUEUE_DEEPNESS = 2;
const SNAKE_DIRECTIONS = {
    up: 'up',
    down: 'down',
    right: 'right',
    left: 'left',
    horizontal: function () {
        return [this.left, this.right]
    },
    vertical: function () {
        return [this.up, this.down]
    }
};
const TICK_INTERVAL = 10;
const WALL_LENGTH = 5;
const FATAL_CELLS = [
    SnakeCanvas.cell_types.wall,
    SnakeCanvas.cell_types.body,
    SnakeCanvas.cell_types.textureBodyUp,
    SnakeCanvas.cell_types.textureBodyDown,
    SnakeCanvas.cell_types.textureBodyRight,
    SnakeCanvas.cell_types.textureBodyLeft,
    SnakeCanvas.cell_types.textureHeadUp,
    SnakeCanvas.cell_types.textureHeadDown,
    SnakeCanvas.cell_types.textureHeadRight,
    SnakeCanvas.cell_types.textureHeadLeft,
    SnakeCanvas.cell_types.textureTailUp,
    SnakeCanvas.cell_types.textureTailDown,
    SnakeCanvas.cell_types.textureTailRight,
    SnakeCanvas.cell_types.textureTailLeft,
    SnakeCanvas.cell_types.textureBodyTurnUp,
    SnakeCanvas.cell_types.textureBodyTurnDown,
    SnakeCanvas.cell_types.textureBodyTurnRight,
    SnakeCanvas.cell_types.textureBodyTurnLeft,
];

// variables block
let tick;
let intervalID;
let matrix;
let bodyQueue;
let stepsQueue;
let currentDirection;
let scores;

drawLogo();

function drawLogo() {
    SnakeCanvas.draw(SnakeCanvas.getSnakeSign());
}

// functions block
SnakeCanvas.onStart(() => {
    if (SnakeCanvas.askPlayerName() === null) return false;
    scores = 0;
    SnakeCanvas.setScore(++scores);
    matrix = createFieldMatrix();
    drawCornerWalls();
    eraseBodyQueue();
    eraseStepsQueue();
    tick = DEFAULT_TICK;
    currentDirection = SNAKE_DIRECTIONS.right;
    const currentHeadPosition = initialPosition();
    let currentTailPosition = {...currentHeadPosition};
    currentTailPosition.x--;
    bodyQueue.push(currentTailPosition);
    bodyQueue.push(currentHeadPosition);
    generateFood();
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
    const nextCell = goToNextCell();
    if (nextCell === SnakeCanvas.cell_types.food) {
        SnakeCanvas.setScore(++scores);
        stopTicks();
        tick -= TICK_INTERVAL * scores / 100;
        beginTicks();
        generateFood();
    } else {
        cutTail();
    }
    if (FATAL_CELLS.find(val => val.name === nextCell.name)) {
        SnakeCanvas.gameOver();
        return false;
    }
    textureBody();
    SnakeCanvas.draw(matrix);
}

function goToNextCell() {
    if (stepsQueue.length > 0) {
        turnTo(stepsQueue.shift());
    }
    const currentHeadPosition = {...bodyQueue[bodyQueue.length - 1]};
    switch (currentDirection) {
        case SNAKE_DIRECTIONS.up:
            currentHeadPosition.x--;
            break;
        case SNAKE_DIRECTIONS.down:
            currentHeadPosition.x++;
            break;
        case SNAKE_DIRECTIONS.right:
            currentHeadPosition.y++;
            break;
        case SNAKE_DIRECTIONS.left:
            currentHeadPosition.y--;
            break;
    }
    normalizeCoordinates(currentHeadPosition);
    const nextCell = matrix[currentHeadPosition.x][currentHeadPosition.y];
    currentHeadPosition.direction = currentDirection;
    bodyQueue.push(currentHeadPosition);
    const previousHeadPosition = bodyQueue[bodyQueue.length - 2];
    previousHeadPosition.direction = currentDirection;
    return nextCell;
}

function eraseBodyQueue() {
    bodyQueue = [];
}

function normalizeCoordinates(coordinates) {
    coordinates.x = coordinates.x > FIELD_SIZE ? 0 : coordinates.x;
    coordinates.x = coordinates.x < 0 ? FIELD_SIZE : coordinates.x;
    coordinates.y = coordinates.y > FIELD_SIZE ? 0 : coordinates.y;
    coordinates.y = coordinates.y < 0 ? FIELD_SIZE : coordinates.y;
}

function getLastDirection() {
    if (stepsQueue.length === 0) {
        return currentDirection;
    } else {
        return stepsQueue[stepsQueue.length - 1];
    }
}

SnakeCanvas.onUp(() => {
    if (!SNAKE_DIRECTIONS.vertical().includes(getLastDirection())) {
        pushToLimit(stepsQueue, SNAKE_DIRECTIONS.up);
    }
});

SnakeCanvas.onDown(() => {
    if (!SNAKE_DIRECTIONS.vertical().includes(getLastDirection())) {
        pushToLimit(stepsQueue, SNAKE_DIRECTIONS.down);
    }
});

SnakeCanvas.onRight(() => {
    if (!SNAKE_DIRECTIONS.horizontal().includes(getLastDirection())) {
        pushToLimit(stepsQueue, SNAKE_DIRECTIONS.right);
    }
});

SnakeCanvas.onLeft(() => {
    if (!SNAKE_DIRECTIONS.horizontal().includes(getLastDirection())) {
        pushToLimit(stepsQueue, SNAKE_DIRECTIONS.left);
    }
});

function pushToLimit(queue, item, limit = STEPS_QUEUE_DEEPNESS) {
    if (queue.length <= limit) {
        queue.push(item);
    }
}

function eraseStepsQueue() {
    stepsQueue = [];
}

function turnTo(direction) {
    currentDirection = direction;
    SnakeCanvas.turnSound();
}

const generateFood = function () {
    const coordinates = {
        x: 0,
        y: 0
    };
    do {
        coordinates.x = randomInteger(0, FIELD_SIZE);
        coordinates.y = randomInteger(0, FIELD_SIZE);
    } while (FATAL_CELLS.find(val => val.name === matrix[coordinates.x][coordinates.y].name));
    matrix[coordinates.x][coordinates.y] = SnakeCanvas.cell_types.food;
    SnakeCanvas.foodSound();
};

const randomInteger = (min = 0, max = 10) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

function cutTail() {
    const tail = bodyQueue[0];
    matrix[tail.x][tail.y] = SnakeCanvas.cell_types.empty;
    bodyQueue.shift();
}

function drawCornerWalls() {
    for (let i = 0; i < WALL_LENGTH; i++) {
        matrix[0][i] = SnakeCanvas.cell_types.wall;
        matrix[FIELD_SIZE][i] = SnakeCanvas.cell_types.wall;
        matrix[0][FIELD_SIZE - i] = SnakeCanvas.cell_types.wall;
        matrix[FIELD_SIZE][FIELD_SIZE - i] = SnakeCanvas.cell_types.wall;
        matrix[i][0] = SnakeCanvas.cell_types.wall;
        matrix[i][FIELD_SIZE] = SnakeCanvas.cell_types.wall;
        matrix[FIELD_SIZE - i][0] = SnakeCanvas.cell_types.wall;
        matrix[FIELD_SIZE - i][FIELD_SIZE] = SnakeCanvas.cell_types.wall;
    }
}

function textureBody() {
    // draw tail
    const tail = bodyQueue[0];
    const tailDirections = {
        up: SnakeCanvas.cell_types.textureTailUp,
        down: SnakeCanvas.cell_types.textureTailDown,
        right: SnakeCanvas.cell_types.textureTailRight,
        left: SnakeCanvas.cell_types.textureTailLeft,
    };
    matrix[tail.x][tail.y] = tailDirections[tail.direction];
    // draw head
    const head = bodyQueue[bodyQueue.length - 1];
    const headDirections = {
        up: SnakeCanvas.cell_types.textureHeadUp,
        down: SnakeCanvas.cell_types.textureHeadDown,
        right: SnakeCanvas.cell_types.textureHeadRight,
        left: SnakeCanvas.cell_types.textureHeadLeft,
    };
    matrix[head.x][head.y] = headDirections[head.direction];
    // draw body
    const bodyDirections = {
        up: SnakeCanvas.cell_types.textureBodyUp,
        down: SnakeCanvas.cell_types.textureBodyDown,
        right: SnakeCanvas.cell_types.textureBodyRight,
        left: SnakeCanvas.cell_types.textureBodyLeft,
    };
    for (let i = 1; i < bodyQueue.length - 1; i++) {
        const chunk = bodyQueue[i];
        const prechunk = bodyQueue[i - 1];
        const postchunk = bodyQueue[i + 1];
        let chunkDirection;
        if (prechunk.x === postchunk.x || prechunk.y === postchunk.y) {
            // for straight parts of body
            chunkDirection = bodyDirections[chunk.direction];
        } else {
            // for bended parts
            const turnMap = {
                up: {
                    right: SnakeCanvas.cell_types.textureBodyTurnRight,
                    left: SnakeCanvas.cell_types.textureBodyTurnDown,
                },
                down: {
                    left: SnakeCanvas.cell_types.textureBodyTurnLeft,
                    right: SnakeCanvas.cell_types.textureBodyTurnUp
                },
                left: {
                    up: SnakeCanvas.cell_types.textureBodyTurnUp,
                    down: SnakeCanvas.cell_types.textureBodyTurnRight
                },
                right: {
                    up: SnakeCanvas.cell_types.textureBodyTurnLeft,
                    down: SnakeCanvas.cell_types.textureBodyTurnDown
                }
            };
            chunkDirection = turnMap[prechunk.direction][chunk.direction];
        }
        matrix[chunk.x][chunk.y] = chunkDirection;
    }
}