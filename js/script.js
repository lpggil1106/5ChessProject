//宣告Canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var chessRecordSets = [];
var blackChessSets = [];
var whiteChessSets = [];
var notOver = true;
var aiMode = true;
//宣告isBlack, 回合顯示
var isBlack = true;

//宣告黑白子漸層顏色 grad公式:
//對於繪製中心點為(x,y)的黑/白子 colorGrid = ctx.createLinearGradient(x - 25, y - 25, x + 25, y + 25)
// var blackColor = ctx.createLinearGradient(425, 425, 475, 475);
// blackColor.addColorStop(0, "white");
// blackColor.addColorStop(0.5, "black");
// var whiteColor = ctx.createLinearGradient(475, 475, 525, 525);
// whiteColor.addColorStop(0, "white");
// whiteColor.addColorStop(0.6, "white");
// whiteColor.addColorStop(1, "black");


//棋盤繪製(包含重製落子紀錄)
function drawBoard(){
    refreshRecordUI();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);//清空棋盤
    chessRecordSets = [];//落子紀錄重製
    blackChessSets = [];
    whiteChessSets = [];
    notOver = true;
    //繪製棋盤底()  底色=白色(reset)
    ctx.lineWidth = 0.5;
    ctx.fillStyle = '#ffffff';
    // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    
    //繪製棋格
    ctx.strokeStyle = 'black';
    for(let i = 1; i < 16; i ++){
        ctx.beginPath(); //重製路徑
        ctx.moveTo(50, 50 * i);
        ctx.lineTo(750, 50 * i);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(50 * i, 50);
        ctx.lineTo(50 * i, 750);
        ctx.stroke();
    };
    
    //繪製中心點
    ctx.beginPath();
    ctx.arc(400, 400, 6, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
    
    
    
}

drawBoard();
//黑白子測試(記得刪掉)
// ctx.beginPath();
// ctx.arc(450, 450, 18, 0, 2 * Math.PI);
// ctx.fillStyle = blackColor;
// ctx.fill();
// ctx.stroke();

// ctx.beginPath();
// ctx.strokeStyle = 'black';
// ctx.arc(500, 500, 18, 0, 2 * Math.PI);
// ctx.fillStyle = whiteColor;
// ctx.fill();
// ctx.stroke();
//測試結束

//繪製黑子function
function drawBlack(xGrid, yGrid){
    var blackColor = ctx.createLinearGradient(xGrid - 25, yGrid - 25, xGrid + 25, yGrid + 25);
    blackColor.addColorStop(0, "white");
    blackColor.addColorStop(0.5, "black");

    ctx.beginPath();
    ctx.arc(xGrid, yGrid, 20, 0, 2 * Math.PI);
    ctx.fillStyle = blackColor;
    ctx.fill();
    ctx.stroke();
}

//繪製白子function
function drawWhite(xGrid, yGrid){
    var whiteColor = ctx.createLinearGradient(xGrid - 25, yGrid - 25, xGrid + 25, yGrid + 25);
    whiteColor.addColorStop(0, "white");
    whiteColor.addColorStop(0.6, "white");
    whiteColor.addColorStop(1, "black");

    ctx.beginPath();
    ctx.arc(xGrid, yGrid, 20, 0, 2 * Math.PI);
    ctx.fillStyle = whiteColor;
    ctx.fill();
    ctx.stroke();
}

//AI回合動作
function aiAction(chessRecordSets, myChessSets, opponentChessSets){
    var scoreBoard = boardScores(chessRecordSets, myChessSets, opponentChessSets);
    return choose(scoreBoard);
}

const vector = [[0,-1],[1, -1],[1, 0],[1,1]];
//產生二維數組 每格依照規則打分return scoreBoard[][];

function printBoard(scoreBoard){//測試boardScores功能(記得刪掉)
    var numRows = scoreBoard.length;
    var numCols = scoreBoard[0].length;
    
    console.log("二维数组内容：");
    console.log("---------------");
    
    for (var i = 0; i < numRows; i++) {
        var rowStr = "|";
        for (var j = 0; j < numCols; j++) {
            rowStr += " " + scoreBoard[i][j] + " |";
        }
        console.log(rowStr);
        console.log("---------------");
    }
}

