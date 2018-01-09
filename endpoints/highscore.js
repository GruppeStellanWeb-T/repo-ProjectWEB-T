const express = require('express');
const highscore = express.Router();
// const cors = require('cors');
// highscore.use(cors());


 let highscores = [{"player": 'anu', 'score': 45},{"player": 'juchi', 'score': 35},{"player": 'Gensheimer', 'score': 5},{"player": 'rich', 'score': 15},{"player": 'can', 'score': 25}];


//res=an den browser schicken
//req=was ich vom browser bekomme
//Service Ping
highscore.get('/ping', (req, res) => {
  res.json({"message": "highscore OK"});
});

highscore.get('/top5', (req, res) => {

  console.log(highscores);
  res.json(highscores);
});

//req muss JSON mit playername und punkte sein
highscore.post('/postHighscore', (req, res) => {
  // console.log(req.body);
  highscores.push(req.body);
  highscores.sort(function(a,b){return a.score-b.score});
  highscores.pop();
  console.log(highscores);
  // console.log(req.body);
  // let data = JSON.parse(req.body);
  res.setHeader('Content-Type', 'application/json');
  res.json(highscores);

  });

module.exports = highscore;

//iptv.get
