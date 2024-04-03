import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './home.scss'
import Profile from '../../components/profile/Profile'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { User } from '../../interface/user'


const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const profileContainer = useRef<HTMLDivElement>(null);

  const location = useLocation();

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
      const { user } = data.data;
      setUser(user);
    }
  },[data])

  const [activeNav, setActiveNav]= useState('chats');

  const handelNavigation = (type: string) => {
    setActiveNav(type);
    navigate(`/app/home/${type}`)
  }

  useEffect(() => {
    const type:string = location?.pathname?.split('/')?.pop() || '';
    handelNavigation(type)
    
  }, [location.pathname])

  return (
    <div className='home-container bg-primary overflow-hidden'>
      <div className="navigation-bar">
        <div className="top">
          <span className={`${activeNav == 'chats' ? 'active':''} nav-btns cursor-pointer`} onClick={() => handelNavigation('chats')}><i className='bx bx-message-rounded-detail'></i></span>
          <span className={`${activeNav == 'calls' ? 'active':''} nav-btns cursor-pointer`}><i className='bx bx-phone' ></i></span>
          <span className={`${activeNav == 'requests' ? 'active':''} nav-btns cursor-pointer`} onClick={() => handelNavigation('requests')}><i className='bx bx-search-alt-2'></i></span>
        </div>
        <div className="bottom">
          <span className={`${activeNav == 'status' ? 'active':''} nav-btns cursor-pointer`}><i className='bx bx-star' ></i></span>
          <span className={`${activeNav == 'setting' ? 'active':''} nav-btns cursor-pointer`} onClick={() => setShowProfile(prev => !prev)}><i className='bx bx-cog' ></i></span>
          <div className=' rounded-full w-[25px] aspect-square' onClick={() => setShowProfile(prev => !prev)}>
            <img src={user.avatar.url} alt="profile" />
          </div>
        </div>
      </div>
      <div className="main-container">
        <Outlet />
      </div>
      <div className={`${showProfile ? '': 'hidden'} floating-container w-full h-full absolute  left-0 bottom-0 z-20 overflow-y-hidden`}>
        <div className="box-container relative h-full" onClick={(e) => {
          if(profileContainer){
            const item = profileContainer.current;
            if(!item?.contains(e.target as Node)){
              setShowProfile(false);
            }
          }
        }}>
          <div className="" ref={profileContainer}>
            <Profile />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home