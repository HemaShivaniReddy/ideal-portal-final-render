import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ForumPage({ user }){
  const [topics, setTopics] = useState([])
  const [newTopic, setNewTopic] = useState('')
  const api = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  const [msg, setMsg] = useState('')

  const load = async ()=>{
    try{ const { data } = await axios.get(api + '/api/forum/topics', { headers:{ Authorization: 'Bearer ' + localStorage.getItem('ideal_token') } }); setTopics(data) }
    catch(err){ setMsg(err.response?.data?.message || err.message) }
  }

  useEffect(()=>{ load() }, [])

  const createTopic = async (e)=>{
    e.preventDefault()
    try{ await axios.post(api + '/api/forum/topics', { topic: newTopic }, { headers:{ Authorization: 'Bearer ' + localStorage.getItem('ideal_token') } }); setNewTopic(''); load() }
    catch(err){ setMsg(err.response?.data?.message || err.message) }
  }

  const addComment = async (id, text, setText)=>{
    try{ await axios.post(api + '/api/forum/topics/' + id + '/comments', { text }, { headers:{ Authorization: 'Bearer ' + localStorage.getItem('ideal_token') } }); setText(''); load() }
    catch(err){ setMsg(err.response?.data?.message || err.message) }
  }

  return (
    <div className="card" style={{marginTop:24}}>
      <h2>Forum</h2>
      <form onSubmit={createTopic} style={{display:'flex',gap:8}}>
        <input className="input" placeholder="New topic..." value={newTopic} onChange={e=>setNewTopic(e.target.value)} />
        <button className="btn">Create</button>
      </form>
      {msg && <p><small style={{color:'salmon'}}>{msg}</small></p>}
      <div style={{marginTop:12}}>
        {topics.map(t=>(
          <div key={t._id} className="card" style={{marginBottom:8}}>
            <h4>{t.topic}</h4>
            <small>By {t.createdBy?.name}</small>
            <div style={{marginTop:8}}>
              {t.comments?.map((c,idx)=>(<div key={idx}><small><b>{c.user?.name}:</b> {c.text}</small></div>))}
            </div>
            <TopicCommentBox id={t._id} onAdd={addComment} />
          </div>
        ))}
      </div>
    </div>
  )
}

function TopicCommentBox({ id, onAdd }){
  const [text, setText] = useState('')
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onAdd(id, text, setText) }} style={{display:'flex', gap:8, marginTop:8}}>
      <input className="input" placeholder="Add comment..." value={text} onChange={e=>setText(e.target.value)} />
      <button className="btn">Post</button>
    </form>
  )
}
