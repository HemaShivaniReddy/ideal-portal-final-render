import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function IdeasPage(){
  const [ideas, setIdeas] = useState([])
  const [msg, setMsg] = useState('')
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const load = async ()=>{
    try{ const { data } = await axios.get(api + '/api/ideas/my', { headers: { Authorization: 'Bearer ' + localStorage.getItem('ideal_token') } }); setIdeas(data) }
    catch(err){ setMsg(err.response?.data?.message || err.message) }
  }

  React.useEffect(()=>{ load() }, [])

  return (
    <div className="card" style={{marginTop:24}}>
      <h2>Your ideas</h2>
      <table className="table">
        <thead><tr><th>Title</th><th>Status</th><th>Created</th></tr></thead>
        <tbody>
          {ideas.map(i=>(
            <tr key={i._id}><td>{i.title}</td><td><small>{i.status}</small></td><td><small>{new Date(i.createdAt).toLocaleString()}</small></td></tr>
          ))}
          {ideas.length===0 && <tr><td colSpan="3">No ideas yet</td></tr>}
        </tbody>
      </table>
      {msg && <p><small style={{color:'salmon'}}>{msg}</small></p>}
    </div>
  )
}
