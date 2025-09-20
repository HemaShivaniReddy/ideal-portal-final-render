import React from 'react'
import { Link } from 'react-router-dom'

export default function WelcomePage({ user }){
  return (
    <div className="card" style={{marginTop:24}}>
      <h1>Welcome {user?.name || ''} 👋</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginTop:12}}>
        <div className="card"><h3>Submit Idea</h3><p>Create and share ideas.</p><Link to="/submit" className="btn">Open</Link></div>
        <div className="card"><h3>View Ideas</h3><p>See your ideas and status.</p><Link to="/ideas" className="btn">Open</Link></div>
        <div className="card"><h3>Forum</h3><p>Discuss topics with teammates.</p><Link to="/forum" className="btn">Open</Link></div>
        <div className="card"><h3>Manager</h3><p>Approve or reject ideas.</p><Link to="/manager" className="btn">Open</Link></div>
      </div>
    </div>
  )
}
