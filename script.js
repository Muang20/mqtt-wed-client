// เชื่อมต่อกับ MQTT broker ผ่าน WebSocket ที่ใช้ SSL (wss)
const client = mqtt.connect('wss://mqtt-dashboard.com:8884/mqtt');

// เมื่อเชื่อมต่อสำเร็จ
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    
    // สมัครสมาชิกกับ topic ที่ต้องการรับข้อมูล
    client.subscribe('TestMuang/#', function (err) {
        if (!err) {
            console.log('Subscribed to topic TestMuang/#');
        } else {
            console.log('Subscription error:', err);
        }
    });
});

// รับข้อความจาก topic ที่สมัครสมาชิก และแสดงผลในหน้าเว็บ
client.on('message', function (topic, message) {
    const data = message.toString();
    console.log(`Received message: ${data} from topic: ${topic}`);

    // แสดงข้อมูลในหน้าเว็บ
    const mqttDataDiv = document.getElementById('mqtt-data');
    const newMessage = document.createElement('p');
    newMessage.textContent = `Topic: ${topic}, Message: ${data}`;
    mqttDataDiv.appendChild(newMessage);
});
