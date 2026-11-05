/* Team dashboard: reads what the public forms collect, plus contacts, team and news.
   Access is enforced by firestore.rules / storage.rules; this file only drives the screen. */
import { app, auth, db, isTeam } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage, ref as sref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

var root = document.getElementById("dash");
var me = null;

/* Tiny DOM helper. Everything goes in through textContent, so submitted text can't run as HTML. */
function h(tag, attrs) {
  var el = document.createElement(tag);
  Object.keys(attrs || {}).forEach(function (k) {
    if (k === "class") el.className = attrs[k];
    else if (k.slice(0, 2) === "on") el.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k]);
  });
  for (var i = 2; i < arguments.length; i++) {
    var c = arguments[i];
    if (c == null || c === false) continue;
    el.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
  }
  return el;
}
function when(ts) {
  if (!ts || !ts.toDate) return "";
  return ts.toDate().toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}
async function load(name, order) {
  var q = order ? query(collection(db, name), orderBy(order, "desc")) : collection(db, name);
  var snap = await getDocs(q);
  return snap.docs.map(function (d) { return Object.assign({ id: d.id }, d.data()); });
}

/* ---------- Inboxes: contact, applications, clinicians, newsletter ---------- */
var INBOXES = [
  { id: "inbox", label: "Inbox", coll: "contactSubmissions", empty: "No messages yet.",
    title: function (d) { return d.fullName; }, sub: function (d) { return d.inquiryType; },
    fields: [["Email", "email"], ["Phone", "phone"], ["Company", "company"], ["Message", "message"]] },
  { id: "applications", label: "Applications", coll: "internshipApplications", empty: "No applications yet.",
    title: function (d) { return d.fullName; }, sub: function (d) { return d.role; },
    fields: [["Email", "email"], ["Resume", "resumeLink"], ["About them", "whyPassionate"], ["Why Pando", "whyPando"], ["Skills", "skillsets"]] },
  { id: "clinicians", label: "Clinicians", coll: "clinicianRequests", empty: "No clinician requests yet.",
    title: function (d) { return d.name; }, sub: function (d) { return d.hospital; },
    fields: [["Email", "email"], ["Phone", "phone"], ["Notes", "notes"]] },
  { id: "newsletter", label: "Newsletter", coll: "newsletterSignups", empty: "No signups yet.",
    title: function (d) { return d.name; }, sub: function () { return ""; },
    fields: [["Email", "email"], ["Interests", "interests"]] }
];

var counts = {};
function renderInbox(cfg, panel) {
  panel.textContent = "Loading…";
  load(cfg.coll, "createdAt").then(function (rows) {
    counts[cfg.id] = rows.filter(function (r) { return !r.read; }).length;
    updateBadges();
    panel.textContent = "";
    if (cfg.id === "newsletter" && rows.length) {
      panel.appendChild(h("div", { class: "dash-bar" },
        h("span", {}, rows.length + " subscribers"),
        h("button", { class: "btn btn-dark btn-sm", onclick: function () { exportCsv(rows); } }, "Download CSV")));
    }
    if (!rows.length) { panel.appendChild(h("p", { class: "dash-empty" }, cfg.empty)); return; }
    rows.forEach(function (r) {
      var card = h("article", { class: "dash-card" + (r.read ? "" : " unread") });
      var head = h("div", { class: "dash-card-head" },
        h("div", {}, h("h3", {}, (r.read ? "" : "● "), cfg.title(r) || "(no name)"), cfg.sub(r) ? h("p", { class: "dash-sub" }, cfg.sub(r)) : null),
        h("time", {}, when(r.createdAt)));
      var dl = h("dl", { class: "dash-fields" });
      cfg.fields.forEach(function (f) {
        var v = r[f[1]]; if (Array.isArray(v)) v = v.join(", ");
        if (!v) return;
        var dd = h("dd", {});
        if (f[1] === "email") dd.appendChild(h("a", { href: "mailto:" + v }, v));
        else if (f[1] === "resumeLink" && /^https?:\/\//i.test(v)) dd.appendChild(h("a", { href: v, target: "_blank", rel: "noopener" }, v));
        else dd.textContent = v;
        dl.append(h("dt", {}, f[0]), dd);
      });
      var actions = h("div", { class: "dash-actions" },
        h("button", { class: "btn btn-light btn-sm", onclick: async function () {
          await updateDoc(doc(db, cfg.coll, r.id), { read: !r.read }); renderInbox(cfg, panel); } }, r.read ? "Mark unread" : "Mark read"),
        h("button", { class: "btn btn-danger btn-sm", onclick: async function () {
          if (!confirm("Delete this permanently?")) return;
          await deleteDoc(doc(db, cfg.coll, r.id)); renderInbox(cfg, panel); } }, "Delete"));
      card.append(head, dl, actions);
      panel.appendChild(card);
    });
  }).catch(function (e) { console.error(e); panel.textContent = "Couldn’t load. Check that you’re signed in with a team email."; });
}
function exportCsv(rows) {
  var esc = function (v) { return '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"'; };
  var csv = ["Name,Email,Date"].concat(rows.map(function (r) { return [r.name, r.email, when(r.createdAt)].map(esc).join(","); })).join("\n");
  var a = h("a", { href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })), download: "newsletter-signups.csv" });
  document.body.appendChild(a); a.click(); a.remove();
}

