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

test('brand logo is an image asset, not a recreated text mark',function(){
  const fs=require('node:fs');
  const app=fs.readFileSync('js/app.js','utf8');
  assert.equal(app.includes('assets/Deliverbooks.png'),true);
});

test('home has interactive category bookmark rail',function(){
  const fs=require('node:fs');
  const h=fs.readFileSync('index.html','utf8');
  const a=fs.readFileSync('js/app.js','utf8');
  assert.match(h,/hero-category-bookmarks/);
  assert.match(h,/categories-section/);
  assert.match(a,/data-category-bookmark/);
});

test('mobile navigation toggles the state expected by CSS',function(){
  const fs=require('node:fs');
  const a=fs.readFileSync('js/app.js','utf8');
  assert.match(a,/mobile-nav-open/);
});
test('shop page exposes usable search and category controls',function(){
  const h=fs.readFileSync('shop.html','utf8');
  const a=fs.readFileSync('js/app.js','utf8');
  assert.match(h,/shop-toolbar/);
  assert.match(h,/shop-query/);
  assert.match(h,/shop-category-filter/);
  assert.match(a,/shop-query/);
  assert.match(a,/shop-category-filter/);
});

test('mobile navigation closes after selecting a destination',function(){
  const a=fs.readFileSync('js/app.js','utf8');
  assert.match(a,/mobile-navigation[^]*closest\(.*a/);
  assert.match(a,/mobile-nav-open/);
});

test('admin uses supplied brand asset on access gate and console',function(){
  const a=fs.readFileSync('js/admin.js','utf8');
  assert.equal((a.match(/assets\/Deliverbooks\.png/g)||[]).length>=2,true);
});
test('admin exposes core bookstore operations',function(){
  const a=fs.readFileSync('js/admin.js','utf8');
  ['dashboard','orders','products','inventory','categories','zones','promotions','customers','settings'].forEach(function(tab){
    assert.match(a,new RegExp('data-tab="'+tab+'"'));
  });
  assert.match(a,/إضافة كتاب/);
  assert.match(a,/مخزون منخفض/);\n  assert.match(a,/استيراد Excel/);\n  assert.match(a,/تصدير Excel/);\n  assert.match(a,/admin_save_product|saveProduct/);
});
