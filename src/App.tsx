import { Route, Routes } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/auth/sign-in'
import RegistrationPage from './pages/auth/sign-up'
import DashboardPage from './pages/dashboard/user-dashboard'
import TaskBoard from './pages/task-management/task-board'

function App() {

  return (
    <>
      <Routes>
        <Route  path="/" element={<LoginPage/>}/>
        <Route  path="/register" element={<RegistrationPage/>}/>
        <Route  path="/dashboard" element={<DashboardPage/>}/>
        <Route  path="/taskboard" element={<TaskBoard/>}/>
        
      </Routes>
    </>
  )
}

export default App
