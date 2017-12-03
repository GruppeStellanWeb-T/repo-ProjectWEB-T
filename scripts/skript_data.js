
//Globale Variablen, sollen die in diesem Scope sein?
let spieler1;
let spieler2;
let gameBoard;

//Warum JQuery?
$(document).ready(function(){
    $("#myModal").modal('show');
});

function spielerSpeichern(){
	//warum KEIN JQuery?
  spieler1 = document.getElementById('nameSpieler1').value;
  spieler2 = document.getElementById('nameSpieler2').value;
	//Warum JQuery?
	    $("#myModal").modal('hide');
    printOutSpielername();
}

function erneutSpielerEingeben(){
  //Warum?
  alert("lalala");
	//Warum JQuery?
  $("#myModal").modal('show');

}
function printOutSpielername(){
	//Warum KEIN Jquery?
  document.getElementById('ausgabeSpieler1').innerHTML = spieler1;
  document.getElementById('ausgabeSpieler2').innerHTML = spieler2;
}

function spielfeldErstellen(){
	var array = new Array(10);
	var counter;

	//one double for is enough, "first" for was redundant
	for(var i=0;i<array.length;i++){
		a[i] = new Array(10);
		for(var k=0;k<10;k++){
			//why all these divs? for what?
			a[i][k] = "<div id='spielfeld${counter}'>geht</div>";
		}
	}
	gameBoard = array;
}

var makeBoard = function makeBoard(boardID,size) {
	//reference, where to put field
	var board = document.getElementById(boardID);

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
			var cellText = document.createTextNode('ROW: '+i+' COLUMN: '+j);
			//DEMO END
			cell.appendChild(cellText);
			row.appendChild(cell);
		}
		tblBody.appendChild(row);
	}
	tbl.appendChild(tblBody);
	board.appendChild(tbl);
	//DEMO Start
	tbl.setAttribute('border','2');
	//DEMO End
};

//call function with parameters, when page is done loading
window.onload = function () {

	makeBoard('gb1',10);
	makeBoard('gb2',10);
};

