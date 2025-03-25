import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // Change as needed

interface RegisterUserData {
  email: string;
  role: string;
  password: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const registerUser = async (userData: RegisterUserData) => {
  return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (credentials: LoginCredentials) => {
    console.log("Login user");
    console.log(credentials)
  return axios.post(`${API_URL}/login`, credentials);
};
