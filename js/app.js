fetch('data/businesses.json').then(r=>r.json()).then(data=>{
const cats=['All',...new Set(data.map(x=>x.category))],c=document.getElementById('cats'),r=document.getElementById('results'),f=document.getElementById('featured');
let cur='All';
cats.forEach(n=>{let b=document.createElement('button');b.className='cat'+(n==='All'?' active':'');b.textContent=n;b.onclick=()=>{document.querySelectorAll('.cat').forEach(x=>x.classList.remove('active'));b.classList.add('active');cur=n;draw()};c.appendChild(b);});
document.getElementById('search').oninput=draw;
function card(x,prem=false){return `<div class="col-lg-${prem?12:4}"><div class="cardx"><div class="d-flex gap-3"><div class="logo">${x.name[0]}</div><div><h3>${x.name}</h3>${x.premier?'<span class="badge badge-premier">Premier Partner</span>':''}<div>${x.city}, ${x.state}</div><p>${x.description}</p><div class='d-flex gap-2 flex-wrap'><a class='btn btn-dark btn-sm' href='${x.website}'>Website</a><a class='btn btnoutline btn-outline-dark btn-sm' href='tel:${x.phoneRaw}'>Call</a><a class='btn btn-outline-secondary btn-sm' href='mailto:${x.email}'>Email</a></div></div></div></div></div>`}
function draw(){let q=document.getElementById('search').value.toLowerCase();f.innerHTML='';r.innerHTML='';
data.filter(x=>(cur==='All'||x.category===cur)&&(x.name.toLowerCase().includes(q)||x.city.toLowerCase().includes(q))).forEach(x=>{(x.premier?f:r).insertAdjacentHTML('beforeend',card(x,x.premier));});}
draw();
});
