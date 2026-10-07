(function(){
'use strict';
const A=()=>DBApi,q=s=>document.querySelector(s),e=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])),m=n=>new Intl.NumberFormat('ar-EG',{style:'currency',currency:'EGP'}).format(+n||0);
const S=['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'],L={pending:'جديد',confirmed:'مؤكد',preparing:'جاري التجهيز',out_for_delivery:'في الطريق',delivered:'تم التسليم',cancelled:'ملغي'};
let O=[],P=[],C=[],Z=[],productSearch='',productFilter='';

function gate(){
  document.body.innerHTML='<div class="staff-gate"><div class="staff-card"><span class="eyebrow">DELIVER BOOKS</span><h1>لوحة الإدارة</h1><p>كود الإدارة</p><form id="g"><input id="code" type="password" required autocomplete="current-password"><button class="button button-dark">دخول</button><small id="err"></small></form></div></div>';
  q('#g').onsubmit=async x=>{x.preventDefault();try{await A().staffLogin(q('#code').value,'admin');boot()}catch(z){q('#err').textContent=z.message}};
}

function shell(){
  document.body.innerHTML='<div class="admin-shell"><aside class="admin-side"><div class="admin-brand-row"><div class="admin-brand"><img src="assets/deliver-books-logo.svg" alt="DeliverBooks"><span>ADMIN CONSOLE</span></div><span class="admin-version">DB / 01</span></div><div class="admin-nav-label">الإدارة</div><nav><button data-tab="orders"><i>◌</i><span>الطلبات</span><em></em></button><button data-tab="products"><i>□</i><span>الكتب</span><em></em></button><button data-tab="categories"><i>◇</i><span>الأقسام</span><em></em></button><button data-tab="zones"><i>⌖</i><span>التوصيل</span><em></em></button></nav><div class="admin-side-foot"><div class="admin-user-chip"><b>DB</b><span><strong>Deliver BOOKS</strong><small>ADMIN · ACCESS CODE</small></span></div><button id="logout">تسجيل الخروج</button></div></aside><main class="admin-main"><header class="admin-top"><div class="admin-top-start"><span class="admin-kicker">DELIVER BOOKS · ADMIN</span><span class="admin-page-label" id="title-label">Operations</span></div><div class="admin-top-actions"><span class="admin-live"><i></i>متصل</span><button id="refresh" class="button button-outline button-small">تحديث البيانات</button></div></header><section class="admin-content"><div class="admin-page-heading"><div><span class="eyebrow">STORE MANAGEMENT</span><h1 id="title">الطلبات</h1></div><p id="page-subtitle">متابعة الطلبات وإدارة حالة كل طلب من مكان واحد.</p></div><section id="view"></section></section><footer class="admin-footer"><span>© Deliver BOOKS</span><span>Development workspace · not published</span></footer></main></div>'
}

function orders(){
  q('#view').innerHTML='<div class="admin-stats"><article class="admin-stat-card warm"><span>إجمالي الطلبات</span><b>'+O.length+'</b><small>كل الطلبات المسجلة</small></article><article class="admin-stat-card"><span>طلبات نشطة</span><b>'+O.filter(x=>!['delivered','cancelled'].includes(x.status)).length+'</b><small>تحتاج متابعة</small></article><article class="admin-stat-card"><span>إجمالي المُسلّم</span><b>'+m(O.filter(x=>x.status==='delivered').reduce((a,x)=>a+(+x.total||0),0))+'</b><small>طلبات تم تسليمها</small></article></div><section class="admin-panel"><div class="admin-panel-head"><div><span class="eyebrow">ORDERS</span><h2>إدارة الطلبات</h2></div><span>'+O.length+' طلب</span></div><div class="admin-toolbar"><label class="admin-search"><span>⌕</span><input id="search" placeholder="ابحث بالاسم أو رقم الطلب أو الهاتف"></label><select id="filter"><option value="">كل الحالات</option>'+S.map(x=>'<option value="'+x+'">'+L[x]+'</option>').join('')+'</select></div><div class="orders-list" id="list">'+O.map(row).join('')+'</div></section>';
  q('#search').oninput=paint;q('#filter').onchange=paint;
}

