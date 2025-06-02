import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Button,
  Collapse
} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { commentAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const CommentSection = ({ blogId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentStats, setCommentStats] = useState({ commentCount: 0 });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [expanded, setExpanded] = useState(false);
  const { isLoggedIn } = useAuth();

  // Fetch comment statistics
  const fetchCommentStats = async () => {
    try {
      const response = await commentAPI.getCommentStats(blogId);
      setCommentStats(response.data);
    } catch (err) {
      console.error('Error fetching comment stats:', err);
    }
  };

  // Fetch comments
  const fetchComments = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await commentAPI.getCommentsByBlogId(blogId, {
        page,
        limit: 10
      });
      
      if (page === 1) {
        setComments(response.data.comments);
      } else {
        setComments(prev => [...prev, ...response.data.comments]);
      }
      
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  // Load more comments
  const loadMoreComments = () => {
    if (pagination.hasNextPage && !loading) {
      fetchComments(pagination.currentPage + 1);
    }
  };

  // Handle new comment added
  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
    setCommentStats(prev => ({
      ...prev,
      commentCount: prev.commentCount + 1
    }));
    if (!expanded) {
      setExpanded(true);
    }
  };

  // Handle comment deleted
  const handleCommentDeleted = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
    setCommentStats(prev => ({
      ...prev,
      commentCount: Math.max(0, prev.commentCount - 1)
    }));
  };

  // Handle comment updated
  const handleCommentUpdated = (updatedComment) => {
    setComments(prev => 
      prev.map(comment => 
        comment._id === updatedComment._id ? updatedComment : comment
      )
    );
  };

  // Toggle comments section
  const toggleComments = () => {
    setExpanded(!expanded);
    if (!expanded && comments.length === 0) {
      fetchComments();
    }
  };

  // Initial load of comment stats
  useEffect(() => {
    fetchCommentStats();
  }, [blogId]);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Comments Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: 'background.default',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
        onClick={toggleComments}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CommentIcon color="primary" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Comments ({commentStats.commentCount})
          </Typography>
        </Box>
        
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      {/* Comments Content */}
      <Collapse in={expanded}>
        <Box sx={{ p: 2 }}>
          {/* Comment Form */}
          {isLoggedIn ? (
            <Box sx={{ mb: 3 }}>
              <CommentForm
                blogId={blogId}
                onCommentAdded={handleCommentAdded}
              />
            </Box>
          ) : (
            <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
              Please log in to leave a comment.
            </Alert>
          )}

          <Divider sx={{ mb: 2 }} />

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {/* Comments List */}
          {comments.length > 0 ? (
            <Box>
              <CommentList
                comments={comments}
                onCommentDeleted={handleCommentDeleted}
                onCommentUpdated={handleCommentUpdated}
              />

              {/* Load More Button */}
              {pagination.hasNextPage && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={loadMoreComments}
                    disabled={loading}
                    sx={{ borderRadius: 2 }}
                  >
                    {loading ? (
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                    ) : null}
                    Load More Comments
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            !loading && expanded && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  💬 No comments yet. Be the first to share your thoughts!
                </Typography>
              </Box>
            )
          )}

          {/* Loading Indicator */}
          {loading && comments.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default CommentSection;
