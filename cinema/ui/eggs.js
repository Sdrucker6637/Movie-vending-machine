/* Usher, surprises and Easter eggs. All optional: the Box Office has a switch,
   and with it off (or with reduced motion) messages become plain toasts and
   nothing pops up uninvited.

   Hidden things:
   - Stubby the usher strolls in now and then with a tip
   - click the MY CINEMA marquee five times quickly
   - crank the popcorn machine in the lobby (ten turns…)
   - type the word "intermission" anywhere
   - the ticket number in the footer is a secret random-pick button
   - silent-film intertitles appear very occasionally between scenes
   - a ticket prints when you add a film to the Hall of Fame or watchlist */
import { stubby, ticketSvg, popcornMachine } from "./art.js";
import { local } from "./data.js";

const reduced = () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const on = () => local.eggsOn();

const TIPS = [
  "Psst - every bar in the statistics opens the films behind it.",
  "The Taste page explains what your ratings say about you.",
  "Thumbs up or down on a pick, and the next ones adjust.",
  "Tonight's feature could be one of your Hidden Gems…",
  "The sync job checks Letterboxd every six hours, even while you sleep.",
  "Rumour has it there's a door backstage that opens at 100 rated films.",
  "Have you tried giving the popcorn machine a crank?",
  "Shh! The feature's about to start.",
  "Mind the step, and no talking during the picture!"
];
const INTERTITLES = ["Meanwhile, in the lobby…", "Later that evening…", "And now, a word from the projection booth.", "The plot thickens!", "Our patron returns…", "Ten minutes, please - change reels!", "Fin? Not quite."];

let usherEl, bubbleEl, hideT, toastEl;

function ensureUsher() {
  if (usherEl) return;
  usherEl = document.createElement("div");
  usherEl.className = "usher";
  usherEl.setAttribute("aria-live", "polite");
  usherEl.innerHTML = `<div class="usher-art"></div><div class="usher-bubble"><span></span><button type="button" class="usher-x" aria-label="Dismiss">✕</button></div>`;
  document.body.appendChild(usherEl);
  bubbleEl = usherEl.querySelector(".usher-bubble span");
  usherEl.querySelector(".usher-x").onclick = () => hide();
  toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  document.body.appendChild(toastEl);
}

function hide() { if (usherEl) usherEl.classList.remove("show"); }

export const usher = {
  say(text, mood, href) {
    ensureUsher();
    clearTimeout(hideT);
    if (!on()) {
      toastEl.textContent = text;
      toastEl.classList.add("show");
      hideT = setTimeout(() => toastEl.classList.remove("show"), 3200);
      return;
    }
    usherEl.querySelector(".usher-art").innerHTML = stubby(mood || "wave");
    bubbleEl.innerHTML = "";
    if (href) { const a = document.createElement("a"); a.href = href; a.textContent = text; bubbleEl.appendChild(a); } else bubbleEl.textContent = text;
    usherEl.classList.remove("show");
    void usherEl.offsetWidth;
    usherEl.classList.add("show");
    hideT = setTimeout(hide, Math.max(3600, text.length * 70));
  }
};

export function flyTicket(fromEl, text) {
  if (!on() || reduced()) return;
  const r = fromEl.getBoundingClientRect();
  const t = document.createElement("div");
  t.className = "ticket-fly";
  t.innerHTML = ticketSvg(text);
  t.style.left = r.left + r.width / 2 - 60 + "px";
  t.style.top = r.top - 10 + "px";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}

let intertitleShown = false;
export function maybeIntertitle() {
  if (!on() || reduced() || intertitleShown || Math.random() > 0.12) return;
  intertitleShown = true;
  const card = document.createElement("div");
  card.className = "intertitle";
  card.setAttribute("role", "presentation");
  card.innerHTML = `<div class="intertitle-card"><span>${INTERTITLES[Math.floor(Math.random() * INTERTITLES.length)]}</span></div>`;
  card.onclick = () => card.remove();
  document.body.appendChild(card);
  setTimeout(() => card.remove(), 2600);
}

