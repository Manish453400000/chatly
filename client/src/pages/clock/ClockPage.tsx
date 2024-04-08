import { useEffect, useState } from 'react'
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

  const handelLockClick = () => {
    console.log('clicked');
    setShowLocker(prevState => !prevState)
    if(password.length < 4) return;
    if(password !== '1234') setPassword('')
    if(password === '1234') navigate('/app/auth/sign-in')
  }
  
  return (
    <div className="maincontainer flex justify-center items-center flex-col min-h-[100vh] bg-secondary text-white">
      <div className=' relative w-[22.5rem]'>
        <Clock time={time} onClickE={handelLockClick} data={password} />
        <div className={`locker ${showLocker ? "right-[0%]": "right-[7rem]"} w-[3rem] h-[1.6rem] bg-[#363535] absolute top-[50%] translate-y-[-50%] z-[0] flex justify-end pl-[12px] items-center ${password.length < 4 ? 'wrong': 'correct'}`}>
          <input 
          type="text" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='xxxx'
          className='w-[100%] h-[100%] border-none outline-none bg-[transparent] overflow-hidden text-[12px] pb-[1px]'
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
