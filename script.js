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
