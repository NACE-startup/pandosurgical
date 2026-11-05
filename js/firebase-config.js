/* Firebase web config for the Pando Surgical site.
   These values are public by design (they identify the project, they don't grant access).
   Access is controlled by firestore.rules and storage.rules. */
export const firebaseConfig = {
  apiKey: "AIzaSyCdh2xI_R680mm4KdYb-dZcvUGLv_kndjg",
  authDomain: "pandosurgical-608c2.firebaseapp.com",
  projectId: "pandosurgical-608c2",
  storageBucket: "pandosurgical-608c2.firebasestorage.app",
  messagingSenderId: "41266160513",
  appId: "1:41266160513:web:3ee749f96a1da44ed6be80"
};

/* Team members who can open the dashboard. Keep in sync with isTeamMember() in
   firestore.rules and storage.rules; those files are the real security boundary. */
export const TEAM_EMAILS = [
  "tnagai@usc.edu",
  "pan.anye@gmail.com",
  "derekhua2007@gmail.com",
  "longseanlee@gmail.com"
];

/* Firebase App Check (blocks bots that don't come from this site).
   Paste a reCAPTCHA v3 site key here to turn it on. Leave empty to skip. */
export const APP_CHECK_SITE_KEY = "";
