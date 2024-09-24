// เชื่อมต่อกับ MQTT broker ผ่าน WebSocket
const client = mqtt.connect('wss://broker.hivemq.com:8000/mqtt');

// เมื่อเชื่อมต่อสำเร็จ
client.on('connect', function () {
    console.log('Connected to MQTT broker');
    
    // สมัครสมาชิกกับ topic ที่ต้องการรับข้อมูล
    client.subscribe('TestMuang/#', function (err) {
        if (!err) {
            console.log('Subscribed to topic TestMuang/#');
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
