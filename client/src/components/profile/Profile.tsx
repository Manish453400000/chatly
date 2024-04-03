import React, { ChangeEvent, useEffect, useState } from 'react'
import './profile.scss'
import { useDispatch, useSelector } from 'react-redux'
import { User } from '../../interface/user'
import { requestHandler } from '../../utils'
import { editAvatar, logoutUser } from '../../api/api'
import { useNavigate } from 'react-router-dom'
import { addUser } from '../../app/features/userSlice'

// //skeleton chatList
// const skChatItems = () => {
//   return(
//     <div className='chat-item flex-shrink-0 h-[3.4rem] flex gap-[10px] items-center py-[10px] px-[.5rem] w-full rounded-[5px] overflow-hidden'>
//       <div className="logo w-[34px] h-[34px] rounded-full skeleton"></div>
//       <div className="right flex-1 flex flex-col gap-[5px]">
//         <div className="top flex justify-between">
//           <div className="name w-[5rem] skeleton skeleton-text"></div>
//           <div className="lastseen w-[4rem] skeleton skeleton-text"></div>
//         </div>
//         <div className="bottom w-full skeleton skeleton-text"></div>
//       </div>
//     </div>
//   )
// }

const ProfileSetting = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null)

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handelLogout = async () => {
    await requestHandler(
      async () => await logoutUser(),
      setIsLoading,
      () => {
        navigate('/')
      },
      alert
    )
  }

  useEffect(() => {
    console.log(file);
  },[])

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

    requestHandler(
      async() => await editAvatar(data),
      setIsAvatarLoading,
      (response) => {
        dispatch(addUser({
          isAuthenticated: true,
          data: response.data
        }))
        setFile(null)
      },
      alert
    )
  }

  const selectUser = (state:any) => state.user.data.user
  const userDetails:User = useSelector(selectUser)
  return (
    <div className='h-full px-[15px] py-[10px] overflow-auto flex flex-col'>
      <div className='flex justify-between'>
        <div className="avatar-profile w-[6rem] rounded-full relative  overflow-visible">
          <img src={ userDetails?.avatar?.url} className=' overflow-hidden rounded-[50%]' alt="" />
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
      <div className="name flex justify-between items-center py-[10px] text-[18px]">
        <h5 className='font-semibold'>{userDetails?.username}</h5>
        <i className='bx bx-pencil p-[6px] flex-center hover:bg-[#80808039] rounded-[5px] cursor-pointer'></i>
      </div>
      <div className="about flex justify-between items-center py-[10px] text-[18px]">
        <span className='text-[14px] flex flex-col '>
          <span>About</span>
          <span className='text-[gray]'>....</span>
        </span>
        <i className='bx bx-pencil p-[6px] flex-center hover:bg-[#80808039] rounded-[5px] cursor-pointer'></i>
      </div>
      <div className="email flex flex-col text-[14px]">
        <span className='flex items-center gap-[5px] overflow-visible'>Email 
          <span className='flex-center text-[15px] overflow-visible'>
            {
              userDetails?.isEmailVerified ? 
              <span className='tooltip-main overflow-visible flex items-center'>
                <i className="fa-solid fa-circle-check text-[#4aec4a] text-[13px]"></i>
                <span className='tooltip'>Email Verified</span>
              </span>
              :
              <span className='tooltip-main overflow-visible flex'>
                <i className='bx bxs-info-circle text-[orange] mt-[2px]'></i>
                <span className='tooltip'>Email is not Verified</span>
              </span>
            }
          </span>
        </span>
        <span className='text-[gray]'>{userDetails?.email}</span>
      </div>
      <div className='mt-[20px] '>
        <hr className='w-[90%] m-auto mb-[10px] border-[#8080808d] ' />
        <button className='text-[13px] bg-[#8080807f] text-[#f69494] px-[15px] py-[5px] rounded-[5px]' onClick={handelLogout}>
          {isLoading ? <i className="fa-solid fa-gear fa-spin"></i> :'Log out'}
        </button>
        <p className='text-[12px] text-[gray] text-center mt-[10px]'>Chat history will be deleted from this browser</p>
      </div>
    </div>
  )
}
const GeneralSetting = () => {
  return (
    <div>
      general
    </div>
  )
}
const AccountSetting = () => {
  return (
    <div>
      account
    </div>
  )
}
const ChatsSetting = () => {
  return (
    <div>
      chat
    </div>
  )
}
const NotificationSetting = () => {
  return (
    <div>
      notify
    </div>
  )
}
const StorageSetting = () => {
  return (
    <div>
      storage
    </div>
  )
}
const Help = () => {
  return (
    <div>
      help
    </div>
  )
}


const Profile = () => { 
  const [activeOption, setActiveOption] = useState('profile')

  const handelOptionLink = (type: string) => {
    setActiveOption(type);
  }
  const customOulet = () => {
    if(activeOption === 'profile') return ProfileSetting()
    if(activeOption === 'general') return GeneralSetting()
    if(activeOption === 'account') return AccountSetting()
    if(activeOption === 'chats') return ChatsSetting()
    if(activeOption === 'notification') return NotificationSetting()
    if(activeOption === 'storage') return StorageSetting()
    if(activeOption === 'help') return Help()
  }

  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className=' main-profile-box w-full md:max-w-[30rem] absolute bottom-[10px] left-[10px] flex h-[30rem] rounded-[5px]'>
      <div className="options justify-between">
        <div className="top ">
          <ul>
            <li className={`${activeOption == 'general' ? "active":"non-active"} `} onClick={() => handelOptionLink('general')}>
              <i className='bx bx-laptop'></i>
              <span>General</span>
            </li>
            <li className={`${activeOption == 'account' ? "active":"non-active"}`} onClick={() => handelOptionLink('account')}>
              <i className='bx bxs-key'></i>
              <span>Account</span>
            </li>
            <li className={`${activeOption == 'chats' ? "active":"non-active"}`} onClick={() => handelOptionLink('chats')}>
              <i className='bx bx-chat '></i>
              <span>Chats</span>
            </li>
            <li className={`${activeOption == 'notification' ? "active":"non-active"}`} onClick={() => handelOptionLink('notification')}>
              <i className='bx bx-bell non-active'></i>
              <span>Notification</span>
            </li>
            <li className={`${activeOption == 'storage' ? "active":"non-active"}`} onClick={() => handelOptionLink('storage')}>
              <i className='bx bx-server non-active'></i>
              <span>Storage</span>
            </li>
            <li className={`${activeOption == 'help' ? "active":"non-active"}`} onClick={() => handelOptionLink('help')}>
              <i className='bx bx-info-circle non-active'></i>
              <span>Help</span>
            </li>
          </ul>
        </div>
        <div className="bottom">
          <span className={`prof ${activeOption == 'profile' ? "active":"non-active"}`} onClick={() => handelOptionLink('profile')} >
            <i className='bx bx-user-circle'></i>
            <span>Profile</span>
          </span>
        </div>
      </div>
      <div className="option-content flex-1">
        {customOulet()}
      </div>
    </div>
  )
}



export default Profile
