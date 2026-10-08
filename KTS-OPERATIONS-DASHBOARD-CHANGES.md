# KTS Operations Dashboard — Change Log

Last updated: 8 October 2026

## Overview

This document records the employee-access and operations-dashboard work completed for KTS Enterprise. The dashboard uses Firebase Authentication and Cloud Firestore to provide role-based staff access, daily operational tracking, task completion, and dated project reporting.

## Employee account provisioned

- Employee: Yash Bhadauriya
- Work email: `yashbhadauriyaofficial@gmail.com`
- Role: `operations_manager`
- Primary venture: `academy`
- Managed ventures: `academy` and `education`
- Account status: active
- Firebase Authentication and the matching `users/{uid}` Firestore profile were created.
- The temporary password is intentionally not stored in this file.

## Employee login and dashboard access

- The employee portal validates the authenticated user's Firestore role before granting access.
- Approved staff roles are:
  - `enterprise_owner`
  - `operations_manager`
  - `business_development`
  - `developer`
  - `specialist`
- Approved employees are directed to `kts-enterprise-operations.html`.
- Student accounts remain separate from employee operations data.
- Venture membership checks prevent ordinary candidate and student accounts from crossing into another venture.
- Staff profiles can use their assigned `managedVentures` scope without changing the user's primary venture.

Relevant files:

- `employee-login.html`
- `employee-login.js`
- `venture-login.js`
- `kts-enterprise-operations.html`
- `kts-enterprise-operations.js`
- `firestore.rules`

## Task completion controls

- Academy operational records and Digital projects now have a clear **Completed** checkbox.
- Employees with edit permission can mark work completed or reopen it.
- Project delivery-checklist items have individual completion checkboxes.
- Checking a project task changes its state to `Done`.
- Unchecking a project task changes its state to `Not started`.
- Completed Academy records use the `Done` status.
- Completed Digital projects use the `Completed` status.
- Reopening previously approved work clears its approval information so it can be reviewed again.
- All changes are saved to the existing `enterpriseOperations` Firestore collection.

## Daily Tracker

A new **Daily tracker** section was added to the Operations Dashboard sidebar.

### Daily controls

- Select a tracking date.
- Filter tasks by employee/owner.
- Add a new daily task.
- Open a pre-filled closing-report form.
- Carry unfinished overdue work forward to the selected date.

### Daily statistics

- Total scheduled work
- Pending work
- Completed work
- Completion percentage
- Blocked tasks
- Overdue tasks

### Daily task groups

- Classes and batches
- Faculty and staff
- Student follow-up
- Tests and CBT
- Facilities
- Complaints and incidents
- Closing reports

### Daily performance and approval

- A progress bar shows completion for the selected day.
- A seven-day summary shows completed-versus-scheduled work.
- Employees can mark each visible task completed or unfinished.
- Operations Managers and Enterprise Owners can approve completed work.
- Approval records the manager and approval time.
- Manager-controlled carry-forward moves overdue unfinished tasks to the selected day.
- The closing-report form records completed work, pending items, blockers, approvals, and next-day priorities.

## Project Reports

Digital projects now contain a persistent **Project reports** history.

### Employee report form

Employees with project-edit permission can record:

- Reporting date
- Current progress percentage
- Hours or effort used
- Work completed during the reporting period
- Next planned work
- Blockers or risks
- Evidence or document links

Each report stores its author, creation time, progress, content, and approval status. New reports are appended to the project rather than replacing previous reports.

### Manager review

- Operations Managers and Enterprise Owners can review reports awaiting approval.
- A manager can add remarks while approving a report.
- Approved reports display an approval badge.
- Manager name, remarks, and approval time remain in the report history.
- The latest submitted progress percentage also updates the project's current progress value.

## Firestore data locations

Employee profiles:

```text
users/{firebaseUserUid}
```

Operations records, daily tasks, Digital projects, delivery checklists, and project-report history:

```text
enterpriseOperations/{recordId}
```

Project reports are stored inside the corresponding Digital project's `data.reports` array. Daily operational records continue to use their existing type, owner, due date, status, approval, and notes fields.

## Permission behaviour

- Enterprise Owners and Operations Managers can manage Academy records and Digital projects.
- Developers and Specialists can update permitted Digital project records and submit project reports.
- Business Development employees remain limited to the sales/lead workspace.
- Student course data remains separate and governed by its existing user-scoped Firestore rules.
- Dashboard controls are hidden or disabled when the signed-in role lacks permission.

## Validation completed

- JavaScript syntax validation passed with `node --check`.
- Git whitespace/error validation passed with `git diff --check`.
- Existing Firebase role and Firestore access checks were retained.
- No temporary employee password was written into project documentation.

## Deployment note

The code changes currently exist in the local project workspace. To make them available on the public website, deploy the updated site files and any changed Firestore rules required by the target Firebase environment.

