/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: controllers/weatherController.js - Weather Forecast controller
 */

const axios = require("axios");

// Static mock database for common cities in case of missing or expired API keys
const mockWeatherDatabase = {
    london: { city: "London", temperature: 15.4, condition: "Cloudy", humidity: 82 },
    newyork: { city: "New York", temperature: 22.1, condition: "Sunny", humidity: 55 },
    tokyo: { city: "Tokyo", temperature: 18.9, condition: "Rainy", humidity: 90 },
    lahore: { city: "Lahore", temperature: 36.5, condition: "Sunny", humidity: 40 },
    karachi: { city: "Karachi", temperature: 32.0, condition: "Humid", humidity: 75 },
    islamabad: { city: "Islamabad", temperature: 28.5, condition: "Clear", humidity: 48 }
};

/**
 * GET /api/weather/:city
 * Retrieves weather metrics for a specified city
 */
exports.getWeather = async (req, res) => {
    const { city } = req.params;

    if (!city || city.trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Bad Request: City parameter is required."
        });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    // Automatically switch to mock mode if API key is not supplied or is standard placeholder
    const isMockMode = !apiKey || apiKey === "your_openweather_api_key_here";

    if (isMockMode) {
        return getMockWeather(city, res, "Mock Data Mode (No API Key Configured)");
    }

    try {
        // Fetch weather details in metric units (Celsius)
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&units=metric&appid=${apiKey}`;
        const response = await axios.get(weatherUrl);
        
        const data = response.data;
        const weatherResponse = {
            city: data.name,
            temperature: data.main.temp,
            condition: data.weather[0] ? data.weather[0].main : "Unknown",
            humidity: data.main.humidity
        };

        return res.status(200).json({
            success: true,
            source: "OpenWeather Live API",
            data: weatherResponse
        });

    } catch (error) {
        console.warn(`Weather API live call failed for '${city}'. Reason:`, error.message);
        
        // Handle city not found (404) directly from OpenWeather
        if (error.response && error.response.status === 404) {
            return res.status(404).json({
                success: false,
                message: `City '${city}' not found in OpenWeather database.`
            });
        }

        // Handle expired/unauthorized key (401) by falling back to mock data
        if (error.response && error.response.status === 401) {
            return getMockWeather(city, res, "Mock Fallback (OpenWeather API key unauthorized/expired)");
        }

        // Other network/server failures
        return res.status(500).json({
            success: false,
            message: "Failed to connect to external Weather API.",
            error: error.message
        });
    }
};

/**
 * Internal helper to generate structured mock weather data
 */
function getMockWeather(city, res, sourceMessage) {
    const key = city.toLowerCase().trim().replace(/\s+/g, "");
    const baseMock = mockWeatherDatabase[key];

    if (baseMock) {
        return res.status(200).json({
            success: true,
            source: sourceMessage,
            data: baseMock
        });
    }

    // Generate dynamic mock data for other cities
    const dynamicMock = {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        // Random temperature between 15°C and 35°C
        temperature: parseFloat((15 + Math.random() * 20).toFixed(1)),
        condition: ["Sunny", "Cloudy", "Rainy", "Haze", "Partly Cloudy"][Math.floor(Math.random() * 5)],
        // Random humidity percentage between 40% and 90%
        humidity: Math.floor(40 + Math.random() * 50)
    };

    return res.status(200).json({
        success: true,
        source: sourceMessage,
        data: dynamicMock
    });
}
