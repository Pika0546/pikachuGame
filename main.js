let BoardWidth = 14;
let BoardHeight = 12;
let ColCell = BoardWidth -  2;
let RowCell = BoardHeight - 2;
let CellSize = 45;
let cellNum = ColCell * RowCell;
let TypeNum = 20;
let NumEachType = 6;
const gameTime = 300;

let board = document.getElementById("game-board");
let myCanvas = "";
let ctx = '';
let checkTypeNum = [];
let cells = [];
let gameScore = 0;
let isSelecting = 0;
let timeLeft = 10;
let isWin = false;

window.addEventListener("dblclick", (event)=>{
    event.preventDefault();
})

for(let i = 0 ; i <= TypeNum; i ++){
    checkTypeNum.push(0);
}




function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
  }

function min(a,b) {
    return (a < b) ? a : b;
}

function max(a, b) {
    return (a > b)? a : b;
}

function drawLineFromXtoY(x1,y1, x2,y2, ctx){
  
    ctx.lineWidth = 5;
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
}

function createRanDomValueForCell() {
    let t = Math.floor(Math.random()*TypeNum) + 1;
    while(checkTypeNum[t] >= NumEachType){
        t = Math.floor(Math.random()*TypeNum) + 1;
    }
    checkTypeNum[t]+=1;
    return t;
}

function cell(t_id, t_value, t_x, t_y){
    this.x = t_x;
    this.y = t_y;
    this.width = CellSize;
    this.height = CellSize;
    this.centerX = (this.x) + (this.width)/2;
    this.centerY = (this.y) + (this.height)/2;
    this.id = t_id;
    this.value = t_value;
    this.isSelected = false;
    this.image = document.createElement("div");
    this.image.setAttribute("class", "cell");
    this.image.setAttribute("id",this.id + "");
    this.draw = function () {
        if(this.value !== 0)
            this.image.innerHTML =  '<img src="image/pic' + this.value +  '.png" alt="">';
        else{
            if(this.id > BoardWidth && this.id <= BoardWidth*BoardHeight - BoardWidth && this.id%BoardWidth != 0 && (this.id + 1)%BoardWidth != 0){
                this.image.style.border = "1px solid rgb(242, 142, 255)";
            }
            else
                this.image.style.border = "none";
            this.image.style.cursor = "auto";
            this.image.innerHTML = "";
            this.image.style.backgroundColor = "rgba(255, 255, 255, 0)";
        }
        board.appendChild(this.image);
    }
}


function swapCell() {
    for(let i = 0 ; i < cells.length; i ++){
        if(cells[i].value !==0){
            let t_index = getRndInteger(0,cells.length - 1);
            while(cells[t_index].value == 0){
                t_index = getRndInteger(0,cells.length - 1);
            }
            let t = cells[i].value;
            cells[i].value = cells[t_index].value;
            cells[t_index].value = t;
        }
    }
    game();
}

function handleClick(e) {
    if(this.className.indexOf(" onSelect") != -1){
        this.className = this.className.replace(" onSelect", "");
        isSelecting = 0;                   
    }else{
        isSelecting ++;
        this.className += " onSelect";
    }
    game();
}

function addEventForCell() {
    for(let id = BoardWidth; id < BoardWidth*BoardHeight - BoardWidth; id ++){
        if(id%BoardWidth == 0 || (id + 1)%BoardWidth == 0 || cells[id].value == 0){
            if(cells[id].value == 0){
                cells[id].image.removeEventListener("click",handleClick);
                   
            }
        }else 
            if(cells[id].value != 0){
                cells[id].image.addEventListener("click",handleClick);
          
        }
    }
}

