(() => {
 const {search,hash}=location;
 const query=new URLSearchParams(search);
 if(query.has('category')||hash){
  location.replace(new URL('tempered.html'+search+hash,location.href));
 }
})();
