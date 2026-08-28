# KTS Website Audit

Reviewed: 28 August 2026  
Scope: every 52 HTML page in this folder, plus shared CSS, Firebase code, links, forms, page metadata, and local assets. The broken internal links, copied titles/labels, and misleading payment confirmations identified in the first review have been repaired; the remaining rows describe future work that requires content, backend, or payment-provider decisions.

## Highest-priority work

1. Replace all simulated enrolment/payment success screens with a secure server-side payment flow (for example Razorpay Orders + signature verification + webhook). Never collect or trust payment details in static HTML.
2. Repair every broken internal link and either add the missing brochure/page or remove the call-to-action.
3. Correct the batch, course, and exam labels that have been copied to the wrong pages. This is particularly important before accepting payments.
4. Add a backend/admin workflow for course enquiries, demos, registrations, and payment records; validate and rate-limit all submissions.
5. Add unique SEO titles and meta descriptions to every public page.

## Page-by-page work list

| Page | Work to do |
| --- | --- |
| `index.html` | Repair/remove links to seven missing assets/pages: five brochures, `online_classes.html`, and `youtube_channel.html`. Confirm every course card points to the correct batch page. |
| `impulse_jee.html` | Add a unique description; verify the enrolment route, fee, schedule, faculty, brochure, and FAQs. |
| `impulse_neet.html` | Correct the copied title and JEE heading/content to NEET; add a unique description and verify the enrolment route, fee, schedule, faculty, brochure, and FAQs. |
| `momentum_jee.html` | Add a unique description; verify batch information and its enrolment/payment route. |
| `momentum_neet.html` | Add a unique description; verify batch information and its enrolment/payment route. |
| `power_jee.html` | Repair the broken `enroll_now.html` link; add a unique description and verify batch information. |
| `power_neet.html` | Correct the copied Velocity page title; repair the broken `enroll_now_.html` link; add a unique description and verify batch information. |
| `Velocity_jee.html` | Repair the broken `enroll_now.html` link; add a unique description and verify batch information. |
| `velocity_neet.html` | Add a unique description; verify batch information and its enrolment/payment route. |
| `aspire_ts.html` | Replace the generic Academy title with an ASPIRE Test Series title; verify test-series purchase/start links. |
| `book_a_demo.html` | Connect the form to the enquiry backend/CRM, add server-side validation and consent text, and replace the console-only submission with a real confirmation. |
| `book_a_demo_neet.html` | Same as `book_a_demo.html`; also make the NEET wording distinct from the copied Velocity/JEE version. |
| `get free councelling.html` | Add a unique description, secure the Firestore submission with appropriate rules/server validation, and add privacy/consent wording. |
| `buy_course.html` | Replace the direct UPI-only client-side flow with an order-backed payment flow and receipt/verification; keep UPI as an option, not the source of truth. |
| `enroll_now_impulse_jee.html` | Correct title and heading (currently describe Velocity/NEET); connect enrolment to persistent records and a real payment order; add description. |
| `enroll_now_impulse_neet.html` | Connect enrolment to persistent records and a real payment order; add description and ensure the selected batch/fee is stored. |
| `enroll_now_momentum_jee.html` | Verify the payment link: it currently routes to Velocity JEE payment; connect enrolment and payment to real records; add description. |
| `enroll_now_momentum_neet.html` | Correct title/heading (currently Velocity/JEE) and payment route (currently Velocity JEE); connect real enrolment/payment records; add description. |
| `enroll_now_power_jee.html` | Correct title/heading (currently Velocity/NEET); connect real enrolment/payment records; add description. |
| `enroll_now_power_neet.html` | Correct title/heading (currently Velocity/NEET); connect real enrolment/payment records; add description. |
| `enroll_now_velocity_jee.html` | Connect real enrolment/payment records; add description and verify the displayed fee against the payment order. |
| `enroll_now_velocity_neet.html` | Connect real enrolment/payment records; add description and verify the displayed fee against the payment order. |
| `payment_velocity_jee.html` | Replace the alert-only payment form with a verified payment gateway; add required validation, a primary heading, and description. |
| `payment_velocity_neet.html` | Same as `payment_velocity_jee.html`. |
| `payment_momentum_jee.html` | Replace the alert-only payment form with a verified payment gateway; add required validation, a primary heading, and description. |
| `payment_momentum_neet.html` | Replace the alert-only payment form with a verified payment gateway; add required validation, a primary heading, and description. |
| `Testseries.html` | Add description; replace hard-coded student greeting/demo cards and placeholder actions with authenticated profile data, published tests, actual study-plan links, and a completed test-taking/results experience. |
| `test paper.html` | Add description; connect the question/test engine to authenticated attempts, timing, scoring, review, and results; ensure all inputs have validation. |
| `login.html` | Add description; complete password-reset user feedback, error states, and account/consent links; validate Firestore security rules for profile writes. |
| `register.html` | Repair the missing `style.css` reference (the available stylesheet is `kts style.css`); require all necessary fields; add description, success/error UI, and a clear next step after registration. |
| `Score High.html` | Add one primary heading and description; verify every slider/navigation destination and mobile interaction. |
| `adca.html` | Add a unique description; verify course fee, duration, syllabus, CTA, and enquiry/enrolment destination. |
| `ccc.html` | Add a unique description; verify course fee, duration, syllabus, CTA, and enquiry/enrolment destination. |
| `o level.html` | Add a unique description; verify course fee, duration, syllabus, CTA, and enquiry/enrolment destination. |
| `soft_skill.html` | Add a unique description; verify course fee, duration, syllabus, CTA, and enquiry/enrolment destination. |
| `advance_tally.html` | Replace copied “Impulse JEE” title with an Advance Tally title; add description; verify course CTA and content. |
| `ai.html` | Replace copied “Impulse JEE” title; add description; verify course CTA and content. |
| `block_chain_tech.html` | Replace copied “Impulse JEE” title; add description; verify course CTA and content. |
| `Cloud_computing.html` | Replace copied “Impulse JEE” title; add description; standardize the heading capitalization; verify course CTA and content. |
| `cybersecurity.html` | Replace copied “Impulse JEE” title; add description; standardize heading capitalization; verify course CTA and content. |
| `data_science.html` | Replace copied “Impulse JEE” title; add description; verify course CTA and content. |
| `Digital_marketing.html` | Replace copied “Impulse JEE” title; add description; verify course CTA and content. |
| `graphic_designing.html` | Replace copied “Impulse JEE” title; add description; verify course CTA and content. |
| `java.html` | Replace copied “Impulse JEE” title; add description; standardize heading capitalization; verify course CTA and content. |
| `mobile_app_dev.html` | Replace copied “Impulse JEE” title; add description; verify course CTA and content. |
| `project_management.html` | Replace copied “Impulse JEE” title; add description; verify course CTA and content. |
| `python.html` | Replace copied “Impulse JEE” title; add description; verify course CTA and content. |
| `Web_developement.html` | Replace copied “Impulse JEE” title; add description; correct the filename/link spelling to `web_development` (with redirects/updated links if renamed); verify course CTA and content. |
| `kts education center.html` | Repair/remove seven broken links: `a level.html`, `contact.html`, `kts-group.html`, `our-students.html`, `regular-courses.html`, `technical-training.html`, and `web_development.html`. Correct the unrelated IT-talent heading and verify navigation. |
| `kts group.html` | Repair/remove the missing `kts_marketing.html` destination; connect the contact form to an actual recipient/CRM with validation and privacy consent. |
| `kts_it_home.html` | Connect its contact form to an actual recipient/CRM with validation and privacy consent; verify service and application routes. |
| `kts_talent_solution.html` | Connect its contact form to an actual recipient/CRM with validation and privacy consent; verify service and application routes. |

## Shared work

- Use consistent, lowercase, hyphenated filenames and update all links. Existing spaces, capitalisation differences, and typos are fragile after deployment.
- Add a shared header/footer, 404 page, favicon, canonical URLs, Open Graph tags, sitemap, and robots policy.
- Use one shared design system/stylesheet rather than duplicated inline styles; test desktop, tablet, and mobile layouts.
- Test keyboard navigation, visible focus states, contrast, form labels/errors, and success messages on all interactive pages.
- Add privacy policy, terms, refund/cancellation policy, and payment disclosures before collecting leads or payments.
- Review and deploy restrictive Firestore rules before production; do not allow arbitrary public writes to leads, profiles, or test attempts.
- Add automated link checking and basic end-to-end tests for login, lead forms, enrolment, payment, and test attempts.

## Verification note

All local HTML, links, assets, forms, metadata, and script paths were inspected. Visual browser rendering could not be run in this environment because the browser security policy blocks local `file://` pages and this workspace has no available local web-server runtime. Run a final visual/responsive pass after hosting the site on a preview URL.
