import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import axios from 'axios';
import config from '../config';

const ImageUpload = ({ onImageUpload, initialImage = null, label = "Upload Cover Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    uploadImage(file);
  };

  const uploadImage = async (file) => {
    setUploading(true);
    setError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${config.BASE_URL}/api/upload/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        }
      );

      if (response.data.success) {
        setImageUrl(response.data.imageUrl);
        onImageUpload(response.data.imageUrl);
        setError('');
      } else {
        setError(response.data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to upload image. Please try again.'
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 1, 
          fontWeight: 600,
          color: 'text.primary',
          fontSize: '1rem'
        }}
      >
        {label}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {!imageUrl ? (
        <Paper
          sx={{
            border: '2px dashed',
            borderColor: dragOver ? 'primary.main' : 'divider',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            backgroundColor: dragOver ? 'action.hover' : 'background.default',
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'action.hover'
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />

          {uploading ? (
            <Box sx={{ py: 2 }}>
              <CircularProgress size={40} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Uploading... {uploadProgress}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress} 
                sx={{ mt: 1, borderRadius: 1 }}
              />
            </Box>
          ) : (
            <Box>
              <CloudUploadIcon 
                sx={{ 
                  fontSize: 48, 
                  color: 'primary.main', 
                  mb: 1 
                }} 
              />
              <Typography variant="h6" sx={{ mb: 1 }}>
                Drop your image here
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                or click to browse files
              </Typography>
              <Button
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                sx={{ borderRadius: 2 }}
              >
                Choose Image
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Supports: JPG, PNG, GIF, WebP (Max 5MB)
              </Typography>
            </Box>
          )}
        </Paper>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <img
                src={imageUrl}
                alt="Uploaded preview"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '8px'
                }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.light',
                    color: 'white'
                  }
                }}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Image uploaded successfully
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={openFileDialog}
                startIcon={<CloudUploadIcon />}
                sx={{ borderRadius: 2 }}
              >
                Change Image
              </Button>
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
