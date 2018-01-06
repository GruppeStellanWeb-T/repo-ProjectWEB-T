
//Globale Variablen, sollen die in diesem Scope sein?
let spieler1;
let spieler2;
let gameBoard_My;
let gameBoard_Enemy;
var positionMemoryROW;
var positionMemoryCOLUMN;

var ships = {
  schlachtschiff: 5,
  kreuzer: 4,
  zerstörer: 3,
  // u-boote: 2
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


	//create elements <table> and a <tbody>
	var tbl = document.createElement('table');
	var tblBody = document.createElement('tbody');

	//create cells
	for ( var i = 0; i < size; i++) {
		var row = document.createElement('tb');

		for ( var j = 0; j < size; j++) {
			var cell = document.createElement('tc');

			//DEMO Start
			//var cellText = document.createTextNode('cell is row: ' + i + ' column: ' + j );
			var cellText = document.createTextNode(i+'|'+j);
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
  alert("HIER BIN ICH IN SETSHIPS");
  if((coordinatesInTableROW[0] && coordinatesInTableCOLUMN[0])==null){
    //arrays mit den Größen der Schiffe. Kann man aber umstellen auf
    //Json- Bezug. Ist vielleicht schöner. Speicher wird damit gespart
    let arrayOfShips = [5, 4, 3, 2];
    //erstellt horizontal oder vertikal Positionierung
    alert("VOR DIRECTION IN SETSHIP");
    let direction = checkDirection();
    //Schleife die bei jedem Schritt gültige Koordinaten stellt die dann durch
    //putBattleshipsInTable() in die Tabelle eingefügt werden.
    //@variable jsonCoordinates returned ein Json mit gültigen anfangs Koordinaten
    alert("JETZT HAB ICH EINE DIRECTION" + direction);
    for(var i=1;i<10;i++){
      let jsonCoordinates =  makeCoordinates(arrayOfShips[i], direction);
      alert("IN LOOP BEI SETSHIPS, KOORDINATE ERSTELLT");
      putBattleshipsInTable(this.gameBoard, jsonCoordiates);
    }
  }
}

//Funktion die Koordinaten, durch Zufallszahlen erstellt
function makeCoordinates(shipSize, direction){
alert("IN makeCoordinates");
  //Zufalllsazheln werden erstellt
  var randomCOLUMN = Math.floor((Math.random() * 10) + 1);
  var randomROW = Math.floor((Math.random() * 10) + 1);
  //prüft ob die Anfangskoordinaten gültig sind und fragt ab ob horizontal
  //oder vertikal eingefügt werden soll. Funktion checkPositionIsOK ist der
  //letzte Aufruf zum Bestätigen
  alert("IN makeCoordinates VOR puttingOK. row: "+randomROW+", column: "+randomCOLUMN);
  if(direction==1){
    var puttingOK = checkPositionIsOK(randomROW, randomCOLUMN, shipSize, 1);
  }else{
    var puttingOK = checkPositionIsOK(randomROW, randomCOLUMN, shipSize, 0);
  }
  //abfrage was returned wird. Bei "True" von puttingOK wird das gültige JSON
  //returned. Bei "false", geht die Funktion in die Rekursion und erstellt
  //wieder neue Zufalsszahlen
  if(puttingOK == true){
    //JSON wird gefüllt mir Werten aus der Funktion makeCoordinates
    return   freeCoordinates = {
                    row: randomROW,
                    column: randomCOLUMN,
                    direction: direction,
                    size: shipsize
                  };
  }else{
    makeCoordinates(shipSize,direction);
  }
}

//Funktion prüft ob Felder frei zu den passenden Anfangskoordinaten sind
//Geht mit zwe for-loops durch die Zeilen und Spalten und ruft dabei isFree() auf.
//@return flag, gibt die Zelle an makeCoordinates() frei, als Startpunkt der
//Positionierung
function checkPositionIsOK(rowNumber, columnNumber, shipSize, direction){
    alert("in checkPositionIsOK");
    if(isFree(rowNumber, columnNumber)){
      //für horizontale Positionierung
      if(direction == 1){
          var flag = true;
          for(var i=0;i<shipSize;i++){
            flag = isFree(rowNumber, columnNumber+1);
          }
          return flag;
      }
      //für vertikale Positionierung
      else{
        var flag = true;
        for(var i=0;i<shipSize;i++){
          flag = isFree(rowNumber+1, columnNumber);
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
  alert("in isFree");
  //let currentValue = this.gameBoard_My.board.getAttribute(0,5);
/*
  let currentValueROW = this.gameBoard_My.getElementsByTagName('table');
  let currentValueCOLUMN = this.gameBoard_My.getElementsByTagName('tbody');
  let currentCellValueROW = currentValueROW.getElementsByTagName("row:"+rowNumber);
  let currentCellvalueCOLUMN = currentValueCOLUMN.getElementByTagName("column:"+columnNumber);
*/
  let currentValueROW = this.gameBoard_My.getElementsByTagName('tr')[1];
  let currentValueCOLUMN = this.gameBoard_My.getElementsByTagName('tc')[0];
  //prüft ob ein "|" in der Zelle enthalten ist. "|" = leer, ansonsten ist es gefüllt.
  alert("nach currentvalue in isFree "+ currentValueROW + ", " + currentValueCOLUMN);
  if( currentValue.includes("|")){
    return true;
  }else{
    return false;
  }
  alert("FEHLER IN ISFREE");
  //@return null, nur zur Sicherheit. Theoretisch sollte es nicht aufgerufen werden
  return null;
}


//FUNKTION UM DIE TABLLEN MIT DEN SCHIFFEN ZU FÜLLEN
function putBattleshipsInTable(boardID, jsonCoordinates){
  this.gameBoard_My.rows[jsonCoordinates.row].cells[jsonCoordinates.column].cellText.replaceData(0, 5, "X");

}

//Funktion um die Direction zu erstellen. Erstellt eine Zufallszahl "random", bis 10.
//bei gerader Zahl ist die Direction hrizontal, ansonsten vertikal
function checkDirection(){
  alert("IN CHECKDIRECTION");
  var random = Math.floor((Math.random() * 10) + 1);
  if((random%2) == 0){
    return 1;
  }else{
    return 0;
  }
}

//Funktion um befüllte Zellen zu speichern um so das Positionieren zu vereinfachen
//Hier werden natürlich nur die Anfangskoordinaten gespeichert.
function memoryOfPositions(rowNumber, columnNumber){
  if(this.positionMemoryROW.isInArray(rowNumber) && this.positionMemoryCOLUMN.isInArray(columnNumber)){
    return false;
  }else{
    this.positionMemoryROW.push(rowNumber);
    this.positionCOLUMN.isInArray.push(columnNumber);
    return true;
  }
  //nur zu Sicherheit! Darf vom Code niemals erreicht werden.
  alert("FEHLER IN MEMORYOFPOSITION");
  return null;
}


/**
 * ENDE DER FUNKTIONEN FÜR AUTOMATISCHES AUFLADEN DER SCHIFFE
 */

//Call-Funktion die auftaucht sobald die Seite fertig geladen ist. SetShips
window.onload = function () {

	makeBoard('gb1',10);
	makeBoard('gb2',10);
  //Automatische Generieren der Schiffe in gameBoard_My
  setShips();
};
