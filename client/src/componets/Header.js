import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  Button,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AddIcon from "@mui/icons-material/Add";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";

const Header = ({ isDark, toggleTheme }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isLoggedIn, logout, user } = useAuth();

  const [value, setValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTab = localStorage.getItem("selectedTab");

    if (savedTab !== null) {
      setValue(parseInt(savedTab, 10));
    }
  }, []);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/blogs/add")) {
      setValue(2);
    } else if (path.startsWith("/myBlogs")) {
      setValue(1);
    } else if (path.startsWith("/blogs") || path === "/") {
      setValue(0);
    }
  }, [location.pathname]);

  const handleTabChange = (e, newValue) => {
    setValue(newValue);
    localStorage.setItem("selectedTab", newValue); 
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { isSignupButtonPressed: false } });
  };

  const handleSignupClick = () => {
    navigate("/login", { state: { isSignupButtonPressed: true } });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setAnchorEl(null);
    setMobileMenuAnchor(null);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const navigateAndClose = (path) => {
    navigate(path);
    handleMenuClose();
    handleMobileMenuClose();
  };

  const getBackgroundGradient = () => {
    return isDark
      ? 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: getBackgroundGradient(),
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        {/* Logo */}
        <Typography
          variant={isMobile ? "h6" : "h5"}
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
            flexGrow: isMobile ? 1 : 0,
            mr: { xs: 0, md: 4 }
          }}
        >
          📝 BlogApp
        </Typography>

        {/* Desktop Navigation */}
        {isLoggedIn && !isMobile && (
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Tabs
              textColor="inherit"
              value={value}
              onChange={handleTabChange}
              indicatorColor="secondary"
              sx={{
                '& .MuiTab-root': {
                  minWidth: 'auto',
                  px: 3,
                  fontWeight: 500,
                }
              }}
            >
              <Tab
                LinkComponent={Link}
                to="/blogs"
                label="All Blogs"
                icon={<HomeIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
              />
              <Tab
                LinkComponent={Link}
                to="/myBlogs"
                label="My Blogs"
                icon={<PersonIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
              />
              <Tab
                LinkComponent={Link}
                to="/blogs/add"
                label="Write"
                icon={<AddIcon sx={{ fontSize: 20 }} />}
                iconPosition="start"
              />
            </Tabs>
          </Box>
        )}

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {/* Theme toggle */}
          <IconButton
            onClick={toggleTheme}
            sx={{ color: 'white' }}
            size="small"
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {!isLoggedIn ? (
            /* Not logged in - show login/signup */
            !isMobile ? (
              <>
                <Button
                  onClick={handleLoginClick}
                  sx={{
                    color: "white",
                    borderRadius: 2,
                    px: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  onClick={handleSignupClick}
                  variant="contained"
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
            )
          ) : (
            /* Logged in */
            !isMobile ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ color: 'white', p: 1 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      fontSize: '0.9rem'
                    }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <IconButton
                onClick={handleMobileMenuOpen}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
            )
          )}
        </Box>

        {/* Desktop User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
            }
          }}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              {user?.name}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => navigateAndClose('/blogs')}>
            <HomeIcon sx={{ mr: 1, fontSize: 20 }} />
            All Blogs
          </MenuItem>
          <MenuItem onClick={() => navigateAndClose('/myBlogs')}>
            <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
            My Blogs
          </MenuItem>
          <MenuItem onClick={() => navigateAndClose('/blogs/add')}>
            <AddIcon sx={{ mr: 1, fontSize: 20 }} />
            Write Blog
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            Logout
          </MenuItem>
        </Menu>

        {/* Mobile Menu */}
        <Menu
          anchorEl={mobileMenuAnchor}
          open={Boolean(mobileMenuAnchor)}
          onClose={handleMobileMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              minWidth: 200,
              borderRadius: 2,
            }
          }}
        >
          {!isLoggedIn ? (
            [
              <MenuItem key="login" onClick={handleLoginClick}>
                Login
              </MenuItem>,
              <MenuItem key="signup" onClick={handleSignupClick}>
                Sign Up
              </MenuItem>
            ]
          ) : (
            [
              <MenuItem key="user" disabled>
                <Typography variant="body2" color="text.secondary">
                  {user?.name}
                </Typography>
              </MenuItem>,
              <Divider key="divider1" />,
              <MenuItem key="all" onClick={() => navigateAndClose('/blogs')}>
                <HomeIcon sx={{ mr: 1, fontSize: 20 }} />
                All Blogs
              </MenuItem>,
              <MenuItem key="my" onClick={() => navigateAndClose('/myBlogs')}>
                <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                My Blogs
              </MenuItem>,
              <MenuItem key="add" onClick={() => navigateAndClose('/blogs/add')}>
                <AddIcon sx={{ mr: 1, fontSize: 20 }} />
                Write Blog
              </MenuItem>,
              <Divider key="divider2" />,
              <MenuItem key="logout" onClick={handleLogout} sx={{ color: 'error.main' }}>
                Logout
              </MenuItem>
            ]
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
