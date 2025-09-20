import React, { useState } from 'react'
import axios from 'axios'

export default function LoginPage({ onAuth }){
  const [form, setForm] = useState({ email:'', password:'', otp:'' })
  const [step, setStep] = useState(1) // 1=credentials,2=otp
  const [msg, setMsg] = useState('')
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  const submit = async (e)=>{
    e.preventDefault()
    try{
      if(step===1){
        const { data } = await axios.post(api + '/api/auth/login', { email: form.email, password: form.password })
        setMsg(data.message || 'OTP sent')
        setStep(2)
      }else{
        const { data } = await axios.post(api + '/api/auth/verify-otp', { email: form.email, otp: form.otp })
        // save token and notify parent
        localStorage.setItem('ideal_token', data.token)
        onAuth(data.user)
      }
    }catch(err){
      setMsg(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="card" style={{maxWidth:480, margin:'40px auto'}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input className="input" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        {step===2 && <input className="input" placeholder="OTP (6 digits)" value={form.otp} onChange={e=>setForm({...form,otp:e.target.value})} />}
        <button className="btn" type="submit">{step===1 ? 'Send OTP' : 'Verify & Login'}</button>
      </form>
      {msg && <p><small style={{color:'salmon'}}>{msg}</small></p>}
    </div>
  )
}
