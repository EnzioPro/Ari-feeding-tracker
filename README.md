# Ari's Feeding Clock

A small installable web app that logs bottle feeds (in oz), reminds you when the next feed is due, and tracks sleep and diaper changes.

## Screens
- **Home** – next feed countdown, asleep/awake timer and last diaper, each with its one-tap action, today's numbers,
  a 24-hour strip of sleeps, feeds and diapers, and charts of milk, sleep and diapers per day. The Show and Charts
  toggles at the top pick which trackers appear and whether charts cover 7 or 14 days (remembered per phone).
- **Feeds** – the feeding clock and log.
- **Sleep** – tap Start sleep when the baby falls asleep and Woke up when they wake. If you're late, tap
  "5 / 10 / 15 / 30 min ago" instead. "Add a past sleep" logs one after the fact; every sleep can be edited or deleted.
  Sleeps that start between 7 AM and 7 PM count as naps.
- **Diapers** – tap Pee, Poo or Both after a change. "Add details" (or Edit in the log) records dry diapers,
  poo color and texture, diaper rash and a note. "Add an earlier change" logs one after the fact.

Sleep and diaper buttons lock for 5 minutes after a log (from any phone), so a double tap can't log twice.
Mistakes are fixed with Edit or Delete in the log.

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
4. Open the app, go to Settings → Copy share link, and send that link to family. Everyone on that link sees the same feeds, sleeps, countdown, snoozes and reminders.

Whenever `firestore.rules` changes (sleep and diaper tracking each added rules), paste it into the Rules tab again and publish,
so the shared log accepts the new records. Until then they stay on the phone that logged them and upload once the rules allow it.

The link (`?family=<id>`) is the only key to the log, so share it only with people who should see it.

## Reminders when the app is closed
Browsers can't wake a closed web app, so the app books each next reminder on [ntfy.sh](https://ntfy.sh).
Install the free ntfy app, subscribe to the topic shown in Settings (`ari-feeds-<family id>`), and the
reminder arrives at the due time with Fed and Snooze buttons. Each new feed, snooze or interval change
re-books it under the same sequence ID, which replaces the earlier booking.

## Data
Without a Firebase config, feeds stay in each browser's localStorage under `feeding-tracker.v1`.
With one, feeds and sleeps live in Firestore under `families/<id>` (`feeds`, `sleeps` and `diapers` subcollections) and a copy is cached on each phone.

## Alexa announcements
`functions/` holds a Firebase scheduled function that checks the family's next feed every minute and,
when it's due, has Alexa say "Time to feed Ari..." through [Voice Monkey](https://voicemonkey.io).
It announces once per due time (snoozes count), and skips anything more than 10 minutes late.

Setup (once, from a computer with Node 20):
1. Upgrade the Firebase project to the Blaze plan (Cloud Functions require it; this usage stays in the free allowance).
2. In Voice Monkey, link your Amazon account, create a Speaker device, and copy your API token and the device ID.
3. Run:
   ```sh
   npm install -g firebase-tools
   firebase login
   cd functions && npm install && cd ..
   firebase functions:secrets:set VOICEMONKEY_TOKEN    # paste the Voice Monkey token
   firebase functions:secrets:set VOICEMONKEY_DEVICE   # paste the speaker device ID
   firebase functions:secrets:set FEED_FAMILY_ID       # the code after ?family= in your share link
   firebase deploy --only functions
   ```
Run `cd functions && npm test` to test the timing logic.
