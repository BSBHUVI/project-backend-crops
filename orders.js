import mongoose from "mongoose";
const orders=mongoose.Schema({
    email:String,
    farmeremail:String,
    cropid:String,
    pic:String,
    pricing:String,
    number:String,
    latitude:String,
    longitude:String


})
export default mongoose.model("orders",orders);