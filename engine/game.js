export default function Game(size){
    this.board = makeBoard(size);
    this.score = 0;
    this.won = false;
    this.over = false;

    this.moveListeners = [];
    this.loseListeners = [];
    this.winListeners = [];
}

Game.prototype.getGameState = function(){
    return {
        board: this.board,
        score: this.score,
        won: this.won,
        over: this.over
    };
}

Game.prototype.setupNewGame = function(){
    this.board = makeBoard(Math.sqrt(this.board.length));
    this.score = 0;
    this.won = false;
    this.over = false;
}

Game.prototype.loadGame = function(gameState){
    this.board = gameState.board;
    this.score = gameState.score;
    this.won = gameState.won;
    this.over = gameState.over;
}
Game.prototype.onMove = function(callback){
    this.moveListeners.push(callback);
}

Game.prototype.onWin = function(callback){
    this.winListeners.push(callback);
}

Game.prototype.onLose = function(callback){
    this.loseListeners.push(callback);
}

function makeBoard(size){
    if(size < 2){
        alert("bad size");
        return;
    }
    let board = [];
    for(let i = 0; i < size*size; i++){
        board[i] = 0;
    }
    addTile(board);
    addTile(board);
    return board;
}

function addTile(board){
    let randx = Math.floor(Math.random()*board.length);
    if(board[randx] == 0){
        board[randx] = (Math.random()<.9) ? 2 : 4;
    }
    else{
        addTile(board);
    }
}

function printBoard(board){
    let b = ""
    let l = Math.sqrt(board.length)
    for(let i = 0; i<l; i++){
        for(let j = 0; j<l; j++){
            b=b.concat(`[${board[i*l+j] !=0 ? board[i*l+j] : ' '}] `);
        }
        b=b.concat('\n');
    }
    console.log(b);
}


Game.prototype.moveDown = function(){
    let l = Math.sqrt(this.board.length)
    let changed = 0;
    for(let j = 0; j < l; j++){
        for(let i = l-2; i >= 0; i--){
            //collapse
            while(this.board[(i+1)*l+j]==0 && this.board[i*l+j]!=0){
                this.board[(i+1)*l+j] = this.board[i*l+j];
                this.board[i*l+j] = 0;
                i++;
                changed = 1;
            }
        }
        for(let i = l; i > 0; i--){
            //merge
            if(this.board[i*l+j]==this.board[(i-1)*l+j] && this.board[i*l+j]!=0){
                this.board[i*l+j] += this.board[(i-1)*l+j];
                this.board[(i-1)*l+j] = 0;
                this.score += this.board[i*l+j];
                if(this.board[i*l+j]==2048){
                    this.won = true;
                }
                changed = 1;
                i--;
            }
        }
        for(let i = l-2; i >= 0; i--){
            //collapse
            while(this.board[(i+1)*l+j]==0 && this.board[i*l+j]!=0){
                this.board[(i+1)*l+j] = this.board[i*l+j];
                this.board[i*l+j] = 0;
                i++;
            }
        }
    }
    return changed;
}

Game.prototype.moveUp = function(){
    let l = Math.sqrt(this.board.length)
    let changed = 0;
    for(let j = 0; j < l; j++){
        for(let i = 1; i < l; i++){
            //collapse
            while(this.board[(i-1)*l+j]==0 && this.board[i*l+j]!=0){
                this.board[(i-1)*l+j] = this.board[i*l+j];
                this.board[i*l+j] = 0;
                i--;
                changed = 1;
            }
        }
        for(let i = 0; i < l-1; i++){
            //merge
            if(this.board[i*l+j]==this.board[(i+1)*l+j] && this.board[i*l+j]!=0){
                this.board[i*l+j] += this.board[(i+1)*l+j];
                this.board[(i+1)*l+j] = 0;
                this.score += this.board[i*l+j];
                if(this.board[i*l+j]==2048){
                    this.won = true;
                }
                changed = 1;
                i++;
            }
        }
        for(let i = 1; i < l; i++){
            //collapse
            while(this.board[(i-1)*l+j]==0 && this.board[i*l+j]!=0){
                this.board[(i-1)*l+j] = this.board[i*l+j];
                this.board[i*l+j] = 0;
                i--;
            }
        }
    }
    return changed;
}

