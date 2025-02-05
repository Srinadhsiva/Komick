import React from 'react'
import './Author.css'
import NewComicPage  from './NewComic'
import UpdateChapters from './UpdateChapters'
import Authorize from './Authorize'


const Author = () => {
  
  const [display, setDisplay] = React.useState(0)
  const [authorized, setAuthorized] = React.useState(false)
  function handleAuthorized(){
    setAuthorized(true)
  }
  function handleClick(event){
    setDisplay(event?.target.value === 'Option 1' ?  1 : 2)
    
  }



  return (
    <>  { authorized ? 
        <section id='authors-page'>
          <h1>Yokoso</h1>
          <span>
           <label htmlFor="input"> <input type="radio" value="Option 1" name='selec-input-option' onClick={handleClick} />Add new + </label>
           <label htmlFor="input"> <input  type='radio' value='Option 2'  name='selec-input-option'  defaultChecked={false} onClick={handleClick}/>Update existing </label>
          </span>
          { display ?
            (display===1) ? <NewComicPage /> : <UpdateChapters />
          :
          ''
          }
          
        </section>
         : 
            <Authorize setauthorized={handleAuthorized}/>  
      }
    </>
  )
}

export default Author