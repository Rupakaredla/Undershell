import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import Header from './components/Header'
import SOSForm from './components/SOSForm'
import Login from './components/Login'
import Register from './components/Register'
import PersonalDetails from './components/PersonalDetails'
import { messaging, getToken, onMessage } from "./firebase";

function Dashboard() {
  return (
    <div>
      <SOSForm />
    </div>
  )
}

function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <Link to="/login" style={{ margin: "0 1rem" }}>Login</Link>
      <Link to="/register" style={{ margin: "0 1rem" }}>Register</Link>
    </div>
  )
}

function PrivateRoute({ children }) {
  const isLoggedIn = !!localStorage.getItem('email')
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('email'))

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('email'))
  }, [])

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => {
    localStorage.removeItem('email')
    setIsLoggedIn(false)
  }

  useEffect(() => {
    if ('Notification' in window && navigator.serviceWorker) {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" })
            .then((currentToken) => {
              if (currentToken) {
                console.log("FCM Token:", currentToken);
                // TODO: Send this token to your backend and associate with the user
              }
            });
        }
      });

      onMessage(messaging, (payload) => {
        alert(payload.notification.title + ": " + payload.notification.body);
      });
    }
  }, []);

  return (
    <Router>
      <Header />
      {isLoggedIn && (
        <div style={{ textAlign: "right", margin: "1rem" }}>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Home />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/personal-details" element={<PersonalDetails />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}