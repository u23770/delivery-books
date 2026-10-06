(function(root){
'use strict';
function A(){return root.DBApi}
function Cart(){return root.DBCart}
function q(s,c){return (c||document).querySelector(s)}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]})}
function fmt(n){return new Intl.NumberFormat('ar-EG',{style:'currency',currency:'EGP',maximumFractionDigits:2}).format(Number(n||0))}
function icon(name){
 const icons={
 search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="6"/><path d="m16 16 4 4"/></svg>',
 bag:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>',
 menu:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
 close:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m6 6 12 12M18 6 6 18"/></svg>',
 arrow:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M5 12h14M14 7l5 5-5 5"/></svg>'
 };return icons[name]||''
}
function toast(message,type){
 const stack=q('#toast-stack');if(!stack)return;const el=document.createElement('div');el.className='toast'+(type==='error'?' toast-error':'');
 el.innerHTML='<span class="toast-icon">'+(type==='error'?'!':'✓')+'</span><span>'+esc(message)+'</span>';stack.appendChild(el);
 setTimeout(function(){el.classList.add('toast-leaving');setTimeout(function(){el.remove()},220)},2600)
}
function header(){
 const host=q('#site-header');if(!host)return;
 host.innerHTML='<div class="db-offline-banner">الاتصال غير متاح الآن — يتم عرض الواجهة فقط.</div>'+
 '<div class="announcement"><span class="announcement-mark">◆</span><span>Deliver BOOKS · Online bookstore</span><span class="announcement-divider">|</span><a href="https://wa.me/201555949412" target="_blank" rel="noopener">WhatsApp</a></div>'+
 '<header class="site-header"><div class="page-wrap header-main">'+
 '<a class="brand-lockup" href="index.html" aria-label="Deliver BOOKS home"><span class="brand-mark"><b class="db-brand-mark">D</b><i></i></span><span class="brand-copy"><strong>Deliver BOOKS</strong><small>BOOKS TO YOUR DOOR</small></span></a>'+
 '<nav class="primary-nav" aria-label="Primary"><a href="index.html">الرئيسية</a><a href="shop.html">الكتب</a><a href="track.html">تتبع الطلب</a></nav>'+
 '<form class="header-search" data-search-form><span>'+icon('search')+'</span><input type="search" name="q" autocomplete="off" placeholder="ابحث باسم الكتاب أو المؤلف" aria-label="ابحث عن كتاب"><button class="db-search-clear" type="button" data-search-clear aria-label="مسح البحث">'+icon('close')+'</button><button type="submit" aria-label="بحث">'+icon('arrow')+'</button></form>'+
 '<div class="header-actions"><button class="language-toggle" type="button" disabled aria-label="English version coming soon">EN</button><a class="header-bag" href="cart.html" aria-label="حقيبة التسوق">'+icon('bag')+'<span>الحقيبة</span><b class="bag-count" id="bag-count">'+Cart().count()+'</b></a><button class="mobile-search-button" type="button" data-mobile-search aria-label="بحث">'+icon('search')+'</button><button class="mobile-menu-button" type="button" data-mobile-menu aria-label="فتح القائمة" aria-expanded="false">'+icon('menu')+'</button></div></div>'+
 '<div class="mobile-navigation" id="mobile-navigation" aria-hidden="true"><div class="mobile-navigation-head"><a class="brand-lockup" href="index.html"><span class="brand-mark"><b>D</b><i></i></span><span class="brand-copy"><strong>Deliver BOOKS</strong><small>BOOKS TO YOUR DOOR</small></span></a><button class="icon-button" type="button" data-mobile-close aria-label="إغلاق القائمة">'+icon('close')+'</button></div><form class="mobile-search" data-search-form><span>'+icon('search')+'</span><input type="search" name="q" autocomplete="off" placeholder="ابحث في الكتب" aria-label="ابحث في الكتب"><button type="submit" aria-label="بحث">'+icon('arrow')+'</button></form><nav><a href="index.html">الرئيسية <span>←</span></a><a href="shop.html">الكتب <span>←</span></a><a href="track.html">تتبع الطلب <span>←</span></a></nav><div class="mobile-navigation-bottom"><a href="https://wa.me/201555949412" target="_blank" rel="noopener">WhatsApp</a><a href="cart.html">الحقيبة ('+Cart().count()+')</a></div></div><button class="mobile-nav-backdrop" data-mobile-close aria-label="إغلاق القائمة"></button></header>'
}
function footer(){
 const host=q('#site-footer');if(!host)return;
 host.innerHTML='<footer class="site-footer"><div class="page-wrap footer-main"><div class="footer-brand"><a class="brand-lockup" href="index.html"><span class="brand-mark"><b>D</b><i></i></span><span class="brand-copy"><strong>Deliver BOOKS</strong><small>BOOKS TO YOUR DOOR</small></span></a><p>اختر الكتاب الذي تريد قراءته، وDeliver BOOKS يوفره لك حتى بابك.</p><div class="db-footer-socials"><a href="https://www.facebook.com/DeliverBooksEgypt/" target="_blank" rel="noopener" aria-label="Facebook">f</a><a href="https://www.instagram.com/deliverbooks/" target="_blank" rel="noopener" aria-label="Instagram">ig</a></div></div><div class="footer-links"><strong>المتجر</strong><a href="shop.html">كل الكتب</a><a href="cart.html">الحقيبة</a><a href="track.html">تتبع الطلب</a></div><div class="footer-links"><strong>تواصل</strong><a href="tel:+201555949412">+20 15 55949412</a><a href="https://wa.me/201555949412" target="_blank" rel="noopener">WhatsApp</a></div><div class="footer-signup"><span class="eyebrow">DELIVER BOOKS</span><h3>الكتالوج الحقيقي قادم من العميل.</h3><p>لن نعرض أسعارًا أو سياسات توصيل غير مؤكدة.</p></div></div><div class="page-wrap footer-bottom"><span>© Deliver BOOKS</span><span>Egypt</span><span>Development build · not published</span></div></footer>'
}
function empty(title,body,action){
 return '<div class="empty-state db-empty"><span class="empty-icon">D</span><h2>'+esc(title)+'</h2><p>'+esc(body)+'</p>'+(action||'')+'</div>'
}
function productCard(p){
 const image=p.images[0]||'assets/book-placeholder.svg';
 return '<article class="product-card"><a class="product-card-image" href="product.html?id='+encodeURIComponent(p.id)+'"><img src="'+esc(image)+'" alt="'+esc(p.nameAr||p.nameEn)+'" loading="lazy"><span class="card-arrow">'+icon('arrow')+'</span>'+(p.badge?'<span class="product-badge">'+esc(p.badge)+'</span>':'')+'</a><div class="product-card-info"><span class="product-category-label">'+esc(p.category?(p.category.nameAr||p.category.nameEn):'Deliver BOOKS')+'</span><a class="product-card-title" href="product.html?id='+encodeURIComponent(p.id)+'">'+esc(p.nameAr||p.nameEn)+'</a>'+(p.author?'<p class="db-product-author">'+esc(p.author)+'</p>':'')+'<div class="product-card-bottom"><div class="product-card-price"><span class="price-now">'+fmt(p.price)+'</span></div><button class="quick-add" type="button" data-add="'+p.id+'" aria-label="أضف '+esc(p.nameAr||p.nameEn)+' إلى الحقيبة">+</button></div></div></article>'
}
async function renderHome(){
 const cats=q('#home-categories'),featured=q('#featured-products');
 if(cats)cats.innerHTML='<div class="db-loading initial-loader"><span class="loader-mark">D</span><span>تحميل الأقسام</span></div>';
 if(featured)featured.innerHTML='<div class="db-loading initial-loader"><span class="loader-mark">D</span><span>تحميل الكتب</span></div>';
 try{
  const result=await Promise.all([A().categories(),A().products({featured:true})]),categories=result[0],products=result[1];
  if(cats)cats.innerHTML=categories.length?categories.slice(0,4).map(function(c){return '<a class="collection-card" href="shop.html?category='+encodeURIComponent(c.slug)+'">'+(c.image?'<img class="collection-photo" src="'+esc(c.image)+'" alt="">':'<div class="db-category-placeholder"><strong>'+esc(c.name_ar||c.name_en)+'</strong></div>')+'<span class="collection-content"><small>COLLECTION</small><strong>'+esc(c.name_ar||c.name_en)+'</strong><span>'+esc(c.description_ar||c.description_en||'تصفح الكتب في هذا القسم')+'</span><i>←</i></span></a>'}).join(''):empty('الأقسام لم تُضف بعد','سنضيف أقسام الكتب فور استلام كتالوج العميل الحقيقي.');
  if(featured)featured.innerHTML=products.length?products.slice(0,8).map(productCard).join(''):empty('لا توجد كتب منشورة بعد','واجهة الكتب جاهزة، لكنها لن تعرض منتجات أو أسعارًا قبل إضافة بيانات العميل.');
 }catch(e){document.body.classList.add('db-offline');if(cats)cats.innerHTML=empty('تعذر تحميل الأقسام','اتصال قاعدة البيانات غير متاح الآن.');if(featured)featured.innerHTML=empty('تعذر تحميل الكتب','حاول مرة أخرى بعد عودة الاتصال.')}
}
async function renderShop(){
 const root=q('#shop-products');if(!root)return;root.innerHTML='<div class="db-loading initial-loader"><span class="loader-mark">D</span><span>تحميل الكتب</span></div>';
 try{
  const params=new URLSearchParams(location.search),term=(params.get('q')||'').trim().toLowerCase(),category=params.get('category')||'';
  let items=await A().products({category:category});
  if(term)items=items.filter(function(p){return [p.nameAr,p.nameEn,p.author,p.publisher].join(' ').toLowerCase().indexOf(term)>=0});
  root.innerHTML=items.length?items.map(productCard).join(''):empty(term?'لا توجد نتائج':'الكتالوج لم يُضاف بعد',term?'جرّب كتابة اسم آخر للكتاب أو المؤلف.':'سنضيف الكتب والأسعار بعد استلام بيانات العميل المؤكدة.');
  const title=q('#shop-title');if(title)title.textContent=term?'نتائج البحث':'الكتب';const count=q('#shop-count');if(count)count.textContent=items.length?items.length+' كتاب':''
 }catch(e){root.innerHTML=empty('تعذر تحميل الكتب','اتصال قاعدة البيانات غير متاح الآن.')}
}
async function renderProduct(){
 const root=q('#page-root'),id=new URLSearchParams(location.search).get('id');if(!root)return;
 root.innerHTML='<div class="initial-loader"><span class="loader-mark">D</span><span>تحميل الكتاب</span></div>';
 try{
  const p=await A().product(id);
  if(!p){root.innerHTML='<div class="page-wrap page-space">'+empty('الكتاب غير موجود','قد يكون الكتاب غير منشور بعد أو الرابط غير صحيح.','<a class="button button-primary" href="shop.html">العودة للكتب</a>')+'</div>';return}
  const image=p.images[0]||'assets/book-placeholder.svg';
  root.innerHTML='<div class="page-wrap page-space"><nav class="breadcrumbs"><a href="index.html">الرئيسية</a><span>›</span><a href="shop.html">الكتب</a><span>›</span><span>'+esc(p.nameAr||p.nameEn)+'</span></nav><section class="product-detail-layout"><div class="product-gallery"><div class="product-main-image"><img src="'+esc(image)+'" alt="'+esc(p.nameAr||p.nameEn)+'"></div></div><div class="product-detail-copy"><span class="eyebrow">'+esc(p.category?(p.category.nameAr||p.category.nameEn):'DELIVER BOOKS')+'</span><h1>'+esc(p.nameAr||p.nameEn)+'</h1>'+(p.author?'<p class="db-product-author">بقلم '+esc(p.author)+'</p>':'')+'<div class="product-detail-price"><span class="price-now">'+fmt(p.price)+'</span></div><div class="db-product-meta">'+(p.publisher?'<span><b>الناشر:</b> '+esc(p.publisher)+'</span>':'')+(p.pages?'<span><b>الصفحات:</b> '+esc(p.pages)+'</span>':'')+(p.language?'<span><b>اللغة:</b> '+esc(p.language)+'</span>':'')+'</div><p class="product-summary">'+esc(p.descriptionAr||p.descriptionEn||'تفاصيل الكتاب ستُضاف من بيانات العميل.')+'</p><button class="button button-dark button-full" type="button" data-add="'+p.id+'">أضف إلى الحقيبة</button></div></section></div>'
 }catch(e){root.innerHTML='<div class="page-wrap page-space">'+empty('تعذر تحميل الكتاب','حاول مرة أخرى بعد عودة الاتصال.')+'</div>'}
}
async function hydrateCart(){
 const list=q('#cart-items'),summary=q('#cart-summary');if(!list)return;const stored=Cart().items();
 if(!stored.length){list.innerHTML=empty('الحقيبة فارغة','ابدأ بتصفح الكتب وأضف ما تريد طلبه.','<a class="button button-primary" href="shop.html">تصفح الكتب</a>');if(summary)summary.innerHTML='<h2>ملخص الطلب</h2><p class="db-cart-total-muted">لا توجد عناصر بعد.</p>';return}
 try{
  const products=await A().products(),byId=new Map(products.map(function(p){return [String(p.id),p]}));let subtotal=0;
  list.innerHTML=stored.map(function(item){const p=byId.get(String(item.productId));if(!p)return'';subtotal+=p.price*item.quantity;return '<article class="cart-line"><a class="cart-line-image" href="product.html?id='+p.id+'"><img src="'+esc(p.images[0]||'assets/book-placeholder.svg')+'" alt=""></a><div><a class="cart-line-name" href="product.html?id='+p.id+'">'+esc(p.nameAr||p.nameEn)+'</a><div class="cart-line-controls"><button class="text-button" type="button" data-cart-dec="'+p.id+'">−</button><span>'+item.quantity+'</span><button class="text-button" type="button" data-cart-inc="'+p.id+'">+</button><button class="remove-line" type="button" data-cart-remove="'+p.id+'">حذف</button></div></div><strong class="cart-line-price">'+fmt(p.price*item.quantity)+'</strong></article>'}).join('');
  if(summary)summary.innerHTML='<h2>ملخص الطلب</h2><div class="summary-row"><span>الإجمالي المبدئي</span><strong>'+fmt(subtotal)+'</strong></div><p class="db-cart-total-muted">رسوم التوصيل لن تُحسب قبل اعتماد مناطق وأسعار التوصيل من العميل.</p><a class="button button-dark button-full" href="checkout.html">متابعة الطلب</a>'
 }catch(e){list.innerHTML=empty('تعذر تحديث الحقيبة','اتصال قاعدة البيانات غير متاح الآن.')}
}
function renderCheckout(){
 const root=q('#page-root');if(!root)return;
 root.innerHTML='<div class="page-wrap page-space checkout-page"><div class="page-heading"><div><span class="eyebrow">CHECKOUT</span><h1>إتمام الطلب</h1><p>الواجهة جاهزة، لكن بيانات التوصيل الحقيقية ما زالت بانتظار تأكيد العميل.</p></div></div><div class="checkout-layout"><section class="checkout-main-card"><div class="db-status-note db-checkout-blocked"><span class="db-status-dot"></span><div><strong>إتمام الطلب متوقف مؤقتًا</strong>لم نضع أسعارًا أو مناطق توصيل افتراضية. سيتم فتح الطلب بعد إضافة البيانات المعتمدة من العميل.</div></div><form novalidate><div class="form-grid"><label class="field"><span>الاسم</span><input type="text" autocomplete="name" disabled></label><label class="field"><span>رقم الهاتف</span><input type="tel" autocomplete="tel" disabled></label><label class="field field-wide"><span>العنوان</span><textarea rows="4" disabled></textarea></label></div></form></section><aside class="checkout-summary-card"><h2>ملخص الطلب</h2><p class="db-cart-total-muted">سيظهر هنا سعر المنتجات ورسوم التوصيل بمجرد اكتمال إعداد البيانات الحقيقية.</p><button class="button button-dark button-full" type="button" disabled>إتمام الطلب غير متاح الآن</button></aside></div></div>'
}
function renderTrack(){
 const root=q('#page-root');if(!root)return;
 root.innerHTML='<div class="page-wrap page-space"><section class="track-intro"><span class="eyebrow">ORDER TRACKING</span><h1>تتبع طلبك</h1><p>سيتم تفعيل التتبع بعد تشغيل نظام الطلبات الفعلي. الواجهة محفوظة الآن بدون اختلاق أرقام طلبات أو حالات.</p><div class="db-status-note"><span class="db-status-dot"></span><div><strong>قيد الإعداد</strong>نظام الحالات سيستخدم نفس منطق Aquarium عند اكتمال بيانات التشغيل.</div></div></section></div>'
}
function closeMenu(){
 const h=q('.site-header');if(h)h.classList.remove('mobile-nav-open');document.body.classList.remove('nav-open');const n=q('#mobile-navigation');if(n)n.setAttribute('aria-hidden','true');const b=q('[data-mobile-menu]');if(b)b.setAttribute('aria-expanded','false')
}
function updateBag(){const b=q('#bag-count');if(b)b.textContent=Cart().count()}
function bind(){
 document.addEventListener('click',async function(e){
  const add=e.target.closest('[data-add]');if(add){try{const p=await A().product(add.dataset.add);if(p){Cart().add(p);toast('تمت إضافة الكتاب إلى الحقيبة');updateBag()}}catch(_){toast('تعذر إضافة الكتاب الآن','error')}return}
  const open=e.target.closest('[data-mobile-menu]');if(open){q('.site-header').classList.add('mobile-nav-open');document.body.classList.add('nav-open');q('#mobile-navigation').setAttribute('aria-hidden','false');open.setAttribute('aria-expanded','true');return}
  if(e.target.closest('[data-mobile-close]')){closeMenu();return}
  const clear=e.target.closest('[data-search-clear]');if(clear){const form=clear.closest('form'),input=form.querySelector('input');input.value='';clear.classList.remove('is-visible');input.focus();return}
  const rem=e.target.closest('[data-cart-remove]');if(rem){Cart().remove(rem.dataset.cartRemove);await hydrateCart();updateBag();return}
  const inc=e.target.closest('[data-cart-inc]');if(inc){const item=Cart().items().find(function(x){return String(x.productId)===String(inc.dataset.cartInc)});if(item)Cart().set(item.productId,item.quantity+1);await hydrateCart();updateBag();return}
  const dec=e.target.closest('[data-cart-dec]');if(dec){const item=Cart().items().find(function(x){return String(x.productId)===String(dec.dataset.cartDec)});if(item)Cart().set(item.productId,item.quantity-1);await hydrateCart();updateBag();return}
 });
 document.addEventListener('input',function(e){if(e.target.matches('[data-search-form] input')){const clear=e.target.closest('form').querySelector('[data-search-clear]');if(clear)clear.classList.toggle('is-visible',!!e.target.value)}})
 document.addEventListener('submit',function(e){const form=e.target.closest('[data-search-form]');if(!form)return;e.preventDefault();const term=new FormData(form).get('q');location.href='shop.html?q='+encodeURIComponent(String(term||'').trim())})
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu()});window.addEventListener('db:cart',updateBag)
}
async function start(){
 header();footer();bind();updateBag();const page=document.body.dataset.page;
 if(page==='home')await renderHome();else if(page==='shop')await renderShop();else if(page==='product')await renderProduct();else if(page==='cart')await hydrateCart();else if(page==='checkout')renderCheckout();else if(page==='track')renderTrack()
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start()
})(window);