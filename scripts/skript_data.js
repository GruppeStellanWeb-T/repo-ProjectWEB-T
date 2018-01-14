
/*
Battleship für WEB-T
Abgabe von Can Arsoy an Martina Kraus
@Autor, Can Arsoy & Stella Nesser (29 Zeilen)
 */


let socket = io();
socket.on('coordinateFire', function(msg){
          console.log('Antwort vom Server: ' + JSON.stringify(msg));
          postShoot(msg);
          shipCiao(msg);
          });

socket.on('putBorad', function(msg){
        console.log(msg);
        });

socket.on('putGamer', function(msg){
        if(msg['enemyName'] != undefined){
          gegner = msg['enemyName'];
          document.getElementById('ausgabeSpieler2').innerHTML = gegner;
        }
        if(msg['enemyName'] == gegner){
          gegner = msg['enemyName'];
          var x = msg['enemyName'];
          document.getElementById('ausgabeSpieler2').innerHTML = x;
          console.log("Gegner: "+gegner);
        }
        });
let currentHighscore;
socket.on('getHighscore', function(msg){
        console.log("skript: "+JSON.stringify(msg));
        highScore = msg['highscore'];
        console.log("skript: "+ JSON.stringify(highScore));
        document.getElementById('showWinnerHighscore').innerHTML = JSON.stringify(highScore);
        });

socket.on('connection', function(){
    console.log(io().id);
});

socket.on('closeGame', function(){

});

socket.on('getEnemy', function(msg){
    console.log(msg);
});

socket.on('beginner', function(msg){
    console.log("beginner "+msg);
    beginner=msg;
});

socket.on('wait', function(msg){
  alert(msg['msg']);
});

socket.on('sendWinnerAndHighscore', function(msg){
      document.getElementById('showWinner').innerHTML = msg['winner']+" mit dem Score:"+msg['score'];
      document.getElementById('showWinnerHighscore').innerHTML = JSON.stringify(msg['highscore']);
      console.log("vor getHighscore() in sendWinnerAndHighscore "+ msg['winner']);
      $('#winnerModal').modal('show');
      disconnect();
});

socket.on('putNewName', function(){
});



let spieler1;
let spieler1Counter = 30;
let gegner;
let fireROW;
let fireCOLUMN;
let hashCode_ID;
let gameBoard_My;
let gameBoard_Enemy;
let positionMemory;
let highScore;
let arrayOfCoordinatesToSend=[];
let beginner;
let arrayOfCoordinatesAll=[];
let counterArray=0;

let uboot = {
  'size':2,
  'counter':0,
}

let zerstoerer = {
  'size':3,
  'counter':0,
}

let kreuzer = {
  'size':4,
  'counter':0,
}
let flugtraeger = {
  'size':5,
  'counter':0,

}

let coordinateFire = {
    'row' : "",
    'column': "",
    'name' : spieler1
};

let playCoordinate = {
  'row': "",
  'column' : ""
}

