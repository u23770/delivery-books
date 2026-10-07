(function(){
'use strict';
const sb=window.supabase.createClient(window.DeliverBooksConfig.supabaseUrl,window.DeliverBooksConfig.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,storageKey:'db-customer'}});
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const root=document.querySelector('#auth-root')||document.querySelector('#account-root');
const msg=(text,type='success')=>{const el=document.querySelector('#auth-message');if(el){el.hidden=false;el.className='form-message '+type;el.textContent=text}};
const origin=location.origin;
const accountUrl=origin+'/account.html';
const authUrl=origin+'/auth.html';

function authCard(){
  root.innerHTML='<section class="auth-panel"><div class="auth-visual"><span class="auth-visual-mark">DB</span><div><span class="eyebrow">DELIVER BOOKS</span><h2>كتبك، حسابك، وكل طلباتك في مكان واحد.</h2><p>أنشئ حسابًا مجانيًا لحفظ بياناتك والوصول إليها بسهولة في كل زيارة.</p></div></div><div class="auth-form-area"><a class="auth-back" href="index.html">← العودة للمتجر</a><span class="eyebrow">MY ACCOUNT</span><h1 id="auth-title">تسجيل الدخول</h1><p class="auth-intro" id="auth-intro">ادخل إلى حسابك لإدارة بياناتك بسهولة.</p><div class="auth-tabs"><button type="button" data-auth-mode="login" class="is-active">دخول</button><button type="button" data-auth-mode="signup">حساب جديد</button></div><form id="auth-form" class="auth-form"></form><div id="auth-message" class="form-message" hidden></div><div class="auth-links"><button type="button" data-forgot>نسيت كلمة المرور؟</button><a href="shop.html">تصفح الكتب بدون حساب</a></div></div></section>';
}

function fields(mode){
  if(mode==='signup')return '<label class="field"><span>الاسم</span><input name="name" autocomplete="name" required></label><label class="field"><span>رقم الهاتف</span><input name="phone" autocomplete="tel" inputmode="tel"></label><label class="field"><span>البريد الإلكتروني *</span><input type="email" name="email" autocomplete="email" required></label><label class="field"><span>كلمة المرور *</span><input type="password" name="password" autocomplete="new-password" minlength="6" required></label><label class="field"><span>تأكيد كلمة المرور *</span><input type="password" name="confirm" autocomplete="new-password" minlength="6" required></label><button class="button button-dark button-full" type="submit">إنشاء الحساب</button>';
  if(mode==='reset')return '<label class="field"><span>كلمة المرور الجديدة *</span><input type="password" name="password" autocomplete="new-password" minlength="6" required></label><label class="field"><span>تأكيد كلمة المرور *</span><input type="password" name="confirm" autocomplete="new-password" minlength="6" required></label><button class="button button-dark button-full" type="submit">حفظ كلمة المرور</button>';
  if(mode==='forgot')return '<label class="field"><span>البريد الإلكتروني *</span><input type="email" name="email" autocomplete="email" required></label><button class="button button-dark button-full" type="submit">إرسال رابط الاستعادة</button>';
  return '<label class="field"><span>البريد الإلكتروني *</span><input type="email" name="email" autocomplete="email" required></label><label class="field"><span>كلمة المرور *</span><input type="password" name="password" autocomplete="current-password" required></label><button class="button button-dark button-full" type="submit">تسجيل الدخول</button>';
}

