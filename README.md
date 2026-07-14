# Class Presentation Hub

A GitHub Pages landing page for organizing and sharing HTML-based class presentations through Google Classroom.

## Live site

After GitHub Pages is enabled, the portal will be available at:

`https://joshuanisnisan02-hub.github.io/classpres/`

## Repository structure

- `index.html` – main course landing page
- `assets/css/styles.css` – portal styles
- `assets/js/app.js` – search, filters, and lesson rendering
- `presentations/week-XX/session-XX/index.html` – HTML presentation folders

## Adding a presentation

1. Create the lesson folder, for example: `presentations/week-01/session-01/`.
2. Upload the presentation as `index.html` together with its images, CSS, JavaScript, audio, or video files.
3. Open `assets/js/app.js` and change the lesson status from `upcoming` to `available`.
4. Update the title, description, subject, and link if needed.
5. Commit the changes.

## Enable GitHub Pages

Open **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/(root)**, then save.
