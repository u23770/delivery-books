(function(){
'use strict';
const A=()=>DBApi,q=s=>document.querySelector(s),e=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])),m=n=>new Intl.NumberFormat('ar-EG',{style:'currency',currency:'EGP'}).format(+n||0);
const S=['pending','confirmed','preparing','out_for_delivery','delivered','cancelled'],L={pending:'جديد',confirmed:'مؤكد',preparing:'جاري التجهيز',out_for_delivery:'في الطريق',delivered:'تم التسليم',cancelled:'ملغي'};
let O=[],P=[],C=[],Z=[],productSearch='',productFilter='';

const DEMO_KEY='db_demo_admin_v1';
const demoMode=()=>localStorage.getItem('db_demo_mode')!=='off';
const demoSeed=()=>({
  products:[
    {id:'demo-p1',nameAr:'الأمير الصغير',nameEn:'The Little Prince',slug:'the-little-prince',categoryId:'demo-c1',price:180,compareAt:220,stock:8,active:true,featured:true,badge:'الأكثر مبيعًا',author:'أنطوان دو سانت إكزوبيري',publisher:'دار الشروق',isbn:'978000000001',pages:96,language:'العربية',descriptionAr:'نسخة تجريبية لاختبار إدارة الكتب.',descriptionEn:'Demo book for testing.'},
    {id:'demo-p2',nameAr:'فن اللامبالاة',nameEn:'The Subtle Art of Not Giving a F*ck',slug:'subtle-art',categoryId:'demo-c2',price:240,compareAt:280,stock:3,active:true,featured:false,badge:'جديد',author:'مارك مانسون',publisher:'تجريبي',isbn:'978000000002',pages:224,language:'العربية',descriptionAr:'بيانات تجريبية.',descriptionEn:'Demo data.'},
    {id:'demo-p3',nameAr:'مقدمة في البرمجة',nameEn:'Programming Basics',slug:'programming-basics',categoryId:'demo-c3',price:320,compareAt:null,stock:0,active:true,featured:false,badge:'',author:'قسم التقنية',publisher:'Deliver BOOKS Demo',isbn:'978000000003',pages:310,language:'العربية',descriptionAr:'بيانات تجريبية لاختبار المخزون.',descriptionEn:'Demo inventory item.'},
    {id:'demo-p4',nameAr:'روايات قصيرة',nameEn:'Short Stories',slug:'short-stories',categoryId:'demo-c1',price:150,compareAt:null,stock:14,active:false,featured:false,badge:'مخفي',author:'مجموعة مؤلفين',publisher:'تجريبي',isbn:'978000000004',pages:140,language:'العربية',descriptionAr:'كتاب مخفي تجريبي.',descriptionEn:'Hidden demo book.'}
  ],
  categories:[
    {id:'demo-c1',nameAr:'روايات',nameEn:'Novels',slug:'novels',sortOrder:1},
    {id:'demo-c2',nameAr:'تطوير الذات',nameEn:'Self Development',slug:'self-development',sortOrder:2},
    {id:'demo-c3',nameAr:'تقنية',nameEn:'Technology',slug:'technology',sortOrder:3}
  ],
  zones:[
    {id:'demo-z1',nameAr:'داخل القاهرة',nameEn:'Cairo',fee:35,freeAbove:500,sortOrder:1},
    {id:'demo-z2',nameAr:'الجيزة',nameEn:'Giza',fee:45,freeAbove:600,sortOrder:2}
  ],
  orders:[
    {id:'demo-o1',orderNumber:'DB-DEMO-1001',createdAt:'2026-10-07T10:15:00Z',status:'pending',customerName:'أحمد محمد',customerPhone:'01000000001',address:'مدينة نصر، القاهرة',total:455,items:[{nameAr:'الأمير الصغير',quantity:1,lineTotal:180},{nameAr:'فن اللامبالاة',quantity:1,lineTotal:240}],note:'اتصال قبل الوصول'},
    {id:'demo-o2',orderNumber:'DB-DEMO-1002',createdAt:'2026-10-06T18:20:00Z',status:'out_for_delivery',customerName:'سارة علي',customerPhone:'01000000002',address:'الدقي، الجيزة',total:365,items:[{nameAr:'مقدمة في البرمجة',quantity:1,lineTotal:320}],note:''},
    {id:'demo-o3',orderNumber:'DB-DEMO-1003',createdAt:'2026-10-05T13:00:00Z',status:'delivered',customerName:'محمود حسن',customerPhone:'01000000003',address:'المعادي، القاهرة',total:150,items:[{nameAr:'روايات قصيرة',quantity:1,lineTotal:150}],note:''}
  ],
  promotions:[
    {id:'demo-pr1',name:'خصم البداية',code:'WELCOME10',type:'percent',value:10,active:true,minOrder:250,expiresAt:'2026-12-31'},
    {id:'demo-pr2',name:'خصم الكتب التقنية',code:'TECH50',type:'fixed',value:50,active:false,minOrder:300,expiresAt:'2026-11-30'}
  ],
  customers:[
    {id:'demo-cu1',name:'أحمد محمد',phone:'01000000001',email:'ahmed.demo@example.com',orders:4,total:1260,status:'active',notes:'عميل تجريبي'},
    {id:'demo-cu2',name:'سارة علي',phone:'01000000002',email:'sara.demo@example.com',orders:2,total:620,status:'active',notes:''},
    {id:'demo-cu3',name:'محمود حسن',phone:'01000000003',email:'mahmoud.demo@example.com',orders:1,total:150,status:'inactive',notes:'بيانات تجريبية'}
  ],
  settings:{storeName:'Deliver BOOKS',phone:'+201555949412',whatsapp:'+201555949412',email:'demo@deliverbooks.example',currency:'EGP',deliveryEnabled:false,orderAutoRefresh:true}
});
function demoState(){
  let s;try{s=JSON.parse(localStorage.getItem(DEMO_KEY)||'null')}catch(_){}
  if(!s){s=demoSeed();localStorage.setItem(DEMO_KEY,JSON.stringify(s))}
  return s;
}
function saveDemoState(s){localStorage.setItem(DEMO_KEY,JSON.stringify(s));return s}
function demoBanner(){return '<div class="admin-note" style="margin-bottom:16px"><b>DEMO MODE</b> · البيانات الحالية تجريبية ويمكن استبدالها لاحقًا بالبيانات الحقيقية. <button type="button" class="button button-outline button-small" id="disable-demo">إيقاف بيانات الديمو</button></div>'}
function demoProductFrom(p){return {...p,images:p.images||[]}}
function demoSaveProduct(p){
  const s=demoState(), i=s.products.findIndex(x=>String(x.id)===String(p.id));
  const item={...p,id:p.id||('demo-p-'+Date.now()),images:p.images||[]};
  if(i>=0)s.products[i]={...s.products[i],...item};else s.products.unshift(item);
  saveDemoState(s);return item;
}
function demoSaveCategory(c){const s=demoState(),i=s.categories.findIndex(x=>String(x.id)===String(c.id));const item={...c,id:c.id||('demo-c-'+Date.now())};if(i>=0)s.categories[i]={...s.categories[i],...item};else s.categories.push(item);saveDemoState(s);return item}
function demoSaveZone(z){const s=demoState(),i=s.zones.findIndex(x=>String(x.id)===String(z.id));const item={...z,id:z.id||('demo-z-'+Date.now())};if(i>=0)s.zones[i]={...s.zones[i],...item};else s.zones.push(item);saveDemoState(s);return item}
function demoSavePromotion(p){const s=demoState(),i=s.promotions.findIndex(x=>String(x.id)===String(p.id));const item={...p,id:p.id||('demo-pr-'+Date.now()),value:+p.value||0,minOrder:+p.minOrder||0};if(i>=0)s.promotions[i]={...s.promotions[i],...item};else s.promotions.unshift(item);saveDemoState(s);return item}
function demoDeletePromotion(id){const s=demoState();s.promotions=s.promotions.filter(x=>String(x.id)!==String(id));saveDemoState(s)}
function demoSaveCustomer(c){const s=demoState(),i=s.customers.findIndex(x=>String(x.id)===String(c.id));if(i>=0)s.customers[i]={...s.customers[i],...c};saveDemoState(s);return s.customers.find(x=>String(x.id)===String(c.id))}
function demoSaveSettings(v){const s=demoState();s.settings={...s.settings,...v};saveDemoState(s);return s.settings}
function demoUpdateOrder(id,status,note){const s=demoState(),o=s.orders.find(x=>String(x.id)===String(id));if(o){o.status=status;o.note=note||o.note||''}saveDemoState(s);return o}


