const express=require('express');
const router=express.Router();
const User=require('../models/Users');
const bcrypt = require("bcrypt");
const genrateToken = require("./jsonWebToken");

router.post("/register", async (req, res) => {
    let user = req.body;
    console.log(user);
    let email = await User.findOne({ email: req.body.email });
    console.log(email, "email");
    if (email != null) {
      res.status(409).send("User already exists... Login Instead");
    } else {
      let hashedPass = await bcrypt.hash(user.password, 10); 
      let newUser = await User.create({
        name: user.name,
        email: user.email,
        password: hashedPass,
      });
      console.log(newUser);
      res.status(200).send("User created successfully");
    }
  });
 
router.post("/login", async (req, res) => {
    const userdata =req.body;
    let userInfo;
    try {
      userInfo = await User.findOne({email: userdata.email});
    } catch (error) {
      res.status(500).send("Somthing went Wrong While Login");
    } 
    if(!userInfo){
      res.status(401).send("User Not Found");
      return;
    }
  
    let validatedPass = await bcrypt.compare(userdata.password, userInfo.password).catch((err)=>{
      return res.status(500).send(err);
    });
  
    if(!validatedPass){
      res.status(403).send("Incorrect Credentials");
    } else{
      // genrate jwt
      let token = genrateToken(userInfo);
      res.status(200).send({
        data: {
          token: token,
          userdata: userInfo,
        },
        msg: "Token Genrated"
      })
    } 
});

// router.patch('/user/update/:id', async (req, res)=>{
//   try {
//     let {id} = req.params;
//     console.log(id);
//     await User.findByIdAndUpdate(id, {isSub: true});
//     let upt= await User.findById(id);
//     console.log(upt);
//     res.status(200).json(upt);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({msg: "Something went wrong!"});
//   }
  
// })

module.exports=router;