function marqueeEgg() {
  const mq = document.getElementById("marquee");
  if (!mq) return;
  let clicks = [];
  mq.addEventListener("click", () => {
    const now = Date.now();
    clicks = clicks.filter((t) => now - t < 2500).concat(now);
    mq.classList.remove("blink-once"); void mq.offsetWidth; mq.classList.add("blink-once");
    if (clicks.length >= 5 && on()) {
      clicks = [];
      document.body.classList.add("showstopper");
      const curtain = document.createElement("div");
      curtain.className = "curtain-call";
      curtain.innerHTML = `<div class="cc-left"></div><div class="cc-right"></div><div class="cc-stage">${stubby("cheer")}<p>Thank you, thank you! You've been a wonderful audience!</p></div>`;
      curtain.onclick = () => curtain.remove();
      document.body.appendChild(curtain);
      setTimeout(() => { curtain.classList.add("closing"); document.body.classList.remove("showstopper"); }, 3200);
      setTimeout(() => curtain.remove(), 4200);
    }
  });
}

function popcornEgg() {
  let cranks = 0;
  document.addEventListener("click", (e) => {
    const b = e.target.closest("#popcornBtn");
    if (!b) return;
    cranks++;
    b.classList.remove("popping"); void b.offsetWidth; b.classList.add("popping");
    if (cranks % 10 === 0 && on()) {
      b.classList.add("overflow");
      const burst = document.createElement("div");
      burst.className = "popcorn-burst";
      burst.innerHTML = Array.from({ length: 26 }, (_, i) => `<span style="--x:${(Math.random() * 260 - 130).toFixed(0)}px;--y:${(-80 - Math.random() * 220).toFixed(0)}px;--r:${(Math.random() * 720 - 360).toFixed(0)}deg;--d:${i * 18}ms"></span>`).join("");
      b.parentElement.appendChild(burst);
      setTimeout(() => { burst.remove(); b.classList.remove("overflow"); }, 1600);
      usher.say("Who ordered the jumbo?! I'll fetch a broom…", "sweep");
    } else if (cranks === 3) usher.say("Keep cranking - something good happens eventually.", "point");
  });
}

function typedEgg() {
  let buf = "";
  document.addEventListener("keydown", (e) => {
    if (e.target.closest("input, textarea, select")) return;
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-12);
    if (buf.endsWith("intermission") && on()) {
      const card = document.createElement("div");
      card.className = "intermission";
      card.innerHTML = `<div class="im-card"><p class="im-k">Let's all go to the lobby</p><h2>Intermission</h2><div class="im-pop">${popcornMachine()}</div><p class="im-s">The feature resumes shortly. (Click anywhere.)</p></div>`;
      card.onclick = () => card.remove();
      document.body.appendChild(card);
      setTimeout(() => card.remove(), 7000);
    }
  });
}

function idleUsher() {
  setInterval(() => {
    if (!on() || reduced() || document.hidden) return;
    if (document.querySelector(".overlay:not(.hidden)")) return;
    if (Math.random() < 0.25) usher.say(TIPS[Math.floor(Math.random() * TIPS.length)], ["wave", "point", "shrug"][Math.floor(Math.random() * 3)]);
  }, 80000);
}

export function initEggs(o) {
  ensureUsher();
  marqueeEgg();
  popcornEgg();
  typedEgg();
  idleUsher();
  const stub = document.getElementById("secretStub");
  if (stub) stub.addEventListener("click", () => o.onRandom());
  let greeted = false;
  try { greeted = sessionStorage.getItem("cinema-greeted") === "1"; sessionStorage.setItem("cinema-greeted", "1"); } catch (e) { greeted = true; }
  if (!greeted) setTimeout(() => { if (on() && !reduced()) usher.say("Welcome to your picture house! Right this way…", "wave"); }, 1200);
}
