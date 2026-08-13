/* ============================================================
   UDD Courses API — site interactivity
   ============================================================ */

const API_URL = "data/courses.json";

let allSchools = [];
let explorerState = { query: "", schoolId: "all" };

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ---------- Fetch helpers ---------- */

async function fetchCourses() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
}

async function resolveApiUrl(url = API_URL) {
  try {
    return new URL(url, window.location.href).href;
  } catch {
    return url;
  }
}

/* ---------- Main init ---------- */

async function init() {
  setFooterYear();
  initNav();
  initCopyButtons();
  initReveal();
  initTester();

  try {
    const data = await fetchCourses();
    allSchools = Array.isArray(data.schools) ? data.schools : [];
    renderStats();
    renderSchools();
    renderExplorer();
    renderExplorerMeta();
    initExplorerControls();
  } catch (err) {
    console.error(err);
    showLoadError();
  }
}

/* ---------- Footer year ---------- */

function setFooterYear() {
  const el = $("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

/* ---------- Navigation ---------- */

function initNav() {
  const toggle = $("#navToggle");
  const links = $("#navLinks");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  $$(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  const sections = $$("main section[id]");
  if (sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            $$(".nav__link").forEach((link) => {
              link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }
}

/* ---------- Copy buttons ---------- */

function initCopyButtons() {
  $$(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const targetId = btn.dataset.copyTarget;
      const target = document.getElementById(targetId);
      const code = target ? target.textContent.trim() : "";
      const label = btn.querySelector(".copy-btn__label");

      try {
        await navigator.clipboard.writeText(code);
      } catch {
        const textarea = document.createElement("textarea");
        textarea.value = code;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      btn.classList.add("is-copied");
      if (label) label.textContent = "Copied!";

      setTimeout(() => {
        btn.classList.remove("is-copied");
        if (label) label.textContent = "Copy";
      }, 1600);
    });
  });
}

/* ---------- Reveal animations ---------- */

function initReveal() {
  const items = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  items.forEach((el) => observer.observe(el));
}

/* ---------- Stats ---------- */

function renderStats() {
  const schoolCount = allSchools.length;
  const courseCount = allSchools.reduce((sum, school) => sum + school.courses.length, 0);

  const schoolsEl = $("#statSchools");
  const coursesEl = $("#statCourses");

  if (schoolsEl) schoolsEl.textContent = String(schoolCount);
  if (coursesEl) coursesEl.textContent = String(courseCount);
}

/* ---------- School cards ---------- */

function renderSchools() {
  const grid = $("#schoolsGrid");
  const errorBox = $("#schoolsError");
  if (!grid) return;

  grid.innerHTML = allSchools
    .map(
      (school) => `
      <article class="school-card">
        <div class="school-card__top">
          <h3 class="school-card__name">${escapeHtml(school.name)}</h3>
          <span class="school-card__code">${escapeHtml(school.code)}</span>
        </div>
        <p class="school-card__count"><strong>${school.courses.length}</strong> Program${school.courses.length === 1 ? "" : "s"}</p>
        <button class="school-card__link" data-school-id="${school.id}">
          View Programs
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </article>`
    )
    .join("");

  if (errorBox) errorBox.hidden = true;

  $$(".school-card__link").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.schoolId;
      explorerState.schoolId = id;
      const filterEl = $("#schoolFilter");
      if (filterEl) filterEl.value = id;
      renderExplorer();
      renderExplorerMeta();
      $("#courses").scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ---------- Course explorer ---------- */

function initExplorerControls() {
  const search = $("#searchInput");
  const filter = $("#schoolFilter");

  if (filter) {
    filter.innerHTML =
      '<option value="all">All Schools</option>' +
      allSchools
        .map((school) => `<option value="${school.id}">${escapeHtml(school.name)}</option>`)
        .join("");
  }

  search.addEventListener("input", () => {
    explorerState.query = search.value.trim().toLowerCase();
    renderExplorer();
    renderExplorerMeta();
  });

  filter.addEventListener("change", () => {
    explorerState.schoolId = filter.value;
    renderExplorer();
    renderExplorerMeta();
  });
}

function getFilteredCourses() {
  const { query, schoolId } = explorerState;
  const results = [];

  allSchools.forEach((school) => {
    if (schoolId !== "all" && String(school.id) !== String(schoolId)) return;

    school.courses.forEach((course) => {
      if (!query) {
        results.push({ course, school });
        return;
      }

      const haystack = [
        course.name,
        course.degree || "",
        course.major || "",
        course.specialization || "",
        school.name,
        school.code,
      ]
        .join(" ")
        .toLowerCase();

      if (haystack.includes(query)) {
        results.push({ course, school });
      }
    });
  });

  return results;
}

function renderExplorer() {
  const grid = $("#explorerGrid");
  const loading = $("#explorerLoading");
  const empty = $("#explorerEmpty");
  if (!grid) return;

  if (loading) loading.hidden = true;

  const results = getFilteredCourses();

  if (empty) empty.hidden = results.length > 0;

  grid.innerHTML = results
    .map(
      ({ course, school }, index) => `
      <article class="course-card" style="animation-delay:${Math.min(index * 40, 320)}ms">
        <h3 class="course-card__name">${escapeHtml(course.name)}</h3>
        <div class="course-card__meta">
          <p><strong>School:</strong> ${escapeHtml(school.name)}</p>
          ${course.degree ? `<p><strong>Degree:</strong> ${escapeHtml(course.degree)}</p>` : ""}
          ${course.major ? `<p><strong>Major:</strong> ${escapeHtml(course.major)}</p>` : ""}
          ${course.specialization ? `<p><strong>Specialization:</strong> ${escapeHtml(course.specialization)}</p>` : ""}
        </div>
        <p class="course-card__id"><strong>Course ID:</strong> ${course.id}</p>
      </article>`
    )
    .join("");
}

function renderExplorerMeta() {
  const meta = $("#explorerMeta");
  if (!meta) return;

  const results = getFilteredCourses();
  const schoolName =
    explorerState.schoolId === "all"
      ? "all schools"
      : allSchools.find((s) => String(s.id) === String(explorerState.schoolId))?.name || "all schools";

  meta.textContent = `${results.length} program${results.length === 1 ? "" : "s"} in ${schoolName}`;
}

/* ---------- Load error ---------- */

function showLoadError() {
  const grid = $("#schoolsGrid");
  const errorBox = $("#schoolsError");
  const loading = $("#explorerLoading");
  const empty = $("#explorerEmpty");

  if (grid) grid.innerHTML = "";
  if (loading) loading.hidden = true;
  if (empty) empty.hidden = false;
  if (errorBox) errorBox.hidden = false;

  const retry = $("#retryBtn");
  if (retry) {
    retry.addEventListener("click", () => {
      if (errorBox) errorBox.hidden = true;
      if (loading) loading.hidden = false;
      location.reload();
    });
  }
}

/* ---------- API tester ---------- */

function testerPath() {
  const resource = $("#testerResource").value;
  const id = $("#testerId").value.trim();

  if (resource === "school") return `data/schools/${id || "{id}"}.json`;
  if (resource === "course") return `data/courses/${id || "{id}"}.json`;
  return "data/courses.json";
}

function initTester() {
  const btn = $("#sendBtn");
  const resource = $("#testerResource");
  const idInput = $("#testerId");
  const pathEl = $("#testerPath");
  if (!btn) return;

  const updatePath = () => {
    const path = testerPath();
    if (pathEl) pathEl.textContent = "/" + path;
    if (idInput) {
      const hasId = resource && resource.value !== "all";
      idInput.style.display = hasId ? "inline-flex" : "none";
      if (hasId) idInput.focus();
    }
  };

  if (resource) resource.addEventListener("change", updatePath);
  if (idInput) idInput.addEventListener("input", updatePath);
  updatePath();

  btn.addEventListener("click", runTester);
}

async function runTester() {
  const box = $("#testerResponse");
  const btn = $("#sendBtn");
  if (!box) return;

  const url = testerPath();
  const fullUrl = await resolveApiUrl(url);

  box.innerHTML = `
    <div class="tester__loading">
      <span class="spinner" aria-hidden="true"></span>
      Fetching data...
    </div>`;
  if (btn) btn.disabled = true;

  const startedAt = performance.now();

  try {
    const response = await fetch(url);
    const duration = Math.max(1, Math.round(performance.now() - startedAt));

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText || ""}`.trim());
    }

    const data = await response.json();

    box.innerHTML = `
      <div class="tester__result">
        <div class="tester__statusline">
          <span class="tester__status">${response.status} OK</span>
          <span class="tester__meta">${duration} ms &bull; application/json</span>
        </div>
        <p class="tester__url">${escapeHtml(fullUrl)}</p>
        <pre>${highlightJson(JSON.stringify(data, null, 2))}</pre>
      </div>`;
  } catch (err) {
    const duration = Math.max(1, Math.round(performance.now() - startedAt));
    box.innerHTML = `
      <div class="tester__result">
        <div class="tester__statusline">
          <span class="tester__status is-error">Request failed</span>
          <span class="tester__meta">${duration} ms</span>
        </div>
        <p class="tester__url">${escapeHtml(fullUrl)}</p>
        <pre>${escapeHtml(err.message)}</pre>
      </div>`;
  } finally {
    if (btn) btn.disabled = false;
  }
}

/* ---------- JSON syntax highlighting ---------- */

function highlightJson(json) {
  return escapeHtml(json).replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "c-num";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "c-key" : "c-str";
      } else if (/^(?:true|false|null)$/.test(match)) {
        cls = "c-kw";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

/* ---------- Utils ---------- */

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => {
    const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return map[ch];
  });
}

/* ---------- Boot ---------- */

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
