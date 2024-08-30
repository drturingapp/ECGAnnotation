import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './uploadFilePage.css';
import axios from 'axios';

const UploadFilePage = () => {
  const [file, setFile] = useState(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const history = useHistory(); // Initialize the history function

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleUpload = async () => {
    if (!file || !age || !gender) {
      setMessage('Please select a file and provide age and gender.');
      setMessageType('error');
      return;
    }

    setUploading(true);
    setMessage('');
    setMessageType('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('age', age);
    formData.append('gender', gender);

    try {
      await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('File uploaded successfully!');
      setMessageType('success');

      // Clear the state
      setFile(null);
      setAge('');
      setGender('');
      setUploading(false);
      
      // Navigate to the specific URL after 2 seconds
      setTimeout(() => {
        history.push('/mainContainer?query=abc#/'); // Navigate to the specific URL
      }, 1000);
    } catch (err) {
      setMessage('Failed to upload file.');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload File</h1>
      <input
        type="file"
        onChange={handleFileChange}
        className="file-input"
      />
      <input
        type="number"
        value={age}
        onChange={handleAgeChange}
        placeholder="Age"
        className="input-field"
      />
      <select
        value={gender}
        onChange={handleGenderChange}
        className="input-field"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <button
        onClick={handleUpload}
        className="upload-button"
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && (
        <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadFilePage;
