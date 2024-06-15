const express = require('express');
const cors = require('cors');
const app= express();
const mongoose = require('mongoose');
const playlistRoutes = require('./api/playlistRoutes');
const userRoutes = require('./api/userRoutes');
// const seedDB = require('./seed');
require('dotenv').config();


mongoose.connect(process.env.mongoURI)
  .then(() => console.log('DB Connected!'));

// mongoose.connect('mongodb+srv://vaibhavshrotriyas:Vaibhav2876@cluster0.mkuk0qb.mongodb.net/TodoDB?retryWrites=true&w=majority&appName=Cluster0')
//   .then(() => console.log('DB Connected!'));

// seedDB();

var whitelist = ['http://localhost:5173','http://localhost:5174', 'http://www.omdbapi.com/?apikey=3439ea05', 'https://movivi.netlify.app']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(
  cors(corsOptions)
);

app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(playlistRoutes);
app.use(userRoutes);

app.get('/' , (req , res)=>{
    res.status(200).json({msg: "Welcome to Movivi Backend"})
 })

const PORT=8089
app.listen(PORT, ()=>{
    console.log("Server Connected at " + PORT);
})