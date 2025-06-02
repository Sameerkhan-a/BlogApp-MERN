import React, { useEffect, useState } from "react";
import Blog from "./Blog";
import { Typography, CircularProgress, Box, Alert, Container, Button } from "@mui/material";
import { blogAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const UserBlogs = () => {
  const [userBlogs, setUserBlogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const sendRequest = async () => {
    try {
      setLoading(true);
      const res = await blogAPI.getUserBlogs(user._id);
      return res.data;
    } catch (err) {
      console.log(err);
      setError("Failed to fetch your blogs");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      sendRequest().then((data) => {
        if (data && data.user) {
          setUserBlogs(data.user);
        }
      });
    }
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} px={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 4, md: 6 },
          mb: 4,
          borderRadius: { xs: 0, sm: 3 },
          mx: { xs: -2, sm: 0 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            📝 My Blog Collection
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: "center",
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto'
            }}
          >
            {userBlogs?.blogs?.length > 0
              ? `You have ${userBlogs.blogs.length} published ${userBlogs.blogs.length === 1 ? 'blog' : 'blogs'}`
              : 'Start sharing your thoughts with the world'
            }
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        {userBlogs && userBlogs.blogs && userBlogs.blogs.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)"
              },
              gap: 3,
              mb: 4
            }}
          >
            {userBlogs.blogs.map((blog) => (
              <Blog
                key={blog._id}
                id={blog._id}
                isUser={true}
                title={blog.title}
                description={blog.content || blog.desc}
                imageURL={blog.img}
                userName={userBlogs.name}
                date={blog.date}
                tags={blog.tags || []}
                viewCount={blog.viewCount || 0}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              ✍️ No blogs yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Ready to share your first story? Start writing and inspire others!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/blogs/add')}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
            >
              🚀 Write Your First Blog
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default UserBlogs;
