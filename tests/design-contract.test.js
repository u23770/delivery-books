const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');

test('delivery stays disabled until client confirmation',function(){
  const c=fs.readFileSync('js/config.js','utf8');
  assert.match(c,/deliveryConfigured:\s*false/);
  assert.equal(c.includes('deliveryFee:'),false);
});

test('public pages do not hard-code delivery prices',function(){
  ['index.html','shop.html','product.html','cart.html','checkout.html'].forEach(function(f){
    const c=fs.readFileSync(f,'utf8');
    assert.equal(/رسوم التوصيل\s*[:=]\s*[0-9]/.test(c),false);
  });
});

test('design uses the DeliverBooks brand token baseline',function(){
  const c=fs.readFileSync('css/style.css','utf8');
  ['--ink:#52191f','--paper:#fffdfc','--clay:#e30919'].forEach(function(token){
    assert.equal(c.includes(token),true);
  });
  assert.equal(c.includes('deliver-books-mark.svg'),true);
});


test('storefront uses callable API and cart accessors',function(){
  const fs=require('node:fs');
  const app=fs.readFileSync('js/app.js','utf8');
  assert.equal((app.match(/\\bA\\./g)||[]).length,0);
  assert.equal((app.match(/\\bC\\./g)||[]).length,0);
  assert.match(app,/A\\(\\)\\.categories/);
  assert.match(app,/C\\(\\)\\.add/);
});

test('brand assets are wired into public and staff surfaces',function(){
  const fs=require('node:fs');
  assert.match(fs.readFileSync('js/app.js','utf8'),/assets\\/deliver-books-logo\\.svg/g);
  assert.match(fs.readFileSync('js/admin.js','utf8'),/assets\\/deliver-books-logo\\.svg/);
  assert.match(fs.readFileSync('js/waiter.js','utf8'),/assets\\/deliver-books-logo\\.svg/);
  assert.match(fs.readFileSync('js/print.js','utf8'),/assets\\/deliver-books-logo\\.svg/);
});

test('home has interactive category bookmark rail and semantic hero actions',function(){
 const fs=require('node:fs'); const h=fs.readFileSync('index.html','utf8'); const a=fs.readFileSync('js/app.js','utf8');
 assert.match(h,/id="hero-category-bookmarks"/); assert.match(h,/id="categories-section"/); assert.match(a,/hero-category-bookmarks/); assert.match(a,/data-category-bookmark/);
});
test('mobile navigation toggles the state expected by CSS',function(){
 const fs=require('node:fs'); const a=fs.readFileSync('js/app.js','utf8');
 assert.match(a,/mobile-nav-open/); assert.doesNotMatch(a,/mobile-navigation.*classList\.toggle\(['"]open['"]\)/);
});
test('brand logo is an image asset, not a recreated text mark',function(){
 const fs=require('node:fs'); const a=fs.readFileSync('js/app.js','utf8');
 assert.match(a,/assets\/deliver-books-logo\.(png|jpg|jpeg|webp|svg)/); assert.doesNotMatch(a,/brand-mark.*<b>/);
});