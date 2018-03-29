const mongoose = require('mongoose');

const ServerNameSchema = mongoose.Schema({
  serverName: {
    type: String,
    require: true,
  },
  serverIp: {
    type: String,
    require: true,
  },
});

const Server = module.exports = mongoose.model('Server', ServerNameSchema);