Game.prototype.moveLeft = function(){
    let l = Math.sqrt(this.board.length)
    let changed = 0;
    for(let i = 0; i < l; i++){
        for(let j = 1; j < l; j++){
            //collapse
            if(this.board[i*l+j]!=0 && this.board[i*l+j-1]==0){
                let k = 1;
                //probe left for zeroes
                while(this.board[i*l+j-k]==0 && j-k >= 0){
                    k++;
                    changed = 1;
                }
                //j-(k-1) is farthest zero
                this.board[i*l+j-k+1] = this.board[i*l+j];
                this.board[i*l+j] = 0;
            }
        }
        for(let j = 0; j < l-1; j++){
            //merge
            if(this.board[i*l+j]==this.board[i*l+j+1] && this.board[i*l+j]!=0){
                this.board[i*l+j] += this.board[i*l+j+1];
                this.board[i*l+j+1] = 0;
                this.score += this.board[i*l+j];
                if(this.board[i*l+j]==2048){
                    this.won = true;
                }
                changed = 1;
                j++;
            }
        }
        for(let j = 1; j < l; j++){
            //collapse
            if(this.board[i*l+j]!=0 && this.board[i*l+j-1]==0){
                let k = 1;
                //probe left for zeroes
                while(this.board[i*l+j-k]==0 && j-k >= 0){
                    k++;
                }
                //j-(k-1) is farthest zero
                this.board[i*l+j-k+1] = this.board[i*l+j];
                this.board[i*l+j] = 0;
            }
        }
    }
    return changed;
}

Game.prototype.moveRight = function(){
    let l = Math.sqrt(this.board.length)
    let changed = 0;
    for(let i = 0; i < l; i++){
        for(let j = l-2; j >= 0; j--){
            //collapse
            if(this.board[i*l+j]!=0 && this.board[i*l+j+1]==0){
                let k = 1;
                //probe right for zeroes
                while(this.board[i*l+j+k]==0 && j+k < l){
                    k++;
                    changed = 1;
                }
                //j+(k-1) is farthest zero
                this.board[i*l+j+k-1] = this.board[i*l+j];
                this.board[i*l+j] = 0;
            }
        }
        for(let j = l-1; j > 0; j--){
            //merge
            if(this.board[i*l+j]==this.board[i*l+j-1] && this.board[i*l+j]!=0){
                this.board[i*l+j] += this.board[i*l+j-1];
                this.board[i*l+j-1] = 0;
                this.score += this.board[i*l+j];
                if(this.board[i*l+j]==2048){
                    this.won = true;
                }
                changed = 1;
                j--;
            }
        }
        for(let j = l-2; j >= 0; j--){
            //collapse
            if(this.board[i*l+j]!=0 && this.board[i*l+j+1]==0){
                let k = 1;
                //probe right for zeroes
                while(this.board[i*l+j+k]==0 && j+k < l){
                    k++;
                }
                //j+(k-1) is farthest zero
                this.board[i*l+j+k-1] = this.board[i*l+j];
                this.board[i*l+j] = 0;
            }
        }
    }
    return changed;
}
Game.prototype.move = function(direction){
    let r = 0;
    switch(direction){
        case "down":
            if(this.moveDown()){
                addTile(this.board);
                r = 1;
            }
            break;
        case "up":
            if(this.moveUp()){
                addTile(this.board);
                r = 1;
            }
            break;
        case "left":
            if(this.moveLeft()){
                addTile(this.board);
                r = 1;
            }
            break;
        case "right":
            if(this.moveRight()){
                addTile(this.board);
                r = 1;
            }
            break;
        default:
            break;
    }
    for(let i = 0; i < this.moveListeners.length; i++){
        this.moveListeners[i](this.getGameState());
    }
    if(this.won){
        for(let i = 0; i < this.winListeners.length; i++){
            this.winListeners[i](this.getGameState());
        }
    }
    this.over = checkloss(this.board);
    if(this.over){
        for(let i = 0; i < this.loseListeners.length; i++){
            this.loseListeners[i](this.getGameState());
        }
    }
    return r;
}

Game.prototype.toString = function(){
    console.log("Score: " + this.score);
    printBoard(this.board);
}
function checkloss(board){
    let l = Math.sqrt(board.length)
    for(let i=0; i<l;i++){
        for(let j=0; j<l;j++){
            if(board[i*l+j] === 0
                || (board[i*l+j]==board[i*l+j+1] && j+1 < l)
                || (board[i*l+j]==board[i*l+j-1] && j-1 >= 0)
                || board[i*l+j]==board[(i+1)*l+j]
                || board[i*l+j]==board[(i-1)*l+j]
                )
                return false;
        }
    }
    return true;
}
Game.prototype.moveBot = function(){
    if(this.move("down")){
        console.log("down");
        this.toString();
    }
    else if(this.move("right")){
        console.log("right");
        this.toString();
    }
    else if(this.move("left")){
        console.log("left");
        this.toString();
    }
    else if(this.move("up")){
        console.log("up");
        this.toString();
    }
    else return 0;
    return 1;
}