function gate(){
  document.body.innerHTML='<div class="staff-gate"><div class="staff-card"><img class="staff-logo" src="assets/Deliverbooks.png" alt="Deliver BOOKS"><span class="eyebrow">DELIVER BOOKS</span><h1>لوحة الإدارة</h1><p>كود الإدارة</p><form id="g"><input id="code" type="password" required autocomplete="current-password"><button class="button button-dark">دخول</button><small id="err"></small></form></div></div>';
  q('#g').onsubmit=async x=>{x.preventDefault();try{await A().staffLogin(q('#code').value,'admin');boot()}catch(z){q('#err').textContent=z.message}};
}

function shell(){
  document.body.innerHTML='<div class="admin-shell"><aside class="admin-side"><div class="admin-brand-row"><div class="admin-brand"><img src="assets/Deliverbooks.png" alt="Deliver BOOKS"><span>ADMIN CONSOLE</span></div><span class="admin-version">DB / 02</span></div><div class="admin-nav-label">الإدارة</div><nav><button data-tab="dashboard"><i>⌂</i><span>نظرة عامة</span><em></em></button><button data-tab="orders"><i>◌</i><span>الطلبات</span><em></em></button><button data-tab="products"><i>□</i><span>الكتب</span><em></em></button><button data-tab="inventory"><i>▤</i><span>المخزون</span><em></em></button><button data-tab="categories"><i>◇</i><span>الأقسام</span><em></em></button><button data-tab="zones"><i>⌖</i><span>التوصيل</span><em></em></button><button data-tab="promotions"><i>%</i><span>الخصومات</span><em></em></button><button data-tab="customers"><i>♙</i><span>العملاء</span><em></em></button><button data-tab="settings"><i>⚙</i><span>الإعدادات</span><em></em></button></nav><div class="admin-side-foot"><div class="admin-user-chip"><b>DB</b><span><strong>Deliver BOOKS</strong><small>ADMIN · ACCESS CODE</small></span></div><button id="logout">تسجيل الخروج</button></div></aside><main class="admin-main"><header class="admin-top"><div class="admin-top-start"><span class="admin-kicker">DELIVER BOOKS · ADMIN</span><span class="admin-page-label" id="title-label">Operations</span></div><div class="admin-top-actions"><span class="admin-live"><i></i>متصل</span><button id="refresh" class="button button-outline button-small">تحديث البيانات</button></div></header><section class="admin-content"><div class="admin-page-heading"><div><span class="eyebrow">STORE MANAGEMENT</span><h1 id="title">الطلبات</h1></div><p id="page-subtitle">متابعة الطلبات وإدارة حالة كل طلب من مكان واحد.</p></div><section id="view"></section></section><footer class="admin-footer"><span>© Deliver BOOKS</span><span>Development workspace · not published</span></footer></main></div>'
}

