import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});


// REQUEST INTERCEPTOR
API.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("adminToken") ||
      sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// RESPONSE INTERCEPTOR
API.interceptors.response.use(

  (response) => response,

  (error) => {

    // normal user deleted OR invalid token
    if (
      error.response?.status === 401 ||
      error.response?.status === 404
    ) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;
