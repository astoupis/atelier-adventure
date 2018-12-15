/** @constructor
* @augments TaskSchemaInstance
* @param {Object} definition
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ListSchema = new Schema({
    name: {type: String, required: true},
    tasks: [{type: Schema.Types.ObjectId, ref: 'Task', default:[], required:true}]
    
});

mongoose.model('List', ListSchema);