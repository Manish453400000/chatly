import { Outlet } from 'react-router-dom'
import './home.scss'
import Profile from '../../components/profile/Profile'
import { useRef, useState } from 'react'

const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const profileContainer = useRef<HTMLDivElement>(null);

  return (
    <div className='home-container bg-primary'>
      <div className="navigation-bar">
        <div className="top">
          <span className='active'><i className='bx bx-message-rounded-detail'></i></span>
          <span className=''><i className='bx bx-phone' ></i></span>
          <span className=''><i className='bx bx-shape-circle'></i></span>
        </div>
        <div className="bottom">
          <span className=''><i className='bx bx-star' ></i></span>
          <span className='' onClick={() => setShowProfile(prev => !prev)}><i className='bx bx-cog' ></i></span>
          <span className='' onClick={() => setShowProfile(prev => !prev)}><i className='bx bx-user-circle'></i></span>
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