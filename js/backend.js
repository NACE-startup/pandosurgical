/* Backend for the public pages: forms, log in and live news.
   Every form writes to Firestore (rules in firestore.rules). The team reads
   submissions in dashboard.html. */
import { auth, db, isTeam } from "./firebase-init.js";
import { TEAM_EMAILS } from "./firebase-config.js";
import {
  GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  sendPasswordResetEmail, updateProfile, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, addDoc, doc, setDoc, getDoc, updateDoc, getDocs, query, orderBy, limit, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* Text shown by this script. Language pages define window.PANDO_T (English -> translation). */
function t(s) { return (window.PANDO_T && window.PANDO_T[s]) || s; }

var pageLoaded = Date.now();

/* ---------------- Spam protection ----------------
   1. Honeypot: a hidden "website" field. People never fill it in, bots do.
   2. Too fast: a form sent within 3 seconds of the page loading is a bot.
   3. Cooldown: one submission per form every 30 seconds per browser.
   4. App Check (see firebase-config.js) and size limits in firestore.rules. */
var COOLDOWN_MS = 30000;
function cooldownLeft(kind) {
  try {
    var last = parseInt(localStorage.getItem("pando-sent-" + kind) || "0", 10);
    return Math.max(0, COOLDOWN_MS - (Date.now() - last));
  } catch (e) { return 0; }
}
function markSent(kind) { try { localStorage.setItem("pando-sent-" + kind, String(Date.now())); } catch (e) {} }

function val(form, name) {
  var el = form.elements[name];
  return el ? String(el.value || "").trim() : "";
}

/* Each handler builds the document the rules expect. */
var HANDLERS = {
  contact: {
    collection: "contactSubmissions",
    build: function (f) {
      var d = { fullName: val(f, "name"), email: val(f, "email").toLowerCase(), inquiryType: val(f, "inquiryType") || "General", message: val(f, "message") };
      if (val(f, "phone")) d.phone = val(f, "phone");
      if (val(f, "company")) d.company = val(f, "company");
      return d;
    },
    ok: t("Thank you! Your message is on its way to the team. We read every one.")
  },
  careers: {
    collection: "internshipApplications",
    build: function (f) {
      return { role: "Engineering Intern", fullName: val(f, "name"), email: val(f, "email").toLowerCase(), resumeLink: val(f, "resume"),
        whyPassionate: val(f, "q1"), whyPando: val(f, "q2"), skillsets: val(f, "q3") };
    },
    ok: t("Application received. Thank you! We’ll be in touch after reviewing it.")
  },
  newsletter: {
    collection: "newsletterSignups",
    build: function (f) {
      return { name: val(f, "name") || "Subscriber", email: val(f, "email").toLowerCase(), interests: ["Company updates"] };
    },
    ok: t("You’re on the list. Thank you!")
  },
  clinician: {
    collection: "clinicianRequests",
    build: function (f) {
      var d = { name: val(f, "name"), email: val(f, "email").toLowerCase(), hospital: val(f, "hospital") };
      if (val(f, "phone")) d.phone = val(f, "phone");
      if (val(f, "notes")) d.notes = val(f, "notes");
      return d;
    },
    ok: t("Thank you! We’ll review your request and reach out.")
  }
};

document.querySelectorAll("form[data-submit]").forEach(function (form) {
  var kind = form.getAttribute("data-submit");
  var h = HANDLERS[kind];
  if (!h) return;
  var note = form.querySelector(".form-note");
  var button = form.querySelector('button[type="submit"]');
  var say = function (msg) { if (note) note.textContent = msg; };

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    // Bots: pretend it worked so they don't retry.
    var trap = form.elements["website"];
    if ((trap && trap.value) || Date.now() - pageLoaded < 3000) { say(h.ok); form.reset(); return; }
    var wait = cooldownLeft(kind);
    if (wait) { say(t("Please wait {n} seconds before sending again.").replace("{n}", Math.ceil(wait / 1000))); return; }

    var data = h.build(form);
    data.read = false;
    data.createdAt = serverTimestamp();
    if (button) button.disabled = true;
    say(t("Sending…"));
    try {
      await addDoc(collection(db, h.collection), data);
      markSent(kind);
      form.reset();
      form.querySelectorAll("[data-words]").forEach(function (t) { t.dispatchEvent(new Event("input")); });
      say(h.ok);
    } catch (err) {
      console.error(err);
      say(t("Sorry, that didn’t go through. Please email contact@pandosurgical.com instead."));
    } finally {
      if (button) button.disabled = false;
    }
  });
});

