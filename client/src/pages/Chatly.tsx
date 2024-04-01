import { requestHandler } from '../utils';
import { getUser } from '../api/api';
import { LocalStorage } from '../utils';
import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';

import { addUser } from '../app/features/userSlice';

const Chatly = () => {
  const [isLoading, setIsLoading] = useState(false);
  const getAuthenicatedState = (state:any) => state.user.isAuthenticated
  const isAuthenticated = useSelector(getAuthenicatedState);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(isAuthenticated);
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
            // console.log(response);
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
