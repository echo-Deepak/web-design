"use strict";
const DAY = 864e5;
// Dates are offsets from today so the demo always shows upcoming events.
const EVENTS = [
  {id:1,title:"Hack the Campus 24",cat:"Tech",d:6,h:9,venue:"Innovation Lab, Bhubaneswar",emoji:"💻",hue:255,seats:120,desc:"A 24-hour hackathon where teams build solutions to real campus problems. Mentors, meals and prizes included."},
  {id:2,title:"Sunset Sitar Sessions",cat:"Music",d:9,h:18,venue:"Open Air Theatre, Cuttack",emoji:"🎶",hue:20,seats:200,desc:"An evening of classical and fusion sets with live artists as the sun goes down."},
  {id:3,title:"UI/UX Design Sprint",cat:"Workshop",d:12,h:10,venue:"Studio 4, KIIT Square",emoji:"🎨",hue:300,seats:40,desc:"Go from rough idea to clickable prototype in one day with a hands-on design sprint."},
  {id:4,title:"Startup Pitch Night",cat:"Business",d:15,h:17,venue:"Startup Odisha Hub",emoji:"🚀",hue:170,seats:80,desc:"Ten early-stage founders pitch to a panel of investors. Networking after the final round."},
  {id:5,title:"Street Food Carnival",cat:"Food",d:19,h:12,venue:"Marine Drive Grounds",emoji:"🍜",hue:40,seats:300,desc:"Forty stalls, regional favourites and a live cooking showdown for the whole family."},
  {id:6,title:"Intro to Machine Learning",cat:"Workshop",d:23,h:11,venue:"Online (Zoom)",emoji:"🤖",hue:215,seats:60,desc:"Train your first model in Python. Beginner friendly, no prior ML knowledge needed."},
  {id:7,title:"Inter-College Cricket Cup",cat:"Sports",d:27,h:8,venue:"Barabati Stadium Annex",emoji:"🏏",hue:130,seats:150,desc:"Eight college teams compete over a weekend. Come and cheer, entry is free."},
  {id:8,title:"Open Mic & Poetry Night",cat:"Music",d:31,h:19,venue:"The Reading Room Café",emoji:"🎤",hue:340,seats:50,desc:"Sing, recite or just listen. Sign up on the night or register to reserve a seat."}
].map(e=>{const t=new Date();t.setHours(e.h,0,0,0);return{...e,time:t.getTime()+e.d*DAY}});

