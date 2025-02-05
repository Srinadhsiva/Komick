import React from 'react'
import { Link, useParams } from 'react-router-dom'
import './Comic.css'
import { RatingInput, StarRating } from './Rating'
import FavoriteButton from './Favourite'

const Comic = () => {
  const [readMore, setReadMore] = React.useState(false)
  const [value , setValue] = React.useState (null)  
  const [take, setTake] = React.useState(false)
  const desc_ele = React.useRef(null)

function handleClick(){
      setReadMore(prevValue =>{
        if(desc_ele.current)desc_ele.current.style.maxHeight = prevValue ? '70px' :'650px'        
        return !prevValue
      })
}
  const {id}  = useParams()
  React.useEffect(()=>{
    async function getComicDetails(id) {
      const result = await fetch(`/api/m/${id}`)
      const data = await result.json()
      const value = data[0]
      setValue(value)
    }
    getComicDetails(id)
  },[take])
  function getChapterLinks(value){
    const elements = []
              for(let i = value.chaptercount; i > 0;i--){
                  elements.push(<Link to={`/m/read/${value.foldername}/${i}/${value._id}` } key={i}>chapter - {i}</Link>)
              }
              return elements
  }

  return (
      <>
        {value && <section className='comic-page main-body'>
                    <div className='img-container-comicpage'>
                      <img className='comic-img' src={`${value.thumbnailurl}`} alt="comic-picture" />
                    </div>
                    <h1>{value.name}</h1>
                    <div className="star-container" style={{position:'relative'}}>
                    <span>{value.rating}</span>
                    <StarRating rating={value.rating}/>
                  </div>
                  <button onClick={()=>{setTake(prev => !prev)}} className='rating-button'>Click to rate</button>
                  { take  && <RatingInput takeInput={setTake} id={value._id}/>}
                  <FavoriteButton id={value._id}/>

                   <div className="description" ref={desc_ele}><p className='info'>{value.description}</p>
                    </div>
                    <span  className='read-more' onClick={handleClick}>{(readMore ? "Read less" : "Read More")}</span>

                    <div className='chapter-list'>
                      {
                        getChapterLinks(value)
                      }
                    </div>
              </section>}
      </>
  )
}

export default Comic