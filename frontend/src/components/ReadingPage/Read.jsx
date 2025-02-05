import React from 'react'
import { useParams } from 'react-router-dom'
import './Read.css'
import { dotSpinner } from 'ldrs'

const Read= () => {
  dotSpinner.register()

  const [component,setComponent] = React.useState(null); 
  const element = React.useRef(null)

  const {name, chapternumber, id} = useParams()
  function scrollAdder(){

    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  
    if (scrollPosition > window.innerHeight) {
        element.current?.classList?.remove('hide');
    } else {
      if(element)
        element.current?.classList?.add('hide');
    }
  }
  React.useEffect(()=>{
    window.addEventListener('scroll', scrollAdder);

    // data fetching
    async function getChapterImages(){
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/m/read/${name}/${chapternumber}/${id}`)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const result = data.map((data,index) =>{
          return  <img src={`${data}`} alt="chapter-image"  key={index}/>
        })
        setComponent(result)
    }
    getChapterImages()

    return ()=>{
      window.removeEventListener('scroll',scrollAdder)
    }

  }, [])



  return (
    <>
    <section id='top-section'>
    <div className='image-container'>
         {component ? component : 
                        <span style={{display:'flex', justifyContent:'center',alignItems:'center',height:'99vh'}}><l-dot-spinner
                          size="40"
                          speed="0.9" 
                          color="green" 
                        ></l-dot-spinner></span>}
    </div>
    <a href="#top-section" className='go-to-top hide' ref={element}> <img src="/to-top.png" alt="top-scroller" /></a>
    </section>
    
    </>
  )
}

export default Read