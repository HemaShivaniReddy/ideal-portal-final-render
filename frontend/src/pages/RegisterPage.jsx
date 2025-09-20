import React, { useState } from 'react'
import axios from 'axios'

export default function RegisterPage(){
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const [msg, setMsg] = useState('')
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const submit = async (e)=>{
    e.preventDefault()
    try{
      await axios.post(api + '/api/auth/register', form)
      setMsg('Registered! You can login now.')
    }catch(err){
      setMsg(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="card" style={{maxWidth:480, margin:'40px auto'}}>
      <h2>Create account</h2>
      <form onSubmit={submit}>
        <input className="input" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="btn" type="submit">Create account</button>
      </form>
      {msg && <p><small style={{color:'salmon'}}>{msg}</small></p>}
    </div>
  )
}