function orders(){
  q('#view').innerHTML='<div class="admin-stats"><article class="admin-stat-card warm"><span>إجمالي الطلبات</span><b>'+O.length+'</b><small>كل الطلبات المسجلة</small></article><article class="admin-stat-card"><span>طلبات نشطة</span><b>'+O.filter(x=>!['delivered','cancelled'].includes(x.status)).length+'</b><small>تحتاج متابعة</small></article><article class="admin-stat-card"><span>إجمالي المُسلّم</span><b>'+m(O.filter(x=>x.status==='delivered').reduce((a,x)=>a+(+x.total||0),0))+'</b><small>طلبات تم تسليمها</small></article></div><section class="admin-panel"><div class="admin-panel-head"><div><span class="eyebrow">ORDERS</span><h2>إدارة الطلبات</h2></div><span>'+O.length+' طلب</span></div><div class="admin-toolbar"><label class="admin-search"><span>⌕</span><input id="search" placeholder="ابحث بالاسم أو رقم الطلب أو الهاتف"></label><select id="filter"><option value="">كل الحالات</option>'+S.map(x=>'<option value="'+x+'">'+L[x]+'</option>').join('')+'</select></div><div class="orders-list" id="list">'+O.map(row).join('')+'</div></section>';
  q('#search').oninput=paint;q('#filter').onchange=paint;
}

function row(o){
  return '<article class="admin-order" data-id="'+o.id+'"><div class="order-top"><div class="order-ref"><span class="order-dot"></span><div><b>'+e(o.orderNumber)+'</b><small>'+new Date(o.createdAt).toLocaleString('ar-EG')+'</small></div></div><label class="order-status-wrap"><span>الحالة</span><select data-status class="status-'+e(o.status)+'">'+S.map(s=>'<option '+(s===o.status?'selected':'')+' value="'+s+'">'+L[s]+'</option>').join('')+'</select></label></div><div class="order-customer"><div><small>العميل</small><strong>'+e(o.customerName)+'</strong></div><div><small>الهاتف</small><span>'+e(o.customerPhone)+'</span></div><div class="order-address"><small>العنوان</small><span>'+e(o.address)+'</span></div></div><div class="order-items-head"><span>تفاصيل الطلب</span><b>'+(o.items||[]).reduce((n,i)=>n+(+i.quantity||0),0)+' عنصر</b></div><div class="order-items">'+(o.items||[]).map(i=>'<div><span>'+e(i.nameAr||i.nameEn)+' <small>× '+i.quantity+'</small></span><b>'+m(i.lineTotal)+'</b></div>').join('')+'</div><div class="order-bottom"><div class="order-total"><span>الإجمالي</span><b>'+m(o.total)+'</b></div><div class="order-actions"><button data-print class="button button-outline button-small">طباعة ورقة الطلب</button></div></div></article>';
}
function paint(){let t=(q('#search').value||'').toLowerCase(),f=q('#filter').value;q('#list').innerHTML=O.filter(o=>(!f||o.status===f)&&[o.orderNumber,o.customerName,o.customerPhone,o.address].join(' ').toLowerCase().includes(t)).map(row).join('')}
async function loadOrders(){if(demoMode()){O=demoState().orders;return}try{O=await A().adminOrders();}catch(_){O=[]}if(!O.length&&demoMode())O=demoState().orders;orders()}

