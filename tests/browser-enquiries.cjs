const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(__dirname, '..');
const server = http.createServer((request, response) => {
  const file = path.resolve(root, '.' + decodeURIComponent(request.url.split('?')[0]));
  if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404).end(); return; }
    response.setHeader('Content-Type', file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.svg') ? 'image/svg+xml' : 'text/html'); response.end(data);
  });
});
const firestore = `
export const collection=(_,name)=>({name});
export const doc=(_,name,id)=>({name,id});
export const serverTimestamp=()=> 'SERVER_TIME';
export const where=(...args)=>args;
export const query=(target,...filters)=>({...target,filters});
export async function addDoc(target,data){
  window.__writes.push({target,data});
  await new Promise(resolve=>setTimeout(resolve,100));
  if(window.__mode==='fail')throw {code:'permission-denied'};
  return {id:'test-reference-123'};
}
export async function setDoc(target,data){
  if(window.__mode==='fail-profile')throw {code:'permission-denied'};
  window.__writes.push({target,data});sessionStorage.setItem('writes',JSON.stringify(window.__writes));
}
export async function getDoc(){return {exists:()=>!!window.__profile,data:()=>window.__profile};}
export function onSnapshot(target,next){queueMicrotask(()=>next({docs:target.name==='enquiryRequests'?(window.__records||[]).map(data=>({id:'existing',data:()=>data})):[]}));return ()=>{};}
export async function updateDoc(target,data){window.__updates.push({target,data});}
export async function deleteDoc(){}
`;
const auth = `
const listeners=[];
export function onAuthStateChanged(_,callback){listeners.push(callback);queueMicrotask(()=>callback(window.__user||null));return ()=>{};}
export async function signOut(){window.__signedOut=true;listeners.forEach(cb=>cb(null));}
export async function createUserWithEmailAndPassword(_,email){const user={uid:'new-user',email};listeners.forEach(cb=>cb(user));return {user};}
export async function signInWithEmailAndPassword(_,email){const user={uid:'new-user',email};listeners.forEach(cb=>cb(user));return {user};}
export async function sendPasswordResetEmail(){}
`;
async function run() {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({ headless: true, ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}) });
  try {
    const context = await browser.newContext();
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.pathname.endsWith('/firebase.js')) return route.fulfill({ contentType: 'text/javascript', body: 'export const db={};export const auth={};export const storage={};' });
      if (url.pathname.endsWith('/firebase-firestore.js')) return route.fulfill({ contentType: 'text/javascript', body: firestore });
      if (url.pathname.endsWith('/firebase-auth.js')) return route.fulfill({ contentType: 'text/javascript', body: auth });
      if (url.origin !== base) return route.abort();
      return route.continue();
    });
    await context.addInitScript(() => { window.__writes = []; window.__updates = []; });
    const page = await context.newPage(); const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const cases = [
      ['book_a_demo.html', '#demoForm', { name: 'Demo Student', phone: '9876543210' }, { slot: 'Weekend — please call to confirm' }],
      ['book_a_demo_neet.html', '#demoForm', { name: 'NEET Student', phone: '9876543210' }, { slot: 'Weekend — please call to confirm' }],
      ['register.html', '#enrollForm', { name: 'New Student', phone: '9876543210' }, {}],
      ['kts group.html', '#path-form', { name: 'Group Visitor', phone: '9876543210', message: 'Need guidance' }, { interest: 'I need help choosing' }],
      ['kts_talent_solution.html', '#talentForm', { name: 'HR Contact', email: 'hr@example.com', company: 'Example Ltd', role: 'Java developer' }, {}],
      ['kts-digital-solution.html', '#solution-form', { name: 'Business Owner', phone: '9876543210', business: 'Example Business', goal: 'Need a CRM' }, { solution: 'KTS Growth' }]
    ];
    for (const batch of ['impulse', 'momentum', 'power', 'velocity']) for (const exam of ['jee', 'neet']) cases.push([`enroll_now_${batch}_${exam}.html`, '#enrollmentForm', { name: 'Enrollment Student', email: 'student@example.com', phone: '9876543210' }, {}]);
    for (const [file, selector, fields, selects] of cases) {
      await page.goto(`${base}/${encodeURI(file)}`);
      const form = page.locator(selector);
      await form.locator('[name="contactConsent"]').waitFor();
      for (const [name, value] of Object.entries(fields)) await form.locator(`[name="${name}"]`).fill(value);
      for (const [name, value] of Object.entries(selects)) await form.locator(`[name="${name}"]`).selectOption({ label: value });
      await form.evaluate(form => form.requestSubmit());
      assert.equal(await page.evaluate(() => window.__writes.length), 0, `${file}: consent required`);
      await form.locator('[name="contactConsent"]').check();
      await page.evaluate(() => { window.__mode = 'fail'; });
      await form.evaluate(form => form.requestSubmit());
      await page.waitForFunction(() => document.body.textContent.includes('could not be confirmed'));
      assert.equal(await form.locator('[name="name"]').inputValue(), fields.name, `${file}: retain failed details`);
      await page.evaluate(() => { window.__mode = ''; window.__writes = []; });
      await form.evaluate(form => { form.requestSubmit(); form.dispatchEvent(new Event('submit', { cancelable: true })); });
      await page.waitForFunction(() => document.body.textContent.includes('test-reference-123'));
      const writes = await page.evaluate(() => window.__writes);
      assert.equal(writes.length, 1, `${file}: prevent duplicate submits`);
      assert.equal(writes[0].target.name, 'enquiryRequests');
      assert.equal(writes[0].data.source, file);
      assert.equal(writes[0].data.consent, true);
      if (file === 'book_a_demo_neet.html') assert.ok(writes[0].data.interest.startsWith('NEET'));
      if (file.startsWith('enroll_now_')) { assert.ok(writes[0].data.interest.toLowerCase().includes(file.split('_')[3].split('.')[0])); assert.ok(writes[0].data.message.includes('Current class:')); }
      assert.equal(await form.locator('[name="name"]').inputValue(), '', `${file}: clear after success`);
      console.log(`PASS ${file}: consent, failed save, retry, duplicate protection, persisted payload`);
    }
    await page.goto(`${base}/academy-login.html`);
    await page.locator('[data-target="signUp"]').click();
    await page.locator('#signupName').fill('Test Student'); await page.locator('#signupEmail').fill('student@example.com'); await page.locator('#signupPassword').fill('password123');
    await page.locator('#signUp button[type="submit"]').click();
    await page.waitForURL(`${base}/index.html`);
    const signup = await page.evaluate(() => JSON.parse(sessionStorage.getItem('writes')));
    assert.equal(signup.length, 1); assert.equal(signup[0].data.venture, 'academy'); assert.equal(signup[0].data.role, 'student'); assert.equal(signup[0].data.username, 'Test Student');
    console.log('PASS registration: one profile write with venture and student role despite auth callback');
    await page.goto(`${base}/get%20free%20councelling.html`);
    const counselling = page.locator('#counsellingForm');
    await counselling.locator('[name="name"]').fill('Counselling Student');
    await counselling.locator('[name="email"]').fill('student@example.com');
    await counselling.locator('[name="phone"]').fill('9876543210');
    await counselling.locator('[name="goal"]').selectOption('neet');
    await counselling.locator('[name="studentClass"]').selectOption('12');
    await counselling.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.querySelector('#formStatus').textContent.includes('has been received'));
    assert.equal(await page.evaluate(() => window.__writes[0].target.name), 'counseling_requests');
    assert.equal(await page.evaluate(() => window.__writes[0].data.timestamp), 'SERVER_TIME');
    console.log('PASS existing counselling: contact fields saved with server timestamp');
    await page.addInitScript(() => {
      window.__user = { uid: 'owner', email: 'owner@example.com' }; window.__profile = { role: 'enterprise_owner', venture: 'academy' };
      window.__records = [{ name: '<img src=x onerror=alert(1)>', phone: '9876543210', venture: 'academy', status: 'new', type: 'demo', interest: 'NEET demo', message: 'Call tomorrow' }];
    });
    await page.goto(`${base}/enquiry-inbox.html`);
    await page.locator('.request').waitFor(); assert.equal(await page.locator('.request img').count(), 0);
    await page.locator('.followup select').selectOption('contacted'); await page.locator('.followup textarea').fill('Called student'); await page.locator('.followup button').click();
    await page.waitForFunction(() => window.__updates.length === 1);
    const update = await page.evaluate(() => window.__updates[0]); assert.equal(update.data.status, 'contacted'); assert.equal(update.data.updatedBy, 'owner');
    await page.locator('#logout').click(); await page.waitForFunction(() => document.querySelectorAll('.request').length === 0);
    console.log('PASS inbox: safe rendering, follow-up save, immediate data clearing on logout');
    assert.deepEqual(errors, [], 'No uncaught browser errors');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/enquiry-inbox.html`); await page.locator('.request').waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Inbox fits mobile viewport');
    await page.screenshot({ path: path.join(root, 'output/enquiry-inbox-mobile.png'), fullPage: true });
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${base}/kts-enterprise-operations.html`);
    await page.locator('[data-page="digital"]').click();
    await page.waitForFunction(() => document.querySelector('#view').textContent.includes('No Digital projects yet.'));
    assert.deepEqual(errors, [], 'Staff workspace renders without JavaScript errors');
    console.log('PASS enterprise workspace: loads and renders the empty Digital projects view');
    await context.close();
  } finally { await browser.close(); server.close(); }
}
run().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
