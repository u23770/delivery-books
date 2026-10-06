const test = require('node:test');
const assert = require('node:assert/strict');

test('delivery pricing is intentionally disabled until owner confirmation', () => {
  const fs = require('node:fs');
  const config = fs.readFileSync('js/config.js','utf8');
  assert.match(config, /deliveryConfigured:\s*false/);
  assert.doesNotMatch(config, /deliveryFee:\s*\d/);
});
