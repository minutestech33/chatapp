import React, { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Register from './Register'
import Login from './Login'
import Messenger from './Messenger'
import Hello from './Hello'

function App() {
  const navigate = useNavigate()
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate("/login")
    } else {
      navigate("/")
    }
  }, [])
  return (
    <>
      <Routes>
        <Route path='/' element={<Messenger />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/hello' element={<Hello />}/>
      </Routes>
    </>
  )
}

export default App
