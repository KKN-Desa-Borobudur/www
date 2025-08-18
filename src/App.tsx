import './App.css'
import Homepage from './pages/Homepage'
import UMKMpage from './pages/UMKMpage'
import { Route, Routes } from 'react-router'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/umkm" element={<UMKMpage />} />
    </Routes>
    </>
  )
}

export default App
