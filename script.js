const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

// เมื่อเชื่อมต่อสำเร็จ
client.on('connect', function () {
    document.getElementById('brokerStatus').classList.remove('disconnected');
    document.getElementById('brokerStatus').classList.add('connected');
    document.getElementById('brokerText').innerText = 'Connected to MQTT broker';

    client.subscribe('TestMuang/#', function (err) {
        if (!err) {
            document.getElementById('topicStatus').classList.remove('disconnected');
            document.getElementById('topicStatus').classList.add('connected');
            document.getElementById('topicText').innerText = 'Subscribed to topic TestMuang/#';
        } else {
            document.getElementById('topicText').innerText = 'Failed to subscribe to topic';
            document.getElementById('topicStatus').classList.add('disconnected');
        }
    });
});

// เมื่อมีข้อความเข้ามา
client.on('message', function (topic, message) {
    const netRadiation = message.toString();
    const currentTime = new Date().toLocaleTimeString();

    document.getElementById('netRadiation').innerText = netRadiation;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerText = `(${currentTime}) Net Radiation: ${netRadiation}`;
    document.getElementById('messages').appendChild(messageDiv);
});

// ตรวจจับการเชื่อมต่อหลุด
client.on('offline', function () {
    document.getElementById('brokerStatus').classList.remove('connected');
    document.getElementById('brokerStatus').classList.add('disconnected');
    document.getElementById('brokerText').innerText = 'Disconnected from MQTT broker';
});
