/**
 * Student Name: Hammad Shahzad (ID: 232071)
 * Partner/Context: Kashan Zafar (ID: 232051)
 * Course: BSSE-VI-B & A
 * Lab Title: API RESTful Deployment and Testing Lab
 * File: public/app.js - Dynamic JavaScript logic for the REST UI
 */

const API_BASE = window.location.origin; // Dynamically binds to host (http://localhost:5000)

// Global Authentication State
let token = localStorage.getItem("accessToken") || "";
let loggedUser = null;

// DOM Elements
const authStatusDot = document.getElementById("auth-status-dot");
const authLoggedOut = document.getElementById("auth-logged-out");
const authLoggedIn = document.getElementById("auth-logged-in");
const authForm = document.getElementById("auth-form");
const authUsernameInput = document.getElementById("auth-username");
const authPasswordInput = document.getElementById("auth-password");
const authRoleSelect = document.getElementById("auth-role");
const registerRoleWrapper = document.getElementById("register-role-wrapper");
const authSubmitBtn = document.getElementById("auth-submit-btn");
const toggleToLogin = document.getElementById("toggle-to-login");
const toggleToRegister = document.getElementById("toggle-to-register");
const loggedUserDisplay = document.getElementById("logged-user-display");
const loggedRoleDisplay = document.getElementById("logged-role-display");
const tokenString = document.getElementById("token-string");
const copyTokenBtn = document.getElementById("copy-token-btn");
const logoutBtn = document.getElementById("logout-btn");

const dbStatusMessage = document.getElementById("db-status-message");
const patientsList = document.getElementById("patients-list-element");
const patientFormContainer = document.getElementById("patient-form-container");
const patientForm = document.getElementById("patient-form");
const patientFormTitle = document.getElementById("patient-form-title");
const patientIdInput = document.getElementById("patient-id");
const patientNameInput = document.getElementById("patient-name");
const patientAgeInput = document.getElementById("patient-age");
const patientDiseaseInput = document.getElementById("patient-disease");
const patientContactInput = document.getElementById("patient-contact");
const newPatientBtn = document.getElementById("new-patient-btn");
const closePatientForm = document.getElementById("close-patient-form");
const cancelPatientForm = document.getElementById("cancel-patient-form");
const refreshPatientsBtn = document.getElementById("refresh-patients-btn");

const weatherCityInput = document.getElementById("weather-city-input");
const getWeatherBtn = document.getElementById("get-weather-btn");
const weatherCity = document.getElementById("weather-city");
const weatherSource = document.getElementById("weather-source");
const weatherTemp = document.getElementById("weather-temp");
const weatherCondition = document.getElementById("weather-condition");
const weatherHumidity = document.getElementById("weather-humidity");
const weatherIconDiv = document.getElementById("weather-icon-div");

const newsCountrySelect = document.getElementById("news-country-select");
const getNewsBtn = document.getElementById("get-news-btn");
const newsSource = document.getElementById("news-source");
const newsList = document.getElementById("news-list-element");

let isLoginMode = true;

// INIT RUN
document.addEventListener("DOMContentLoaded", () => {
    checkAuthState();
    fetchWeather("London"); // Pre-populate with a default search
    fetchNews("in");        // Pre-populate with default news
});

// ==========================================
// TOAST NOTIFICATIONS
// ==========================================
function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = '<i class="fa-solid fa-circle-check"></i>';
    if (type === "error") {
        icon = '<i class="fa-solid fa-circle-exclamation"></i>';
    } else if (type === "info") {
        icon = '<i class="fa-solid fa-circle-info"></i>';
    }

    toast.innerHTML = `${icon}<span>${message}</span>`;
    container.appendChild(toast);

    // Fade out and remove toast after 3.5 seconds
    setTimeout(() => {
        toast.classList.add("toast-exit");
        toast.addEventListener("animationend", () => {
            toast.remove();
        });
    }, 3500);
}

// ==========================================
// AUTHENTICATION LOGIC
// ==========================================
function checkAuthState() {
    token = localStorage.getItem("accessToken") || "";
    if (token) {
        try {
            // Decode simple payload variables from JWT token
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            loggedUser = JSON.parse(jsonPayload);

            // Update UI components for Logged In state
            authStatusDot.classList.add("active");
            authLoggedOut.classList.remove("active");
            authLoggedIn.classList.add("active");
            
            loggedUserDisplay.textContent = loggedUser.username || "Authenticated";
            loggedRoleDisplay.textContent = loggedUser.role || "user";
            
            if (loggedUser.role === "admin") {
                loggedRoleDisplay.className = "role-badge"; // Green Emerald
            } else {
                loggedRoleDisplay.className = "role-badge alert-info"; // Blue Indigo
            }
            
            tokenString.textContent = token;
            
            dbStatusMessage.className = "db-status-bar alert-info";
            dbStatusMessage.innerHTML = `<i class="fa-solid fa-unlock"></i><span>Access active as <strong>${loggedUser.role.toUpperCase()}</strong>. CRUD unlocked.</span>`;
            
            // Auto fetch database patients
            loadPatients();

        } catch (e) {
            console.error("Token decoding failed", e);
            clearTokenState();
        }
    } else {
        clearTokenState();
    }
}

