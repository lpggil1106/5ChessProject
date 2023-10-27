# 5ChessProject
五子棋專案
Hell fucking ya, please work
//無法正常作用的ifEnd function
// function ifEnd(sepRecordSet, now){
//     for(let i = 0; i < vectorCheck.length; i++){
//         for(let j = 0; j < sepRecordSet.length; j++){
//             let currX = now[0] + vectorCheck[i][0];
//             let currY = now[1] + vectorCheck[i][1];
//             if(currX == sepRecordSet[j][0] &&
//             currY == sepRecordSet[j][1]){
//                 let count = 2;
//                 soloVector(sepRecordSet, [currX, currY], vectorCheck[i], 2);
//             }
//         }
//     }
//     return;
// }
// 
// function soloVector(sepRecordSet, now, vector, count){
// 
//     let currX = now[0] + vector[0];
//     let currY = now[1] + vector[1];
//     for(let i = 0; i < sepRecordSet.length; i++){
//             if(currX == sepRecordSet[i][0] &&
//             currY == sepRecordSet[i][1]){
//                 count++;
//                 if(count >= 5){
//                     ifOver = true;
//                 }
//                 soloVector(sepRecordSet, [currX, currY], vector, count);
//             }
//     }
//     return;
// }