function row(o){
  return '<article class="admin-order" data-id="'+o.id+'"><div class="order-top"><div class="order-ref"><span class="order-dot"></span><div><b>'+e(o.orderNumber)+'</b><small>'+new Date(o.createdAt).toLocaleString('ar-EG')+'</small></div></div><label class="order-status-wrap"><span>الحالة</span><select data-status class="status-'+e(o.status)+'">'+S.map(s=>'<option '+(s===o.status?'selected':'')+' value="'+s+'">'+L[s]+'</option>').join('')+'</select></label></div><div class="order-customer"><div><small>العميل</small><strong>'+e(o.customerName)+'</strong></div><div><small>الهاتف</small><span>'+e(o.customerPhone)+'</span></div><div class="order-address"><small>العنوان</small><span>'+e(o.address)+'</span></div></div><div class="order-items-head"><span>تفاصيل الطلب</span><b>'+(o.items||[]).reduce((n,i)=>n+(+i.quantity||0),0)+' عنصر</b></div><div class="order-items">'+(o.items||[]).map(i=>'<div><span>'+e(i.nameAr||i.nameEn)+' <small>× '+i.quantity+'</small></span><b>'+m(i.lineTotal)+'</b></div>').join('')+'</div><div class="order-bottom"><div class="order-total"><span>الإجمالي</span><b>'+m(o.total)+'</b></div><div class="order-actions"><button data-print class="button button-outline button-small">طباعة ورقة الطلب</button></div></div></article>';
}
function paint(){let t=(q('#search').value||'').toLowerCase(),f=q('#filter').value;q('#list').innerHTML=O.filter(o=>(!f||o.status===f)&&[o.orderNumber,o.customerName,o.customerPhone,o.address].join(' ').toLowerCase().includes(t)).map(row).join('')}
async function loadOrders(){O=await A().adminOrders();orders()}

function productStatus(p){
  return p.active
    ? '<span class="product-state is-live"><i></i>منشور</span>'
    : '<span class="product-state"><i></i>مخفي</span>';
}

function productCard(p){
  const img=p.images?.[0]||'assets/book-placeholder.svg';
  const cat=C.find(x=>String(x.id)===String(p.categoryId));
  const stock=+p.stock||0;
  const stockState=stock<=0?'نفد المخزون':stock<=5?'مخزون منخفض':'متوفر';
  return '<article class="product-admin-card">'+
    '<div class="product-admin-media"><img src="'+e(img)+'" alt="" loading="lazy"><div class="product-admin-overlay">'+productStatus(p)+'</div></div>'+
    '<div class="product-admin-body">'+
      '<div class="product-admin-heading"><div><span class="eyebrow">BOOK</span><h3>'+e(p.nameAr||p.nameEn||'بدون اسم')+'</h3><p>'+e(p.author||'')+'</p></div><button class="icon-action" data-editp="'+p.id+'" aria-label="تعديل الكتاب">✎</button></div>'+
      '<div class="product-admin-meta"><span>'+e(cat?.name_ar||'بدون قسم')+'</span><span>'+e(p.sku||'بدون SKU')+'</span></div>'+
      '<div class="product-admin-foot"><div><b>'+m(p.price)+'</b><small class="'+(stock<=5?'stock-low':'')+'">'+stockState+' · '+stock+'</small></div><div class="product-admin-flags">'+(p.featured?'<span>مميز</span>':'')+(p.badge?'<span>'+e(p.badge)+'</span>':'')+'</div></div>'+
    '</div>'+
  '</article>';
}

