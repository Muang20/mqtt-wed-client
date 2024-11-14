// กำหนดค่าของ API และ Device ID
const API_BASE_URL = 'https://agrts.co.th/weather/api';
const DEVICE_ID = '4a4a9fac-933c-4c3b-8137-76080f0356cb';
const USERNAME = 'admin';
const PASSWORD = 'admin';

// ฟังก์ชันสำหรับรับ Access Token
async function getAccessToken() {
    const response = await fetch(`${API_BASE_URL}/user/grantAccess?username=${USERNAME}&password=${PASSWORD}`);
    const data = await response.json();
    return data.token;
}

// ฟังก์ชันสำหรับดึงข้อมูลจาก API
async function fetchWeatherData(token) {
    const headers = {
        'Authorization': `Basic ${token}`
    };

    const response = await fetch(`${API_BASE_URL}/log/getLogAll?device_id=${DEVICE_ID}`, { headers });
    const data = await response.json();
    return data;
}

// ฟังก์ชันแสดงข้อมูลในหน้าเว็บ
function updateWeatherUI(weatherData) {
    // ตัวอย่างการดึงข้อมูลล่าสุด
    const latestData = weatherData.logs[0];
    document.getElementById('temperature').innerText = latestData.temperature || 'N/A';
    document.getElementById('humidity').innerText = latestData.humidity || 'N/A';
    document.getElementById('windSpeed').innerText = latestData.wind_speed || 'N/A';
    document.getElementById('lastUpdated').innerText = latestData.timestamp || 'N/A';
}

// ฟังก์ชันหลัก
async function initWeatherData() {
    try {
        const token = await getAccessToken();
        const weatherData = await fetchWeatherData(token);
        updateWeatherUI(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// เรียกฟังก์ชันหลักเมื่อโหลดหน้าเว็บ
initWeatherData();
