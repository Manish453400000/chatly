import { Outlet, useNavigate } from 'react-router-dom'
import './home.scss'
import Profile from '../../components/profile/Profile'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

interface User {
  avatar: {
    localPath: string;
    url: string,
    _id: string,
  },
  createdAt: string,
  email: string,
  isEmailVerified: boolean,
  role: string,
  updatedAt: string,
  username: string,
  __v: number,
  __id: string,
}

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const profileContainer = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const selectUser = (state:any) => state.user
  const data:any = useSelector(selectUser)

  const [user, setUser] = useState<User>({
    avatar: {
    localPath: "",
    url: "",
    _id: "",
    },
    createdAt: "",
    email: "",
    isEmailVerified: false,
    role: "",
    updatedAt: "",
    username: "",
    __v: 0,
    __id: "",
  })

  useEffect(() => {
    if(data.isAuthenticated){
      console.log(data);
      const { user } = data.data;
      setUser(user);
      console.log(user);
    }
  },[data])

  const [activeNav, setActiveNav]= useState('chats');

  const handelNavigation = (type: string) => {
    setActiveNav(type);
    navigate(`/app/home/${type}`)
  }

  return (
    <div className='home-container bg-primary'>
      <div className="navigation-bar">
        <div className="top">
          <span className={`${activeNav == 'chats' ? 'active':''} nav-btns cursor-pointer`} onClick={() => handelNavigation('chats')}><i className='bx bx-message-rounded-detail'></i></span>
          <span className={`${activeNav == 'calls' ? 'active':''} nav-btns cursor-pointer`}><i className='bx bx-phone' ></i></span>
          <span className={`${activeNav == 'requests' ? 'active':''} nav-btns cursor-pointer`} onClick={() => handelNavigation('requests')}><i className='bx bx-search-alt-2'></i></span>
        </div>
        <div className="bottom">
          <span className={`${activeNav == 'status' ? 'active':''} nav-btns cursor-pointer`}><i className='bx bx-star' ></i></span>
          <span className={`${activeNav == 'setting' ? 'active':''} nav-btns cursor-pointer`} onClick={() => setShowProfile(prev => !prev)}><i className='bx bx-cog' ></i></span>
          <div className=' rounded-full w-[35px] aspect-square' onClick={() => setShowProfile(prev => !prev)}>
            <img src={user.avatar.url} alt="profile" />
          </div>
        </div>
      </div>
      <div className="main-container">
        <Outlet />
      </div>
      <div className={` ${showProfile ? 'flex': 'hidden'} profile-wrapper w-screen h-screen absolute top-0 left-0 bg-[green] `} onClick={(e) => {
        console.log(e.target);
        console.log(profileContainer.current);
        
        if(profileContainer.current?.contains(e.target as Node)){
          setShowProfile(false);
          console.log('fh');
          
        }
      }}>
          <div className="profile-container w-[40px] h-[40px] bg-[red]" ref={profileContainer}>
            <Profile/>
          </div>
      </div>
    </div>
  )
}

export default Home