# 🎓 UDD Courses API

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-2ea44f?style=for-the-badge&logo=github)](https://luigibarte4563.github.io/udd-courses-api/)
[![API Status](https://img.shields.io/badge/API-Static_JSON-007acc?style=for-the-badge&logo=json)](https://luigibarte4563.github.io/udd-courses-api/data/courses.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An open-source, lightweight educational API providing structured JSON data for academic programs and schools offered at **Universidad de Dagupan**. 

Designed with simplicity in mind — no database, no backend overhead, and zero build steps required.

---

## 🚀 Live Demo & Interactive Links

- **🌐 Live Web App / Documentation:** [https://luigibarte4563.github.io/udd-courses-api/](https://luigibarte4563.github.io/udd-courses-api/)
- **📦 Main API Endpoint:** [`GET /data/courses.json`](https://luigibarte4563.github.io/udd-courses-api/data/courses.json)

---

## 📌 Overview & Quick Stats

| Metric | Value |
| :--- | :--- |
| **Schools / Colleges** | `8` |
| **Programs Offered** | `24` |
| **Data Format** | Static `JSON` |
| **HTTP Method** | `GET` |
| **Authentication** | None (Public) |

---

## 📁 Project Structure

udd-courses-api/
├── index.html                 # Interactive landing page & docs interface
├── css/
│   └── styles.css             # Main styling
├── js/
│   └── main.js                # Frontend data fetching & UI logic
├── scripts/
│   └── generate-endpoints.js  # Node script to pre-render individual JSON endpoints
└── data/                      # 📡 Core Static API
├── courses.json           # Primary dataset containing all schools & courses
├── schools/               # Individual school datasets (e.g., schools/1.json)
└── courses/               # Individual program datasets (e.g., courses/1.json)


---

## 🔌 API Endpoints & Base URLs

**Base URL:** `https://luigibarte4563.github.io/udd-courses-api/data`

| Endpoint | Method | Description | Direct URL |
| :--- | :---: | :--- | :--- |
| `/courses.json` | `GET` | Fetch all schools and their respective courses | [View JSON](https://luigibarte4563.github.io/udd-courses-api/data/courses.json) |
| `/schools/{id}.json` | `GET` | Fetch a specific school by ID (`1`–`8`) | [View Example (ID: 1)](https://luigibarte4563.github.io/udd-courses-api/data/schools/1.json) |
| `/courses/{id}.json` | `GET` | Fetch a specific program by ID (`1`–`24`) | [View Example (ID: 1)](https://luigibarte4563.github.io/udd-courses-api/data/courses/1.json) |

### Sample Response (`GET /data/courses.json`)

```json
{
  "schools": [
    {
      "id": 1,
      "name": "School of Information Technology Education",
      "code": "SITE",
      "courses": [
        {
          "id": 1,
          "name": "BS Computer Science - Data Science",
          "degree": "BS Computer Science",
          "specialization": "Data Science"
        }
      ]
    }
  ]
}
💻 Code Examples
1. Fetching All Data
JavaScript
const res = await fetch("[https://luigibarte4563.github.io/udd-courses-api/data/courses.json](https://luigibarte4563.github.io/udd-courses-api/data/courses.json)");
const data = await res.json();

console.log(data.schools);
2. Fetching a Specific Endpoint
JavaScript
// Fetch a specific program directly by ID
const res = await fetch("[https://luigibarte4563.github.io/udd-courses-api/data/courses/1.json](https://luigibarte4563.github.io/udd-courses-api/data/courses/1.json)");
const course = await res.json();

console.log(course.name); // "BS Computer Science - Data Science"
3. Filtering Programs by Keyword
JavaScript
const res = await fetch("[https://luigibarte4563.github.io/udd-courses-api/data/courses.json](https://luigibarte4563.github.io/udd-courses-api/data/courses.json)");
const data = await res.json();

const techCourses = data.schools
  .flatMap(school => school.courses)
  .filter(course => course.name.toLowerCase().includes("computer"));

console.log(techCourses);
🛠️ Local Development
Because static JSON files are requested via fetch(), open the project over an HTTP server rather than opening index.html directly via file://.

Quick Start Options
VS Code Live Server:

Open the project folder in VS Code.

Install the Live Server extension.

Right-click index.html ➔ Open with Live Server.

Python:

Bash
python -m http.server 8080
# Open http://localhost:8080
Node.js:

Bash
npx serve .
# Open http://localhost:3000
⚙️ Updating & Customizing Data
Edit the core dataset at data/courses.json.

Regenerate individual /schools/{id}.json and /courses/{id}.json endpoints:

Bash
node scripts/generate-endpoints.js
Commit and push your changes to GitHub to update your live API instance on GitHub Pages.

📄 License
Distributed under the MIT License. Free for educational and personal projects.

<FollowUp label="Would you like me to update or generate additional documentation files for this repository?" query="Can you generate additional documentation files for this repository, such as a CONTRIBUTING.md or LICENSE file?"/>