const fieldCopy =[[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

let arrayOfShips = [[uboot],[uboot],[uboot],[uboot],[zerstoerer],[zerstoerer],[zerstoerer],[kreuzer],[kreuzer],[flugtraeger]];



$(document).ready(function(){
    $("#myModal").modal('show');
});

function findEnemy(){
  socket.emit('getEnemy', {'name' : spieler1});
  socket.emit('beginner', null);
}

function spielerSpeichern(){
    if(document.getElementById('nameSpieler1') == document.getElementById('nameSpieler2')){
      alert("Spieler bitte unterschiedlich nennen");
      $('myModal').modal('show');
      erneutSpielerEingeben();
    }else{
      function hashCode(s){
        return s.split("").reduce(function(a,b){a=(((a<<5)-a)*Math.floor((Math.random() * 10)))+b.charCodeAt(0); return a&a},0);
      }
      spieler1 = document.getElementById('nameSpieler1').value;
      document.getElementById('ausgabeSpieler1').innerHTML = spieler1;
      hashCode_ID = hashCode(spieler1);
      socket.emit('putGamer', {
                                'name' : spieler1,
                                'board' : fieldCopy,
                                'ID'  : hashCode_ID,
                                'counter' : spieler1Counter,
                                'score' : 0,
                                'ships' : arrayOfShips,
                                'coordinates' : arrayOfCoordinatesToSend
                              });
      $("#myModal").modal('hide');
    }
}

function showHighscore(){
  document.getElementById('showHighscore').innerHTML = JSON.stringify(highScore);
  $("#highscoreModal").modal('show');
}

function erneutSpielerEingeben(){
  if(gegner==undefined){
      var oldGamer = spieler1;
      $("#myModal").modal('show');
      document.getElementById('ausgabeSpieler1').innerHTML = spieler1;
      var newGamer = spieler1;
      socket.emit('putNewName', {
                                  'oldName' : oldGamer,
                                  'newName' : newGamer
                                });
  }else{
    $("#myModal").modal('hide');
    alert("Sie haben schon einen Gegner gefunden\n\nName kann nicht erneut eingegeben werden")
  }
}

function postShoot(msg){
  var post = msg;
  var row = post['row'];
  var column = post['column'];
  if(msg['hit'] == true){
    markCellWithX(row,column,false,true);
  }else{
    markCellWithX(row,column,false,false);
  }
}
function shipCiao(msg){
  if(msg['sinked'] == true){
    alert("SCHIFF CIAO !!!!")
  }
}

function selectSquare(obj) {
  coordinateFire.row = obj.dataset.x;
  console.log(obj.dataset.x);
  coordinateFire.column = obj.dataset.y;
  console.log(obj.dataset.y);
  coordinateFire['name'] = spieler1;
  console.log('Fire name: '+coordinateFire['name']);
}
function fire(){
  if(gegner != undefined || gegner != null){
    socket.emit('coordinateFire', coordinateFire);
  }else{
    alert("erst Gegner finden, dann Koordinaten eingeben und feuern !!!");
  }
}

function makeBoard(boardID,size) {
  if(boardID=='gb1'){
    this.gameBoard_My = document.getElementById(boardID);
  }else{
    this.gameBoard_Enemy = document.getElementById(boardID);
  }
 	var tbl = document.createElement('table');
 	var tblBody = document.createElement('tbody');
 	for ( var i = 0; i < size; i++) {
 		var row = document.createElement('tr');
 		for ( var j = 0; j < size; j++) {
 			var cell = document.createElement('td');
      cell.style.width = '500px';
      cell.dataset.x = i;
      cell.dataset.y = j;
      cell.dataset.player = boardID;
      cell.setAttribute("onclick", "selectSquare(this)");
 			var cellText = document.createTextNode(" "+i+"|"+j+" ");
 			cell.appendChild(cellText);
      cell.style.color = 'rgb(154, 236, 21)';
 			row.appendChild(cell);
 		}
 		tblBody.appendChild(row);
 	}
 	tbl.appendChild(tblBody);
  if(boardID=='gb1'){
    this.gameBoard_My.appendChild(tbl);
  }else{
    this.gameBoard_Enemy.appendChild(tbl);
  }
	tbl.setAttribute('border','2');
  tbl.style.backgroundColor = 'rgb(3, 4, 3)';
}

function setShips(){
  //alert("HIER BIN ICH IN SETSHIPS");
  this.positionMemory = new Array();
  if(this.positionMemory[0] == undefined) {
    let arrayOfShipsSize = [5,4,4,3,3,3,2,2,2,2];
    for(var i=0;i<10;i++){
      let jsonCoordinates =  makeCoordinates(arrayOfShipsSize[i]);
      console.log("Koordinaten erhalten die Gültig sind.\nSchiff wird eingefügt:"+JSON.stringify(jsonCoordinates));
      putBattleshipsInTable(jsonCoordinates);
    }
  }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeCoordinates(shipSize){
  var isOK = false;
  var freeCoordinates = null;
  while(isOK == false) {
    var randomCOLUMN = getRandomInt(0,9);
    var randomROW = getRandomInt(0,9);
    console.log("Zufallszahlen:  ->  rowRand:"+randomROW+" columnRand:"+randomCOLUMN);
    let direction = checkDirection();
  	if(isInMemoryOfPositions(randomROW,randomCOLUMN) == false){
          if(direction==1){
            var puttingOK = checkPositionIsOK(randomROW, randomCOLUMN, shipSize, 1);
          }else{
            var puttingOK = checkPositionIsOK(randomROW, randomCOLUMN, shipSize, 0);
          }
          if(puttingOK == true){
            this.positionMemory.push(new Array(randomROW,randomCOLUMN));
              freeCoordinates = {
                            row: randomROW,
                            column: randomCOLUMN,
                            shipDirection: direction,
                            size: shipSize
                          };
              isOK = true;
          }
      }
    }
  return freeCoordinates;
}

function checkPositionIsOK(rowNumber, columnNumber, shipSize, direction){
    if(isFree(rowNumber,columnNumber) == true){
        if(direction == 1){
                var flag = false;
                for(var i=0;i<shipSize;i++){
                  if(isFree(rowNumber, columnNumber+i) == true ){
                          if(checkAround(rowNumber, columnNumber+i) ==true) {
                                if(rowNumber+i>=0 && rowNumber+i<=9 && columnNumber+i>=0 && columnNumber+i<=9){
                                    flag=true;
                                    }else{
                                      flag=false;
                                      break;
                                    }
                            }else{
                            flag=false;
                            break;
                            }
                  }else{
                    flag=false;
                    break;
                  }
                }
              return flag;
        }else{
              var flag = true;
              for(var i=0;i<shipSize;i++){
                if(isFree(rowNumber+i, columnNumber) == true){
                  if(checkAround(rowNumber+i, columnNumber) == true) {
                    if(rowNumber+i>=0 && rowNumber+i<=9 && columnNumber+i>=0 && columnNumber+i<=9){
                    flag=true;
                    }else{
                    flag=false;
                    break;
                    }
                  }else{
                    flag=false;
                    break;
                  }
                }else{
                  flag=false;
                  break;
                }
              }
              return flag;
          }
        }
    }

function isFree(rowNumber, columnNumber){
  if(rowNumber<0 || rowNumber>9){
    return false;
  }else if (columnNumber<0 || columnNumber>9) {
    return false;
  }
  if((typeof this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber]) == undefined){
    alert("HARD ERROR!!!!!");
  }else if (typeof this.gameBoard_My.getElementsByTagName('table')[0] === undefined) {
      alert("HARD ERROR!!!!!");
  }
  let rowElement = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber];
  if(rowElement == undefined) {
          return false;
  }else{
  if(rowElement.lastChild.data.includes("X") || rowElement.firstChild.data.includes("X")){
      return false;
  }else{
      return true;
  }
}
  return null;
}

function checkAround(rowNumber, columnNumber){
  let positionArrayOfCorrectness = [];
  let positionsAroundCell = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
  for(var i=0;i<8;i++){
        if(isFreeCheckAround(rowNumber + positionsAroundCell[i][0], columnNumber + positionsAroundCell[i][1]) == true) {
                        arrayOfCoordinatesAll.push(true);
        }else{
                      arrayOfCoordinatesAll.push(false);
        }
  }
  if(JSON.stringify(arrayOfCoordinatesAll).includes(false)){
    arrayOfCoordinatesAll=[];
    return false;
  }else{
    arrayOfCoordinatesAll=[];
    return true;
  }
}

function isFreeCheckAround(rowNumber, columnNumber){
  if(rowNumber<0 || rowNumber>9){
    return true;
  }else if (columnNumber<0 || columnNumber>9) {
    return true;
  }
  if((typeof this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber]) == undefined){
    alert("hier drinne amk");
  }else if (typeof this.gameBoard_My.getElementsByTagName('table')[0] === undefined) {
    alert("hier drinne amk");
  }
  let rowElement = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber];
  if(rowElement == undefined) {
          return true;
  }else{
    if(rowElement.lastChild.data.includes("X") || rowElement.firstChild.data.includes("X")){
      return false;
    }else{
      return true;
    }
  }
  return null;
}

