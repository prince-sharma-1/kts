# KTS Enterprise Operations workspace

## What changed

- `kts-enterprise-operations.html` is the shared staff workspace linked from the footer of `kts group.html`.
- `kts-enterprise-operations.js` stores Academy operations, Digital projects, and hotel prospects in `enterpriseOperations` in the existing Firebase project `kts-academy-16860`.
- Academy student/course data remains in its current Firestore collections (`users`, `courseEntitlements`, `courseProgress`, etc.). This is one Firestore database with separate collections and role-scoped access.
- The Digital Operations dashboard export can be imported. Imported projects keep their project checklists; imported hotel prospects keep their sales stage and follow-up date.
- `firestore.rules` adds staff-only access and prevents users from changing their own `role` field.

## Before staff can use it

1. From this project folder, deploy the updated `firestore.rules` to the existing Firebase project `kts-academy-16860` with Firebase CLI: `firebase deploy --only firestore:rules` (after CLI login). `.firebaserc` and `firebase.json` now point this deployment at the existing Academy project.
2. In Firebase Console (or a trusted Admin SDK process), set the `role` field on each staff member's `users/{uid}` document. Allowed roles are `enterprise_owner`, `operations_manager`, `business_development`, `developer`, and `specialist`. The staff member must already have a Firebase Auth account. Do not grant a role through the client app.
3. Host the KTS web project over HTTPS. Firebase module imports do not run reliably from a `file://` URL.
4. Open `kts group.html` and use **Employee sign in** in the footer, or visit `employee-login.html`. Sign in with the approved staff account. The portal has no employee self-registration; a trusted KTS administrator must create the Firebase Auth account and assign its staff role in `users/{uid}` first.

Role access:

- `enterprise_owner`, `operations_manager`: Academy operations, Digital projects, hotel leads, and overview.
- `business_development`: hotel leads and overview.
- `developer`, `specialist`: Digital projects and overview.

## Move records from the earlier Digital dashboard

The earlier `KTS-Operations-Dashboard.html` stored data in that browser's local storage. A hosted website cannot read that browser store automatically. In the same browser/profile where the old dashboard data exists:

1. Open the old dashboard and choose **Export data**.
2. Sign in to the unified Staff workspace as `enterprise_owner` or `operations_manager`.
3. Choose **Import Digital dashboard backup** and select the downloaded JSON file.
4. Confirm the imported projects and leads in the Digital Projects and Hotel Sales Pipeline sections.

Importing the same backup again updates the same generated project/lead document IDs rather than creating duplicates. The old dashboard's sample records are marked as samples; remove them from the unified workspace if they are not live prospects or projects.

## Shared record shape

Each `enterpriseOperations` document has `organization: "KTS Enterprise"`, `venture` (`academy` or `digital`), a record `type`, the record `data`, `createdBy`, and Firestore timestamps. Academy operational entries cover classes/batches, faculty, student follow-up references, tests/CBT, facilities, issues, and daily reports. Use student IDs or batch references and avoid unnecessary sensitive details in notes.
