# Lab 13: API RESTful Deployment and Testing Lab
**Course:** BSSE-VI-B & A (Full Stack Programming Lab)  
**Instructor:** Mr. Sharif Hussain  

---

## Student Information
*   **Student Name:** Hammad Shahzad
*   **Student ID:** 232071
*   **Lab Partner / Context:** Kashan Zafar (232051)
*   **Submission Repository Name:** `Full-Stack-Programming-Lab`
*   **Assigned Folder Name:** `lab_13_api_restful_deployment_and_testing_lab`

---

## Objectives
1.  Design and implement a structured **RESTful API** using Node.js, Express.js, and MongoDB (via Mongoose ODM).
2.  Incorporate industry-standard security practices, including password hashing with **Bcrypt.js** and role-based authentication using **JSON Web Tokens (JWT)**.
3.  Integrate third-party REST APIs:
    *   **OpenWeather API** to fetch real-time weather details for dynamic city parameters.
    *   **NewsAPI** to fetch and filter the latest headlines for dynamic country parameters.
4.  Implement robust error handling, validator checks, and clean JSON response formats.
5.  Document API testing procedures using **Postman**, **Web Browsers**, and automated verification scripts.

---

## Technologies Used
*   **Runtime:** Node.js (LTS Version)
*   **Backend Framework:** Express.js (Modular Routing and Middleware Architecture)
*   **Database ODM:** Mongoose (MongoDB Object Modeling)
*   **Authentication & Security:** JSON Web Tokens (jsonwebtoken) & Bcrypt.js
*   **HTTP Client:** Axios (For calling external third-party APIs)
*   **Environment Configuration:** Dotenv (Securing secrets and credentials)
*   **Development Utility:** Nodemon (Hot-reloading during backend execution)

---

## Project Structure
The repository is structured following a clean, modular REST architectural design as requested in the manual:

```
lab_13_api_restful_deployment_and_testing_lab/
├── README.md                              # This documentation file
├── Lab_Report_Hammad_Shahzad_232071.md    # University-style Lab Report
└── backend/
    ├── .env                               # Credentials & environment setup
    ├── app.js                             # Express application & routes binding
    ├── server.js                          # Port listener & DB connect launcher
    ├── package.json                       # Project metadata & npm modules
    ├── config/
    │   └── db.js                          # MongoDB Compass connection module
    ├── middleware/
    │   └── authMiddleware.js              # Custom JWT role validation middleware
    ├── models/
    │   ├── User.js                        # User MongoDB Schema
    │   └── Patient.js                     # Patient MongoDB Schema
    ├── controllers/
    │   ├── patientController.js           # CRUD controllers for patients
    │   ├── weatherController.js           # OpenWeather API controller (with mock fallback)
    │   └── newsController.js              # NewsAPI controller (with mock fallback)
    └── routes/
        ├── authRoutes.js                  # User registration, login, and user lists
        ├── patientRoutes.js               # Patient CRUD endpoint mapping
        ├── weatherRoutes.js               # Weather parameters mapping
        └── newsRoutes.js                  # News parameters mapping
```

---

## API Endpoints Reference

### 1. General & Information
*   **`GET /`** — Check system server status and display metadata.

### 2. Authentication Module
*   **`POST /api/auth/register`** — Register a new account.
    *   *Body JSON:* `{"username": "hammad_shahzad", "password": "mypassword123", "role": "admin"}` (Roles: `"user"` or `"admin"`)
*   **`POST /api/auth/login`** — Log in and retrieve the authorization token.
    *   *Body JSON:* `{"username": "hammad_shahzad", "password": "mypassword123"}`
    *   *Response JSON:* `{"success": true, "accessToken": "eyJhbG..."}`
*   **`GET /api/auth/users`** — Get a list of all users (*Admin permission token required*).

### 3. Patients Database Module (Protected)
*   **`POST /api/patients`** — Insert a new patient record (*Admin only*).
    *   *Headers:* `Authorization: Bearer <accessToken>`
    *   *Body JSON:* `{"name": "Alice Smith", "age": 29, "disease": "Allergy", "contact": "+923001234567"}`
*   **`GET /api/patients`** — List all patient records (*Authorized users*).
*   **`GET /api/patients/:id`** — Get a specific patient record by MongoDB ObjectID.
*   **`PUT /api/patients/:id`** — Modify details of an existing patient (*Admin only*).
*   **`DELETE /api/patients/:id`** — Remove a patient record (*Admin only*).

### 4. Weather Forecast API (Task 1)
*   **`GET /api/weather/:city`** — Retrieve live weather details for the specified city.
    *   *Examples:* `/api/weather/London`, `/api/weather/Lahore`, `/api/weather/Tokyo`
    *   *Sample Response JSON:*
        ```json
        {
          "success": true,
          "source": "OpenWeather Live API",
          "data": {
            "city": "London",
            "temperature": 15.4,
            "condition": "Clouds",
            "humidity": 82
          }
        }
        ```

