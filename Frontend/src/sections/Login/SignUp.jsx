import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './css/SignUp.css';
import buildingImage from './assets/building pic for sign up page.jpg';
import CommunityLogo from './assets/Logo.jpg';
import { API_ROUTES } from '../../config/api.routes';
import ResidentDetails from "./ResidentDetails";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Resident');
    const [stage,setStage]= useState(1);

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault(); // Prevents page reload
         const formData = new FormData(e.currentTarget); 
    
    // Convert key/value pairs instantly into a clean object
    const formValues = Object.fromEntries(formData); 
    formValues.username = username;
    formValues.email=email;
    formValues.password=password;
    formValues.role=role;

    //check flatno is got as a number or not
    
        try {
            const response = await fetch(API_ROUTES.AUTH.REGISTER, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formValues),
            });


            // First check if response is ok
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Signup failed:", errorData.message || response.statusText);
                alert(`Signup failed: ${errorData.message || response.statusText}`);
                return;
            }

            const data = await response.json();

            if (response.ok) {

                navigate("/login")
            }
        } catch (error) {
            console.error("Error connecting to backend:", error);
            alert("An error occurred. Please check console for details.");
        }
    };

    function hanlenextBtnClick(){
        if (!email || !username || !password ){
            alert("Please fill require field !!!");
            return;
        }

        setStage(2);
    }

    return(
                    <form onSubmit={handleSignUp}>
    {stage == 1 ?    <div className="signup-page-container">
            <div className="signup_section">
                <div className="signup_img">
                    <img src={buildingImage} alt="building" />
                </div>
                <div className="signup_form">
                    <img src={CommunityLogo} id="logo" alt="community logo" />
                    <h3>Sign Up</h3>

                         <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <br /><br />

                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <br /><br />

                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <br /><br />

                        <label>Role</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="Admin">Admin</option>
                            <option value="Resident">Resident</option>
                        </select>
                        <br /><br />

                        <button type='button' className="button" onClick={hanlenextBtnClick}>
                            Next
                        </button>
                    <p className="signup_prompt">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div> : <ResidentDetails />}
                    </form>
    )
   
};

export default SignUp;