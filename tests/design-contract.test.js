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
