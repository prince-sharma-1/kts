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

## Sample-data notice

This version is a front-end sample. Changes are saved in the current browser using `localStorage` under `ktsEducationCrmSampleV1`. It is not yet connected to Firebase and should not be used for sensitive or production student information until authentication, Firestore storage and security rules are added.
