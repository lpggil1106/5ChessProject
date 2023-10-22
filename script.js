var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

//宣告黑白子漸層顏色 grad公式:
//對於繪製中心點為(x,y)的黑/白子 colorGrid = ctx.createLinearGradient(x - 25, y - 25, x + 25, y + 25)
var blackColor = ctx.createLinearGradient(425, 425, 475, 475);
blackColor.addColorStop(0, "white");
blackColor.addColorStop(0.5, "black");
var whiteColor = ctx.createLinearGradient(475, 475, 525, 525);
whiteColor.addColorStop(0, "white");
whiteColor.addColorStop(0.6, "white");
whiteColor.addColorStop(1, "black");


//棋盤繪製(包含重製)
function drawBoard(){

    //繪製棋盤底()  底色=白色(reset)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.5;
    ctx.fillStyle = '#ffffff';
    
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    console.log(ctx.canvas.height);
    console.log(ctx.canvas.width);

    //繪製棋格
    ctx.strokeStyle = 'gray';
    for(let i = 1; i < 16; i ++){
        ctx.moveTo(50, 50 * i);
        ctx.lineTo(750, 50 * i);
        ctx.stroke();

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
ctx.beginPath();
ctx.arc(450, 450, 18, 0, 2 * Math.PI);
ctx.fillStyle = blackColor;
ctx.fill();
ctx.stroke();
ctx.beginPath();
ctx.arc(500, 500, 18, 0, 2 * Math.PI);
ctx.fillStyle = whiteColor;
ctx.fill();
ctx.stroke();
//測試結束