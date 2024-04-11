import { requestHandler } from '../../utils'
import { registerUser } from '../../api/api'
import { LocalStorage } from '../../utils'
import React, { useEffect, useRef, useState } from 'react'

import { google } from '../../assets/icons'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { addUser } from '../../app/features/userSlice'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const passwordElement = useRef<HTMLInputElement>(null)

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


  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    password: ""
  })
  useEffect(() => {
    setData({
      username: username,
      email: email,
      password: password,
    })
  }, [username, password, email])
  const handelSignUp = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(username.trim().length <= 6 || password.trim().length <= 6) {
      console.log(data);
      return
    }
    await requestHandler(
      async () => await registerUser(data),
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
      <form className='form-component' onSubmit={(e) => handelSignUp(e)}>
        <h3 className='heading font-bold'>Sign Up</h3>
        <div className="input-component">
          <span>Username</span>
          <input 
          type="text" 
          name="username" 
          id="username" 
          placeholder='Enter your username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-component">
          <span>Email</span>
          <input 
          type="email" 
          name="email" 
          id="email" 
          placeholder='Enter your email address'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
            <input name='checkbox2' type="checkbox" onClick={(e) =>handelShowPassword(e)} />
            <span>show password</span>
          </span>
        </div>
        <div className="input-component">
          <span>Confirm Password</span>
          <input 
          type="password" 
          name="cpassword" 
          id="cpassword" 
          placeholder='Enter your password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type='submit' className="form-button">
          {isLoading ? <i className="fa-solid fa-gear fa-spin"></i> :'Register'}
        </button>
      </form>
      <div className="other-component">
        <hr />
        <button className='button'>
          <img src={google} alt="google" />
          <span>Continue with google</span>
        </button>
      </div>
        <span className='text-[#969696] text-[12px] m-auto pt-[20px] cursor-pointer' onClick={() => navigate('/app/auth/sign-in')}>Have an existing account | sign In</span>
    </div>
  )
}

export default SignUp
