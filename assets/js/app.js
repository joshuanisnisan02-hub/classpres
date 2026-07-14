"use strict";

/*
  EDITING GUIDE
  ------------------------------------------------------------------
  1. Add or update lesson information inside lessonOverrides below.
  2. Change status to "available" after uploading the HTML presentation.
  3. The expected lesson path is:
     presentations/week-01/session-01/index.html
  4. You may replace the generated path by adding a custom `url` value.
*/

const lessonOverrides = {
  "1-1": {
    title: "Welcome to the Class Presentation Hub",
    description: "A sample HTML presentation showing where your actual Week 1, Session 1 lesson will appear.",
    status: "available"
  },
  "1-2": {
    title: "Course Orientation",
    description: "Replace this placeholder with the title and description of your second presentation.",
    status: "upcoming"
  }
};

const padNumber = (value) => String(value).padStart(2, "0");

const lessons = Array.from({ length: 18 }, (_, weekIndex) => {
  const week = weekIndex + 1;

  return [1, 2].map((session) => {
    const key = `${week}-${session}`;
    const override = lessonOverrides[key] || {};
    const weekFolder = `week-${padNumber(week)}`;
    const sessionFolder = `session-${padNumber(session)}`;

    return {
      id: key,
      week,
      session,
      title: override.title || `Week ${week}, Session ${session}`,
      description:
        override.description ||
        "This presentation has not yet been published. Please check your Google Classroom for announcements.",
      status: override.status || "upcoming",
      url: override.url || `presentations/${weekFolder}/${sessionFolder}/`
    };
  });
}).flat();

const lessonGrid = document.getElementById("lessonGrid");
const searchInput = document.getElementById("searchInput");
const weekFilter = document.getElementById("weekFilter");
const statusFilter = document.getElementById("statusFilter");
const visibleCount = document.getElementById("visibleCount");
const emptyState = document.getElementById("emptyState");
const resetFiltersButton = document.getElementById("resetFilters");

function populateWeekFilter() {
  for (let week = 1; week <= 18; week += 1) {
    const option = document.createElement("option");
    option.value = String(week);
    option.textContent = `Week ${week}`;
    weekFilter.appendChild(option);
  }
}

function createStatusBadge(status) {
  const badge = document.createElement("span");
  badge.className = `status-badge ${status}`;
  badge.textContent = status === "available" ? "Available" : "Upcoming";
  return badge;
}

function createLessonCard(lesson) {
  const article = document.createElement("article");
  article.className = `lesson-card ${lesson.status}`;
  article.dataset.week = String(lesson.week);
  article.dataset.status = lesson.status;

  const top = document.createElement("div");
  top.className = "lesson-card-top";

  const weekBadge = document.createElement("span");
  weekBadge.className = "week-badge";
  weekBadge.textContent = `Week ${padNumber(lesson.week)}`;

  top.append(weekBadge, createStatusBadge(lesson.status));

  const number = document.createElement("span");
  number.className = "lesson-number";
  number.setAttribute("aria-hidden", "true");
  number.textContent = padNumber(lesson.week);

  const heading = document.createElement("h3");
  heading.textContent = lesson.title;

  const description = document.createElement("p");
  description.textContent = lesson.description;

  const footer = document.createElement("div");
  footer.className = "lesson-card-footer";

  const sessionLabel = document.createElement("span");
  sessionLabel.className = "session-label";
  sessionLabel.textContent = `Session ${lesson.session}`;

  if (lesson.status === "available") {
    const link = document.createElement("a");
    link.className = "lesson-link";
    link.href = lesson.url;
    link.setAttribute("aria-label", `Open ${lesson.title}`);
    link.innerHTML = "Open lesson <span aria-hidden=\"true\">→</span>";
    footer.append(sessionLabel, link);
  } else {
    const disabledLabel = document.createElement("span");
    disabledLabel.className = "lesson-disabled";
    disabledLabel.textContent = "Not yet posted";
    footer.append(sessionLabel, disabledLabel);
  }

  article.append(top, number, heading, description, footer);
  return article;
}

function getFilteredLessons() {
  const keyword = searchInput.value.trim().toLowerCase();
  const selectedWeek = weekFilter.value;
  const selectedStatus = statusFilter.value;

  return lessons.filter((lesson) => {
    const searchableText = [
      lesson.title,
      lesson.description,
      `week ${lesson.week}`,
      `session ${lesson.session}`
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = !keyword || searchableText.includes(keyword);
    const matchesWeek = selectedWeek === "all" || String(lesson.week) === selectedWeek;
    const matchesStatus = selectedStatus === "all" || lesson.status === selectedStatus;

    return matchesSearch && matchesWeek && matchesStatus;
  });
}

function renderLessons() {
  const filteredLessons = getFilteredLessons();
  const fragment = document.createDocumentFragment();

  filteredLessons.forEach((lesson) => {
    fragment.appendChild(createLessonCard(lesson));
  });

  lessonGrid.replaceChildren(fragment);
  visibleCount.textContent = String(filteredLessons.length);

  const hasResults = filteredLessons.length > 0;
  lessonGrid.hidden = !hasResults;
  emptyState.hidden = hasResults;
}

function resetFilters() {
  searchInput.value = "";
  weekFilter.value = "all";
  statusFilter.value = "all";
  renderLessons();
  searchInput.focus();
}

function loadFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const week = params.get("week");
  const status = params.get("status");

  if (week && Number(week) >= 1 && Number(week) <= 18) {
    weekFilter.value = week;
  }

  if (["available", "upcoming"].includes(status)) {
    statusFilter.value = status;
  }
}

populateWeekFilter();
loadFiltersFromUrl();
renderLessons();

searchInput.addEventListener("input", renderLessons);
weekFilter.addEventListener("change", renderLessons);
statusFilter.addEventListener("change", renderLessons);
resetFiltersButton.addEventListener("click", resetFilters);
