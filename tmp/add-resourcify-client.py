from pathlib import Path
import shutil
root=Path(__file__).resolve().parents[1]
src=root/'kts-digital-solution.html'
text=src.read_text(encoding='utf-8')
text=text.replace('<a href="#process">Our process</a>','<a href="#process">Our process</a><a href="kts-digital-solution-clients.html">Our clients</a>')
src.write_text(text,encoding='utf-8')
shutil.copyfile(Path('C:/Users/dell/Documents/ChatGPT/resourcify/resourcify-india-logo.svg'),root/'resourcify-india-logo.svg')
header=text[text.index('<header'):text.index('<main')]
header=header.replace('href="#solutions"','href="kts-digital-solution.html#solutions"').replace('href="#industries"','href="kts-digital-solution.html#industries"').replace('href="#process"','href="kts-digital-solution.html#process"').replace('href="#contact"','href="kts-digital-solution.html#contact"').replace('href="kts-digital-solution-clients.html"','href="kts-digital-solution-clients.html" aria-current="page"')
footer=text[text.index('<footer'):]
page='''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Our Clients | KTS Digital Solution</title><meta name="description" content="Meet KTS Digital Solution clients, including Resourcify India, a manpower services business with a website and CRM project in progress."><meta name="theme-color" content="#092b2b"><link rel="stylesheet" href="kts-digital-solution.css"><link rel="stylesheet" href="venture-theme.css"><script src="seo.js" defer></script><script src="venture-theme.js" defer></script><script src="kts-digital-solution.js" defer></script></head><body><a class="skip" href="#main">Skip to content</a>'''+header+'''
<main id="main"><section class="hero"><div class="wrap clients-intro"><p class="eyebrow">OUR CLIENTS</p><h1>Building the next step.<br><em>Together.</em></h1><p class="lead">Meet the businesses working with KTS Digital Solution to connect their digital presence and daily operations.</p></div></section>
<section class="wrap" aria-labelledby="client-heading"><div class="section-heading"><p class="eyebrow">CLIENT SPOTLIGHT</p><h2 id="client-heading">Resourcify India</h2></div><article class="card client-spotlight"><div class="client-logo-panel"><img src="resourcify-india-logo.svg" alt="Resourcify India logo" width="760" height="720"></div><div class="client-details"><span class="client-status">Project in progress</span><h3>Connecting people.<br>Supporting businesses.</h3><p>Resourcify India provides manpower to manufacturing plants, hotels, factories and other businesses.</p><p>We are working on a landing page and CRM for employee records, client firms and job openings.</p><ul class="client-services" aria-label="Project scope"><li>Business landing page</li><li>Employee and firm CRM</li><li>Job openings</li></ul></div></article><div class="actions"><a class="btn" href="kts-digital-solution.html#contact">Discuss your project ↗</a><a class="text-link" href="kts-digital-solution.html">Back to Digital Solution →</a></div></section></main>
'''+footer
(root/'kts-digital-solution-clients.html').write_text(page,encoding='utf-8')
css='''
/* Client showcase */
.clients-intro{padding:70px 0}.clients-intro .lead{max-width:660px}.client-spotlight{display:grid;grid-template-columns:minmax(220px,.8fr) 1.2fr;gap:48px;align-items:center}.client-logo-panel{background:#fff;border:1px solid #dce8e1;border-radius:12px;padding:30px;display:flex;align-items:center;justify-content:center}.client-logo-panel img{display:block;width:100%;max-width:300px;height:auto}.client-status{display:inline-block;border:1px solid var(--line);border-radius:100px;padding:6px 12px;font-size:12px;font-weight:700;color:var(--accent)}.client-services{display:flex;flex-wrap:wrap;gap:8px;padding:0!important;list-style:none}.client-services li{border:1px solid var(--line);border-radius:6px;padding:5px 10px;font-size:12px}.nav-links [aria-current="page"]{text-decoration:underline;text-underline-offset:6px}html[data-venture-theme="dark"] .client-status{color:#bcf4a7}@media(max-width:760px){.client-spotlight{grid-template-columns:1fr;gap:24px}.clients-intro{padding:45px 0}.client-logo-panel img{max-width:230px}}
'''
with (root/'kts-digital-solution.css').open('a',encoding='utf-8') as f:f.write(css)
print('Added client page, navigation link and logo.')
