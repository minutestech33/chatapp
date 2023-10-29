import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const [image, setImage] = useState()
  const [user, setUser] = useState({
    title: "", username: "", password: ""
  })
  const navigate = useNavigate()
  const inputHandler = (e) => {
    const value = e.target.value
    const name = e.target.name
    setUser({ ...user, [name]: value })
  }
  const submitRegister = (e) => {
    e.preventDefault()
    const { title, username, password } = user
    axios.post("http://localhost:8080/register", {
      title, username, password, image
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) => {
      console.log(res)
      navigate('/login')
    }).catch((err) => {
      console.log(err)
    })
  }
  return (
    <>
      <div className='mainAccountContainer'>
        <div className='accountContainer'>
          <div className="accountLeftContainer">
            <img src={image ? URL.createObjectURL(image) : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS90HxBHJqRkvtgM9Z7RyR3bLV2mlG01SzkgB51gGui1Hewzt6sjpD3FrceNug5R-8nGPA&usqp=CAU"} alt="" />
          </div>
          <div className="accountRightContainer">
            <form onSubmit={submitRegister}>
              <input type="text" placeholder='Title' name='title' onChange={inputHandler} value={user.title} />
              <input type="text" placeholder='Username' name='username' onChange={inputHandler} value={user.username} />
              <input type="password" placeholder='Password' name='password' onChange={inputHandler} value={user.password} />
              <label htmlFor="avatar">
                <input type="file" name='avatar' onChange={(e) => setImage(e.target.files[0])} />
              </label>
              <button>Register</button>
            </form>
            <p>Already have an account <NavLink to={"/login"}>Log in</NavLink></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
