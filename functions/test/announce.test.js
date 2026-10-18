const test = require('node:test');
const assert = require('node:assert');
const { alertTime, shouldAnnounce, speech } = require('../announce');
const MIN = 60000;
const fam = { name: 'Ari', intervalMin: 180 };
const feed = { time: 1_000_000_000_000, oz: 3.5 };
const due = feed.time + 180 * MIN;

test('due time follows the interval, or a later snooze', () => {
  assert.equal(alertTime(fam, feed), due);
  assert.equal(alertTime({ ...fam, snoozeUntil: due + 15 * MIN }, feed), due + 15 * MIN);
  assert.equal(alertTime({ ...fam, snoozeUntil: due - MIN }, feed), due);
  assert.equal(alertTime(fam, null), null);
});

test('announces once, only inside the window', () => {
  assert.equal(shouldAnnounce(fam, feed, due - MIN), null);
  assert.equal(shouldAnnounce(fam, feed, due + MIN), due);
  assert.equal(shouldAnnounce({ ...fam, announcedFor: due }, feed, due + 2 * MIN), null);
  assert.equal(shouldAnnounce(fam, feed, due + 11 * MIN), null);
});

test('speech reads naturally', () => {
  assert.equal(speech(fam, feed, due), 'Time to feed Ari. The last feed was 3.5 ounces, 3 hours ago.');
  assert.equal(speech(fam, { time: due - 61 * MIN, oz: 1 }, due), 'Time to feed Ari. The last feed was 1 ounce, 1 hour and 1 minute ago.');
});
