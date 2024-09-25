// Update the broker status
const brokerStatusDiv = document.getElementById('brokerStatus');
const brokerText = document.getElementById('brokerText');

// Update the topic subscription status
const topicStatusDiv = document.getElementById('topicStatus');
const topicText = document.getElementById('topicText');

// Update Net Radiation
const netRadiationSpan = document.getElementById('netRadiation');

// Display messages
const messagesDiv = document.getElementById('messages');

// Function to update connection status
function updateConnectionStatus(connected) {
    if (connected) {
        brokerStatusDiv.className = 'status-indicator connected';
        brokerText.textContent = 'Connected to MQTT broker';
    } else {
        brokerStatusDiv.className = 'status-indicator disconnected';
        brokerText.textContent = 'Disconnected from MQTT broker';
    }
}

// Function to update topic subscription status
function updateTopicStatus(subscribed) {
    if (subscribed) {
        topicStatusDiv.className = 'status-indicator connected';
        topicText.textContent = 'Subscribed to topic TestMuang/#';
    } else {
        topicStatusDiv.className = 'status-indicator disconnected';
        topicText.textContent = 'Not subscribed to topic';
    }
}

// Function to display new Net Radiation data
function displayNetRadiation(data, time) {
    netRadiationSpan.textContent = data;
    
    const p = document.createElement('p');
    p.className = 'message';
    p.innerText = `(${time}) Net Radiation: ${data}`;
    messagesDiv.appendChild(p);
}

// Example usage with MQTT connection
const client = mqtt.connect('wss://mqtt-broker-url');

client.on('connect', function () {
    updateConnectionStatus(true);
    client.subscribe('TestMuang/#', function (err) {
        if (!err) {
            updateTopicStatus(true);
        }
    });
});

client.on('message', function (topic, message) {
    const data = message.toString();
    const time = new Date().toLocaleTimeString();
    displayNetRadiation(data, time);
});
