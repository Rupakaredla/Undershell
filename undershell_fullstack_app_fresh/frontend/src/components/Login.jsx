import { useState } from 'react'
import axios from 'axios'
import './Login.css'

export default function Login({ onLogin }) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post('http://localhost:5000/login', { identifier, password })
      localStorage.setItem('email', identifier)
      if (onLogin) onLogin()
    } catch (err) {
      setError('Login failed. Please check your credentials.')
    }
  }

  return (
    <form className="login-form-container" onSubmit={handleSubmit} style={{ maxWidth: 350, margin: "2rem auto" }}>
      <h2>Login</h2>
      {error && (
        <div style={{
          background: "#ffcccc",
          color: "#b71c1c",
          padding: "0.5rem",
          borderRadius: "4px",
          marginBottom: "1rem",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}
      <input
        type="text"
        placeholder="Email or Phone Number"
        value={identifier}
        required
        onChange={e => setIdentifier(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        required
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button type="submit" style={{ width: "100%" }}>Login</button>
    </form>
  )
}