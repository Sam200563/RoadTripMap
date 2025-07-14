import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    name:String,
    stops:[
        {
            name:String,
            lat:Number,
            lng:Number,
            description:String,
            day:Number
        }
    ],
    photos:[String],
},
    {
        timestamps:true
    }
);

export default mongoose.model("Trip",TripSchema)