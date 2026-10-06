(function(root){
  'use strict';
  const cfg = root.DeliverBooksConfig;
  const client = root.supabase && cfg ? root.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'deliver-books-customer-auth'}
  }) : null;

  async function rows(query){
    if(!client) throw new Error('Store connection is not configured.');
    const result=await query;
    if(result.error) throw result.error;
    return result.data||[];
  }

  function mapProduct(p){
    return {
      id:p.id, slug:p.slug, nameEn:p.name_en||'', nameAr:p.name_ar||p.name_en||'',
      descriptionEn:p.description_en||'', descriptionAr:p.description_ar||'',
      price:Number(p.price||0), compareAt:p.compare_at_price==null?null:Number(p.compare_at_price),
      stock:Number(p.stock||0), featured:!!p.featured, badge:p.badge||'', author:p.author||'',
      isbn:p.isbn||'', publisher:p.publisher||'', pages:p.pages||null, language:p.language||'',
      category:p.categories ? {id:p.categories.id,nameEn:p.categories.name_en||'',nameAr:p.categories.name_ar||'',slug:p.categories.slug||''}:null,
      images:Array.isArray(p.product_images)?p.product_images.sort(function(a,b){return (a.sort_order||0)-(b.sort_order||0)}).map(function(x){return x.image}).filter(Boolean):[]
    };
  }

  root.DBApi = {
    client:client,
    async categories(){
      return rows(client.from('categories').select('id,name_en,name_ar,slug,description_en,description_ar,image,sort_order').eq('visible',true).order('sort_order'));
    },
    async products(options){
      options=options||{};
      let q=client.from('products').select('id,category_id,name_en,name_ar,slug,description_en,description_ar,price,compare_at_price,stock,featured,badge,author,isbn,publisher,pages,language,categories(id,name_en,name_ar,slug),product_images(image,sort_order)').eq('active',true);
      if(options.featured) q=q.eq('featured',true);
      q=q.order('featured',{ascending:false}).order('id',{ascending:false});
      const data=await rows(q);
      let mapped=data.map(mapProduct);
      if(options.category) mapped=mapped.filter(function(p){return p.category&&p.category.slug===options.category});
      return mapped;
    },
    async product(idOrSlug){
      if(!idOrSlug) return null;
      let q=client.from('products').select('id,category_id,name_en,name_ar,slug,description_en,description_ar,price,compare_at_price,stock,featured,badge,author,isbn,publisher,pages,language,categories(id,name_en,name_ar,slug),product_images(image,sort_order)').eq('active',true);
      q=/^\d+$/.test(String(idOrSlug))?q.eq('id',Number(idOrSlug)):q.eq('slug',String(idOrSlug));
      const result=await q.maybeSingle();
      if(result.error) throw result.error;
      return result.data?mapProduct(result.data):null;
    },
    async deliveryZones(){
      return rows(client.from('delivery_zones').select('id,name_en,name_ar,fee,free_above,sort_order').eq('active',true).not('fee','is',null).order('sort_order'));
    }
  };
})(window);