function init() {
    gameScore = 0;
    isSelecting = 0;
    timeLeft = gameTime;
    board.innerHTML = " <canvas id='myCanvas' width='630' height='540'></canvas>";
    isWin = false;
    myCanvas = document.getElementById("myCanvas");
    ctx = myCanvas.getContext("2d");
    for(let i = 0 ; i <= TypeNum; i ++){
        checkTypeNum[i] = 0;
    }
    cells.splice(0,cells.length);
    let temp = "";
    for(let i = 0 ; i < BoardWidth; i ++){
        temp += CellSize + "px ";
    }
    board.style.gridTemplateColumns = temp;
    temp = "";
    for(let i = 0; i < BoardHeight; i++){
        temp += CellSize + "px ";
    }
    board.style.gridTemplateRows = temp;

    for(let i = 0 ; i < BoardHeight; i ++){
        for(let j = 0; j < BoardWidth; j++){
            let t_id = j + i*BoardWidth;
            let t_value = 0;
            if(i == 0 || i == BoardHeight - 1 || j == 0 || j == BoardWidth - 1 ){
                t_value = 0;
            }else{
                t_value = createRanDomValueForCell();
            }
            cells.push(new cell(t_id, t_value, CellSize*(j), CellSize*(i)));
        }
    }
    document.getElementById("game-over").style.display = "none";
    document.getElementById("win-game").style.display = "none";
    document.getElementById("reload").style.display = "none";
    addEventForCell();
    // game();
}


function drawCells() {
    setTimeout(function() {
        ctx.canvas.width = board.clientWidth;
        ctx.canvas.height = board.clientHeight;
        for(let i = 0 ; i < cells.length ; i ++){
            cells[i].draw();
           
        }
        myCanvas.style.zIndex = -1;
      
    }, 300);
    
    
}

function showScore() {
    document.getElementById("score").innerHTML = "Score: " + gameScore;
}

function timeHandle() {
    document.getElementById("time").innerHTML = "Time: "+ timeLeft;
    setInterval(() => {
        if(timeLeft == 0)
            document.getElementById("game-over").style.display = "block";
        document.getElementById("time").innerHTML = "Time: "+ timeLeft;
        if(timeLeft > 0 && isWin == false)
            timeLeft -= 1   ;
        
    }, 1000);
}

/* ================ THUẬT TOÁN CHÍNH =========== */
function checkSelfChosen(id1, id2) {
    if(id1 == id2)
        return false;
    return true;
}

function checkValue(id1, id2) {
    if(cells[id1].value != cells[id2].value){
        return false;
    }
    return true;

}

function checkOneHorizontalLine(id1, id2, drawable) {
    let x1 = id1%BoardWidth;
    let x2 = id2%BoardWidth;
    let y1 = Math.floor(id1/BoardWidth);
    let y2 = Math.floor(id2/BoardWidth);
   
    if(x1 >  x2){
        let t = x1;
        x1 = x2; 
        x2 = t;
   }
    if(y1 == y2){
        
        for(let i = x1 + 1; i < x2; i++){
            if(cells[i + y1*BoardWidth].value != 0){
                return false;
            }
        }
        if(drawable){
            drawLineFromXtoY(cells[id1].centerX,cells[id1].centerY, cells[id2].centerX,cells[id2].centerY, ctx);
            setTimeout(() => {
                ctx.clearRect(0, 0, 630, 540);
            }, 300);
        }
        return true;
    }
    return false;
 
}

function checkOneVerticalLine(id1, id2, drawable) {
    let x1 = id1%BoardWidth;
    let x2 = id2%BoardWidth;
    let y1 = Math.floor(id1/BoardWidth);
    let y2 = Math.floor(id2/BoardWidth);
    
    if(x1 == x2){
        if(y1 > y2){
            let t = y2;
            y2 =y2;
            y1 = t;
        }
        
        for(let i = y1 + 1 ; i < y2 ; i ++){
            if(cells[x1 + i*BoardWidth].value != 0){
                return false;
            }
        }

        if(drawable){
            drawLineFromXtoY(cells[id1].centerX,cells[id1].centerY, cells[id2].centerX,cells[id2].centerY, ctx);
            setTimeout(() => {
                ctx.clearRect(0, 0, 630, 540);
            }, 300);
        }
        return true;
    }
    return false;
}

function returnID(x,y) {
    return x + y*BoardWidth;
}

function checkX(id1, id2) {
    let x1 = id1%BoardWidth;
    let x2 = id2%BoardWidth;
    let y1 = Math.floor(id1/BoardWidth);
    let y2 = Math.floor(id2/BoardWidth);
    if(id1 == id2){
        return true;
    }
    if(x1 >  x2){
        let t = x1;
        x1 = x2; 
        x2 = t;
   }
    if(y1 == y2){
        
        for(let i = x1 + 1; i < x2; i++){
            if(cells[i + y1*BoardWidth].value != 0){
                return false;
            }
        }
        if(cells[id1].value * cells[id2].value == 0){
          
            return true;
        }
           
    }
    return false;
}

