import {useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Friend } from '../../interface/user';
import { socket } from '../../socket/socket';

import { updateOnlineState, addFriend, addAllFriends } from '../../app/features/friendSlice';
import { getAllFriends } from '../../api/api';
import { requestHandler } from '../../utils';

import { skChatItems } from '../chat/ChatList';

const FriendList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setisLoading] = useState(false)

  const selectFriends = (state:any) => state.friends
  const friends:Friend[] = useSelector(selectFriends)


  useEffect(() => { 
    
    socket.on('onlineStatus', (data:{id: string, status: Boolean}) => {
      console.log(data);
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
          <span className='font-semibold text-[20px]'>Friends</span>
          <span className='text-[24px] flex gap-[9px]'>
            <span><i className='bx bx-edit' ></i></span>
            <span><i className='bx bx-filter'></i></span>
          </span>
        </div>
        <div className="search-box flex items-center bg-[#464545] rounded-[4px]">
          <span className='flex-center'><i className='bx bx-search-alt-2 py-[5px] pl-[5px]' ></i></span>
          <input name='search-chats' type="text" placeholder='search your friends by their username' className=' px-[7px] py-[4px] bg-transparent text-[14px] border-none outline-none flex-1' />
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
                <div className='w-full flex-shrink-0 flex items-center gap-[10px] py-[10px] px-[.5rem] hover:bg-[#373737] rounded-[5px] cursor-default ' key={friend._id} >
                  <div className={`${friend.isOnline ? 'online': ''} left w-[35px] h-[35px] rounded-full overflow-visible`}>
                    <img src={friend.avatar.url} alt={'avatar'} className='w-full object-cover object-center h-full rounded-full' loading='lazy' />
                  </div>
                  <div className="middle text-[14px] flex-1 ">
                    <div className="name flex justify-between items-center w-full ">
                      <span>{friend.username}</span>
                    </div>
                    <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{friend.about}</div>
                  </div>
                  <button className='right px-[6px] py-[4px] bg-[#424242] text-[#ff7f7f] rounded-[5px]'>
                    <i className='bx bx-trash'></i>
                  </button>
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
        {/* <Outlet /> */}
      </div>
    </div>
    </>
  )
}

export default FriendList