const $=s=>document.querySelector(s);
const store={get:()=>{try{return JSON.parse(localStorage.getItem("regs"))||[]}catch{return[]}},set:v=>localStorage.setItem("regs",JSON.stringify(v))};
let cat="All",query="",open=null;
const fmt=t=>new Date(t).toLocaleString("en-IN",{weekday:"short",day:"numeric",month:"short",hour:"numeric",minute:"2-digit"});
const art=e=>`background:hsl(${e.hue} 75% 42%)`;
const left=e=>e.seats-store.get().filter(r=>r.eventId===e.id).length;
const esc=s=>s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function render(){
  const q=query.toLowerCase();
  const list=EVENTS.filter(e=>(cat==="All"||e.cat===cat)&&(e.title+e.venue+e.desc+e.cat).toLowerCase().includes(q));
  $("#grid").innerHTML=list.map((e,i)=>{const d=new Date(e.time);return`<article class="row" style="animation-delay:${i*50}ms" data-id="${e.id}">
    <div class="dt" style="${art(e)}"><div class="big">${d.getDate()}</div><span>${d.toLocaleDateString("en-IN",{month:"short"})}</span></div>
    <div class="body"><h3>${e.emoji} ${e.title}</h3><span class="meta">${fmt(e.time)} · ${e.venue}</span><p>${e.desc}</p></div>
    <div class="go"><span class="tag">${left(e)>0?left(e)+" seats left":"Sold out"}</span><button class="btn">Details</button></div></article>`}).join("");
  $("#empty").hidden=list.length>0;
  $("#chips").innerHTML=["All",...new Set(EVENTS.map(e=>e.cat))].map(c=>`<button class="cat" aria-pressed="${c===cat}" data-cat="${c}"><span>${c}</span><span>${c==="All"?EVENTS.length:EVENTS.filter(e=>e.cat===c).length}</span></button>`).join("");
  renderMine();
}
function renderMine(){
  const regs=store.get();$("#count").textContent=regs.length;
  $("#mylist").innerHTML=regs.length?regs.map(r=>{const e=EVENTS.find(x=>x.id===r.eventId);return`<div class="reg"><b>${e.emoji} ${e.title}</b><br><span>${esc(r.name)} · ${fmt(e.time)}<br>Ref ${r.ref}</span><br><button data-cancel="${r.ref}">Cancel</button></div>`}).join(""):`<p class="none">You haven't registered for anything yet. Pick an event above to get started.</p>`;
}
function parts(t){const s=Math.max(0,Math.floor((t-Date.now())/1000));return[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60]}
function tick(){
  const n=$("#nextclock");if(n){const p=parts(EVENTS[0].time);n.innerHTML=["days","hrs","min","sec"].map((l,i)=>`<div>${String(p[i]).padStart(2,"0")}<span>${l}</span></div>`).join("")}
  const m=$("#mclock");if(m&&open){const p=parts(open.time);m.innerHTML=`Starts in <span>${p[0]}d</span><span>${p[1]}h</span><span>${p[2]}m</span><span>${p[3]}s</span>`}
}
function showNext(){
  const e=EVENTS[0];
  $("#next").innerHTML=`<small>Next up</small><h3>${e.title}</h3><div class="clock" id="nextclock"></div><button data-id="${e.id}">Get a ticket</button>`;
}
function openEvent(id){
  open=EVENTS.find(e=>e.id===id);const e=open,sold=left(e)<=0;
  $("#m-body").innerHTML=`<div class="banner" style="${art(e)}"><span class="big">${e.emoji}</span></div>
  <div class="m-pad"><h2 id="m-title">${e.title}</h2>
  <div class="facts"><span>When: ${fmt(e.time)}</span><span>Where: ${e.venue}</span><span>Category: ${e.cat}</span><span>Seats left: ${Math.max(0,left(e))}</span></div>
  <p>${e.desc}</p><div class="mclock" id="mclock"></div>
  ${sold?`<p class="err">This event is sold out. Try another event.</p>`:`
  <form id="form" novalidate><h3>Get your ticket</h3>
   <label>Full name<input name="name" autocomplete="name" placeholder="Asha Mohanty"><span class="err"></span></label>
   <label>Email<input name="email" type="email" autocomplete="email" placeholder="asha@example.com"><span class="err"></span></label>
   <label>Phone number<input name="phone" type="tel" autocomplete="tel" placeholder="10-digit mobile number"><span class="err"></span></label>
   <label>Event<select name="event">${EVENTS.map(x=>`<option value="${x.id}" ${x.id===e.id?"selected":""}>${x.title}</option>`).join("")}</select><span class="err"></span></label>
   <button class="btn" type="submit">Confirm registration</button></form>`}</div>`;
  $("#modal").showModal();tick();
}
const rules={
  name:v=>/^[A-Za-z][A-Za-z .'-]{2,}$/.test(v.trim())?"":"Enter your full name (letters only, at least 3 characters).",
  email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())?"":"Enter a valid email like name@example.com.",
  phone:v=>/^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s|-/g,"").replace(/^(\+91)/,"$1"))?"":"Enter a valid 10-digit Indian mobile number.",
  event:v=>v?"":"Choose an event."
};
function check(f,field){
  const el=f.elements[field],msg=rules[field](el.value);
  el.classList.toggle("bad",!!msg);el.parentElement.querySelector(".err").textContent=msg;return!msg;
}
function submit(f){
  const ok=Object.keys(rules).map(k=>check(f,k)).every(Boolean);if(!ok)return;
  const eventId=+f.event.value,e=EVENTS.find(x=>x.id===eventId),email=f.email.value.trim().toLowerCase(),regs=store.get();
  if(regs.some(r=>r.eventId===eventId&&r.email===email)){f.email.classList.add("bad");f.email.nextElementSibling.textContent="This email is already registered for this event.";return}
  if(left(e)<=0){f.event.classList.add("bad");f.event.nextElementSibling.textContent="This event is sold out. Choose another.";return}
  const ref="CV"+Math.random().toString(36).slice(2,8).toUpperCase();
  regs.push({ref,eventId,name:f.name.value.trim(),email,phone:f.phone.value.trim()});store.set(regs);
  open=null;
  $("#m-body").innerHTML=`<div class="ok"><div class="tick">✓</div><h2>You're in!</h2><p>${esc(f.name.value.trim())}, your seat for <b>${e.title}</b> is confirmed.<br>${fmt(e.time)} · ${e.venue}<br>Reference: <b>${ref}</b></p><button class="btn" id="done">Done</button></div>`;
  render();
}
document.addEventListener("click",ev=>{
  const t=ev.target;
  const card=t.closest(".row");if(card)return openEvent(+card.dataset.id);
  if(t.dataset.id&&!t.closest(".row"))return openEvent(+t.dataset.id);
  const ct=t.closest(".cat");if(ct){cat=ct.dataset.cat;return render()}
  if(t.dataset.cancel){store.set(store.get().filter(r=>r.ref!==t.dataset.cancel));return render()}
  if(t.id==="close"||t.id==="done"||t.id==="modal"){open=null;$("#modal").close()}
  if(t.id==="theme"){const d=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=d;try{localStorage.setItem("theme",d)}catch{}}
});
document.addEventListener("input",ev=>{const f=ev.target.form;if(f&&f.id==="form"&&ev.target.name&&ev.target.classList.contains("bad"))check(f,ev.target.name)});
document.addEventListener("focusout",ev=>{const f=ev.target.form;if(f&&f.id==="form"&&ev.target.name)check(f,ev.target.name)});
document.addEventListener("submit",ev=>{ev.preventDefault();submit(ev.target)});
$("#search").addEventListener("input",e=>{query=e.target.value;render()});
let saved;try{saved=localStorage.getItem("theme")}catch{}
document.documentElement.dataset.theme=saved||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");
showNext();render();tick();setInterval(tick,1000);
