import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Icon = ({ name }) => {
  const icons = {
    home:  <svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M3 10l9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10z"/></svg>,
    idea:  <svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a7 7 0 0 0-7 7c0 2.8 1.7 5.2 4 6.3V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3.7c2.3-1.1 4-3.5 4-6.3a7 7 0 0 0-7-7z"/></svg>,
    list:  <svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/></svg>,
    forum: <svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M17 2H3a1 1 0 0 0-1 1v14l4-4h11a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zm4 4h-2v9H8v2a1 1 0 0 0 1 1h10l4 4V7a1 1 0 0 0-1-1z"/></svg>,
    manager:<svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>,
    user:  <svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/></svg>,
    logout:<svg className="icon" viewBox="0 0 24 24" fill="currentColor"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H5a2 2 0 0 0-2 2v6h2V5h14v14H5v-6H3v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/></svg>
  };
  return icons[name] || null;
}

export default function Header({ user, onLogout }){
  const { pathname } = useLocation();
  const active = (p) => pathname === p ? { outline: '2px solid rgba(147,197,253,0.9)' } : {};

  return (
    <header className="header">
      <div className="header-inner">
        <Link to={user ? '/welcome' : '/'} className="brand">
          <div className="logo">💡</div>
          <span>Idea Portal</span>
        </Link>
        <nav className="nav-right">
          {user ? (
            <>
              <Link to="/welcome" style={active('/welcome')} className="nav-link"><Icon name="home" /><span>Welcome</span></Link>
              <Link to="/submit" style={active('/submit')} className="nav-link"><Icon name="idea" /><span>Submit Ideas</span></Link>
              <Link to="/ideas" style={active('/ideas')} className="nav-link"><Icon name="list" /><span>Ideas</span></Link>
              <Link to="/forum" style={active('/forum')} className="nav-link"><Icon name="forum" /><span>Forum</span></Link>
              {user?.role === 'manager' && <Link to="/manager" style={active('/manager')} className="nav-link"><Icon name="manager" /><span>Manager</span></Link>}
              <div className="nav-link" style={{border:'none'}}><Icon name="user" /><span>{user.name}</span></div>
              <button className="nav-link btn" onClick={onLogout}><Icon name="logout" /><span>Logout</span></button>
            </>
          ) : (
            <>
              <Link to="/" style={active('/')} className="nav-link"><Icon name="home" /><span>Home</span></Link>
              <Link to="/login" style={active('/login')} className="nav-link"><Icon name="user" /><span>Login</span></Link>
              <Link to="/register" style={active('/register')} className="nav-link"><Icon name="user" /><span>Register</span></Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
