import { useEffect, useRef, useState } from 'react'
import { nanoid } from '@reduxjs/toolkit'
import './style.css'
import Clock from './clock/Clock'
import { useNavigate } from 'react-router-dom'

import { taskIcon } from '../../assets/icons'

interface Task {
  id: string;
  iconIndex: number;
  name: string;
  description: string;
  completed: boolean;
}

const ClockPage = () => {
  const [time, setTime] = useState({
    minute: 0,
    hour: 0,
  })
  const [showLocker, setShowLocker] = useState(false);
  const [password, setPassword] = useState('');

  const [showPop, setShowPop] = useState(false)
  
  const [tasks, setTasks] = useState<Task[]>([])

  const navigate = useNavigate();
  
  const locker = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const date = new Date();
      setTime({
        minute: date.getMinutes(),
        hour: date.getHours(),
      })
    }, 1000)

    return () => clearInterval(intervalId);
  }, [])


  useEffect(() => {
    if(!locker.current) return;
    const handleKeyPress = (e: KeyboardEvent | any) => {
      if(e.keyCode === 13 || e.key === 'enter') {
        const password = e.target?.value;
        if(password !== '1234') setPassword('')
        if(password === '1234') navigate('/app/auth/sign-in')
      }
    }
    locker.current?.addEventListener('keypress', handleKeyPress)

    return () => locker.current?.removeEventListener('keypress', handleKeyPress)
  },[])

  const handelLockClick = () => {
    setShowLocker(prevState => !prevState)
    if(password.length < 4) return;
    if(password !== '1234') setPassword('')
    if(password === '1234') navigate('/app/auth/sign-in')
  }

  const [iconIndex, setIconIndex] = useState(0);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const handelSelectIcon = (n: number) => {
    setIconIndex(n)
  }

  const handelAddTask = () => {
    const task = {
      id: nanoid(),
      iconIndex: iconIndex,
      name: taskName,
      description: taskDescription,
      completed: false,
    }
    setTasks(prev => [...prev, task])
    setIconIndex(0);
    setTaskName('');
    setTaskDescription('')
    setShowPop(false)
    console.log(task);
  }

  return (
    <div className='overflow-hidden custom-scrollbar bg-primary'>
      <div className="maincontainer flex justify-center max-w-[100rem] m-auto items-center flex-col lg:flex-row min-h-[100vh] bg-primary text-white ">
        <div className='flex flex-col items-center left custom-scrollbar relative'>

          <div className=' relative w-[20rem] flex-center lg:w-[24rem] aspect-square px-[20px] py-[20px]'>
            <Clock time={time} onClickE={handelLockClick} data={password} />
            <div className={`locker ${showLocker ? "bottom-[0%]": "bottom-[7rem]"} w-[3rem] h-[4rem] bg-[#363535] absolute left-[50%] translate-x-[-50%] z-[0] flex flex-col justify-end items-end ${password.length < 4 ? 'wrong': 'correct'}`}>
              <input 
              type="text" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='xxxx'
              className='w-[100%]  outline-none bg-[transparent] overflow-hidden text-[12px] pb-[1px] text-center'
              ref={locker}
              />
            </div>
          </div>

          <div className='text-[46px] md:text-[68px] z-[3] sp-font'>
            <span>{time.hour % 12 < 10 ? '0':''}{time.hour % 12}</span>
            :
            <span>{time.minute < 10 ? '0':''}{time.minute}</span>
          </div>
        </div>
        <div className="right max-w-[40rem] min-h-[20rem] flex-1 w-full h-full flex flex-col custom-scrollbar">
            <div className=' w-full h-full max-h-[28rem] flex-1 relative custom-scrollbar'>
              <span className={` bg-[#9fcf56] text-black bottom-[2rem] left-[50%] translate-x-[-50%] w-[40px] aspect-square flex-center  text-[22px] rounded-full cursor-pointer absolute`} onClick={() => setShowPop(prev => !prev)}>
                <i className="fa-solid fa-plus"></i>
              </span>
              
              <div className=" flex flex-col gap-[10px]  px-[10px]">
                {
                  tasks.map((task, index) => (
                    <div key={index} className='flex gap-[10px] justify-between items-center hover:bg-[#38373795] px-[15px] py-[8px] rounded-[5px]'>
                      <div className="left flex gap-[10px] items-center">
                        <span className={` bg-[#e47f2d] w-[50px] aspect-square relative flex-center rounded-full cursor-pointer`}>
                          <img src={taskIcon[task.iconIndex - 1]} alt="" className='w-[30px] ' />
                        </span>
                        <div className='flex flex-col text-[16px] font-semibold leading-5'>
                          <span>{task.name}</span>
                          <span className='text-[14px] text-[gray]'>{task.description}</span>
                        </div>
                      </div>
                      <div className="right">
                        <span></span>
                        <span onClick={() => {
                          setTasks((tasks) => tasks.filter(t => t.id !== task.id))
                        }}><i className="fa-solid fa-trash"></i></span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>

        </div>
      </div>
      <div className={` ${showPop ? '':'hidden'} absolute top-[50%] left-[50%] container-pop rounded-[5px] max-w-[19rem] w-[90%] h-[24rem] translate-x-[-50%] translate-y-[-50%] z-[30] overflow-visible`}>
        <div className=" relative w-[100%] h-[100%] overflow-visible px-[10px] py-[15px]">
          <span className={`absolute top-0 right-0 w-[30px] h-[30px] rounded-full bg-[#353535] text-white flex-center translate-x-[40%] translate-y-[-40%]`} onClick={() => setShowPop(false)}>
            <i className="fa-solid fa-xmark"></i>
          </span>

          <div className='flex gap-[10px] flex-wrap my-[10px] justify-center'>
            {
              taskIcon.map((icon, index) => (
                <span className={`${iconIndex == index + 1 ? 'active-icon':''} bg-[#e47f2d] w-[50px] aspect-square relative flex-center rounded-full cursor-pointer`} onClick={() => handelSelectIcon(index + 1)} key={index}>
                  <img src={icon} alt="" className='w-[30px] ' />
                </span>
              ))
            }
            
          </div>

          <div className="search-box flex items-center bg-[#5a5a5a] rounded-[4px] my-[20px] mx-[20px]">
            <input 
            type="text" 
            placeholder='name of the task'
            className=' px-[7px] py-[4px] bg-transparent text-[14px] border-none outline-none flex-1 text-white'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          <div className="description mx-[20px] flex-center">
            <textarea 
            name="des" 
            id="des" 
            cols={38} 
            rows={4} 
            value={taskDescription}
            className='border-none outline-none  bg-[#555555] text-white rounded-[5px] text-[13px] px-[8px] py-[4px]' 
            placeholder='write somthing more about the task...'
            onChange={(e) => setTaskDescription(e.target.value)}
            ></textarea>
          </div>

          <div className=' flex-center mt-[20px]'>
            <button className='px-[15px] py-[8px] bg-[#9fcf56] rounded-[5px] text-[black] justify-items-end font-bold m-auto' onClick={handelAddTask}>ADD</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClockPage
