
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
  for(var i=0; i<array.length; i++){
    a[i] = new Array(10);
    }
  for(var i=0;i<array.length;i++){
    for(var k=0;k<10;k++){
      a[i][k] = "<div id='spielfeld${counter}'>geht</div>";
    }
  }
  gameBoard = array;
}
