# KTS website functionality review

Implementation update (27 October 2026): account permission, registration/recovery and enquiry-flow fixes are now prepared locally. See `ACCOUNT-AND-ENQUIRY-SETUP.md` for completed changes, verification and remaining deployment requirements. The findings below record the original audit, not verified production status.

Reviewed: 27 October 2026. Scope: local website source and supplied Firebase rules; 74 top-level HTML pages checked for literal local href/src targets. Android copies and the separate hotel website are outside this review. No production database, deployed rules, payment account, or authenticated browser journey was verified. Findings about access assume the supplied rules are deployed.

## Work required, in priority order

| Priority | Area | Evidence and impact | Completion criteria |
| --- | --- | --- | --- |
| Critical | Staff authorization | `firestore.rules` permits users to create their own profile with any role, provided venture is valid. Staff permissions subsequently trust that role. Profile updates also do not protect `managedVentures`, which controls cross-venture access. | Restrict public profile creation to ordinary student/candidate roles and allowed fields; protect all access-related fields on update. Provision staff through a trusted administrative path. Verify denied privilege changes with rules tests before deployment. |
| High | Checkout and course activation | `academy-purchase.js` launches a UPI URL and creates a pending payment request. It does not verify settlement. Rules deny all client updates to payment requests and all writes to course entitlements. Existing Velocity/Momentum payment pages explicitly say checkout is coming soon. | Implement order-backed checkout, trusted settlement verification, duplicate-event handling, payment status/receipt display, and entitlement activation. Alternatively complete and document a trusted manual reconciliation workflow. |
| High | Demo booking | Both `book_a_demo.html` and `book_a_demo_neet.html` show a success modal and log to console without sending or saving the booking. | Save a validated booking; show success only after persistence; provide a staff booking queue and error/retry states. |
| High | Legacy registration/login | `register.html` writes to `enrollments`, for which supplied rules have no allow statement. Signup in `login.html` creates a user document without the required `venture` field. This can create an Auth account while profile creation fails. | Consolidate entry points around working venture registration, migrate or redirect older routes, and recover accounts whose Auth registration succeeded but profile creation failed. |
| High | Counselling follow-up | `counselling.js` saves `counseling_requests`, but supplied rules deny every read/update/delete, including staff. | Provide authorized staff access, a visible queue, assignment, follow-up status, and a tested receipt-to-contact workflow. |
| High | Score High testing | `Testseries.html` records a started attempt; `take-test.html` scores in the browser and never persists completed answers/results. Attempt rules deny updates. Questions and answer keys are downloadable JSON. | Persist completion linked to its attempt; add result history, answer review, interruption recovery and appropriate scoring integrity. Choose whether this is practice-only or an assessed exam before designing answer delivery. |
| High | Academy learning delivery | `academy-dashboard.js` provides module completion checkboxes and fixed study targets, without lesson/video/material delivery per module. Every program uses the Velocity NEET brochure resource. | Publish program-specific lessons, resources, schedules and assessments; use the correct guide per course and test access with an entitled student account. |
| Medium | Marketing navigation | `kts group.html` contains three links to missing `kts-digital-marketing/index.html`; a differently named marketing page exists at the project root. | Point links to the intended existing destination and verify hosted navigation. |
| Medium | Digital enquiries | `kts-digital-solution.js` opens a WhatsApp draft without persisting an enquiry. A visitor must still send the message. | If CRM capture is required, save the enquiry and surface it to staff, with WhatsApp as a follow-up action. |
| Medium | CRM multi-user reliability | Education and IT CRMs save their entire `state` into one Firestore document, while caching in localStorage. Concurrent edits can replace another employee's changes. | Use records or concurrency controls; verify simultaneous edits, failed-sync recovery, and logout/device cache behavior with real staff accounts. |
| Medium | Launch information | No top-level privacy, terms or refund-policy files were found. The repository README and August audit no longer describe current functionality accurately. | Supply approved business policies, link them where data/payment is collected, and update operating/setup documentation. |
| Medium | Repeatable verification and hosting | `package.json` provides only a start script. `server.js` serves static files and maps `/` to Score High rather than the Academy index. Firebase config declares database/storage rules but no Hosting configuration. | Confirm the intended homepage and actual hosting setup; add repeatable checks for signup, staff access, forms, payments, course access and test results, plus mobile/keyboard checks. |

## Existing connections worth retaining

- Venture-specific Firebase login, signup and password reset are implemented in `venture-login.js`.
- Academy course access and progress use Firestore collections.
- Education, IT and enterprise operations have Firebase-connected staff interfaces.
- IT employer leads are submitted to Firestore; candidate profiles support résumé uploads.
- Counselling submission already has pending, success and failure UI.
- Score High has published-test loading, a timer, answer navigation and immediate browser scoring.
- Sitemap, robots policy and venture favicons already exist.

These are source-level implementations, not evidence that the deployed services are configured or working.

## Recommended implementation sequence

1. Fix profile/staff authorization and registration compatibility.
2. Finish enquiry, demo and counselling capture-to-staff workflows; repair marketing navigation.
3. Complete payments, reconciliation, receipts and course activation.
4. Deliver course content and persist test completion/results.
5. Resolve CRM concurrency, finalize policies and run authenticated desktop/mobile acceptance checks against a staging deployment.

## Verification performed

- Inspected shared authentication, supplied database/storage rules, purchasing, Academy dashboard, demo forms, counselling, registration, test-taking, lead capture and CRM persistence code.
- Scanned literal local href/src references in 74 root HTML files: three missing references, all to the marketing path above; seven `#` links require contextual review and are not automatically defects.
- Scan output: `output/functionality-link-audit.json`. It excludes dynamic JavaScript-generated links, fragment target validation, CSS URLs, external availability and nested projects.
- No site behavior or existing user edits were changed. This is a functionality audit, not a complete security or visual accessibility audit.
