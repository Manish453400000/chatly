import React, { useEffect, useRef, useState } from 'react'

import { LocalStorage, requestHandler } from '../../utils'
import { loginUser } from '../../api/api'

import { addUser } from '../../app/features/userSlice'

import { google } from '../../assets/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [data, setData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const passwordElement = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setData({
      username: username,
      password: password,
    })
  }, [username, password])

  useEffect(() => {
    if(passwordElement.current){
      const password = passwordElement.current
      showPassword ? password.type = 'text' : password.type = 'password';
    }
  }, [showPassword, setShowPassword])

  const handelShowPassword = (e:React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const target = e.target as HTMLInputElement;
    if(target.checked) {
      setShowPassword(true);
    }else{
      setShowPassword(false);
    }
  }

  // Function to handel Login
  const handelLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(username.trim().length < 6 || password.trim().length < 6) {
      alert("please enter valid username and password")
      return
    }
    console.log(data);
    
    await requestHandler(
      async () => await loginUser(data),
      setIsLoading,
      (response) => {
        const { data } = response;
        const payload = {
          isAuthenticated: response.success,
          data: data,
        };
        dispatch(addUser(payload))
        LocalStorage.set("token", data.accessToken)
        navigate("/app/home/chats")
      },
      alert
    )
  }
  return (
    <div className="login-component bg-secondary">
      <form className='form-component' onSubmit={handelLogin}>
        <h3 className='heading font-bold'>Login</h3>
        <div className="input-component">
          <span>Username</span>
          <input 
          type="username" 
          name="username" 
          id="username" 
          placeholder='Enter your username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-component">
          <span>Password</span>
          <input 
          type="password" 
          name="password" 
          id="password" 
          placeholder='Enter your password'
          ref={passwordElement}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          />
          <span className='flex gap-[4px] items-center'>
            <input name='checkbox' type="checkbox" onClick={(e) =>handelShowPassword(e)} />
            <span>show password</span>
          </span>
        </div>

        <button type='submit' className="form-button">
          {isLoading ? <i className="fa-solid fa-gear fa-spin"></i> :'Login'}
        </button>
      </form>
      <div className="other-component">
        <hr />
        <button className='button'>
          <img src={google} alt="google" />
          <span>Continue with google</span>
        </button>
      </div>
        <span className='text-[#969696] text-[12px] m-auto pt-[20px] cursor-pointer' onClick={() => navigate('/app/auth/sign-up')}>Create a new account | sign Up</span>
    </div>
  )
}

export default Login
