(function(root){
'use strict';
const c=root.DeliverBooksConfig, sb=root.supabase?.createClient(c.supabaseUrl,c.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,storageKey:'db-customer'}}), token=()=>sessionStorage.getItem('db_staff_token')||'';
const rows=async q=>{const r=await q;if(r.error)throw r.error;return r.data||[]}, rpc=async(n,a)=>{const r=await sb.rpc(n,a);if(r.error)throw r.error;return r.data};
const sel='id,category_id,name_en,name_ar,slug,description_en,description_ar,price,compare_at_price,sku,stock,featured,badge,author,isbn,publisher,pages,language,active,categories(id,name_en,name_ar,slug),product_images(image,sort_order)';
const map=p=>({id:p.id,slug:p.slug||'',nameEn:p.name_en||'',nameAr:p.name_ar||p.name_en||'',descriptionEn:p.description_en||'',descriptionAr:p.description_ar||'',price:+p.price||0,compareAt:p.compare_at_price==null?null:+p.compare_at_price,stock:+p.stock||0,featured:!!p.featured,badge:p.badge||'',author:p.author||'',isbn:p.isbn||'',publisher:p.publisher||'',pages:p.pages||null,language:p.language||'',category:p.categories,images:(p.product_images||[]).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)).map(x=>x.image).filter(Boolean)});
async function login(code,role){const d=await rpc('admin_login',{p_code:code,p_role:role});sessionStorage.setItem('db_staff_token',d.token);sessionStorage.setItem('db_staff_role',d.role);return d}
root.DBApi={
client:sb,
categories:()=>rows(sb.from('categories').select('id,name_en,name_ar,slug,description_en,description_ar,image,visible,sort_order').eq('visible',true).order('sort_order')),
products:async o=>{let q=sb.from('products').select(sel).eq('active',true).order('featured',{ascending:false}).order('id',{ascending:false}),a=(await rows(q)).map(map);o=o||{};if(o.featured)a=a.filter(x=>x.featured);if(o.category)a=a.filter(x=>x.category?.slug===o.category);return a},
product:async id=>{let q=sb.from('products').select(sel).eq('active',true);q=/^\d+$/.test(String(id))?q.eq('id',+id):q.eq('slug',id);const r=await q.maybeSingle();if(r.error)throw r.error;return r.data?map(r.data):null},
deliveryZones:()=>rows(sb.from('delivery_zones').select('id,name_en,name_ar,fee,free_above,sort_order').eq('active',true).not('fee','is',null).order('sort_order')),
placeOrder:p=>rpc('place_order',{p_payload:p}),
trackOrder:(n,t)=>rpc('track_order',{p_order_number:n,p_tracking_token:t||''}),
staffLogin:login,staffToken:token,staffLogout:async()=>{if(token())await rpc('admin_logout',{p_token:token()}).catch(()=>{});sessionStorage.clear()},
adminOrders:()=>rpc('admin_list_orders',{p_token:token(),p_limit:250}),
updateOrderStatus:(id,status,note)=>rpc('admin_update_order_status',{p_token:token(),p_order_id:id,p_status:status,p_note:note||''}),
adminCategories:()=>rpc('admin_list_categories',{p_token:token()}),
adminProducts:()=>rpc('admin_list_products',{p_token:token()}),
adminZones:()=>rpc('admin_list_zones',{p_token:token()}),
saveCategory:p=>rpc('admin_save_category',{p_token:token(),p_id:p.id||null,p_name_en:p.nameEn,p_name_ar:p.nameAr,p_slug:p.slug,p_description_en:'',p_description_ar:'',p_image:'',p_visible:true,p_sort_order:+p.sortOrder||0}),
saveProduct:p=>rpc('admin_save_product',{p_token:token(),p_id:p.id||null,p_category_id:p.categoryId||null,p_name_en:p.nameEn,p_name_ar:p.nameAr,p_slug:p.slug,p_description_en:p.descriptionEn||'',p_description_ar:p.descriptionAr||'',p_price:+p.price||0,p_compare_at_price:p.compareAt?+p.compareAt:null,p_sku:p.sku||'',p_stock:+p.stock||0,p_active:p.active!==false,p_featured:!!p.featured,p_badge:p.badge||'',p_author:p.author||'',p_isbn:p.isbn||'',p_publisher:p.publisher||'',p_pages:p.pages?+p.pages:null,p_language:p.language||''}),uploadProductImage:async(productId,file)=>{const fd=new FormData();fd.append('token',token());fd.append('product_id',String(productId));fd.append('file',file);const r=await fetch(c.supabaseUrl+'/functions/v1/admin-product-image',{method:'POST',headers:{apikey:c.supabaseAnonKey},body:fd});const d=await r.json().catch(()=>({}));if(!r.ok||d.error)throw new Error(d.error||'تعذر رفع الصورة.');return d;},deleteProductImage:async(imageId)=>{const fd=new FormData();fd.append('token',token());fd.append('action','delete');fd.append('image_id',String(imageId));const r=await fetch(c.supabaseUrl+'/functions/v1/admin-product-image',{method:'POST',headers:{apikey:c.supabaseAnonKey},body:fd});const d=await r.json().catch(()=>({}));if(!r.ok||d.error)throw new Error(d.error||'تعذر حذف الصورة.');return d},
saveZone:p=>rpc('admin_save_zone',{p_token:token(),p_id:p.id||null,p_name_en:p.nameEn,p_name_ar:p.nameAr,p_fee:+p.fee,p_free_above:p.freeAbove?+p.freeAbove:null,p_active:true,p_sort_order:+p.sortOrder||0})
};
})(window);