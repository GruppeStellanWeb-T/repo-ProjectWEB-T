
let socket = io();


//Empfänger
// socket.on('fire', function(msg){
//       console.log(msg);
//     });

socket.on('coordinateFire', function(msg){
          console.log('Antwort vom Server: ' + JSON.stringify(msg));
          });
socket.on('putBorad', function(msg){
        console.log(msg);
        // console.log(this.socket.sessionid);
        // socket.send(fieldCopy);
        });
socket.on('putGamer', function(msg){
        console.log(msg);
        });
socket.on('getHighscore', function(msg){
        console.log(msg);
        });
socket.on('sendHitMessage', function(msg){
        console.log(msg);
        });
socket.on('connection', function(){
    console.log(io().id);
});
socket.on('placeCell', function(msg){
    console.log(msg);
});



let spieler1;
let playerName = {
  name: "",
  hash: ""
}
let gegner;
let curPlayer2;
let fireROW;
let fireCOLUMN;

let hashCode_ID;

let gameBoard_My;

let gameBoard_Enemy;
let positionMemory;
let newHighScore;
let currentHighScore;

let playername = "";
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


const highscoreJson = {
  "player":this.playername,
  "score": 20
};

const coordinateFire = {
    'row' : "",
    'column': "",

};

var ships = {
  schlachtschiff: 5,
  kreuzer: 4,
  zerstörer: 3,
  uboote: 2,
  schiffart: function() {return 1;}
};

var coordinatesInTableROW = [];
var coordinatesInTableCOLUMN = [];


//Warum JQuery?
$(document).ready(function(){
    $("#myModal").modal('show');
});

function spielerSpeichern(){

  // die Verzweigung fehlt noch, bei der ein Alert ausgegeben wird wenn der Name gleih ist
    if(document.getElementById('nameSpieler1') == document.getElementById('nameSpieler2')){
      alert("Spieler bitte unterschiedlich nennen");
      $('myModal').modal('show');
      erneutSpielerEingeben();

    }else{
      function hashCode(s){
        return s.split("").reduce(function(a,b){a=(((a<<5)-a)*Math.floor((Math.random() * 10)))+b.charCodeAt(0); return a&a},0);
      }
      spieler1 = document.getElementById('nameSpieler1').value;
      hashCode_ID = hashCode(spieler1);
      //Gamer an den Server schicken
      socket.emit('putGamer', {
                                'name' : spieler1,
                                'board' : fieldCopy,
                                'ID'  : hashCode_ID
                              });

      $("#myModal").modal('hide');
    }
}


function erneutSpielerEingeben(){
  //Warum?
  alert("lalala");
	//Warum JQuery?
  $("#myModal").modal('show');

}

