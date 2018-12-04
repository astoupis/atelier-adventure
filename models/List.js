/** @constructor
 * // change Task
* @augments TaskSchemaInstance
* @param {Object} definition
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ListSchema = new Schema({
    name: {type: String, required: true},
    tasks: [{type: Schema.Types.ObjectId, ref: 'Category', default:[], required:true}]
    
});

// TODO
// change Model
mongoose.model('List', ListSchema);