// import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClockPage from "./pages/clock/ClockPage"
import Chatly from "./pages/Chatly"
import ChatList from "./components/chat/ChatList"



import Home from "./pages/home/Home"
import Auth from "./components/auth/Auth"
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import Chat from "./components/chat/Chat"
import Status from "./components/status/Status"
import FriendList from "./components/friends/FriendList"
import SearchList from "./components/search/SearchList"
import GroupChat from "./components/chat/GroupChat"
import Calls from "./components/calls/Calls"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<ClockPage />} />
        
        {/* private routes */}
        <Route path="/app" element={<Chatly />} >
          <Route path="/app/auth" element={<Auth />} >
            <Route path="/app/auth/sign-in" element={<Login />} />
            <Route path="/app/auth/sign-up" element={<SignUp />} />
          </Route> 

          <Route path="/app/home" element={<Home />} >
            <Route path="/app/home/status" element={<Status />} /> 
            <Route path="/app/home/friends" element={<FriendList />} /> 
            <Route path="/app/home/requests" element={<SearchList />} />

            <Route path="/app/home/calls/:id" element={<Calls />} />

            <Route path="/app/home/chats" element={<ChatList />} >
              <Route path="/app/home/chats/user/:id" element={<Chat />} />
              <Route path="/app/home/chats/group/:id" element={<GroupChat />} />
            </Route> 
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
