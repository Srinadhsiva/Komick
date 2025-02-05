import React from 'react'
import './Search.css'
import { Link } from 'react-router-dom'
import { StarRating } from './MainPage/Rating'
const Search = () => {

      const [query, setQuery] = React.useState('')
      const [results, setResults] = React.useState([])
      const [submitted, setSubmitted] = React.useState(false)
    
    function handleSubmit(event){
        event.preventDefault()
        setSubmitted(true)
    }

    async function handleQuery(event){
        setSubmitted(false)
        setQuery(event?.target.value)
        if(query.length < 2){
          setResults([])
        }
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/comic/search?q=${query}`)
        const data =  await res.json()
        setResults(data)
      }
  return (
    <div>
        <form onSubmit={handleSubmit} id='search-form'>
        <div className='search-page-items' >
                  <input type="seach-page-box" placeholder='Search' onChange={handleQuery} />
                </div>

        </form>
        <div className='search-page-results'>
        {((results.length > 0 && (query.length > 1)) && !submitted) && <ul className='search-suggestion-container'>
                  {results?.map((comic) => (
                        <Link to={`/m/${comic._id}`}>
                                <li key={comic._id} className="suggestions">
                                    <img src={`${comic.thumbnailurl}`} alt="" />
                                    <p>{comic.name}</p>
                                </li> 
                        </Link>
                  ))}
          </ul>}
        </div>
       
       
        {
            submitted &&
            <section className='content-section'>
            <div className="grid-container">
                
            
            {
            [results.map((comic,index) => {
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
    
            })]}
            </div>
            </section>
        }

    </div>
  )
}

export default Search