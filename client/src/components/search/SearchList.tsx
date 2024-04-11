import React, { useEffect, useRef, useState } from 'react'
import { debouncer } from '../../utils'
import { acceptRequest, getAllNotifications, rejectRequest, searchUsers, sentRequest } from '../../api/api'
import { requestHandler } from '../../utils'
import './style.scss';
import { useSocket } from '../../context/SocketContext';


//skeleton chatList
const skUserItems = () => {

  return(
    <div className='chat-item flex-shrink-0 h-[3.4rem] flex gap-[10px] items-center py-[10px] px-[.5rem] w-full rounded-[5px] overflow-hidden' key={Math.floor(Math.random()*1000)}>
      <div className="logo w-[34px] h-[34px] rounded-full skeleton"></div>
      <div className="middle flex-1 flex flex-col gap-[5px]">
        <div className="top flex justify-between">
          <div className="name w-[5rem] skeleton skeleton-text"></div>
        </div>
        <div className="bottom w-full skeleton skeleton-text"></div>
      </div>
      <div className="right skeleton w-[48px] h-[25px] rounded-[5px]"></div>
    </div>
  )
}
const skRequestItems = () => {

  return(
    <div className='chat-item flex-shrink-0 h-[3.4rem] flex gap-[10px] items-center py-[10px] px-[.5rem] w-full rounded-[5px] overflow-hidden' key={Math.floor(Math.random()*1000)}>
      <div className="logo w-[34px] h-[34px] rounded-full skeleton"></div>
      <div className="middle flex-1 flex flex-col gap-[5px]">
        <div className="top flex justify-between">
          <div className="name w-[5rem] skeleton skeleton-text"></div>
        </div>
        <div className="bottom w-full skeleton skeleton-text"></div>
      </div>
      <div className="right skeleton w-[48px] h-[25px] rounded-[5px]"></div>
      <div className="right skeleton w-[48px] h-[25px] rounded-[5px]"></div>
    </div>
  )
}

interface User {
  avatar: {
    localPath: string;
    url: string,
    _id: string,
  },
  isFriend: boolean,
  about: string,
  username: string,
  _id: string,
}

interface Request {
  status: string,
  requestId: string,
  sender: {
    _id: string,
    username: string,
    about: string,
    avatar: {
      localPath: string,
      url: string,
      _id: string,
    },
  }
}

