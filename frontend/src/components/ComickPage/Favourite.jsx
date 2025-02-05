import { useState, useEffect } from "react";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeart } from "@heroicons/react/24/solid";
import axios from "axios";

export default function FavoriteButton({id}) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
  const loggedIn = Boolean(localStorage.getItem('token')) || false  
    useEffect(() => {
        if (loggedIn && favourites.some(item => item=== id)) {
            setIsFavorite(true)
        }}
  ,  [])


  async function handleUpdate(){
    if(loggedIn){
        if(!isFavorite)localStorage.setItem('favourites',JSON.stringify([...favourites,id]))
        else{            
            localStorage.setItem('favourites',JSON.stringify(favourites.filter(item => item !== id)))
        }     
        await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/updatefavourites`,
            {userId:localStorage.getItem('userId') , comicId: id , action:isFavorite ? 'remove' : 'add' }
        )
        
    }
    else{
        alert("login to Use this Feature")
    }
}

  return (
    <>
    <button 
      onClick={() => { 
        handleUpdate();
        setIsFavorite(!isFavorite);
    }}
      style={{ 
        background: "none", 
        border: "none", 
        cursor: "pointer", 
        marginTop: '20px'
      }}
    >
      {isFavorite ? (
        <SolidHeart style={{ width: "24px", height: "24px", color: "red" }} />
      ) : (
        <OutlineHeart style={{ width: "24px", height: "24px", color: "gray" }} />
      )
      }
    </button>
    <p>{isFavorite ?  'Remove' : 'Add to Favourites'}</p>
    </>
  );
}
