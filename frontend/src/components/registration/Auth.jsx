import { useState } from "react";
import axios from "axios";
import './Auth.css'

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const endpoint = isLogin ? '/login' : '/signup';
      const payload = { username, password } 
      try {
        const { data } = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api${endpoint}`, payload);
        if (isLogin) localStorage.setItem('token', data.token);
        window.location.href = '/user'
      } catch (error) {
        alert(error.response?.data?.error || "Something went wrong");
      }
    };
  
    return (
        <div className="auth-container">
        <form onSubmit={handleSubmit}>
          <h2>{isLogin ? "Login" : "Signup"}</h2>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">{isLogin ? "Login" : "Signup"}</button>
          <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: 'pointer', color: '#007bff' }}>
            {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
          </p>
        </form>
        </div>
    );
  };
  
export default Auth;
  