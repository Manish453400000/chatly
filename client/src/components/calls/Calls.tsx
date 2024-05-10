// import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'

const Calls = () => {
  const { roomId } = useParams();

  const myMeeting = async (element) => {
    const appID = 216439746;
    const serverSecret = "8bb1ef65b326427e7fda804e808ec65a";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId)
  }
  
  return (

    <div className='w-full h-full bg-secondary flex-center'>

      <div className='test w-[20rem]'>
        
      </div>

    </div>
  )
}

export default Calls
