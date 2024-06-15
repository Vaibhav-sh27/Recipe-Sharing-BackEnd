const express = require('express');
const router = express.Router();
const playlist = require('../models/PlayList');
const user = require('../models/Users');

router.get('/playlist/all', async (req, res)=>{
    try {
        let data = await playlist.find({});
        data = data.filter((item)=>item.access==='Public');
        res.status(200).json(data);
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.get('/playlist/:userId/playlists', async (req, res)=>{
    try {
        let {userId} = req.params;
        let data = await user.findById(userId).populate('playlist');
        // console.log(data.playlists);
        res.status(200).json(data.playlist);
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.post('/playlist/:userId/add', async (req, res)=>{
    try {
        let {userId} = req.params;
        let {name, access, owner, movies} = req.body;
        let currUser = await user.findById(userId);
        const playlistData = new playlist({name, access, owner, movies});
        currUser.playlist.push(playlistData);
        await playlistData.save();
        await currUser.save();
        let combine= {
            currUser,
            playlistData
        }
        res.status(201).json({msg: 'playlist Created', data: combine});
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.patch('/playlist/:playlistId', async (req, res)=>{
    try {
        let {playlistId} = req.params;
        let playItem = req.body;

        let play=await playlist.findById(playlistId);
        let isAdded= play.movies.filter(item=>playItem.imdbID==item.imdbID);
        console.log(isAdded);
        if(isAdded.length!=0){
            res.status(400).json({msg: 'Movie Already Added'}); 
            return;
        }
        play.movies.push(playItem);
        play.save();
         
        res.status(201).json({msg: 'playlist Updated'});
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.patch('/playlist/edit/:id', async (req, res)=>{
    try {
        let {name, access} = req.body;
        let {id} = req.params;
        await playlist.findByIdAndUpdate(id, {name, access});
        let data = await playlist.findById(id);
        console.log(data);
        res.status(201).json({msg: 'playlist Updated', data});
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.delete('/playlist/:userId/:playlistId', async (req, res)=>{
    try {
        let {userId, playlistId} = req.params;
        let currUser = await user.findById(userId);
        currUser.playlist = currUser.playlist.filter((item)=>item._id!=playlistId);
        currUser.save();
        await playlist.findByIdAndDelete(playlistId);

         
        res.status(201).json({msg: 'playlist Deleted', currUser});
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.delete('/movie/:playId/:movieId', async (req, res)=>{
    try {
        let {playId, movieId} = req.params;
        let currPlay = await playlist.findById(playId);
        currPlay.movies= currPlay.movies.filter((item)=>item.imdbID!==movieId);
        console.log(currPlay);
        currPlay.save();
         
        res.status(201).json({msg: 'Movie Deleted'});
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})

router.post('/playlist/:id', async (req, res)=>{
    try {
        let {id} = req.params;
        let currUser=req.body;
        
        let item = await playlist.findById(id);
        if(item.access==='Private'){
            if(currUser.email!==item.owner){
                res.status(215).json({msg: "This PlayList is Private!!!"})
                return;
            }
        }
        res.status(200).json(item);
    } catch (err) {
        res.status(400).json({msg: "something went wrong", err: err})
    }
})



module.exports=router