import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const flavours = [
  "Espresso Martini",
  "Choc Tease",
  "Goaaaaaaal Melon",
  "Strawberry Rita",
  "Forbidden Apple",
  "Lime Rita",
  "Passionfruit Martini",
  "Berry Cherry Limeade",
  "Chilli Mango"
];

const resultsList=document.getElementById("resultsList");
const voteCount=document.getElementById("voteCount");
const voters=document.getElementById("voters");
const details=document.getElementById("details");
let latestVotes=[];

const q=query(collection(db,"votes"),orderBy("createdAt","asc"));
onSnapshot(q, snapshot=>{
  latestVotes=snapshot.docs.map(d=>({id:d.id,...d.data()}));
  render();
}, err=>{
  console.error(err);
  voteCount.textContent="Could not load results — check your Firebase setup.";
});

function render(){
  voteCount.textContent=`${latestVotes.length} ${latestVotes.length===1?"person has":"people have"} voted`;
  const stats=flavours.map(flavour=>{
    const scores=latestVotes.map(v=>v.ratings?.[flavour]).filter(x=>typeof x==="number");
    const average=scores.length ? scores.reduce((a,b)=>a+b,0)/scores.length : 0;
    return {flavour,average,count:scores.length};
  }).sort((a,b)=>b.average-a.average);

  resultsList.innerHTML=stats.map((s,i)=>`
    <article class="result-card">
      <div class="result-top">
        <div><span class="rank">#${i+1}</span><br><span class="result-name">${s.flavour}</span></div>
        <div class="score">${s.count ? s.average.toFixed(1) : "—"}<small>/10</small></div>
      </div>
      <div class="bar"><div style="width:${s.average*10}%"></div></div>
      <div class="rank">${s.count} vote${s.count===1?"":"s"}</div>
    </article>
  `).join("");

  const names=latestVotes.map(v=>v.name).filter(Boolean);
  voters.innerHTML=names.length
    ? `<div class="voter-pills">${names.map(n=>`<span class="voter-pill">💋 ${escapeHtml(n)}</span>`).join("")}</div>`
    : `<p class="rank">No votes yet — be the first! 💕</p>`;

  details.innerHTML = latestVotes.length ? `
    <div style="overflow-x:auto">
      <table class="details-table">
        <thead><tr><th>Name</th>${flavours.map(f=>`<th>${escapeHtml(f)}</th>`).join("")}</tr></thead>
        <tbody>${latestVotes.map(v=>`
          <tr><td><strong>${escapeHtml(v.name)}</strong></td>${flavours.map(f=>`<td>${v.ratings?.[f] ?? "—"}</td>`).join("")}</tr>
        `).join("")}</tbody>
      </table>
    </div>` : "";
}

document.getElementById("toggleDetails").addEventListener("click",e=>{
  details.classList.toggle("hidden");
  e.currentTarget.textContent=details.classList.contains("hidden")?"Show individual votes":"Hide individual votes";
});

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
