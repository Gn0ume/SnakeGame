SnakeCanvas.onStart(()=>{
    console.log('Game Started');
});

SnakeCanvas.onStop(()=>{
    console.log('Game Stopped');
});

SnakeCanvas.onRight(()=>{
    alert('Turn to the right');
});

SnakeCanvas.onLeft(()=>{
    alert('Turn to the left');
});

SnakeCanvas.onDown(()=>{
    alert('Turn to down');
});

SnakeCanvas.onUp(()=>{
    alert('Turn to up');
});

console.log(SnakeCanvas.getSnakeSign());

SnakeCanvas.draw(SnakeCanvas.getSnakeSign());