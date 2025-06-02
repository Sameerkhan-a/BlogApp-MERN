import axios from 'axios';
import config from '../config';

// Create axios instance
const api = axios.create({
  baseURL: config.BASE_URL,
  timeout: 10000,
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email, password) =>
    api.post('/api/users/login', { email, password }),

  signup: (name, email, password) =>
    api.post('/api/users/signup', { name, email, password }),

  getAllUsers: () =>
    api.get('/api/users')
};

// Blog API calls
export const blogAPI = {
  getAllBlogs: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.search) queryParams.append('search', params.search);
    if (params.tags) queryParams.append('tags', params.tags);
    if (params.author) queryParams.append('author', params.author);

    const queryString = queryParams.toString();
    return api.get(`/api/blogs${queryString ? `?${queryString}` : ''}`);
  },

  getBlogById: (id) =>
    api.get(`/api/blogs/${id}`),

  createBlog: (blogData) =>
    api.post('/api/blogs/add', blogData),

  updateBlog: (id, blogData) =>
    api.put(`/api/blogs/update/${id}`, blogData),

  deleteBlog: (id) =>
    api.delete(`/api/blogs/${id}`),

  getUserBlogs: (userId) =>
    api.get(`/api/blogs/user/${userId}`),

  getAllTags: () =>
    api.get('/api/blogs/tags'),

  getBlogStats: () =>
    api.get('/api/blogs/stats')
};

// Comment API calls
export const commentAPI = {
  getCommentsByBlogId: (blogId, params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const queryString = queryParams.toString();
    return api.get(`/api/comments/blog/${blogId}${queryString ? `?${queryString}` : ''}`);
  },

  addComment: (blogId, content) =>
    api.post(`/api/comments/blog/${blogId}`, { content }),

  updateComment: (commentId, content) =>
    api.put(`/api/comments/${commentId}`, { content }),

  deleteComment: (commentId) =>
    api.delete(`/api/comments/${commentId}`),

  getCommentStats: (blogId) =>
    api.get(`/api/comments/blog/${blogId}/stats`)
};

export default api;