function paintProducts(){
  const list=q('#product-list'),query=productSearch.toLowerCase();
  const items=P.filter(p=>{
    const hay=[p.nameAr,p.nameEn,p.author,p.publisher,p.sku,p.isbn,p.slug].join(' ').toLowerCase();
    return (!query||hay.includes(query))&&(!productFilter||productFilter===(p.active?'active':'hidden'));
  });
  list.innerHTML=items.length?items.map(productCard).join(''):'<div class="admin-empty-product"><span class="empty-icon">□</span><h3>لا توجد كتب مطابقة</h3><p>غيّر البحث أو الفلتر، أو أضف كتابًا جديدًا.</p><button class="button button-dark" id="newp-empty">إضافة كتاب</button></div>';
  q('#product-count').textContent=items.length+' من '+P.length+' كتاب';
}

function products(){
  q('#view').innerHTML='<div class="products-toolbar"><div class="products-toolbar-copy"><span class="eyebrow">CATALOG</span><h2>مكتبة DeliverBooks</h2><p>إدارة الكتب، الأسعار، المخزون، الـSKU والصور من شاشة واحدة.</p></div><div class="products-toolbar-actions"><button id="newp" class="button button-dark">+ إضافة كتاب</button></div></div>'+
    '<section class="admin-panel product-manager-panel"><div class="product-manager-head"><label class="admin-search product-search"><span>⌕</span><input id="product-search" placeholder="ابحث بالاسم أو المؤلف أو SKU"></label><select id="product-filter"><option value="">كل الكتب</option><option value="active">المنشورة فقط</option><option value="hidden">المخفية فقط</option></select><span id="product-count"></span></div><div class="products-admin-grid" id="product-list"></div></section>';
  q('#product-search').value=productSearch;q('#product-filter').value=productFilter;
  q('#product-search').oninput=x=>{productSearch=x.target.value;paintProducts()};
  q('#product-filter').onchange=x=>{productFilter=x.target.value;paintProducts()};
  paintProducts();
}

