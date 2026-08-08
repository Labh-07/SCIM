
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/LogIn.css';
import buildingImage from './assets/building pic for sign up page.jpg';
import CommunityLogo from './assets/Logo.jpg';
import { Link } from 'react-router-dom';
import { API_ROUTES } from '../../config/api.routes';


const LogIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Resident');

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new URLSearchParams();
    formData.append('username' , email)
    formData.append('password' , password)
    formData.append('scope',role)

    try {
      const response = await fetch(API_ROUTES.AUTH.LOGIN ,{
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Login Failed:", errorText);
        alert(`Login Failed: ${errorText}`);
        return;
      }

      const data = await response.json();

      // Store user details in localStorage
      localStorage.setItem('token', data?.access_token);

      // Redirect based on role
      if (data.role === 'Admin') {
        navigate('/homeResident');
      } else if (data.role === 'Resident') {
        navigate('/homeResident');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert("An error occurred. Check console logs.");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login_section">
        <div className="login_img">
          <img src={buildingImage} alt="building" />
        </div>
        <div className="login_form">
          <img src={CommunityLogo} id="logo" alt="community logo" />
          <h3>Log In</h3>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <br /><br />

            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <br /><br />

            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="Resident">Resident</option>
              <option value="Admin">Admin</option>
            </select>
            <br /><br />

            <input type="submit" className="button" value="Log In" />
          </form>

          <p className="signup_prompt">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;