/* === A&T RACER SHARED JS === */
const NAV_TABS = [
  ['home',      'atracer-home.html',      'Home',              null],
  ['join',      'atracer-join.html',       'Join a Season',     null],
  ['myseasons', 'atracer-myseasons.html',  'My Seasons',        '1'],
  ['midseason', 'atracer-midseason.html',  'Mid-Season Drives', null],
  ['rankings',  'atracer-rankings.html',   '🏆 Rankings',       null],
  ['profile',   'atracer-profile.html',    'Profile',           null],
  ['social',    'atracer-social.html',     'Social',            null],
];

function injectNav(){
  const pid = window.PAGE_ID || '';
  const tabs = NAV_TABS.map(([id,href,label,badge])=>{
    const active = id===pid?' active':'';
    const b = badge ? '<span class="tab-badge">'+badge+'</span>' : '';
    return '<a class="nav-tab'+active+'" href="'+href+'">'+label+b+'</a>';
  }).join('');
  const nav = document.createElement('nav');
  nav.className='nav';
  nav.innerHTML =
    '<a class="nav-logo" href="atracer-home.html">A<span class="amp">&amp;</span>T Racer</a>'+
    '<div class="nav-tabs">'+tabs+'</div>'+
    '<div class="nav-right">'+
      '<div class="icon-btn" style="position:relative" title="Notifications">🔔<div class="notif-dot"></div></div>'+
      '<button class="icon-btn" id="mobileBtn" onclick="AT.toggleMobile()" title="Toggle mobile view">📱</button>'+
      '<button class="icon-btn" id="themeBtn"  onclick="AT.toggleTheme()"  title="Toggle theme">🌙</button>'+
      '<a class="avatar" id="navAvatar" href="atracer-profile.html" title="Your profile"></a>'+
      '<button class="icon-btn" onclick="AT.logout()" title="Sign out" style="font-size:13px">⏻</button>'+
    '</div>';
  document.body.insertBefore(nav, document.body.firstChild);
}

window.AT = {
  user: null,

  init(){
    const pid = window.PAGE_ID||'';
    if(pid!=='login'){
      const s=sessionStorage.getItem('atracer_user');
      if(!s){window.location.href='atracer-login.html';return;}
      this.user=JSON.parse(s);
      const av=document.getElementById('navAvatar');
      if(av){av.textContent=this.user.initials;av.title=this.user.name;}
    }
    this.applyTheme();
    this.applyMobile();
  },

  logout(){
    sessionStorage.removeItem('atracer_user');
    window.location.href='atracer-login.html';
  },

  applyTheme(){
    const t=localStorage.getItem('atracer_theme')||'light';
    document.documentElement.setAttribute('data-theme',t);
    const btn=document.getElementById('themeBtn');
    if(btn) btn.textContent=t==='dark'?'☀️':'🌙';
  },

  toggleTheme(){
    const isDark=document.documentElement.getAttribute('data-theme')==='dark';
    const next=isDark?'light':'dark';
    document.documentElement.setAttribute('data-theme',next);
    localStorage.setItem('atracer_theme',next);
    const btn=document.getElementById('themeBtn');
    if(btn) btn.textContent=next==='dark'?'☀️':'🌙';
  },

  applyMobile(){
    const on=localStorage.getItem('atracer_mobile')==='true';
    document.body.classList.toggle('mobile-view',on);
    const btn=document.getElementById('mobileBtn');
    if(btn) btn.textContent=on?'🖥️':'📱';
  },

  toggleMobile(){
    const on=document.body.classList.toggle('mobile-view');
    localStorage.setItem('atracer_mobile',on);
    const btn=document.getElementById('mobileBtn');
    if(btn) btn.textContent=on?'🖥️':'📱';
  },

  flagImg(nationality, size){
    size=size||20;
    const code=AT.NAT_TO_CODE[nationality];
    if(!code) return '';
    const w=Math.round(size*1.5);
    return '<img src="https://raw.githubusercontent.com/AshF195/atracer/main/flag%201/'+code+'.png"'+
      ' width="'+w+'" height="'+size+'"'+
      ' style="border-radius:2px;object-fit:cover;vertical-align:middle;display:inline-block;flex-shrink:0"'+
      ' alt="'+nationality+'" onerror="this.style.display=\'none\'">';
  },

  NAT_TO_CODE:{
    "Afghan":"af","Albanian":"al","Algerian":"dz","American":"us","Andorran":"ad",
    "Argentine":"ar","Armenian":"am","Australian":"au","Austrian":"at","Azerbaijani":"az",
    "Bahraini":"bh","Belgian":"be","Bolivian":"bo","Brazilian":"br","British":"gb",
    "Bulgarian":"bg","Canadian":"ca","Chilean":"cl","Chinese":"cn","Colombian":"co",
    "Croatian":"hr","Czech":"cz","Danish":"dk","Dutch":"nl","Emirati":"ae",
    "Estonian":"ee","Finnish":"fi","French":"fr","Georgian":"ge","German":"de",
    "Greek":"gr","Hungarian":"hu","Indian":"in","Indonesian":"id","Iranian":"ir",
    "Irish":"ie","Israeli":"il","Italian":"it","Japanese":"jp","Jordanian":"jo",
    "Kazakhstani":"kz","Korean":"kr","South Korean":"kr","Kuwaiti":"kw","Latvian":"lv",
    "Lebanese":"lb","Lithuanian":"lt","Luxembourger":"lu","Malaysian":"my","Mexican":"mx",
    "Moldovan":"md","Monegasque":"mc","Moroccan":"ma","New Zealander":"nz","Nigerian":"ng",
    "Norwegian":"no","Omani":"om","Pakistani":"pk","Peruvian":"pe","Polish":"pl",
    "Portuguese":"pt","Qatari":"qa","Romanian":"ro","Russian":"ru","San Marinese":"sm",
    "Saudi Arabian":"sa","Scottish":"gb","Serbian":"rs","Singaporean":"sg","Slovak":"sk",
    "Slovenian":"si","South African":"za","Spanish":"es","Swedish":"se","Swiss":"ch",
    "Thai":"th","Turkish":"tr","Ukrainian":"ua","Uruguayan":"uy","Venezuelan":"ve",
    "Vietnamese":"vn","Welsh":"gb"
  }
};

// Boot
document.addEventListener('DOMContentLoaded',function(){
  if(window.PAGE_ID!=='login') injectNav();
  AT.init();
});