function clearTokenState() {
    token = "";
    loggedUser = null;
    localStorage.removeItem("accessToken");
    
    authStatusDot.classList.remove("active");
    authLoggedOut.classList.add("active");
    authLoggedIn.classList.remove("active");
    
    dbStatusMessage.className = "db-status-bar alert-warning";
    dbStatusMessage.innerHTML = `<i class="fa-solid fa-lock"></i><span>Database locked. Sign in to view and manage patient details.</span>`;
    
    patientsList.innerHTML = `
        <div class="empty-list-placeholder">
            <i class="fa-solid fa-database placeholder-icon"></i>
            <p>Database Locked</p>
        </div>
    `;
}

// Event Listeners for Auth Panel toggles
toggleToLogin.addEventListener("click", () => {
    isLoginMode = true;
    toggleToLogin.classList.add("active");
    toggleToRegister.classList.remove("active");
    registerRoleWrapper.classList.add("hidden");
    authSubmitBtn.querySelector("span").textContent = "Sign In";
});

toggleToRegister.addEventListener("click", () => {
    isLoginMode = false;
    toggleToLogin.classList.remove("active");
    toggleToRegister.classList.add("active");
    registerRoleWrapper.classList.remove("hidden");
    authSubmitBtn.querySelector("span").textContent = "Create Account";
});

// Auth form submissions (Login or Register)
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const username = authUsernameInput.value.trim();
    const password = authPasswordInput.value;
    const role = authRoleSelect.value;

    if (!username || !password) {
        showToast("Please enter username and password.", "error");
        return;
    }

    const endpoint = isLoginMode ? "/api/auth/login" : "/api/auth/register";
    const payload = isLoginMode ? { username, password } : { username, password, role };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
            if (isLoginMode) {
                // Store Access Token on local storage
                localStorage.setItem("accessToken", data.accessToken);
                showToast("Signed in successfully!", "success");
                authUsernameInput.value = "";
                authPasswordInput.value = "";
                checkAuthState();
            } else {
                showToast("User registered! You can sign in now.", "success");
                // Reset panel view to login mode
                toggleToLogin.click();
            }
        } else {
            showToast(data.message || "Authentication process failed.", "error");
        }
    } catch (err) {
        console.error("Auth HTTP failure:", err);
        showToast("Cannot establish server connection.", "error");
    }
});

// Token Copy
copyTokenBtn.addEventListener("click", () => {
    if (token) {
        navigator.clipboard.writeText(token);
        showToast("Token copied to clipboard!", "success");
    }
});

// Sign Out
logoutBtn.addEventListener("click", () => {
    clearTokenState();
    showToast("Signed out successfully.", "info");
});


