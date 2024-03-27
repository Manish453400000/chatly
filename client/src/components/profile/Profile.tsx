import React, { useState } from 'react'

//skeleton chatList
const skChatItems = () => {
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

const Profile = () => {

  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className='w-full h-full absolute top-0 left-0 bg-red'>
    </div>
  )
}

export default Profile
