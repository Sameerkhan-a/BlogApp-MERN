import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Chip,
  Stack,
  IconButton,
  Divider,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { blogAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from './CommentSection';

const SingleBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await blogAPI.getBlogById(id);
        setBlog(response.data.blog);
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Failed to load blog. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/myBlogs/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogAPI.deleteBlog(id);
        navigate('/blogs');
      } catch (err) {
        console.error('Error deleting blog:', err);
        setError('Failed to delete blog. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const isOwner = user && blog && user._id === blog.user._id;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress size={40} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blogs')}
        >
          Back to Blogs
        </Button>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Blog not found
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blogs')}
        >
          Back to Blogs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Back Button */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/blogs')}
          sx={{ borderRadius: 2 }}
        >
          Back to Blogs
        </Button>
      </Box>

      {/* Main Blog Content */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          position: 'relative'
        }}
      >
        {/* Owner Actions */}
        {isOwner && (
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              display: 'flex',
              gap: 1,
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: 2,
              p: 0.5
            }}
          >
            <IconButton
              onClick={handleEdit}
              size="small"
              sx={{
                color: "primary.main",
                '&:hover': { backgroundColor: 'primary.light', color: 'white' }
              }}
            >
              <ModeEditOutlineIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={handleDelete}
              size="small"
              sx={{
                color: "error.main",
                '&:hover': { backgroundColor: 'error.light', color: 'white' }
              }}
            >
              <DeleteForeverIcon fontSize="small" />
            </IconButton>
          </Box>
        )}

        {/* Blog Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '2rem', md: '2.5rem' },
              lineHeight: 1.2,
              color: 'text.primary'
            }}
          >
            {blog.title}
          </Typography>

          {/* Author and Meta Info */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'primary.main',
                  fontSize: '1rem'
                }}
              >
                {blog.user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {blog.user?.name || 'Unknown Author'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Author
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarTodayIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(blog.date || blog.createdAt)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {blog.viewCount || 0} views
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {blog.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={`#${tag}`}
                    size="small"
                    variant="filled"
                    sx={{
                      backgroundColor: 'primary.light',
                      color: 'white',
                      fontWeight: 500,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* Featured Image */}
        {blog.img && (
          <Box sx={{ mb: 4 }}>
            <img
              src={blog.img}
              alt={blog.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </Box>
        )}

        {/* Blog Content */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: 'text.primary',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}
          >
            {blog.content}
          </Typography>
        </Box>

        {/* Footer */}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Thank you for reading! 📚
          </Typography>
        </Box>
      </Paper>

      {/* Comments Section */}
      <CommentSection blogId={id} />
    </Container>
  );
};

export default SingleBlog;
