(() => {
  const origin = 'https://www.ktsacademy.in';
  const pageData = {
    '/': ['KTS Academy | JEE & NEET Coaching in Etawah', 'Prepare for JEE and NEET with KTS Academy in Etawah. Explore batches, expert guidance, demo classes, and counselling.'],
    '/index.html': ['KTS Academy | JEE & NEET Coaching in Etawah', 'Prepare for JEE and NEET with KTS Academy in Etawah. Explore batches, expert guidance, demo classes, and counselling.'],
    '/impulse_jee.html': ['Impulse JEE Batch | IIT-JEE Coaching in Etawah', 'Explore the KTS Academy Impulse JEE Batch in Etawah, with structured preparation, mock tests, study material, and faculty support.'],
    '/impulse_neet.html': ['Impulse NEET Batch | NEET Coaching in Etawah', 'Explore the KTS Academy Impulse NEET Batch in Etawah, with structured preparation, mock tests, study material, and faculty support.'],
    '/momentum_jee.html': ['Momentum JEE Batch | KTS Academy Etawah', 'Explore the Momentum JEE Batch at KTS Academy, Etawah. View batch details, preparation support, and admission information.'],
    '/momentum_neet.html': ['Momentum NEET Batch | KTS Academy Etawah', 'Explore the Momentum NEET Batch at KTS Academy, Etawah. View batch details, preparation support, and admission information.'],
    '/power_jee.html': ['Power JEE Batch | KTS Academy Etawah', 'Explore the Power JEE Batch at KTS Academy, Etawah, including course details, mock-test support, and admissions information.'],
    '/power_neet.html': ['Power NEET Batch | KTS Academy Etawah', 'Explore the Power NEET Batch at KTS Academy, Etawah, including course details, mock-test support, and admissions information.'],
    '/Velocity_jee.html': ['Velocity JEE Batch | KTS Academy Etawah', 'Explore the Velocity JEE Batch at KTS Academy, Etawah. Get batch details, preparation support, and admission information.'],
    '/velocity_neet.html': ['Velocity NEET Batch | KTS Academy Etawah', 'Explore the Velocity NEET Batch at KTS Academy, Etawah. Get batch details, preparation support, and admission information.'],
    '/aspire_ts.html': ['ASPIRE NEET Test Series | KTS Academy', 'Practice for NEET with the ASPIRE Test Series from KTS Academy, featuring structured test preparation and performance support.'],
    '/kts%20education%20center.html': ['KTS Education Center | Computer Courses in Etawah', 'Explore computer and professional courses at KTS Education Center in Etawah, including ADCA, CCC, O-Level, and technical training.'],
    '/adca.html': ['ADCA Course in Etawah | KTS Education Center', 'Join the ADCA course at KTS Education Center in Etawah. Explore course content, practical learning, and admission information.'],
    '/ccc.html': ['CCC Course in Etawah | KTS Education Center', 'Explore the CCC course at KTS Education Center in Etawah, including course details and admission information.'],
    '/o%20level.html': ['O-Level Course in Etawah | KTS Education Center', 'Explore the O-Level program at KTS Education Center in Etawah, including course details and admission information.'],
    '/soft_skill.html': ['Soft Skills Training in Etawah | KTS Education Center', 'Build communication, confidence, and workplace skills with soft-skills training at KTS Education Center in Etawah.'],
    '/advance_tally.html': ['Advance Tally Course in Etawah | KTS Education Center', 'Learn Advance Tally at KTS Education Center in Etawah. Explore practical accounting training and course details.'],
    '/ai.html': ['Artificial Intelligence Course in Etawah | KTS Education Center', 'Explore the Artificial Intelligence course at KTS Education Center in Etawah, with practical learning and course guidance.'],
    '/block_chain_tech.html': ['Blockchain Technology Course in Etawah | KTS Education Center', 'Explore blockchain technology training at KTS Education Center in Etawah, with practical skills and course guidance.'],
    '/Cloud_computing.html': ['Cloud Computing Course in Etawah | KTS Education Center', 'Explore cloud computing training at KTS Education Center in Etawah, with practical skills and course guidance.'],
    '/cybersecurity.html': ['Cybersecurity Course in Etawah | KTS Education Center', 'Learn cybersecurity skills at KTS Education Center in Etawah. Explore practical training and course information.'],
    '/data_science.html': ['Data Science Course in Etawah | KTS Education Center', 'Explore data science training at KTS Education Center in Etawah, with practical learning and course guidance.'],
    '/Digital_marketing.html': ['Digital Marketing Course in Etawah | KTS Education Center', 'Learn digital marketing at KTS Education Center in Etawah. Explore practical training and course information.'],
    '/graphic_designing.html': ['Graphic Designing Course in Etawah | KTS Education Center', 'Learn graphic designing at KTS Education Center in Etawah. Explore practical training and course information.'],
    '/java.html': ['Java Course in Etawah | KTS Education Center', 'Learn Java programming at KTS Education Center in Etawah. Explore practical programming training and course information.'],
    '/mobile_app_dev.html': ['Mobile App Development Course in Etawah | KTS Education Center', 'Learn mobile app development at KTS Education Center in Etawah. Explore practical training and course information.'],
    '/project_management.html': ['Project Management Course in Etawah | KTS Education Center', 'Learn project management at KTS Education Center in Etawah. Explore practical training and course information.'],
    '/python.html': ['Python Course in Etawah | KTS Education Center', 'Learn Python programming at KTS Education Center in Etawah. Explore practical training and course information.'],
    '/Web_developement.html': ['Web Development Course in Etawah | KTS Education Center', 'Learn web development at KTS Education Center in Etawah. Explore practical training and course information.'],
    '/kts%20group.html': ['KTS Enterprise | Education and Talent Solutions', 'Explore KTS Enterprise services, including education, talent solutions, and IT services in Etawah.'],
    '/kts_it_home.html': ['KTS IT Solutions | IT Services and Hiring', 'Explore IT services and hiring support from KTS IT Solutions.'],
    '/kts_talent_solution.html': ['KTS Talent Solutions | Recruitment and Hiring Support', 'Explore recruitment and talent-hiring support from KTS Talent Solutions.'],
    '/Score%20High.html': ['Score High | Banking Exam Preparation', 'Prepare for banking exams with Score High: practice resources, mock tests, and exam-preparation support.']
  };

  const key = window.location.pathname === '/' ? '/' : window.location.pathname;
  const [title, description] = pageData[key] || ['KTS Academy', 'Explore KTS Academy courses, coaching, and student support.'];
  const canonicalUrl = `${origin}${key === '/' ? '/' : key}`;
  const imageUrl = `${origin}/KTS%20EDUCENTER%20LOGO.png`;

  const addMeta = (attribute, value, content) => {
    let tag = document.head.querySelector(`meta[${attribute}="${value}"]`);
    if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attribute, value); document.head.appendChild(tag); }
    tag.setAttribute('content', content);
  };

  document.title = title;
  addMeta('name', 'description', description);
  addMeta('property', 'og:title', title);
  addMeta('property', 'og:description', description);
  addMeta('property', 'og:type', 'website');
  addMeta('property', 'og:url', canonicalUrl);
  addMeta('property', 'og:image', imageUrl);
  addMeta('name', 'twitter:card', 'summary_large_image');

  let canonical = document.head.querySelector('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
  canonical.href = canonicalUrl;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'KTS Academy',
    url: origin,
    logo: imageUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3 RR Sales Near SBI Bank, Chougurgi',
      addressLocality: 'Etawah',
      postalCode: '206001',
      addressCountry: 'IN'
    }
  };
  const schemaTag = document.createElement('script');
  schemaTag.type = 'application/ld+json';
  schemaTag.textContent = JSON.stringify(schema);
  document.head.appendChild(schemaTag);
})();
