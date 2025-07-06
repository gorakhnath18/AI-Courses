import axios from 'axios';

const productionUrl = 'https://course-ai-lpq4.onrender.com'; 

const isProduction = import.meta.env.PROD;

const baseURL = isProduction ? productionUrl : 'http://localhost:5000';

 const api = axios.create({
  baseURL: `${baseURL}/api`, 
  withCredentials: true,    
});

export default api;