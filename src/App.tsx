import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import './App.css'
import ProtectedRoute from './routes/protected-route'
import PublicRoute from './routes/public-route'

const LoginPage = lazy(() => import('./pages/auth/sign-in'))
const RegistrationPage = lazy(() => import('./pages/auth/sign-up'))
const DashboardPage = lazy(() => import('./pages/dashboard/user-dashboard'))
const TaskBoard = lazy(() => import('./pages/task-management/task-board'))

const PageLoader = () => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'background.default',
    }}
  >
    <CircularProgress />
  </Box>
)

function App() {

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<PublicRoute/>}>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/register" element={<RegistrationPage/>}/>
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/taskboard" element={<TaskBoard/>}/>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
