import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api' // Backend context server location
});

export default axiosInstance;