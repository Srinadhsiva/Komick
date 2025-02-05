import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import Comic from './components/ComickPage/Comic'
import Read from './components/ReadingPage/Read'
import Author from './components/Author/Author'
import UserPage from './components/UserPage/UserPage';
import Auth from './components/registration/Auth';
import Search from './components/Search';

function App() {

  
  return (
    <>
      <Router>  
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/m/:id" element={<Comic />} />
        <Route path='/m/read/:name/:chapternumber/:id' element={<Read />}/>
        <Route path='/author/' element={<Author />}/>
        <Route path='/user' element={<UserPage/>} />
        <Route path='/auth' element={<Auth />}/>
        <Route path='/search' element={<Search/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
