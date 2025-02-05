const express = require('express');
const router = express.Router();
const fetchUsers = require('../controller/users')
const {upload,  newComic, updateComic} = require('../controller/comic')
const{getComicsByRecentUpdated, 
    getChapterImagesfromCloudinary, 
    getComicDetails,
    getComicsByClickCount,
    getFolderName,
    updateRating,
    getUserById,
    getFavourites,
    updateFavorites,
    updateProfileChoice
} = require('../controller/database/comic.js')
const {authorize} = require('../authorize/authorauthorize.js')
router.get('/',(req,res)=>{
    res.send("hi")
})

const {login,
     signup, 
      checkSession} = require('../authorize/userauth.js')

router.get(`/api/user`,async(req,res)=>{
    try
    {
        const users = await fetchUsers()
        res.send(users)
    }
    catch(err){
        console.log(err)
    }
})

router.get('/api/comics',async(req,res)=>{
    res.send({recentupdates:await getComicsByRecentUpdated(), toppicks: await getComicsByClickCount()})
})

router.post(
    '/api/author/new',
    upload.fields([
        { name: 'chapter-files', maxCount: 500 },
        { name: 'thumbnail-image', maxCount: 1 },
    ]),
    newComic
)

router.post('/api/author/update',
    upload.fields([{name: 'update-files', maxCount: 500}]),
    updateComic
)

router.get('/api/m/read/:name/:number/:id',async(req,res)=>{
  const {name, number, id} = req.params
  const result = await getChapterImagesfromCloudinary(name, number, id)
  res.send(result)

})

router.get('/api/m/:id',async(req,res)=>{
    const {id} = req.params
    const result = await getComicDetails(id)
    res.send(result)
})


router.post('/api/authorize/author',upload.none(),authorize)

router.get('/api/comic/search', upload.none(), getFolderName)

router.put('/api/rating/:id', updateRating)

router.post('/api/login', login )

router.post('/api/signup', signup)

router.get('/api/checksession', checkSession, getUserById)

router.post('/api/favourites', getFavourites)

router.post('/api/updatefavourites', updateFavorites)

router.put('/api/profilechoice', updateProfileChoice)



module.exports = router