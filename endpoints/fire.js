const express = require('express');
const fire = express.Router();
// const cors = require('cors');
// highscore.use(cors());

const coordinate = {
  row: 1,
  column: 1
}

function makeCoordinate(){

}
//Service Ping
fire.post('/ping', (req, res) => {
  res.json({"message": "fire is ok"});
});

fire.post('/', (req, res) => {
  console.log(req.body);
  res.setHeader('Content-Type', 'application/json');
  res.json({'msg': 'success'});
});

fire.get('/getFire', (req, res) => {
  res.json(coordinate);
});

module.exports = fire;
