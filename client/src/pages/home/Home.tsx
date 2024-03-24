import { Outlet } from 'react-router-dom'
import ChatList from '../../components/chat/ChatList'
import './home.scss'

const Home = () => {
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
          <span className=''><i className='bx bx-cog' ></i></span>
          <span className=''><i className='bx bx-user-circle'></i></span>
        </div>
      </div>
      <div className="main-container">
        <Outlet />
      </div>
    </div>
  )
}

export default Home
