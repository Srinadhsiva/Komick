const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/router')
const {cloudinaryConfig} = require('./config/cloudinaryConfig')

app.use(cors({
    origin: 'https://komick-livid.vercel.app', // Allow only your frontend
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Allow cookies (if needed)
  }));

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('*', cloudinaryConfig);
app.use('/',router)

app.listen(3000,(req,res)=>{
    console.log("server listening on port 3000")
})