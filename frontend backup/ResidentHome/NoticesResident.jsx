
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Bell, Plus, ChevronDown } from 'lucide-react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import './css/NoticeResident.css';

const API_BASE_URL = 'http://localhost:8080';

const fetchNotices = async () => {
  const response = await axios.get(`${API_BASE_URL}/notices`);
  return response.data;
};

const createNotice = async (noticeData) => {
  const response = await axios.post(`${API_BASE_URL}/notices/add-notice`, noticeData);
  return response.data;
};

function Notices() {
  const [notices, setNotices] = useState([]);
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    scheduleAt: new Date(),
    isImportant: false
  });

  useEffect(() => {
    const loadNotices = async () => {
      try {
        const notices = await fetchNotices();
        setNotices(notices);
      } catch (error) {
        console.error('Error loading notices:', error);
      }
    };
    loadNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const createdNotice = await createNotice(newNotice);
      setNotices([createdNotice, ...notices]);
      setShowNoticeForm(false);
      setNewNotice({
        title: '',
        content: '',
        scheduleAt: new Date(),
        isImportant: false
      });
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="notice-container">
      <div className="notice-header">
        <h1><Bell size={24} /> Notices</h1>
        
      </div>

      <div className="notice-content">
        <h2>Society Notices</h2>
        
        <div className="notice-list">
          {notices.map(notice => (
            <div key={notice._id} className="notice-card">
              <div className="notice-meta">
                <span className="notice-date">{formatDate(notice.scheduleAt)}</span>
                <span className="notice-author">{notice.createdBy || 'Admin'}</span>
              </div>
              <div className="notice-title">{notice.title}</div>
              <div className="notice-content-text">{notice.content}</div>
              {notice.isImportant && (
                <div className="notice-important">IMPORTANT</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Add Notice Modal */}
      {showNoticeForm && (
        <div className="notice-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Notice</h2>
              <button onClick={() => setShowNoticeForm(false)}>
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Schedule Date & Time</label>
                <DateTimePicker
                  onChange={(date) => setNewNotice({...newNotice, scheduleAt: date})}
                  value={newNotice.scheduleAt}
                  disableClock={true}
                />
              </div>
              
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={newNotice.content}
                  onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
                  rows={5}
                  required
                />
              </div>
              
              <div className="form-checkbox">
                <input
                  type="checkbox"
                  id="important"
                  checked={newNotice.isImportant}
                  onChange={(e) => setNewNotice({...newNotice, isImportant: e.target.checked})}
                />
                <label htmlFor="important">Mark as important</label>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowNoticeForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Add Notice
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