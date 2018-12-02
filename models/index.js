/** @module models/index.js
* Loads all models
*/
'use strict';

const mongoose = require('mongoose');

require('./User');
require('./Task');
require('./Board');
require('./List'); 

module.exports = {
  'User' : mongoose.model('User'),
  'Task' : mongoose.model('Task'),
  'Board': mongoose.model('Board'),
  'List' : mongoose.model('List')
}

