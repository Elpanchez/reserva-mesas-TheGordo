import { BrowserRouter, Route, Routes } from 'react-router-dom'

import ClientLayout from './components/layout/ClientLayout.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'

import HomePage from './pages/client/Home.jsx'
import ReservationPage from './pages/client/Reserva.jsx'
import ReservationSuccessPage from './pages/client/ReservaExistosa.jsx'

import LoginPage from './pages/admin/Login.jsx'
import DashboardPage from './pages/admin/Dashboard.jsx'
import MesasPage from './pages/admin/Mesas.jsx'
import ReservasPage from './pages/admin/Reservas.jsx'
import HorariosPage from './pages/admin/Horarios.jsx'

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/reservar" element={<ReservationPage />} />
          <Route path="/reserva-exitosa" element={<ReservationSuccessPage />} />
        </Route>

        <Route path="/admin/login" element={<LoginPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="mesas" element={<MesasPage />} />
          <Route path="reservas" element={<ReservasPage />} />
          <Route path="horarios" element={<HorariosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App