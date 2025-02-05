import './TopPicks.css'
import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';


const TopPicks = ({data}) =>  {
  const [screenWidth, setScreenWidth] = React.useState(window.innerWidth);
  const [component, setComponent] = React.useState(null) //reverse // changed <JSX.Element>

  React.useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    
    



    return () => {
      window.removeEventListener('resize', handleResize);
    };
    

  }, []);

  const sliderRef = React.useRef(null);    
    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: (screenWidth > 1100) ? 6 : (screenWidth > 900) ? 5 :(screenWidth > 450) ? 4 : 2,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
      };
  return (
    <section className='top-picks-section'>  
    <h3>Top Picks</h3>
    <div className="card-container">
        <div className="slider-container">
        <Slider ref={sliderRef} {...settings}>
          {

              data.map((comic,index) => {
                return (
                  <Link to={`/m/${comic._id}`}  key={index}>
                        <div className='card' >
                        <img src={`${comic.thumbnailurl}`} alt={`${comic.name}-pic`} />
                        </div>
                  </Link>
                )

              })

          }
        </Slider>
        </div>
    </div>
    </section>
  )
}

export default TopPicks