import { useNavigate, useParams } from 'react-router-dom'
import './Chats.scss'

import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { User } from '../../interface/user';
import { Chats, Message } from '../../interface/api';

import { requestHandler } from '../../utils';
import { editGroupAvatar, sentMessages } from '../../api/api';
// import { useSocket } from '../../context/SocketContext';
import { messageReaded, updateChat } from '../../app/features/chatsSlice';


const GroupChat = () => {
  
  // const {socket} = useSocket();
  
  const { id } = useParams()
  const [GroupData, setGroupData] = useState<Chats | undefined>(undefined)

  const chatBox = useRef<HTMLDivElement | null>(null)

  const selectUser = (state:any) => state.user.data.user
  const user:User = useSelector(selectUser)
  const selectUserInfo = (state:any) => state.user.isAuthenticated
  const isAuthenticated:User = useSelector(selectUserInfo)

  const [messageInput, setMessageInput] = useState('')

  const [isLoading, _setIsLoading] = useState(false);
  const [_isMessageSent, setIsMessageSent] = useState(false);

  const [messages, setMessages] = useState<Message[]>([])
  const [showSendButton, setShowSendButton] = useState(false);
  const [showGroupBox, setShowGroupBox] = useState(false);

  const selectChats = (state:any) => state.chats;
  const chats:Chats[] = useSelector(selectChats);

  const navigate = useNavigate();

  const selectChat = (state:any) => state.chats;
  const chat = useSelector(selectChat).find((chat:any) => chat._id === id);


  useEffect(() => {
    if(chat) {
      setMessages(chat.messages)
      setGroupData(chat);
    }
  },[chat])

  useEffect(() => {
    console.log(isAuthenticated);
    
    if (!isAuthenticated) navigate('/app/auth/login')
  },[])

  useEffect(() => {
    if(messageInput.trim().length > 0){
      setShowSendButton(true);
    }else{
      setShowSendButton(false);
    }
  }, [messageInput])
  
  useEffect(() => {
    if(chatBox.current){
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  },[messages])



  useEffect(() => {
    if (id) {
      const chat:Chats | undefined = chats.find(chat => chat._id === id);
      setGroupData(chat)
    }
    
  },[id])

  const handelSentMessage = async() => {
    await requestHandler(
      async () => await sentMessages(messageInput, GroupData?._id),
      setIsMessageSent,
      (res) => {
        setMessages((prevMessages) => [...prevMessages, res.data])
        setMessageInput('')
      },
      alert
    )
  }

  const [file, setFile] = useState<File | null>(null)
  const [isAvatarLoading, setIsAvatarLoading] = useState(false)
  const dispatch = useDispatch();

  const handelFile = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFile(file)
    }
  }

  const handelUpdateAvatar = async () => {
    if(!file) return
    const data = new FormData()
    data.append('avatar', file)
    console.log(data);
    await requestHandler(
      async() => await editGroupAvatar(data, id!),
      setIsAvatarLoading,
      (response) => {
        console.log(response.data);
        
        dispatch(updateChat({
          group: response.data.group
        }))
        setFile(null)
      },
      alert
    )
  }

  useEffect(() => {
    if(id) {
      console.log(id);
      dispatch(messageReaded({_id: id}))
    }
  },[id])
  
  return (
    <div className="chat-box-container bg-primary flex flex-col ">
      <div className="chat-box-header bg-secondary px-[5px] py-[8px] flex items-center text-[28px] justify-between">
        <div className="left flex items-center gap-[5px]">
          <span className='flex-center mr-[5px] cursor-pointer' onClick={() => navigate('/app/home/chats')}><i className='bx bxs-left-arrow-alt'></i></span>
          <div className='logo w-[36px] h-[36px] rounded-full object-cover object-center'>
            <img src={GroupData?.groupAvatar.url} alt={'avatar'} className='w-full h-full object-cover ' />
          </div>
          <div className="name text-[16px] font-semibold">
            <div className='overflow-hidden'>{GroupData?.name}</div>
            <div className='text-[12px] text-[gray] w-[8rem] whitespace-nowrap text-ellipsis'>{GroupData?.participantDetails[0].username}...</div>
          </div>
        </div>
        <div className="right flex items-center text-[20px] gap-[5px]">
          <div className="call-btn hidden md:flex items-center gap-[1px] rounded-[5px]">
            <div className="vedio cursor-pointer py-[8px] px-[10px] bg-[#484747b1] hover:bg-[#555454d6] flex-center"><i className='bx bx-video'></i></div>
            <div className="audio cursor-pointer py-[8px] px-[10px] bg-[#484747b1] hover:bg-[#555454d6] flex-center"><i className='bx bx-phone'></i></div>
          </div>
          <div className="search cursor-pointer py-[8px] px-[10px] hover:bg-[#484747bf] flex-center rounded-[5px]" onClick={() => setShowGroupBox(prev => !prev)}>
            <i className="fa-solid fa-bars"></i>
          </div>
        </div>
      </div>
      <div className={`${showGroupBox ? '': 'hidden'} chat-info-box flex flex-col items-center absolute right-0 top-[4rem] z-[20] rounded-[5px] px-[10px] py-[15px] w-[90%] max-w-[23rem]`}>
        <div className='flex justify-center gap-[15px]'>
        <div className="avatar-profile w-[5rem] rounded-full relative  overflow-visible aspect-square">
          <img src={ GroupData?.groupAvatar?.url} className=' object-cover overflow-hidden rounded-[50%] w-full aspect-square' alt="" />
          <label htmlFor="fileInput">
            <div className="pen bg-white rounded-full flex-center text-[20px] absolute bottom-0 right-0 z-30 p-[5px] text-black cursor-pointer ">
                <i className='bx bx-pencil'></i>
                <input type="file" id='fileInput' onChange={(e) => handelFile(e)} className=' hidden' />
            </div>
          </label>
        </div>
        <div className='flex justify-center items-start'>
          { !file ? 
            <div></div>
            :
            <div className='flex flex-col mt-[8px]'>
              <span className='text-[12px] text-[gray] text-center'>{file.name}</span>
              <button 
              className='px-[15px] mt-[4px] py-[5px] w-[120px] bg-spacial text-black rounded-[5px]'
              onClick={() => handelUpdateAvatar()}
              >
                {isAvatarLoading ? <i className="fa-solid fa-gear fa-spin"></i> :'Upload'}
              </button>
            </div>
          }
        </div>
        </div>
        <div className='text-[30px] font-semibold pr-[15px]'>
          <h4>{GroupData?.name}</h4>
        </div>
          <div className='h-[20rem] custom-scrollbar w-full'>

            {
              !user ? 
                <div></div>
                :
                <div key={user._id}>
                  <div className='w-full flex-shrink-0 flex items-center gap-[10px] py-[10px] px-[.5rem] hover:bg-[#373737] rounded-[5px] cursor-pointer' key={user._id}>
                    <div className={`left w-[35px] h-[35px] rounded-full overflow-visible online`}>
                      <img src={user?.avatar?.url} alt={'avatar'} className='w-full object-cover object-center h-full rounded-full' loading='lazy' />
                    </div>
                    <div className="middle text-[14px] flex-1 ">
                      <div className="name flex justify-between items-center w-full ">
                        <span>{user.username} <span className='text-[#9fcf56]'>[you]</span></span>
                      </div>
                      <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{user.about}</div>
                    </div>
                    <div className="right">
                      <span className='text-[#9fcf56]'>{user._id === GroupData?.admin ? "~admin":""}</span>
                    </div>
                  </div>
                </div>
            }

          {
            GroupData?.participantDetails.map(participant => (
              <div key={participant._id}>
                <div className='w-full flex-shrink-0 flex items-center gap-[10px] py-[10px] px-[.5rem] hover:bg-[#373737] rounded-[5px] cursor-pointer'  onClick={() => navigate(`/app/home/chats/user/${participant._id}`)}>
                  <div className={`${participant.isOnline ? 'online': ''} left w-[35px] h-[35px] rounded-full overflow-visible`}>
                    <img src={participant.avatar.url} alt={'avatar'} className='w-full object-cover object-center h-full rounded-full' loading='lazy' />
                  </div>
                  <div className="middle text-[14px] flex-1 ">
                    <div className="name flex justify-between items-center w-full ">
                      <span>{participant.username}</span>
                    </div>
                    <div className="last-messages whitespace-nowrap text-[12px] text-[#bebdbd] ">{participant.about}</div>
                  </div>
                  <div className="right">
                    <span className='text-[#9fcf56] text-[13px]'>{participant._id === GroupData.admin ? "~admin":""}</span>
                  </div>
                </div>
              </div>
            )) 
          }
        </div>
      </div>

      <div className="chat-box flex-1 pb-[10px] custom-scrollbar" ref={chatBox}>
        {
          isLoading ? 
            <div className='w-full h-full flex-center'>
              <div className='flex flex-col justify-center items-center'>
                <span className='text-[28px] '>
                  <i className="fa-solid fa-gear fa-spin"></i>
                </span>
                <span className='text-[20px] text-[gray] pl-[10px]'>Initializing...</span>
              </div>
            </div>
            :
            <div className="messages-container flex flex-col gap-[4px] custom-scrollbar px-[10px] py-[5px] max-w-[50rem] m-auto">
              {
                messages.map((message) => (
                  <div key={message._id} className={` ${message.sender._id === user._id? ' justify-end':' justify-start'} flex items-center`}>
                    <div className='flex items-center gap-[5px]'>
                      <div className={`w-[20px] self-start aspect-square rounded-full ${message.sender._id === user._id? 'hidden':''} `}>
                        <img src={message.sender.avatar.url} alt="" className='w-full h-full object-cover object-center'/>
                      </div>
                      <div key={message._id} className={` flex items-center `}>
                        <span  className={`${message.sender._id === user._id ? 'bg-spacial-glass justify-center':'bg-black-glass justify-start'} text-white px-[8px] py-[3px] rounded-[5px]  inline-flex flex-col min-w-[2rem] text-[14px]`}>
                          <span className={` text-[10px] font-light text-[#96ff0d] ${message.sender._id === user._id ? 'hidden':''}`}>~{message.sender.username}</span>
                          <span className='message-font'>{message.content}</span>
                          {/* <span>{}</span> */}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
        }
        
      </div>

      <div className="chat-box-footer w-full h-[4rem] px-[.5rem] bg-secondary flex gap-[8px] items-center text-[20px]">
        <span><i className='bx bx-smile p-[8px] flex-center hover:bg-[#5a57577b] rounded-[5px]'></i></span>
        <span><i className="fa-solid fa-paperclip text-[16px]"></i></span>
        <input 
        type="text" 
        placeholder='Type a message' 
        className='text-[14px] bg-transparent px-[5px] py-[5px] flex-1 border-none outline-none'
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        />
        <span className='p-[8px] flex-center hover:bg-[#5a57577b] bg-[#4643437b] rounded-[5px] mr-[10px] cursor-pointer' onClick={handelSentMessage}>
          {
            showSendButton?
            <i className="fa-solid m-[6px] fa-paper-plane text-[#44e044] text-[16px]"></i>
            :
            <i className='bx bx-microphone ' ></i>
          }
          </span>
      </div>

    </div>
  )
}

export default GroupChat
