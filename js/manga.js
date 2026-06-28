(function(){
  // Remove flash overlay
  var flash=document.querySelector('.impact-flash');
  if(flash) setTimeout(function(){flash.remove();},800);

  // Scroll progress bar
  window.addEventListener('scroll',function(){
    var h=document.documentElement;
    var pct=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100;
    document.getElementById('scroll-progress').style.width=pct+'%';
  },{passive:true});

  // Fetch GitHub repos count
  fetch('https://api.github.com/users/WesleyS08')
    .then(function(r){return r.json();})
    .then(function(data){
      var el=document.getElementById('gh-repos');
      var el2=document.getElementById('gh-repos-stat');
      if(el && data.public_repos) el.textContent=data.public_repos+'+';
    })
    .catch(function(){
      var el=document.getElementById('gh-repos');
      if(el) el.textContent='40+';
    });

  // Random coffee count
  var coffeeEl=document.getElementById('coffee-count');
  if(coffeeEl) coffeeEl.textContent=Math.floor(Math.random()*900+100);

  // Hero stat counter animation
  var statNums=document.querySelectorAll('.hero-stat-num');
  statNums.forEach(function(el){
    var text=el.textContent.trim();
    var match=text.match(/^(\d+)/);
    if(!match) return;
    var target=parseInt(match[1]);
    var suffix=text.replace(match[1],'');
    el.textContent='0'+suffix;
    var delay=parseFloat(getComputedStyle(el.parentElement).animationDelay)||1.5;
    setTimeout(function(){
      var start=performance.now();
      var duration=800;
      function tick(now){
        var t=Math.min((now-start)/duration,1);
        var ease=1-Math.pow(1-t,3);
        el.textContent=Math.round(target*ease)+suffix;
        if(t<1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },delay*1000+200);
  });

  // Panel reveal on scroll
  var panels=document.querySelectorAll('.reveal');
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var row=e.target.parentElement;
        var siblings=row.querySelectorAll('.reveal');
        var idx=Array.prototype.indexOf.call(siblings,e.target);
        setTimeout(function(){e.target.classList.add('revealed');},idx*120);
        io.unobserve(e.target);
      }
    });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  panels.forEach(function(p){io.observe(p);});

  // Load GitHub languages
  var langContainer=document.getElementById('gh-languages');
  var sio=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.style.width=e.target.dataset.w+'%';
        sio.unobserve(e.target);
      }
    });
  },{threshold:0.5});

  fetch('languages.json')
    .then(function(r){return r.json();})
    .then(function(data){
      var langs=data.languages||{};
      var sorted=Object.entries(langs)
        .filter(function(e){return e[1]>0;})
        .sort(function(a,b){return b[1]-a[1];});
      sorted.forEach(function(item){
        var name=item[0], pct=item[1];
        var row=document.createElement('div');
        row.className='skill-row';
        row.innerHTML=
          '<span class="skill-name white">'+name+'</span>'+
          '<div class="skill-track"><div class="skill-fill" data-w="'+pct.toFixed(0)+'"></div></div>'+
          '<span class="skill-pct white">'+pct.toFixed(1)+'%</span>';
        langContainer.appendChild(row);
      });
      langContainer.querySelectorAll('.skill-fill').forEach(function(f){sio.observe(f);});
    })
    .catch(function(){
      langContainer.innerHTML='<div style="color:#555;font-size:13px;">Erro ao carregar linguagens</div>';
    });

  var fills=document.querySelectorAll('.skill-fill');
  fills.forEach(function(f){sio.observe(f);});

  // ── PROJECT MODAL ──
  var backdrop=document.getElementById('projectModal');
  var modalTitle=document.getElementById('pmTitle');
  var modalBadge=document.getElementById('pmBadge');
  var modalDesc=document.getElementById('pmDesc');
  var modalTags=document.getElementById('pmTags');
  var modalLink=document.getElementById('pmLink');
  var modalClose=document.getElementById('pmClose');

  function openModal(card){
    modalTitle.textContent=card.dataset.title||'';
    modalDesc.textContent=card.dataset.desc||'';
    var badgeClass=card.dataset.badge||'live';
    modalBadge.className='project-modal-badge '+badgeClass;
    modalBadge.textContent=card.dataset.badgeText||'';
    var tags=(card.dataset.tags||'').split(',');
    modalTags.innerHTML='';
    tags.forEach(function(t){
      if(!t.trim()) return;
      var s=document.createElement('span');
      s.textContent=t.trim();
      if(t.trim()==='WEBBA'||t.trim()==='TJMSP') s.className='red';
      modalTags.appendChild(s);
    });
    var gh=card.dataset.github;
    if(gh){
      modalLink.href=gh;
      modalLink.style.display='inline-flex';
    }else{
      modalLink.style.display='none';
    }
    backdrop.classList.add('open');
    document.body.style.overflow='hidden';
  }

  function closeModal(){
    backdrop.classList.remove('open');
    document.body.style.overflow='';
  }

  document.querySelectorAll('.project-card[data-title]').forEach(function(card){
    card.addEventListener('click',function(){openModal(card);});
  });
  modalClose.addEventListener('click',closeModal);
  backdrop.addEventListener('click',function(e){if(e.target===backdrop) closeModal();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape') closeModal();});

  // Active nav highlighting on scroll
  var navAnchors=document.querySelectorAll('.nav-links a');
  var sections=document.querySelectorAll('[id]');
  var sectionIds=['sobre','stack','projetos','experiencia','contato'];
  window.addEventListener('scroll',function(){
    var scrollY=window.scrollY+100;
    var current='';
    sectionIds.forEach(function(id){
      var el=document.getElementById(id);
      if(el && scrollY>=el.offsetTop) current=id;
    });
    navAnchors.forEach(function(a){
      a.classList.remove('active');
      if(a.getAttribute('href')==='#'+current) a.classList.add('active');
    });
  },{passive:true});

  // Contact form (mailto fallback)
  var form=document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var name=form.elements.name.value;
      var email=form.elements.email.value;
      var msg=form.elements.message.value;
      var subject=encodeURIComponent('Contato via Portfólio — '+name);
      var body=encodeURIComponent('De: '+name+' ('+email+')\n\n'+msg);
      window.location.href='mailto:wesleysilvadossantos002@gmail.com?subject='+subject+'&body='+body;
    });
  }

  // Mobile nav toggle
  var btn=document.getElementById('mobileBtn');
  var nav=document.getElementById('navLinks');
  btn.addEventListener('click',function(){
    btn.classList.toggle('open');
    nav.classList.toggle('open');
    btn.setAttribute('aria-expanded',nav.classList.contains('open'));
  });
  nav.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click',function(){
      nav.classList.remove('open');
      btn.classList.remove('open');
    });
  });
})();
