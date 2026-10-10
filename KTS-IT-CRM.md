# KTS IT Solutions CRM

## Entry points

- Home page: `kts_it_home.html`
- Staff sign-in: `employee-login.html?redirect=kts-it-crm.html`
- CRM workspace: `kts-it-crm.html`

## Access

The CRM accepts authenticated employees with one of these roles:

- `enterprise_owner`
- `operations_manager`
- `business_development`
- `developer`
- `specialist`

The employee must also have `venture: "it"` or include `"it"` in `managedVentures` in their Firestore user profile.

## Database

The shared CRM state is stored at:

`itCrm/main`

It contains separate candidate, client, role, interview and task collections inside the document state. Firestore live synchronization updates other logged-in sessions automatically.

## Included features

- Recruitment overview dashboard
- Candidate hiring pipeline
- Client company records
- Open role tracking
- Interview scheduling
- Employee task completion
- Search and responsive mobile navigation
- Persistent light and dark themes
- Firebase authentication, venture isolation and logout

## Security

Firestore rules permit access only to approved staff assigned to the IT venture. Education CRM data remains stored separately under `educationCrm/main`.

## IT homepage upgrade

The existing navy, cyan and gold design remains unchanged. The homepage now includes:

- SEO canonical, social sharing metadata, favicon and employment-agency structured data
- Filterable technology talent categories with accessible status updates
- FAQ section for employers and candidates
- Active navigation state and improved mobile menu dismissal
- Reduced-motion-aware reveal effects and back-to-top control
- Improved form validation feedback
- Direct candidate, Staff CRM and venture navigation paths

## Priority hiring-system upgrade

### Employer enquiries

The employer form on `kts_it_home.html` now writes validated records to the Firestore collection `itEmployerLeads`. The IT CRM displays these under **Employer leads**, where staff can move a request from `new` to `contacted` and `qualified`.

### Candidate profiles and résumés

IT candidates are routed to `it-candidate-profile.html` after registration or login. Structured candidate data is saved under `itCandidateProfiles/{firebaseAuthUid}`. Résumés are uploaded to `it-resumes/{firebaseAuthUid}/` in Firebase Storage and limited to PDF, DOC or DOCX files smaller than 5 MB.

Online candidate applications appear automatically inside the IT CRM candidate pipeline. Staff can advance them through New, Shortlisted, Interview and Placed stages.

### Five-stage screening

The public IT homepage now explains the complete process:

1. Role calibration
2. Profile verification
3. Skill screening
4. Communication fit
5. Client validation

### Specialist hiring pages

- `hire-java-developers.html`
- `hire-react-developers.html`
- `hire-devops-engineers.html`
- `hire-data-ai-professionals.html`
- `hire-cybersecurity-professionals.html`

Each page has its own title, description, canonical URL, skill coverage, evaluation explanation and employer call to action.
