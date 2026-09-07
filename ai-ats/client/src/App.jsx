import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'

// Pages - Auth
import Login from './pages/Login'

// Pages - Dashboard
import Dashboard from './pages/Dashboard'
import Jobs from './pages/Jobs'
import JobCreate from './pages/JobCreate'
import JobDetail from './pages/JobDetail'
import Candidates from './pages/Candidates'
import CandidateDetail from './pages/CandidateDetail'
import Screening from './pages/Screening'

// Pages - Public
import ApplyJob from './pages/ApplyJob'
import ScreeningPublic from './pages/ScreeningPublic'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/apply/:jobId" element={<PublicLayout><ApplyJob /></PublicLayout>} />
        <Route path="/screening/:link" element={<PublicLayout><ScreeningPublic /></PublicLayout>} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/" element={isAuthenticated ? <DashboardLayout><Dashboard /></DashboardLayout> : <Login />} />
        <Route path="/jobs" element={isAuthenticated ? <DashboardLayout><Jobs /></DashboardLayout> : <Login />} />
        <Route path="/jobs/create" element={isAuthenticated ? <DashboardLayout><JobCreate /></DashboardLayout> : <Login />} />
        <Route path="/jobs/:id" element={isAuthenticated ? <DashboardLayout><JobDetail /></DashboardLayout> : <Login />} />
        <Route path="/candidates" element={isAuthenticated ? <DashboardLayout><Candidates /></DashboardLayout> : <Login />} />
        <Route path="/candidates/:id" element={isAuthenticated ? <DashboardLayout><CandidateDetail /></DashboardLayout> : <Login />} />
        <Route path="/screening" element={isAuthenticated ? <DashboardLayout><Screening /></DashboardLayout> : <Login />} />
      </Routes>
    </Router>
  )
}

export default App
