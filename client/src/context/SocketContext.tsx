import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import io from 'socket.io-client'
import { LocalStorage } from '../utils';

const getSocket = () => {
  const token = LocalStorage.get("token");

  return io('http://localhost:8080', {
    withCredentials: true,
    auth: { token }
  });
}

export const SocketContext = createContext<{
  socket: ReturnType<typeof io> | null
}>({
  socket: null
});

const useSocket = () => useContext(SocketContext)

const SocketProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  
  const token = LocalStorage.get("token");
  
  const socket = useMemo(() => {
    if(!token) return null;
    return io('http://localhost:8080', {
    withCredentials: true,
    auth: { token }
  }); 
  }, [token])
  

  useEffect(() => {
    const socketInstance = socket; 
    return () => {
      if(socketInstance) {
        socketInstance.disconnect();
      }
    }
  }, [socket])

  return (
    <SocketContext.Provider value={{socket}}>
      {children}
    </SocketContext.Provider>
  )
}

export { SocketProvider, useSocket}
 