function putBattleshipsInTable(jsonCoordinates){
  if(jsonCoordinates.shipDirection == 1){
    var arrayCurrentShip=[];
    for(var i=0;i<jsonCoordinates.size;i++){
      arrayCurrentShip.push(new Array(jsonCoordinates.row, jsonCoordinates.column + i));
      markCellWithX(jsonCoordinates.row, jsonCoordinates.column + i);
    }
    arrayOfCoordinatesToSend.push(arrayCurrentShip);
  }
  else{
    var arrayCurrentShip=[];
    for(var i=0;i<jsonCoordinates.size;i++){
      arrayCurrentShip.push(new Array(jsonCoordinates.row+i, jsonCoordinates.column));
      markCellWithX(jsonCoordinates.row + i, jsonCoordinates.column);
    }
    arrayOfCoordinatesToSend.push(arrayCurrentShip);
  }
  counterArray++;
}

function markCellWithX(rowNumber, columnNumber, boardID, hit){
  if(boardID != false){
      let cellText = document.createTextNode(" X");
      if(rowNumber<0 || rowNumber>9 || columnNumber<0 || columnNumber>9){
        alert("negativeZahl!! row:"+rowNumber+" columnNumber:"+columnNumber);
      }else{
      let replaceCell = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].lastChild;
      let tableCell = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].replaceChild(cellText,replaceCell);
      this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber] = tableCell;
      this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].style.backgroundColor = 'rgb(48, 152, 35)';
      fieldCopy[rowNumber][columnNumber] = 1;
      }
  }else{
    let cellText = document.createTextNode(" X ");
    if(rowNumber<0 || rowNumber>9 || columnNumber<0 || columnNumber>9){
      alert("negativeZahl!! row:"+rowNumber+" columnNumber:"+columnNumber);
    }else{
      if(hit == true){
            cellText = document.createTextNode(" !! ");
            let replaceCell = this.gameBoard_Enemy.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].lastChild;
            let tableCell = this.gameBoard_Enemy.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].replaceChild(cellText,replaceCell);
            this.gameBoard_Enemy.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber] = tableCell;
            this.gameBoard_Enemy.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].style.backgroundColor = 'rgb(158, 181, 24)';
      }else{
        cellText = document.createTextNode(" X ");
        let replaceCell = this.gameBoard_Enemy.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].lastChild;
        let tableCell = this.gameBoard_Enemy.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].replaceChild(cellText,replaceCell);
        this.gameBoard_Enemy.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber] = tableCell;
        this.gameBoard_Enemy.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].style.backgroundColor = 'rgb(48, 152, 35)';
      }
    }
  }
}

