
//Globale Variablen, sollen die in diesem Scope sein?
let spieler1;
let spieler2;
let fireROW;
let fireCOLUMN;
let gameBoard_My;
let gameBoard_Enemy;
let positionMemory;
let newHighScore;
let currentHighScore;

const highscoreJson = {
  "player":"dickhead",
  "score": 20
};

const coordinateFire = {
    row: "",
    column: ""
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
      spieler1 = document.getElementById('nameSpieler1').value;
      spieler2 = document.getElementById('nameSpieler2').value;
      $("#myModal").modal('hide');
      printOutSpielername();
    }


}

function erneutSpielerEingeben(){
  //Warum?
  alert("lalala");
	//Warum JQuery?
  $("#myModal").modal('show');

}
function printOutSpielername(){
  document.getElementById('ausgabeSpieler1').innerHTML = spieler1;
  document.getElementById('ausgabeSpieler2').innerHTML = spieler2;
}



/**
 * Alles zum Spielfeld
 */

function makeBoard(boardID,size) {

  if(boardID=='gb1'){
    //reference, where to put field
    this.gameBoard_My = document.getElementById(boardID);
  }else{
    this.gameBoard_Enemy = document.getElementById(boardID);
  }

//var board = document.getElementById(boardID);

 	//create elements <table> and a <tbody>
 	var tbl = document.createElement('table');
 	var tblBody = document.createElement('tbody');

 	//create cells
 	for ( var i = 0; i < size; i++) {
 		var row = document.createElement('tr');

 		for ( var j = 0; j < size; j++) {
 			var cell = document.createElement('td');

 			//DEMO Start
 			//var cellText = document.createTextNode('cell is row: ' + j + ' column: ' + i );
 			var cellText = document.createTextNode(i+" | "+j);
 			//DEMO END
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

	//DEMO Start
	tbl.setAttribute('border','2');
	//DEMO End
}

/**
 * ENDE DES KARTENTEILS
 */

/**
 * FUNKTIONEN UM BOOTE AUTOMATISCH ZU ERSTELLEN
 */

function setShips(){
  //alert("HIER BIN ICH IN SETSHIPS");
  this.positionMemory = new Array();
  if(this.positionMemory[0] == undefined) {
    //arrays mit den Größen der Schiffe. Kann man aber umstellen auf
    //Json- Bezug. Ist vielleicht schöner. Speicher wird damit gespart
    let arrayOfShips = [2,2,2,2,5,4,4,3,3,3];
    //Schleife die bei jedem Schritt gültige Koordinaten stellt die dann durch
    //putBattleshipsInTable() in die Tabelle eingefügt werden.
    //@variable jsonCoordinates returned ein Json mit gültigen anfangs Koordinaten
    for(var i=0;i<1;i++){

  //    alert("IM LOOP BEI SETSHIPS. DURCHLAUF: "+i);
      let jsonCoordinates =  makeCoordinates(arrayOfShips[i]);
   //alert("IN LOOP BEI SETSHIPS, GUELTIGE KOORDINATE ERSTELLT. ROW: "+jsonCoordinates.row+" COLUMN: "+jsonCoordinates.column+" DIRECTION: "+jsonCoordinates.shipDirection+" SIZE: "+jsonCoordinates.size);

      putBattleshipsInTable(jsonCoordinates);
    //  alert("SCHIFF ERSTELLT UND EINGEFÜGT! SCHIFFGROESE: "+arrayOfShips[i]);

    }
  }
}


//Funktion die Koordinaten, durch Zufallszahlen erstellt
function makeCoordinates(shipSize){

//  alert("BEI makeCoordinates            row:"+randomROW+" column:"+randomCOLUMN+" direction:"+direction);
  //prüft ob die Anfangskoordinaten gültig sind und fragt ab ob horizontal
  //oder vertikal eingefügt werden soll. Funktion checkPositionIsOK ist der
  //letzte Aufruf zum Bestätigen
  //alert("IN makeCoordinates VOR puttingOK. ROW: "+randomROW+", COLUMN: "+randomCOLUMN);
  var isOK = false;
  var freeCoordinates = null;
  while(isOK == false) {
    //Zufalllsazheln werden erstellt
    var randomCOLUMN = Math.floor((Math.random() * 10));
    var randomROW = Math.floor((Math.random() * 10));
    //erstellt horizontal oder vertikal Positionierung
    let direction = checkDirection();
  //  alert("IN LOOP MIT ROW:"+randomROW+"    COLUMN:"+randomCOLUMN);


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
            //  alert("KOORDINATEN:    row:"+freeCoordinates.row+"   column:"+freeCoordinates.column+"   direction:"+freeCoordinates.shipDirection+"   size:"+freeCoordinates.size);
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
    //alert("in checkPositionIsOK. ROW: "+rowNumber+"COLUMN: "+columnNumber+"SIZE: "+shipSize+"DIRECTION: "+direction);

    //wenn Startkoordinaten frei und aussenrum alles frei ist kann angefangen werden,
    //zu setzen
    if(isFree(rowNumber, columnNumber) && checkAround(rowNumber, columnNumber)){
      //alert("in checkPosition hinter if 1");
      //für horizontale Positionierung
      if(direction == 1){
          var flag = true;
          for(var i=0;i<shipSize;i++){
    //        alert("aufruf für flag 1. DURCHLAUF:"+i);
    //alert("in checkPosition vor if2")
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

  //alert("BEI isFree           ROW:"+rowNumber+" COLUMN:"+columnNumber);
//  alert("in isFree. ROW: "+rowNumber+" COLUMN: "+columnNumber);
  let rowElement = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber];
//  alert(rowElement.firstChild);
//  alert("typ:"+(rowElement.lastChild));
  //prüft ob ein "|" in der Zelle enthalten ist. "|" = leer, ansonsten ist es gefüllt.
  //alert("CELLTEXT: "+cellText);
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



function checkAround(rowNumber, columnNumber){
  //alert("IN CHECKAROUND. ROW: "+rowNumber+" COLUMN: "+columnNumber);
/*
  let table = this.gameBoard_My.getElementsByTagName('table')[0];
  let tableBody = table.getElementsByTagName('tbody')[0];
  let tableROWS = tableBody.getElementsByTagName('tr')[rowNumber];
  let rowElement= tableROWS.getElementsByTagName('td')[columnNumber];
*/
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
//  alert("IN PUTBATTLESHIP");

  //alert("direction:"+jsonCoordinates.shipDirection);
  //Zellen befüllen die horizontal angeordnet sind (Direction == 1)
  //alert("DIRECTION IN PUTBATTLESHIP: "+jsonCoordinates.shipDirection+"    SIZE:"+jsonCoordinates.size);
  if(jsonCoordinates.shipDirection == 1){
    //  alert("IN LOOP BEI PUTBATTLESHIP (direction1). MIT SHIPSIZE: "+jsonCoordinates.size);
      for(var i=0;i<jsonCoordinates.size;i++){
      //  alert("X IN DIE ZELLE SCHREIBEN (Horizontal). DURCHLAUF:"+i);
        markCellWithX(jsonCoordinates.row, jsonCoordinates.column + i);
        //let tableCellNextSpace = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[jsonCoordinates.row].getElementsByTagName('td')[jsonCoordinates.column + i].appendChild(cellText);
        //this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[jsonCoordinates.row].getElementsByTagName('td')[jsonCoordinates.column + i] = tableCellNextSpace;
      }
  }
  //Zellen befüllen die vertikal angeordnet sind (Direction == 0)
  else{
      //alert("IN LOOP BEI PUTBATTLESHIP (direction0). MIT SHIPSIZE: "+jsonCoordinates.size);
    for(var i=0;i<jsonCoordinates.size;i++){
      //alert("X IN DIE ZELLE SCHREIBEN (Vertikal). DURCHLAUF:"+i);
      markCellWithX(jsonCoordinates.row + i, jsonCoordinates.column);
      //let tableCellNextSpace = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[jsonCoordinates.row + i].getElementsByTagName('td')[jsonCoordinates.column].appendChild(cellText);
      //this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[jsonCoordinates.row + i].getElementsByTagName('td')[jsonCoordinates.column + i] = tableCellNextSpace;
    }
  }
}

function markCellWithX(rowNumber, columnNumber){
  let cellText = document.createTextNode(" X");
  if(rowNumber<0 || rowNumber>9 || columnNumber<0 || columnNumber>9){
    alert("negativeZahl!! row:"+rowNumber+" columnNumber:"+columnNumber);
  }else{

  let replaceCell = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].lastChild;
  let tableCell = this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber].replaceChild(cellText,replaceCell);
  this.gameBoard_My.getElementsByTagName('table')[0].getElementsByTagName('tr')[rowNumber].getElementsByTagName('td')[columnNumber] = tableCell;
  }
}

/*
  alert("WERT: "+tableCell.textContent);
  let cell = tableCell.appendChild(cellText);
  this.gameBoard_My.getElementsByTagName('table')[0] = table;
  for(var i=0;i<cell.length;i++){
    alert("KindTyp: "+cell[i]);
  }
  //alert(tableROWS.getElementsByTagName('td')[jsonCoordinates.column].data);
  alert("HAT KINDER: "+table.textContent);
*/




//Funktion um die Direction zu erstellen. Erstellt eine Zufallszahl "random", bis 10.
//bei gerader Zahl ist die Direction hrizontal, ansonsten vertikal
function checkDirection(){
  //alert("IN CHECKDIRECTION");
  var random = Math.floor((Math.random() * 10) + 1);
  if((random%2) == 0){
    //alert("IN DIRECTION MIT ERGEBNIS: 1");
    return 1;
  }else{
    //alert("IN DIRECTION MIT ERGEBNIS: 0");
    return 0;
  }
}

//Funktion um befüllte Zellen zu speichern um so das Positionieren zu vereinfachen
//Hier werden natürlich nur die Anfangskoordinaten gespeichert.
function isInMemoryOfPositions(rowNumber, columnNumber){
//  alert("row:"+rowNumber+"    column:"+columnNumber);

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
/*
  if(this.positionMemory.find([""+rowNumber,""+columnNumber])) {
    alert("false:"+this.positionMemory);
    return false;
  }else{
    this.positionMemory.push([""+rowNumber,""+columnNumber]);

    alert("true:"+this.positionMemory);
    return true;

  }
  //nur zu Sicherheit! Darf vom Code niemals erreicht werden.
  //alert("FEHLER IN MEMORYOFPOSITION");
*/
  return isInside;
}
function showHighscore(){

}

function fire(row,column){
  coordinateFire.row = document.getElementById('rowCoordinate').value;
  coordinateFire.column = document.getElementById('columnCoordinate').value;

  var xhr = new XMLHttpRequest();
  console.log(fireROW, fireCOLUMN);
  xhr.open('POST', 'http://localhost:3000/fire/', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(JSON.stringify(coordinateFire));
  xhr.onload = function(){
    alert(this.coordinateFire);
  }

}
  function loadHighScore(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:3000/highscore/top5', true);
    xhr.responseType = 'json';
    var arrayHighscore;
    xhr.onreadystatechange = function() {
      var data = xhr.response;
      arrayHighscore = xhr.response;
      if (data !== null && xhr.status == 200) {
        console.log(JSON.stringify(data)); // Parsed JSON
        this.currentHighScore = JSON.stringify(data);
        alert(this.currentHighScore);
      }else{
        console.log("FEHLER"+xhr.status);
      }
    };
    xhr.send();
  }

  function setHighscore(){
    // highscore.point=1;
    var xhr = new XMLHttpRequest();
    console.log(highscoreJson);
    xhr.open('POST', 'http://localhost:3000/highscore/postHighscore', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(highscoreJson));
    xhr.onload = function(data){
      console.log(data);
      this.newHighScore = xhr.response;
      alert(this.newHighScore);
    }
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
