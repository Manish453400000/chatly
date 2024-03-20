import { BrowserRouter, Routes, Route } from "react-router-dom"
import ClockPage from "./pages/ClockPage"
import Chatly from "./pages/Chatly"
function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* public routes */}
        <Route path="/" element={<ClockPage />} />
        
        {/* private routes */}
        <Route path="/app" element={<Chatly />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
