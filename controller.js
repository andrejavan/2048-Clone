import Game from "./engine/game.js";

Game.prototype.render = function () {
    return renderGameState(this.getGameState())
  }

const handleKeyPress = function(event){
    event.preventDefault();
    switch(event.keyCode){
        case 40:
        case 83:
            game.move("down");
            break;
        case 38:
        case 87:
            game.move("up");
            break;
        case 37:
        case 65:
            game.move("left");
            break;
        case 39:
        case 68:
            game.move("right");
            break;
        default:
            break;
    }
}

const handleNewGame = function(){
    $("button").on("click", function(){
        game.setupNewGame();
        document.getElementById('table').replaceWith(game.render());
        document.getElementById('noti').replaceWith(noWin());
        document.getElementById("scoreboard").replaceWith(newScore(gameState));
    });
}

const moveListener = function(gameState){
    document.getElementById('table').replaceWith(game.render());
    document.getElementById("scoreboard").replaceWith(newScore(gameState));
}

const winListener = function(gameState){
    document.getElementById('noti').replaceWith(won(gameState));
}

const loseListener = function(gameState){
    document.getElementById('noti').replaceWith(lose(gameState));
}

function renderGameState(gameState){
    const tbody = document.createElement('table');
    tbody.class="table"
    tbody.id = "table"
    let l = Math.sqrt(gameState.board.length);
    for (let i = 0; i < l; i++) {
      const tr = document.createElement('tr');
      tbody.appendChild(tr);
      for (let j = 0; j < l; j++) {
        const val = gameState.board[i*l+j];
        const td = document.createElement('td');
        if(val>0){
            td.style.backgroundColor = `rgb(255,${255-10*Math.log2(val)},${255-30*Math.log2(val)})`;
            td.innerText = val;
        }
        else{
            td.style.backgroundColor = `#1b047c`;
        }
        
        tr.appendChild(td);
      }
    }
    return tbody;
}

function newScore(gameState){
    const score = document.createElement('p');
    score.id = "scoreboard";
    score.textContent = "Score: " + gameState.score;
    return score;
}


function won(gameState){
    const won = document.createElement('h2');
    won.id = "noti"
    won.innerHTML = `<strong>You win! Continue playing or start a new game</strong>`;
    return won;
};

function noWin(){
    const notwon = document.createElement('div');
    notwon.id = "noti"
    return notwon;
}

function lose(gameState){
    const loss = document.createElement('h2');
    loss.id = "noti"
    loss.innerHTML = `<strong>You suck. Get good maybe???>??//??? ${gameState.score}</strong>`
    return loss;
};


//create game
let game = new Game(20);
//awaken event listeners and handlers
$(document).on('keydown', handleKeyPress);
game.onMove(moveListener);
game.onWin(winListener);
game.onLose(loseListener);
$(handleNewGame)
//show scoreboard and game
document.getElementById("scoreboard").replaceWith(newScore(game.getGameState()));
document.getElementById('table').replaceWith(game.render());

while(!game.over && !game.wom){
    game.moveBot();
}