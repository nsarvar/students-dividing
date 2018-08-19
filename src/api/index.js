import axios from 'axios';

export default axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost/students/' : 'http://176.58.120.4/student/back/',
    timeout: 30000
});