function checkY(id1, id2) {
    let x1 = id1%BoardWidth;
    let x2 = id2%BoardWidth;
    let y1 = Math.floor(id1/BoardWidth);
    let y2 = Math.floor(id2/BoardWidth);
    if(id1 == id2){
        return true;
    }
    if(x1 == x2){
        if(y1 > y2){
            let t = y2;
            y2 =y1;
            y1 = t;
        }
       
        for(let i = y1 + 1 ; i < y2 ; i ++){
           
            if(cells[returnID(x1,i)].value != 0){
                return false;
            }
        }
        if(cells[id1].value * cells[id2].value == 0){
            
            return true;
        }
            
    }
    return false;
}


function checkInRect(id1, id2, drawable) {
    let x1 = id1%BoardWidth;
    let x2 = id2%BoardWidth;
    let y1 = Math.floor(id1/BoardWidth);
    let y2 = Math.floor(id2/BoardWidth);
    let leftX = x1;
    let leftY = y1;
    let rightX = x2;
    let rightY = y2;

    if(x1 > x2){
        leftX = x2;
        rightX = x1;
        leftY = y2;
        rightY = y1;
    }

    //left nằm dưới right
    if(leftY > rightY){
        //Kiểm tra | - |
        for(let i = leftY -1 ; i >= rightY; i --){
            if(checkY(returnID(leftX, leftY), returnID(leftX, i))){
                if(checkX(returnID(leftX,i), returnID(rightX, i))){
                    if(checkY(returnID(rightX,i), returnID(rightX, rightY))){
                        if(drawable){
                            drawLineFromXtoY(cells[returnID(leftX, leftY)].centerX, cells[returnID(leftX, leftY)].centerY,cells[returnID(leftX, i)].centerX, cells[returnID(leftX, i)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(leftX, i)].centerX, cells[returnID(leftX, i)].centerY,cells[returnID(rightX, i)].centerX, cells[returnID(rightX, i)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(rightX, i)].centerX, cells[returnID(rightX, i)].centerY,cells[returnID(rightX, rightY)].centerX, cells[returnID(rightX, rightY)].centerY, ctx);
                            setTimeout(() => {
                                ctx.clearRect(0, 0, 630, 540);
                            }, 300);
                        }
                        return true;
                    }
                }
            }
        }
    }else{
        for(let i = leftY + 1 ; i <= rightY; i ++){
            if(checkY(returnID(leftX, leftY), returnID(leftX, i))){
                if(checkX(returnID(leftX,i), returnID(rightX, i))){
                    if(checkY(returnID(rightX,i), returnID(rightX, rightY))){
                        if(drawable){
                            drawLineFromXtoY(cells[returnID(leftX, leftY)].centerX, cells[returnID(leftX, leftY)].centerY,cells[returnID(leftX, i)].centerX, cells[returnID(leftX, i)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(leftX, i)].centerX, cells[returnID(leftX, i)].centerY,cells[returnID(rightX, i)].centerX, cells[returnID(rightX, i)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(rightX, i)].centerX, cells[returnID(rightX, i)].centerY,cells[returnID(rightX, rightY)].centerX, cells[returnID(rightX, rightY)].centerY, ctx);
                            setTimeout(() => {
                                ctx.clearRect(0, 0, 630, 540);
                            }, 300);
                        }
                        return true;
                    }
                        
                }
            }  
        }
    }
    for(let i = leftX + 1; i <= rightX; i++){
        if(checkX(returnID(leftX, leftY), returnID(i,leftY))){
            if(checkY(returnID(i,leftY), returnID(i, rightY))){
                if(checkX(returnID(i,rightY), returnID(rightX, rightY))){
                    if(drawable){
                        drawLineFromXtoY(cells[returnID(leftX, leftY)].centerX, cells[returnID(leftX, leftY)].centerY,cells[returnID(i, leftY)].centerX, cells[returnID(i, leftY)].centerY, ctx);
                        drawLineFromXtoY(cells[returnID(i, leftY)].centerX, cells[returnID(i, leftY)].centerY,cells[returnID(i, rightY)].centerX, cells[returnID(i, rightY)].centerY, ctx);
                        drawLineFromXtoY(cells[returnID(i, rightY)].centerX, cells[returnID(i, rightY)].centerY,cells[returnID(rightX, rightY)].centerX, cells[returnID(rightX, rightY)].centerY, ctx);
                        setTimeout(() => {
                            ctx.clearRect(0, 0, 630, 540);
                        }, 300);
                    }
                    return true;
                }
                    
            }
        }
    }
    return false;
}

