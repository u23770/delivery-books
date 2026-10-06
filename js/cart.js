(function(root){
  'use strict';
  const KEY='deliver_books_cart_v1';
  function read(){try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch(_){return[]}}
  function write(items){localStorage.setItem(KEY,JSON.stringify(items));window.dispatchEvent(new CustomEvent('db:cart'))}
  root.DBCart={
    items:read,
    count:function(){return read().reduce(function(n,x){return n+Number(x.quantity||0)},0)},
    add:function(product,quantity){
      quantity=quantity||1;const items=read();const existing=items.find(function(x){return String(x.productId)===String(product.id)});
      if(existing)existing.quantity+=quantity;else items.push({productId:product.id,slug:product.slug,name:product.nameAr||product.nameEn,quantity:quantity});
      write(items);
    },
    set:function(productId,quantity){
      const items=read();const row=items.find(function(x){return String(x.productId)===String(productId)});
      if(!row)return;row.quantity=Math.max(0,Number(quantity||0));write(items.filter(function(x){return x.quantity>0}));
    },
    remove:function(productId){write(read().filter(function(x){return String(x.productId)!==String(productId)}))},
    clear:function(){write([])}
  };
})(window);