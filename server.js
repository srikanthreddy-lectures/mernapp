const express=require('express');
const path = require('path');
const mongoose=require('mongoose');
const cors = require('cors');
const app=express();
let PORT=4000;
app.use(express.static(path.join(__dirname, '/build')));
//to understand data in react component use cors // from one port to another port 
app.use(cors());
app.use(express.json()); // Parse JSON requests

//connecting to MongoDB cluster0
mongoose.connect(`mongodb+srv://venu:venu123@cluster0.8qjztwk.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{
    console.log(`MongoDB Connected on MongoDB Cluster`)
})
.catch((err)=>{ 
    console.log(`MongoDB Not Connected Problem: ${err}`)
});
//Create a Schema
let myschema=new mongoose.Schema({
    name:String,
    branch:String,
    rno:Number
})
//Create a model
let mymodel=new mongoose.model('students',myschema);
//Getting Data from MongoDB Cluster
app.get('/api/showdata',(req,res)=>{
    mymodel.find({}).then((data)=>{
        res.send(data);
    })
})
//to understand the post data in express
app.use(express.urlencoded({extended:false}))
//post (send ) data to MongoDB cluster
app.post('/api/submitdata', async (req, res) => {
    try {
      // console.log(req.body)
      
      // Create a new document using the model and request body
      const newData = new mymodel(req.body);
       
      // Save the document to the database
      await newData.save();
  
      // Respond with the saved data
    //   res.json(newData);
      
    res.send(newData);
    } catch (error) {
      console.error('Error submitting data to MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  app.get('/reg',(req,res)=>{
    res.sendFile(__dirname+'/Register.html')
  })
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/build/index.html'));
  });
app.listen(PORT,(err,data)=>{
    if(err)
        console.log(`Server not connected :${err}`)
    else 
        console.log(`Server is connected on ${PORT}`)
})
