import Home from './pages/Home'
import Game from './pages/Game'

import { Route, Routes } from "react-router";


function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  )
}

export default App
