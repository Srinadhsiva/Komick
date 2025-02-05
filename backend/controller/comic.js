const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const DatauriParser = require('datauri/parser')
const path = require('path')
const mongoose = require('mongoose')

const comicSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique: true
    },
    rating:{
        type:Number,
        default: 5
    },
    clickcount:{
        type:Number,
        default: 0
    },
    chaptercount: {
        type:Number,
        default: 0
    },
    thumbnailurl:{
        type:String,
        required:true
    },
    foldername:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    recentupdate:{
        type:Date,
        default: Date.now()
    },
    ratedby: {
        type: Number,
        default: 1
    }
},)
const chaptersSchema = mongoose.Schema({
    comicid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'comic',    
        required: true
    },
    chapterslist:[{
        title:{
            type:String,
            default: 'No name inserted'
        },
        images:[{url:{type:String,required:true}, public_id:{type:String}}],
        number:Number,
        publisheddate:{
            type:Date,
            default:Date.now()
        }
    }]

})

chaptersSchema.index({ comicid: 1 });
chaptersSchema.index({ 'chapters.publisheddate': -1 });
comicSchema.index({ recentupdate: -1});


const comics = mongoose.model('comic',comicSchema)
const chapters = mongoose.model('chapters',chaptersSchema)


const storage = multer.memoryStorage();


const upload = multer({storage})
const duri = new DatauriParser()
const datauri = req => duri.format(path.extname(req.file.originalname).toString(), req.file.buffer)

async function newComic(req, res){
  try {
      const files = req.files['chapter-files'];
      const thumbnail = req.files['thumbnail-image'][0];
      const relativePaths = req.body['relative-path'];
      const foldername = relativePaths[0].split('/').slice(0, 1)[0] 
      let images = []
      const chaptercount = Number(relativePaths[1].split('/')[1].slice(8))  //relativePaths[1] because [0] may contain thumbnail
      const contentthumbnail = new DatauriParser().format(thumbnail.originalname,thumbnail.buffer).content
      const {secure_url} = await cloudinary.uploader.upload(contentthumbnail, {
        folder: `comics/${foldername}`,
        public_id: 'thumbnail'
      })

      
      const newComic = await comics.create({name:req.body.title,
        thumbnailurl:secure_url,
        foldername,
        chaptercount,
        description:req.body.description
       })
      const insertedId = newComic._id

      if (!files || files.length === 0) {
          return res.status(400).json({ message: 'No chapter files uploaded' });
      }
      let i = 0
        for(let file of files) {
          
           // Extract folder structure
          const folderName = relativePaths[i].split('/').slice(0, -1)
          const folderPath = `comics/${folderName.join('/')}`; // Exclude file name
          const fileContent = new DatauriParser().format(file.originalname, file.buffer).content;
          const chapterNumber = Number(relativePaths[i].split('/')[1].slice(8))
          if(!images[chapterNumber]) images[chapterNumber] = []
          const {public_id,secure_url} = await cloudinary.uploader.upload(fileContent,{
            folder: folderPath
          })
          images[chapterNumber].push ({url: secure_url,publicid:public_id })
          i++
      }
     i = 0
     for(let imageGroup of images){
        if(imageGroup){
            await chapters.updateOne({comicid:insertedId}, {$push: {chapterslist:
                        {
                            images:imageGroup,
                            number:i++,
                            publisheddata:new Date()
                        }
                    }
                },
                {upsert:true}
                )
         
        }
     }
      res.status(200).json({
          message: 'Files successfully uploaded',
      });
  } catch (err) {
      console.error('Error uploading files:', err);
      res.status(500).json({
          message: 'An error occurred while uploading files',
          error: err.message,
      });
  }
}

async function updateComic(req, res) {
    let images = []
    try{
        
        const files = req.files['update-files']
        const relativepaths = req.body['relative-paths']
        const chaptercount = Number(relativepaths[0].split('/')[1].slice(8))
        const insertedId = req.body.id
        if(req.body.name == null) return res.send({msg:'No such comic'})
        const Comics = mongoose.models.comics || mongoose.model('comics',comicSchema)
        await Comics.updateOne({name: req.body.name} , {$set:{chaptercount: chaptercount, recentupdate: new Date()}})
        let i = 0
        for(let file of files){
            const fileContent = new DatauriParser().format(file.originalname,file.buffer).content
            const chapterNumber = Number(relativepaths[i].split('/')[1].slice(8))
            const folderName = relativepaths[i].split('/').slice(0,-1)
            if(!images[chapterNumber]) images[chapterNumber] = []
            const {public_id, secure_url} = await cloudinary.uploader.upload(fileContent,
                {
                    folder: `comics/${folderName.join('/')}`
                }
            )
            images[chapterNumber].push({url: secure_url,publicid:public_id })
            i++                
            }
            i = 0
            for(let imageGroup of images){
               if(imageGroup){
                   await chapters.updateOne({comicid:insertedId}, {$push: {chapterslist:
                               {
                                   images:imageGroup,
                                   number:i++,
                                   publisheddata:new Date()
                               }
                           }
                       },
                       {upsert:true}
            )
            }
            
            }
            res.status(200).json({
                message: 'Files successfully uploaded',
            });

    }catch(err){
        console.log(err)
            res.status(500).send({erroccured:err})
    }
}
module.exports = {upload, datauri, newComic, updateComic}