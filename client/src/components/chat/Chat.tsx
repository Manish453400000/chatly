import { useNavigate, useParams } from 'react-router-dom'
import './Chats.scss'

import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';

import { Friend } from '../../interface/user';
import { Message } from '../../interface/api';

import { requestHandler } from '../../utils';
import { getAllMessages, sentMessages } from '../../api/api';
import { socket } from '../../pages/home/Home';


const Chat = () => {
  const { id } = useParams()
  const [friendData, setFriendData] = useState<Friend | undefined>(undefined)

  const chatBox = useRef<HTMLDivElement | null>(null)

  const [messageInput, setMessageInput] = useState('')

  const [isLoading, setIsLoading] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const [messages, setMessages] = useState<Message[]>([])
  const [showSendButton, setShowSendButton] = useState(false);

  const selectFriends = (state:any) => state.friends;
  const friends:Friend[] = useSelector(selectFriends);

  const navigate = useNavigate();

  
  const getMessages = async (chatId:string) => {
    try{
      await requestHandler(
        async () => await getAllMessages(chatId),
        setIsLoading,
        (res) => {
          setMessages(res.data);
          console.log(res.data);
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
    if(!friendData) return;
    getMessages(friendData?.chatId)
  }, [friendData])
  
  useEffect(() => {
    if(chatBox.current){
      chatBox.current.scrollTop = chatBox.current.scrollHeight;
    }
  },[messages])

  useEffect(() => {
    socket.on('messageReceived', (message:any) => {
      setMessages((prevMessages) => [ ...prevMessages, message]);
    })
    return () => {
      
    }
  },[])


  useEffect(() => {
    if (id) {
      const friend:Friend | undefined = friends.find(friend => friend._id === id);
      setFriendData(friend)
    }
    
  },[id])

  const handelSentMessage = async() => {
    await requestHandler(
      async () => await sentMessages(messageInput, friendData?.chatId),
      setIsMessageSent,
      (res) => {
        console.log(res);
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
                  <div key={message._id} className={`flex ${message.sender._id !== id? ' justify-end':' justify-start'} flex items-center `}>
                    <span  className={`${message.sender._id !== id ? 'bg-spacial-glass justify-center':'bg-black-glass justify-start'} text-white px-[8px] py-[3px] rounded-[5px]  inline-flex flex-col min-w-[2rem] text-[14px]`}>
                      <span className={`${message.sender._id !== id ? 'hidden': ''}  text-[10px] font-light text-[yellow]`}>~{message.sender.username}</span>
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

export default Chat