function checkOutRect(id1, id2, drawable) {
    let x1 = id1%BoardWidth;
    let x2 = id2%BoardWidth;
    let y1 = Math.floor(id1/BoardWidth);
    let y2 = Math.floor(id2/BoardWidth);

    //Nằm Ngang
    if(1){
        let leftX = x1;
        let leftY = y1;
        let rightX = x2;
        let rightY = y2;
    
        if(x1 > x2){
            leftX = x2;
            rightX = x1;
            leftY = y2;
            rightY = y1;
        }

        let i = leftY - 1;
        while(i >= 0 && cells[returnID(leftX, i)].value == 0){  
            if(checkY(returnID(leftX, leftY), returnID(leftX, i))){
                if(checkX(returnID(leftX, i), returnID(rightX, i))){
                    if(checkY(returnID(rightX, i), returnID(rightX, rightY))){
                        if(drawable){
                            drawLineFromXtoY(cells[returnID(leftX, leftY)].centerX, cells[returnID(leftX, leftY)].centerY,cells[returnID(leftX, i)].centerX, cells[returnID(leftX, i)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(leftX, i)].centerX, cells[returnID(leftX, i)].centerY,cells[returnID(rightX, i)].centerX, cells[returnID(rightX, i)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(rightX, i)].centerX, cells[returnID(rightX, i)].centerY,cells[returnID(rightX, rightY)].centerX, cells[returnID(rightX, rightY)].centerY, ctx);
                            setTimeout(() => {
                                ctx.clearRect(0, 0, 630, 540);
                            }, 300);
                        }
                        return true;
                    }
                }
            }
            i--;
        }
        i = leftY + 1;
        while( i < BoardHeight && cells[returnID(leftX,i)].value == 0){
            if(checkY(returnID(leftX, leftY), returnID(leftX, i))){
                if(checkX(returnID(leftX,i), returnID(rightX, i))){
                    if(checkY(returnID(rightX, i), returnID(rightX, rightY))){
                        if(drawable){
                            drawLineFromXtoY(cells[returnID(leftX, leftY)].centerX, cells[returnID(leftX, leftY)].centerY,cells[returnID(leftX, i)].centerX, cells[returnID(leftX, i)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(leftX, i)].centerX, cells[returnID(leftX, i)].centerY,cells[returnID(rightX, i)].centerX, cells[returnID(rightX, i)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(rightX, i)].centerX, cells[returnID(rightX, i)].centerY,cells[returnID(rightX, rightY)].centerX, cells[returnID(rightX, rightY)].centerY, ctx);
                            setTimeout(() => {
                                ctx.clearRect(0, 0, 630, 540);
                            }, 300);
                        }
                        return true;
                    }
                }
            }
            i++;
        }
    }
    //Nằm dọc
    if(1){
        let topX = x1;
        let topY = y1;
        let bottomX = x2;
        let bottomY = y2;

        if(topY > bottomY){
            topY = y2;
            topX = x2;
            bottomY = y1;
            bottomX = x1;
        }

        //Xử lý <
        let i = topX - 1;
        while(i>=0 && cells[returnID(i, topY)].value == 0){
            if(checkX(returnID(topX,topY), returnID(i,topY))){
                if(checkY(returnID(i,topY), returnID(i, bottomY))){
                    if(checkX(returnID(i,bottomY), returnID(bottomX, bottomY))){
                        if(drawable){
                            drawLineFromXtoY(cells[returnID(topX, topY)].centerX, cells[returnID(topX, topY)].centerY,cells[returnID(i, topY)].centerX, cells[returnID(i, topY)].centerY);
                            drawLineFromXtoY(cells[returnID(i, topY)].centerX, cells[returnID(i, topY)].centerY,cells[returnID(i, bottomY)].centerX, cells[returnID(i, bottomY)].centerY);
                            drawLineFromXtoY(cells[returnID(i, bottomY)].centerX, cells[returnID(i, bottomY)].centerY,cells[returnID(bottomX, bottomY)].centerX, cells[returnID(bottomX, bottomY)].centerY);
                            setTimeout(() => {
                                ctx.clearRect(0, 0, 630, 540);
                            }, 300);
                        }
                        return true;
                    }
                }
            }
            i--;
        }
        //Xử lý >
        i = topX + 1;
        while(i < BoardWidth && cells[returnID(i,topY)].value == 0){
            if(checkX(returnID(topX,topY), returnID(i,topY))){
                if(checkY(returnID(i,topY), returnID(i, bottomY))){
                    if(checkX(returnID(i,bottomY), returnID(bottomX, bottomY))){
                        if(drawable){
                            drawLineFromXtoY(cells[returnID(topX, topY)].centerX, cells[returnID(topX, topY)].centerY,cells[returnID(i, topY)].centerX, cells[returnID(i, topY)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(i, topY)].centerX, cells[returnID(i, topY)].centerY,cells[returnID(i, bottomY)].centerX, cells[returnID(i, bottomY)].centerY, ctx);
                            drawLineFromXtoY(cells[returnID(i, bottomY)].centerX, cells[returnID(i, bottomY)].centerY,cells[returnID(bottomX, bottomY)].centerX, cells[returnID(bottomX, bottomY)].centerY, ctx);
                            setTimeout(() => {
                                ctx.clearRect(0, 0, 630, 540);
                            }, 300);
                        }
                        return true;
                    }

                }
            }
            i++;
        }
    }
    return false;
}

