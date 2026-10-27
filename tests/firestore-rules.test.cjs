const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('firebase/firestore');
const { initializeApp, deleteApp } = require('firebase/app');
const host = process.env.FIRESTORE_EMULATOR_HOST;
const projectId = 'demo-kts';
const apps = [];
function client(uid, email = `${uid}@example.com`) {
  const app = initializeApp({ projectId, apiKey: 'demo-key' }, `rules-${uid}-${apps.length}`); apps.push(app);
  const db = fs.getFirestore(app);
  fs.connectFirestoreEmulator(db, '127.0.0.1', 8080, uid ? { mockUserToken: { sub: uid, email } } : undefined);
  return db;
}
function fields(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key,
    Array.isArray(value) ? { arrayValue: { values: value.map(stringValue => ({ stringValue })) } }
      : typeof value === 'boolean' ? { booleanValue: value } : { stringValue: value }]));
}
async function seed(path, data) {
  const response = await fetch(`http://${host}/v1/projects/${projectId}/databases/(default)/documents/${path}`, { method: 'PATCH', headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: fields(data) }) });
  assert.equal(response.ok, true, await response.text());
}
const denied = promise => assert.rejects(promise, error => error.code === 'permission-denied');
test('Firestore account and enquiry boundaries', { skip: !host }, async t => {
  assert.equal(host, '127.0.0.1:8080', 'Only the local demo emulator may run this suite');
  await fetch(`http://${host}/emulator/v1/projects/${projectId}/databases/(default)/documents`, { method: 'DELETE' });
  try {
    const student = client('student'), publicDb = client(null), owner = client('owner'), manager = client('manager'), inactive = client('inactive');
    await seed('users/owner', { email: 'owner@example.com', role: 'enterprise_owner', venture: 'academy' });
    await seed('users/manager', { email: 'manager@example.com', role: 'operations_manager', venture: 'education' });
    await seed('users/inactive', { email: 'inactive@example.com', role: 'enterprise_owner', venture: 'academy', active: false });
    const profile = () => ({ email: 'student@example.com', venture: 'academy', role: 'student', createdAt: fs.serverTimestamp(), profileCompleted: false });
    await t.test('public registration cannot create staff or managed access', async () => {
      await denied(fs.setDoc(fs.doc(student, 'users/student'), { ...profile(), role: 'enterprise_owner' }));
      await denied(fs.setDoc(fs.doc(student, 'users/student'), { ...profile(), managedVentures: ['education'] }));
      await fs.setDoc(fs.doc(student, 'users/student'), profile());
    });
    await t.test('self-service edits cannot change role, venture, active or managedVentures', async () => {
      for (const change of [{ role: 'operations_manager' }, { venture: 'education' }, { active: true }, { managedVentures: ['education'] }]) await denied(fs.updateDoc(fs.doc(student, 'users/student'), change));
      await fs.updateDoc(fs.doc(student, 'users/student'), { username: 'Updated Student' });
    });
    const enquiry = () => ({ name: 'Test Student', email: '', phone: '9876543210', interest: 'NEET demo', message: '', venture: 'academy', type: 'demo', source: 'book_a_demo_neet.html', consent: true, status: 'new', createdAt: fs.serverTimestamp() });
    await t.test('anonymous visitors can save valid enquiries but cannot read them', async () => {
      await fs.setDoc(fs.doc(publicDb, 'enquiryRequests/demo'), enquiry());
      await denied(fs.getDoc(fs.doc(publicDb, 'enquiryRequests/demo')));
      await denied(fs.getDoc(fs.doc(student, 'enquiryRequests/demo')));
      await denied(fs.setDoc(fs.doc(publicDb, 'enquiryRequests/no-consent'), { ...enquiry(), consent: false }));
      await denied(fs.setDoc(fs.doc(publicDb, 'enquiryRequests/extra'), { ...enquiry(), role: 'enterprise_owner' }));
    });
    await t.test('only active staff with the correct venture can read and follow up', async () => {
      await fs.getDocs(fs.query(fs.collection(owner, 'enquiryRequests'), fs.where('venture', 'in', ['academy', 'education'])));
      await denied(fs.getDoc(fs.doc(manager, 'enquiryRequests/demo')));
      await denied(fs.getDoc(fs.doc(inactive, 'enquiryRequests/demo')));
      await fs.updateDoc(fs.doc(owner, 'enquiryRequests/demo'), { status: 'contacted', notes: 'Called student', updatedBy: 'owner', updatedAt: fs.serverTimestamp() });
      await denied(fs.updateDoc(fs.doc(owner, 'enquiryRequests/demo'), { name: 'Replaced' }));
      await denied(fs.updateDoc(fs.doc(student, 'enquiryRequests/demo'), { status: 'closed' }));
    });
    await t.test('known legacy profiles migrate only to their original venture', async () => {
      await seed('users/legacy', { role: 'student', email: 'legacy@example.com', batch: 'Banking Aspirant' });
      const legacy = client('legacy'); await denied(fs.updateDoc(fs.doc(legacy, 'users/legacy'), { venture: 'academy' }));
      await fs.updateDoc(fs.doc(legacy, 'users/legacy'), { venture: 'scorehigh' });
    });
    await t.test('counselling records become available to assigned staff only', async () => {
      await seed('counseling_requests/old-request', { name: 'Existing Request', venture: 'academy', status: 'new' });
      await fs.getDocs(fs.collection(owner, 'counseling_requests'));
      await denied(fs.getDoc(fs.doc(manager, 'counseling_requests/old-request')));
      await fs.updateDoc(fs.doc(owner, 'counseling_requests/old-request'), { status: 'scheduled', notes: 'Callback arranged', updatedAt: fs.serverTimestamp(), updatedBy: 'owner' });
    });
    await t.test('IT signup permits candidates and rejects other profile identities', async () => {
      const candidate = client('candidate');
      const data = { email: 'candidate@example.com', venture: 'it', role: 'candidate', createdAt: fs.serverTimestamp() };
      await denied(fs.setDoc(fs.doc(candidate, 'users/candidate'), { ...data, role: 'student' }));
      await denied(fs.setDoc(fs.doc(candidate, 'users/candidate'), { ...data, email: 'someone-else@example.com' }));
      await denied(fs.setDoc(fs.doc(candidate, 'users/other-user'), data));
      await fs.setDoc(fs.doc(candidate, 'users/candidate'), data);
    });
    await t.test('assigned managers can query only their allowed enquiry ventures', async () => {
      await fs.setDoc(fs.doc(publicDb, 'enquiryRequests/education'), { ...enquiry(), venture: 'education', type: 'general', source: 'kts group.html' });
      await fs.getDocs(fs.query(fs.collection(manager, 'enquiryRequests'), fs.where('venture', 'in', ['education', 'enterprise'])));
      await denied(fs.getDocs(fs.collection(manager, 'enquiryRequests')));
      await denied(fs.getDocs(fs.query(fs.collection(manager, 'enquiryRequests'), fs.where('venture', 'in', ['education', 'academy']))));
      await fs.updateDoc(fs.doc(manager, 'enquiryRequests/education'), { status: 'contacted', notes: 'Education callback', updatedBy: 'manager', updatedAt: fs.serverTimestamp() });
    });
    await t.test('managed ventures and marketing-to-digital access match the inbox', async () => {
      await seed('users/sales', { email: 'sales@example.com', role: 'business_development', venture: 'marketing', managedVentures: ['academy'] });
      const sales = client('sales');
      await fs.getDocs(fs.query(fs.collection(sales, 'enquiryRequests'), fs.where('venture', 'in', ['marketing', 'digital', 'academy'])));
      await fs.getDocs(fs.collection(sales, 'counseling_requests'));
      await denied(fs.getDoc(fs.doc(sales, 'enquiryRequests/education')));
      await denied(fs.updateDoc(fs.doc(sales, 'users/sales'), { managedVentures: ['education'] }));
    });
    await t.test('inactive staff cannot write enterprise records or reactivate themselves', async () => {
      const record = { organization: 'KTS Enterprise', venture: 'digital', type: 'lead', accessGroup: 'sales' };
      await denied(fs.setDoc(fs.doc(inactive, 'enterpriseOperations/inactive-write'), record));
      await denied(fs.updateDoc(fs.doc(inactive, 'users/inactive'), { active: true }));
      await fs.setDoc(fs.doc(owner, 'enterpriseOperations/owner-write'), record);
    });
    await t.test('follow-up writes cannot forge authors or delete enquiry records', async () => {
      await denied(fs.updateDoc(fs.doc(owner, 'enquiryRequests/demo'), { status: 'closed', notes: 'Forged', updatedBy: 'manager', updatedAt: fs.serverTimestamp() }));
      await denied(fs.deleteDoc(fs.doc(owner, 'enquiryRequests/demo')));
    });
  } finally { await Promise.all(apps.map(deleteApp)); }
});
