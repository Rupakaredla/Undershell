import { useState } from 'react'
import axios from 'axios'
import './SOSForm.css'

export default function SOSForm() {
  const [location, setLocation] = useState(null)

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = [pos.coords.latitude, pos.coords.longitude]
        setLocation(coords)
      },
      () => {
        alert("Unable to retrieve your location.")
      },
      { enableHighAccuracy: true }
    )
  }

  const handleVoice = () => {
    const rec = new(window.SpeechRecognition || window.webkitSpeechRecognition)()
    rec.onresult = e => {
      const transcript = e.results[0][0].transcript
      if (transcript.toLowerCase().includes("help")) sendSOS()
    }
    rec.start()
  }

  const sendSOS = async () => {
    const email = localStorage.getItem('email')
    await axios.post('http://localhost:5000/sos', { email, location })
    alert("SOS Triggered and SMS Sent")
  }

  const mapLink = location
    ? `https://www.google.com/maps?q=${location[0]},${location[1]}`
    : null

  return (
    <div className="sos-form-container">
      <button className="sos-form-btn" onClick={getLocation}>Get My Location</button>
      <p className="sos-form-location">
        {location ? `Latitude: ${location[0]}, Longitude: ${location[1]}` : "Location not set"}
      </p>
      {mapLink && (
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="sos-form-btn"
          style={{ textDecoration: "none", display: "inline-block", marginBottom: "1rem" }}
        >
          Open Location in Google Maps
        </a>
      )}
      <button className="sos-form-btn" onClick={sendSOS}>Send SOS</button>
      <button className="sos-form-btn" onClick={handleVoice}>Activate Voice Command</button>
    </div>
  )
}
