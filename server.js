const express = require('express');
const server = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const iptv = require('./endpoints/iptv')
const highscore = require('./endpoints/highscore');
const fire = require('./endpoints/fire');

//Allow post requests via JSON and cross origin
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors());

//Register server endpoints
server.use('/iptv', iptv);
server.use('/highscore', highscore);
server.use('/fire', fire);


server.listen(3000, () => {
  console.log("LimeTV Server Running on localhost:3000");
});
