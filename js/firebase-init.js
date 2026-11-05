/* Starts Firebase once and shares it with backend.js (public pages) and dashboard.js. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-check.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, TEAM_EMAILS, APP_CHECK_SITE_KEY } from "./firebase-config.js";

export const app = initializeApp(firebaseConfig);

// App Check: only requests that pass reCAPTCHA from this site are accepted
// (once "Enforce" is switched on in the Firebase console).
if (APP_CHECK_SITE_KEY) {
  try {
    initializeAppCheck(app, { provider: new ReCaptchaV3Provider(APP_CHECK_SITE_KEY), isTokenAutoRefreshEnabled: true });
  } catch (e) { console.warn("App Check not started", e); }
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const isTeam = (user) => !!user && !!user.email && TEAM_EMAILS.includes(user.email.toLowerCase());
