/** @constructor
* @augments TaskSchemaInstance
* @param {Object} definition
*/
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;



const UserSchema = new Schema({
    firstname : {type:String, required: true},
    lastname : {type:String, required: true},
    email : {type:String, unique: true, required: true},
    username : {type: String, unique: true, required: true},
    passwordHash : {type: String, required: true},
    dateCreated : {type: Date, default: Date.now, required:true},
    avatar : {type: String},
    boards : [{type: Schema.Types.ObjectId, ref: 'Board', default:[], required:true}],
});

UserSchema.plugin(uniqueValidator);


mongoose.model('User', UserSchema);
