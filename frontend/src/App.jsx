import React, { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import Header from './components/Header.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import WelcomePage from './pages/WelcomePage.jsx'
import SubmitIdeaPage from './pages/SubmitIdeaPage.jsx'
import IdeasPage from './pages/IdeasPage.jsx'
import ForumPage from './pages/ForumPage.jsx'
import ManagerPage from './pages/ManagerPage.jsx'
import AdminPage from './pages/AdminPage.jsx'

function Protected({ user, children, managerOnly }){
  if(!user) return <Navigate to="/login" replace />
  if(managerOnly && !(user.role === 'manager' || user.role === 'admin')) return <Navigate to="/welcome" replace />
  return children
}

export default function App(){
  const [user, setUser] = useState(()=>{
    const raw = localStorage.getItem('ideal_user')
    return raw ? JSON.parse(raw) : null
  })
  const navigate = useNavigate()
  const handleAuth = (payload)=>{
    localStorage.setItem('ideal_user', JSON.stringify(payload.user))
    localStorage.setItem('ideal_token', payload.token)
    setUser(payload.user)
    navigate('/welcome')
  }
  const handleLogout = ()=>{
    localStorage.removeItem('ideal_user'); localStorage.removeItem('ideal_token'); setUser(null); navigate('/login')
  }
  return (
    <div className="container">
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LoginPage onAuth={handleAuth} />} />
        <Route path="/login" element={<LoginPage onAuth={handleAuth} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/welcome" element={<Protected user={user}><WelcomePage user={user} /></Protected>} />
        <Route path="/submit" element={<Protected user={user}><SubmitIdeaPage user={user} /></Protected>} />
        <Route path="/ideas" element={<Protected user={user}><IdeasPage user={user} /></Protected>} />
        <Route path="/forum" element={<Protected user={user}><ForumPage user={user} /></Protected>} />
        <Route path="/manager" element={<Protected user={user} managerOnly><ManagerPage user={user} /></Protected>} />
      </Routes>
    </div>
  )
}
