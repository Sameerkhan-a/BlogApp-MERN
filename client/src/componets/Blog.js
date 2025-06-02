import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
  Chip,
  Stack,
  Divider
} from "@mui/material";
import React from "react";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useStyles } from "./utils";
import { blogAPI } from "../utils/api";

const Blog = ({
  title,
  description,
  imageURL,
  userName,
  isUser,
  id,
  date,
  tags = [],
  viewCount = 0
}) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/myBlogs/${id}`);
  };

  const deleteRequest = async () => {
    try {
      const res = await blogAPI.deleteBlog(id);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  const truncateText = (text, maxLength = 200) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      deleteRequest()
        .then(() => {
          navigate("/blogs");
          window.location.reload(); // Refresh to update the list
        })
        .catch((err) => {
          alert("Failed to delete blog");
        });
    }
  };

  return (
    <Card
      sx={{
        width: "100%",
        mb: 3,
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
          borderColor: 'primary.main',
        },
      }}
    >
      {isUser && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            display: 'flex',
            gap: 0.5,
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
      
      <CardHeader
        avatar={
          <Avatar
            className={classes.font}
            sx={{ bgcolor: "primary.main" }}
            aria-label="user"
          >
            {userName ? userName.charAt(0).toUpperCase() : "U"}
          </Avatar>
        }
        title={
          <Typography
            variant="h6"
            className={classes.font}
            sx={{
              fontWeight: 'bold',
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline'
              }
            }}
            onClick={() => navigate(`/blogs/${id}`)}
          >
            {title}
          </Typography>
        }
        subheader={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              By {userName} • {formatDate(date)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {viewCount}
              </Typography>
            </Box>
          </Box>
        }
      />

      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={imageURL || 'https://via.placeholder.com/400x200?text=No+Image'}
          alt={title}
          sx={{
            objectFit: "cover",
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
          onClick={() => navigate(`/blogs/${id}`)}
        />
      </Box>

      <CardContent>
        <Typography
          className={classes.font}
          variant="body1"
          color="text.primary"
          sx={{ mb: 2, lineHeight: 1.6 }}
        >
          {truncateText(description)}
        </Typography>

        {tags && tags.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {tags.slice(0, 4).map((tag, index) => (
                <Chip
                  key={index}
                  label={`#${tag}`}
                  size="small"
                  variant="filled"
                  sx={{
                    fontSize: '0.75rem',
                    height: '28px',
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    }
                  }}
                />
              ))}
              {tags.length > 4 && (
                <Chip
                  label={`+${tags.length - 4}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.75rem',
                    height: '28px',
                    color: 'text.secondary'
                  }}
                />
              )}
            </Stack>
          </Box>
        )}

        {/* Read More Button */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate(`/blogs/${id}`)}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline'
              }
            }}
          >
            Read More →
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Blog;
