import { useNavigate, useParams } from 'react-router-dom'
import './Chats.scss'

import { sampleData } from './sampleData'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

interface Friend {
  avatar: {
    localPath: string;
    url: string,
    _id: string,
  },
  username: string,
  about: string,
  _id: string,
}
interface User {
    id: string,
    logo: string,
    name: string,
    lastSeen: string,
    lastMessage: string,
    messageStatus: string
}
const Chat = () => {
  const { id } = useParams()
  const [friendData, setFriendData] = useState<Friend | undefined>(undefined)

  const selectFriends = (state:any) => state.friends;
  const friends:Friend[] = useSelector(selectFriends);

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const friend:Friend | undefined = friends.find(friend => friend._id === id);
      setFriendData(friend)
    }
  },[id])
  
  return (
    <div className="chat-box-container bg-primary flex flex-col ">
      <div className="chat-box-header bg-secondary px-[5px] py-[8px] flex items-center text-[28px] justify-between">
        <div className="left flex items-center gap-[5px]">
          <span className='flex-center mr-[5px] cursor-pointer' onClick={() => navigate('/app/home/chats')}><i className='bx bxs-left-arrow-alt'></i></span>
          <div className='logo w-[36px] h-[36px] rounded-full object-cover object-center'>
            <img src={friendData?.avatar.url} alt={'avatar'} className='w-full h-full object-cover ' />
          </div>
          <div className="name text-[16px] font-semibold leading-4">
            <div className='overflow-hidden'>{friendData?.username}</div>
            <div className='text-[12px] text-[gray]'>{friendData?.about}</div>
          </div>
        </div>
        <div className="right flex items-center text-[20px] gap-[5px]">
          <div className="call-btn flex items-center gap-[1px] rounded-[5px]">
            <div className="vedio cursor-pointer py-[8px] px-[10px] bg-[#484747b1] hover:bg-[#555454d6] flex-center"><i className='bx bx-video'></i></div>
            <div className="audio cursor-pointer py-[8px] px-[10px] bg-[#484747b1] hover:bg-[#555454d6] flex-center"><i className='bx bx-phone'></i></div>
          </div>
          <div className="search cursor-pointer py-[8px] px-[10px] hover:bg-[#484747bf] flex-center rounded-[5px]">
            <i className='bx bx-search-alt-2' ></i>
          </div>
        </div>
      </div>

      <div className="chat-box flex-1 ">

      </div>

      <div className="chat-box-footer w-full h-[4rem] px-[.5rem] bg-secondary flex gap-[8px] items-center text-[20px]">
        <span><i className='bx bx-smile p-[8px] flex-center hover:bg-[#5a57577b] rounded-[5px]'></i></span>
        <span><i className="fa-solid fa-paperclip text-[16px]"></i></span>
        <input type="text" placeholder='Type a message' className='text-[14px] bg-transparent px-[5px] py-[5px] flex-1 border-none outline-none' />
        <span><i className='bx bx-microphone p-[8px] flex-center hover:bg-[#5a57577b] rounded-[5px]' ></i></span>
      </div>

    </div>
  )
}

export default Chat