//um Zellen Koordinaten zu speichern
function selectSquare(obj) {
  coordinateFire.row = obj.dataset.x;
  console.log(obj.dataset.x);
  coordinateFire.column = obj.dataset.y;
  console.log(obj.dataset.y);
  coordinateFire['name'] = spieler1;
  console.log('Fire name: '+coordinateFire['name']);

}
//schiesst auf den Gegner
function fire(){
  socket.emit('coordinateFire', coordinateFire);
}
//erstellen des DOM Baumes/Boards
function makeBoard(boardID,size) {
  if(boardID=='gb1'){
    //reference, where to put field
    this.gameBoard_My = document.getElementById(boardID);
  }else{
    this.gameBoard_Enemy = document.getElementById(boardID);
  }
 	//create elements <table> and a <tbody>
 	var tbl = document.createElement('table');
 	var tblBody = document.createElement('tbody');
 	//create cells
 	for ( var i = 0; i < size; i++) {
 		var row = document.createElement('tr');
    for ( var j = 0; j < size; j++) {
 			var cell = document.createElement('td');
      cell.dataset.x = i;
      cell.dataset.y = j;
      cell.dataset.player = boardID;
      cell.setAttribute("onclick", "selectSquare(this)");
      cell.appendChild(cellText);
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
}

//setzt die Schiffe für die Ausgabe
function setShips(){
  this.positionMemory = new Array();
  if(this.positionMemory[0] == undefined) {
    //arrays mit den Größen der Schiffe. Kann man aber umstellen auf
    //Json- Bezug. Ist vielleicht schöner. Speicher wird damit gespart
    let arrayOfShips = [2,2,2,2,5,4,4,3,3,3];
    //Schleife die bei jedem Schritt gültige Koordinaten stellt die dann durch
    //putBattleshipsInTable() in die Tabelle eingefügt werden.
    //@variable jsonCoordinates returned ein Json mit gültigen anfangs Koordinaten
    for(var i=0;i<1;i++){
      let jsonCoordinates =  makeCoordinates(arrayOfShips[i]);
      putBattleshipsInTable(jsonCoordinates);
    }
  }
}

//Funktion die Koordinaten, durch Zufallszahlen erstellt
function makeCoordinates(shipSize){
  //prüft ob die Anfangskoordinaten gültig sind und fragt ab ob horizontal
  //oder vertikal eingefügt werden soll. Funktion checkPositionIsOK ist der
  //letzte Aufruf zum Bestätigen
  var isOK = false;
  var freeCoordinates = null;
  while(isOK == false) {
    //Zufalllsazheln werden erstellt
    var randomCOLUMN = Math.floor((Math.random() * 10));
    var randomROW = Math.floor((Math.random() * 10));
    //erstellt horizontal oder vertikal Positionierung
    let direction = checkDirection();


  	if(isInMemoryOfPositions(randomROW,randomCOLUMN) == false){
          if(direction==1){
            var puttingOK = checkPositionIsOK(randomROW, randomCOLUMN, shipSize, 1);
          }else{
            var puttingOK = checkPositionIsOK(randomROW, randomCOLUMN, shipSize, 0);
          }

          //abfrage was returned wird. Bei "True" von puttingOK wird das gültige JSON
          //returned. Bei "false", geht die Funktion in die Rekursion und erstellt
          //wieder neue Zufalsszahlen
          if(puttingOK == true){
            this.positionMemory.push(new Array(randomROW,randomCOLUMN));
            //JSON wird gefüllt mir Werten aus der Funktion makeCoordinates
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

//Funktion prüft ob Felder frei zu den passenden Anfangskoordinaten sind
//Geht mit zwe for-loops durch die Zeilen und Spalten und ruft dabei isFree() auf.
//@return flag, gibt die Zelle an makeCoordinates() frei, als Startpunkt der
//Positionierung
function checkPositionIsOK(rowNumber, columnNumber, shipSize, direction){
    //wenn Startkoordinaten frei und aussenrum alles frei ist kann angefangen werden,
    //zu setzen
    if(isFree(rowNumber, columnNumber) && checkAround(rowNumber, columnNumber)){
      //für horizontale Positionierung
      if(direction == 1){
          var flag = true;
          for(var i=0;i<shipSize;i++){
            if(isFree(rowNumber, columnNumber+i) && checkAround(rowNumber, columnNumber+i)){
                        flag=true;;
                  }else{
                        flag=false;
                  }
          }
          return flag;
      }
      //für vertikale Positionierung
      else{
        var flag = true;
        for(var i=0;i<shipSize;i++){
      //    alert("aufruf für flag 2. DURCHLAUF: "+i);
          if(isFree(rowNumber+i, columnNumber) && checkAround(rowNumber+i, columnNumber)){
                        flag=true;
                }else{
                        flag=false;
                }
        }
        return flag;
      }
    }else{
      return false;
    }
}

//Funktion um einzelne Zellen durchzulaufen und sie auf "leere" bzw. "Vollheit"
//zu prüfen. Alert("FEHLER IN ISFREE") nur zu Testzwecken.
function isFree(rowNumber, columnNumber){
  if(rowNumber<0 || rowNumber>9 || columnNumber<0 || columnNumber>9){
    return false;
  }
  if((typeof this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber]) === undefined){
    alert("hier drinne amk");
  }else if (typeof this.gameBoard_My.getElementsByTagName('table')[0] === undefined) {
    alert("hier drinne amk");
  }
  let rowElement = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber];
  if(rowElement != undefined) {
    //alert("RETURNED TRUE AUS ISFREE");
    if(rowElement.lastChild.data.includes("X") || rowElement.firstChild.data.includes("X")){
      return false;
    }else{
      return true;
    }
  }else{
    return false;
  }

//  alert("FEHLER IN ISFREE");
  //@return null, nur zur Sicherheit. Theoretisch sollte es nicht aufgerufen werden
  return null;
}

//checkt die Felder um die angepeilte Zelle
function checkAround(rowNumber, columnNumber){
  let positionArrayOfCorrectness = [];
  let positionsAroundCell = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]];
  for(var i=0;i<8;i++){
        //alert("POSITION CHECKAROUND I:"+i+" ROW:"+(rowNumber + positionsAroundCell[i][0])+" COLUMN:"+(columnNumber + positionsAroundCell[i][1]));
      //  var currentCell = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber + positionsAroundCell[i][0]].getElementsByTagName('td')[columnNumber + positionsAroundCell[i][1]];
        if(isFree(rowNumber + positionsAroundCell[i][0], columnNumber + positionsAroundCell[i][1])) {
                        positionArrayOfCorrectness.push(true);
        }else{
                        positionArrayOfCorrectness.push(false);
        }
  }
  if(positionArrayOfCorrectness.includes(false)){
    return false;
  }else{
    return true;
  }
}

//FUNKTION UM DIE TABLLEN MIT DEN SCHIFFEN ZU FÜLLEN
function putBattleshipsInTable(jsonCoordinates){
  if(jsonCoordinates.shipDirection == 1){
      for(var i=0;i<jsonCoordinates.size;i++){
        markCellWithX(jsonCoordinates.row, jsonCoordinates.column + i);
      }
  }
  //Zellen befüllen die vertikal angeordnet sind (Direction == 0)
  else{
    for(var i=0;i<jsonCoordinates.size;i++){
      markCellWithX(jsonCoordinates.row + i, jsonCoordinates.column);
    }
  }
}
//markiert Zellen im DOM mit X
function markCellWithX(rowNumber, columnNumber){
  let cellText = document.createTextNode(" X");
  if(rowNumber<0 || rowNumber>9 || columnNumber<0 || columnNumber>9){
    alert("negativeZahl!! row:"+rowNumber+" columnNumber:"+columnNumber);
  }else{
    console.log(rowNumber);
    console.log(columnNumber);
    let replaceCell = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].lastChild;
  let tableCell = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].replaceChild(cellText,replaceCell);
  this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber] = tableCell;
  fieldCopy[rowNumber][columnNumber] = 1;
  console.log("fieldKopie: "+fieldCopy[rowNumber][columnNumber]);
  }
}

