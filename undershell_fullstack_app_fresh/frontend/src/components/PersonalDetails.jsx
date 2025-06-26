import { useState } from 'react'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import './PersonalDetails.css'

export default function PersonalDetails() {
  const [father, setFather] = useState('')
  const [mother, setMother] = useState('')
  const [sister, setSister] = useState('')
  const [brother, setBrother] = useState('')
  const [friend, setFriend] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { email, phone } = location.state || {}

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      // Save personal details (optional: send to backend)
      await axios.post('http://localhost:5000/personal-details', {
        email, phone, father, mother, sister, brother, friend
      })
      navigate('/login')
    } catch (err) {
      setError('Failed to save details. Please try again.')
    }
  }

  return (
    <form className="personal-details-form-container" onSubmit={handleSubmit} style={{ maxWidth: 350, margin: "2rem auto" }}>
      <h2>Personal Details</h2>
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
      <input type="tel" placeholder="Father Phone Number" value={father} required onChange={e => setFather(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
      <input type="tel" placeholder="Mother Phone Number" value={mother} required onChange={e => setMother(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
      <input type="tel" placeholder="Sister Phone Number" value={sister} onChange={e => setSister(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
      <input type="tel" placeholder="Brother Phone Number" value={brother} onChange={e => setBrother(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
      <input type="tel" placeholder="Friend Phone Number" value={friend} onChange={e => setFriend(e.target.value)} style={{ width: "100%", marginBottom: 10 }} />
      <button type="submit" style={{ width: "100%" }}>Save and Continue</button>
    </form>
  )
}