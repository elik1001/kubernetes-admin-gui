var express = require('express');
var router = express.Router();

const Server = require('../model/serverList');

// get kube server
router.get('/servers', (req, res, next)=> {
  //res.send('get_server');
  Server.find(function (err, servers) {
    if (err) {
      res.json(err);
    } else {
      res.json(servers);
    }
  });
});

// post kub server
router.post('/server', (req, res, next)=> {
  let newServer = new Server({
    serverName: req.body.serverName,
    serverIp: req.body.serverIp,
  });
  newServer.save((err, server) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Add neww server: ' + server);
    }
  });
});

// update
router.put('/server/:id', (req, res, next)=> {
  Server.findOneAndUpdate({ _id: req.params.id }, {
    $set: {
      serverName: req.body.serverName,
      serverIp: req.body.serverIp,
    },
  },
  function (err, result) {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

// delete
router.delete('/server/:id', (req, res, next)=> {
  Server.remove({ _id: req.params.id }, function (err, result) {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