//AI計算位置分數
function boardScores(chessRecordSets, myChessSets, opponentChessSets){
    var scoreBoard = [];
    for(let i = 0; i < 15 ; i++){ //i = y軸 j = x軸
        // scoreBoard.push([]);
        for(let j = 0; j < 15; j++){
            let score = 0;
            vector.forEach((vec) => {
                let myTemp = comboCount(myChessSets, vec, [i,j]);
                let OpponentTemp = comboCount(opponentChessSets, vec,[i,j]);
                if(hasArray(chessRecordSets, [i,j])){
                    score = -100000000;
                }
                else{
                    if(myTemp >= 5){
                        score += 8000000;
                    }else if(myTemp == 4){
                        score += 15000;
                    }else if(myTemp == 3){
                        score += 800;
                    }else if(myTemp == 2){
                        score += 35
                    }
    
                    if(OpponentTemp >= 5){
                        score += 100000;
                    }else if(OpponentTemp == 4){
                        score += 8000;
                    }else if(OpponentTemp == 3){
                        score += 400;
                    }else if(OpponentTemp == 2){
                        score += 15;
                    }
                }
            });
            // scoreBoard[i].push(score);
            if(score != 0){
                scoreBoard.push([i,j,score]);
            }
        }
    }
    return scoreBoard;
}

//決定落子位置 return[x, y];
function choose(scoreBoard){
    if(scoreBoard == []){
        return [8,8];
    }
    
    scoreBoard.sort(function(a,b){
        return b[2] - a[2];
    })
    let highest = 0;
    if(scoreBoard[0][2] - scoreBoard[2][2] < 30){
        highest = Math.floor(Math.random() * 3);
    }
    
    var ans = [scoreBoard[highest][0] , scoreBoard[highest][1]];
    return ans;
}


//重複落子排除
function isCrowded(chessRecord){
    for(let i = 0; i < chessRecordSets.length; i++){
        // console.log(chessRecord +":"+ chessRecordSets[i]); 排除問題用
        var temp = true;
        for(let j = 0; j < 2; j++){
            temp *= chessRecord[j] == chessRecordSets[i][j];    
        }
        if(temp == 1){
            return true;
        }
    }
    return false;
}

//查詢紀錄
function checkRecord(){
    console.clear();
    for(let i = 0; i < chessRecordSets.length; i++){
        var structure = chessRecordSets[i];
        var int1 = structure[0];
        var int2 = structure[1];
        var bool = structure[2];

        console.log("x:", int1, "y:", int2, "顏色:", bool);
    }
}

//更新畫面
function refreshRecordUI(){
    $("#chessRecord").empty();

    $.each(chessRecordSets, function (key, obj) {
        console.log(key);
        console.log(obj)
    var recordText =  obj[0] + " , " + obj[1]  ;
    if(obj[2] == "黑"){
        var $li = $("<li></li>")
                .text(recordText)
                .addClass("list-group-item bg-dark w-50 m-auto");
    }else{
        var $li = $("<li></li>")
                    .text(recordText)
                    .addClass("list-group-item bg-light text-dark w-50 m-auto");
    }
    $li.appendTo("#chessRecord");
})

}

//從記錄分離出黑/白子 isBlack輸入1 目標為黑子 反之目標為白子




//新ifEnd function
function ifEnd(sepRecordSet, now, color){
    for(let vec of vector){
        if(comboCount(sepRecordSet, vec, now) >= 5){
            notOver = false;
            if(color == "黑"){
                alert("遊戲結束，黑子勝利");
                return;
            }else{
                alert("遊戲結束，白子勝利");
                return;
            }
        };
    }
}

function comboCount(sepRecordSet, vector, now){
    let count = 1;
    let nextTemp = Array.from(now);
    let lastTemp = Array.from(now);
    nextTemp[0] += vector[0];
    nextTemp[1] += vector[1];

    lastTemp[0] -= vector[0];
    lastTemp[1] -= vector[1];
    while(hasArray(sepRecordSet, nextTemp)){
        count++;
        nextTemp[0] += vector[0];
        nextTemp[1] += vector[1];
    }
    while(hasArray(sepRecordSet, lastTemp)){
        count++;
        lastTemp[0] -= vector[0];
        lastTemp[1] -= vector[1];
    }
    
    return count;
}

