import axios from 'axios';

//const url = 'https://thewebapi-production.up.railway.app/api';
const url = 'http://localhost:3001/api';

const api = axios.create({
	baseURL: url,
	withCredentials: true,
});

export default api;
