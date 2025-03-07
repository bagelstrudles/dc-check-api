import axios from 'axios';

const API_URL = 'http://64.23.235.7:3000/api';

async function testAPI() {
  try {
    // Test API connection
    console.log('Testing API connection...');
    const response = await axios.get(`${API_URL}/health`);
    console.log('API Status:', response.data);
  } catch (error) {
    console.error('API Connection Error:', error.message);
    process.exit(1);
  }
}

async function createAdmin() {
  try {
    console.log('Creating admin user...');
    const response = await axios.post(`${API_URL}/auth/register`, {
      username: 'admin',
      password: process.env.ADMIN_PASSWORD || 'your_secure_password',
      email: 'admin@example.com',
      role: 'admin'
    });
    
    console.log('Admin created successfully');
    console.log('Logging in...');
    
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      username: 'admin',
      password: process.env.ADMIN_PASSWORD || 'your_secure_password'
    });
    
    console.log('Login successful');
    console.log('Your admin token:', loginResponse.data.token);
    
    // Create .env file with token
    const fs = require('fs');
    const envContent = `NODE_ENV=production
ADMIN_TOKEN=${loginResponse.data.token}
VITE_API_URL=${API_URL}`;
    
    fs.writeFileSync('/root/scripts/.env', envContent);
    console.log('Token saved to /root/scripts/.env');
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Run the tests
testAPI()
  .then(() => createAdmin())
  .catch(console.error);