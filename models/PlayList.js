const mongoose = require('mongoose');

let playlistSchema = new mongoose.Schema({
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
   movies: []
})

let PlayList = mongoose.model("playlist", playlistSchema);
module.exports = PlayList;