const path = require('path')
require('dotenv').config({path:path.resolve(__dirname,'../.env')})

function authorize(req,res,next){
    if(req.body.name === process.env.NAME && req.body.password === process.env.PASSWORD){
        return res.status(200).send({msg:'Authorization Successful'})
    }
    return res.status(401).send({msg:'Invalid Credentials'})
}
module.exports = {authorize}