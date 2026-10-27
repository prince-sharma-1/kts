# Account and enquiry changes

Implemented on 27 October 2026. Java 21 is installed, the real Firestore emulator tests passed, and Firestore rules were deployed to `kts-academy-16860`. The active release was read back and its source hash exactly matches the emulator-tested local rules. Website HTML/JS/CSS publishing remains a separate hosting step.

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

The existing counselling save path was also exercised in Chrome. A pre-existing template-string syntax error that prevented the Enterprise operations module from loading was repaired; all 29 top-level JavaScript files now parse. The browser suite includes the Enterprise Digital projects view as a regression check.

`npm run test:rules` starts the Firestore emulator for the isolated `demo-kts` project and runs the regression suite in `tests/firestore-rules.test.cjs`. The suite passed all 11 permission scenarios (12 Node tests including the parent), with zero failures and zero skipped tests, using Eclipse Temurin Java 21.0.12.1, Firebase CLI 15.34.1 and Firestore Emulator 1.22.0. Expected permission-denied responses in the logs are the negative access tests.

The installed Java directory is `C:\Program Files\Eclipse Adoptium\jdk-21.0.12.101-hotspot`. If an already-open terminal cannot find Java, open a new terminal or set `JAVA_HOME` to that directory and add its `bin` directory to the current process's `Path`.

The following rules-only deployment completed successfully through the signed-in Firebase account:

```powershell
npx firebase-tools deploy --only firestore:rules --project kts-academy-16860
```

Active release: `projects/kts-academy-16860/releases/cloud.firestore`.
Ruleset: `b223e7b7-1f5c-4673-a412-8ca93715962c`.
Verified SHA-256: `AE3C23B2D4D0861C2E18DD9542DCFC4EBBB2442B3B45303BE6CCCBEFEFA8A1AA`.
The deployment and test record is saved in `output/firestore-rules-verification.json`. `tests/verify-firestore-release.cjs` performs the authenticated read-only release/hash check using the installed CLI package specified by `FIREBASE_TOOLS_ROOT`.

Publish the updated HTML/JS/CSS files through the website's existing hosting process. Then verify a real student/candidate signup, recovery after an interrupted profile save, a public enquiry, and staff follow-up under an allowed and disallowed account. The Android asset copies were not updated in this website change.
