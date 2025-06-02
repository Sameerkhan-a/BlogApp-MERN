import {
  Box,
  Button,
  InputLabel,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Container
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./utils";
import { blogAPI } from "../utils/api";
import config from "../config";
import TagInput from "./TagInput";
import ImageUpload from "./ImageUpload";

const AddBlogs = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    imageURL: "",
  });
  const [tags, setTags] = useState([]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const handleImageUpload = (imageUrl) => {
    setInputs((prevState) => ({
      ...prevState,
      imageURL: imageUrl || "",
    }));
    if (error) setError(""); // Clear error when image is uploaded
  };

  const sendRequest = async () => {
    try {
      setLoading(true);
      const res = await blogAPI.createBlog({
        title: inputs.title,
        content: inputs.content,
        img: inputs.imageURL || config.PLACEHOLDER_IMAGE,
        tags: tags,
      });
      return res.data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputs.title.trim() || !inputs.content.trim()) {
      setError("Title and content are required");
      return;
    }

    // Authentication is handled by the API interceptor and protected route

    sendRequest()
      .then((data) => {
        navigate("/blogs");
      })
      .catch((err) => {
        console.error("Error creating blog:", err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to create blog. Please try again.");
        }
      });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          backgroundImage: (theme) =>
            theme.palette.mode === 'light'
              ? 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
              : 'linear-gradient(145deg, #1a1a1a 0%, #2d2d2d 100%)',
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: 'primary.main',
              mb: 1,
              fontSize: { xs: '1.8rem', md: '2.5rem' }
            }}
          >
            ✍️ Write Your Story
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 500, mx: 'auto' }}
          >
            Share your thoughts, experiences, and insights with the world
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 2,
                  '& .MuiAlert-message': { width: '100%' }
                }}
              >
                {error}
              </Alert>
            )}

            <Box>
              <InputLabel
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '1rem'
                }}
              >
                Title *
              </InputLabel>
              <TextField
                name="title"
                onChange={handleChange}
                value={inputs.title}
                variant="outlined"
                fullWidth
                required
                placeholder="Give your blog an engaging title..."
                sx={{
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
            </Box>

            <Box>
              <InputLabel
                sx={{
                  mb: 1,
                  fontWeight: 600,
                  color: 'text.primary',
                  fontSize: '1rem'
                }}
              >
                Content *
              </InputLabel>
              <TextField
                name="content"
                onChange={handleChange}
                value={inputs.content}
                variant="outlined"
                fullWidth
                multiline
                rows={10}
                required
                placeholder="Tell your story... What's on your mind?"
                sx={{
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
            </Box>

            <Box>
              <TagInput
                tags={tags}
                onChange={setTags}
                label="Tags (Help others discover your content)"
                maxTags={10}
              />
            </Box>

            <ImageUpload
              onImageUpload={handleImageUpload}
              initialImage={inputs.imageURL}
              label="Cover Image (Optional)"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/blogs')}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  flex: 1,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  flex: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem'
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Publishing...
                  </Box>
                ) : (
                  '🚀 Publish Blog'
                )}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AddBlogs;
