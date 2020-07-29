import axios from 'axios';

export default axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost/student/backend/' : 'http://195.158.24.189:8080/student/back/',
    timeout: 30000
});