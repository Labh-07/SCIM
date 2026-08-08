import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/FormStyle.css';
import buildingImage from './assets/building pic for sign up page.jpg';
import CommunityLogo from './assets/Logo.jpg';

const SuccessPage = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/LogIn');
    };

    return (
        <div className="login-page-container">
            <div className="login_section">
                <div className="login_img">
                    <img src={buildingImage} alt="building" />
                </div>
                <div className="login_form">
                    <img src={CommunityLogo} id="logo" alt="community logo" />
                    <h3>Registration Successful!</h3>
                    <p className="success-message">Your account has been created successfully.</p>
                    <button className="button" onClick={handleLoginRedirect}>
                        Go to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;