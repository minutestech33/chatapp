import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login() {
  const [user, setUser] = useState({
    username: "", password: ""
  })
  const navigate = useNavigate()
  const inputHandler = (e) => {
    const value = e.target.value
    const name = e.target.name
    setUser({ ...user, [name]: value })
  }
  const submitRegister = (e) => {
    e.preventDefault()
    const { username, password } = user
    axios.post("http://localhost:8080/login", {
      username, password
    }).then((res) => {
      console.log(res)
      localStorage.setItem('token', res.data.token)
      navigate('/')
    }).catch((err) => {
      console.log(err)
    })
  }
  return (
    <div>
      <div className='mainAccountContainer'>
        <div className='accountContainer'>
          <div className="accountRightContainer">
            <form onSubmit={submitRegister}>
            <input type="text" placeholder='Username' name='username' onChange={inputHandler} value={user.username} />
              <input type="password" placeholder='Password' name='password' onChange={inputHandler} value={user.password} />
              <button>Login</button>
            </form>
            <p>Don't have an account <NavLink to={"/register"}>Create One!</NavLink></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
