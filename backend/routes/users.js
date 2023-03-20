const router=require('express').Router();
const User=require('../models/User');
const bcrypt = require('bcrypt');


//create a new register
router.post("/register",async(req,res)=>{
    try{
//generate new password
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        //cretae new user
        const newUser= new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        });

        //save user and send response
        const user=await newUser.save();
        if(user){
            return res.status(200).json(user._id)

        }

    }catch(err){
        res.status(500).json(err)
    }
})



//get login


router.post("/login", async(req,res)=>{
    try{

        //find user
        const user= await User.findOne({username:req.body.username});

        if(!user){
            return res.status(400).json("wrong username or password!")
        }

        //validate passwod
        const validPassword=await bcrypt.compare(
            req.body.password,
            user.password
        );
        if(!validPassword){
            return res.status(400).json("wrong username or password!")
        }
        //send res
        if(user && validPassword){
            return res.status(200).json({_id:user._id,username:user.username})

        }


    }catch(err){
        res.status(500).json(err)
    }
})





module.exports=router;
