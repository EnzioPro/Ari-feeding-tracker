# Ari's Feeding Clock

A small installable web app that logs bottle feeds (in oz) and reminds you when the next feed is due.

## Files
- `app.html` – the whole app (HTML, CSS, JS). This is what the published artifact runs.
- `index.html` – `app.html` wrapped as a full page for self-hosting. Rebuild with `sh build.sh` after editing `app.html`.
- `sw.js`, `manifest.json`, `icon.svg` – make it installable ("Add to Home Screen") and let notifications carry Snooze / Fed buttons.

## Self-hosting for real phone notifications
Serve this folder over HTTPS (GitHub Pages, Netlify, etc.), open it on the phone, add it to the home screen, then tap "Turn on notifications".
Reminders fire while the app is open or in the background; browsers can't wake a fully closed web app without a push server.

## Data
Stored in the browser's localStorage under `feeding-tracker.v1` on each device. Nothing is sent anywhere.
