import { Outlet, useNavigate } from 'react-router-dom'
import './Chats.scss'

import { sampleData } from './sampleData'

const ChatList = () => { 
  const navigate = useNavigate();

  return (
    <>
    <div className="chats-list bg-secondary flex flex-col gap-[10px] flex-1 md:flex-none md:max-w-[30rem]">
      <div className="chat-list-header px-[.5rem]">
        <div className="featurs flex justify-between">
          <span className='font-semibold text-[20px]'>Chats</span>
          <span className='text-[24px] flex gap-[9px]'>
            <span><i className='bx bx-edit' ></i></span>
            <span><i className='bx bx-filter'></i></span>
          </span>
        </div>
        <div className="search-box flex items-center bg-[#464545] rounded-[4px]">
          <span className='flex-center'><i className='bx bx-search-alt-2 py-[5px] pl-[5px]' ></i></span>
          <input type="text" placeholder='search or start a new chat' className=' px-[7px] py-[4px] bg-transparent text-[14px] border-none outline-none flex-1' />
        </div>
      </div>
      <div className="friend-list flex-1 flex flex-col gap-[5px]">
        {
          sampleData.map((user) => (
            <div className='w-full flex items-center gap-[10px] py-[10px] px-[.5rem] hover:bg-[#373737] rounded-[5px] cursor-pointer' key={user.id} onClick={() => navigate(`/app/home/chats/user/:${user.id}`)}>
              <div className="left w-[35px] h-[35px] rounded-full overflow-hidden">
                <img src={user.logo} alt={user.name} className='w-full object-cover object-center' />
              </div>
              <div className="right text-[14px] flex-1 ">
                <div className="name flex justify-between items-center w-full ">
                  <span>{user.name}</span>
                  <span className='text-[11px] text-[#d1d1d1]'>{user.lastSeen}</span>
                </div>
                <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{user.lastMessage}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
    <div className="flex-1 hidden md:block bg-secondary">
      <Outlet />
    </div>
    </>
  )
}

export default ChatList
