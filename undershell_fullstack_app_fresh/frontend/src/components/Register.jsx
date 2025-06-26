import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import './Register.css'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await axios.post('http://localhost:5000/register', { name, email, phone, password })
      navigate('/personal-details', { state: { email, phone } })
    } catch (err) {
      setError('Registration failed. Please try again.')
    }
  }

  return (
    <form className="register-form-container" onSubmit={handleSubmit} style={{ maxWidth: 350, margin: "2rem auto" }}>
      <h2>Register</h2>
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
      <input type="text" placeholder="Full Name" value={name} required onChange={e => setName(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
      <input
        type="email"
        placeholder="Email"
        value={email}
        required
        onChange={e => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={phone}
        required
        onChange={e => setPhone(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Set Password"
        value={password}
        required
        onChange={e => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        required
        onChange={e => setConfirmPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <button type="submit" style={{ width: "100%" }}>Register</button>
    </form>
  )
}