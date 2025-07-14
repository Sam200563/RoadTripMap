import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true},
    phone:{type:String},
    country:{type:String},
    state:{type:String},
    password:String,
    favorites:[{type:mongoose.Schema.Types.ObjectId,ref:"Trip"}]
})

export default mongoose.model("User",UserSchema)