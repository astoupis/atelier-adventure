/** @constructor
 * // change Task
* @augments TaskSchemaInstance
* @param {Object} definition
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ListSchema = new Schema({
    name: {type: String, required: true},
    tasks: {type: Array, default:[], required: true},
    board: {type: Object, required:true}
});

// TODO
// change Model
mongoose.model('List', ListSchema);