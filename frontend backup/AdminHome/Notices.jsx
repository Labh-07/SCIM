import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Bell, Plus, Trash2, Loader2 } from 'lucide-react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './css/Notice.css';

const API_BASE_URL = 'http://localhost:8080';

function Notices() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [error, setError] = useState(null);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    scheduleAt: new Date(),
    isImportant: false,
    createdBy: JSON.parse(localStorage.getItem("userData"))?.name || "Admin"
  });

  // Fetch notices from backend
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/notices`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setNotices(response.data);
      } catch (error) {
        setError('Failed to load notices. Please try again later.');
        console.error('Error fetching notices:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic client-side validation
    if (!newNotice.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!newNotice.content.trim()) {
      setError("Content is required");
      return;
    }
  
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${API_BASE_URL}/notices`,
        {
          ...newNotice,
          scheduleAt: newNotice.scheduleAt.toISOString() // Convert to ISO string
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
  
      if (response.status === 201) {
        setNotices([response.data, ...notices]);
        setShowNoticeForm(false);
        setNewNotice({
          title: '',
          content: '',
          scheduleAt: new Date(),
          isImportant: false,
          createdBy: JSON.parse(localStorage.getItem("userData"))?.name || "Admin"
        });
      }
    } catch (error) {
      console.error("Error creating notice:", error);
      setError(error.response?.data?.message || "Failed to create notice");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this notice?')) {
      return;
    }
    
    try {
      setIsDeleting(id);
      await axios.delete(`${API_BASE_URL}/notices/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setNotices(notices.filter(notice => notice.id !== id));
      setError(null);
    } catch (error) {
      setError(error.response?.data || 'Failed to delete notice. Please try again.');
      console.error('Error deleting notice:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notice-container">
      <div className="notice-header">
        <h1><Bell size={24} /> Notices</h1>
        <button 
          className="add-notice-btn"
          onClick={() => setShowNoticeForm(true)}
          disabled={isLoading}
        >
          <Plus size={16} /> Add Notice
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="notice-content">
        {isLoading && notices.length === 0 ? (
          <div className="loading-spinner">
            <Loader2 className="spin" size={24} />
            Loading notices...
          </div>
        ) : notices.length === 0 ? (
          <div className="no-notices">No notices available</div>
        ) : (
          <div className="notice-list">
            {notices.map(notice => (
              <div key={notice.id} className="notice-card">
                <div className="notice-meta">
                  <span className="notice-date">{formatDate(notice.scheduleAt)}</span>
                  <span className="notice-author">{notice.createdBy || 'Admin'}</span>
                </div>
                <h3 className="notice-title">{notice.title}</h3>
                <div className="notice-content-text">{notice.content}</div>
                {notice.isImportant && (
                  <div className="notice-important">IMPORTANT</div>
                )}
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteNotice(notice.id)}
                  disabled={isDeleting === notice.id}
                >
                  {isDeleting === notice.id ? (
                    <>
                      <Loader2 className="spin" size={16} />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNoticeForm && (
  <div className="notice-modal">
    <div className="modal-content">
      <div className="modal-header">
        <h2>Add New Notice</h2>
        <button 
          onClick={() => setShowNoticeForm(false)}
          disabled={isLoading}
          className="close-btn"
        >
          &times;
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title*</label>
          <input
            type="text"
            value={newNotice.title}
            onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-group">
          <label>Schedule Date & Time*</label>
          <DateTimePicker
            onChange={(date) => setNewNotice({...newNotice, scheduleAt: date})}
            value={newNotice.scheduleAt}
            disableClock={true}
            disabled={isLoading}
            minDate={new Date()} // Prevent selecting past dates
          />
        </div>
        
        <div className="form-group">
          <label>Content*</label>
          <textarea
            value={newNotice.content}
            onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
            rows={5}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="form-checkbox">
          <input
            type="checkbox"
            id="important"
            checked={newNotice.isImportant}
            onChange={(e) => setNewNotice({...newNotice, isImportant: e.target.checked})}
            disabled={isLoading}
          />
          <label htmlFor="important">Mark as important</label>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-cancel"
            onClick={() => setShowNoticeForm(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="spin" size={16} />
                Adding...
              </>
            ) : (
              'Add Notice'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default Notices;