import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // Get the base URL from environment variables
  headers: {
    'Content-Type': 'application/json',
  },
});

// Axios request interceptor to add JWT token to Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');  // Get the token from localStorage

    if (token) {
      // If token exists, attach it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor to handle expired tokens and refreshing them
api.interceptors.response.use(
  (response) => {
    return response; // If the request is successful, return the response
  },
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 Unauthorized error (token expired)
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Avoid infinite loop

      try {
        const refreshToken = localStorage.getItem('refreshToken');  // Get refresh token

        if (refreshToken) {
          // Attempt to refresh the access token with the refresh token
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/refresh-token`, {
            refreshToken,
          });

          const newAccessToken = response.data.accessToken;

          // Store the new access token in localStorage
          localStorage.setItem('accessToken', newAccessToken);

          // Retry the original request with the new access token
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
          return axios(originalRequest);  // Retry the original request with the new token
        } else {
          // If no refresh token is found, log the user out
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';  // Redirect to login page
        }
      } catch (refreshError) {
        // If refresh fails (e.g., invalid refresh token), log the user out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';  // Redirect to login page
      }
    }

    // If the error is not related to token expiration, reject the promise
    return Promise.reject(error);
  }
);

export default api;
