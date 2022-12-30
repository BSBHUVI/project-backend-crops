import mongoose from "mongoose";
const contact=mongoose.Schema({
   
    name:String,
    email:String,
    phone:String,
    message:String

})
export default mongoose.model("contacts",contact)