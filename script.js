// ฟังก์ชันสำหรับเปลี่ยนสถานะไฟ
function setStatus(elementId, status) {
    const element = document.getElementById(elementId);
    element.className = `status ${status}`;
}

// ฟังก์ชันสำหรับแสดงข้อมูลบนหน้าเว็บแทน console
function displayLog(message) {
    const logDiv = document.getElementById('mqtt-data');
    const newLog = document.createElement('p');
    newLog.textContent = message;
    logDiv.appendChild(newLog);
}

// เชื่อมต่อกับ MQTT broker ผ่าน WebSocket
const client = mqtt.connect('wss://mqtt-dashboard.com:8884/mqtt');

// ขณะรอการเชื่อมต่อ แสดงไฟสีเหลือง
setStatus('mqtt-status', 'connecting');

// เมื่อเชื่อมต่อสำเร็จ
client.on('connect', function () {
    setStatus('mqtt-status', 'connected'); // แสดงไฟสีเขียว
    displayLog('Connected to MQTT broker');
    
    // สมัครสมาชิกกับ topic ที่ต้องการรับข้อมูล
    client.subscribe('TestMuang/#', function (err) {
        if (!err) {
            setStatus('subscribe-status', 'connected'); // แสดงไฟสีเขียวเมื่อ subscribe สำเร็จ
            displayLog('Subscribed to topic TestMuang/#');
        } else {
            setStatus('subscribe-status', 'error'); // แสดงไฟสีแดงหากสมัครสมาชิกไม่สำเร็จ
            displayLog('Subscription error: ' + err);
        }
    });
});

// เมื่อการเชื่อมต่อเกิดปัญหา
client.on('error', function () {
    setStatus('mqtt-status', 'error'); // แสดงไฟสีแดง
    displayLog('Error: Could not connect to MQTT broker');
});

// รับข้อความจาก topic ที่สมัครสมาชิก และแสดงผลในหน้าเว็บ
client.on('message', function (topic, message) {
    const data = message.toString();
    
    // กรองเอาเฉพาะตัวเลขจากข้อความ
    const numberData = parseFloat(data);
    
    // แสดงข้อมูลที่เป็นตัวเลขเท่านั้น
    if (!isNaN(numberData)) {
        // ดึงข้อมูลเวลา
        const currentTime = new Date().toLocaleTimeString();

        // อัปเดตส่วนที่แสดงค่า Net Radiation บนหน้าเว็บ
        document.getElementById('net-radiation').textContent = numberData;

        // แสดงข้อมูลบนเว็บพร้อมเวลา
        displayLog(`(${currentTime}) Net Radiation: ${numberData}`);
    }
});
