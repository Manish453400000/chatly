import { Outlet, useNavigate } from 'react-router-dom'
import './Chats.scss'

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addAllFriends, addFriend, updateOnlineState } from '../../app/features/friendSlice';

import { requestHandler } from '../../utils';
import { getAllFriends } from '../../api/api';

import { socket } from '../../pages/home/Home';


//skeleton chatList
export const skChatItems = () => {
  return(
    <div className='chat-item flex-shrink-0 h-[3.4rem] flex gap-[10px] items-center py-[10px] px-[.5rem] w-full rounded-[5px] overflow-hidden'>
      <div className="logo w-[34px] h-[34px] rounded-full skeleton"></div>
      <div className="right flex-1 flex flex-col gap-[5px]">
        <div className="top flex justify-between">
          <div className="name w-[5rem] skeleton skeleton-text"></div>
          <div className="lastseen w-[4rem] skeleton skeleton-text"></div>
        </div>
        <div className="bottom w-full skeleton skeleton-text"></div>
      </div>
    </div>
  )
}

interface Friend {
  avatar: {
    localPath: string;
    url: string,
    _id: string,
  },
  isOnline: boolean,
  username: string,
  about: string,
  chatId: string,
  _id: string,
}

const ChatList = () => { 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setisLoading] = useState(false)

  const selectFriends = (state:any) => state.friends
  const friends:Friend[] = useSelector(selectFriends)


  useEffect(() => { 
    
    socket.on('onlineStatus', (data:{id: string, status: Boolean}) => {
      dispatch(updateOnlineState(data))
    })

    socket.on('requestAccepted', (data: Friend) => {
      dispatch(addFriend(data));
    });
    (async() => {
      await requestHandler(
        async () => getAllFriends(),
        setisLoading,
        (res) => {
          const payload = {
            friends: res.data
          }
          dispatch(addAllFriends(payload))
        },
        alert
      )
    })()
    return () => {
      // console.log('unmounted');
    }
  },[])
  
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
          <input name='search-chats' type="text" placeholder='search or start a new chat' className=' px-[7px] py-[4px] bg-transparent text-[14px] border-none outline-none flex-1' />
        </div>
      </div>
      <div className="friend-list flex-1 flex flex-col gap-[5px] overflow-auto h-full">
        {
          isLoading ? 
            <div className='flex flex-col gap-[10px] overflow-auto custom-scrollbar'>
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
              {skChatItems()}
            </div>
            :
            <div className='flex flex-col gap-[10px] overflow-auto custom-scrollbar h-full'>  
              {
                friends.length < 1 ?
              <div className=' w-full h-[100%] flex-center text-[13px] text-[gray]'>Make friends to chat</div>
              :
              friends.map((friend) => (
                <div className='w-full flex-shrink-0 flex items-center gap-[10px] py-[10px] px-[.5rem] hover:bg-[#373737] rounded-[5px] cursor-pointer' key={friend._id} onClick={() => navigate(`/app/home/chats/user/${friend._id}`)}>
                  <div className={`${friend.isOnline ? 'online': ''} left w-[35px] h-[35px] rounded-full overflow-visible`}>
                    <img src={friend.avatar.url} alt={'avatar'} className='w-full object-cover object-center h-full rounded-full' loading='lazy' />
                  </div>
                  <div className="right text-[14px] flex-1 ">
                    <div className="name flex justify-between items-center w-full ">
                      <span>{friend.username}</span>
                      <span className='text-[11px] text-[#d1d1d1]'>{'today'}</span>
                    </div>
                    <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{friend.about}</div>
                  </div>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
    <div className="flex-1 hidden md:block bg-secondary relative">
      <div className="default-message absolute z-[0] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-[8px] text-[14px] text-[gray] text-center w-[80%]">
        <span className='text-[22px] text-white'>Whishhhh...</span>
        <span>Send and receive messages without keeping your phone online.</span>
        <span>Use Whishhhh... on up to 4 linked devices and 1 phone at the same time.</span>
        <span className='flex gap-[5px] items-center justify-center mt-[2rem]'>
          <span className='pt-[3px]'><i className='bx bx-lock-alt' ></i></span>
          <span>End-to-end encrypted</span>
        </span>
      </div>
      <div className="absolute w-full h-full z-[1]">
        <Outlet />
      </div>
    </div>
    </>
  )
}

export default ChatList
