// เชื่อมต่อกับ MQTT broker สำหรับทั้งสองหน้า (index และ ETo)
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

// เชื่อมต่อสำเร็จ
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    document.getElementById('brokerStatus').classList.remove('disconnected');
    document.getElementById('brokerStatus').classList.add('connected');
    document.getElementById('brokerText').innerText = 'Connected to MQTT broker';

    // ตรวจสอบว่าหน้าเว็บไหนกำลังทำงาน
    if (document.title === 'MQTT Web Client') {
        // สมัครสมาชิกสำหรับหน้า index.html
        client.subscribe('TestMuang/#', function (err) {
            if (!err) {
                console.log('Subscribed to topic TestMuang/#');
                document.getElementById('topicStatus').classList.remove('disconnected');
                document.getElementById('topicStatus').classList.add('connected');
                document.getElementById('topicText').innerText = 'Subscribed to topic TestMuang/#';
            }
        });
    } else if (document.title === 'ค่า ETo') {
        // สมัครสมาชิกสำหรับหน้า eto.html
        client.subscribe('EToData/#', function (err) {
            if (!err) {
                console.log('Subscribed to ETo data');
                document.getElementById('topicStatus').classList.remove('disconnected');
                document.getElementById('topicStatus').classList.add('connected');
                document.getElementById('topicText').innerText = 'Subscribed to ETo data';
            }
        });
    }
});

// ข้อผิดพลาดในการเชื่อมต่อ
client.on('error', function (error) {
    console.log('Connection error: ', error);
    document.getElementById('brokerStatus').classList.remove('connected');
    document.getElementById('brokerStatus').classList.add('disconnected');
    document.getElementById('brokerText').innerText = 'Failed to connect to MQTT broker';
});

// รับข้อความจาก MQTT
client.on('message', function (topic, message) {
    const data = message.toString();
    const currentTime = new Date().toLocaleTimeString();
    console.log(`Received message: ${data} from topic: ${topic}`);

    // ตรวจสอบว่าหน้าไหนกำลังทำงาน
    if (document.title === 'MQTT Web Client') {
        const mqttDataDiv = document.getElementById('mqtt-data');
        const newMessage = document.createElement('p');
        newMessage.textContent = `Topic: ${topic}, Message: ${data}`;
        mqttDataDiv.appendChild(newMessage);
    } else if (document.title === 'ค่า ETo') {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerText = `(${currentTime}) Net Radiation: ${data}`;
        document.getElementById('messages').appendChild(messageDiv);

        // เรียกใช้การคำนวณ ETo
        calculateETo(data);
    }
});

// ฟังก์ชันคำนวณค่า ETo (ใช้ใน eto.html)
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

// ฟังก์ชันดึงข้อมูลสภาพอากาศจาก API (ใช้ใน eto.html)
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

// เรียกฟังก์ชันดึงข้อมูลสภาพอากาศ
fetchWeatherData('Bangkok');