function hasArray(target, arr){
    for(let [x,y] of target){
        if(x == arr[0] && y == arr[1]){
            return true;
        }
    }
    return false;
}

function unDrawChess(xGrid, yGrid){
    //擦掉
    ctx.beginPath();
    ctx.fillStyle = 'white';
    ctx.fillRect(xGrid-21,yGrid-21,42,42);
    
    if (xGrid <= 750 && yGrid <= 750 && xGrid >= 50  && yGrid >= 50) {
        // 绘制预览效果
        if(yGrid < 100 && xGrid < 100){//左上
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(xGrid, yGrid);
            ctx.lineTo(xGrid+21, yGrid);
            ctx.moveTo(xGrid, yGrid);
            ctx.lineTo(xGrid, yGrid+21);
            ctx.stroke();
        }else if(xGrid > 700 && yGrid > 700){//右下
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(xGrid-21, yGrid);
            ctx.lineTo(xGrid, yGrid);
            ctx.moveTo(xGrid, yGrid-21);
            ctx.lineTo(xGrid, yGrid);
            ctx.stroke();
        }else if(xGrid > 700 && yGrid < 100){//右上
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(xGrid-21, yGrid);
            ctx.lineTo(xGrid, yGrid);
            ctx.moveTo(xGrid, yGrid);
            ctx.lineTo(xGrid, yGrid+21);
            ctx.stroke();
        }else if(xGrid < 100 && yGrid > 700){
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(xGrid, yGrid);
            ctx.lineTo(xGrid+21, yGrid);
            ctx.moveTo(xGrid, yGrid-21);
            ctx.lineTo(xGrid, yGrid);
            ctx.stroke();
        }else if(yGrid < 100){//上
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(xGrid-21, yGrid);
            ctx.lineTo(xGrid+21, yGrid);
            ctx.moveTo(xGrid, yGrid);
            ctx.lineTo(xGrid, yGrid+21);
            ctx.stroke();
        }else if(yGrid > 700){
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(xGrid-21, yGrid);
            ctx.lineTo(xGrid+21, yGrid);
            ctx.moveTo(xGrid, yGrid-21);
            ctx.lineTo(xGrid, yGrid);
            ctx.stroke();
        }else if(xGrid < 100){//左
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(xGrid, yGrid);
            ctx.lineTo(xGrid+21, yGrid);
            ctx.moveTo(xGrid, yGrid-21);
            ctx.lineTo(xGrid, yGrid+21);
            ctx.stroke();
        }else if(xGrid > 700){//右
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(xGrid-21, yGrid);
            ctx.lineTo(xGrid, yGrid);
            ctx.moveTo(xGrid, yGrid-21);
            ctx.lineTo(xGrid, yGrid+21);
            ctx.stroke();
        }else{
            ctx.beginPath();
            ctx.strokeStyle = 'black';
            ctx.moveTo(xGrid-21, yGrid);
            ctx.lineTo(xGrid+21, yGrid);
            ctx.moveTo(xGrid, yGrid-21);
            ctx.lineTo(xGrid, yGrid+21);
            ctx.stroke();
        }
    
        if(xGrid == 400 && yGrid == 400){
            ctx.beginPath();
            ctx.arc(400, 400, 6, 0, 2 * Math.PI);
            ctx.fillStyle = 'black';
            ctx.fill();
        }
    } else {
        return
    }

}