function productForm(p={}){
  const isEdit=!!p.id;
  const images=p.images||[];
  const modal='<div class="product-modal-backdrop" id="product-modal"><section class="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title"><header class="product-modal-head"><div><span class="eyebrow">'+(isEdit?'EDIT BOOK':'NEW BOOK')+'</span><h2 id="product-modal-title">'+(isEdit?'تعديل الكتاب':'إضافة كتاب جديد')+'</h2></div><button type="button" class="modal-close" data-close-product aria-label="إغلاق">×</button></header>'+
  '<form id="pf" class="product-editor">'+
  '<input type="hidden" name="id" value="'+e(p.id||'')+'">'+
  '<section class="product-editor-section"><div class="product-editor-section-head"><span>01</span><div><b>بيانات الكتاب</b><small>المعلومات الأساسية التي تظهر للعميل</small></div></div><div class="form-grid">'+
  '<label class="field"><span>الاسم العربي *</span><input name="nameAr" required value="'+e(p.nameAr||'')+'"></label>'+
  '<label class="field"><span>English title</span><input name="nameEn" value="'+e(p.nameEn||'')+'"></label>'+
  '<label class="field"><span>الرابط المختصر *</span><input name="slug" required value="'+e(p.slug||'')+'"></label>'+
  '<label class="field"><span>القسم</span><select name="categoryId"><option value="">بدون قسم</option>'+C.map(c=>'<option value="'+c.id+'" '+(String(c.id)===String(p.categoryId)?'selected':'')+'>'+e(c.nameAr||c.nameEn)+'</option>').join('')+'</select></label>'+
  '<label class="field"><span>السعر *</span><input name="price" type="number" min="0" step=".01" required value="'+(p.price??0)+'"></label>'+
  '<label class="field"><span>السعر قبل الخصم</span><input name="compareAt" type="number" min="0" step=".01" value="'+(p.compareAt??'')+'"></label>'+
  '<label class="field"><span>SKU</span><input name="sku" value="'+e(p.sku||'')+'" placeholder="اختياري"></label>'+
  '<label class="field"><span>المخزون *</span><input name="stock" type="number" min="0" step="1" required value="'+(p.stock??0)+'"></label>'+
  '</div></section>'+
  '<section class="product-editor-section"><div class="product-editor-section-head"><span>02</span><div><b>تفاصيل النشر</b><small>بيانات الفهرسة والمعلومات الإضافية</small></div></div><div class="form-grid">'+
  '<label class="field"><span>المؤلف</span><input name="author" value="'+e(p.author||'')+'"></label>'+
  '<label class="field"><span>الناشر</span><input name="publisher" value="'+e(p.publisher||'')+'"></label>'+
  '<label class="field"><span>ISBN</span><input name="isbn" value="'+e(p.isbn||'')+'"></label>'+
  '<label class="field"><span>عدد الصفحات</span><input name="pages" type="number" min="1" step="1" value="'+(p.pages??'')+'"></label>'+
  '<label class="field"><span>اللغة</span><input name="language" value="'+e(p.language||'')+'" placeholder="العربية / English"></label>'+
  '<label class="field"><span>الشارة</span><input name="badge" value="'+e(p.badge||'')+'" placeholder="مثال: جديد"></label>'+
  '<label class="check-card"><input type="checkbox" name="active" '+(p.active!==false?'checked':'')+'><span><b>ظاهر للعملاء</b><small>إظهار الكتاب داخل المتجر</small></span></label>'+
  '<label class="check-card"><input type="checkbox" name="featured" '+(p.featured?'checked':'')+'><span><b>كتاب مميز</b><small>يظهر في القسم المميز</small></span></label>'+
  '<label class="field field-wide"><span>الوصف العربي</span><textarea name="descriptionAr" maxlength="2000">'+e(p.descriptionAr||'')+'</textarea></label>'+
  '<label class="field field-wide"><span>English description</span><textarea name="descriptionEn" maxlength="2000">'+e(p.descriptionEn||'')+'</textarea></label>'+
  '</div></section>'+
  '<section class="product-editor-section"><div class="product-editor-section-head"><span>03</span><div><b>صور الكتاب</b><small>JPG أو PNG أو WebP — بحد أقصى 5MB للصورة</small></div></div>'+
  '<div class="product-media-grid" id="product-media-grid">'+(images.length?images.map((url,i)=>'<article class="product-media-item"><img src="'+e(url)+'" alt="" loading="lazy"><button type="button" data-delimage="'+(p.imageIds?.[i]||'')+'" '+(p.imageIds?.[i]?'':'disabled')+' aria-label="حذف الصورة">×</button></article>').join(''):'<div class="product-media-empty"><span>+</span><b>لم تتم إضافة صور بعد</b><small>أضف صورًا واضحة للغلاف والنسخة المعروضة.</small></div>')+'</div>'+
  '<label class="upload-drop"><input id="product-files" type="file" accept="image/jpeg,image/png,image/webp" multiple><span class="upload-drop-icon">↑</span><b>اختر صورًا من جهازك</b><small>يمكنك اختيار أكثر من صورة في مرة واحدة.</small></label>'+
  '<div id="product-file-preview" class="product-file-preview"></div></section>'+
  '<div id="product-form-error" class="form-error" hidden></div>'+
  '<footer class="product-modal-actions"><button type="button" class="button button-outline" data-close-product>إلغاء</button><button class="button button-dark" id="product-save">حفظ الكتاب</button></footer>'+
  '</form></section></div>';
  q('#view').insertAdjacentHTML('beforeend',modal);
  const modalEl=q('#product-modal'),fileInput=q('#product-files'),preview=q('#product-file-preview');
  const pendingFiles=[];
  const renderPreview=()=>{preview.innerHTML=pendingFiles.map((f,i)=>'<div class="pending-image"><img src="'+URL.createObjectURL(f)+'" alt=""><span>'+e(f.name)+'</span><button type="button" data-remove-file="'+i+'">×</button></div>').join('')};
  fileInput.onchange=x=>{pendingFiles.push(...Array.from(x.target.files||[]));x.target.value='';renderPreview()};
  q('#pf').onsubmit=async x=>{
    x.preventDefault();
    const btn=q('#product-save'),err=q('#product-form-error');
    err.hidden=true;btn.disabled=true;btn.textContent='جارٍ الحفظ…';
    try{
      const fd=Object.fromEntries(new FormData(x));
      fd.active=x.target.active.checked;fd.featured=x.target.featured.checked;
      const saved=await A().saveProduct(fd),id=saved.id;
      for(let i=0;i<pendingFiles.length;i++){btn.textContent='جارٍ رفع الصورة '+(i+1)+' من '+pendingFiles.length+'…';await A().uploadProductImage(id,pendingFiles[i]);}
      modalEl.remove();await loadProducts();products();
    }catch(ex){err.textContent=ex.message||'تعذر حفظ الكتاب.';err.hidden=false;btn.disabled=false;btn.textContent='حفظ الكتاب'}
  };
  modalEl.querySelectorAll('[data-close-product]').forEach(b=>b.onclick=()=>modalEl.remove());
  modalEl.querySelectorAll('[data-delimage]').forEach(b=>b.onclick=async()=>{if(!b.dataset.delimage)return; b.disabled=true;try{await A().deleteProductImage(b.dataset.delimage);await loadProducts();const fresh=P.find(v=>String(v.id)===String(p.id));modalEl.remove();productForm(fresh||p)}catch(ex){b.disabled=false;alert(ex.message)}});
  modalEl.onmousedown=x=>{if(x.target===modalEl)modalEl.remove()};
  document.onkeydown=function keyHandler(x){if(x.key==='Escape'&&q('#product-modal')){q('#product-modal').remove();document.removeEventListener('keydown',keyHandler)}};
  modalEl.querySelectorAll('[data-remove-file]').forEach(b=>b.onclick=()=>{pendingFiles.splice(+b.dataset.removeFile,1);renderPreview()});
}

