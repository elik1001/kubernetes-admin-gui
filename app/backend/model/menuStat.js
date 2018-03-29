const mongoose = require('mongoose');

const MenuStatSchema = mongoose.Schema({
  menuItem: {
    type: String,
    require: true,
  },
  menuActive: {
    type: Boolean,
    require: true,
  },
});

const MenuStat = module.exports = mongoose.model('MenuStat', MenuStatSchema);