/* ---------- Address book ---------- */
function renderContacts(panel) {
  panel.textContent = "Loading…";
  load("teamContacts", "createdAt").then(function (rows) {
    panel.textContent = "";
    var form = h("form", { class: "dash-form", onsubmit: async function (e) {
      e.preventDefault();
      var f = e.target, v = function (n) { return f.elements[n].value.trim(); };
      var d = { name: v("name"), howWeKnowThem: v("how"), createdBy: me.email, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
      if (v("email")) d.email = v("email");
      if (v("phone")) d.phone = v("phone");
      if (v("last")) d.lastContacted = v("last");
      await addDoc(collection(db, "teamContacts"), d); renderContacts(panel);
    } },
      h("h3", {}, "Add a contact"),
      h("div", { class: "row-2" }, h("input", { name: "name", placeholder: "Name", required: "" }), h("input", { name: "how", placeholder: "How we know them", required: "" })),
      h("div", { class: "row-3" }, h("input", { name: "email", type: "email", placeholder: "Email" }), h("input", { name: "phone", placeholder: "Phone" }), h("input", { name: "last", placeholder: "Last contacted (e.g. Oct 2026)" })),
      h("button", { class: "btn btn-dark", type: "submit" }, "Add contact"));
    panel.appendChild(form);
    if (!rows.length) panel.appendChild(h("p", { class: "dash-empty" }, "No contacts yet."));
    rows.forEach(function (r) {
      panel.appendChild(h("article", { class: "dash-card" },
        h("div", { class: "dash-card-head" }, h("div", {}, h("h3", {}, r.name), h("p", { class: "dash-sub" }, r.howWeKnowThem)), h("time", {}, r.lastContacted ? "Last contacted: " + r.lastContacted : "")),
        h("dl", { class: "dash-fields" }, r.email ? h("dt", {}, "Email") : null, r.email ? h("dd", {}, h("a", { href: "mailto:" + r.email }, r.email)) : null, r.phone ? h("dt", {}, "Phone") : null, r.phone ? h("dd", {}, r.phone) : null),
        h("div", { class: "dash-actions" }, h("button", { class: "btn btn-danger btn-sm", onclick: async function () {
          if (!confirm("Delete this contact?")) return; await deleteDoc(doc(db, "teamContacts", r.id)); renderContacts(panel); } }, "Delete"))));
    });
  }).catch(function (e) { console.error(e); panel.textContent = "Couldn’t load."; });
}

/* ---------- Team + invites ---------- */
function renderTeam(panel) {
  panel.textContent = "Loading…";
  Promise.all([load("users"), load("teamInvites", "createdAt")]).then(function (res) {
    var users = res[0], invites = res[1];
    panel.textContent = "";
    panel.appendChild(h("h3", { class: "dash-h" }, "Team members who have signed in"));
    users.forEach(function (u) {
      var invited = invites.some(function (i) { return (i.inviterId === me.uid && i.inviteeId === u.id) || (i.inviterId === u.id && i.inviteeId === me.uid); });
      panel.appendChild(h("article", { class: "dash-card slim" },
        h("div", { class: "dash-card-head" }, h("div", {}, h("h3", {}, u.displayName || u.email, u.id === me.uid ? " (you)" : ""), h("p", { class: "dash-sub" }, u.email)), h("time", {}, u.lastLogin ? "Last in " + when(u.lastLogin) : "")),
        u.id === me.uid || invited ? null : h("div", { class: "dash-actions" }, h("button", { class: "btn btn-light btn-sm", onclick: async function () {
          await addDoc(collection(db, "teamInvites"), { inviterId: me.uid, inviterEmail: me.email, inviteeId: u.id, inviteeEmail: u.email, status: "pending", createdAt: serverTimestamp() });
          renderTeam(panel); } }, "Invite to my team"))));
    });
    panel.appendChild(h("h3", { class: "dash-h" }, "Invites"));
    if (!invites.length) panel.appendChild(h("p", { class: "dash-empty" }, "No invites yet."));
    invites.forEach(function (i) {
      var mine = i.inviteeId === me.uid && i.status === "pending";
      var respond = function (status) { return async function () { await updateDoc(doc(db, "teamInvites", i.id), { status: status }); renderTeam(panel); }; };
      panel.appendChild(h("article", { class: "dash-card slim" },
        h("div", { class: "dash-card-head" }, h("div", {}, h("h3", {}, i.inviterEmail + " → " + i.inviteeEmail), h("p", { class: "dash-sub" }, i.status)), h("time", {}, when(i.createdAt))),
        mine ? h("div", { class: "dash-actions" }, h("button", { class: "btn btn-dark btn-sm", onclick: respond("accepted") }, "Accept"), h("button", { class: "btn btn-light btn-sm", onclick: respond("rejected") }, "Decline")) : null));
    });
  }).catch(function (e) { console.error(e); panel.textContent = "Couldn’t load."; });
}

/* ---------- News ---------- */
function renderNews(panel) {
  panel.textContent = "Loading…";
  load("newsPosts", "createdAt").then(function (rows) {
    panel.textContent = "";
    var note = h("p", { class: "form-note", role: "status" });
    panel.appendChild(h("form", { class: "dash-form", onsubmit: async function (e) {
      e.preventDefault();
      var f = e.target, file = f.elements.photo.files[0], btn = f.querySelector("button");
      btn.disabled = true; note.textContent = "Publishing…";
      try {
        var url = "";
        if (file) {
          if (!/^image\//.test(file.type) || file.size > 10 * 1024 * 1024) throw new Error("Photo must be an image under 10 MB.");
          var r = sref(getStorage(app), "news/" + Date.now() + "-" + file.name.replace(/[^\w.\-]/g, "_"));
          await uploadBytes(r, file); url = await getDownloadURL(r);
        }
        await addDoc(collection(db, "newsPosts"), { headline: f.elements.headline.value.trim(), body: f.elements.body.value.trim(), photoUrl: url, createdBy: me.uid, createdByEmail: me.email, createdAt: serverTimestamp() });
        renderNews(panel);
      } catch (err) { console.error(err); note.textContent = err.message || "Couldn’t publish."; btn.disabled = false; }
    } },
      h("h3", {}, "Publish a news post"),
      h("input", { name: "headline", placeholder: "Headline", required: "", maxlength: "200" }),
      h("textarea", { name: "body", placeholder: "Story. Leave a blank line between paragraphs.", required: "", rows: "6" }),
      h("label", { class: "dash-file" }, "Photo (optional) ", h("input", { name: "photo", type: "file", accept: "image/*" })),
      h("button", { class: "btn btn-dark", type: "submit" }, "Publish"), note));
    panel.appendChild(h("h3", { class: "dash-h" }, "Published posts"));
    if (!rows.length) panel.appendChild(h("p", { class: "dash-empty" }, "No posts yet. They show on the News page above the built-in stories."));
    rows.forEach(function (r) {
      panel.appendChild(h("article", { class: "dash-card slim" },
        h("div", { class: "dash-card-head" }, h("div", {}, h("h3", {}, r.headline), h("p", { class: "dash-sub" }, r.createdByEmail)), h("time", {}, when(r.createdAt))),
        h("div", { class: "dash-actions" }, h("button", { class: "btn btn-danger btn-sm", onclick: async function () {
          if (!confirm("Delete this post?")) return; await deleteDoc(doc(db, "newsPosts", r.id)); renderNews(panel); } }, "Delete"))));
    });
  }).catch(function (e) { console.error(e); panel.textContent = "Couldn’t load."; });
}

/* ---------- Shell ---------- */
var TABS = INBOXES.map(function (c) { return { id: c.id, label: c.label, render: function (p) { renderInbox(c, p); } }; })
  .concat([{ id: "contacts", label: "Contacts", render: renderContacts }, { id: "team", label: "Team", render: renderTeam }, { id: "news", label: "News", render: renderNews }]);
var tabButtons = {};
function updateBadges() {
  Object.keys(tabButtons).forEach(function (id) {
    var n = counts[id]; var b = tabButtons[id].querySelector(".badge");
    b.textContent = n ? n : ""; b.hidden = !n;
  });
}
function show(id) {
  TABS.forEach(function (t) { var on = t.id === id; tabButtons[t.id].setAttribute("aria-selected", on); t.panel.hidden = !on; if (on) t.render(t.panel); });
  try { history.replaceState(null, "", "#" + id); } catch (e) {}
}
function renderApp() {
  root.textContent = "";
  var bar = h("div", { class: "dash-top" },
    h("div", {}, h("h1", {}, "Team dashboard"), h("p", { class: "dash-sub" }, "Signed in as " + me.email)),
    h("button", { class: "btn btn-light", onclick: async function () { await signOut(auth); } }, "Sign out"));
  var tablist = h("div", { class: "dash-tabs", role: "tablist" });
  TABS.forEach(function (t) {
    var b = h("button", { role: "tab", "aria-selected": "false", onclick: function () { show(t.id); } }, t.label, " ", h("span", { class: "badge", hidden: "" }));
    tabButtons[t.id] = b; tablist.appendChild(b);
    t.panel = h("div", { class: "dash-panel", role: "tabpanel", hidden: "" });
  });
  root.append(bar, tablist);
  TABS.forEach(function (t) { root.appendChild(t.panel); });
  // Fill the unread badges for every inbox up front.
  INBOXES.forEach(function (c) { load(c.coll).then(function (rows) { counts[c.id] = rows.filter(function (r) { return !r.read; }).length; updateBadges(); }).catch(function () {}); });
  var start = location.hash.slice(1);
  show(TABS.some(function (t) { return t.id === start; }) ? start : "inbox");
}
function message(title, text, withLogin) {
  root.textContent = "";
  root.appendChild(h("div", { class: "dash-gate" }, h("h1", {}, title), h("p", {}, text),
    withLogin ? h("button", { class: "btn btn-dark", "data-modal": "login" }, "Team Log in") : null));
}

onAuthStateChanged(auth, function (user) {
  me = user;
  if (!user) message("Team dashboard", "Sign in with your team account to see submissions.", true);
  else if (!isTeam(user)) message("No access", "This account (" + user.email + ") isn’t on the team list.", false);
  else renderApp();
});