async function loadProducts(){P=await A().adminProducts();}

function categories(){
  q('#view').innerHTML='<div class="admin-section-head"><h2>الأقسام</h2><button id="newc" class="button button-dark">+ قسم</button></div><div class="admin-list">'+C.map(c=>'<div><b>'+e(c.nameAr)+'</b><span>'+e(c.slug)+'</span><button data-editc="'+c.id+'">تعديل</button></div>').join('')+'</div>';
}
function catForm(c={}){
  q('#view').innerHTML='<div class="admin-form-card"><h2>القسم</h2><form id="cf" class="form-grid"><input type="hidden" name="id" value="'+(c.id||'')+'"><label class="field"><span>العربي</span><input name="nameAr" required value="'+e(c.nameAr||'')+'"></label><label class="field"><span>English</span><input name="nameEn" value="'+e(c.nameEn||'')+'"></label><label class="field"><span>Slug</span><input name="slug" required value="'+e(c.slug||'')+'"></label><label class="field"><span>الترتيب</span><input name="sortOrder" type="number" value="'+(c.sortOrder||0)+'"></label><button class="button button-dark field-wide">حفظ</button></form></div>';
  q('#cf').onsubmit=async x=>{x.preventDefault();await A().saveCategory(Object.fromEntries(new FormData(x)));C=await A().adminCategories();categories()};
}
function zones(){
  q('#view').innerHTML='<div class="admin-section-head"><h2>مناطق التوصيل</h2><button id="newz" class="button button-dark">+ منطقة</button></div><div class="admin-list">'+Z.map(z=>'<div><b>'+e(z.nameAr)+'</b><span>'+m(z.fee)+'</span><span>'+(z.freeAbove?('مجاني فوق '+m(z.freeAbove)):'')+'</span><button data-editz="'+z.id+'">تعديل</button></div>').join('')+'</div><p class="admin-note">لا توجد رسوم افتراضية؛ هذه القيم هي التي يستخدمها الطلب.</p>';
}
function zoneForm(z={}){
  q('#view').innerHTML='<div class="admin-form-card"><h2>منطقة التوصيل</h2><form id="zf" class="form-grid"><input type="hidden" name="id" value="'+(z.id||'')+'"><label class="field"><span>العربي</span><input name="nameAr" required value="'+e(z.nameAr||'')+'"></label><label class="field"><span>English</span><input name="nameEn" value="'+e(z.nameEn||'')+'"></label><label class="field"><span>الرسوم</span><input name="fee" type="number" min="0" step=".01" required value="'+(z.fee??'')+'"></label><label class="field"><span>مجاني فوق</span><input name="freeAbove" type="number" min="0" step=".01" value="'+(z.freeAbove??'')+'"></label><button class="button button-dark field-wide">حفظ</button></form></div>';
  q('#zf').onsubmit=async x=>{x.preventDefault();await A().saveZone(Object.fromEntries(new FormData(x)));Z=await A().adminZones();zones()};
}
async function route(t){
  const names={orders:'الطلبات',products:'الكتب',categories:'الأقسام',zones:'التوصيل'},subs={orders:'متابعة الطلبات وإدارة حالة كل طلب من مكان واحد.',products:'إدارة كتالوج الكتب والمخزون والبيانات الأساسية.',categories:'تنظيم أقسام المتجر وترتيب ظهورها للعملاء.',zones:'إدارة مناطق التوصيل والأسعار الحقيقية المعتمدة.'};
  q('#title').textContent=names[t];q('#page-subtitle').textContent=subs[t];q('#title-label').textContent=names[t];
  document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('is-active',x.dataset.tab===t));
  if(t==='orders')await loadOrders();
  if(t==='products'){await loadProducts();products()}
  if(t==='categories'){C=await A().adminCategories();categories()}
  if(t==='zones'){Z=await A().adminZones();zones()}
}
function bind(){
  document.addEventListener('click',async x=>{
    let t=x.target.closest('[data-tab]');if(t){await route(t.dataset.tab);return}
    if(x.target.closest('#refresh')){await route(document.querySelector('[data-tab].is-active').dataset.tab);return}
    if(x.target.closest('#logout')){await A().staffLogout();location.reload();return}
    if(x.target.closest('#newp')||x.target.closest('#newp-empty')){productForm();return}
    let p=x.target.closest('[data-editp]');if(p){const item=P.find(v=>String(v.id)===p.dataset.editp);if(item)productForm(item);return}
    let c=x.target.closest('[data-editc]');if(c){const item=C.find(v=>String(v.id)===c.dataset.editc);if(item)catForm(item);return}
    let z=x.target.closest('[data-editz]');if(z){const item=Z.find(v=>String(v.id)===z.dataset.editz);if(item)zoneForm(item);return}
    let pr=x.target.closest('[data-print]');if(pr){let o=O.find(v=>v.id===pr.closest('.admin-order').dataset.id);sessionStorage.setItem('db_print_order',JSON.stringify(o));window.open('print.html','_blank');return}
    let s=x.target.closest('[data-status]');if(s){let o=O.find(v=>v.id===s.closest('.admin-order').dataset.id);if(o&&s.value!==o.status){await A().updateOrderStatus(o.id,s.value,'تم التحديث من الإدارة');await loadOrders()};return}
    let rm=x.target.closest('[data-remove-file]');if(rm){return}
  });
}
async function boot(){shell();bind();await route('orders');setInterval(()=>loadOrders().catch(()=>{}),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>DBApi.staffToken()?boot():gate());else DBApi.staffToken()?boot():gate()
})();