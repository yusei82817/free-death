(() => {
  const form=document.getElementById('searchForm');
  const input=document.getElementById('searchInput');
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const query=input.value.trim();
    if(!query){input.focus();return;}
    const destination=new URL('./search-results.html',window.location.href);
    destination.searchParams.set('q',query);
    window.location.assign(destination.href);
  });
  document.getElementById('showMore').addEventListener('click',()=>{
    document.querySelector('.shortcuts').classList.toggle('expanded');
  });
})();