var lastX = -1, lastY = -1;
// 落子位置顯示(未完成)
c.addEventListener('mousemove', event =>{
    var hoverX = event.offsetX + 48;
    var hoverY = event.offsetY + 48;

    var xCoordinate = Math.round((hoverX -100)/50);
    var yCoordinate = Math.round((hoverY -100)/50);  
    
    if(isCrowded([xCoordinate,yCoordinate])){
        return;
    }
    var xGrid = (xCoordinate + 1) * 50;
    var yGrid = (yCoordinate + 1) * 50;
    
    if(xGrid != lastX || yGrid != lastY){
        unDrawChess(lastX, lastY);
        lastX = xGrid;
        lastY = yGrid;
        return;
    }
    
    if(xCoordinate >= 0 && yCoordinate >= 0 && xCoordinate < 15 && yCoordinate < 15){
        if(isBlack){
            drawBlack(xGrid, yGrid);
        }else{
            drawWhite(xGrid, yGrid);
        }
    }
})
//座標測試 X座標公式 : (2*點擊X絕對位置 - 當前視窗寬度)/100 + 7
//        Y座標公式 : (點擊Y絕對位置-100)/50



//點擊觸發落子事件
c.addEventListener ('click', event => {
    //被廢除的座標系統: event.clientX (從視窗左上角開始算 滑動視窗後沒辦法正常作用)
    // var clickX = event.clientX;
    // var clickY = event.clientY;
    // var xCoordinate = Math.round((2*clickX - clientWidth)/100 + 7);
    // var clientWidth = window.innerWidth;

    //嘗試offx, y 對座標影響(測試))
    // var offx = event.offsetX;
    // var offy = event.offsetY;


    // //新座標系統測試(成功)
    var clickX = event.offsetX + 48;
    var clickY = event.offsetY + 48;


    //坐標系 Ex: [0, 0],[7, 8]
    var xCoordinate = Math.round((clickX -100)/50);
    var yCoordinate = Math.round((clickY -100)/50);
    // console.log("x:" + xCoordinate + " y:" + yCoordinate);
    
    //Canvas Grid Ex:[450, 450],[900, 550]
    var xGrid = (xCoordinate + 1) * 50;
    var yGrid = (yCoordinate + 1) * 50;
    //繪製棋子
    if(xCoordinate >= 0 && yCoordinate >= 0 && xCoordinate < 15 && yCoordinate < 15){
        //判斷是否重複落子
        
        let temp = [xCoordinate, yCoordinate , (isBlack)?"黑":"白"];
        
        if(isCrowded(temp)){
            $.toast({
                heading: '錯誤',
                icon: 'error',
                text: '請勿重複落子',
                position: 'top-left',
                stack: 5,
            })
            return;
        } 
        
        //紀錄落子資料
        chessRecordSets.push(temp);
        
        if(isBlack){
            drawBlack(xGrid, yGrid);
            if(notOver){
                ifEnd(blackChessSets, [xCoordinate, yCoordinate],"黑");
            }
            // if(notOver){
                //     alert("遊戲結束，黑子勝利");
                // }
                blackChessSets.push([xCoordinate, yCoordinate]);
                isBlack = false;
                
                //以下目的請見unDrawChess()
                lastX = -1;
                lastY = -1;
                
            }else{
                
                drawWhite(xGrid, yGrid);
                if(notOver){
                    ifEnd(whiteChessSets, [xCoordinate, yCoordinate],"白");
                }
                // if(notOver){
                    //     alert("遊戲結束，白子勝利");
                    // }
                    whiteChessSets.push([xCoordinate, yCoordinate]);
                    isBlack = true;
                    
                    //以下目的請見unDrawChess()
                    lastX = -1;
                    lastY = -1;
                }
                
                if(aiMode){
                    console.log(whiteChessSets);
                    var aiMove = aiAction(chessRecordSets, whiteChessSets, blackChessSets);
                    console.log(aiMove);
                    printBoard(boardScores(chessRecordSets, whiteChessSets, blackChessSets));
                    xGrid = (aiMove[0] + 1 ) * 50;
                    yGrid = (aiMove[1] + 1 ) * 50;
                    drawWhite(xGrid, yGrid);
                    chessRecordSets.push([aiMove[0],aiMove[1],"白"]);
                    if(notOver){
                        ifEnd(whiteChessSets, [aiMove[0], aiMove[1]],"白");
                    }
                    // if(notOver){
                        //     alert("遊戲結束，白子勝利");
                        // }
                        whiteChessSets.push([aiMove[0], aiMove[1]]);
                        isBlack = true;
                    }
                    
                    
    }
                
                
    refreshRecordUI();
}
)
