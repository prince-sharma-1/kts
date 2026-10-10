# KTS Education Center — Sample CRM

Created: 10 October 2026

## Files

- `kts-education-crm.html` — CRM application shell and navigation
- `kts-education-crm.css` — responsive KTS Education Center interface
- `kts-education-crm.js` — sample records, interactions and browser-local persistence

## Included modules

- Dashboard with admissions, students, outstanding fees and task metrics
- Enquiry pipeline with source, stage, owner and next follow-up
- Enquiry creation, editing and conversion into a student
- Student records with batch, status and course progress
- Fee ledger with totals, collections, balances and payment recording
- Follow-up task creation and completion
- Search, stage filters and responsive mobile navigation

## Employee access

- The CRM now requires Firebase employee authentication.
- Access is granted only to active `enterprise_owner` or `operations_manager` profiles that have `education` as their primary venture or inside `managedVentures`.
- Yash Bhadauriya's existing `operations_manager` profile already includes the Education Center, so it is authorized without creating a duplicate account.
- The employee login page supports a safe redirect back to `kts-education-crm.html` after successful authentication.
- The CRM header displays the authenticated employee's name, initials and role instead of a hard-coded administrator.
- The sidebar now includes a working Firebase Sign out button and a return link to KTS Enterprise Operations.
- The KTS Education Center footer routes employees through the employee login page and safely returns them to the CRM.
- Student rows now include an Edit action for name, phone, course, batch, joining date, status and course progress.
- Student edits use the same `educationCrm/main` Firestore synchronization path as new student records.

## Sample-data notice

The CRM is now configured to synchronize its complete state with Firestore at `educationCrm/main`. On the first authorized load, existing browser data under `ktsEducationCrmSampleV1` is migrated into that document if the Firebase document does not yet exist. Later changes are written to both Firestore and the browser cache.

The updated `firestore.rules` was deployed to Firebase project `kts-academy-16860` on 10 October 2026. Active Education Center Operations Managers and Enterprise Owners can now read and update `educationCrm/main`; deletion remains disabled.
