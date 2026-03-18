import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import {ContentModel, LinkModel, UserModel} from "./db.js"
import { JWT_PASSWORD } from "./config.js";
import { userMiddleware } from "./middleware.js";
import { createHash } from "./utils.js";

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
        contentId,
        //@ts-ignore
        userId: req.userId
    })
    res.json({
        message: "Deleted"
    })
});

app.post("/api/v1/brain/share",userMiddleware,async (req,res)=>{
    const share = req.body.share;
    if(share){
       const link = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
       })
       if(!link){
            const hash = createHash(10);
            await LinkModel.create({
                //@ts-ignore
                userId: req.userId,
                hash: hash
            })
            res.json({
                message: "Share link created",
                hash: hash
            })
       }else{
            res.json({
                message: "Share link already created",
                hash: link.hash
            })
            
       }
    }else{
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        })
        res.json({
            message:"Removed link"
        })
    }
    res.json({
        message:"Updated share link"
    })
});

app.get("/api/v1/brain/:shareLink",async (req,res)=>{
    const hash = req.params.shareLink;
    const link = await LinkModel.findOne({
        hash
    });
    if(!link){
        res.status(411).json({
            message: "Invalid link"
        })
        return;
    }
    const content = await ContentModel.find({
        userId: link.userId
    })
    const user = await UserModel.findOne({
        _id: link.userId
    })
    if(!user){
        res.status(411).json({
            message: "User not found"
        })
        return;
    }
    res.json({
        username: user.username,
        content: content
    })
});

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})