import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Pen, Plus, X } from 'lucide-react';
import "./css/Posts.css";

const API_BASE_URL = 'http://localhost:8080';

// API service functions
const fetchPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts`);
  return response.data;
};

const createPost = async (postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('caption', postData.caption);
  formData.append('image', postData.image);
  
  const response = await axios.post(`${API_BASE_URL}/posts/add-post`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

function Posts() {
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    caption: '',
    image: null,
    previewImage: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await fetchPosts();
        setPosts(posts);
      } catch (error) {
        setError('Failed to load posts');
        console.error('Error loading posts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPost(prev => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const createdPost = await createPost(newPost);
      setPosts([createdPost, ...posts]);
      setShowPostForm(false);
      setNewPost({
        title: '',
        caption: '',
        image: null,
        previewImage: null
      });
    } catch (error) {
      setError('Failed to create post');
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="posts-container">
      {/* Header */}
      <div className="posts-header">
        <h1><Pen size={24} /> Posts</h1>
        <button 
          className="add-post-btn"
          onClick={() => setShowPostForm(true)}
        >
          <Plus size={16} /> Add Post
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && !showPostForm && (
        <div className="loading-spinner">Loading posts...</div>
      )}

      {/* Posts Grid */}
      <div className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="post-card">
            {post.imageUrl && (
              <img
                src={`${API_BASE_URL}/${post.imageUrl}`}
                alt={post.title}
                className="post-image"
              />
            )}
            <h2 className="post-title">{post.title}</h2>
            <p className="post-caption">{post.caption}</p>
          </div>
        ))}
      </div>

      {/* Add Post Modal */}
      {showPostForm && (
        <div className="post-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Post</h2>
              <button onClick={() => setShowPostForm(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Caption</label>
                <textarea
                  name="caption"
                  value={newPost.caption}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                />
                {newPost.previewImage && (
                  <div className="image-preview">
                    <img 
                      src={newPost.previewImage} 
                      alt="Preview" 
                      style={{ maxWidth: '100%', maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel"
                  onClick={() => setShowPostForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={isLoading}
                >
                  {isLoading ? 'Posting...' : 'Add Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Posts;