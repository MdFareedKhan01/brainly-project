import mongoose,{model,Schema} from "mongoose";
import { connectionString } from "./config.js";
mongoose.connect(connectionString)

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

const TagSchema = new Schema({
    
})

const ContentSchema = new Schema({
    title: String,
    type: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId,ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId,ref: 'User',required: true,unique: true}
})

export const UserModel = model("User",UserSchema);
export const LinkModel = model("Link",LinkSchema);
export const ContentModel = model("Content",ContentSchema);