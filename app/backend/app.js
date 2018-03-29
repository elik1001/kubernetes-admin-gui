var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var cors = require('cors');

var app = express();

const route = require('./route/routes');

mongoose.connect('mongodb://localhost:27017/kubconfig');

mongoose.connection.on('connected', ()=> {
  console.log('Mongodb connected');
});

mongoose.connection.on('Error', (err)=> {
  console.log(err);
});

const port = 3000;

app.use(cors());

app.use(bodyparser.json());

app.use('/api', route);

app.get('/', (req, res)=> {
  res.send('lucky');
});

app.listen(port, ()=> {
  console.log('server started on port: ' + port);
});
