const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/router')
const {cloudinaryConfig} = require('./config/cloudinaryConfig')
const path = require('path')

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('*', cloudinaryConfig);
app.use(cors())
app.use('/',router)

app.listen(3000,(req,res)=>{
    console.log("server listening on port 3000")
})