import {chromium} from '@playwright/test';
import {mkdir, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import config from '../site.config.json' with {type:'json'};

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root,'verification');
await mkdir(output,{recursive:true});
const base = `http://127.0.0.1:4173/${config.projectName}/`;
const browser = await chromium.launch({channel:'chrome',headless:true});
const errors = [];
const failed = [];
const results = [];
try {
  const context = await browser.newContext({viewport:{width:1440,height:1000},locale:'ja-JP',colorScheme:'light'});
  const page = await context.newPage();
  page.on('pageerror',error=>errors.push(error.message));
  page.on('response',response=>{if(response.status()>=400) failed.push({url:response.url(),status:response.status()});});
  async function noOverflow(label) {
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1),false,`${label}: horizontal overflow`);
    results.push(`${label}: no horizontal overflow`);
  }
  await page.goto(base,{waitUntil:'networkidle'});
  await page.getByRole('heading',{level:1,name:config.title,exact:true}).waitFor();
  await page.screenshot({path:path.join(output,'home-desktop.png'),fullPage:true});
  await noOverflow('Desktop home');
  await page.getByRole('button',{name:'説明書を検索',exact:true}).click();
  await page.getByLabel('検索する言葉').fill('マッチ');
  await page.getByRole('dialog').getByRole('link',{name:/VRでの煙管の使い方/}).click();
  await page.waitForURL('**/docs/ritual/');
  await page.getByRole('heading',{name:'VRでの煙管の使い方',exact:true}).waitFor();
  assert.equal(await page.locator('dialog').evaluate(element=>element.open),false);
  results.push('Japanese search: query, result navigation, dialog close');
  await page.screenshot({path:path.join(output,'ritual-desktop.png'),fullPage:true});
  await page.keyboard.press('Control+k');
  await page.getByLabel('検索する言葉').fill('abcxyz該当なし');
  await page.getByRole('status').filter({hasText:'0ページ'}).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').evaluate(element=>element.open),false);
  results.push('Keyboard shortcut, zero results, Escape close');
  await page.goto(`${base}docs/placement/`,{waitUntil:'networkidle'});
  await noOverflow('Desktop placement');
  await page.screenshot({path:path.join(output,'placement-desktop.png'),fullPage:true});
  await page.getByRole('button',{name:/モードを切り替え/}).click();
  await page.screenshot({path:path.join(output,'placement-theme-toggle.png'),fullPage:true});
  results.push('Theme toggle');
  await page.setViewportSize({width:390,height:844});
  await page.goto(base,{waitUntil:'networkidle'});
  await noOverflow('Mobile home');
  await page.screenshot({path:path.join(output,'home-mobile.png'),fullPage:true});
  await page.getByRole('button',{name:'ナビゲーションバーを開く'}).click();
  await page.getByRole('link',{name:'導入手順',exact:true}).filter({visible:true}).click();
  await page.waitForURL('**/docs/getting-ready/');
  await noOverflow('Mobile guide');
  results.push('Mobile navigation to guide');
  await page.screenshot({path:path.join(output,'guide-mobile.png'),fullPage:true});
  await page.getByRole('button',{name:'説明書を検索',exact:true}).click();
  await page.getByLabel('検索する言葉').fill('診断ログ');
  await page.getByRole('dialog').getByRole('link',{name:/^診断ログの保存とエラーの報告/}).waitFor();
  await noOverflow('Mobile search');
  await page.screenshot({path:path.join(output,'search-mobile.png'),fullPage:true});
  results.push('Mobile search');
  // Both decoded pixels and layout matter: a fixed HTML height can stretch a
  // screenshot on a narrow screen even when every image request succeeds.
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({width, height:900});
    for (const slug of ['getting-ready', 'install', 'placement', 'hand-poses']) {
      await page.goto(`${base}docs/${slug}/`, {waitUntil:'networkidle'});
      const tabs = page.getByRole('tab');
      const count = await tabs.count();
      const expectedTabs = slug === 'getting-ready' ? 0 : slug === 'install' ? 2 : 3;
      assert.equal(count, expectedTabs, slug);
      for (let stage = 0; stage < Math.max(count, 1); stage++) {
        if (count) await tabs.nth(stage).click();
        const pictures = page.locator('article figure img:visible');
        assert.ok(await pictures.count(), `${slug}: no screenshots`);
        for (const picture of await pictures.all()) {
          await picture.scrollIntoViewIfNeeded();
          const size = await picture.evaluate(async img => {
            await img.decode();
            const rect = img.getBoundingClientRect();
            return [rect.width, rect.height, img.naturalWidth, img.naturalHeight];
          });
          const [w, h, originalW, originalH] = size;
          assert.ok(w > 0 && Math.abs(h - w * originalH / originalW) < 1, `${slug} at ${width}: ${size}`);
        }
        if (slug === 'install' || slug === 'getting-ready') {
          for (const link of await page.getByRole('link', {name:'画面全体を開く', exact:true}).all()) {
            const response = await page.request.get(new URL(await link.getAttribute('href'), page.url()).href);
            assert.ok(response.ok() && response.headers()['content-type']?.includes('image/webp'));
          }
        }
      }
      await noOverflow(`${width}px ${slug} screenshots`);
    }
    await page.goto(`${base}docs/editor-guide/`, {waitUntil:'networkidle'});
    const scenes = page.locator('.editor-step');
    assert.equal(await scenes.count(),9);
    for (const scene of await scenes.all()) {
      const screen = scene.locator('.editor-step-screen img');
      await screen.scrollIntoViewIfNeeded();
      const size = await screen.evaluate(async img => {
        await img.decode();
        const {width:w,height:h} = img.getBoundingClientRect();
        return [w,h,img.naturalWidth,img.naturalHeight];
      });
      assert.ok(size[2]===1350 && size[3]===850 && Math.abs(size[1]-size[0]*850/1350)<1);
      assert.equal(await scene.locator('.editor-step-mark').count(),await scene.locator('.editor-step-key > li').count());
      const after = scene.getByRole('button',{name:'操作後',exact:true});
      if (await after.count()) {
        const before = scene.getByRole('button',{name:'操作前',exact:true});
        assert.equal(await scene.locator('.editor-step-drag:visible').count(),1);
        assert.match(await screen.getAttribute('src'),/-before\.webp$/);
        await after.click();
        assert.equal(await scene.locator('.editor-step-drag').count(),0);
        assert.equal(await after.getAttribute('aria-pressed'),'true');
        assert.match(await screen.getAttribute('src'),/-after\.webp$/);
        await screen.evaluate(img=>img.decode());
        await scene.locator('summary').click();
        const hands = scene.locator('details img:visible');
        assert.equal(await hands.count(),2);
        for (const img of await hands.all()) {
          await img.scrollIntoViewIfNeeded();
          await img.evaluate(el=>el.decode());
        }
        await before.click();
        assert.equal(await before.getAttribute('aria-pressed'),'true');
      }
    }
    await page.locator('#move + .editor-step, #move ~ .editor-step').first().locator('.editor-step-screen')
      .screenshot({path:path.join(output,`walkthrough-move-${width}.png`)});
    await noOverflow(`${width}px walkthrough and before/after`);
    await page.goto(`${base}docs/wrist/`, {waitUntil:'networkidle'});
    const wristTabs = page.getByRole('tab');
    assert.equal(await wristTabs.count(), 3);
    let previousSize;
    for (const [index, stage] of ['off','wrist','forearm'].entries()) {
      await wristTabs.nth(index).click();
      const panel = page.getByRole('tabpanel');
      const image = panel.locator('img');
      await image.scrollIntoViewIfNeeded();
      const dimensions = await image.evaluate(async img => {
        await img.decode();
        const rect = img.getBoundingClientRect();
        return [img.naturalWidth,img.naturalHeight,rect.width,rect.height];
      });
      assert.deepEqual(dimensions.slice(0,2), [479,495]);
      assert.ok(Math.abs(dimensions[3]-dimensions[2]*495/479)<1);
      if (previousSize) assert.deepEqual(dimensions, previousSize);
      previousSize = dimensions;
      const link = panel.getByRole('link');
      const url = new URL(await link.getAttribute('href'),page.url());
      assert.ok(url.pathname.endsWith('/shinano-wrist/'+stage+'.webp'));
      assert.ok((await page.request.get(url.href)).ok());
    }
    assert.equal(await page.locator('.editor-step-screen').count(),3);
    await noOverflow(`${width}px wrist comparison and options`);
  }
  assert.deepEqual(errors,[],'Browser JS errors');
  assert.deepEqual(failed,[],'Failed HTTP responses');
  await writeFile(path.join(output,'browser-checks.json'),JSON.stringify({results,errors,failed},null,2));
  console.log(JSON.stringify({passed:results.length,results,errors,failed},null,2));
} finally {await browser.close();}
