import React, { useEffect, useState } from "react";
import Blog from "./Blog";
import { Typography, CircularProgress, Box, Alert, Container } from "@mui/material";
import { blogAPI } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import SearchFilter from "./SearchFilter";
import Pagination from "./Pagination";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBlogs: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [filters, setFilters] = useState({
    search: '',
    tags: '',
    page: 1,
    limit: 10
  });
  const { user } = useAuth();

  const sendRequest = async (searchFilters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        ...filters,
        ...searchFilters
      };

      const res = await blogAPI.getAllBlogs(params);
      return res.data;
    } catch (err) {
      setError("Failed to fetch blogs");
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sendRequest().then((data) => {
      if (data) {
        setBlogs(data.blogs || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    });
  }, []);

  const handleSearch = (searchFilters) => {
    const newFilters = {
      ...filters,
      ...searchFilters,
      page: 1 // Reset to first page on new search
    };

    setFilters(newFilters);

    sendRequest(newFilters).then((data) => {
      if (data) {
        setBlogs(data.blogs || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    });
  };

  const handleFilter = (filterData) => {
    handleSearch(filterData);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);

    sendRequest(newFilters).then((data) => {
      if (data) {
        setBlogs(data.blogs || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    });
  };

  const handleItemsPerPageChange = (limit) => {
    const newFilters = { ...filters, limit, page: 1 };
    setFilters(newFilters);

    sendRequest(newFilters).then((data) => {
      if (data) {
        setBlogs(data.blogs || []);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    });
  };

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
      {/* Hero Section */}
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
            📚 Discover Amazing Stories
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
            Explore a world of ideas, insights, and inspiration from our community of writers
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <SearchFilter
          onSearch={handleSearch}
          onFilter={handleFilter}
          initialFilters={filters}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Blog Grid */}
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
          {blogs && blogs.length > 0 ? (
            blogs.map((blog, index) => (
              <Blog
                key={blog._id}
                id={blog._id}
                isUser={user && user._id === blog.user._id}
                title={blog.title}
                description={blog.content}
                imageURL={blog.img}
                userName={blog.user?.name}
                date={blog.date}
                tags={blog.tags}
                viewCount={blog.viewCount}
              />
            ))
          ) : (
            !loading && (
              <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 8 }}>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  📝 No blogs found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Try adjusting your search filters or check back later for new content.
                </Typography>
              </Box>
            )
          )}
        </Box>

        {blogs.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalBlogs}
              itemsPerPage={filters.limit}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Blogs;
