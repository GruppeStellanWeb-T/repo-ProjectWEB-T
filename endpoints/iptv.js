const express = require('express');
const iptv = express.Router();

//Service Ping
iptv.get('/ping', (req, res) => {
  res.json({"message": "IPTV OK"});
});

module.exports = iptv;
