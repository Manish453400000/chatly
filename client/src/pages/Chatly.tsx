import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'; 

const Chatly = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/app/auth/sign-in')
    }
  }, [])
  
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Chatly
