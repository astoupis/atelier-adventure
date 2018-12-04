
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    dueDate: {type: Date},
    assignedUsers: {type: Array, default:[], required: true}    
});

// TODO
// change Model
mongoose.model('Task', TaskSchema);
