// Pure helpers for the Alexa announcer, kept separate so they can be tested without Firebase.
const MIN = 60000;

// When the reminder for this family should fire, mirroring alertTime() in app.html.
function alertTime(family, lastFeed) {
  if (!lastFeed) return null;
  const due = lastFeed.time + (family.intervalMin || 180) * MIN;
  return family.snoozeUntil && family.snoozeUntil > due ? family.snoozeUntil : due;
}

// Announce once per alert time, and only within a few minutes of it, so a late or
// restarted run never reads out a stale reminder.
function shouldAnnounce(family, lastFeed, now, windowMin = 10) {
  const at = alertTime(family, lastFeed);
  if (at == null || now < at || now - at > windowMin * MIN) return null;
  return family.announcedFor === at ? null : at;
}

function speech(family, lastFeed, now) {
  const mins = Math.max(0, Math.round((now - lastFeed.time) / MIN));
  const h = Math.floor(mins / 60); const m = mins % 60;
  const ago = h ? `${h} hour${h === 1 ? '' : 's'}${m ? ` and ${m} minute${m === 1 ? '' : 's'}` : ''}` : `${m} minute${m === 1 ? '' : 's'}`;
  const oz = Math.round(lastFeed.oz * 100) / 100;
  return `Time to feed ${family.name || 'the baby'}. The last feed was ${oz} ounce${oz === 1 ? '' : 's'}, ${ago} ago.`;
}

module.exports = { alertTime, shouldAnnounce, speech };
