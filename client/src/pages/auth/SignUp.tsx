import React, { useEffect, useRef, useState } from 'react'

import { google } from '../../assets/icons'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
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

  const handelSignUp = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
    
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
            <input type="checkbox" onClick={(e) =>handelShowPassword(e)} />
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

        <button type='submit' className="form-button">Sign Up</button>
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