### 5. News Headlines API (Task 2)
*   **`GET /api/news/:country`** — Retrieve top headlines for the specified 2-letter ISO country code.
    *   *Examples:* `/api/news/us` (United States), `/api/news/gb` (United Kingdom), `/api/news/in` (India)
    *   *Sample Response JSON:*
        ```json
        {
          "success": true,
          "count": 5,
          "source": "NewsAPI Live Service",
          "articles": [
            {
              "title": "Tech Giants Announce Next-Gen AI Alliance",
              "source": "TechCrunch",
              "url": "https://techcrunch.com/ai-alliance",
              "publishedAt": "2026-05-20T08:00:00Z"
            }
          ]
        }
        ```

---

## Installation & Setup Instructions

### Prerequisites
*   Ensure that **Node.js** (LTS version) is installed.
*   Ensure **MongoDB Compass** is installed and running on `mongodb://127.0.0.1:27017/`.

### Steps to Run the Project
1.  **Clone the Repository (If pulling from remote):**
    ```powershell
    git clone https://github.com/your-username/Full-Stack-Programming-Lab.git
    cd Full-Stack-Programming-Lab/lab_13_api_restful_deployment_and_testing_lab/backend
    ```
2.  **Install Node Modules:**
    If PowerShell Script Execution Policies or command prompt is restricted by your system administrator, install using the direct Node process bypass command:
    ```powershell
    node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
    ```
    Otherwise, standard:
    ```powershell
    npm install
    ```
3.  **Configure Environment Variables:**
    Open the `.env` file in the `backend/` directory. Fill in your own API keys if available:
    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/patientsDB
    JWT_SECRET=mySecretKey123_Hammad_232071_Kashan_232051
    OPENWEATHER_API_KEY=your_actual_key_here
    NEWS_API_KEY=your_actual_key_here
    ```
    *(Note: If API keys are omitted or kept as placeholder defaults, the system automatically runs in Mock Fallback mode. This allows you to test the API outputs without needing to sign up on OpenWeather or NewsAPI.)*

4.  **Launch the server:**
    *   **Development mode (using nodemon):**
        ```powershell
        npm run dev
        ```
        *(Or bypass command: `node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run dev`)*
    *   **Production mode:**
        ```powershell
        npm start
        ```

---

## Testing Methods

### Method A: Automated Verification Script (Recommended)
We have prepared a self-contained automation test suite in the scratch directory. To execute it:
```powershell
# Set node path context and run
$env:NODE_PATH="c:\Users\232051\Documents\Lab 13-Full Stack Programming\lab_13_api_restful_deployment_and_testing_lab\backend\node_modules"; node C:\Users\232051\.gemini\antigravity-ide\brain\924b203c-64fe-44af-b3a8-ca4999f00947\scratch\verify_api.js
```
This tests all 17 cases (auth, roles, patient CRUD, weather, news) and reports a summary of passes/failures in the terminal.

### Method B: Postman Manual Testing
1.  **Launch Postman.**
2.  **Create a User Account:**
    *   Method: `POST`
    *   URL: `http://localhost:5000/api/auth/register`
    *   Body (Raw JSON): `{"username":"hammad232071", "password":"password123", "role":"admin"}`
3.  **Log in to get Token:**
    *   Method: `POST`
    *   URL: `http://localhost:5000/api/auth/login`
    *   Body (Raw JSON): `{"username":"hammad232071", "password":"password123"}`
    *   Copy the `accessToken` from the JSON response.
4.  **Access Protected Patient CRUD:**
    *   Method: `POST`
    *   URL: `http://localhost:5000/api/patients`
    *   Header: Key `Authorization`, Value `Bearer YOUR_ACCESS_TOKEN`
    *   Body: `{"name":"John Doe","age":42,"disease":"Hypertension","contact":"+923123456789"}`
5.  **Fetch Weather Data (Task 1):**
    *   Method: `GET`
    *   URL: `http://localhost:5000/api/weather/London`
6.  **Fetch News Data (Task 2):**
    *   Method: `GET`
    *   URL: `http://localhost:5000/api/news/us`

### Method C: Web Browser Verification
Enter the following URLs in Chrome or Edge to view formatted JSON payloads:
*   Root Server Info: `http://localhost:5000/`
*   Weather for Tokyo: `http://localhost:5000/api/weather/Tokyo`
*   News for Great Britain: `http://localhost:5000/api/news/gb`
*   News for India: `http://localhost:5000/api/news/in`

---

## GitHub Deployment Instructions
To push your lab submission folder to your GitHub repository `Full-Stack-Programming-Lab`:
1.  Open PowerShell in the workspace root `c:\Users\232051\Documents\Lab 13-Full Stack Programming`.
2.  Initialize Git repository:
    ```powershell
    git init
    ```
3.  Create a `.gitignore` inside `backend/` to prevent committing `node_modules` and secure `.env` secrets:
    ```
    node_modules/
    .env
    ```
4.  Stage and commit files:
    ```powershell
    git add .
    git commit -m "Initialize Lab 13 - REST APIs for Weather, News, and Patients"
    ```
5.  Link remote and push:
    ```powershell
    git remote add origin https://github.com/HammadShahzad/Full-Stack-Programming-Lab.git
    git branch -M main
    git push -u origin main
    ```
