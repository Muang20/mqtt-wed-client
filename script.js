const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

client.on('connect', function () {
    client.subscribe('TestMuang/#', function (err) {
        if (!err) {
            console.log('Subscribed to topic TestMuang/#');
        }
    });
});

client.on('message', function (topic, message) {
    const netRadiation = parseFloat(message.toString());
    const currentTime = new Date().toLocaleTimeString();

    document.getElementById('netRadiation').innerText = netRadiation;

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.innerText = `(${currentTime}) Net Radiation: ${netRadiation}`;
    document.getElementById('messages').appendChild(messageDiv);

    calculateETo(netRadiation);
});

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

fetchWeatherData('Bangkok');
