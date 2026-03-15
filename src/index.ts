import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {ContentModel, UserModel} from "./db.js"
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";

const app = express();
const port = 3000
app.use(express.json());

app.post("/api/v1/signup",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    try{
        await UserModel.create({
            username: username,
            password: password
        })
        res.json({
            message: "User signed up"
        })
    } catch(e){
        res.status(411).json({
            message: "User already exists"
        })
    }
});

app.post("/api/v1/signin",async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const user = await UserModel.findOne({
        username: username,
        password: password
    })
    if(user){
        const token = jwt.sign({
            id: user._id
        },JWT_PASSWORD)
        res.json({
            message:"User found",
            token
        })
    }else{
        res.status(403).json({
            message:"User not found"
        })
    }

});

app.post("/api/v1/content",userMiddleware,async (req,res)=>{
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    await ContentModel.create({
        title,
        link,
        type,
        //@ts-ignore
        userId: req.userId,
        tags: []
    })
    res.json({
        message: "Content added"
    })

});

app.get("/api/v1/content",userMiddleware,async (req,res)=>{
    //@ts-ignore
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId","username");
    res.json({
        content
    })
    
});

app.delete("/api/v1/content",userMiddleware,async (req,res)=>{
    const contentId = req.body.contentId;
    await ContentModel.deleteMany({
        _id: contentId,
        //@ts-ignore
        userId: req.userId
    })
    res.json({
        message: "Deleted"
    })
});

app.post("/api/v1/brain/share",(req,res)=>{

});

app.get("/api/v1/brain/:shareLink",(req,res)=>{

});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})