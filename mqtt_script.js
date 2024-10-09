// โหลดข้อมูลจาก LocalStorage เมื่อหน้าเว็บถูกโหลด
function loadDataFromLocalStorage() {
    const savedData = JSON.parse(localStorage.getItem('etoData')) || [];
    const tableBody = document.getElementById('mqttTable').getElementsByTagName('tbody')[0];

    savedData.forEach(data => {
        const newRow = tableBody.insertRow();

        const timeCell = newRow.insertCell(0);
        const mqttCell = newRow.insertCell(1);
        const etoCell = newRow.insertCell(2);

        timeCell.textContent = data.time;
        mqttCell.textContent = data.mqttValue;
        etoCell.textContent = data.etoValue;
    });
}

// เรียกใช้งานการโหลดข้อมูลเมื่อหน้าเว็บถูกโหลด
window.onload = loadDataFromLocalStorage;
