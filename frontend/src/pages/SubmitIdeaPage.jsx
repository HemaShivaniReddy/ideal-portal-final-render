import React, { useState } from 'react'
import axios from 'axios'

export default function SubmitIdeaPage({ user }){
  const [form, setForm] = useState({ title:'', problemStatement:'', existingSolution:'', proposedSolution:'', expectedImpact:'' })
  const [msg, setMsg] = useState('')
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const submit = async (e)=>{
    e.preventDefault()
    try{
      await axios.post(api + '/api/ideas', form, { headers: { Authorization: 'Bearer ' + localStorage.getItem('ideal_token') } })
      setForm({ title:'', problemStatement:'', existingSolution:'', proposedSolution:'', expectedImpact:'' })
      setMsg('Idea submitted!')
    }catch(err){
      setMsg(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="card" style={{maxWidth:800, margin:'24px auto'}}>
      <h2>Submit Idea</h2>
      <form onSubmit={submit}>
        <input className="input" placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
        <textarea className="input" placeholder="Problem Statement" rows="3" value={form.problemStatement} onChange={e=>setForm({...form,problemStatement:e.target.value})} />
        <textarea className="input" placeholder="Existing Solution" rows="2" value={form.existingSolution} onChange={e=>setForm({...form,existingSolution:e.target.value})} />
        <textarea className="input" placeholder="Proposed Solution" rows="4" value={form.proposedSolution} onChange={e=>setForm({...form,proposedSolution:e.target.value})} />
        <textarea className="input" placeholder="Expected Impact" rows="2" value={form.expectedImpact} onChange={e=>setForm({...form,expectedImpact:e.target.value})} />
        <button className="btn" type="submit">Save</button>
      </form>
      {msg && <p><small style={{color:'salmon'}}>{msg}</small></p>}
    </div>
  )
}
