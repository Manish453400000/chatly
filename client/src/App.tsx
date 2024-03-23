import { lazy } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClockPage from "./pages/ClockPage"
import Chatly from "./pages/Chatly"

const Home = lazy(() => import ("./pages/home/Home"))
const Auth = lazy(() => import ("./pages/auth/Auth"))
const Login = lazy(() => import ("./pages/auth/Login"))
const SignUp = lazy(() => import ("./pages/auth/SignUp"))

const Chat = lazy(() => import ("./pages/chat/Chat"))
const Group = lazy(() => import ("./pages/Group/Group"))
const Profile = lazy(() => import ("./pages/profile/Profile"))

function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<ClockPage />} />
        
        {/* private routes */}
        <Route path="/app" element={<Chatly />} >
          <Route path="/app/home" element={<Home />} /> 
          <Route path="/app/auth" element={<Auth />} >
            <Route path="/app/auth/sign-in" element={<Login />} />
            <Route path="/app/auth/sign-up" element={<SignUp />} />
          </Route> 
          <Route path="/app/chat/:chatId" element={<Chat />} /> 
          <Route path="/app/group" element={<Group />} /> 
          <Route path="/app/profile" element={<Profile />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
