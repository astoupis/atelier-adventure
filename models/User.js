/** @constructor
 * // change Task
* @augments TaskSchemaInstance
* @param {Object} definition
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    username: {type: String, required: true},
    passwordHash: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now, required:true},
    avatar:{type: String},
    boards: {type: Array, default:[], required: true},
    assignedTasks: {type: Array, default:[], required:true}
});

// TODO
// change Model
mongoose.model('User', UserSchema);
