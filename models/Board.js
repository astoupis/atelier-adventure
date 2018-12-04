const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BoardSchema = new Schema({
    name: {type: String, required: true},
    users: [{type: Schema.Types.ObjectId, ref: 'User', default:[], required: true}],
    lists: [{type: Schema.Types.ObjectId, ref: 'List', default:[], required: true}]
});

// TODO
// change Model
mongoose.model('Board', BoardSchema);