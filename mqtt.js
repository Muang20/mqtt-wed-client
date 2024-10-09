// ฟังก์ชันโหลดข้อมูลจาก LocalStorage และแสดงในตาราง
function loadTableData() {
    const storedData = JSON.parse(localStorage.getItem('mqttTableData')) || [];

    const tableBody = document.querySelector('#mqttTable tbody');
    tableBody.innerHTML = '';  // ล้างข้อมูลเก่าก่อน

    storedData.forEach(row => {
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).innerText = row.time;
        newRow.insertCell(1).innerText = row.netRadiation;
        newRow.insertCell(2).innerText = row.etoValue;
    });
}

// ฟังก์ชันเก็บข้อมูลใน LocalStorage
function storeTableData(time, netRadiation, etoValue) {
    const storedData = JSON.parse(localStorage.getItem('mqttTableData')) || [];

    storedData.push({ time, netRadiation, etoValue });

    localStorage.setItem('mqttTableData', JSON.stringify(storedData));
}

// ฟังก์ชันดึงข้อมูลจาก LocalStorage เมื่อโหลดหน้าเว็บ
window.onload = function() {
    loadTableData();
};

// ฟังก์ชันรีเซ็ตข้อมูล
document.getElementById('resetButton').addEventListener('click', function() {
    localStorage.removeItem('mqttTableData');
    loadTableData();  // ล้างข้อมูลในตาราง
});

// ฟังก์ชันสำหรับดาวน์โหลดข้อมูลเป็น Excel
document.getElementById('downloadButton').addEventListener('click', function() {
    const storedData = JSON.parse(localStorage.getItem('mqttTableData')) || [];
    
    const worksheet = XLSX.utils.json_to_sheet(storedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MQTT Data');

    XLSX.writeFile(workbook, 'mqtt_data.xlsx');
});

// ดึงข้อมูลจาก LocalStorage และแสดงในหน้า mqtt.html
const storedData = JSON.parse(localStorage.getItem('mqttData'));

if (storedData) {
    const { time, netRadiation, etoValue } = storedData;
    
    // เพิ่มข้อมูลใหม่ในตารางและเก็บลงใน LocalStorage
    storeTableData(time, netRadiation, etoValue);

    loadTableData();
} else {
    console.log('No data found in LocalStorage');
}
