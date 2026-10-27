const {chromium}=require('C:/Users/dell/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.route('https://**/*',route=>route.abort());
 const files=['index.html','aspire_ts.html','kts education center.html','kts group.html','kts_it_home.html','Score High.html','kts-digital-solution.html','kts-digital-solution-clients.html'];
 fs.mkdirSync('output/theme-review',{recursive:true});
 const results=[];
 for(const file of files){
  await page.goto('file:///'+path.resolve(file).replaceAll('\\','/'),{waitUntil:'domcontentloaded'});
  await page.waitForSelector('.venture-theme-toggle');
  for(const theme of ['light','dark']){
   if(await page.locator('html').getAttribute('data-venture-theme')!==theme)await page.locator('.venture-theme-toggle').click();
   await page.waitForTimeout(350);
   await page.screenshot({fullPage:true,path:`output/theme-review/${file.replace('.html','')}-${theme}.png`});
   const result=await page.evaluate(()=>({page:document.documentElement.dataset.venturePage,theme:document.documentElement.dataset.ventureTheme,panels:[...document.querySelectorAll('.hero-console,.aspire-scorecard,.hero-card,.system-preview,.talent-card')].map(el=>({class:el.className,background:getComputedStyle(el).background,color:getComputedStyle(el).color}))}));
      await page.setViewportSize({width:390,height:844});
   await page.waitForTimeout(350);
   const mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
   await page.screenshot({path:`output/theme-review/mobile-${file.replace('.html','')}-${theme}.png`});
   await page.setViewportSize({width:1440,height:1000});
   results.push({file,...result,mobileOverflow});
  }
 }
 fs.writeFileSync('output/theme-review/results.json',JSON.stringify(results,null,2));
 console.log(`Verified ${results.length} page/theme combinations; screenshots in output/theme-review`);
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
