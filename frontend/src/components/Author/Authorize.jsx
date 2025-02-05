import React from 'react'
import './Authorize.css'
const Authorize = ({setauthorized}) => {
    async function handleSubmit(event){
        event.preventDefault()
        const form = new FormData(event.target)
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/authorize/author`,{
            method:'POST',
            body:form
        })
        if(response.ok){
            setauthorized()
        }
        else{
            alert('Invalid Credentials')
        }
    }
  return (
    <section className='authorize-container'>
            <form  method='POST' onSubmit={handleSubmit} id='authorize-author-form'>
                <label htmlFor="input">
                Username<input type="text" required name='name' />             
                </label>
                <label htmlFor="input">
                    Password <input type="password" required name='password' />
                </label>
                <button type='submit'>
                    Letsgo
                </button>
            </form>
    </section>
  )
}

export default Authorize