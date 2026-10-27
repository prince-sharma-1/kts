// Read-only verification using the same authenticated Firebase CLI installation.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const root = process.env.FIREBASE_TOOLS_ROOT;
if (!root) throw new Error('Set FIREBASE_TOOLS_ROOT to the installed firebase-tools package directory.');
const { requireAuth } = require(path.join(root, 'lib/requireAuth.js'));
const { getGlobalDefaultAccount } = require(path.join(root, 'lib/auth.js'));
const { listAllReleases, getRulesetContent } = require(path.join(root, 'lib/gcp/rules.js'));
const project = 'kts-academy-16860';
const digest = value => crypto.createHash('sha256').update(value).digest('hex').toUpperCase();
async function verify() {
  const reportPath = 'output/firestore-rules-verification.json';
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const local = fs.readFileSync('firestore.rules', 'utf8');
  assert.equal(digest(local), report.rulesSha256, 'Local rules must match the emulator-tested rules.');
  const account = getGlobalDefaultAccount();
  if (!account) throw new Error('Sign in through the Firebase CLI first.');
  await requireAuth({ project, nonInteractive: true, user: account.user, tokens: account.tokens });
  const releases = await listAllReleases(project);
  const name = `projects/${project}/releases/cloud.firestore`;
  const release = releases.find(item => item.name === name) || releases.find(item => item.name === `${name}/(default)`);
  if (!release) throw new Error('No active default Firestore release found.');
  const files = await getRulesetContent(release.rulesetName);
  assert.equal(files.length, 1, 'Expected one deployed Firestore rules file.');
  assert.equal(digest(files[0].content), report.rulesSha256, 'Active rules must exactly match the emulator-tested source.');
  Object.assign(report, {
    deployment: 'Deployed and active source verified', project,
    release: release.name, ruleset: release.rulesetName,
    releaseUpdateTime: release.updateTime || release.createTime,
    activeRulesSha256: digest(files[0].content)
  });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ project, release: report.release, ruleset: report.ruleset, sourceMatchesTestedRules: true }, null, 2));
}
verify().catch(error => { console.error(error.message); process.exitCode = 1; });
