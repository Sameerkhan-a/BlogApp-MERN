import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../utils/api";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isLoggedIn } = useAuth();
  const { isSignupButtonPressed } = location.state || {};

  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSignup, setIsSignup] = useState(isSignupButtonPressed || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      const from = location.state?.from?.pathname || "/blogs";
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, location.state]);

  useEffect(() => {
    setIsSignup(isSignupButtonPressed || false);
  }, [isSignupButtonPressed]);

  const sendRequest = async (type = "login") => {
    try {
      setLoading(true);
      if (type === "login") {
        const res = await authAPI.login(inputs.email, inputs.password);
        return res.data;
      } else {
        const res = await authAPI.signup(inputs.name, inputs.email, inputs.password);
        return res.data;
      }
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputs.email || !inputs.password || (isSignup && !inputs.name)) {
      setError("Please fill in all required fields");
      return;
    }

    const requestType = isSignup ? "signup" : "login";
    
    sendRequest(requestType)
      .then((data) => {
        // Use the login function from AuthContext
        login(data.user, data.token);

        // Navigate to the intended page or blogs
        const from = location.state?.from?.pathname || "/blogs";
        navigate(from, { replace: true });
      })
      .catch((err) => {
        console.error("Authentication error:", err);
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(
            isSignup
              ? "Failed to create account. Email might already exist."
              : "Invalid email or password"
          );
        }
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      px={2}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: "100%" }}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" textAlign="center" mb={3} color="primary">
            {isSignup ? "Sign Up" : "Login"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isSignup && (
            <TextField
              name="name"
              onChange={handleChange}
              value={inputs.name}
              placeholder="Full Name"
              margin="normal"
              fullWidth
              required
              variant="outlined"
            />
          )}

          <TextField
            name="email"
            onChange={handleChange}
            value={inputs.email}
            type="email"
            placeholder="Email Address"
            margin="normal"
            fullWidth
            required
            variant="outlined"
          />

          <TextField
            name="password"
            onChange={handleChange}
            value={inputs.password}
            type="password"
            placeholder="Password"
            margin="normal"
            fullWidth
            required
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ borderRadius: 2, mt: 3, py: 1.5 }}
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              isSignup ? "Create Account" : "Login"
            )}
          </Button>

          <Button
            onClick={() => setIsSignup(!isSignup)}
            fullWidth
            sx={{ borderRadius: 2, mt: 2 }}
          >
            {isSignup 
              ? "Already have an account? Login" 
              : "Don't have an account? Sign Up"
            }
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