const SearchList = () => {

  const { socket } = useSocket();

  const [isLoading, setIsLoading] = useState(false);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const [isDataEmpty, setIsDataEmpty] = useState(true);
  const [defaultMessage, setDefaultMessage] = useState("Search your friends and secrete crush  by their username...")

  const [floading, setFloading] = useState(false);
  const [showNotificationBox, setShowNotificationBox] = useState(false);
  const [notificationSearch, setNotificationSearch] = useState('')
  const [notification, setNotification] = useState<Request[]>([])
  const [isNotificationLoading, setIsNotificationLoading] = useState(false)

  const requestList = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<User[]>([
      {
        avatar: {
          localPath: "",
          url: "",
          _id: "",
        },
        isFriend: false,
        username: "",
        about: "",
        _id: "",
      },
  ])

  

  const handelSearchQuery = async (query: string) => {
    if(query.trim().length < 1) return;
    await requestHandler(
      async () => await searchUsers(query),
      setIsLoading,
      (response) => {
        const { data } = response;
        console.log(data);
        
        setIsDataEmpty(false);
        setData(data);
        if(data.length < 1) {
          setIsDataEmpty(true);
          setDefaultMessage("User not found...");
        }
      },
      alert
    )
  }

  const handelSentRequest = async (userId: string) => {
    if(userId.trim() === "") return;
    const reqData = {
      receiverId: userId,
    }
    await requestHandler(
      async () => await sentRequest(reqData),
      setIsRequestLoading,
      (Response) => {
        console.log(Response);
      },
      alert
    )
  }

  const debounceSearch = debouncer(handelSearchQuery, 400);
  const handelInputChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    debounceSearch(query);
  }

  useEffect(() => {
    if(socket) {
      socket.on('requestReceived', (data:Request) => {
        setNotification(prevState => [...prevState, data])
        console.log(data);
      });
    }
    (async() => {
      await requestHandler(
        async () => await getAllNotifications(),
        setIsNotificationLoading,
        (res) => {
          setNotification(res.data)
        },
        alert
      )
    })()
  },[])

  const handelAcceptRequest = async (requsetId: string) => {
    console.log(requsetId.toString());
    await requestHandler(
      async() => await acceptRequest(requsetId.toString()),
      setFloading,
      (res) => {
        console.log(res);
        setNotification(notification.filter(notification => notification.requestId !== requsetId))
      },
      alert
    )
  }
  const handelRejectRequest = async (requsetId: string) => {
    await requestHandler(
      async() => await rejectRequest(requsetId),
      setFloading,
      (res) => {
        console.log(res);
        setNotification(notification.filter(notification => notification.requestId !== requsetId))
      },
      alert
    )
  }

  return (
    <div className='main-container flex gap-[2px]'>
      <div className="content-list-container bg-secondary px-[.5rem] w-full md:w-[30%] md:max-w-[30rem] min-w-[16rem] flex flex-col gap-[.5rem]">
        <div className="list-header flex flex-col justify-center gap-[10px] px-[.5rem] pt-[1rem]">
          <div className="featurs flex justify-between">
            <span className='font-semibold text-[20px]'>Requests</span>
            <span className={`text-[20px] flex gap-[9px] ${notification.length < 1 ? "": "notification"}`} id='notification-bell' onClick={() => setShowNotificationBox(prevState => !prevState)}>
              <span className='flex-center'><i className='bx bx-bell'></i></span>
            </span>
          </div>
          <div className="search-box flex items-center bg-[#464545] rounded-[4px]">
            <span className='flex-center'><i className='bx bx-search-alt-2 py-[5px] pl-[5px]' ></i></span>
            <input 
            type="text" 
            placeholder='search by username'
            className=' px-[7px] py-[4px] bg-transparent text-[14px] border-none outline-none flex-1'
            onChange={handelInputChange}
            />
          </div>
        </div>
        <div className="list custom-scrollbar flex-1">
          {
            isLoading ? 
            <div>
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}
             {skUserItems()}

            </div>
            :
            isDataEmpty ? 
            <div className='text-center text-[13px] text-[#838080] h-full flex-center'>{defaultMessage}</div>
            :
            data.map(user => (
                <div className='w-full flex-shrink-0 flex items-center gap-[10px] py-[10px] px-[.5rem] hover:bg-[#373737] rounded-[5px]' key={user._id} >
                  <div className="left w-[35px] h-[35px] rounded-full overflow-hidden">
                    <img src={user.avatar.url} alt={user.username} className='w-full object-cover object-center aspect-square' loading='lazy' />
                  </div>
                  <div className="middle text-[14px] flex-1 ">
                    <div className="name flex justify-between items-center w-full ">
                      <span>{user.username}</span>
                    </div>
                    <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{'manish'}</div>
                  </div>
                  <button className={`${user.isFriend ? 'bg-[#576850] text-[#c1bfbf] text-[12px]':'bg-spacial'} right px-[10px] text-[16px] rounded-[5px] flex-center py-[4px] text-black cursor-pointer`} onClick={() => {handelSentRequest(user._id)}}>
                    {
                      user.isFriend ? 
                      <i className="fa-solid fa-user-check"></i>
                      :
                      <i className="fa-solid fa-user-plus"></i>
                    }
                  </button>
                </div>
            ))
          }
        </div>
      </div>
      <div className="details-list-container relative bg-secondary flex-1 ">
        <div className="default-message absolute z-[0] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center gap-[8px] text-[14px] text-[gray] text-center w-[80%]">
        <span className='text-[22px] text-white'>Whishhhh...</span>
        <span>Send and receive messages without keeping your phone online.</span>
        <span>Use Whishhhh... on up to 4 linked devices and 1 phone at the same time.</span>
        <span className='flex gap-[5px] items-center justify-center mt-[2rem]'>
          <span className='pt-[3px]'><i className='bx bx-lock-alt' ></i></span>
          <span>End-to-end encrypted</span>
        </span>
        </div>

        <div className={`${showNotificationBox ? 'opacity-1 ':'opacity-0 hidden'} notify-box absolute w-[100vw] h-[100vh] py-[1.5rem] px-[5px]`} 
        onClick={(e) => {
          if(requestList){
            const item = requestList.current;
            if(!item?.contains(e.target as Node)){
              setShowNotificationBox(false);
            }
          }
        }}>
          <div className="requestList px-[10px] py-[8px] w-[100%] max-w-[26rem] h-[30rem] rounded-[5px] flex flex-col gap-[10px]" ref={requestList}>
            <div className="list-header flex flex-col justify-center gap-[10px] px-[.5rem] pt-[.5rem]">
            <div className="featurs flex justify-between">
              <span className='font-semibold text-[20px]'>Notifications</span>
            </div>
            <div className="search-box flex items-center bg-[#464545] rounded-[4px]">
              <span className='flex-center'><i className='bx bx-search-alt-2 py-[5px] pl-[5px]' ></i></span>
              <input 
              type="text" 
              placeholder='search by username'
              className=' px-[7px] py-[4px] bg-transparent text-[14px] border-none outline-none flex-1'
              onChange={(e) => setNotificationSearch(e.target.value)}
              />
            </div>
            </div>
            <div className="notification-list custom-scrollbar flex-1 flex flex-col gap-[6px] ">
              {
                isNotificationLoading ?
                <div>
                  {skRequestItems()}
                  {skRequestItems()}
                  {skRequestItems()}
                  {skRequestItems()}
                  {skRequestItems()}
                </div>
                :
                <div className='flex flex-col'>
                  {
                    notification.map(request => {
                      return (
                        <div className='w-full flex-shrink-0 flex items-center gap-[10px] py-[10px] px-[.5rem] hover:bg-[#373737] rounded-[5px]' key={request.requestId} >
                          <div className="left w-[35px] h-[35px] rounded-full overflow-hidden">
                            <img src={request.sender.avatar.url} alt={'avatar'} className='w-full object-cover object-center' loading='lazy' />
                          </div>
                          <div className="middle text-[14px] flex-1 ">
                            <div className="name flex justify-between items-center w-full ">
                              <span>{request.sender.username}</span>
                            </div>
                            <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{request.sender.about}</div>
                          </div>
                          <button className="right px-[15px] text-[16px] rounded-[5px] flex-center py-[4px] bg-[#ffaeae] text-black cursor-pointer" onClick={() => {handelRejectRequest(request.requestId)}}>
                            {
                              isRequestLoading ? 
                              <i className="fa-solid fa-gear fa-spin"></i>
                              :
                              <i className="fa-solid fa-xmark"></i>
                            }
                          </button>
                          <button className="right px-[15px] text-[16px] rounded-[5px] flex-center py-[4px] bg-spacial text-black cursor-pointer" onClick={() => {handelAcceptRequest(request.requestId)}}>
                            {
                              isRequestLoading ? 
                              <i className="fa-solid fa-gear fa-spin"></i>
                              :
                              <i className="fa-solid fa-check"></i>
                            }
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
              }
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SearchList
