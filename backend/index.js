const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const app=express();
const userRoute=require('./routes/users');
const pinRoute=require('./routes/pins');
const cors=require('cors')


dotenv.config();

app.use(express.json());
app.use(cors())
mongoose
    .connect(process.env.MONGO_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=>{
        console.log('MongoDB Connected!')
    })
    .catch((error)=>console.log(error));

    app.use('/api/users',userRoute);
    app.use('/api/pins',pinRoute);
app.listen(8800,()=>{
    console.log('backend server is running!')
})

