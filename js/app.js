from pathlib import Path

js = r"""fetch('data/businesses.json')
.then(r=>r.json())
.then(data=>{

const cats=["All",...new Set(data.map(x=>x.category))];
const catsWrap=document.getElementById("cats");
const featured=document.getElementById("featured");
const results=document.getElementById("results");
const search=document.getElementById("search");
const count=document.getElementById("resultCount");

let current="All";

cats.forEach(name=>{
    const btn=document.createElement("button");
    btn.className="cat"+(name==="All"?" active":"");
    btn.textContent=name;
    btn.onclick=()=>{
        document.querySelectorAll(".cat").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        current=name;
        render();
    };
    catsWrap.appendChild(btn);
});

search.addEventListener("input",render);

function highlight(text,q){
    if(!q)return text;
    const reg=new RegExp("("+q.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","ig");
    return text.replace(reg,"<mark>$1</mark>");
}

function card(item,premier=false){

    const q=search.value.trim();

    return `
<div class="col-lg-${premier?12:4} col-md-6 fade-item">
<div class="cardx">

<div class="d-flex gap-3">

<div class="logo">
${item.logo?`<img src="${item.logo}" class="img-fluid rounded-circle">`:item.name.charAt(0)}
</div>

<div class="flex-grow-1">

<h3>${highlight(item.name,q)}</h3>

${item.premier?'<span class="badge-premier">Premier Partner</span>':''}

<div class="text-muted mb-2">
${highlight(item.city,q)}, ${item.state}
</div>

<p>${item.description||""}</p>

<div class="d-flex flex-wrap gap-2">

<a class="btn btn-dark btn-sm" href="${item.website}" target="_blank">
Website
</a>

<a class="btn btn-outline-dark btn-sm" href="tel:${item.phoneRaw}">
Call
</a>

<a class="btn btn-outline-secondary btn-sm" href="mailto:${item.email}">
Email
</a>

</div>

</div>

</div>

</div>
</div>`;
}

function render(){

const q=search.value.trim().toLowerCase();

featured.innerHTML="";
results.innerHTML="";

let matches=data.filter(item=>{

const inCategory=current==="All"||item.category===current;

const searchable=[
item.name,
item.city,
item.category,
item.description||""
].join(" ").toLowerCase();

return inCategory && searchable.includes(q);

});

count.textContent=`${matches.length} Businesses`;

matches.sort((a,b)=>{
if(a.premier&&!b.premier) return -1;
if(!a.premier&&b.premier) return 1;
return a.name.localeCompare(b.name);
});

matches.forEach(item=>{
(item.premier?featured:results)
.insertAdjacentHTML("beforeend",card(item,item.premier));
});

}

render();

});
"""

outdir=Path("/mnt/data/out")
outdir.mkdir(exist_ok=True)
path=outdir/"app.js"
path.write_text(js,encoding="utf-8")
print(path)
