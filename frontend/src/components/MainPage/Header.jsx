import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

const Header = ({profilechoice}) => {
  if(!profilechoice) profilechoice = 0
  const [isMenu,setIsMenu] = React.useState(true)
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState([])

  


  async function handleQuery(event){
    setQuery(event?.target.value)
    if(query.length < 2){
      setResults([])
    }
    const res = await fetch(`/api/comic/search?q=${query}`)
    const data =  await res.json()
    setResults(data)
  }

  return (
    <section className='header'>
        <nav>
            <a className="title" href="/">KOMICK</a>
            <div className="elements">
              {isMenu ?
                <div className='search-items' >
                  <input type="seach-box" placeholder='Search' onChange={handleQuery} />
                </div>
              :''}
              <Link to='/search'><button className='hamburger-menu' ><img src="/search.png" alt="search-icon " /></button></Link>
            <a  href='/user' className='login-link'><img src={`/profilechoices/${profilechoice}.jpg`} className='login-img' alt="login-img" /></a>
            </div>
        </nav>
        <div className='search-results'>
        {(results.length > 0 && (query.length > 1)) && <ul className='suggestion-container'>
                  {results?.map((comic) => (
                                <Link to={`/m/${comic._id}`} key={comic._id}>
                                  <li  className="suggestions">
                                      <img src={`${comic.thumbnailurl}`} alt="" />
                                      <p>{comic.name}</p>
                                  </li>
                                </Link>

                  ))}
          </ul>}
        </div>



    </section>
  )
}

export default Header