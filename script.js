// เชื่อมต่อกับ MQTT broker ผ่าน WebSocket
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

// ตัวแปรสำหรับเก็บค่าที่ได้จาก MQTT
let netRadiation = null;

// เมื่อเชื่อมต่อสำเร็จ
client.on('connect', function () {
    console.log('Connected to MQTT broker');

    // สมัครสมาชิกกับ topic ที่ต้องการรับข้อมูล
    client.subscribe('TestMuang/#', function (err) {
        if (!err) {
            console.log('Subscribed to topic TestMuang/#');
        } else {
            console.log('Failed to subscribe to topic TestMuang/#');
        }
    });
});

// รับข้อความจาก topic ที่สมัครสมาชิก และแสดงผลในหน้าเว็บ
client.on('message', function (topic, message) {
    netRadiation = parseFloat(message.toString());  // ดึงค่าจาก MQTT
    const currentTime = new Date().toLocaleTimeString();

    // อัปเดตข้อมูล Net Radiation ที่ได้จาก MQTT
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerText = `(${currentTime}) Net Radiation: ${netRadiation}`;
    document.getElementById('messages').appendChild(messageDiv);

    // ถ้าได้ค่าจาก MQTT แล้ว ก็ให้คำนวณค่า ETo ทันที
    if (netRadiation !== null) {
        calculateETo(netRadiation);
    }
});

// ฟังก์ชันคำนวณค่า ETo
function calculateETo(netRadiation) {
    const temperature = parseFloat(document.getElementById('temperature').innerText);
    const humidity = parseFloat(document.getElementById('humidity').innerText);
    const windSpeed = parseFloat(document.getElementById('windSpeed').innerText);

    // คำนวณค่า e_s และ e_a จากอุณหภูมิและความชื้น
    const e_s = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
    const e_a = e_s * (humidity / 100);
    const delta = (4098 * e_s) / Math.pow((temperature + 237.3), 2);
    const gamma = 0.0665;

    // คำนวณค่า ETo จาก Net Radiation และข้อมูลอากาศ
    const ETo = (0.408 * delta * (netRadiation - 0) + gamma * (900 / (temperature + 273)) * windSpeed * (e_s - e_a)) / (delta + gamma * (1 + 0.34 * windSpeed));

    // แสดงผลค่า ETo บนหน้าเว็บ
    document.getElementById('etoValue').innerText = ETo.toFixed(2);
}

// ฟังก์ชันดึงข้อมูลสภาพอากาศจาก OpenWeather API
function fetchWeatherData(city) {
    const apiKey = '39994448216c7e3e51aa74516c14949f';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('cityName').innerText = data.name;
            document.getElementById('temperature').innerText = data.main.temp.toFixed(2);
            document.getElementById('humidity').innerText = data.main.humidity;
            document.getElementById('windSpeed').innerText = (data.wind.speed).toFixed(2);
            document.getElementById('weatherDescription').innerText = data.weather[0].description;

            // คำนวณค่า ETo เมื่อข้อมูลอากาศพร้อม
            if (netRadiation !== null) {
                calculateETo(netRadiation);
            }
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// เรียกฟังก์ชันเพื่อดึงข้อมูลสภาพอากาศ
fetchWeatherData('Danchang');
