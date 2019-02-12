/* SnakeGame-JS, Web Browser Game for Educational Purposes
    Copyright (C) 2019 Alexander Kravchuk gn0ume@ya.ru
* */

(function () {
    // Constants section
    const GAME_OVER_ALERT_DELAY = 800;
    const KEYS = {
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        stop: 32
    };
    const SIZE = {
        large: 39,
        small: 19
    };
    const DEFAULT_CLASSES = {
        start: 'start',
        stop: 'stop',
    };
    const DEFAULT_IDS = {
        sizeToggle: 'sizeToggle',
        playToggle: 'playToggle',
        scoresField: 'scoresField',
        gameField: 'gameField'
    };
    const RATING_VARIABLE = 'rating';
    const DEFAULT_PLAYER_NAME = 'Player';
    // Here we say to our program how to react on some keys pressing
    document.addEventListener("keydown", (event) => {
        switch (event.which) {
            case KEYS.up:
                SnakeCanvas._onUpTurn();
                break;
            case KEYS.down:
                SnakeCanvas._onDownTurn();
                break;
            case KEYS.left:
                SnakeCanvas._onLeftTurn();
                break;
            case KEYS.right:
                SnakeCanvas._onRightTurn();
                break;
            case KEYS.stop:
                SnakeCanvas._togglePlaying();
                break;
        }
    });

// When you START or _stop the game you fire this function
    document.getElementById(DEFAULT_IDS.playToggle).addEventListener('click', (event) => {
        SnakeCanvas._togglePlaying();
    });

    // Here we EXPORT SnakeCanvas to the Global Object
    window.SnakeCanvas = {
        // private properties
        _playerName: 'Player',
        _playToggleButton : document.getElementById(DEFAULT_IDS.playToggle),
        // private methods
        _onUpTurn: () => {},
        _onDownTurn: () => {},
        _onRightTurn: () => {},
        _onLeftTurn: () => {},
        _disableStopButton: function() {
            this._playToggleButton.classList.remove(DEFAULT_CLASSES.stop);
            this._playToggleButton.classList.add(DEFAULT_CLASSES.start);
            this._playToggleButton.innerHTML = DEFAULT_CLASSES.start;
        },
        _disableStartButton: function() {
            this._playToggleButton.classList.remove(DEFAULT_CLASSES.start);
            this._playToggleButton.classList.add(DEFAULT_CLASSES.stop);
            this._playToggleButton.innerHTML = DEFAULT_CLASSES.stop;
        },
        _stop: function() {
            this._onStop();
            this._disableStopButton();
            this.isPlaying = false;
        },
        _getRatingVariable: function(){
            return RATING_VARIABLE + this._size;
        },
        _lastPlayerName: function(){
            const rating = JSON.parse(localStorage.getItem(this._getRatingVariable()) || JSON.stringify([]));
            if(rating.length > 0){
                return rating[rating.length - 1].name;
            } else {
                return DEFAULT_PLAYER_NAME;
            }
        },
        _start: function() {
            this._onStart();
            this._disableStartButton();
            this.isPlaying = true;
        },
        _recordScore: function(){
            const rv = this._getRatingVariable();
            const arr = JSON.parse(localStorage.getItem(rv))||[];
            if(arr.length === 0){
                localStorage.setItem(rv, JSON.stringify([]));
            }
            const el = arr.find(i=>i.name === this._playerName);
            if(el){
                if(el.score < this._scores){
                    el.score = this._scores;
                }
            } else {
                arr.push({
                    name: this._playerName,
                    score: this._scores
                })
            }
            localStorage.setItem(rv, JSON.stringify(arr));
        },
        _getThreeBestPlayers: function(){
            const arr = JSON.parse(localStorage.getItem(this._getRatingVariable()));
            arr.sort((a,b)=>b.score - a.score);
            return arr.slice(0,3).map((item,key)=>`${key + 1}. ${item.name}: ${item.score}`);
        },
        _setSize: function(size = SIZE.small) {
            this._stop();
            this._size = size;
        },
        _onStop: ()=>{},
        _onStart: ()=>{},
        _scores: 0,
        _size: SIZE.small,
        _togglePlaying: function() {
            if(this.isPlaying) {
                this._stop();
            } else {
                this._start();
            }
        },
        _gameOverSound: () => {new Audio('sounds/oh.mp3').play();},
        //public properties
        cell_types: {
            food: {
                name: 'food',
                dom: '<div class="cell foodCell">&nbsp;</div>'
            },
            body: {
                name: 'body',
                dom: '<div class="cell blackBodyCell">&nbsp;</div>'
            },
            empty: {
                name: 'empty',
                dom: '&nbsp;'
            },
            wall: {
                name: 'wall',
                dom: '<div class="cell wallCell">&nbsp;</div>'
            },
            textureHeadUp: {
                name: 'textureHeadUp',
                dom: '<div class="cell headCell">&nbsp;</div>'
            },
            textureHeadDown: {
                name: 'textureHeadDown',
                dom: '<div class="cell headCell down">&nbsp;</div>'
            },
            textureHeadLeft: {
                name: 'textureHeadLeft',
                dom: '<div class="cell headCell left">&nbsp;</div>'
            },
            textureHeadRight: {
                name: 'textureHeadRight',
                dom: '<div class="cell headCell right">&nbsp;</div>'
            },
            textureBodyUp: {
                name: 'textureBodyUp',
                dom: '<div class="cell bodyCell">&nbsp;</div>'
            },
            textureBodyDown: {
                name: 'textureBodyDown',
                dom: '<div class="cell bodyCell down">&nbsp;</div>'
            },
            textureBodyLeft: {
                name: 'textureBodyLeft',
                dom: '<div class="cell bodyCell left">&nbsp;</div>'
            },
            textureBodyRight: {
                name: 'textureBodyRight',
                dom: '<div class="cell bodyCell right">&nbsp;</div>'
            },
            textureBodyTurnUp: {
                name: 'textureBodyTurnUp',
                dom: '<div class="cell turnCell">&nbsp;</div>'
            },
            textureBodyTurnDown: {
                name: 'textureBodyTurnDown',
                dom: '<div class="cell turnCell down">&nbsp;</div>'
            },
            textureBodyTurnLeft: {
                name: 'textureBodyTurnLeft',
                dom: '<div class="cell turnCell left">&nbsp;</div>'
            },
            textureBodyTurnRight: {
                name: 'textureBodyTurnRight',
                dom: '<div class="cell turnCell right">&nbsp;</div>'
            },
            textureTailUp: {
                name: 'textureTailUp',
                dom: '<div class="cell tailCell">&nbsp;</div>'
            },
            textureTailDown: {
                name: 'textureTailDown',
                dom: '<div class="cell tailCell down">&nbsp;</div>'
            },
            textureTailLeft: {
                name: 'textureTailLeft',
                dom: '<div class="cell tailCell left">&nbsp;</div>'
            },
            textureTailRight: {
                name: 'textureTailRight',
                dom: '<div class="cell tailCell right">&nbsp;</div>'
            }
        },
        isPlaying: false,
        // methods

        onUp: function(callback) {this._onUpTurn = callback},
        onDown: function(callback) {this._onDownTurn = callback},
        onLeft: function(callback) {this._onLeftTurn = callback},
        onRight: function(callback) {this._onRightTurn = callback},
        onStart: function(callback) {this._onStart = callback;},
        onStop: function(callback) {this._onStop = callback},
        setScore: function(scores = 0) {
            this._scores = scores;
            document.getElementById(DEFAULT_IDS.scoresField).innerHTML = scores.toString();
        },

        askPlayerName: function(){
            this._playerName = prompt('Player name', this._lastPlayerName());
            return this._playerName;
        },
        getSize: function(){return this._size},
        draw : function(matrix = [[]]) {
            const htmlContainer = document.getElementById(DEFAULT_IDS.gameField);
            let code = [];
            for(let i = 0; i < matrix.length; i++){
                let line = '';
                for(let j = 0; j < matrix[0].length; j++){
                    line += `<div class="cell" id="cell${i}${j}">${this.cell_types[matrix[i][j].name].dom}</div>`;
                }
                code.push(`<div class="row">${line}</div>`);
            }
            const resultHtml = code.join('');
            htmlContainer.innerHTML = resultHtml;
        },
        turnSound: () => {new Audio('sounds/turn.mp3').play();},
        foodSound: () => {new Audio('sounds/pop.mp3').play();},
        gameOver: function() {
            this._stop();
            this._gameOverSound();
            this._recordScore();
            setTimeout(() => {
                alert(`Game Over. Your Scores: ${this._scores}.\nBest Players:\n${this._getThreeBestPlayers().join('\n')}`);
            }, GAME_OVER_ALERT_DELAY)
        },
        getSnakeSign: function(){
            const cell_types = this.cell_types;
            const emptyLine = new Array(20).fill(cell_types.empty);
            const topOffset = new Array(7).fill(emptyLine);
            const snakeMatrix = [
                [
                    cell_types.textureBodyTurnRight,
                    cell_types.textureBodyRight,
                    cell_types.textureHeadRight,
                    cell_types.empty,
                    cell_types.textureBodyTurnRight,
                    cell_types.textureBodyTurnDown,
                    cell_types.empty,
                    cell_types.textureTailDown,
                    cell_types.empty,
                    cell_types.textureBodyTurnRight,
                    cell_types.textureBodyRight,
                    cell_types.textureBodyTurnDown,
                    cell_types.empty,
                    cell_types.textureHeadUp,
                    cell_types.empty,
                    cell_types.textureTailDown,
                    cell_types.empty,
                    cell_types.textureBodyTurnRight,
                    cell_types.textureBodyRight,
                    cell_types.textureTailLeft
                ],
                [
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.empty,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.textureBodyTurnRight,
                    cell_types.textureBodyTurnLeft,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.empty
                ],
                [
                    cell_types.textureBodyTurnUp,
                    cell_types.textureBodyRight,
                    cell_types.textureBodyTurnDown,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.textureBodyTurnUp,
                    cell_types.textureBodyTurnDown,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.food,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.textureBodyTurnUp,
                    cell_types.textureBodyTurnDown,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.food,
                    cell_types.empty
                ],
                [
                    cell_types.empty,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.textureBodyUp,
                    cell_types.empty,
                    cell_types.empty,
                ],
                [
                    cell_types.textureTailRight,
                    cell_types.textureBodyRight,
                    cell_types.textureBodyTurnLeft,
                    cell_types.empty,
                    cell_types.textureHeadDown,
                    cell_types.empty,
                    cell_types.textureBodyTurnUp,
                    cell_types.textureBodyTurnLeft,
                    cell_types.empty,
                    cell_types.textureHeadDown,
                    cell_types.empty,
                    cell_types.textureTailUp,
                    cell_types.empty,
                    cell_types.textureTailUp,
                    cell_types.empty,
                    cell_types.textureHeadDown,
                    cell_types.empty,
                    cell_types.textureBodyTurnUp,
                    cell_types.textureBodyRight,
                    cell_types.textureHeadRight
                ]
            ];
            return topOffset.concat(snakeMatrix);
        }
    };
})();