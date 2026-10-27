const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

async function load(file, mocks = {}) {
  const context = vm.createContext({ console });
  const module = new vm.SourceTextModule(fs.readFileSync(file, 'utf8'), { context });
  await module.link(async identifier => {
    const values = mocks[identifier];
    if (!values) throw new Error(`Unexpected import: ${identifier}`);
    return new vm.SyntheticModule(Object.keys(values), function () { for (const [key, value] of Object.entries(values)) this.setExport(key, value); }, { context });
  });
  await module.evaluate(); return module.namespace;
}
async function membership(profile) {
  const writes = []; let signedOut = false;
  const api = await load('account-profile.js', {
    './firebase.js': { auth: {}, db: {} },
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js': { signOut: async () => { signedOut = true; } },
    'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js': {
      doc: (_, collection, uid) => ({ collection, uid }), serverTimestamp: () => 'SERVER_TIME',
      getDoc: async () => ({ exists: () => profile !== null, data: () => profile }),
      setDoc: async (...args) => writes.push(args)
    }
  });
  return { api, writes, signedOut: () => signedOut };
}
const user = { uid: 'student', email: 'student@example.com' };
test('recovers an Auth account with no profile as a student with a server timestamp', async () => {
  const m = await membership(null); const result = await m.api.ensureMembership(user, 'academy');
  assert.equal(result.role, 'student'); assert.equal(result.email, user.email); assert.equal(result.createdAt, 'SERVER_TIME'); assert.equal(m.writes.length, 1);
});
test('IT recovery creates a candidate, never a staff role', async () => {
  const m = await membership(null); assert.equal((await m.api.ensureMembership(user, 'it')).role, 'candidate');
});
test('does not rewrite an existing profile', async () => {
  const m = await membership({ venture: 'academy', role: 'student' }); await m.api.ensureMembership(user, 'academy'); assert.equal(m.writes.length, 0);
});
test('rejects another venture and unknown legacy assignments', async () => {
  for (const profile of [{ venture: 'education', role: 'student' }, { role: 'student' }]) {
    const m = await membership(profile); await assert.rejects(m.api.ensureMembership(user, 'academy'), { code: 'venture/wrong-portal' }); assert.equal(m.writes.length, 0); assert.equal(m.signedOut(), true);
  }
});
test('migrates only recognized legacy student ventures', async () => {
  const m = await membership({ role: 'student', batch: 'Banking Aspirant' }); await m.api.ensureMembership(user, 'scorehigh'); assert.equal(m.writes[0][1].venture, 'scorehigh');
});
test('rejects inactive staff even with an assigned venture', async () => {
  const m = await membership({ venture: 'academy', role: 'enterprise_owner', active: false }); await assert.rejects(m.api.ensureMembership(user, 'academy'), { code: 'venture/inactive' }); assert.equal(m.writes.length, 0);
});
test('honors managed ventures only for staff', async () => {
  const m = await membership({ venture: 'academy', role: 'operations_manager', managedVentures: ['education'] }); await m.api.ensureMembership(user, 'education');
  const student = await membership({ venture: 'academy', role: 'student', managedVentures: ['education'] }); await assert.rejects(student.api.ensureMembership(user, 'education'));
});
const valid = { name: ' Test Student ', email: '', phone: '9876543210', interest: 'NEET demo', message: '', venture: 'academy', type: 'demo', source: 'book_a_demo_neet.html', consent: true };
test('validates and normalizes an enquiry without accepting supplied status/roles', async () => {
  const { validateEnquiry } = await load('enquiry-model.js'); const result = validateEnquiry({ ...valid, role: 'enterprise_owner', status: 'closed' });
  assert.equal(result.name, 'Test Student'); assert.equal(result.status, 'new'); assert.equal(result.role, undefined);
});
test('requires consent, valid contact information, configured source and bounded fields', async () => {
  const { validateEnquiry } = await load('enquiry-model.js');
  for (const change of [{ consent: false }, { phone: '', email: '' }, { email: 'broken' }, { phone: 'abc' }, { source: 'unknown.html' }, { message: 'x'.repeat(1001) }, { name: ' ' }]) assert.throws(() => validateEnquiry({ ...valid, ...change }));
});
test('talent enquiries can use email without a phone', async () => {
  const { validateEnquiry } = await load('enquiry-model.js'); assert.equal(validateEnquiry({ ...valid, phone: '', email: 'hr@example.com' }).email, 'hr@example.com');
});
test('all eight course enrollment routes have a configured enquiry source', async () => {
  const { validateEnquiry, enrollmentSources } = await load('enquiry-model.js');
  assert.equal(Object.keys(enrollmentSources).length, 8);
  for (const [source, interest] of Object.entries(enrollmentSources)) assert.equal(validateEnquiry({ ...valid, source, interest, type: 'enrollment' }).interest, interest);
});
test('inbox excludes inactive staff and students; managers see assigned ventures', async () => {
  const { enquiryVentures } = await load('enquiry-model.js');
  assert.equal(enquiryVentures({ role: 'student', venture: 'academy' }).length, 0);
  assert.equal(enquiryVentures({ role: 'enterprise_owner', active: false }).length, 0);
  assert.equal(enquiryVentures({ role: 'enterprise_owner' }).length, 7);
  const access = enquiryVentures({ role: 'business_development', venture: 'marketing' }); assert.equal(access.includes('digital'), true); assert.equal(access.includes('academy'), false);
});