/* ---------------- Log in ---------------- */
var loginModal = document.getElementById("login");
var loginForm = loginModal && loginModal.querySelector("form");
var note = loginForm && loginForm.querySelector(".form-note");
var mode = "signin";

function say(msg) { if (note) note.textContent = msg; }
function friendly(err) {
  var c = err && err.code || "";
  if (c === "auth/invalid-credential" || c === "auth/wrong-password" || c === "auth/user-not-found") return t("That email and password don’t match.");
  if (c === "auth/email-already-in-use") return t("An account with this email already exists. Try signing in.");
  if (c === "auth/weak-password") return t("Please choose a password with at least 6 characters.");
  if (c === "auth/too-many-requests") return t("Too many attempts. Please wait a moment and try again.");
  if (c === "auth/popup-closed-by-user" || c === "auth/cancelled-popup-request") return "";
  if (c === "auth/unauthorized-domain") return t("This site’s address isn’t authorized in Firebase yet.");
  return t("Something went wrong. Please try again.");
}

async function saveUser(user) {
  try {
    var ref = doc(db, "users", user.uid);
    var snap = await getDoc(ref);
    if (snap.exists()) await updateDoc(ref, { lastLogin: serverTimestamp() });
    else await setDoc(ref, { uid: user.uid, email: user.email, displayName: user.displayName || "", photoURL: user.photoURL || "", createdAt: serverTimestamp(), lastLogin: serverTimestamp() });
  } catch (e) { console.warn("Could not save user", e); }
}

async function afterSignIn(user) {
  if (isTeam(user)) {
    await saveUser(user);
    location.href = "dashboard.html";
  } else {
    say(t("This account doesn’t have team access. Use “Request access” below."));
    await signOut(auth);
  }
}

if (loginForm) {
  var title = document.getElementById("login-title");
  var sub = loginModal.querySelector(".login-head p");
  var submitBtn = loginForm.querySelector('button[type="submit"]');
  var toggle = loginModal.querySelector("[data-login-toggle]");
  var nameField = loginForm.querySelector("[data-signup-only]");

  function setMode(m) {
    mode = m;
    var up = m === "signup";
    title.textContent = t(up ? "Create team account" : "Welcome back");
    sub.textContent = t(up ? "Team email addresses only" : "Sign in to access your account");
    submitBtn.textContent = t(up ? "Create account" : "Sign in");
    toggle.textContent = t(up ? "Sign in" : "Create one");
    toggle.previousSibling.textContent = t(up ? "Already have an account?" : "Need a team account?") + " ";
    if (nameField) nameField.hidden = !up;
    loginForm.elements["password"].autocomplete = up ? "new-password" : "current-password";
    say("");
  }
  toggle.addEventListener("click", function () { setMode(mode === "signin" ? "signup" : "signin"); });

  loginModal.querySelector("[data-google]").addEventListener("click", async function () {
    say("");
    try {
      var provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      var res = await signInWithPopup(auth, provider);
      await afterSignIn(res.user);
    } catch (err) { say(friendly(err)); }
  });

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    var email = val(loginForm, "email").toLowerCase();
    var pass = loginForm.elements["password"].value;
    submitBtn.disabled = true;
    say("");
    try {
      var res;
      if (mode === "signup") {
        if (TEAM_EMAILS.indexOf(email) === -1) { say(t("Accounts are limited to team email addresses. Use “Request access” below.")); return; }
        res = await createUserWithEmailAndPassword(auth, email, pass);
        var name = val(loginForm, "displayName");
        if (name) await updateProfile(res.user, { displayName: name });
      } else {
        res = await signInWithEmailAndPassword(auth, email, pass);
      }
      await afterSignIn(res.user);
    } catch (err) { say(friendly(err)); }
    finally { submitBtn.disabled = false; }
  });

  loginModal.querySelector("[data-forgot]").addEventListener("click", async function () {
    var email = val(loginForm, "email");
    if (!email) { say(t("Enter your email above first, then press “Forgot password?”.")); return; }
    try { await sendPasswordResetEmail(auth, email); say(t("If that account exists, a reset link is on its way.")); }
    catch (err) { say(friendly(err) || t("Couldn’t send the reset email.")); }
  });
}

