// Every minute, checks the family's next feed time and has Alexa announce it via Voice Monkey.
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const { shouldAnnounce, speech } = require('./announce');

admin.initializeApp();
const VOICEMONKEY_TOKEN = defineSecret('VOICEMONKEY_TOKEN');
const VOICEMONKEY_DEVICE = defineSecret('VOICEMONKEY_DEVICE');
const FEED_FAMILY_ID = defineSecret('FEED_FAMILY_ID');

exports.announceFeeds = onSchedule(
  { schedule: 'every 1 minutes', retryCount: 0, secrets: [VOICEMONKEY_TOKEN, VOICEMONKEY_DEVICE, FEED_FAMILY_ID] },
  async () => {
    const famRef = admin.firestore().collection('families').doc(FEED_FAMILY_ID.value().trim());
    const now = Date.now();
    const at = await admin.firestore().runTransaction(async (tx) => {
      const fam = await tx.get(famRef);
      if (!fam.exists) return null;
      const last = await tx.get(famRef.collection('feeds').orderBy('time', 'desc').limit(1));
      const feed = last.empty ? null : last.docs[0].data();
      const when = shouldAnnounce(fam.data(), feed, now);
      if (when == null) return null;
      tx.update(famRef, { announcedFor: when }); // claim it first so overlapping runs can't repeat it
      return { family: fam.data(), feed };
    });
    if (!at) return;
    const res = await fetch('https://api-v3.voicemonkey.io/announce', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token: VOICEMONKEY_TOKEN.value().trim(), device: VOICEMONKEY_DEVICE.value().trim(), speech: speech(at.family, at.feed, now) }),
    });
    if (!res.ok) console.error('Voice Monkey announce failed', res.status, await res.text());
  }
);