// ==========================================
// PATIENTS DATABASE CRUD
// ==========================================
async function loadPatients() {
    if (!token) return;
    
    try {
        const response = await fetch(`${API_BASE}/api/patients`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}` 
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            renderPatients(data);
        } else {
            if (response.status === 400 || response.status === 401) {
                // Token invalid or expired
                showToast("Session expired. Please sign in again.", "error");
                clearTokenState();
            } else {
                showToast(data.message || "Failed to retrieve patients records.", "error");
            }
        }
    } catch (err) {
        console.error(err);
        showToast("Failed to fetch database records.", "error");
    }
}

function renderPatients(array) {
    if (!array || array.length === 0) {
        patientsList.innerHTML = `
            <div class="empty-list-placeholder">
                <i class="fa-solid fa-hospital-user placeholder-icon"></i>
                <p>No patient records found in database.</p>
            </div>
        `;
        return;
    }

    patientsList.innerHTML = array.map(patient => `
        <div class="patient-card-item" data-id="${patient._id}">
            <div class="patient-info-block">
                <h4>${escapeHTML(patient.name)}</h4>
                <div class="patient-info-details">
                    <span class="detail-badge">Age: ${patient.age} yrs</span>
                    <span class="disease-highlight"><i class="fa-solid fa-virus-covid"></i> ${escapeHTML(patient.disease)}</span>
                    <span><i class="fa-solid fa-phone"></i> ${escapeHTML(patient.contact)}</span>
                </div>
            </div>
            <div class="patient-actions-group">
                <button class="icon-btn edit-rec-btn" onclick="openEditForm('${patient._id}', '${escapeQuote(patient.name)}', ${patient.age}, '${escapeQuote(patient.disease)}', '${escapeQuote(patient.contact)}')" title="Edit Record"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="icon-btn delete-rec-btn" onclick="deletePatientRecord('${patient._id}')" title="Delete Record"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        </div>
    `).join("");
}

// Open Form drawer for Create
newPatientBtn.addEventListener("click", () => {
    if (!token) {
        showToast("Please sign in first.", "error");
        return;
    }
    if (loggedUser && loggedUser.role !== "admin") {
        showToast("Unauthorized: Admin privileges required to write records.", "error");
        return;
    }
    
    // Setup form for creating
    patientFormTitle.textContent = "Add New Patient";
    patientIdInput.value = "";
    patientNameInput.value = "";
    patientAgeInput.value = "";
    patientDiseaseInput.value = "";
    patientContactInput.value = "";
    
    patientFormContainer.classList.remove("hidden");
});

// Cancel Form
cancelPatientForm.addEventListener("click", () => {
    patientFormContainer.classList.add("hidden");
});
closePatientForm.addEventListener("click", () => {
    patientFormContainer.classList.add("hidden");
});

// Open Form for Edit
window.openEditForm = (id, name, age, disease, contact) => {
    if (loggedUser && loggedUser.role !== "admin") {
        showToast("Unauthorized: Admin privileges required to edit records.", "error");
        return;
    }
    
    patientFormTitle.textContent = "Modify Patient Record";
    patientIdInput.value = id;
    patientNameInput.value = name;
    patientAgeInput.value = age;
    patientDiseaseInput.value = disease;
    patientContactInput.value = contact;
    
    patientFormContainer.classList.remove("hidden");
};

// Form submission for Create or Edit
patientForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id = patientIdInput.value;
    const name = patientNameInput.value.trim();
    const age = parseInt(patientAgeInput.value);
    const disease = patientDiseaseInput.value.trim();
    const contact = patientContactInput.value.trim();

    if (!name || isNaN(age) || !disease || !contact) {
        showToast("All fields are required.", "error");
        return;
    }

    const isEdit = id && id.trim() !== "";
    const method = isEdit ? "PUT" : "POST";
    const endpoint = isEdit ? `/api/patients/${id}` : "/api/patients";
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, age, disease, contact })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast(isEdit ? "Patient record modified successfully!" : "Patient record inserted successfully!", "success");
            patientFormContainer.classList.add("hidden");
            loadPatients(); // Reload
        } else {
            showToast(data.message || "Failed to save record.", "error");
        }
    } catch (err) {
        console.error(err);
        showToast("HTTP connection failed.", "error");
    }
});

// Delete Record
window.deletePatientRecord = async (id) => {
    if (loggedUser && loggedUser.role !== "admin") {
        showToast("Unauthorized: Admin privileges required to delete records.", "error");
        return;
    }
    
    if (!confirm("Are you sure you want to permanently delete this patient record?")) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/api/patients/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            showToast("Record deleted successfully.", "success");
            loadPatients();
        } else {
            showToast(data.message || "Failed to delete record.", "error");
        }
    } catch (err) {
        console.error(err);
        showToast("HTTP connection failed.", "error");
    }
};

refreshPatientsBtn.addEventListener("click", () => {
    if (!token) {
        showToast("Please sign in first.", "info");
        return;
    }
    loadPatients();
    showToast("Patients list refreshed.", "info");
});


// ==========================================
// TASK 1: WEATHER SERVICE
// ==========================================
async function fetchWeather(city) {
    if (!city || city.trim() === "") return;
    
    weatherCity.textContent = "Loading...";
    weatherTemp.textContent = "--";
    weatherCondition.textContent = "Loading conditions...";
    weatherHumidity.textContent = "--%";
    weatherSource.textContent = "Fetching...";

    try {
        const response = await fetch(`${API_BASE}/api/weather/${encodeURIComponent(city.trim())}`);
        const result = await response.json();
        
        if (response.ok && result.success) {
            const data = result.data;
            weatherCity.textContent = data.city;
            weatherTemp.textContent = data.temperature.toFixed(1);
            weatherCondition.textContent = data.condition;
            weatherHumidity.textContent = `${data.humidity}%`;
            weatherSource.textContent = result.source || "OpenWeather API";
            
            // Set dynamic weather icons based on condition
            setWeatherIcon(data.condition);
        } else {
            showToast(result.message || "City weather not found.", "error");
            weatherCity.textContent = "Error";
            weatherCondition.textContent = "City not found";
            setWeatherIcon("unknown");
        }
    } catch (err) {
        console.error(err);
        showToast("Failed to fetch weather metrics.", "error");
        weatherCity.textContent = "Connection Failure";
        weatherCondition.textContent = "Unavailable";
    }
}

function setWeatherIcon(condition) {
    const clean = condition.toLowerCase();
    let iconClass = "fa-solid fa-cloud-sun";
    let colorClass = "cloudy";
    
    if (clean.includes("sun") || clean.includes("clear")) {
        iconClass = "fa-solid fa-sun animate-pulse";
        colorClass = "sunny";
    } else if (clean.includes("cloud") || clean.includes("mist") || clean.includes("haze")) {
        iconClass = "fa-solid fa-cloud";
        colorClass = "cloudy";
    } else if (clean.includes("rain") || clean.includes("drizzle") || clean.includes("shower")) {
        iconClass = "fa-solid fa-cloud-showers-heavy";
        colorClass = "rainy";
    } else if (clean.includes("snow")) {
        iconClass = "fa-solid fa-snowflake";
        colorClass = "clear";
    }
    
    weatherIconDiv.innerHTML = `<i class="${iconClass} weather-icon-large ${colorClass}"></i>`;
}

getWeatherBtn.addEventListener("click", () => {
    const city = weatherCityInput.value.trim();
    if (!city) {
        showToast("Please write a city name.", "error");
        return;
    }
    fetchWeather(city);
});

// Handle enter key on input
weatherCityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        getWeatherBtn.click();
    }
});


// ==========================================
// TASK 2: NEWS SERVICE
// ==========================================
async function fetchNews(countryCode) {
    newsSource.textContent = "Loading headlines...";
    newsList.innerHTML = `
        <div class="empty-list-placeholder">
            <i class="fa-solid fa-rss placeholder-icon animate-pulse"></i>
            <p>Fetching top stories...</p>
        </div>
    `;

    try {
        const response = await fetch(`${API_BASE}/api/news/${countryCode}`);
        const result = await response.json();

        if (response.ok && result.success) {
            newsSource.textContent = result.source || "NewsAPI";
            renderNews(result.articles);
        } else {
            showToast(result.message || "Failed to load headlines.", "error");
            newsSource.textContent = "Error";
            newsList.innerHTML = `
                <div class="empty-list-placeholder">
                    <i class="fa-solid fa-triangle-exclamation placeholder-icon"></i>
                    <p>${escapeHTML(result.message || "Failed to retrieve articles.")}</p>
                </div>
            `;
        }
    } catch (err) {
        console.error(err);
        showToast("Connection to news API failed.", "error");
        newsSource.textContent = "Offline";
        newsList.innerHTML = `
            <div class="empty-list-placeholder">
                <i class="fa-solid fa-wifi placeholder-icon"></i>
                <p>Connection Offline</p>
            </div>
        `;
    }
}

function renderNews(articles) {
    if (!articles || articles.length === 0) {
        newsList.innerHTML = `
            <div class="empty-list-placeholder">
                <i class="fa-solid fa-rss placeholder-icon"></i>
                <p>No headlines found for this country.</p>
            </div>
        `;
        return;
    }

    newsList.innerHTML = articles.map(article => {
        // Human readable date formatting
        let dateStr = "Date Unknown";
        if (article.publishedAt) {
            try {
                const date = new Date(article.publishedAt);
                dateStr = date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (err) {
                dateStr = article.publishedAt;
            }
        }

        return `
            <div class="news-item-card">
                <h4><a href="${article.url}" target="_blank" rel="noopener noreferrer">${escapeHTML(article.title)} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.75rem; margin-left:2px;"></i></a></h4>
                <div class="news-item-meta">
                    <span class="news-badge-source">${escapeHTML(article.source)}</span>
                    <span class="news-date">${dateStr}</span>
                </div>
            </div>
        `;
    }).join("");
}

getNewsBtn.addEventListener("click", () => {
    const code = newsCountrySelect.value;
    fetchNews(code);
});


// ==========================================
// STRING SANITIZERS (HTML/Attributes injection blocker)
// ==========================================
function escapeHTML(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

function escapeQuote(str) {
    if (!str) return "";
    return str.replace(/'/g, "\\'")
              .replace(/"/g, "&quot;");
}
