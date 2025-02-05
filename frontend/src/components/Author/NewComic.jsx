import React from 'react'
import './NewComicPage.css'
import { trio } from 'ldrs'

trio.register()


const NewComicPage = () => {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false)

  function handleChangeOfImage(event){
    const file = (event?.target.files[0])
    if(file) {
        setSelectedImage(URL.createObjectURL(file))
    }
  }
  

  async function handleOfChapterSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData();


    setIsUploading(true)
    const files = form.elements['chapter-folder'].files; // Chapter folder files
    for (let file of files) {
        formData.append('chapter-files', file);
        formData.append('relative-path', file.webkitRelativePath);
    }

    // Add other fields like title, thumbnail, etc.
    formData.append('title', form.elements['title'].value);
    formData.append('description', form.elements['description'].value)

    const thumbnail = form.elements['thumbnail-image'].files[0];
    if (thumbnail) {
        formData.append('thumbnail-image', thumbnail);
    }
    try{
    const response = await fetch('/api/author/new', {
        method: 'POST',
        body: formData,
    })
    const res = await response.json()
    }
    catch(err){
      console.log('Error occurred', err)
    }
    finally{
      setIsUploading(false)
    }
    
}

 


  return (
    <div className='new-comic-container'>
      {isUploading ? (
                (<div style={{position: 'fixed',
                              top: 0,
                              left: 0,
                              width: '100vw',
                              height: '100vh',
                              background: 'rgba(0, 0, 0, 0.5)', 
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                              zIndex: 1000,
                              pointerEvents: 'none' }}>
                            <span style={{position:'absolute'}}>
                    <l-trio
                              size="65"
                              speed="1.1" 
                              color="green" 
                    ></l-trio></span> <p style={{paddingTop:'120px'}}>Uploading files</p>
                </div>)
              
      ) :
            <form   id='form' encType="multipart/form-data" method='POST'  onSubmit={handleOfChapterSubmit}  > 
                <label htmlFor="input">Name Of The Comic:
                  <input type="text" placeholder='eg: sololevelling' name='title' id='title-input' required={true}/>
                </label>
                <p>ThumbNail of Comic</p>
                <div className='choose-file-container'>
                    <input type="file"  accept='/image' name="thumbnail-image" onChange={handleChangeOfImage} />
                </div>
                {selectedImage && (
                <div style={{ marginTop: "20px" }}>
                <h4>Preview:</h4>
                <img
                    src={selectedImage}
                    alt="Preview"
                    style={{ width: "300px", height: "auto", border: "1px solid #ccc" }}
                />
                </div>) }
                <p>Description - Be sure to enter atleast 3 lines</p>
                <textarea name="description" id="description" rows={6} cols={45}>
                </textarea>

                 <label htmlFor="chapter-folder" className="custom-file-label" style={{marginTop:'20px'}}>Select Folder</label>
                <input 
                  type="file" 
                  name='chapter-files'
                  id="chapter-folder" 
                  directory=''
                  webkitdirectory =''
                  multiple 
                  accept="image/*" 
                  style={{marginTop:'10px'}}
                />
            <button type='submit'>Submit</button>
            </form>
          }
            
    </div>
  )
}

export default NewComicPage