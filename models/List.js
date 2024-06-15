const mongoose = require('mongoose');

let listSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    access: {
        type: String,
        default: 'public'
    },
    owner: {
        type: String,
        required: true,
        trim:true,
   },
   recipe: []
})

let List = mongoose.model("list", listSchema);
module.exports = List;