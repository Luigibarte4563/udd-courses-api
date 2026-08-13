# UDD Courses API

An educational API providing structured information about academic programs and courses offered by **Universidad de Dagupan**.

The site is a simple vanilla HTML/CSS/JavaScript page that serves static JSON data â€” no database, no backend, no build step. Open it locally or publish it free on GitHub Pages.

---

## Table of Contents

- [Project structure](#project-structure)
- [What the API provides](#what-the-api-provides)
- [Run it locally](#run-it-locally)
- [Publish on GitHub Pages](#publish-on-github-pages)
- [Use the API](#use-the-api)
- [Customize the data](#customize-the-data)

---

## Project structure

```
udd-courses-api/
â”‚
â”œâ”€â”€ index.html          # Landing page and documentation site
â”œâ”€â”€ css/
â”‚   â””â”€â”€ styles.css      # All styling
â”œâ”€â”€ js/
â”‚   â””â”€â”€ main.js         # Fetches the data and powers the UI
â”œâ”€â”€ scripts/
â”‚   â””â”€â”€ generate-endpoints.js  # Regenerates the by-ID JSON files
â””â”€â”€ data/
    â”œâ”€â”€ courses.json    # THE API â€” all the course data
    â”œâ”€â”€ schools/        # One file per school: schools/{id}.json
    â””â”€â”€ courses/        # One file per program: courses/{id}.json
```

The "API" is the folder `data/`. The website fetches it with normal `fetch()` calls and renders it, just like any client app would.

---

## What the API provides

| Data | Value |
| --- | --- |
| Schools | 8 |
| Programs | 24 |
| Response format | JSON |
| Request method | GET |

**Example response** (`GET /data/courses.json`):

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
```

## Endpoints

| Endpoint | Description |
| --- | --- |
| `GET /data/courses.json` | All schools and their programs |
| `GET /data/schools/{id}.json` | One school by ID (1&ndash;8), with its programs |
| `GET /data/courses/{id}.json` | One program by ID (1&ndash;24), with its school details |

**Examples:**

```
GET /data/courses.json
GET /data/schools/1.json
GET /data/courses/1.json
```

The by-ID files are generated from `courses.json`, so they always match the main data.

---

## Run it locally

`fetch()` does not work over the `file://` protocol, so serve the folder over HTTP. Pick **one** of these:

### Option 1 â€” VS Code Live Server (easiest)

1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

### Option 2 â€” Python

```bash
cd udd-courses-api
python -m http.server 8080
```

Then open http://localhost:8080

### Option 3 â€” Node.js

```bash
cd udd-courses-api
npx serve .
```

Then open http://localhost:3000

> Any static file server works â€” this project has no build step, so whatever you use, just point it at the folder.

---

## Publish on GitHub Pages

GitHub Pages hosts static files for free and works perfectly with this project because the site uses relative paths (`data/courses.json`, not `/data/courses.json`).

### Option A â€” Deploy from a branch (recommended)

1. Create a repository on GitHub (e.g. `udd-courses-api`) and push this folder to it.
2. Go to the repo on GitHub â†’ **Settings** â†’ **Pages**.
3. Under **Build and deployment** â†’ **Source**, choose **Deploy from a branch**.
4. Select the branch (`main`) and folder (`/ (root)`).
5. Click **Save**. GitHub will build and publish.

This project is already live on GitHub Pages:

- **Site:** https://luigibarte4563.github.io/udd-courses-api/
- **API:** https://luigibarte4563.github.io/udd-courses-api/data/courses.json

If you fork the repo, your copy will be at `https://<your-username>.github.io/udd-courses-api/`.

### Option B â€” Deploy a subfolder with Actions (advanced)

If the files live in a subfolder of a larger repo, add a workflow at `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Upload site
        uses: actions/upload-pages-artifact@v3
        with:
          path: udd-courses-api
      - name: Deploy
        uses: actions/deploy-pages@v4
```

Then enable Pages under **Settings â†’ Pages** with **Source: GitHub Actions**.

> One page cache note: after pushing changes, GitHub Pages can take a few minutes to update. Wait a bit and hard-refresh.

---

## Use the API

### Fetch all courses

```js
const response = await fetch(
  "https://luigibarte4563.github.io/udd-courses-api/data/courses.json"
);

const data = await response.json();

console.log(data.schools);
```

### Find one course

```js
const course = data.schools
  .flatMap(school => school.courses)
  .find(course => course.id === 1);

console.log(course);
```

### Access by ID (endpoint)

The same program can be fetched directly from its own endpoint:

```js
const response = await fetch(
  "https://luigibarte4563.github.io/udd-courses-api/data/courses/1.json"
);

const course = await response.json();

console.log(course.name); // BS Computer Science - Data Science
```

Works the same way for schools:

```js
const response = await fetch(
  "https://luigibarte4563.github.io/udd-courses-api/data/schools/1.json"
);

const school = await response.json();

console.log(school.name); // School of Information Technology Education
```

### Filter by keyword

```js
const courses = data.schools
  .flatMap(school => school.courses)
  .filter(course =>
    course.name.toLowerCase().includes("computer")
  );

console.log(courses);
```

---

## Customize the data

All the content comes from `data/courses.json`. To add, remove, or edit programs, edit that file â€” the stats, school cards, and course explorer update automatically because they are calculated from the data at runtime.

After editing, regenerate the by-ID endpoints to keep them in sync:

```bash
node scripts/generate-endpoints.js
```

Keep the structure intact:

- `schools` â†’ array of schools
- `id` â†’ unique number for each school / course
- `name` â†’ school or program name
- `code` â†’ short school identifier (e.g. `SITE`)
- `courses` â†’ array of programs inside the school
- `degree` â†’ program type (optional)
- `major` â†’ major, when applicable (optional)
- `specialization` â†’ specialization, when applicable (optional)

---

## License

Built for learning and experimentation. Use it freely in educational projects.

