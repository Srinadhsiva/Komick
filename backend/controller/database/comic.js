const mongoose = require('mongoose')
const { upload } = require('../comic')
const { query } = require('express')
const cloudinary = require('cloudinary').v2

const comicSchema = {name:String,rating:Number,chaptercount:Number,foldername:String,thumbnailurl:String,
    recentupdate:Date, description:String, clickcount:Number, ratedby:Number}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile_choice: { type: Number, default: 0},
  favourites: { type: Array, default: [] }
});


async function getComicsByRecentUpdated() {
    const Comics = mongoose.models.comics || mongoose.model('comics',comicSchema)
    const result =  await Comics.find().sort({recentupdate:-1}).select('_id name rating chaptercount thumbnailurl foldername')
    return result
}


async function getComicDetails(id) {
    const Comics = mongoose.models.comics || mongoose.model('comics',comicSchema)
    const result = await Comics.find({_id:id}).select('_id name rating chaptercount thumbnailurl foldername description')
    await Comics.updateOne({_id:id} , {$inc:{clickcount: 1}})
    return result
}
async function getChapterImagesfromCloudinary(name, number, id){
    const Comics = mongoose.models.comics || mongoose.model('comics',comicSchema)
    await Comics.updateOne({_id:id} , {$inc:{clickcount: 1}})
    const no = String(number).padStart(4,'0')
    const result = await cloudinary.api.resources(
        {
            type:'upload',
            prefix: `comics/${name}/Chapter-${no}`, //change chatper to chapter
            max_results: 150,
            direction:'asc'
        }
    )
    const sortedurls = result.resources.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    return sortedurls.map((resource) => resource.secure_url);

}


async function getComicsByClickCount(){
    const Comics = mongoose.models.comics || mongoose.model('comics',comicSchema)
    const result = await Comics.find().sort({clickcount: -1}).limit(6).select('_id name rating chaptercount thumbnailurl foldername description clickcount')
    return result
}


async function getFolderName(req,res) {
        try{
            const userInput = req.query.q?.trim();
            const Comics = mongoose.models.comics || mongoose.model('comics',comicSchema)
            const result = await Comics.aggregate(
            [
                {
                    $search:{
                        index:"name",
                        autocomplete:{
                            query: userInput,
                            path: "name",
                            fuzzy: {maxEdits : 2},
                        }
                    }
                },
                { $limit: 6 }
            ]
            )
            res.send(result);
        }
        catch(err){
            res.send(['No results found'])
        }
    
}


async function updateRating(req,res) {
    const {id} = req.params
    const {rating} = req.body
    const Comics = mongoose.models.comics || mongoose.model('comics',comicSchema)
    const result = await Comics.find({_id:id}, {_id: 0,rating:1,  ratedby:1, })
    const previousrating = await result[0].rating
    const n = await result[0].ratedby + 1
    const newRating = Number((((previousrating * (n-1)) + rating)/ (n)).toPrecision(2))

    await Comics.updateOne({_id:id}, {$set:{rating: newRating, ratedby: n}})
    res.status(200).send({msg:"successfull"})
}
async function getUserById(req,res) {
        try {
            const Users = mongoose.models.users || mongoose.model('users',UserSchema)
            const user = await Users.findById(req.userId).select("username profile_choice favourites");
            if (!user) return res.status(404).json({ error: "User not found" });
            res.json(user);
          } catch (err) {
            res.status(500).json({ error: "Error fetching user data" });
          }    
}

async function getFavourites(req, res) {
    try {
        const { favourites } = req.body;
        const Comics = mongoose.models.comics || mongoose.model('comics', comicSchema);

        const Favs = await Promise.all(
            favourites.map(fav => Comics.findById(fav).select('_id name thumbnailurl'))
        );

        res.send(Favs);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: "Something went wrong" });
    }
}


async function updateFavorites(req,res) {
    try {
        const User = mongoose.models.users || mongoose.model('users', UserSchema); // Adjust model name
        let updateQuery = {};
        const {userId, comicId, action} = req.body
        if (action === 'add') {
            updateQuery = { $addToSet: { favourites: comicId } }; // Ensures no duplicates
        } else if (action === 'remove') {
            updateQuery = { $pull: { favourites: comicId } }; // Removes safely without error
        } else {
            throw new Error("Invalid action. Use 'add' or 'remove'.");
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateQuery, { new: true });
        if (!updatedUser) {
            return { error: "User not found" };
        }

        return { success: true, favourites: updatedUser.favourites };

    } catch (err) {
        console.error(err);
        return { error: "Something went wrong" };
    }
}

async function updateProfileChoice(req,res) {
    const Users = mongoose.models.users || mongoose.model('users',UserSchema)
    const {id, val} = req.body
    const updatedUser = await Users.findByIdAndUpdate(id,{$set:{profile_choice: val}});
    res.send('Successful')
}

module.exports = {
    getComicsByRecentUpdated, 
    getChapterImagesfromCloudinary, 
    getComicDetails, 
    getComicsByClickCount,
    getFolderName,
    updateRating,
    getUserById,
    getFavourites,
    updateFavorites,
    updateProfileChoice
}



