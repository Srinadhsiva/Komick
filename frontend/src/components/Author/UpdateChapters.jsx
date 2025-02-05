import React from 'react'
import './UpdateChapters.css'
import { trio } from 'ldrs'

trio.register()


const UpdateChapters = () => {

const [ query, setQuery] = React.useState('')
const [results, setResult] = React.useState([])
const [comic, setComic ] = React.useState({})
const [loading, setLoading] = React.useState(false)
 
let res = [{name:'null',_id:null}]

async function handleChange(q){
    setQuery(q)
    if(q.length < 2){
      setResult([])
      setComic('')
    }
    const data = await fetch(`/api/comic/search?q=${q}`)
    const res = await data.json()
    setResult(res)
} 

async function handleSubmit(event){
  event.preventDefault()
  const data = await fetch(`/api/comic/search?q=${query}`)
  res = await data.json()
  setComic(res[0])
}

async function handleUploads(event){
  try{
    setLoading(true)
      event.preventDefault()
      const form = event.target
      const formdata = new FormData()
      
      const files = form['update-files'].files
      for(let file of files){
        formdata.append('update-files',file)
        formdata.append('relative-paths',file.webkitRelativePath)
      }
      formdata.append('name',comic.name)
      formdata.append('id',comic._id)
      const result = await fetch('/api/author/update' ,{
        method: 'POST',
        body: formdata
      })
      const data = await result.json()
  }
  catch(err){
    console.log(err)
  }
  setLoading(false)
}


React.useEffect(()=>{

},[])

  return (
    <div className='update-section'>
      {loading &&
      <div style={{position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.5)', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        pointerEvents: 'none' }}>
      <span style={{position:'absolute'}}><l-trio
        size="65"
        speed="1.3" 
        color="green" 
      ></l-trio></span>
      <p style={{paddingTop:'120px'}}>Updating New Chapters</p>
       </div>
    }
      <form id='name-form'  method='GET' onSubmit={handleSubmit}>
      <label htmlFor="input" > 
          Enter Name:
          <input type='text' name='name' required  onChange={(event) =>{handleChange(event?.target.value)}} className='search'>
          </input> 
          <div className="search-results">
          {(results.length > 0 && (query.length > 1) && !comic) && (
                <ul className="suggestion-container">
                    {results.map((comick) => (
                        <li key={comick._id} className="suggestions" onClick={()=>{setComic(comick)}}>
                            <img src={`${comick.thumbnailurl}`} alt="" />
                            <p>{comick.name}</p>
                        </li>
                    ))}

                </ul>
        )}
        </div>
        </label>
        <button type='submit'>Search Foldername</button>
        {}
      </form>
      {comic.foldername && <p>Please make sure that name of the root folder you are uploading is same as below .</p>}
      {comic.foldername}
      
      <form encType='multipart/form-data' id='update-files-form' onSubmit={handleUploads}>
        <input type="file"
        name='update-files'
        directory=''
        webkitdirectory=''
        multiple
        accept='image/*'
        />
        <button type='submit'>upload</button>
      </form>



    </div>
  )
}

export default UpdateChapters