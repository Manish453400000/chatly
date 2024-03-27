import React, { useEffect, useRef, useState } from 'react'

import { google } from '../../assets/icons'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate()
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

  return (
    <div className="login-component bg-secondary">
      <form className='form-component'>
        <h3 className='heading font-bold'>Login</h3>
        <div className="input-component">
          <span>Email or Username</span>
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
            <input type="checkbox" onClick={(e) =>handelShowPassword(e)} />
            <span>show password</span>
          </span>
        </div>

        <button className="form-button">Login</button>
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
