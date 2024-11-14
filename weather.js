// กำหนดค่าพื้นฐานสำหรับ API
const API_BASE_URL = 'https://agrts.co.th/weather/api';
const USERNAME = 'admin'; // Username
const PASSWORD = 'admin'; // Password
const DEVICE_ID = '4a4a9fac-933c-4c3b-8137-76080f0356cb'; // Device ID

// ฟังก์ชันขอ User Token
async function getUserToken() {
    const url = `${API_BASE_URL}/user/grantAccess?username=${USERNAME}&password=${PASSWORD}`;
    const response = await fetch(url, { method: 'GET' });
    if (response.status === 200) {
        const data = await response.json();
        return data.token;
    } else {
        throw new Error(`Error getting User Token: ${response.status}`);
    }
}

// ฟังก์ชันขอ Device Token
async function getDeviceToken(userToken) {
    const url = `${API_BASE_URL}/device/grantAccess?device_id=${DEVICE_ID}`;
    const headers = { Authorization: `Basic ${userToken}` };
    const response = await fetch(url, { method: 'GET', headers });
    if (response.status === 200) {
        const data = await response.json();
        return data.token;
    } else {
        throw new Error(`Error getting Device Token: ${response.status}`);
    }
}

// ฟังก์ชันดึงข้อมูลล่าสุดของอุปกรณ์
async function fetchLatestData(deviceToken) {
    const url = `${API_BASE_URL}/log/getLatest?device_id=${DEVICE_ID}`;
    const headers = { Authorization: `Basic ${deviceToken}` };
    const response = await fetch(url, { method: 'GET', headers });
    if (response.status === 200) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(`Error fetching latest data: ${response.status}`);
    }
}

// ฟังก์ชันแสดงข้อมูลในหน้าเว็บ
function updateWeatherUI(weatherData) {
    document.getElementById('temperature').innerText = weatherData.temperature || 'N/A';
    document.getElementById('humidity').innerText = weatherData.humidity || 'N/A';
    document.getElementById('windSpeed').innerText = weatherData.wind_speed || 'N/A';
    document.getElementById('lastUpdated').innerText = weatherData.timestamp || 'N/A';
}

// ฟังก์ชันหลัก (เรียกใช้ทุกขั้นตอน)
async function initWeatherData() {
    try {
        // ขอ User Token
        const userToken = await getUserToken();
        console.log('User Token:', userToken);

        // ขอ Device Token
        const deviceToken = await getDeviceToken(userToken);
        console.log('Device Token:', deviceToken);

        // ดึงข้อมูลล่าสุดของอุปกรณ์
        const latestData = await fetchLatestData(deviceToken);
        console.log('Latest Data:', latestData);

        // อัปเดต UI
        updateWeatherUI(latestData);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// เรียกฟังก์ชันหลักเมื่อโหลดหน้าเว็บ
initWeatherData();