function checkOKIE(id1, id2, drawable) {
    if(!checkSelfChosen(id1, id2)){
        return false;
    }

    if(!checkValue(id1, id2))
        return false;

    if(checkOneHorizontalLine(id1, id2,drawable)){
      
        return true;
    }
        

    if(checkOneVerticalLine(id1, id2,drawable)){
       
        return true;
    }
    if(checkInRect(id1, id2,drawable)){
      
        return true;
    }  
    if(checkOutRect(id1, id2,drawable)){
      
        return true;  
    }
          
   
        
    return false;
}

function WinGame(){
    if(gameScore == 6000){
        document.getElementById("win-game").style.display = "block";
        isWin = true;
    }
}

function mainAlgorithim() {
    let isHandle = [];
    if(isSelecting == 2){
       
        for(let id = BoardWidth; id < BoardWidth*BoardHeight - BoardWidth; id ++){
            if(cells[id].image.className.indexOf(" onSelect") !== -1){
                isHandle.push(id);
            }
        }
        if(checkOKIE(isHandle[0], isHandle[1], true)){
            cells[isHandle[0]].value = 0;
            cells[isHandle[1]].value = 0;
            gameScore += 100;
            myCanvas.style.zIndex = 20;
          
            addEventForCell();  
        }
        
        cells[isHandle[0]].image.className = cells[isHandle[0]].image.className.replace(" onSelect", "");
        cells[isHandle[1]].image.className = cells[isHandle[1]].image.className.replace(" onSelect", "");
        isHandle = [];
        isSelecting = 0;
        
    }
}

function isOkieToShuffle() {
    if(isWin){
        return false;
    }
    for(let i = 0 ; i < cells.length - 1 ; i++){
        if(cells[i].value!= 0){
            for(let j = i + 1 ; j < cells.length; j ++){
                if(cells[j].value != 0){
                    if(checkOKIE(i,j, false))
                        return false;
                }
            }
        }
    }
    return true;
}

function handleSwap() {
    let reload = document.getElementById('reload');
    reload.style.display = "block";
    swapCell();
    setTimeout(() => {
        reload.style.display = "none";
    }, 1000);
}





init();

function game() {
    //requestAnimationFrame(game); 
    mainAlgorithim();
    drawCells();
    showScore();
    WinGame();
    if(isOkieToShuffle()){
        handleSwap();
    }
}



ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
game();
timeHandle();



