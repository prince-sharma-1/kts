# Banking Test Portal database

The portal uses the existing Firebase project (`kts-academy-16860`) with Cloud Firestore.

## Collections

| Collection | Purpose |
| --- | --- |
| `users` | Student profile created at registration. |
| `tests` | Tests that an administrator publishes. |
| `testAttempts` | Immutable record made each time a signed-in student starts a test. |

## Test document example

Create documents in the `tests` collection with fields such as:

```json
{
  "title": "SBI PO Prelims Mock Test #08",
  "exam": "SBI PO",
  "type": "Full Length",
  "questionCount": 100,
  "durationMinutes": 60,
  "published": true,
  "createdAt": "Firestore server timestamp"
}
```

## Enable it

1. In Firebase Console, create the **Cloud Firestore** database for `kts-academy-16860`.
2. Deploy the access policy in `firestore.rules` from the Firebase Console's **Rules** tab.
3. Create test documents in the `tests` collection through the Firebase Console or an admin dashboard.

The portal preserves its demo test cards until the tests list is connected to an administrator workflow. It now requires a signed-in Firebase user to start a test and saves attempts in `testAttempts`.
