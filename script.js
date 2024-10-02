// เชื่อมต่อกับ MQTT broker ผ่าน WebSocket
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

// เมื่อเชื่อมต่อสำเร็จ
client.on('connect', function () {
    console.log('Connected to MQTT broker');

    // เปลี่ยนสีของสถานะการเชื่อมต่อเป็นสีเขียว
    document.getElementById('brokerStatus').classList.remove('disconnected');
    document.getElementById('brokerStatus').classList.add('connected');
    document.getElementById('brokerText').textContent = 'Connected to MQTT broker';

    // สมัครสมาชิกกับ topic ที่ต้องการรับข้อมูล
    client.subscribe('TestMuang/#', function (err) {
        if (!err) {
            console.log('Subscribed to topic TestMuang/#');

            // เปลี่ยนสีของสถานะการ subscribe เป็นสีเขียว
            document.getElementById('topicStatus').classList.remove('disconnected');
            document.getElementById('topicStatus').classList.add('connected');
            document.getElementById('topicText').textContent = 'Subscribed to topic TestMuang/#';
        } else {
            console.log('Failed to subscribe to topic TestMuang/#');

            // เปลี่ยนสีของสถานะการ subscribe เป็นสีแดงเมื่อไม่สำเร็จ
            document.getElementById('topicStatus').classList.remove('connected');
            document.getElementById('topicStatus').classList.add('disconnected');
            document.getElementById('topicText').textContent = 'Failed to subscribe to topic TestMuang/#';
        }
    });
});

// เมื่อการเชื่อมต่อเกิดข้อผิดพลาด
client.on('error', function (error) {
    console.log('Connection error:', error);

    // เปลี่ยนสีของสถานะการเชื่อมต่อเป็นสีแดงเมื่อเกิดข้อผิดพลาด
    document.getElementById('brokerStatus').classList.remove('connected');
    document.getElementById('brokerStatus').classList.add('disconnected');
    document.getElementById('brokerText').textContent = 'Failed to connect to MQTT broker';
});

// รับข้อความจาก topic ที่สมัครสมาชิก และแสดงผลในหน้าเว็บ
client.on('message', function (topic, message) {
    const netRadiation = parseFloat(message.toString());
    const currentTime = new Date().toLocaleTimeString();

    // อัปเดตข้อมูล Net Radiation
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerText = `(${currentTime}) Net Radiation: ${netRadiation}`;
    document.getElementById('messages').appendChild(messageDiv);

    // คำนวณค่า ETo ตามข้อมูลที่ได้รับ
    calculateETo(netRadiation);
});

// ฟังก์ชันคำนวณค่า ETo
function calculateETo(netRadiation) {
    const temperature = parseFloat(document.getElementById('temperature').innerText);
    const humidity = parseFloat(document.getElementById('humidity').innerText);
    const windSpeed = parseFloat(document.getElementById('windSpeed').innerText);

    const e_s = 0.6108 * Math.exp((17.27 * temperature) / (temperature + 237.3));
    const e_a = e_s * (humidity / 100);
    const delta = (4098 * e_s) / Math.pow((temperature + 237.3), 2);
    const gamma = 0.0665;

    const ETo = (0.408 * delta * (netRadiation - 0) + gamma * (900 / (temperature + 273)) * windSpeed * (e_s - e_a)) / (delta + gamma * (1 + 0.34 * windSpeed));
    
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
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// เรียกฟังก์ชันเพื่อดึงข้อมูลสภาพอากาศ
fetchWeatherData('DanChang');
