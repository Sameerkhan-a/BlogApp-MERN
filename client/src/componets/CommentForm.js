import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { commentAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CommentForm = ({ blogId, onCommentAdded, editMode = false, initialContent = '', commentId = null, onCancel = null }) => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please enter a comment');
      return;
    }

    if (content.trim().length > 1000) {
      setError('Comment cannot exceed 1000 characters');
      return;
    }

    try {
      setLoading(true);
      setError('');

      let response;
      if (editMode && commentId) {
        response = await commentAPI.updateComment(commentId, content.trim());
        if (onCommentAdded) {
          onCommentAdded(response.data.comment);
        }
      } else {
        response = await commentAPI.addComment(blogId, content.trim());
        if (onCommentAdded) {
          onCommentAdded(response.data.comment);
        }
      }

      // Reset form
      setContent('');
      
      // Call onCancel if in edit mode to close the edit form
      if (editMode && onCancel) {
        onCancel();
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError(
        err.response?.data?.message || 
        `Failed to ${editMode ? 'update' : 'add'} comment. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent(initialContent);
    setError('');
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box>
      {!editMode && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              fontSize: '0.9rem'
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography variant="body2" color="text.secondary">
            Share your thoughts...
          </Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={editMode ? 3 : 4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={editMode ? "Edit your comment..." : "Write a comment..."}
          variant="outlined"
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'background.default',
              '& fieldset': {
                borderColor: 'divider',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
            },
            '& .MuiInputBase-input': {
              color: 'text.primary',
            },
            '& .MuiInputBase-input::placeholder': {
              color: 'text.secondary',
              opacity: 0.7,
            },
          }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            {content.length}/1000 characters
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            {editMode && (
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
                sx={{ borderRadius: 2 }}
              >
                Cancel
              </Button>
            )}
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !content.trim()}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              {loading 
                ? (editMode ? 'Updating...' : 'Posting...') 
                : (editMode ? 'Update' : 'Post Comment')
              }
            </Button>
          </Box>
        </Box>
      </form>
    </Box>
  );
};

export default CommentForm;
