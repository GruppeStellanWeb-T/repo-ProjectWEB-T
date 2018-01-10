const express = require('express');
const map = express.Router();
// const cors = require('cors');
// highscore.use(cors());

let mappingPlayer1 = null;
let mappingPlayer2 = null;
let player;
let player1 ={
  name : "null",
  hash : 0
}
let player2 = {
  name : "Gegner",
  hash : 0
};

let coordinate;
let shootCoordiate = {
  row:"",
  column:""
}

//res=an den browser schicken
//req=was ich vom browser bekomme
map.post('/set_player', (req, res) =>{
  console.log("im Server"+JSON.stringify(req.body));
  console.log("body vom req"+JSON.stringify(req.body));
  var player = (JSON.stringify(req.body));
  player1 = player;
  console.log(JSON.stringify(player1));
  // console.log("cPlyer" + currentPlayer);
  // console.log("name:" + currentPlayer[name]);
  // if(player1["name"] == "null"){
  //   player1 = JSON.stringify(req.body);
  // }else{
  //   player2=JSON.stringify(req.body);
  // }

  // console.log("spieler 1: " +player1[name]+"  hashCode:"+player1[hash]);
  // console.log("spieler 2: " +player2[name]+"  hashCode:"+player2[hash]);
  res.setHeader('Content-Type', 'application/json');
  res.json({"message": "in post name"});
});

map.get('/get_name', (req, res) => {

  console.log("Spieler2 Attribut:"+player2.name);
  console.log(player2);
  res.json(player2);
});


//Service Ping
map.get('/ping', (req, res) => {
  console.log(this.map);
  res.json({"message": "map OK"});
});

map.get('/get_enemy_Board', (req, res) => {
  console.log(this.map);
  res.json();
});

function shoot(){
  if(player1 == true){
    // if(mappingPlayer2[coordinate.row][coordinate.column] ==
  }else{

  }
}

//req muss JSON mit playername und punkte sein
map.post('/post_my_Board', (req, res) => {

  console.log("im Server");
  console.log(req);
  mappingPlayer1 = req.body;

  res.setHeader('Content-Type', 'application/json');
  res.json({"message": "in post map"});

  });

  map.post('/set_fire', (req, res) => {
    console.log(req.body);
    coordinate = req.body;
    shoot();
    res.setHeader('Content-Type', 'application/json');
    res.json({'msg': 'success'});
  });

  map.get('/get_Fire', (req, res) => {
    res.json(coordinate);
  });

module.exports = map;