function renderForm(mode){
  const title=document.querySelector('#auth-title'),intro=document.querySelector('#auth-intro'),form=document.querySelector('#auth-form');
  const login=mode==='login',signup=mode==='signup';
  if(title)title.textContent=login?'تسجيل الدخول':signup?'إنشاء حساب':'استعادة الحساب';
  if(intro)intro.textContent=login?'ادخل إلى حسابك لإدارة بياناتك بسهولة.':signup?'أنشئ حسابك في ثوانٍ واحفظ بيانات التواصل للطلبات القادمة.':mode==='reset'?'اختَر كلمة مرور جديدة وآمنة.':'اكتب بريدك وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.';
  form.innerHTML=fields(mode);
  document.querySelectorAll('[data-auth-mode]').forEach(b=>b.classList.toggle('is-active',b.dataset.authMode===mode));
  const forgot=document.querySelector('[data-forgot]');
  if(forgot){forgot.textContent=mode==='forgot'?'العودة لتسجيل الدخول':'نسيت كلمة المرور؟';forgot.onclick=()=>renderForm(mode==='forgot'?'login':'forgot')}
  form.onsubmit=async e=>{e.preventDefault();const fd=new FormData(form),button=form.querySelector('button[type=submit]');button.disabled=true;msg('', '');try{
    if(mode==='signup'){
      const password=String(fd.get('password')||''),confirm=String(fd.get('confirm')||'');
      if(password!==confirm)throw new Error('كلمتا المرور غير متطابقتين.');
      const {data,error}=await sb.auth.signUp({email:String(fd.get('email')).trim(),password,options:{data:{full_name:String(fd.get('name')||'').trim(),phone:String(fd.get('phone')||'').trim()},emailRedirectTo:accountUrl}});
      if(error)throw error;
      if(data.session)location.href=accountUrl;else msg('تم إنشاء الحساب. افتح بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.','success');
    }else if(mode==='login'){
      const {error}=await sb.auth.signInWithPassword({email:String(fd.get('email')).trim(),password:String(fd.get('password')||'')});
      if(error)throw error;
      location.href=accountUrl;
    }else if(mode==='forgot'){
      const {error}=await sb.auth.resetPasswordForEmail(String(fd.get('email')).trim(),{redirectTo:authUrl+'?mode=reset'});
      if(error)throw error;
      msg('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني.','success');
    }else{
      const password=String(fd.get('password')||''),confirm=String(fd.get('confirm')||'');
      if(password!==confirm)throw new Error('كلمتا المرور غير متطابقتين.');
      const {error}=await sb.auth.updateUser({password});
      if(error)throw error;
      msg('تم تحديث كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول.','success');
      setTimeout(()=>location.href=authUrl+'?mode=login',900);
    }
  }catch(err){msg(err.message||'حدث خطأ غير متوقع.','error')}finally{button.disabled=false}};
}

async function initAuth(){
  authCard();
  const requested=new URLSearchParams(location.search).get('mode');
  const {data}=await sb.auth.getSession();
  if(data.session && requested!=='reset'){location.href=accountUrl;return}
  const initial=requested==='signup'?'signup':requested==='forgot'?'forgot':requested==='reset'?'reset':'login';
  renderForm(initial);
  document.querySelectorAll('[data-auth-mode]').forEach(b=>b.onclick=()=>renderForm(b.dataset.authMode));
  sb.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'&&session)location.href=accountUrl;if(event==='PASSWORD_RECOVERY')renderForm('reset')});
}

async function initAccount(){
  const {data,error}=await sb.auth.getUser();
  if(error||!data.user){location.href=authUrl+'?mode=login';return}
  const user=data.user,metadata=user.user_metadata||{};
  root.innerHTML='<section class="account-card account-profile-card"><div class="profile-welcome"><div class="profile-avatar">'+esc((metadata.full_name||user.email||'D').slice(0,1).toUpperCase())+'</div><div><span class="eyebrow">MY ACCOUNT</span><h1>أهلاً بك'+(metadata.full_name?'، '+esc(metadata.full_name.split(' ')[0]):'')+'</h1><p>إدارة بياناتك وحسابك من هنا.</p></div><button class="button button-outline" type="button" id="account-logout">تسجيل الخروج</button></div><form id="profile-form" class="form-grid"><label class="field"><span>الاسم</span><input name="name" autocomplete="name" value="'+esc(metadata.full_name||'')+'"></label><label class="field"><span>البريد الإلكتروني</span><input value="'+esc(user.email||'')+'" readonly></label><label class="field"><span>رقم الهاتف</span><input name="phone" autocomplete="tel" inputmode="tel" value="'+esc(metadata.phone||'')+'"></label><label class="field"><span>كلمة مرور جديدة</span><input type="password" name="password" autocomplete="new-password" minlength="6" placeholder="اتركها فارغة لعدم التغيير"></label><div class="field field-wide"><div id="auth-message" class="form-message" hidden></div><button class="button button-dark" type="submit">حفظ التغييرات</button></div></form><div class="account-next"><div><strong>الطلبات</strong><p>لديك أيضًا صفحة مستقلة لتتبع أي طلب باستخدام رقم الطلب ورمز التتبع.</p></div><a class="button button-outline" href="track.html">تتبع طلب</a></div></section>';
  const form=document.querySelector('#profile-form');
  form.onsubmit=async e=>{e.preventDefault();const fd=new FormData(form),password=String(fd.get('password')||'').trim(),button=form.querySelector('button[type=submit]');button.disabled=true;try{const payload={data:{full_name:String(fd.get('name')||'').trim(),phone:String(fd.get('phone')||'').trim()}};if(password)payload.password=password;const {error}=await sb.auth.updateUser(payload);if(error)throw error;msg('تم حفظ بيانات الحساب.','success')}catch(err){msg(err.message||'تعذر حفظ البيانات.','error')}finally{button.disabled=false}};
  document.querySelector('#account-logout').onclick=async()=>{await sb.auth.signOut();location.href='index.html'};
}

document.addEventListener('DOMContentLoaded',()=>{if(root){if(document.body.dataset.page==='auth')initAuth();if(document.body.dataset.page==='account')initAccount()}});
})();