const apiKey = 'eacb1a4f5d9142f4aba42832252502';

async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const errorDiv = document.querySelector('.error');
    const weatherInfo = document.querySelector('.weather-info');
    const searchBtn = document.querySelector('.search-btn');

    if (!cityInput.value) {
        showError("Please enter a city name");
        return;
    }

    // Add loading state
    searchBtn.innerHTML = '<i class="fas fa-spinner loading"></i>';
    searchBtn.disabled = true;

    try {
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput.value}&aqi=yes`);
        const data = await response.json();

        if (data.error) {
            showError(data.error.message);
            return;
        }

        errorDiv.style.display = 'none';

        // Reset animation
        weatherInfo.style.animation = 'none';
        weatherInfo.offsetHeight; // Trigger reflow
        weatherInfo.style.animation = 'slideUp 0.5s ease-out';

        // Update the UI with weather data
        document.getElementById('city').textContent = data.location.name;
        document.getElementById('temp').textContent = `${Math.round(data.current.temp_c)}°C`;
        document.getElementById('condition').textContent = data.current.condition.text;
        document.getElementById('humidity').textContent = `${data.current.humidity}%`;
        document.getElementById('feels-like').textContent = `${Math.round(data.current.feelslike_c)}°C`;
        document.getElementById('wind').textContent = `${data.current.wind_kph} km/h`;

        updateWeatherIcon(data.current.condition.text.toLowerCase());

    } catch (error) {
        showError("Failed to fetch weather data");
        console.error('Error:', error);
    } finally {
        // Reset button state
        searchBtn.innerHTML = '<i class="fas fa-search"></i>';
        searchBtn.disabled = false;
    }
}

function showError(message) {
    const errorDiv = document.querySelector('.error');
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i><p>${message}</p>`;
    errorDiv.style.display = 'block';
}

function updateWeatherIcon(condition) {
    const iconElement = document.querySelector('#weather-icon i');
    
    if (condition.includes('rain')) {
        iconElement.className = 'fas fa-cloud-rain';
    } else if (condition.includes('cloud')) {
        iconElement.className = 'fas fa-cloud';
    } else if (condition.includes('sun') || condition.includes('clear')) {
        iconElement.className = 'fas fa-sun';
    } else if (condition.includes('snow')) {
        iconElement.className = 'fas fa-snowflake';
    } else if (condition.includes('thunder')) {
        iconElement.className = 'fas fa-bolt';
    } else if (condition.includes('fog') || condition.includes('mist')) {
        iconElement.className = 'fas fa-smog';
    } else if (condition.includes('wind')) {
        iconElement.className = 'fas fa-wind';
    } else {
        iconElement.className = 'fas fa-cloud';
    }
}

// Allow search when Enter key is pressed
document.getElementById('cityInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        getWeather();
    }
}); 