function dashboard(){
  const delivered=O.filter(x=>x.status==='delivered').reduce((a,x)=>a+(+x.total||0),0);
  const activeOrders=O.filter(x=>!['delivered','cancelled'].includes(x.status)).length;
  const low=P.filter(x=>(+x.stock||0)<=5).length;
  q('#view').innerHTML='<div class="admin-stats"><article class="admin-stat-card warm"><span>إجمالي الطلبات</span><b>'+O.length+'</b><small>كل الطلبات المسجلة</small></article><article class="admin-stat-card"><span>طلبات تحتاج متابعة</span><b>'+activeOrders+'</b><small>طلبات غير مكتملة</small></article><article class="admin-stat-card"><span>المبيعات المُسلّمة</span><b>'+m(delivered)+'</b><small>إجمالي الطلبات المسلّمة</small></article><article class="admin-stat-card"><span>مخزون منخفض</span><b>'+low+'</b><small>كتب تحتاج مراجعة</small></article></div><div class="admin-dashboard-grid"><section class="admin-panel"><div class="admin-panel-head"><div><span class="eyebrow">QUICK ACTIONS</span><h2>إجراءات سريعة</h2></div></div><div class="quick-actions"><button class="button button-dark" data-quick="new-product">+ إضافة كتاب</button><button class="button button-outline" data-quick="products">إدارة الكتب</button><button class="button button-outline" data-quick="orders">متابعة الطلبات</button><button class="button button-outline" data-quick="inventory">مراجعة المخزون</button></div></section><section class="admin-panel"><div class="admin-panel-head"><div><span class="eyebrow">LOW STOCK</span><h2>المخزون المنخفض</h2></div></div><div class="admin-list">'+P.filter(x=>(+x.stock||0)<=5).slice(0,8).map(x=>'<div><b>'+e(x.nameAr||x.nameEn)+'</b><span>المتبقي: '+(+x.stock||0)+'</span></div>').join('')+'</div></section></div>';
}
function inventory(){
  const low=P.filter(x=>(+x.stock||0)<=5),out=P.filter(x=>(+x.stock||0)<=0);
  q('#view').innerHTML='<div class="products-toolbar"><div class="products-toolbar-copy"><span class="eyebrow">INVENTORY</span><h2>إدارة المخزون</h2><p>مراجعة الكميات بسرعة ومعرفة الكتب التي تحتاج إعادة تخزين.</p></div><div class="products-toolbar-actions"><button id="newp" class="button button-dark">+ إضافة كتاب</button></div></div><section class="admin-panel"><div class="admin-stats"><article class="admin-stat-card"><span>إجمالي الكتب</span><b>'+P.length+'</b></article><article class="admin-stat-card"><span>مخزون منخفض</span><b>'+low.length+'</b></article><article class="admin-stat-card"><span>نفد المخزون</span><b>'+out.length+'</b></article></div><div class="products-admin-grid">'+P.map(productCard).join('')+'</div></section>';
}
function promotions(){
  const s=demoState();
  q('#view').innerHTML=demoBanner()+'<div class="admin-section-head"><h2>الخصومات والعروض</h2><button id="newpromo" class="button button-dark">+ عرض جديد</button></div><div class="admin-list">'+s.promotions.map(p=>'<div><b>'+e(p.name)+'</b><span>'+e(p.code)+' · '+(p.type==='percent'?p.value+'%':m(p.value))+'</span><span>'+ (p.active?'نشط':'متوقف') +'</span><button data-editpromo="'+p.id+'">تعديل</button><button data-deletepromo="'+p.id+'">حذف</button></div>').join('')+'</div>';
}
function promoForm(p={}){
  q('#view').innerHTML=demoBanner()+'<div class="admin-form-card"><h2>العرض والخصم</h2><form id="promof" class="form-grid"><input type="hidden" name="id" value="'+e(p.id||'')+'"><label class="field"><span>اسم العرض</span><input name="name" required value="'+e(p.name||'')+'"></label><label class="field"><span>كود الخصم</span><input name="code" required value="'+e(p.code||'')+'"></label><label class="field"><span>النوع</span><select name="type"><option value="percent" '+(p.type==='percent'?'selected':'')+'>نسبة مئوية</option><option value="fixed" '+(p.type==='fixed'?'selected':'')+'>قيمة ثابتة</option></select></label><label class="field"><span>القيمة</span><input name="value" type="number" min="0" step=".01" required value="'+(p.value??0)+'"></label><label class="field"><span>الحد الأدنى للطلب</span><input name="minOrder" type="number" min="0" step=".01" value="'+(p.minOrder??0)+'"></label><label class="field"><span>ينتهي في</span><input name="expiresAt" type="date" value="'+e(p.expiresAt||'')+'"></label><label class="check-card"><input type="checkbox" name="active" '+(p.active?'checked':'')+'><span><b>العرض نشط</b><small>يمكن استخدامه في الديمو</small></span></label><button class="button button-dark field-wide">حفظ العرض</button></form></div>';
  q('#promof').onsubmit=x=>{x.preventDefault();const d=Object.fromEntries(new FormData(x));d.active=x.target.active.checked;demoSavePromotion(d);promotions()};
}
function customers(){
  const s=demoState();
  q('#view').innerHTML=demoBanner()+'<section class="admin-panel"><div class="admin-panel-head"><div><span class="eyebrow">CUSTOMERS</span><h2>العملاء</h2></div><span>'+s.customers.length+' عميل</span></div><div class="admin-toolbar"><label class="admin-search"><span>⌕</span><input id="customer-search" placeholder="ابحث بالاسم أو الهاتف أو البريد"></label></div><div class="admin-list" id="customer-list">'+s.customers.map(customerRow).join('')+'</div></section>';
  q('#customer-search').oninput=paintCustomers;
}
function customerRow(c){return '<div data-customer="'+c.id+'"><div><b>'+e(c.name)+'</b><small>'+e(c.phone)+' · '+e(c.email)+'</small></div><span>'+c.orders+' طلب · '+m(c.total)+'</span><button data-editcustomer="'+c.id+'">تعديل</button></div>'}
function paintCustomers(){const s=demoState(),t=(q('#customer-search').value||'').toLowerCase();q('#customer-list').innerHTML=s.customers.filter(c=>[c.name,c.phone,c.email].join(' ').toLowerCase().includes(t)).map(customerRow).join('')}
function customerForm(c){
  q('#view').innerHTML=demoBanner()+'<div class="admin-form-card"><h2>بيانات العميل</h2><form id="customerf" class="form-grid"><input type="hidden" name="id" value="'+e(c.id)+'"><label class="field"><span>الاسم</span><input name="name" value="'+e(c.name)+'" readonly></label><label class="field"><span>الهاتف</span><input name="phone" value="'+e(c.phone)+'" readonly></label><label class="field"><span>الحالة</span><select name="status"><option value="active" '+(c.status==='active'?'selected':'')+'>نشط</option><option value="inactive" '+(c.status==='inactive'?'selected':'')+'>غير نشط</option></select></label><label class="field field-wide"><span>ملاحظات الإدارة</span><textarea name="notes">'+e(c.notes||'')+'</textarea></label><button class="button button-dark field-wide">حفظ</button></form></div>';
  q('#customerf').onsubmit=x=>{x.preventDefault();demoSaveCustomer(Object.fromEntries(new FormData(x)));customers()};
}
function settings(){
  const s=demoState().settings;
  q('#view').innerHTML=demoBanner()+'<div class="admin-form-card"><h2>إعدادات المتجر</h2><form id="settingsf" class="form-grid"><label class="field"><span>اسم المتجر</span><input name="storeName" value="'+e(s.storeName)+'"></label><label class="field"><span>الهاتف</span><input name="phone" value="'+e(s.phone)+'"></label><label class="field"><span>واتساب</span><input name="whatsapp" value="'+e(s.whatsapp)+'"></label><label class="field"><span>البريد</span><input name="email" type="email" value="'+e(s.email)+'"></label><label class="field"><span>العملة</span><input name="currency" value="'+e(s.currency)+'"></label><label class="check-card"><input type="checkbox" name="deliveryEnabled" '+(s.deliveryEnabled?'checked':'')+'><span><b>تفعيل التوصيل</b><small>في الديمو فقط</small></span></label><label class="check-card"><input type="checkbox" name="orderAutoRefresh" '+(s.orderAutoRefresh?'checked':'')+'><span><b>تحديث الطلبات تلقائيًا</b><small>كل 15 ثانية</small></span></label><button class="button button-dark field-wide">حفظ الإعدادات</button></form></div>';
  q('#settingsf').onsubmit=x=>{x.preventDefault();const d=Object.fromEntries(new FormData(x));d.deliveryEnabled=x.target.deliveryEnabled.checked;d.orderAutoRefresh=x.target.orderAutoRefresh.checked;demoSaveSettings(d);alert('تم حفظ إعدادات الديمو.');};
}
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

