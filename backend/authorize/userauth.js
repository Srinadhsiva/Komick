
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const JWT_SECRET = process.env.JWT_SECRET;


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_choice: { type: Number, default: 0},
  favourites: { type: Array, default: [] }
});

const Users = mongoose.models.users ||  mongoose.model('users', UserSchema);

// Register
async function signup (req, res){

  const { username, password} = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "User already exists Try another one" });
    }
    res.status(500).json({ error: "Error registering user" });
    console.log(err)
  }
};

// Login
async function login (req, res){  
  const { username, password } = req.body;
  try {
    const user = await Users.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '2d' });
    res.json({ token, user: { username: user.username, profile_choice: user.profile_choice, favourites: user.favourites } });
  } catch (err) {
    res.status(500).json({ error: "Login error" });
  }
}

async function checkSession(req,res,next) {
    const token = req.headers.authorization?.split(" ")[1]   

    if(!token) return res.status(401).json({ error: "Unauthorized. Please log in." }) 

      
      
    try
    {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;   
        next()
    } catch(err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Session expired. Please log in again." });
    } else {
        return res.status(401).json({ error: "Invalid token" });
    }
        
    }
}

module.exports = {signup, login, checkSession}
