import { requestHandler } from '../utils';
import { getUser } from '../api/api';
import { LocalStorage } from '../utils';
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'; 

const Chatly = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/app/auth/sign-in')
    }
  }, [])

  useEffect(() => {
    (async () => {
      try{
        await requestHandler(
          async () => await getUser(),
          setIsLoading,
          (response) => {
            const { data } = response;
            console.log(data);
            LocalStorage.set("token", data.accessToken)
            navigate("/app/home/chats")
          },
          alert
        )
      }catch(error){
        console.log(error);
      }
    })()
  }, [])
  
  return (
    <div>
      <Outlet />
    </div>
  )
}

export default Chatly
