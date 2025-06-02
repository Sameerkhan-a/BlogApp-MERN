const config = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5001",
  API_URL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api",
  PLACEHOLDER_IMAGE: "https://via.placeholder.com/400x200/cccccc/666666?text=Blog+Image",
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || "development"
};

export default config;
