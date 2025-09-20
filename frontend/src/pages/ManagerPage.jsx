import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ManagerPage({ user }){
  const [ideas, setIdeas] = useState([])
  const [msg, setMsg] = useState('')
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const load = async ()=>{
    try{ const { data } = await axios.get(api + '/api/ideas/all', { headers: { Authorization: 'Bearer ' + localStorage.getItem('ideal_token') } }); setIdeas(data) }
    catch(err){ setMsg(err.response?.data?.message || err.message) }
  }

  useEffect(()=>{ load() }, [])

  const act = async (id, action)=>{
    try{ await axios.post(api + `/api/ideas/${id}/${action}`, {}, { headers: { Authorization: 'Bearer ' + localStorage.getItem('ideal_token') } }); load() }
    catch(err){ setMsg(err.response?.data?.message || err.message) }
  }

  if (!user) return (<div className="card" style={{marginTop:24}}><h2>Manager area</h2><p>Please login.</p></div>)

  return (
    <div className="card" style={{marginTop:24}}>
      <h2>Manager — Approvals</h2>
      {msg && <p><small style={{color:'salmon'}}>{msg}</small></p>}
      <table className="table">
        <thead><tr><th>Title</th><th>Owner</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {ideas.map(i=>(
            <tr key={i._id}>
              <td><strong>{i.title}</strong><div><small>{i.problemStatement}</small></div></td>
              <td><small>{i.createdBy?.name} ({i.createdBy?.email})</small></td>
              <td><small>{i.status}</small></td>
              <td style={{display:'flex',gap:8}}>
                <button className="btn" onClick={()=>act(i._id,'approve')}>Approve</button>
                <button className="btn" onClick={()=>act(i._id,'reject')}>Reject</button><button className="btn" onClick={()=>act(i._id,'hold')}>Hold</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
