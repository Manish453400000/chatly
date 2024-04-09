import './auth.scss';
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const Auth = () => {
  const navigate = useNavigate();
  const [isExistingUser, setIsExistingUser] = useState(true)

  useEffect(() => {
    isExistingUser ? navigate('/app/auth/sign-in') : navigate('/app/auth/sign-up');
  }, [isExistingUser, setIsExistingUser])

  return (
    <div className='w-screen flex justify-center min-h-[100vh] bg-primary text-white overflow-hidden'>
      <div className="left"></div>
      <div className="right flex-center h-[100vh] w-[90%] ">
        <Outlet />
      </div>
    </div>
  )
}

export default Auth