function checkDirection(){
  var random = Math.floor((Math.random() * 10) + 1);
  if((random%2) == 0){
    return 1;
  }else{
    return 0;
  }
}

function getHighscore(){
  socket.emit('getHighscore', {'name' : spieler1});
}

function disconnect(){
  console.log("UND CIAO");
  socket.emit('closeGame', {});

}
function isInMemoryOfPositions(rowNumber, columnNumber){
var isInside = false;
  for ( i=0; i<this.positionMemory.length; i++ )
  {
    for ( j=0; j<this.positionMemory[i].length-1; j++ )
    {
      if((this.positionMemory[i][j] == rowNumber) && (this.positionMemory[i][j+1] == columnNumber)){
              isInside=true;
              return true;
      }else{
        isInside=false;
      }
    }
  }
  return isInside;
}

window.onload = function () {
	makeBoard("gb1",10);
	makeBoard("gb2",10);
  setShips();
};

// var xhr = new XMLHttpRequest();
//    xhr.open("GET", /highScore);
//    xhr.responseType = "json";
//    xhr.onload = function(){
//      if (this.readyState == 4 && this.status == 200) {
//          console.log("Gut gegangen");
//          console.log(xhr.response);
//          showHighscore(getBestScores(xhr.response),5);
//      } else{
//        console.log("Schief gegangen");
//      }
//    };
//    xhr.send();
