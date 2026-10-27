# Account and enquiry changes

Implemented locally on 27 October 2026. The website files and Firestore rules must be released together after the rules tests pass. No live Firebase deployment was performed.

## Account behavior

- Public registration can create only `student` accounts, or `candidate` accounts for the IT venture. It cannot supply staff permissions, managed ventures, or activation fields.
- Self-service profile edits cannot change roles, venture assignments, activation, managed ventures, or arbitrary extra fields.
- Staff access checks reject accounts marked `active: false`, including employee login and enterprise record writes.
- `login.html` forwards to the Academy portal while preserving the query string and fragment. All five venture portals use the shared membership/recovery code.
- A valid Firebase Auth account with no profile can sign in again to finish profile creation. A recognized legacy Academy/Score High student can migrate only to its original venture. An existing account with no recognizable assignment requires administrator review; it cannot select a new venture itself.
- Staff accounts must be provisioned through Firebase Console or trusted Admin SDK tooling. The browser has no staff-provisioning permission. Before deployment, review existing privileged profiles against your real staff roster: these changes do not revoke roles already stored under the old rules.

## Enquiry handling

The shared form code saves these requests in `enquiryRequests`:

- JEE and NEET demo requests.
- The legacy registration/enrollment enquiry page and all eight course enrollment pages.
- Enterprise path enquiries, talent/hiring enquiries and Digital Solution project enquiries.

Each submission includes contact consent, a server timestamp, its course/interest and source page. Success appears after a successful save, with a reference ID. Failed saves retain the form values, and repeat submissions are blocked while a save is pending. Demo times are preferences that staff must confirm.

Existing Academy counselling requests stay in `counseling_requests`. The form now uses server timestamps and the inbox can read existing records. IT homepage employer leads continue to use their existing `itEmployerLeads` collection and IT CRM workflow.

## Staff follow-up

Open `enquiry-inbox.html` from the Enterprise workspace or either CRM navigation. Sign in through the employee portal when prompted.

- Active enterprise owners can manage all enquiry ventures.
- Active operations managers and business-development staff can manage their assigned venture and `managedVentures`.
- A marketing assignment also covers Digital Solution enquiries. Operations managers receive the central Enterprise path enquiries.
- Student, candidate, developer and specialist accounts do not receive access to this inbox.
- Academy-assigned enquiry managers can also manage existing Academy counselling requests.
- Staff can set New, Contacted, Scheduled or Closed status and save notes. These updates cannot replace a request's original contact information or venture. Request deletion is denied.

## Validation and release

`npm test` runs 12 local account recovery, membership and enquiry-validation tests. These passed.

`tests/browser-enquiries.cjs` exercises all 14 updated forms with mocked Firebase services, plus registration, inbox updates, safe rendering, logout and the mobile inbox layout. These passed in local Chrome. Run it with Playwright installed or set `PLAYWRIGHT_MODULE` to an available Playwright package, and optionally set `CHROME_PATH` to a Chrome executable. These browser tests do not prove production Firebase configuration.

`npm run test:rules` starts the Firestore emulator for the isolated `demo-kts` project and runs the regression suite in `tests/firestore-rules.test.cjs`. It uses the Firebase CLI through npx and requires a Java runtime supported by that CLI. This machine has no Java runtime, so the rules suite has not been executed. Do not treat the mocked tests as a substitute for it.

After the emulator suite passes, deploy only Firestore rules to the existing project using a Firebase-authenticated administrator environment:

```powershell
npx firebase-tools deploy --only firestore:rules --project kts-academy-16860
```

Publish the updated HTML/JS/CSS files through the website's existing hosting process. Then verify a real student/candidate signup, recovery after an interrupted profile save, a public enquiry, and staff follow-up under an allowed and disallowed account. The Android asset copies were not updated in this website change.