//Funktion um die Direction zu erstellen. Erstellt eine Zufallszahl "random", bis 10.
//bei gerader Zahl ist die Direction hrizontal, ansonsten vertikal
function checkDirection(){
  var random = Math.floor((Math.random() * 10) + 1);
  if((random%2) == 0){
    return 1;
  }else{
    return 0;
  }
}

//Funktion um befüllte Zellen zu speichern um so das Positionieren zu vereinfachen
//Hier werden natürlich nur die Anfangskoordinaten gespeichert.
function isInMemoryOfPositions(rowNumber, columnNumber){

var isInside = false;
  for ( i=0; i<this.positionMemory.length; i++ )
  {
    for ( j=0; j<this.positionMemory[i].length-1; j++ )
    {
      if((this.positionMemory[i][j] == rowNumber) && (this.positionMemory[i][j+1] == columnNumber)){
              isInside=true;
            //  alert("memory besetzt");
              return true;
      }else{
        isInside=false;
      }
    }
  }

  return isInside;
}

/**
 * ENDE DER FUNKTIONEN FÜR AUTOMATISCHES AUFLADEN DER SCHIFFE
 */

//Call-Funktion die auftaucht sobald die Seite fertig geladen ist. SetShips
window.onload = function () {
	makeBoard("gb1",10);
	makeBoard("gb2",10);
  //Automatische Generieren der Schiffe in gameBoard_My
  setShips();
};
