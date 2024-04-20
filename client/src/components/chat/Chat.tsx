import { useNavigate, useParams } from 'react-router-dom'
import './Chats.scss'

import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { Friend } from '../../interface/user';

import { requestHandler } from '../../utils';
import { sentMessages } from '../../api/api';
import { addMessage, messageReaded } from '../../app/features/chatsSlice';



const Chat = () => {
  
  const { id } = useParams()
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const chatBox = useRef<HTMLDivElement | null>(null)
  
  const [friendData, setFriendData] = useState<Friend | undefined>(undefined)
  const [messageInput, setMessageInput] = useState('')
  const [_isMessageSent, setIsMessageSent] = useState(false);
  const [showSendButton, setShowSendButton] = useState(false);

  const selectFriends = (state:any) => state.friends;
  const friends:Friend[] = useSelector(selectFriends);

  const selectChat = (state:any) => state.chats;
  const chat = useSelector(selectChat).find((chat:any) => chat._id === friendData?.chatId);
  const [messages, setMessages] = useState([])


  useEffect(() => {
    if(chat) {
      setMessages(chat.messages)
    }
  },[chat])

  useEffect(() => {
    if(friendData?.chatId) {
      dispatch(messageReaded({_id: friendData?.chatId}))
    }
  },[friendData?.chatId])


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
      const friend:Friend | undefined = friends.find(friend => friend._id === id);
      setFriendData(friend)
    }
    
  },[id])

  const handelSentMessage = async() => {
    await requestHandler(
      async () => await sentMessages(messageInput, friendData?.chatId),
      setIsMessageSent,
      (res) => {
        const message = res.data
        console.log(message);
        dispatch(addMessage({message, chatId: friendData?.chatId}))
        setMessageInput('')
      },
      alert
    )
  }
  
  return (
    <div className="chat-box-container bg-primary flex flex-col relative">
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
          <div className="call-btn hidden md:flex items-center gap-[1px] rounded-[5px]">
            <div className="vedio cursor-pointer py-[8px] px-[10px] bg-[#484747b1] hover:bg-[#555454d6] flex-center" onClick={() => ''}><i className='bx bx-video'></i></div>
            <div className="audio cursor-pointer py-[8px] px-[10px] bg-[#484747b1] hover:bg-[#555454d6] flex-center"><i className='bx bx-phone'></i></div>
          </div>
          <div className="search cursor-pointer py-[8px] px-[10px] hover:text-[#b6fc98] flex-center rounded-[5px]">
            <i className='bx bx-search-alt-2 py-[5px] pl-[5px]' ></i>
          </div>
        </div>
      </div>

      <div className="chat-box flex-1 pb-[10px] custom-scrollbar" ref={chatBox}>
            <div className="messages-container flex flex-col gap-[4px] custom-scrollbar px-[10px] py-[5px] max-w-[50rem] m-auto">
              {
                !messages ? 
                <div></div>
                :
                messages.map((message:any) => (
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
