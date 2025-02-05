import React from 'react'
import './ChooseProfile.css'
import axios from 'axios';

const Chooseprofile = ({select}) => {
    const id = localStorage.getItem('userId')    
    const [selectedImage, setSelectedImage] = React.useState(null);

    const handleImageClick = (val) => {
        axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/profilechoice`,{
            id:id,
            val:val
        }).then(res => {
        window.location.reload()}
        )
        setSelectedImage(val);
        select(false)
    };

  return (
    <>
    
    <div className='select'>
            {
                [0,1,2,3,4,5,6,7,8,9,10].map(val => {return <img key={val} className= 'select-profile'
                    src={`/profilechoices/${val}.jpg`}
                    alt={`Profile ${val}`}
                onClick={() => handleImageClick(val)}
                ></img>
                })
            }
    </div>

    </>
  )
}

export default Chooseprofile