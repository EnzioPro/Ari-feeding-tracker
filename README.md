# Ari's Feeding Clock

A small installable web app that logs bottle feeds (in oz) and reminds you when the next feed is due.

## Files
- `app.html` – the whole app (HTML, CSS, JS). This is what the published artifact runs.
- `index.html` – `app.html` wrapped as a full page for self-hosting. Rebuild with `sh build.sh` after editing `app.html`.
- `firebase-config.js` – your Firebase web config. When filled in, everyone with the family link shares one log.
- `firestore.rules` – security rules to paste into the Firebase console.
- `sw.js`, `manifest.json`, `icon.svg` – make it installable ("Add to Home Screen") and let notifications carry Snooze / Fed buttons.

## Self-hosting for real phone notifications
Serve this folder over HTTPS (GitHub Pages, Netlify, etc.), open it on the phone, add it to the home screen, then tap "Turn on notifications".
Reminders fire while the app is open or in the background; browsers can't wake a fully closed web app without a push server.

## Sharing one log across phones
1. Create a free project at https://console.firebase.google.com (Spark plan is enough).
2. Build → Firestore Database → Create database (production mode), then paste `firestore.rules` into its Rules tab and publish.
3. Project settings → General → Your apps → add a Web app, and copy its config values into `firebase-config.js`.
4. Open the app, go to Settings → Copy share link, and send that link to family. Everyone on that link sees the same feeds, countdown, snoozes and reminders.

The link (`?family=<id>`) is the only key to the log, so share it only with people who should see it.

## Data
Without a Firebase config, feeds stay in each browser's localStorage under `feeding-tracker.v1`.
With one, feeds live in Firestore under `families/<id>` and a copy is cached on each phone.
