import React, { Component } from 'react'
import './MainPageContent.css'
import { Link } from 'react-router-dom';
import { StarRating } from './Rating';


const Content = ({data}) => {
  const [component,setComponent] = React.useState(null); // reverse //<[JSX.Element] || null>

  
React.useEffect(()=>{
        const result = data.map((comic,index) => {
            return (
            
              <div className="item" key={index}>
                 <Link to={`/m/${comic._id}`} > <img src={comic.thumbnailurl} alt={comic.name+'thumbnail'} />
                  <p>{comic.name}</p>
                  <span style={{display:'block'}}>
                  <div className="rating-container" style={{position:'relative'}}>
                    <span>{comic.rating}</span>
                    <StarRating rating={comic.rating}/>
                  </div>
                  </span>
                  </Link>
                  <a href={`/m/read/${comic.foldername}/${comic.chaptercount}/${comic._id}`}>Chapter{comic.chaptercount}</a><br/>
                  <a href={`/m/read/${comic.foldername}/${comic.chaptercount-1}/${comic._id}`}>Chapter{comic.chaptercount - 1}</a>
              </div>
            )

        });

        setComponent(result)
      },[data])

  

  return (
    <>
    <section className='content-section'>
        <div className="grid-container">
            {component ? component : 'loading.....'}
        </div>
    </section>
    </>
  )
}

export default Content  