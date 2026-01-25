const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
const ORDER_ID = process.argv[2];
const NEW_STATUS = process.argv[3] || 'on_the_way';
const TOKEN = process.argv[4];

if (!ORDER_ID || !TOKEN) {
    console.log('Usage: node test-status.js <orderId> <status> <token>');
    process.exit(1);
}

const updateStatus = async () => {
    try {
        const res = await axios.patch(`${BASE_URL}/orders/${ORDER_ID}/status`,
            { status: NEW_STATUS },
            { headers: { Authorization: `Bearer ${TOKEN}` } }
        );
        console.log('Status updated successfully:', res.data.status);
    } catch (error) {
        console.error('Error updating status:', error.response?.data?.message || error.message);
    }
};

updateStatus();
