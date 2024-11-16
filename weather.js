// กำหนดค่าพื้นฐานสำหรับ API
const API_BASE_URL = 'https://agrts.co.th/weather/api';
const USERNAME = 'your_username'; // ควรเก็บไว้ในที่ปลอดภัย
const PASSWORD = 'your_password'; // ควรเก็บไว้ในที่ปลอดภัย
const DEVICE_ID = 'your_device_id'; // ควรเก็บไว้ในที่ปลอดภัย

// ฟังก์ชันเข้ารหัส Base64 สำหรับ Basic Auth
function encodeBasicAuth(username, password) {
    return btoa(`${username}:${password}`);
}

// ฟังก์ชันขอ User Token
async function getUserToken() {
    const url = `${API_BASE_URL}/user/grantAccess`;
    const headers = {
        'Content-Type': 'application/json',
        // เข้ารหัสชื่อผู้ใช้และรหัสผ่านสำหรับ Basic Auth
        'Authorization': 'Basic ' + encodeBasicAuth(USERNAME, PASSWORD)
    };
    const response = await fetch(url, { method: 'GET', headers });
    if (response.ok) {
        const data = await response.json();
        return data.token;
    } else {
        throw new Error(`Error getting User Token: ${response.status}`);
    }
}

// ฟังก์ชันขอ Device Token
async function getDeviceToken(userToken) {
    const url = `${API_BASE_URL}/device/grantAccess?device_id=${DEVICE_ID}`;
    const headers = {
        'Authorization': 'Basic ' + userToken // ใช้ Token ตรง ๆ
    };
    const response = await fetch(url, { method: 'GET', headers });
    if (response.ok) {
        const data = await response.json();
        return data.token;
    } else {
        throw new Error(`Error getting Device Token: ${response.status}`);
    }
}

// ฟังก์ชันดึงข้อมูลล่าสุด
async function fetchLatestData(deviceToken) {
    const url = `${API_BASE_URL}/log/getLatest?device_id=${DEVICE_ID}`;
    const headers = {
        'Authorization': 'Basic ' + deviceToken // ใช้ Token ตรง ๆ
    };
    const response = await fetch(url, { method: 'GET', headers });
    if (response.ok) {
        const data = await response.json();
        return data;
    } else {
        throw new Error(`Error fetching latest data: ${response.status}`);
    }
}

// อัปเดตข้อมูลในหน้าเว็บ
function updateWeatherUI(weatherData) {
    document.getElementById('temperature').innerText = weatherData.temperature || 'N/A';
    document.getElementById('humidity').innerText = weatherData.humidity || 'N/A';
    document.getElementById('windSpeed').innerText = weatherData.wind_speed || 'N/A';
    document.getElementById('lastUpdated').innerText = weatherData.timestamp || 'N/A';
}

// ฟังก์ชันหลัก
async function initWeatherData() {
    try {
        const userToken = await getUserToken();
        const deviceToken = await getDeviceToken(userToken);
        const latestData = await fetchLatestData(deviceToken);
        updateWeatherUI(latestData);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// เรียกใช้ฟังก์ชันหลัก
initWeatherData();
