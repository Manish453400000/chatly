import React, { useEffect, useRef } from 'react'
// import { useNavigate } from 'react-router-dom';

interface Time{
  hour: number;
  minute: number;
}

const Clock:React.FC<{time:Time, onClickE:any, data: string}> = ({time, onClickE, data}) => {

  const hourHand = useRef<HTMLDivElement>(null)
  const minuteHand = useRef<HTMLDivElement>(null)

  // const _navigate = useNavigate()

  useEffect(() => {                  
    if(hourHand.current && minuteHand.current){
      hourHand.current.style.transform = `rotate(${time.hour * 30 + Math.round(time.minute / 12)}deg)`
      minuteHand.current.style.transform = `rotate(${time.minute * 6}deg)`
    }
    console.log(time.hour, time.minute);
    
  }, [time.hour, time.minute]);

  useEffect(() => {
    if(data.length < 4) return;


  },[data])

  return (
    <div className=' rounded-full clock-container relative max-w-[20rem] max-h-[20rem] w-[100%] h-[100%] overflow-hidden z-[1]'>
      <div className={` minute-circle w-[100%] h-[100%] aspect-square  absolute rounded-full flex justify-center items-center`} ref={minuteHand}>
        <div className="relative w-full h-full ">
          <div className="hand w-[4px] bg-white h-[52%] absolute bottom-[42%] left-[50%] translate-x-[-50%] rounded-[4px]"></div>
        </div>
      </div>
      <div className='absolute  w-[70%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[3]  overflow-hidden'>
        <div className="hour-circle w-full aspect-square rounded-full" ref={hourHand}>
          <div className="relative w-full h-full ">
            <div className="hand w-[4px] bg-spacial h-[42%] absolute bottom-[42%] left-[50%] rounded-[4px] translate-x-[-50%]"></div>
          </div>
        </div>
      </div>
      <div className="mid-button w-[1.8rem] aspect-square absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-full bg-black z-[20] text-[13px] flex-center" onClick={() => {onClickE()}}>
        {
          data.length > 3 ?
          <i className="fa-solid fa-unlock text-[#04ff04] cursor-pointer"></i>
          :
          <i className="fa-solid fa-lock"></i>
        }
      </div>
    </div>
  )
}

export default Clock
