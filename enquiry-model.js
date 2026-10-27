const ventures = new Set(['academy', 'education', 'scorehigh', 'it', 'marketing', 'digital', 'enterprise']);
const types = new Set(['demo', 'enrollment', 'general', 'hiring', 'project']);
const sources = new Set(['book_a_demo.html', 'book_a_demo_neet.html', 'register.html', 'kts group.html', 'kts_talent_solution.html', 'kts-digital-solution.html']);
export const enrollmentSources = Object.fromEntries(['impulse', 'momentum', 'power', 'velocity'].flatMap(batch => ['jee', 'neet'].map(exam => [`enroll_now_${batch}_${exam}.html`, `${batch[0].toUpperCase()}${batch.slice(1)} ${exam.toUpperCase()}`])));
Object.keys(enrollmentSources).forEach(source => sources.add(source));
export function validateEnquiry(input) {
  const limits = { name: 100, email: 150, phone: 18, interest: 200, message: 1000 };
  const data = {};
  for (const [key, limit] of Object.entries(limits)) {
    data[key] = String(input[key] || '').trim();
    if (data[key].length > limit) throw new Error(`${key} is too long (maximum ${limit} characters).`);
  }
  if (data.name.length < 2) throw new Error('Enter your full name (at least 2 characters).');
  if (data.email && !/^[^ @]+@[^ @]+\.[^ @]+$/.test(data.email)) throw new Error('Enter a valid email address.');
  if (data.phone && !/^[+0-9() -]{8,18}$/.test(data.phone)) throw new Error('Enter a valid phone number (8–18 characters).');
  if (!data.email && !data.phone) throw new Error('Enter a phone number or email address so KTS can contact you.');
  if (data.interest.length < 2) throw new Error('Select a course or tell us what you need.');
  if (!ventures.has(input.venture) || !types.has(input.type) || !sources.has(input.source)) throw new Error('This enquiry form is not configured correctly. Please contact KTS.');
  if (input.consent !== true) throw new Error('Please agree to be contacted about your enquiry.');
  return { ...data, venture: input.venture, type: input.type, source: input.source, status: 'new', consent: true };
}

export function enquiryVentures(profile) {
  if (profile.active === false) return [];
  if (profile.role === 'enterprise_owner') return [...ventures];
  if (!['operations_manager', 'business_development'].includes(profile.role)) return [];
  const assigned = new Set([profile.venture, ...(Array.isArray(profile.managedVentures) ? profile.managedVentures : [])]);
  if (assigned.has('marketing')) assigned.add('digital');
  if (profile.role === 'operations_manager') assigned.add('enterprise');
  return [...assigned].filter(venture => ventures.has(venture));
}