/* Nav: "Team Log in" becomes "Dashboard" for signed-in team members. */
onAuthStateChanged(auth, function (user) {
  var team = isTeam(user);
  document.querySelectorAll("[data-login-link]").forEach(function (el) {
    if (team) { el.textContent = t("Dashboard"); el.removeAttribute("data-modal"); el.onclick = function () { location.href = "dashboard.html"; }; }
  });
});

/* ---------------- Live news ----------------
   Posts the team writes in the dashboard show first, above the built-in stories. */
var grid = document.querySelector(".news-grid");
if (grid) {
  (async function () {
    try {
      var snap = await getDocs(query(collection(db, "newsPosts"), orderBy("createdAt", "desc"), limit(50)));
      var AVATAR = grid.querySelector(".avatar");
      var first = grid.firstElementChild;
      snap.forEach(function (d) {
        var p = d.data(), id = "post-" + d.id;
        var paras = String(p.body || "").split(/\n{2,}/).filter(Boolean);
        var date = p.createdAt && p.createdAt.toDate ? p.createdAt.toDate().toLocaleDateString(document.documentElement.lang || "en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
        var img = function () { var i = document.createElement("img"); i.src = p.photoUrl || ""; i.alt = ""; if (!p.photoUrl) i.hidden = true; return i; };
        var author = function (extra) {
          var s = document.createElement("span"); s.className = "author" + (extra ? " story-author" : "");
          if (AVATAR) s.appendChild(AVATAR.cloneNode(true));
          var w = document.createElement("span"), b = document.createElement("b"); b.textContent = t("Pando Surgical Team"); w.appendChild(b);
          if (extra && date) { var t = document.createElement("time"); t.textContent = date; w.appendChild(t); }
          s.appendChild(w); return s;
        };
        // Card
        var card = document.createElement("button"); card.className = "card"; card.setAttribute("data-modal", id); card.setAttribute("aria-haspopup", "dialog");
        var wrap = document.createElement("span"); wrap.className = "img-wrap"; var ci = img(); ci.loading = "lazy"; wrap.appendChild(ci);
        var text = document.createElement("div"); text.className = "card-text";
        var h3 = document.createElement("h3"); h3.textContent = p.headline || "";
        var ex = document.createElement("span"); ex.className = "excerpt"; ex.textContent = paras.join(" ");
        var rm = document.createElement("span"); rm.className = "read-more"; rm.textContent = t("Read more →");
        text.append(h3, author(false), ex, rm); card.append(wrap, text);
        grid.insertBefore(card, first);
        // Pop-up
        var modal = document.createElement("div"); modal.className = "modal"; modal.id = id; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true"); modal.setAttribute("aria-hidden", "true");
        var art = document.createElement("article"); art.className = "modal-card story-card";
        var close = document.createElement("button"); close.className = "modal-close"; close.setAttribute("aria-label", "Close");
        var cimg = document.createElement("img"); cimg.src = "/assets/icons/story-close.svg"; cimg.alt = ""; close.appendChild(cimg);
        var sb = document.createElement("div"); sb.className = "story-body";
        var h2 = document.createElement("h2"); h2.textContent = p.headline || ""; sb.append(h2, author(true));
        paras.forEach(function (t) { var pp = document.createElement("p"); pp.className = "body"; pp.textContent = t; sb.appendChild(pp); });
        art.append(img(), close, sb); modal.appendChild(art); document.body.appendChild(modal);
      });
    } catch (err) { console.warn("Live news unavailable", err); }
  })();
}
