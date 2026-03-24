const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const test = async () => {
    try {
        console.log('--- JWT Banking API Verification ---');

        // 1. Register
        console.log('1. Registering user...');
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'John Doe',
            email: `john${Math.floor(Math.random() * 1000)}@example.com`,
            password: 'password123'
        });
        console.log('Registration Success:', regRes.data.success);
        let accessToken = regRes.data.accessToken;
        let refreshToken = regRes.data.refreshToken;

        // 2. Access Protected Route (Account Details)
        console.log('2. Accessing Protected Route (Account Details)...');
        const accRes = await axios.get(`${API_URL}/bank/account`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Account Data:', accRes.data.data);

        // 3. Deposit Money
        console.log('3. Depositing $500...');
        const depRes = await axios.put(`${API_URL}/bank/deposit`, { amount: 500 }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('New Balance:', depRes.data.data.balance);

        // 4. Test Refresh Token
        console.log('4. Testing Refresh Token...');
        const refRes = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        console.log('Token Refresh Success:', refRes.data.success);
        accessToken = refRes.data.accessToken;

        // 5. Access with new token
        console.log('5. Accessing with new token...');
        const finalAccRes = await axios.get(`${API_URL}/bank/account`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log('Final Balance Check:', finalAccRes.data.data.balance);

        console.log('--- Verification Complete ---');
    } catch (err) {
        console.error('Test Failed:', err.response ? err.response.data : err.message);
    }
};

// Note: Ensure the server and MongoDB are running before executing this.
// test();

console.log('Verification script created. run `node src/test-auth.js` after starting the server.');
