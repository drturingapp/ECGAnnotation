import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../modal/uploadModal'; // Import the Modal component
import './uploadFilePage.css';

const UploadFilePage = () => {
  const [file, setFile] = useState(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [showModal, setShowModal] = useState(false); // State to control the modal visibility

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

      // Close the modal after successful upload
      setTimeout(() => setShowModal(false), 1000);
    } catch (err) {
      setMessage('Failed to upload file.');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <a
        href="#"
        onClick={() => setShowModal(true)}
        style={{
          textDecoration: 'none',
          cursor: 'pointer',
          padding: '10px',
          fontWeight: 'bold',
          color: '#007bff',
        }}
      >
        Upload File
      </a>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
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
      </Modal>
    </>
  );
};

export default UploadFilePage;
