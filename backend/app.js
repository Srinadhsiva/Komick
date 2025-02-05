const express = require('express')
const app = express()
const cors = require('cors')
const router = require('./routes/router')
const {cloudinaryConfig} = require('./config/cloudinaryConfig')
const path = require('path')
const frontendPath = path.join(__dirname, './../frontend/dist'); // Adjust path

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(frontendPath));
app.use('*', cloudinaryConfig);
app.use(cors())
app.use('/',router)
app.use((req, res, next) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});
  
module.exports = app;
