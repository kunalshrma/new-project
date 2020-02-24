const mongoose = require('mongoose');

//======= SCHEMA SETUP =========

const storeSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    address:{
        type:String,
        required:true,
        trim:true
    },
    phone:Number
});
// === CREATING MODEL====
const Store = mongoose.model('Store',storeSchema);

module.exports = {Store}