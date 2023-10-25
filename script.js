//宣告Canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var chessRecordSets = [];
var blackChessSets = [];
var whiteChessSets = [];
var ifOver = false;
//宣告isBlack, 回合顯示
var isBlack = true;
var roundShow = document.getElementById("Cside");

//宣告黑白子漸層顏色 grad公式:
//對於繪製中心點為(x,y)的黑/白子 colorGrid = ctx.createLinearGradient(x - 25, y - 25, x + 25, y + 25)
var blackColor = ctx.createLinearGradient(425, 425, 475, 475);
blackColor.addColorStop(0, "white");
blackColor.addColorStop(0.5, "black");
var whiteColor = ctx.createLinearGradient(475, 475, 525, 525);
whiteColor.addColorStop(0, "white");
whiteColor.addColorStop(0.6, "white");
whiteColor.addColorStop(1, "black");


//棋盤繪製(包含重製落子紀錄)
function drawBoard(){
    
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);//清空棋盤
    chessRecordSets = [];//落子紀錄重製
    blackChessSets = [];
    whiteChessSets = [];
    ifOver = false;
    //繪製棋盤底()  底色=白色(reset)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = '#ffffff';
    
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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

//從記錄分離出黑/白子 isBlack輸入1 目標為黑子 反之目標為白子

const vectorCheck = [
    [1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1, -1]
];//宣告向量
function ifEnd(sepRecordSet, now){
    for(let i = 0; i < vectorCheck.length; i++){
        for(let j = 0; j < sepRecordSet.length; j++){
            let currX = now[0] + vectorCheck[i][0];
            let currY = now[1] + vectorCheck[i][1];
            if(currX == sepRecordSet[j][0] &&
            currY == sepRecordSet[j][1]){
                let count = 2;
                soloVector(sepRecordSet, [currX, currY], vectorCheck[i], 2);
            }
        }
    }
    return;
}

function soloVector(sepRecordSet, now, vector, count){

    let currX = now[0] + vector[0];
    let currY = now[1] + vector[1];
    for(let i = 0; i < sepRecordSet.length; i++){
            if(currX == sepRecordSet[i][0] &&
            currY == sepRecordSet[i][1]){
                count++;
                if(count >= 5){
                    ifOver = true;
                }
                soloVector(sepRecordSet, [currX, currY], vector, count);
            }
    }
    return;
}

//落子位置顯示(有點太難)
// c.addEventListener('mousemove', event =>{
//     var hoverX = event.offsetX + 48;
//     var hoverY = event.offsetY + 48;
// 
//     var xCoordinate = Math.round((hoverX -100)/50);
//     var yCoordinate = Math.round((hoverY -100)/50);
// 
//     var xGrid = (xCoordinate + 1) * 50;
//     var yGrid = (yCoordinate + 1) * 50;
// 
//     if(xCoordinate >= 0 && yCoordinate >= 0 && xCoordinate < 15 && yCoordinate < 15){
//         if(isBlack){
//             drawBlack(xGrid, yGrid);
// 
//         }else{
//             drawWhite(xGrid, yGrid);
//         }
//     }
//     console.log(hoverX, hoverY);
// })
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
            alert("請勿重複落子");
            return;
        } 

        //紀錄落子資料
        chessRecordSets.push(temp);

        if(isBlack){
            drawBlack(xGrid, yGrid);
            ifEnd(blackChessSets, [xCoordinate, yCoordinate]);
            if(ifOver){
                alert("遊戲結束，黑子勝利");
            }
            blackChessSets.push([xCoordinate, yCoordinate]);
            isBlack = false;
            roundShow.innerText = "白子的回合";

        }else{
            drawWhite(xGrid, yGrid);
            ifEnd(whiteChessSets, [xCoordinate, yCoordinate]);
            if(ifOver){
                alert("遊戲結束，白子勝利");
            }
            whiteChessSets.push([xCoordinate, yCoordinate]);
            isBlack = true;
            roundShow.innerText = "黑子的回合";
        }
    }
  })
