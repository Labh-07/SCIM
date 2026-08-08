import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./css/FormStyle.css";
import buildingImage from "./assets/building pic for sign up page.jpg";
import CommunityLogo from "./assets/Logo.jpg";
import { API_ROUTES } from "../../config/api.routes";
const ResidentDetails = () => {
  const [societies, setSocieties] = useState([]);
  const [selectedId, setSelectedId] = useState('');


  const navigate = useNavigate();

  useEffect(() => {
    //fetch socirty data
    fetch(API_ROUTES.SOCIETY.GETSOCIETY)
      .then(res => res.json())
      .then(data => setSocieties(data))
      .catch(err => console.error("Error fetching societies:", err));

  }, []);

  const handleChange = (e) => {
    setSelectedId(e.target.value);
  };

  return (
    <div className="login-page-container">
      <div className="login_section">
        <div className="login_img">
          <img src={buildingImage} alt="building" />
        </div>
        <div className="login_form">
          <img src={CommunityLogo} id="logo" alt="community logo" />
          <h3>Resident Details</h3>
          

          <label>Name</label>
          <input
            type="text"
            name="residentname"
            required
          />

          <label>Phone Number</label>
          <input
            type="text"
            name="mobileno"
            required
          />

          <label htmlFor="society-select">Choose a Society:</label>
          <select
            id="society-select"
            value={selectedId}
            onChange={handleChange}
            name="societyid"
          >
            <option value="">--Select a Society--</option>
            {societies.map((society) => (
              <option key={society.id} value={society.id}>
                {society.societyname}
              </option>
            ))}
          </select>

          <label>Block</label>
          <input
            type="text"
            name="block"
            required
          />

          <label>Flat No.</label>
          <input
            type="number"
            name="flatno"
            required
          />

          <button type="submit" className="button">
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResidentDetails;
