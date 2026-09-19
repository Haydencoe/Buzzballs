import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
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

const $ = id => document.getElementById(id);
const nameScreen = $("nameScreen"), voteScreen = $("voteScreen"), doneScreen = $("doneScreen");
const nameForm = $("nameForm"), nameInput = $("nameInput"), voterName = $("voterName");
const flavoursEl = $("flavours"), progress = $("progress"), voteForm = $("voteForm");

function renderFlavours(){
  flavoursEl.innerHTML = flavours.map((flavour, i) => `
    <article class="flavour-card" data-index="${i}">
      <div class="flavour-number">FLAVOUR ${i+1} OF 9</div>
      <div class="flavour-name">${flavour}</div>
      <div class="rating-grid">
        ${Array.from({length:10},(_,n)=>`
          <label>
            <input type="radio" name="flavour-${i}" value="${n+1}">
            <span>${n+1}</span>
          </label>`).join("")}
      </div>
    </article>
  `).join("");

  flavoursEl.addEventListener("change", e => {
    if(e.target.matches("input[type=radio]")){
      const card=e.target.closest(".flavour-card");
      card.classList.add("selected");
      progress.textContent = document.querySelectorAll(".flavour-card.selected").length;
    }
  });
}

nameForm.addEventListener("submit", e=>{
  e.preventDefault();
  const name = nameInput.value.trim();
  if(!name) return;
  localStorage.setItem("buzzballVoterName", name);
  voterName.textContent = name;
  nameScreen.classList.add("hidden");
  voteScreen.classList.remove("hidden");
  renderFlavours();
  window.scrollTo({top:0,behavior:"smooth"});
});

const savedName = localStorage.getItem("buzzballVoterName");
if(savedName) nameInput.value=savedName;

voteForm.addEventListener("submit", async e=>{
  e.preventDefault();
  const name = localStorage.getItem("buzzballVoterName") || nameInput.value.trim();
  if(!name){showToast("Please enter your name 💕"); return;}
  const ratings = {};
  for(let i=0;i<flavours.length;i++){
    const selected = document.querySelector(`input[name="flavour-${i}"]:checked`);
    if(!selected){showToast("You need to rate every flavour 💖"); return;}
    ratings[flavours[i]] = Number(selected.value);
  }

  const button = $("submitButton");
  button.disabled=true;
  button.textContent="Saving your votes... ✨";

  try{
    await addDoc(collection(db,"votes"),{
      name, ratings, createdAt:serverTimestamp()
    });
    $("doneName").textContent=name;
    voteScreen.classList.add("hidden");
    doneScreen.classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
  }catch(err){
    console.error(err);
    showToast("Oops! Check your Firebase setup 💕");
    button.disabled=false;
    button.textContent="Submit My Votes 💋";
  }
});

$("voteAgain").addEventListener("click",()=>{
  localStorage.removeItem("buzzballVoterName");
  doneScreen.classList.add("hidden");
  nameScreen.classList.remove("hidden");
  nameInput.value="";
});

function showToast(message){
  const t=$("toast"); t.textContent=message; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2500);
}
