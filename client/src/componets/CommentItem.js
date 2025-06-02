import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Alert
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { commentAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, onCommentDeleted, onCommentUpdated, isLast = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const isOwner = user && user._id === comment.author._id;

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditMode(true);
    handleMenuClose();
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setError('');
  };

  const handleCommentUpdated = (updatedComment) => {
    setEditMode(false);
    setError('');
    if (onCommentUpdated) {
      onCommentUpdated(updatedComment);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      handleMenuClose();
      return;
    }

    try {
      setDeleting(true);
      setError('');
      
      await commentAPI.deleteComment(comment._id);
      
      if (onCommentDeleted) {
        onCommentDeleted(comment._id);
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(
        err.response?.data?.message || 
        'Failed to delete comment. Please try again.'
      );
    } finally {
      setDeleting(false);
      handleMenuClose();
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) {
        return 'Just now';
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch {
      return dateString;
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          py: 2,
          opacity: deleting ? 0.5 : 1,
          transition: 'opacity 0.3s ease'
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: 'primary.main',
            fontSize: '1rem'
          }}
        >
          {comment.author?.name?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>

        {/* Comment Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {/* Author and Date */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {comment.author?.name || 'Unknown User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(comment.createdAt)}
              </Typography>
            </Box>

            {/* Actions Menu */}
            {isOwner && (
              <Box>
                <IconButton
                  size="small"
                  onClick={handleMenuOpen}
                  disabled={deleting}
                  sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}
                >
                  <MoreVertIcon fontSize="small" />
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      borderRadius: 2,
                      minWidth: 120
                    }
                  }}
                >
                  <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1, fontSize: 16 }} />
                    Edit
                  </MenuItem>
                  <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1, fontSize: 16 }} />
                    Delete
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>

          {/* Comment Content or Edit Form */}
          {editMode ? (
            <CommentForm
              blogId={comment.blogPost}
              editMode={true}
              initialContent={comment.content}
              commentId={comment._id}
              onCommentAdded={handleCommentUpdated}
              onCancel={handleCancelEdit}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {comment.content}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Divider */}
      {!isLast && <Divider sx={{ ml: 7 }} />}
    </Box>
  );
};

export default CommentItem;
