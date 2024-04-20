import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import './Chats.scss'

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addAllFriends, addFriend, updateOnlineState } from '../../app/features/friendSlice';

import { requestHandler } from '../../utils';
import { createGroupChat, getAllFriends, getAllChats } from '../../api/api';
import { useSocket } from '../../context/SocketContext';
import { addAllChats, addChat, addMessage, newMessageCame } from '../../app/features/chatsSlice';

//interface
import { Chats, Message } from '../../interface/api';


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

  const location = useLocation();

  const {socket} = useSocket();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const groupBox = useRef<HTMLDivElement>(null)

  const [groupName, setGroupName] = useState('');
  const [groupParticipants, setGroupParticipants] = useState<string[]>([])

  const [showChatBox, setShowChatBox] = useState(false);
  const [showGroupBox, setShowGroupBox] = useState(false);

  const [isLoading, setisLoading] = useState(false)
  const [_isGroupCreateLoading, setisGroupCreateLoading] = useState(false);

  const selectFriends = (state:any) => state.friends
  const friends:Friend[] = useSelector(selectFriends)
  const selectChats = (state:any) => state.chats
  const chats:Chats[] = useSelector(selectChats)

  const [lastLocationPath, setLastLocationPath] = useState('');

  useEffect(() => {
    const locationPath = location.pathname.split('/')
    const lastPath = locationPath[locationPath.length - 1];
    setLastLocationPath(lastPath)
  },[location.pathname])

  useEffect(() => {  
    if(socket) {
      socket.on('onlineStatus', (data:{id: string, status: Boolean}) => {
        console.log(data);  
        dispatch(updateOnlineState(data))
      })

      socket.on('requestAccepted', (data: Friend) => {
        dispatch(addFriend(data));
      });
    }
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
    })();
    (async() => {
      await requestHandler(
        async () => getAllChats(),
        setisLoading,
        (res) => {
          const payload = {
            chats: res.data
          }
          dispatch(addAllChats(payload))
        },
        alert
      )
    })()

    
    return () => {
      // console.log('unmounted');
    }
  },[])

  const handleNewMessageCount = useCallback((message:Message) => {
    dispatch(addMessage({message, chatId: message.chat}))
    console.log("ll: ",lastLocationPath, "mc: ",message.chat);
    if(!(lastLocationPath === message.chat)){
      dispatch(newMessageCame({_id: message.chat}))
    }
  },[lastLocationPath])


  useEffect(() => {
  if(!socket) return;
  socket.on('messageReceived', (message:Message) => {
    handleNewMessageCount(message);
    
  })
  return () => {
    socket.off('messageReceived', (message:Message) => {
      handleNewMessageCount(message);
    })
  }
  },[socket])

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handelResize = () => {
      if(window.innerWidth < 768 ){
        setIsMobile(true)
      }else{
        setIsMobile(false);
      }
    }
    window.addEventListener('resize', handelResize);
    
    return () => {
      window.removeEventListener('resize', handelResize);
    }
  },[])

  useEffect(() => {
    
    const lastPath =  location.pathname.split('/')
    if(lastPath[lastPath.length - 1] == 'chats') {
      setShowChatBox(false)
      
    }else{
      setShowChatBox(true)
    }
    
  }, [location])

  const handelParticipantsSelection = (id:string) => {
    setGroupParticipants(prev => [...prev, id])
  }

  const handelGroupCreat = () => {
    const data = {
      name: groupName,
      groupIds: groupParticipants
    }
    requestHandler(
      async () => await createGroupChat(data),
      setisGroupCreateLoading,
      (res) => {
        const group = {
          group: res.data[0]
        };
        console.log(group);
        dispatch(addChat(group))
        setShowGroupBox(false)
      },
      alert
    )
  }
  
  return (
    <>
    <div className={`${isMobile ? `${showChatBox ? 'hidden': ''}` : ''} chats-list bg-secondary flex flex-col gap-[10px] flex-1 md:flex-none md:max-w-[30rem]`}>
      <div className={`chat-list-header px-[.5rem]`}>
        <div className="featurs flex justify-between">
          <span className='font-semibold text-[20px]'>Chats</span>
          <span className='text-[24px] flex gap-[14px]'>
            <span><i className='bx bx-edit text-[20px]' ></i></span>
            <span className='flex-center cursor-pointer' onClick={() => setShowGroupBox(true)}><i className="fa-solid fa-users text-[16px]"></i></span>
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
                chats.length < 1 ? 
                <div></div>
                :
                chats.map((chat) => (
                  !chat.isGroupChat ? 
                    <div className='w-full flex-shrink-0 flex items-center gap-[10px] py-[10px] px-[.5rem] hover:bg-[#373737] rounded-[5px] cursor-pointer' key={chat._id} onClick={() => navigate(`/app/home/chats/user/${chat.participantDetails[0]._id}`)}>
                      <div className={`${friends.map(f => f._id === chat.participantDetails[0]._id && f.isOnline ? ' online ':'')} left w-[35px] h-[35px] rounded-full overflow-visible`}>
                        <img src={chat.participantDetails[0].avatar.url} alt={'avatar'} className='w-full object-cover object-center h-full rounded-full' loading='lazy' />
                      </div>
                      <div className="middle text-[14px] flex-1 ">
                        <div className="name flex justify-between items-center w-full ">
                          <span>{chat.participantDetails[0].username} </span>
                        </div>
                        <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{chat.participantDetails[0].about}</div>
                      </div>
                      <div className="right overflow-hidden h-full flex flex-col justify-start items-center">
                        <span className='text-[11px] text-[#d1d1d1]'>{'today'}</span>
                        {
                          chat.newMessageCount && chat.newMessageCount > 0 ? (
                            <span className='px-[5px] overflow-hidden text-[11px] mt-[4px] rounded-full bg-[#9fcf56] text-[black] flex-center font-[700]'>
                              {chat.newMessageCount}
                            </span>
                          ):
                          (
                            <span></span>
                          )
                        }
                      </div>
                    </div>
                  :
                    <div className='w-full flex-shrink-0 flex items-center gap-[10px] py-[10px] px-[.5rem] hover:bg-[#373737] rounded-[5px] cursor-pointer' key={chat._id} onClick={() => navigate(`/app/home/chats/group/${chat._id}`)}>
                      <div className={` left w-[35px] h-[35px] rounded-full overflow-visible`}>
                        <img src={chat.groupAvatar.url} alt={'avatar'} className='w-full object-cover object-center h-full rounded-full' loading='lazy' />
                      </div>
                      <div className="right text-[14px] flex-1 ">
                        <div className="name flex justify-between items-center w-full ">
                          <span>{chat.name}</span>
                        </div>
                        <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{chat.admin || ''}</div>
                      </div>
                      <div className="right overflow-hidden h-full flex flex-col justify-start items-center">
                        <span className='text-[11px] text-[#d1d1d1]'>{'today'}</span>
                        {
                          chat.newMessageCount && chat.newMessageCount > 0 ? (
                            <span className='px-[5px] overflow-hidden text-[11px] mt-[4px] rounded-full bg-[#9fcf56] text-[black] flex-center font-[700]'>
                              {chat.newMessageCount}
                            </span>
                          ):
                          (
                            <span></span>
                          )
                        }
                      </div>
                    </div>
                ))
              }
            </div>
        }
      </div>
    </div>
    <div className={`${ isMobile ? `${showChatBox ? '': 'hidden'}` : ''} flex-1 md:block bg-secondary relative`}>
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
    <div className={`${showGroupBox ? "flex-center":"hidden"} w-[100vw] h-[100vh]   absolute pop-up-container z-[30]`} 
    onClick={(e) => {
      if(groupBox.current) {
        if(!groupBox.current?.contains(e.target as Node)){
          setShowGroupBox(false)
        }
      }
    }}>
      <div className='w-[94%] px-[6px] pt-[10px]  max-w-[20rem] group-box rounded-[5px]' ref={groupBox}>
        <div className={`chat-list-header px-[.5rem] flex flex-col gap-[10px]`}>
          <div className="featurs flex justify-between">
            <span className='font-semibold text-[20px]'>Create Group</span>
          </div>
          <div>
            <span className='text-[#b4b4b4] text-[15px]'>Name</span>
            <div className="search-box flex items-center bg-[#464545] rounded-[4px]">
              <input 
              name='search-chats' 
              type="text" 
              placeholder='Enter group name' 
              className=' px-[7px] py-[4px] bg-transparent text-[14px] border-none outline-none flex-1'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
          </div>

        </div>
        <div className="friends-list-select h-[18rem] custom-scrollbar mt-[10px]">
          {
            friends.length < 1 ?
            <div className=' w-full h-[100%] flex-center text-[13px] text-[gray]'>Make friends to chat</div>
            :
            friends.map((friend) => (
              <div className={`${groupParticipants.includes(friend._id) ? 'bg-[#567723] text-[#ffffff]':'hover:bg-[#4d4d4d]'} w-full flex-shrink-0 flex items-center  mb-[5px] gap-[10px] py-[10px] px-[.5rem]  rounded-[5px] cursor-default`} key={friend._id}>
                <div className={` left w-[35px] h-[35px] rounded-full overflow-visible`}>
                  <img src={friend.avatar.url} alt={'avatar'} className='w-full object-cover object-center h-full rounded-full' loading='lazy' />
                </div>
                <div className="middle text-[14px] flex-1 ">
                  <div className="name flex justify-between items-center w-full ">
                    <span className='font-semibold'>{friend.username}</span>
                  </div>
                  <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{friend.about}</div>
                </div>
                <div className={`${groupParticipants.includes(friend._id) ? 'hidden':'flex'}  right justify-center items-center  cursor-pointer`} onClick={() => handelParticipantsSelection(friend._id)}>
                  <span><i className="fa-solid fa-plus text-[18px]"></i></span>
                </div>
                <div className={`${groupParticipants.includes(friend._id) ? 'flex':'hidden'}  right justify-center items-center  cursor-pointer`} onClick={() => setGroupParticipants((prev) => prev.filter(e => e !== friend._id))}>
                  <span><i className="fa-solid fa-xmark text-[#fe8f8f] text-[20px]"></i></span>
                </div>
              </div>
          ))}
          
        </div>
        <div className='flex-center py-[5px]'>
          <button className={`${ groupName.trim().length > 2 && groupParticipants.length > 1 ? 'bg-[#9fcf56] text-[black]':'bg-[#3d4f21] text-[#c9c9c9]'} px-[10px] py-[5px] w-[70%] rounded-[5px]`} onClick={handelGroupCreat}>Create</button>
        </div>
      </div>
    </div>
    </>
  )
}

export default ChatList
