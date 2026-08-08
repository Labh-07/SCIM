import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Car, Plus, X, Search, BarChart2, Edit, Trash2 } from 'lucide-react';
import "./css/Parking.css";

const API_BASE_URL = 'http://localhost:8080';

function ParkingManagement() {
    
    const [parkingData, setParkingData] = useState([]);
    const [blocks, setBlocks] = useState(['A', 'B', 'C']); // Default blocks
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('all');
  const [newParking, setNewParking] = useState({
    parkingId: '',
    flatNo: '',
    block: 'A',
    residentName: '',
    isOccupied: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

   // Fetch parking data and blocks
   useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch parking data
        const parkingResponse = await axios.get(`${API_BASE_URL}/api/parking`);
        setParkingData(parkingResponse.data);
        
        // Fetch blocks separately
        const blocksResponse = await axios.get(`${API_BASE_URL}/api/parking/blocks`);
        if (blocksResponse.data && blocksResponse.data.length > 0) {
          setBlocks(blocksResponse.data);
        } else {
          // Fallback: extract from parking data if blocks endpoint fails
          const uniqueBlocks = [...new Set(parkingResponse.data.map(item => item.block))];
          if (uniqueBlocks.length > 0) {
            setBlocks(uniqueBlocks);
          }
        }
      } catch (error) {
        setError('Failed to load parking data');
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    const stats = {};
    
    blocks.forEach(block => {
      const blockData = parkingData.filter(item => item.block === block);
      stats[block] = {
        total: blockData.length,
        occupied: blockData.filter(item => item.isOccupied).length,
        available: blockData.filter(item => !item.isOccupied).length,
        percentage: Math.round((blockData.filter(item => item.isOccupied).length / blockData.length) * 100)
      };
    });
    
    // Overall stats
    stats.all = {
      total: parkingData.length,
      occupied: parkingData.filter(item => item.isOccupied).length,
      available: parkingData.filter(item => !item.isOccupied).length,
      percentage: Math.round((parkingData.filter(item => item.isOccupied).length / parkingData.length) * 100)
    };
    
    return stats;
  };

  const stats = calculateStats();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewParking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddParking = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/parking`, newParking);
      setParkingData([...parkingData, response.data]);
      setShowAddForm(false);
      setNewParking({
        parkingId: '',
        flatNo: '',
        block: 'A',
        residentName: '',
        isOccupied: false
      });
    } catch (error) {
      setError('Failed to add parking space');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/parking/${id}`);
      setParkingData(parkingData.filter(item => item._id !== id));
    } catch (error) {
      setError('Failed to delete parking space');
      console.error('Error:', error);
    }
  };

  const filteredData = parkingData.filter(item => {
    const matchesSearch = item.parkingId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.residentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = selectedBlock === 'all' || item.block === selectedBlock;
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="parking-container">
      <div className="parking-header">
        <h1><Car size={24} /> Parking Management</h1>
        <div className="header-actions">
          <button onClick={() => setShowAddForm(true)}>
            <Plus size={16} /> Add Space
          </button>
          <button onClick={() => setShowStats(!showStats)}>
            <BarChart2 size={16} /> {showStats ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {isLoading && <div className="loading-spinner">Loading...</div>}

      {showStats && (
        <div className="stats-container">
          <h2>Parking Utilization</h2>
          <div className="stats-grid">
            {['all', ...blocks].map(block => (
              <div key={block} className="stat-card">
                <h3>{block === 'all' ? 'All Blocks' : `Block ${block}`}</h3>
                <p>Total Spaces: {stats[block]?.total || 0}</p>
                <p>Occupied: {stats[block]?.occupied || 0}</p>
                <p>Available: {stats[block]?.available || 0}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${stats[block]?.percentage || 0}%` }}
                  ></div>
                </div>
                <p>{stats[block]?.percentage || 0}% occupied</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="controls">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by ID or resident..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          value={selectedBlock} 
          onChange={(e) => setSelectedBlock(e.target.value)}
        >
          <option value="all">All Blocks</option>
          {blocks.map(block => (
            <option key={block} value={block}>Block {block}</option>
          ))}
        </select>
      </div>

      <div className="parking-grid">
        {filteredData.map(item => (
          <div key={item._id} className={`parking-card ${item.isOccupied ? 'occupied' : 'available'}`}>
            <div className="card-header">
              <h3>{item.parkingId}</h3>
              <span className={`status-badge ${item.isOccupied ? 'occupied' : 'available'}`}>
                {item.isOccupied ? 'Occupied' : 'Available'}
              </span>
            </div>
            <p>Block: {item.block}</p>
            <p>Flat: {item.flatNo}</p>
            {item.residentName && <p>Resident: {item.residentName}</p>}
            <div className="card-actions">
              <button className="edit-btn">
                <Edit size={14} />
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(item._id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Parking Space</h2>
              <button onClick={() => setShowAddForm(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddParking}>
              <div className="form-group">
                <label>Parking ID</label>
                <input
                  type="text"
                  name="parkingId"
                  value={newParking.parkingId}
                  onChange={handleInputChange}
                  required
                  pattern="[P][-][A-Za-z][0-9]{3}"
                  title="Format: P-A123"
                />
              </div>
              <div className="form-group">
                <label>Block</label>
                <select
                  name="block"
                  value={newParking.block}
                  onChange={handleInputChange}
                  required
                >
                  {blocks.map(block => (
                    <option key={block} value={block}>{block}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Flat Number</label>
                <input
                  type="text"
                  name="flatNo"
                  value={newParking.flatNo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Resident Name</label>
                <input
                  type="text"
                  name="residentName"
                  value={newParking.residentName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="isOccupied"
                    checked={newParking.isOccupied}
                    onChange={(e) => setNewParking({...newParking, isOccupied: e.target.checked})}
                  />
                  Occupied
                </label>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Parking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ParkingManagement;