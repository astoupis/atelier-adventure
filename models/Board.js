const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BoardSchema = new Schema({
    name: {type: String, required: true},
    users: {type: Array, required: true},
    lists: {type:Array, default:[], required: true}  
});

// TODO
// change Model
mongoose.model('Board', BoardSchema);