import express from 'express'
import cors from 'cors'
import Razorpay from 'razorpay'
import crypto from "crypto"
import contact from './contact.js'

import userdata from './dbdata.js'
import uploaddata from './cropsdata.js'
import mongoose from 'mongoose'
import orders from './orders.js'
import aboutcrops from './aboutcrops.js'
const port=process.env.PORT || 5000;
const app=express();

app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://bhuvan:bhuvan1234@cluster0.1lrhmzk.mongodb.net/?retryWrites=true&w=majority",{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    console.log("connected")
}).catch((e)=>{
    console.log(e.message)
})
app.get('/',(req,res)=>{
    res.send("hello world");
})
app.get('/user/aboutcrop',(req,res)=>{
    aboutcrops.find((err,data)=>{
        if(!err){
            res.send(data)
        }else{
            res.send(err)
        }
    })
})
app.get('/user/contact',(req,res)=>{
    contact.find((err,data)=>{
        if(!err){
            res.send(data)
        }else{
            res.send(err)
        }
    })
})
app.post('/user/contactme',(req,res)=>{
    const about=req.body;
    contact.create(about,(err,data)=>{
        if(!err){
            res.send(data)
        }else{
            res.send(err)
        }

    })
})
app.get('/user/sync',(req,res)=>{
    userdata.find((err,data)=>{
        if(!err){
            res.send(data)
        }else{
            res.send(err)
        }
    })
})
app.get('/user/upload',(req,res)=>{
    uploaddata.find((err,data)=>{
        if(!err){
            res.send(data)
        }else{
            res.send(err)
        }
    })
})
app.post('/user/aboutnew',(req,res)=>{
    const about=req.body;
    aboutcrops.create(about,(err,data)=>{
        if(!err){
            res.send(data)
        }else{
            res.send(err)
        }

    })
})
app.post('/user/new',(req,res)=>{
    const user=req.body;
    userdata.create(user,(err,data)=>{
        if(!err){
            res.send(data)
        }else{
            res.send(err)
        }
    })
})
app.post('/user/upload',(req,res)=>{
    const user=req.body;
    uploaddata.create(user,(err,data)=>{
        if(!err){
            res.send(data)
        }else{
            res.send(err)
        }
    })
})
app.get('/user/:id',(req,res)=>{
    const id=req.params.id;
    userdata.find({email:id},(err,data)=>{
        if(!err){
         res.send(data)
        }
     })
})
app.get('/crops/:id',(req,res)=>{
    const id=req.params.id;
    uploaddata.find({email:id},(err,data)=>{
        if(!err){
         res.send(data)
        }
     })
})
app.post("/orders",async (req,res)=>{
try{
    const instance =new Razorpay({
        key_id:"rzp_test_p5o0NnLO0ceScY",
        key_secret:"BHvAYYddVoF0fa1ERgM1g3bF",
    });
    const options={
        amount:req.body.amount*100,
        currency:"INR",
        user:req.params.user,
        receipt:crypto.randomBytes(10).toString("hex"),

    };
    await instance.orders.create(options,(error,order)=>{
        if(error){
            console.log(error)
            return res.status(500).json({message:"something went wrong"})
        }
        res.status(200).json({data:order})

    })

}catch(error){
   console.log(error);
   res.status(500).json({message:"internal server error"})
}

})
app.post("/verify",async(req,res)=>{
    try{
       const {razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature}=req.body;
        const sign= await razorpay_order_id+"|"+razorpay_payment_id;
        const expectedSign=crypto.createHmac("sha256","BHvAYYddVoF0fa1ERgM1g3bF").update(sign.toString()).digest("hex")
        if (razorpay_signature==expectedSign){
            return res.status(200).json({message:"payment verified successfully"})
        }else{
            return res.status(400).json({message:"Invalid signature sent!"})
            
        }


    }catch(error){
        console.log(error);
   res.status(500).json({message:"internal server error"})

    }
})
app.post("/verifiedorders",(req,res)=>{
    const user=req.body;
    orders.create(user,(err,data)=>{
        if(!err){
            res.send(data)
        }else{
            res.send(err)
        }
    })

})
app.get('/getorders/:id',(req,res)=>{
    const id=req.params.id;
    orders.find({email:id},(err,data)=>{
        if(!err){
         res.send(data)
        }
     })
})
app.get('/getrequests/:id',(req,res)=>{
    const id=req.params.id;
    orders.find({farmeremail:id},(err,data)=>{
        if(!err){
         res.send(data)
        }
     })
})
app.delete("/deletecrop/:id",(req,res)=>{
    const id=req.params.id;
    uploaddata.findByIdAndDelete({_id:id},(req,res,err)=>{
        if (!err){
            console.log("deleted")
        }else{
            console.error(err)
        }
    })
})


app.listen(port,()=>{
    console.log(`listening at ${port}`);
})