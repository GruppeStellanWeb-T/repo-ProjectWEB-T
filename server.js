
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/styles/myCSS.css', function(req, res) {
  res.sendFile(path.join(__dirname + '/styles/myCSS.css'));
});

app.get('/scripts/skript_data.js', function(req, res) {
  res.sendFile(path.join(__dirname + '/scripts/skript_data.js'));
});

app.get('/BG.jpg', function(req, res) {
  res.sendFile(path.join(__dirname + '/BG.jpg'));
});








//JASON Attribute
let shootCoordinate;
let player1;
let player1Name;
let player2Name;
let player2;
let gamer = [];
let anzahlGamer = 0;
let arrayOfCoordinatesAll = [];
let busted;
let flagGamer;


const highscore = [[],[],[],[],[]];




io.on('connection', function(socket) {


  //meinen Gegner
  function shipDown(msg){
    for(var i=0;i<msg['coordinates'].length;i++){
      var vergleichZwei = msg['coordinates'][i];
      console.log("in shipDown: "+vergleichZwei);
      console.log("in shipDown, länge: "+vergleichZwei.length);

      for(var j=0;j<vergleichZwei.length;j++){
        var vergleichDrei = vergleichZwei[j]
        console.log("in shipdown: "+vergleichDrei);
        if(vergleichDrei[0] == shootCoordinate['row'] && vergleichDrei[1] == shootCoordinate['column']){
          console.log("in shipDown. vergleichdrei[0]="+vergleichDrei[0]+" vergleichDrei[1]="+vergleichDrei[1]);
          busted = true;
          shipCounter(vergleichZwei.length, msg['name']);
          checkSinked(msg['name']);
        }else{
          busted = false;
        }
      }
    }
  }

  //Gegner Name
  function shipCounter(laenge, name){
    var check=null;
    for(var i=0;i<2;i++){
      if(gamer[i]['name'] == name){
          check=i;
      }
    }
    for(var i=0;i<gamer[check]['ships'].length;i++){

      if ( (gamer[check]['ships'][i][0]['size'] == laenge) && ((gamer[check]['ships'][i][0]['counter']) < (gamer[check]['ships'][i][0]['size']))) {
              console.log("in shipcounter vorher: "+JSON.stringify(gamer[check]['ships']));
              gamer[check]['ships'][i][0]['counter']++;
              console.log("in shipcounter nachher: "+JSON.stringify(gamer[check]['ships']));
              break;
      }
    }
  }

  let sinkedBoolean;


  function checkSinked(enem){
    console.log("IN CHECKSINKED");
    var check = null;
    for(var i=0;i<2;i++){
      if(gamer[i]['name'] == enem){
          check=i;
      }
    }
    console.log("WAS KOMMT DA REIN\n\n\n"+JSON.stringify(gamer[check]['coordinates'])+"\n\n"+JSON.stringify(gamer[check]['ships']));
    for(var i=0;i<gamer[check]['ships'].length;i++){
      console.log("size:"+JSON.stringify(gamer[check]['ships'][i][0]['size'])+" counter:"+JSON.stringify(gamer[check]['ships'][i][0]['counter']));
      if(gamer[check]['ships'][i][0]['size'] == gamer[check]['ships'][i][0]['counter']){
        console.log("ships vorher:"+  JSON.stringify(gamer[check]['ships']));
        gamer[check]['ships'].splice(i, 1);
        console.log("ships nachher;"+  JSON.stringify(gamer[check]['ships']));
           sinkedBoolean = true;
           break;
      }else{
        sinkedBoolean = false;
      }
    }
}


      //name vom Schützen und deine Koordinaten des schusses
      function checkHit(){
        var check = null;
        if(gamer[0] != undefined && gamer[1] != undefined){
            for(var i=0;i<2;i++){
              console.log('im loop');
              if(gamer[i]['name'] != shootCoordinate['name']){
                  check=i;
              }
            }
          }else{
            return false;
          }
          var victimBoard = gamer[check]['board'];
          var shooterX = shootCoordinate['row'];
          var shooterY = shootCoordinate['column'];

          if(victimBoard[shooterX][shooterY] == 1){
            //Gegner
            shipDown(gamer[check]);
            return true;
          }else{
            victimBoard[shooterX][shooterY] == 2;
            return false;
          }
          // gamer[check]['score']++;
      }



      function checkEnemy(msg){
        var check = null;
        console.log('msg: ' + JSON.stringify(msg));
            if(gamer[0] != undefined && gamer[1] != undefined){
                for(var i=0;i<2;i++){
                  // console.log('im loop');
                  if(gamer[i]['name'] != msg['name']){
                      check=i;
                  }
                }
                console.log('enemy ' + gamer[check]['name']);
                return gamer[check]['name'];
              }else{
              }
      }
      function checkWinner(msg){
        var winnerName = msg['name'];
        var check = null;
         for(var i=0;i<2;i++){
            // console.log('im loop');
            if(gamer[i]['name'] == winnerName){
                check=i;
            }
          }

        console.log('vor if gamer: '+JSON.stringify(gamer[check]));
        if(gamer[check]['counter'] == 0){
          checkHighscore(gamer[check]);
          console.log("in if bei winnerGamer");
          io.emit('sendWinnerAndHighscore', {
                                                            'winner' : gamer[check]['name'],
                                                            'score' : gamer[check]['score'],
                                                            'highscore' : highscore
                                                          });
        }else{
          console.log("WTF!!!");
        }

      }

      function checkHighscore(msg){
        var check = null;
        console.log('in checkHighscore beim Server:'+msg['name']);
        var gamerData = {'name': msg['name'], 'score': msg['score']};
        var toPutInHighscore = null;
        for(var i=0;i<5;i++){
          var highscoreArrayinArray = highscore[i];
          var highscoreValue = highscoreArrayinArray['score']

          console.log("im Loop bei checkHighscore()");
          console.log("highscorevalue: "+highscoreValue);
          console.log("Stelle im Array: "+ 1);
          console.log("highscore: "+highscore);

          if((msg['score'] < highscoreValue) || (highscoreValue == undefined)){
            console.log('highscore im Server: ' + highscore);
            toPutInHighscore = i;
            break;
          }
        }
        highscore.splice(i, 0, gamerData);

      }


  //PROTOTYP
  // io.on('connection', function(socket){
  //   console.log("BITSSSSSCH HIER BIN IHHH");
  // });

  socket.on('beginner', function(){
    console.log("FLAGGAMER:" + flagGamer);
    io.emit('beginner', flagGamer);
  });


  socket.on('coordinateFire', function(msg){
      if(msg['name'] == flagGamer){
            console.log('in Server bei coordinateFire(): ' + JSON.stringify(msg));
            //name vom Schützen beinhaltet
            shootCoordinate = msg;
            var accomplishedHit = checkHit(shootCoordinate);
            var check = null;
            for(var i=0;i<2;i++){
              // console.log('im loop');
              if(gamer[i]['name'] == shootCoordinate['name']){
                  check=i;
              }
            }
            if(accomplishedHit == true){
              gamer[check]['counter']--;
              gamer[check]['score']++;
              console.log("pass counter--");
              console.log('counter: '+gamer[check]['counter']);
              console.log("BOOLEAN FÜR ABGEBLLERT="+sinkedBoolean);
              socket.emit('coordinateFire', {
                                              'hit' : accomplishedHit,
                                              'shooter' : shootCoordinate['name'],
                                              'row' : shootCoordinate['row'],
                                              'column' : shootCoordinate['column'],
                                              'sinked' : sinkedBoolean
                                            });
              sinkedBoolean=false;
              console.log('Getroffen? : ' + accomplishedHit+'  Gegner: '+checkEnemy(msg)+'  Shooter: '+shootCoordinate['name']);
            }else{
                gamer[check]['score']++;
              socket.emit('coordinateFire', {
                                              'hit' : accomplishedHit,
                                              'shooter' : shootCoordinate['name'],
                                              'row' : shootCoordinate['row'],
                                              'column' : shootCoordinate['column']
                                            });
              console.log('Getroffen? : ' + accomplishedHit+'  Gegner: '+checkEnemy(msg)+'  Shooter: '+shootCoordinate['name']);
            }

            var check = null;
            for(var i=0;i<2;i++){
              if(gamer[i]['name'] != msg['name']){
                  check=i;
              }
            }
            flagGamer = gamer[check]['name'];
            io.emit('beginner', flagGamer);
            console.log("vor checkWinner");
            checkWinner(shootCoordinate);
      }else{

        socket.emit('wait', {'msg':'warte bis der Gegner geschossen hat'})
      }

  });

    socket.on('putBoard', function(msg){
      console.log('in Server bei putBoard: ' + JSON.stringify(msg));
      player1Map = msg.body;
    });

    socket.on('putGamer', function(msg){
      console.log('putGamer: ' + {'msg' : 'in putGamer'});
      console.log('in Sever bei putGamer(): ' + JSON.stringify(msg));
      if(anzahlGamer<2){
          gamer.push(msg);
          console.log('Gamer gepushed in Array ' + JSON.stringify(gamer));
        if(gamer.length==1){
          player1 = gamer[0];
          player1Name=gamer[0]['name'];
          flagGamer=player1Name;
        }
        if(gamer.length == 2){
          player2 = gamer[1];
          player2Name=gamer[1]['name'];
        }
          anzahlGamer++;
          console.log('player1: ' + player1['name']);
          console.log('player1: ' + player1['counter']);
      }else{
        socket.emit('putGamer', {'status': false });
      }


      //entscheiden wer Spieler1 oder Spieler2 ist
      if(gamer === undefined){
        player1 = JSON.stringify(msg);
      }else{
        player2 = JSON.stringify(msg);
      }



    });
    socket.on('getEnemy', function(msg){
      //Gegner verschicken
      if(anzahlGamer == 2){
        var enemy = checkEnemy(msg);
        console.log('enemy: ' + enemy);
        socket.emit('putGamer', {'enemyName' : enemy});
      }
      // socket.emit('getHighscore',HighScore);
    });
    socket.on('getHighscore', function(msg){
      console.log('im Server bei getHighscore '+ JSON.stringify(highscore));
      socket.emit('getHighscore', {highscore});
      // socket.emit('getHighscore',HighScore);
    });

    socket.on('closeGame', function(msg){
      console.log("Spieler ist draussen");
      io.close();
    });

    socket.on('sendWinnerAndHighscore', function(msg){

    });
    socket.on('wait', function(msg){

    });
    socket.on('placeCell', function(msg){

      console.log('message: ' + JSON.stringify(msg));
      // socket.emit('sendEnemy',{'msg': 'in put_board'})
    });
    socket.on('putNewName', function(msg){
      var check = null;
      for(var i=0;i<2;i++){
        // console.log('im loop');
        if(gamer[i]['name'] == msg['oldName']){
            check=i;
        }
      }
      gamer[check]['name'] = msg['newName'];
      socket.broadcast.emit('putGamer', {'enemyName' : msg['newName']});
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000.\nWelcome to the BattleShip Server!!\nROCK ON...!');
});

const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const iptv = require('./endpoints/iptv');
const fire = require('./endpoints/fire');
const map = require('./endpoints/map');
