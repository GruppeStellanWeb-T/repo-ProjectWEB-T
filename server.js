
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
let player2;
let gamer = [];
let anzahlGamer = 0;

const Highscore = {
      'eins' : "",
      'zwei' : "",
      'drei' : "",
      'vier' : "",
      'fuenf': ""
}

io.on('connection', function(socket){



      function messageSink(){

      }

      function messageHit(){

      }

      function checkNewInHighscore(){

      }

      function disconnectFromServer(){

      }

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
            return true;
          }else{
            false;
          }

        }


  //PROTOTYP
  // io.on('connection', function(socket){
  //   console.log("BITSSSSSCH HIER BIN IHHH");
  // });

  socket.on('coordinateFire', function(msg){
    console.log('in Server bei coordinateFire(): ' + JSON.stringify(msg));
    shootCoordinate = msg;
    var accomplishedHit = checkHit(shootCoordinate);
    if(accomplishedHit == true){
      console.log('Getroffen? : ' + accomplishedHit);
      socket.emit('coordinateFire', {
                                      'hit:' : accomplishedHit,
                                      'shooter' : shootCoordinate['name']
                                    });
    }else{

    }
    //weiterleitung an einen anderen
    // socket.emit('coordinateFire', {'msg': 'in coordinate_fire'})
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
          player1 = gamer[0];
          player2 = gamer[1];
          anzahlGamer++;
          console.log('player1: ' + player1['name']);
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
    socket.on('getHighscore', function(msg){
      // socket.emit('getHighscore',HighScore);
    });
    socket.on('sendHitMessage', function(msg){
      // console.log('message: ' + ***);
      // socket.emit('sendHitMessage',{'msg': 'in put_board'})
    });
    socket.on('sendEnemy', function(msg){
      // console.log('message: ' + ***);
      // socket.emit('sendEnemy',{'msg': 'in put_board'})
    });
    socket.on('sendWinnerAndHighscore', function(msg){
      // console.log('message: ' + ***);
      // socket.emit('sendWinnerAndHighscore',{'msg': 'in put_board'})
    });
    socket.on('placeCell', function(msg){

      console.log('message: ' + JSON.stringify(msg));
      // socket.emit('sendEnemy',{'msg': 'in put_board'})
    });

// socker.on('disconnect')

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});



// const path = require('path');
//
// const cors = require('cors');
// const bodyParser = require('body-parser');
//
// const iptv = require('./endpoints/iptv')
// const highscore = require('./endpoints/highscore');
// const fire = require('./endpoints/fire');
// const map = require('./endpoints/map');



//Allow post requests via JSON and cross origin
// server.use(bodyParser.urlencoded({ extended: false }));
// server.use(bodyParser.json());
// server.use(cors());

//Register server endpoints
// server.use('/iptv', iptv);
// server.use('/highscore', highscore);
// server.use('/fire', fire);
// server.use('/map', map);



// server.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/index.html'));
// });
//


// server.listen(3000, () => {
//   console.log("LimeTV Server Running on localhost:3000");
// });