function normalizeImportKey(v){return String(v??'').trim().toLowerCase().replace(/[\\s_\\-\\/\\\\.]+/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه')}
function importValue(row,names){for(const n of names){const k=normalizeImportKey(n);for(const rk of Object.keys(row)){if(normalizeImportKey(rk)===k&&String(row[rk]??'').trim()!=='')return row[rk]}}return ''}
function boolValue(v,def=true){if(v===undefined||v===null||String(v).trim()==='')return def;return ['1','true','yes','y','نعم','متاح','منشور','ظاهر'].includes(String(v).trim().toLowerCase())}
function numberValue(v,def=0){const n=Number(String(v??'').replace(/[,،]/g,''));return Number.isFinite(n)?n:def}
function slugValue(v){return String(v??'').trim().toLowerCase().replace(/\\s+/g,'-').replace(/[^\\p{L}\\p{N}\\-_]+/gu,'').replace(/-+/g,'-').replace(/^-|-$/g,'')}
function resolveCategory(v){const needle=normalizeImportKey(v);if(!needle)return null;const hit=C.find(c=>[c.id,c.slug,c.nameAr,c.nameEn,c.name_ar,c.name_en].some(x=>normalizeImportKey(x)===needle));return hit?.id||null}
function importRowToProduct(row){
  const existingId=importValue(row,['id','product_id','معرف','رقم']),sku=String(importValue(row,['sku','SKU','كود','كود الكتاب'])).trim(),slug=slugValue(importValue(row,['slug','الرابط','الرابط المختصر']));
  const existing=P.find(p=>(existingId&&String(p.id)===String(existingId))||(sku&&String(p.sku||'')===sku)||(slug&&String(p.slug||'')===slug));
  const nameAr=String(importValue(row,['nameAr','name_ar','arabic_name','الاسم العربي','اسم الكتاب'])).trim(),nameEn=String(importValue(row,['nameEn','name_en','english_name','English title','الاسم الانجليزي'])).trim();
  return {id:existing?.id||existingId||null,nameAr:nameAr||existing?.nameAr||'',nameEn:nameEn||existing?.nameEn||'',slug:slug||slugValue(existing?.slug||nameEn||nameAr)||('book-'+Date.now()+'-'+Math.random().toString(36).slice(2,7)),categoryId:resolveCategory(importValue(row,['categoryId','category_id','category','القسم','التصنيف']))||existing?.categoryId||null,price:numberValue(importValue(row,['price','السعر']),existing?.price||0),compareAt:numberValue(importValue(row,['compareAt','compare_at_price','السعر قبل الخصم']),existing?.compareAt||0)||null,sku:sku||existing?.sku||'',stock:numberValue(importValue(row,['stock','المخزون','الكمية']),existing?.stock||0),active:boolValue(importValue(row,['active','published','ظاهر','منشور']),existing?.active!==false),featured:boolValue(importValue(row,['featured','مميز']),existing?.featured||false),badge:String(importValue(row,['badge','الشارة','وسم'])||existing?.badge||''),author:String(importValue(row,['author','المؤلف'])||existing?.author||''),isbn:String(importValue(row,['isbn','ISBN'])||existing?.isbn||''),publisher:String(importValue(row,['publisher','الناشر'])||existing?.publisher||''),pages:numberValue(importValue(row,['pages','عدد الصفحات']),existing?.pages||0)||null,language:String(importValue(row,['language','اللغة'])||existing?.language||''),descriptionAr:String(importValue(row,['descriptionAr','description_ar','الوصف العربي'])||existing?.descriptionAr||''),descriptionEn:String(importValue(row,['descriptionEn','description_en','English description','الوصف الانجليزي'])||existing?.descriptionEn||'')};
}
function openCatalogImport(){
  if(!window.XLSX){alert('أداة Excel لم تُحمّل بعد. أعد فتح الصفحة وحاول مرة أخرى.');return}
  const modal='<div class="product-modal-backdrop" id="catalog-import-modal"><section class="product-modal" role="dialog" aria-modal="true"><header class="product-modal-head"><div><span class="eyebrow">BULK IMPORT</span><h2>استيراد وتحديث الكتب</h2></div><button class="modal-close" data-close-import>×</button></header><div class="product-editor"><div class="admin-note">سيتم تحديث الكتاب إذا تطابق <b>ID</b> أو <b>SKU</b> أو <b>Slug</b>، وإلا سيتم إنشاء كتاب جديد. اترك الحقول التي لا تريد تغييرها فارغة.</div><div id="import-summary" class="admin-panel" style="margin-top:14px"><p>اختر ملف Excel أو CSV للبدء.</p></div><div class="product-modal-actions"><button class="button button-outline" data-close-import>إلغاء</button><button class="button button-dark" id="import-run" disabled>تنفيذ الاستيراد</button></div></div></section></div>';
  q('#view').insertAdjacentHTML('beforeend',modal);
  const modalEl=q('#catalog-import-modal'),summary=q('#import-summary'),run=q('#import-run'),input=q('#catalog-import-file');
  let rows=[],mapped=[];
  modalEl.querySelectorAll('[data-close-import]').forEach(b=>b.onclick=()=>modalEl.remove());
  input.onchange=async ev=>{
    const file=ev.target.files?.[0]; if(!file)return;
    try{
      const data=await file.arrayBuffer(),wb=XLSX.read(data,{type:'array'}),sheet=wb.Sheets[wb.SheetNames[0]];
      rows=XLSX.utils.sheet_to_json(sheet,{defval:''}).filter(r=>Object.values(r).some(v=>String(v).trim()!==''));
      mapped=rows.map(importRowToProduct);
      const invalid=mapped.filter(x=>(!x.nameAr&&!x.nameEn)||x.price<0||x.stock<0);
      summary.innerHTML='<div class="admin-stats"><article class="admin-stat-card"><span>صفوف مقروءة</span><b>'+rows.length+'</b></article><article class="admin-stat-card"><span>تحديث</span><b>'+mapped.filter(x=>x.id).length+'</b></article><article class="admin-stat-card"><span>جديد</span><b>'+mapped.filter(x=>!x.id).length+'</b></article><article class="admin-stat-card"><span>غير صالحة</span><b>'+invalid.length+'</b></article></div><div class="admin-note">المطابقة بالأولوية: ID ثم SKU ثم Slug. الصفوف غير الصالحة سيتم تجاهلها.</div>';
      run.disabled=!mapped.some(x=>x.nameAr||x.nameEn);run._rows=mapped.filter(x=>(x.nameAr||x.nameEn)&&x.price>=0&&x.stock>=0);
    }catch(ex){summary.innerHTML='<div class="form-error">تعذر قراءة الملف: '+e(ex.message)+'</div>';run.disabled=true}
  };
  run.onclick=async()=>{
    const data=run._rows||[];if(!data.length)return;run.disabled=true;let ok=0,fail=0;
    for(let i=0;i<data.length;i++){run.textContent='حفظ '+(i+1)+' / '+data.length;try{const saved=await A().saveProduct(data[i]);if(saved?.id&&!data[i].id)data[i].id=saved.id;ok++}catch(ex){fail++}}
    modalEl.remove();await loadProducts();products();alert('تم الاستيراد: '+ok+' بنجاح'+(fail?'، '+fail+' صفوف فشلت':'')); 
  };
  input.click();
}
function exportCatalog(){
  if(!window.XLSX){alert('أداة Excel لم تُحمّل بعد.');return}
  const rows=P.map(p=>({id:p.id,nameAr:p.nameAr,nameEn:p.nameEn,slug:p.slug,category:p.category?.name_ar||p.category?.name_en||'',price:p.price,compareAt:p.compareAt||'',sku:p.sku||'',stock:p.stock,active:p.active,featured:p.featured,badge:p.badge||'',author:p.author||'',isbn:p.isbn||'',publisher:p.publisher||'',pages:p.pages||'',language:p.language||'',descriptionAr:p.descriptionAr||'',descriptionEn:p.descriptionEn||''}));
  const ws=XLSX.utils.json_to_sheet(rows),wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Books');XLSX.writeFile(wb,'deliver-books-catalog.xlsx');
}
function products(){
  q('#view').innerHTML='<div class="products-toolbar"><div class="products-toolbar-copy"><span class="eyebrow">CATALOG</span><h2>مكتبة DeliverBooks</h2><p>إدارة الكتب، الأسعار، المخزون، الـSKU والصور من شاشة واحدة.</p></div><div class="products-toolbar-actions"><input id="catalog-import-file" type="file" accept=".xlsx,.xls,.csv" hidden><button id="catalog-import" class="button button-outline">استيراد Excel</button><button id="catalog-export" class="button button-outline">تصدير Excel</button><button id="newp" class="button button-dark">+ إضافة كتاب</button></div></div>'+
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
  fileInput.onchange=x=>{pendingFiles.push(...Array.from(x.target.files||[]));x.target.value='';renderPreview()};preview.onclick=x=>{const b=x.target.closest('[data-remove-file]');if(!b)return;pendingFiles.splice(+b.dataset.removeFile,1);renderPreview()};
  q('#pf').onsubmit=async x=>{
    x.preventDefault();
    const btn=q('#product-save'),err=q('#product-form-error');
    err.hidden=true;btn.disabled=true;btn.textContent='جارٍ الحفظ…';
    try{
      const fd=Object.fromEntries(new FormData(x));
      fd.active=x.target.active.checked;fd.featured=x.target.featured.checked;
      const saved=demoMode()?demoSaveProduct(fd):await A().saveProduct(fd),id=saved.id;
      for(let i=0;i<pendingFiles.length;i++){btn.textContent='جارٍ رفع الصورة '+(i+1)+' من '+pendingFiles.length+'…';await A().uploadProductImage(id,pendingFiles[i]);}
      modalEl.remove();await loadProducts();products();
    }catch(ex){err.textContent=ex.message||'تعذر حفظ الكتاب.';err.hidden=false;btn.disabled=false;btn.textContent='حفظ الكتاب'}
  };
  modalEl.querySelectorAll('[data-close-product]').forEach(b=>b.onclick=()=>modalEl.remove());
  modalEl.querySelectorAll('[data-delimage]').forEach(b=>b.onclick=async()=>{if(!b.dataset.delimage)return;const err=q('#product-form-error');b.disabled=true;err.hidden=true;try{await A().deleteProductImage(b.dataset.delimage);await loadProducts();const fresh=P.find(v=>String(v.id)===String(p.id));modalEl.remove();productForm(fresh||p)}catch(ex){b.disabled=false;err.textContent=ex.message;err.hidden=false}});
  modalEl.onmousedown=x=>{if(x.target===modalEl)modalEl.remove()};
  document.onkeydown=function keyHandler(x){if(x.key==='Escape'&&q('#product-modal')){q('#product-modal').remove();document.removeEventListener('keydown',keyHandler)}};
  modalEl.querySelectorAll('[data-remove-file]').forEach(b=>b.onclick=()=>{pendingFiles.splice(+b.dataset.removeFile,1);renderPreview()});
}

async function loadProducts(){if(demoMode()){P=demoState().products.map(demoProductFrom);return}try{P=await A().adminProducts();}catch(_){P=[]}if(!P.length&&demoMode())P=demoState().products.map(demoProductFrom)}

function categories(){
  q('#view').innerHTML='<div class="admin-section-head"><h2>الأقسام</h2><button id="newc" class="button button-dark">+ قسم</button></div><div class="admin-list">'+C.map(c=>'<div><b>'+e(c.nameAr)+'</b><span>'+e(c.slug)+'</span><button data-editc="'+c.id+'">تعديل</button></div>').join('')+'</div>';
}
function catForm(c={}){
  q('#view').innerHTML='<div class="admin-form-card"><h2>القسم</h2><form id="cf" class="form-grid"><input type="hidden" name="id" value="'+(c.id||'')+'"><label class="field"><span>العربي</span><input name="nameAr" required value="'+e(c.nameAr||'')+'"></label><label class="field"><span>English</span><input name="nameEn" value="'+e(c.nameEn||'')+'"></label><label class="field"><span>Slug</span><input name="slug" required value="'+e(c.slug||'')+'"></label><label class="field"><span>الترتيب</span><input name="sortOrder" type="number" value="'+(c.sortOrder||0)+'"></label><button class="button button-dark field-wide">حفظ</button></form></div>';
  q('#cf').onsubmit=async x=>{x.preventDefault();const d=Object.fromEntries(new FormData(x));if(demoMode())demoSaveCategory(d);else await A().saveCategory(d);C=demoMode()?demoState().categories:await A().adminCategories();categories()};
}
function zones(){
  q('#view').innerHTML='<div class="admin-section-head"><h2>مناطق التوصيل</h2><button id="newz" class="button button-dark">+ منطقة</button></div><div class="admin-list">'+Z.map(z=>'<div><b>'+e(z.nameAr)+'</b><span>'+m(z.fee)+'</span><span>'+(z.freeAbove?('مجاني فوق '+m(z.freeAbove)):'')+'</span><button data-editz="'+z.id+'">تعديل</button></div>').join('')+'</div><p class="admin-note">لا توجد رسوم افتراضية؛ هذه القيم هي التي يستخدمها الطلب.</p>';
}
function zoneForm(z={}){
  q('#view').innerHTML='<div class="admin-form-card"><h2>منطقة التوصيل</h2><form id="zf" class="form-grid"><input type="hidden" name="id" value="'+(z.id||'')+'"><label class="field"><span>العربي</span><input name="nameAr" required value="'+e(z.nameAr||'')+'"></label><label class="field"><span>English</span><input name="nameEn" value="'+e(z.nameEn||'')+'"></label><label class="field"><span>الرسوم</span><input name="fee" type="number" min="0" step=".01" required value="'+(z.fee??'')+'"></label><label class="field"><span>مجاني فوق</span><input name="freeAbove" type="number" min="0" step=".01" value="'+(z.freeAbove??'')+'"></label><button class="button button-dark field-wide">حفظ</button></form></div>';
  q('#zf').onsubmit=async x=>{x.preventDefault();const d=Object.fromEntries(new FormData(x));if(demoMode())demoSaveZone(d);else await A().saveZone(d);Z=demoMode()?demoState().zones:await A().adminZones();zones()};
}
async function route(t){
  const names={dashboard:'نظرة عامة',orders:'الطلبات',products:'الكتب',inventory:'المخزون',categories:'الأقسام',zones:'التوصيل',promotions:'الخصومات',customers:'العملاء',settings:'الإعدادات'},subs={dashboard:'ملخص سريع لأداء المتجر والطلبات والمخزون.',orders:'متابعة الطلبات وإدارة حالة كل طلب من مكان واحد.',products:'إدارة كتالوج الكتب والمخزون والبيانات الأساسية.',inventory:'متابعة الكميات والكتب منخفضة المخزون.',categories:'تنظيم أقسام المتجر وترتيب ظهورها للعملاء.',zones:'إدارة مناطق التوصيل والأسعار الحقيقية المعتمدة.',promotions:'إدارة العروض وكوبونات الخصم.',customers:'متابعة بيانات العملاء وسجل تعاملاتهم.',settings:'إعدادات المتجر والخيارات التشغيلية.'};
  q('#title').textContent=names[t];q('#page-subtitle').textContent=subs[t];q('#title-label').textContent=names[t];
  document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('is-active',x.dataset.tab===t));
  if(t==='dashboard'){await loadOrders();await loadProducts();dashboard()}
  if(t==='orders')await loadOrders();
  if(t==='products'){await loadProducts();products()}
  if(t==='inventory'){await loadProducts();inventory()}
  if(t==='promotions')promotions();
  if(t==='customers')customers();
  if(t==='settings')settings();
  if(t==='categories'){C=demoMode()?demoState().categories:await A().adminCategories();categories()}
  if(t==='zones'){Z=demoMode()?demoState().zones:await A().adminZones();zones()}
}
function bind(){
  document.addEventListener('click',async x=>{
    let t=x.target.closest('[data-tab]');if(t){await route(t.dataset.tab);return}
    if(x.target.closest('#refresh')){await route(document.querySelector('[data-tab].is-active').dataset.tab);return}
    if(x.target.closest('#logout')){await A().staffLogout();location.reload();return}
    if(x.target.closest('[data-quick="new-product"]')){productForm();return}
    if(x.target.closest('[data-quick="products"]')){await route('products');return}
    if(x.target.closest('[data-quick="orders"]')){await route('orders');return}
    if(x.target.closest('[data-quick="inventory"]')){await route('inventory');return}
    if(x.target.closest('#catalog-import')){openCatalogImport();return}
    if(x.target.closest('#catalog-export')){exportCatalog();return}
    if(x.target.closest('#newp')||x.target.closest('#newp-empty')){productForm();return}
    if(x.target.closest('#newc')){catForm();return}
    if(x.target.closest('#newz')){zoneForm();return}
    let p=x.target.closest('[data-editp]');if(p){const item=P.find(v=>String(v.id)===p.dataset.editp);if(item)productForm(item);return}
    let c=x.target.closest('[data-editc]');if(c){const item=C.find(v=>String(v.id)===c.dataset.editc);if(item)catForm(item);return}
    let z=x.target.closest('[data-editz]');if(z){const item=Z.find(v=>String(v.id)===z.dataset.editz);if(item)zoneForm(item);return}
    if(x.target.closest('#disable-demo')){localStorage.setItem('db_demo_mode','off');alert('تم إيقاف الديمو. أعد تحديث البيانات لاستخدام الـbackend الحقيقي.');location.reload();return}
    if(x.target.closest('#newpromo')){promoForm();return}
    let prEdit=x.target.closest('[data-editpromo]');if(prEdit){const item=demoState().promotions.find(v=>String(v.id)===prEdit.dataset.editpromo);if(item)promoForm(item);return}
    let prDel=x.target.closest('[data-deletepromo]');if(prDel&&confirm('حذف هذا العرض؟')){demoDeletePromotion(prDel.dataset.deletepromo);promotions();return}
    let cuEdit=x.target.closest('[data-editcustomer]');if(cuEdit){const item=demoState().customers.find(v=>String(v.id)===cuEdit.dataset.editcustomer);if(item)customerForm(item);return}
    let pr=x.target.closest('[data-print]');if(pr){let o=O.find(v=>v.id===pr.closest('.admin-order').dataset.id);sessionStorage.setItem('db_print_order',JSON.stringify(o));window.open('print.html','_blank');return}
    let s=x.target.closest('[data-status]');if(s){let o=O.find(v=>v.id===s.closest('.admin-order').dataset.id);if(o&&s.value!==o.status){if(demoMode())demoUpdateOrder(o.id,s.value,'تم التحديث من الإدارة');else await A().updateOrderStatus(o.id,s.value,'تم التحديث من الإدارة');await loadOrders();orders()};return}
    let rm=x.target.closest('[data-remove-file]');if(rm){return}
  });
}
async function boot(){shell();bind();await route('orders');setInterval(()=>loadOrders().catch(()=>{}),15000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>DBApi.staffToken()?boot():gate());else DBApi.staffToken()?boot():gate()
})();