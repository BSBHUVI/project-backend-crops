import mongoose from "mongoose";
const aboutcrops=mongoose.Schema({
    name:String,
    image:String,
    description:String,


})
export default mongoose.model("aboutcrops",aboutcrops);