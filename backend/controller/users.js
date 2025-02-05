require('dotenv').config()
const mongoose = require('mongoose')


const userSchema = mongoose.Schema(
    {
        username:{type:String, requried: true},
        password: String,
        profile_choice: Number,
        favourites: Array
    }
)



const user = mongoose.model('user',userSchema)

async function fetchUsers(){
    const users = await user.find()
    return users;
}


mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("connected to db")
    })
    .catch(err => {
        console.log(err);
})

module.exports = fetchUsers