import {
  Button,
  InputLabel,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Paper
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStyles } from "./utils";
import { blogAPI } from "../utils/api";
import TagInput from "./TagInput";
import ImageUpload from "./ImageUpload";

const labelStyles = { mb: 1, mt: 2, fontSize: "18px", fontWeight: "bold" };

const BlogDetail = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { id } = useParams();

  const [inputs, setInputs] = useState({ title: "", content: "", imageURL: "" });
  const [tags, setTags] = useState([]);
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  const handleImageUpload = (imageUrl) => {
    setInputs((prevState) => ({
      ...prevState,
      imageURL: imageUrl || "",
    }));
    if (error) setError("");
  };

  const fetchDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await blogAPI.getBlogById(id);
      const data = res.data;
      setBlog(data.blog);
      setInputs({
        title: data.blog.title || "",
        content: data.blog.content || "",
        imageURL: data.blog.img || "",
      });
      setTags(data.blog.tags || []);
    } catch (err) {
      console.error("Failed to fetch blog details:", err);
      setError("Failed to load blog details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const sendRequest = async () => {
    try {
      setUpdating(true);
      const res = await blogAPI.updateBlog(id, {
        title: inputs.title,
        content: inputs.content,
        img: inputs.imageURL,
        tags: tags,
      });
      return res.data;
    } catch (err) {
      console.error("Failed to update blog:", err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputs.title.trim() || !inputs.content.trim()) {
      setError("Title and content are required");
      return;
    }

    sendRequest()
      .then((data) => {
        navigate("/myBlogs/");
      })
      .catch(() => {
        setError("Failed to update blog. Please try again.");
      });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      {blog ? (
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
                ✏️ Edit Your Story
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 500, mx: 'auto' }}
              >
                Update your blog to keep your content fresh and engaging
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
                    placeholder="Update your blog title..."
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
                    placeholder="Update your blog content..."
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
                    label="Tags"
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
                    onClick={() => navigate('/myBlogs')}
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
                    disabled={updating}
                    sx={{
                      borderRadius: 2,
                      py: 1.5,
                      flex: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    {updating ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} color="inherit" />
                        Updating...
                      </Box>
                    ) : (
                      '💾 Update Blog'
                    )}
                  </Button>
                </Box>
              </Box>
            </form>
          </Paper>
        </Container>
      ) : (
        <Typography textAlign="center" mt={5} variant="h5">
          Blog not found
        </Typography>
      )}
    </Box>
  );
};

export default BlogDetail;
