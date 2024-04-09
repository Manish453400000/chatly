import { useEffect, useRef, useState } from 'react'
import './style.css'
import Clock from './clock/Clock'
import { useNavigate } from 'react-router-dom'

const ClockPage = () => {
  const [time, setTime] = useState({
    minute: 0,
    hour: 0,
  })
  const [showLocker, setShowLocker] = useState(false);
  const [password, setPassword] = useState('');

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

  return (
    <div className="maincontainer flex justify-center items-center flex-col min-h-[100vh] bg-secondary text-white">
      <div className=' relative w-[21.5rem] h-[22.3rem] px-[10px] py-[10px]'>
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

      <div>
        <span>{time.hour % 12 < 10 ? '0':''}{time.hour % 12}</span>
        :
        <span>{time.minute < 10 ? '0':''}{time.minute}</span>
      </div>
    </div>
  )
}

export default ClockPage
