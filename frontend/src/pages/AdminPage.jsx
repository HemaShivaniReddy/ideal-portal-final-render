import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function AdminPage({ user }){
  const [users, setUsers] = useState([])
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const token = localStorage.getItem('ideal_token')
  useEffect(()=>{ load() },[])
  const load = async ()=>{
    try{
      const { data } = await axios.get(api + '/api/auth/users', { headers: { Authorization: 'Bearer '+token }})
      setUsers(data)
    }catch(err){ console.error(err) }
  }
  const setRole = async (id, role)=>{
    try{
      await axios.post(api + '/api/auth/assign-role', { userId:id, role }, { headers:{ Authorization:'Bearer '+token }})
      load()
    }catch(err){ console.error(err) }
  }
  return (
    <div className="card" style={{marginTop:24}}>
      <h2>Admin - Users</h2>
      <table style={{width:'100%'}}>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select value={u.role} onChange={e=>setRole(u._id,e.target.value)}>
                  <option value="user">user</option>
                  <option value="manager">manager</option>
                  <option value="expert">expert</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
