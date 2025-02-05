import React from 'react';
import './UserPage.css';
import Chooseprofile from './Choose-profile'
import  { useEffect, useState } from "react";
import axios from "axios";
import { spiral } from 'ldrs'
import { Navigate } from "react-router-dom";





const UserPage = () => {
  const [user, setUser] = useState([])
  const [loading, setLoading] = useState(true)
  const [favourites, setFavourites] = useState([])
  const [selectProfile, setSelectProfile] = useState(false)
  const token = localStorage.getItem('token')
  if (!token) <Navigate to='/auth' replace/>
  useEffect(()=>{
    axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/checksession`,{
      headers:{Authorization:`Bearer ${token}` }
    } 
    )
    .then(response => {setUser(response.data)
          axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/favourites`,{
            favourites:response.data.favourites
          }).then(res => {
            setFavourites(res.data)
          }).catch(err => console.log(err));
          setLoading(false)
        }
  ).catch(err=>{
    if(err.response.status === 401) window.location = '/auth'
    console.log(err)
    setLoading(false)
  })
  },[selectProfile])
  
  spiral.register()
  localStorage.setItem('userId',user._id)
  localStorage.setItem('favourites',JSON.stringify(user.favourites))

  function handleLogOut(){
    localStorage.clear()
    window.location = '/'
  }


  if(loading) return(    
    // Default values shown
    <l-spiral
      size="50"
      speed="0.9" 
      color="white" 
    ></l-spiral>)
  return (
    <div className="user-page">
      {/* User Info */}
      <section className="user-profile">
        <img className="profile-img" src={`/profilechoices/${user.profile_choice}.jpg`} alt='' />
        <h2>{user.username}</h2>
        <div>
        <button className='profile-button' onClick={()=> setSelectProfile(true)}>Change Profile</button>
        <button className='profile-button' onClick={handleLogOut}>Log out</button>
        </div>
        <button className='home-button' onClick={() => {window.location = '/'}}><img src='/home.jpeg'></img></button>
      </section>

      {/* favouriteed Manhwas */}
      <section className="favourite-manhwas">
        <h3>My favourites</h3>
        <div className="favourite-list">
          {favourites.map((manhwa) => (
            <div className="favourite-item" key={manhwa._id}>
              <img
                className="favourite-thumbnail"
                src={manhwa.thumbnailurl}
                alt={`${manhwa.name} thumbnail`}
              />
              <p>{manhwa.name}</p>
            </div>
          ))}
        </div>
      </section> 
      {selectProfile && <Chooseprofile select={setSelectProfile} />}
    </div>
  );
};

export default UserPage;
