import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'; 

const Chatly = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [])
  return (
    <div>
      chatly home page
    </div>
  )
}

export default Chatly
