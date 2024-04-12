import { useNavigate, useParams } from 'react-router-dom'
import './Chats.scss'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';

import { Friend, User } from '../../interface/user';
import { GroupChats, Message } from '../../interface/api';

import { requestHandler } from '../../utils';
import { getAllMessages, sentMessages } from '../../api/api';
import { useSocket } from '../../context/SocketContext';


const GroupChat = () => {
  
  const {socket} = useSocket();
  
  const { id } = useParams()
  const [GroupData, setGroupData] = useState<GroupChats | undefined>(undefined)

  const chatBox = useRef<HTMLDivElement | null>(null)

  const selectUser = (state:any) => state.user.data.user
  const user:User = useSelector(selectUser)

  const [messageInput, setMessageInput] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const [messages, setMessages] = useState<Message[]>([])
  const [showSendButton, setShowSendButton] = useState(false);

  const selectChats = (state:any) => state.chats;
  const chats:GroupChats[] = useSelector(selectChats);

  const navigate = useNavigate();

  
  const getMessages = async (chatId:string) => {
    try{
      await requestHandler(
        async () => await getAllMessages(chatId),
        setIsLoading,
        (res) => {
          setMessages(res.data);
          console.log(res.data, user)
        },
        alert
      )
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    if(messageInput.trim().length > 0){
      setShowSendButton(true);
    }else{
      setShowSendButton(false);
    }
  }, [messageInput])

  useEffect(() => {
    if(!GroupData) return;
    getMessages(GroupData?._id)
  }, [GroupData])
  
  useEffect(() => {
    if(chatBox.current){
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  },[messages])

  useEffect(() => {
    if(!socket) return;
    socket.on('messageReceived', (message:any) => {
      setMessages((prevMessages) => [ ...prevMessages, message]);
    })
    return () => {
      
    }
  },[])


  useEffect(() => {
    if (id) {
      const chat:GroupChats | undefined = chats.find(chat => chat._id === id);
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
  
  return (
    <div className="chat-box-container bg-primary flex flex-col ">
      <div className="chat-box-header bg-secondary px-[5px] py-[8px] flex items-center text-[28px] justify-between">
        <div className="left flex items-center gap-[5px]">
          <span className='flex-center mr-[5px] cursor-pointer' onClick={() => navigate('/app/home/chats')}><i className='bx bxs-left-arrow-alt'></i></span>
          <div className='logo w-[36px] h-[36px] rounded-full object-cover object-center'>
            <img src={GroupData?.GroupAvatar.url} alt={'avatar'} className='w-full h-full object-cover ' />
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
          <div className="search cursor-pointer py-[8px] px-[10px] hover:bg-[#484747bf] flex-center rounded-[5px]">
            <i className='bx bx-search-alt-2' ></i>
          </div>
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
            <div className="messages-container flex flex-col gap-[4px] custom-scrollbar px-[10px] py-[5px]">
              {
                messages.map((message) => (
                  <div key={message._id} className={`flex ${message.sender._id === user._id? ' justify-end':' justify-start'} flex items-center `}>
                    <span  className={`${message.sender._id === user._id ? 'bg-spacial-glass justify-center':'bg-black-glass justify-start'} text-white px-[8px] py-[3px] rounded-[5px]  inline-flex flex-col min-w-[2rem] text-[14px]`}>
                      <span className={` text-[10px] font-light text-[#96ff0d] ${message.sender._id === user._id ? 'hidden':''}`}>~{message.sender.username}</span>
                      <span className='message-font'>{message.content}</span>
                      {/* <span>{}</span> */}
                    </span>
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
