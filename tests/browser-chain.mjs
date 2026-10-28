import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(process.env.CHAINLENS_RUNTIME_PACKAGE||import.meta.url),{chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1100}}),errors=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));const check=(name,value)=>{assert(value,name);checks.push(name)};
try{
 await page.goto('http://127.0.0.1:8765/?v=humanoid-17&view=chain',{waitUntil:'networkidle'});
 check('ten functional nodes',await page.locator('.atlas-nodes>button').count()===10);
 check('reducer default includes mechanism and real company rows',/精密减速器/.test(await page.locator('.chain-detail-head').innerText())&&await page.locator('[data-chain-expand]').count()===5);
 await page.locator('[data-chain-expand="green:reducer"]').click();check('expanded row preserves group scope',/谐波减速器及金属部件/.test(await page.locator('.chain-expanded').innerText()));
 await page.locator('.chain-expanded [data-claim="C01"]').click();check('full fact remains accessible',/2024-01-01 — 2024-12-31/.test(await page.locator('#modal').innerText()));await page.locator('#modal .close').click();
 await page.locator('[data-chain-tab="drivers"]').click();check('three financial drivers and counterconditions',await page.locator('.chain-driver-table article').count()===3&&/降价更快/.test(await page.locator('.chain-driver-table').innerText()));
 const d=page.waitForEvent('download');await page.locator('#export').click();check('chain export includes source and framework',/反向条件[\s\S]*1223423697/.test(await readFile(await(await d).path(),'utf8')));
 await page.locator('[data-chain-node="motor"]').first().click();await page.locator('[data-chain-tab="structure"]').click();await page.locator('.chain-route-check summary').first().click();check('motor is distinct from vision',/电机与驱动/.test(await page.locator('.chain-detail-head').innerText())&&/不等于供货|不证明客户/.test(await page.locator('.chain-route-grid').innerText()));
 await page.locator('[data-chain-tab="sources"]').click();await page.locator('[data-chain-retrieval="moons"]').click();check('MCP review issue and raw hash visible',/SHA-256/.test(await page.locator('#modal').innerText())&&/不可信指令/.test(await page.locator('#modal').innerText()));
 const raw=await page.locator('#modal a').getAttribute('href');check('raw MCP result retrievable', (await page.request.get('http://127.0.0.1:8765/'+raw)).status()===200);await page.locator('#modal .close').click();
 await page.locator('[data-chain-node="sensor"]').first().click();check('vision belongs to sensor',await page.locator('[data-chain-expand="orbbec:sensor"]').count()===1);await page.locator('#chain-evidence-filter').selectOption('facts');check('uncovered filter has explicit empty state',/尚无此类深度事实/.test(await page.locator('.chain-ledger').innerText()));await page.locator('#chain-evidence-filter').selectOption('all');
 await page.locator('[data-chain-node="hand"]').first().click();check('hand component does not become full hand',/灵巧手电机 · 非完整手/.test(await page.locator('.chain-ledger').innerText()));
 await page.locator('[data-chain-node="body"]').first().click();await page.locator('.chain-unresolved summary').click();check('evidence gap still accessible without becoming company membership',await page.locator('[data-claim="C09"]').count()===1&&await page.locator('[data-chain-expand="green:body"]').count()===0);
 await page.locator('[data-chain-expand="ubtech:body"]').click();await page.locator('.chain-expanded [data-chain-ai]').click();check('AI next step grounds to chosen company',/优必选/.test(await page.locator('.ai-query-answer').innerText()));
 await page.goto('http://127.0.0.1:8765/?v=humanoid-17&view=chain',{waitUntil:'networkidle'});await page.locator('.chain-detail-head [data-chain-compare]').click();check('comparison path opens selected pair',await page.locator('#pair-a').inputValue()==='green'&&await page.locator('#pair-b').inputValue()==='hds');
 await page.goto('http://127.0.0.1:8765/?v=humanoid-17&view=chain',{waitUntil:'networkidle'});await page.screenshot({path:fileURLToPath(new URL('../../链证_产业链深化_本地预览.png',import.meta.url)),fullPage:true});
 await page.setViewportSize({width:390,height:844});check('mobile has no page overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 check('no uncaught runtime errors',errors.length===0);
 await writeFile(new URL('../docs/产业链深化浏览器验证.json',import.meta.url),JSON.stringify({checkedAt:new Date().toISOString(),checks,errors},null,2));console.log(JSON.stringify({passed:checks.length,errors}));
}finally{await browser.close()}
