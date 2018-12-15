
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false, default: ""},
    dueDate: {type: Date},
    color: {type: String, required: true, default: "forestgreen"},
});

mongoose.model('Task', TaskSchema);
