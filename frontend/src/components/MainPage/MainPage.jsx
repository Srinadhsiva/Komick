import React from 'react'


import Header from './Header'
import TopPicks from './TopPicks'
import Content from './MainPageContent'
import { trio } from 'ldrs'

trio.register()


const MainPage  = () => {
const [data, setData] = React.useState({})// changed React.useState<{recentupdates:any,toppicks:any}>({})
const [loading, setLoading] = React.useState(true)
const [user, setUser] = React.useState({})
  React.useEffect(() =>{
    async function checkUserSession() {
      const token = localStorage.getItem('token')
      const headers = token
      ? { Authorization: `Bearer ${token}` }
      : {};
      const result = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/checksession`, {
        method: "GET",  // Add method (default is GET, but it's good practice to specify)
        headers: headers
      });
      if(result.ok){
        setUser(await result.json())
      }
      else{
        if(result.status === 401) return
      }
      
    }
    checkUserSession()
    


    async function getRecent() {
            try {
                const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/comics`); 
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const result = await response.json(); 
                setData(result)
              }
            catch (error) {
              console.error("Error fetching data:", error);
            }
            finally{
              setLoading(false)
            }
    
         }
  getRecent()
}  ,[])

  return (
      <> 
            
            {loading ? 
              // Default values shown
              <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh' }}><l-trio
                size="30"
                speed="1.3" 
                color="crimson" 
              ></l-trio> </div>: 
              <>
                <Header profilechoice={user.profile_choice}/>
                <TopPicks data={data?.toppicks} />
                <div className="main-body">
                    <Content  data={data?.recentupdates}/>
                </div>
            </>
            }
      </>
  )
}

export default MainPage