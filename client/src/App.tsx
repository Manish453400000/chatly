// import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClockPage from "./pages/ClockPage"
import Chatly from "./pages/Chatly"
import ChatList from "./components/chat/ChatList"

// const Home = lazy(() => import ("./pages/home/Home"))
// const Auth = lazy(() => import ("./pages/auth/Auth"))
// const Login = lazy(() => import ("./pages/auth/Login"))
// const SignUp = lazy(() => import ("./pages/auth/SignUp"))

// const Chat = lazy(() => import ("./components/chat/Chat"))
// const Group = lazy(() => import ("./pages/Group/Group"))
// const Profile = lazy(() => import ("./pages/profile/Profile"))

import Home from "./pages/home/Home"
import Auth from "./components/auth/Auth"
import Login from "./components/auth/Login"
import SignUp from "./components/auth/SignUp"
import Chat from "./components/chat/Chat"
import Profile from "./components/profile/Profile"
import Status from "./components/status/Status"
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
            <Route path="/app/home/calls" element={<Calls />} /> 
            <Route path="/app/home/chats" element={<ChatList />} >
              <Route path="/app/home/chats/user/:id" element={<Chat />} />
            </Route> 
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
