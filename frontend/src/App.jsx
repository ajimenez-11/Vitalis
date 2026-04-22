import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Auth/Login.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Receptes from './pages/Receptes/ReceptesList.jsx'
import ReceptesForm from './pages/Receptes/ReceptaForm.jsx'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"          element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/receptes" element={<Receptes />} />
        <Route path="/receptes/:id" element={<ReceptesForm  />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App