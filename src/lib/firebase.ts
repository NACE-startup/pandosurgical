'use client';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  User,
  Auth
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';

// Team members with admin Dashboard access. Keep this in sync with the
// isTeamMember() email list in firestore.rules — that file is the actual
// security boundary; this constant only drives client-side UX routing.
export const TEAM_EMAILS = [
  'tnagai@usc.edu',
  'pan.anye@gmail.com',
  'derekhua2007@gmail.com',
  'longseanlee@gmail.com'
];

// Firebase configuration - Use environment variables in production
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase config is available
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Auth functions with safety checks
export const signInWithGoogle = async () => {
  if (!auth || !googleProvider) {
    return { user: null, error: 'Authentication not configured' };
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Save user to Firestore
    if (result.user && db) {
      await saveUserToFirestore(result.user);
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!auth) {
    return { user: null, error: 'Authentication not configured' };
  }
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    // Save user to Firestore on every sign in
    if (result.user && db) {
      await saveUserToFirestore(result.user);
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to sign in';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later';
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password';
    }
    return { user: null, error: errorMessage };
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName: string) => {
  if (!auth) {
    return { user: null, error: 'Authentication not configured' };
  }
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's display name
    if (result.user) {
      await updateProfile(result.user, { displayName });
      // Save user to Firestore
      if (db) {
        await saveUserToFirestore(result.user);
      }
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to create account';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters';
    }
    return { user: null, error: errorMessage };
  }
};

export const resetPassword = async (email: string) => {
  if (!auth) {
    return { success: false, error: 'Authentication not configured' };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error: any) {
    let errorMessage = 'Failed to send reset email';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    }
    return { success: false, error: errorMessage };
  }
};

export const logOut = async () => {
  if (!auth) {
    return { success: false, error: 'Authentication not configured' };
  }
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Auth state observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

// ============ FIRESTORE FUNCTIONS ============

// Save user to Firestore when they sign up/sign in
const saveUserToFirestore = async (user: User) => {
  if (!db) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
    } else {
      await updateDoc(userRef, {
        lastLogin: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Error saving user to Firestore:', error);
  }
};

// Search users by email (exact match or partial)
export const searchUsersByEmail = async (emailQuery: string) => {
  if (!db) {
    console.log('Firestore not initialized');
    return [];
  }
  try {
    const usersRef = collection(db, 'users');
    
    // First try exact match
    const exactQuery = query(usersRef, where('email', '==', emailQuery));
    const exactSnap = await getDocs(exactQuery);
    
    if (exactSnap.docs.length > 0) {
      console.log('Found exact match:', exactSnap.docs.length);
      return exactSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    // If no exact match, get all users and filter client-side
    // This is less efficient but works without composite indexes
    const allUsersSnap = await getDocs(usersRef);
    const matchedUsers = allUsersSnap.docs
      .filter(doc => {
        const email = doc.data().email?.toLowerCase() || '';
        return email.includes(emailQuery.toLowerCase());
      })
      .map(doc => ({ id: doc.id, ...doc.data() }));
    
    console.log('Found partial matches:', matchedUsers.length);
    return matchedUsers;
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
};

// Get all users (for team display)
export const getAllUsers = async () => {
  if (!db) return [];
  try {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// ============ TEAM INVITES ============

export interface TeamInvite {
  id?: string;
  inviterId: string;
  inviterEmail: string;
  inviteeId: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt?: any;
}

// Send team invite
export const sendTeamInvite = async (inviterId: string, inviterEmail: string, inviteeId: string, inviteeEmail: string) => {
  if (!db) return null;
  try {
    const invitesRef = collection(db, 'teamInvites');
    const docRef = await addDoc(invitesRef, {
      inviterId,
      inviterEmail,
      inviteeId,
      inviteeEmail,
      status: 'pending',
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error sending invite:', error);
    return null;
  }
};

// Get team members (accepted invites) - includes teammates of teammates (full team network)
export const getTeamMembers = async (userId: string) => {
  if (!db) return [];
  try {
    const invitesRef = collection(db, 'teamInvites');
    
    // Get ALL accepted invites to build the full team network
    const acceptedQuery = query(invitesRef, where('status', '==', 'accepted'));
    const acceptedSnap = await getDocs(acceptedQuery);
    
    // Build a graph of connections
    const connections = new Map<string, Set<string>>();
    acceptedSnap.docs.forEach(doc => {
      const data = doc.data();
      const inviterId = data.inviterId;
      const inviteeId = data.inviteeId;
      
      // Add bidirectional connections
      if (!connections.has(inviterId)) connections.set(inviterId, new Set());
      if (!connections.has(inviteeId)) connections.set(inviteeId, new Set());
      connections.get(inviterId)!.add(inviteeId);
      connections.get(inviteeId)!.add(inviterId);
    });
    
    // BFS to find all connected team members starting from current user
    const visited = new Set<string>();
    const queue = [userId];
    visited.add(userId);
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      const neighbors = connections.get(current) || new Set();
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    // Remove the current user from the team members list
    visited.delete(userId);
    
    // Get user details for each member
    const members = [];
    for (const memberId of visited) {
      const userDoc = await getDoc(doc(db, 'users', memberId));
      if (userDoc.exists()) {
        members.push({ id: userDoc.id, ...userDoc.data() });
      }
    }
    
    console.log(`Found ${members.length} team members for user ${userId}`);
    return members;
  } catch (error) {
    console.error('Error getting team members:', error);
    return [];
  }
};

// Get pending invites for user (invites they need to respond to)
export const getPendingInvites = async (userId: string) => {
  if (!db) return [];
  try {
    const invitesRef = collection(db, 'teamInvites');
    const q = query(invitesRef, where('inviteeId', '==', userId), where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    const invites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(`Found ${invites.length} pending invites for user ${userId}`);
    return invites;
  } catch (error) {
    console.error('Error getting invites:', error);
    return [];
  }
};

// Accept/reject invite
export const respondToInvite = async (inviteId: string, status: 'accepted' | 'rejected') => {
  if (!db) return false;
  try {
    await updateDoc(doc(db, 'teamInvites', inviteId), { status });
    return true;
  } catch (error) {
    console.error('Error responding to invite:', error);
    return false;
  }
};

// ============ CONTACT INBOX ============

export interface ContactSubmission {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  inquiryType: string;
  message: string;
  read: boolean;
  createdAt?: any;
}

export type AddContactSubmissionResult =
  | { ok: true; id: string }
  | { ok: false; error: string; code?: string };

export const addContactSubmission = async (
  submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'read'>
): Promise<AddContactSubmissionResult> => {
  if (!db) {
    return { ok: false, error: 'Database is not configured' };
  }
  try {
    const ref = collection(db, 'contactSubmissions');
    // Firestore rejects undefined — omit optional fields when empty
    const payload: Record<string, unknown> = {
      fullName: submission.fullName,
      email: submission.email,
      inquiryType: submission.inquiryType,
      message: submission.message,
      read: false,
      createdAt: serverTimestamp()
    };
    const phone = submission.phone?.trim();
    const company = submission.company?.trim();
    if (phone) payload.phone = phone;
    if (company) payload.company = company;
    const docRef = await addDoc(ref, payload as Parameters<typeof addDoc>[1]);
    return { ok: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error saving contact submission:', error);
    const code = error?.code as string | undefined;
    const message =
      code === 'permission-denied'
        ? 'Could not save your inquiry (server permissions). Please contact us by email.'
        : error?.message || 'Failed to save your inquiry';
    return { ok: false, error: message, code };
  }
};

export const getContactSubmissions = async () => {
  if (!db) return [];
  const ref = collection(db, 'contactSubmissions');
  try {
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactSubmission[];
  } catch (error) {
    console.error('Error getting contact submissions (ordered query):', error);
    try {
      const snapshot = await getDocs(ref);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ContactSubmission[];
      return list.sort((a, b) => {
        const ta =
          typeof (a.createdAt as { toMillis?: () => number })?.toMillis === 'function'
            ? (a.createdAt as { toMillis: () => number }).toMillis()
            : 0;
        const tb =
          typeof (b.createdAt as { toMillis?: () => number })?.toMillis === 'function'
            ? (b.createdAt as { toMillis: () => number }).toMillis()
            : 0;
        return tb - ta;
      });
    } catch (e2) {
      console.error('Error getting contact submissions:', e2);
      return [];
    }
  }
};

export const markSubmissionRead = async (submissionId: string) => {
  if (!db) return false;
  try {
    await updateDoc(doc(db, 'contactSubmissions', submissionId), { read: true });
    return true;
  } catch (error) {
    console.error('Error marking submission as read:', error);
    return false;
  }
};

export const deleteContactSubmission = async (submissionId: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'contactSubmissions', submissionId));
    return true;
  } catch (error) {
    console.error('Error deleting contact submission:', error);
    return false;
  }
};

// ============ INTERNSHIP APPLICATIONS ============

export interface InternshipApplication {
  id?: string;
  role: string;
  fullName: string;
  email: string;
  resumeLink: string;
  whyPassionate: string;
  whyPando: string;
  skillsets: string;
  read: boolean;
  createdAt?: any;
}

export type AddInternshipApplicationResult =
  | { ok: true; id: string }
  | { ok: false; error: string; code?: string };

export const addInternshipApplication = async (
  application: Omit<InternshipApplication, 'id' | 'createdAt' | 'read'>
): Promise<AddInternshipApplicationResult> => {
  if (!db) {
    return { ok: false, error: 'Database is not configured' };
  }
  try {
    const ref = collection(db, 'internshipApplications');
    const docRef = await addDoc(ref, {
      role: application.role,
      fullName: application.fullName,
      email: application.email,
      resumeLink: application.resumeLink,
      whyPassionate: application.whyPassionate,
      whyPando: application.whyPando,
      skillsets: application.skillsets,
      read: false,
      createdAt: serverTimestamp()
    });
    return { ok: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error saving internship application:', error);
    const code = error?.code as string | undefined;
    const message =
      code === 'permission-denied'
        ? 'Could not save your application (server permissions). Please contact us by email.'
        : error?.message || 'Failed to save your application';
    return { ok: false, error: message, code };
  }
};

export const getInternshipApplications = async () => {
  if (!db) return [];
  const ref = collection(db, 'internshipApplications');
  try {
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InternshipApplication[];
  } catch (error) {
    console.error('Error getting internship applications (ordered query):', error);
    try {
      const snapshot = await getDocs(ref);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InternshipApplication[];
      return list.sort((a, b) => {
        const ta =
          typeof (a.createdAt as { toMillis?: () => number })?.toMillis === 'function'
            ? (a.createdAt as { toMillis: () => number }).toMillis()
            : 0;
        const tb =
          typeof (b.createdAt as { toMillis?: () => number })?.toMillis === 'function'
            ? (b.createdAt as { toMillis: () => number }).toMillis()
            : 0;
        return tb - ta;
      });
    } catch (e2) {
      console.error('Error getting internship applications:', e2);
      return [];
    }
  }
};

export const markApplicationRead = async (applicationId: string) => {
  if (!db) return false;
  try {
    await updateDoc(doc(db, 'internshipApplications', applicationId), { read: true });
    return true;
  } catch (error) {
    console.error('Error marking application as read:', error);
    return false;
  }
};

export const deleteInternshipApplication = async (applicationId: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'internshipApplications', applicationId));
    return true;
  } catch (error) {
    console.error('Error deleting internship application:', error);
    return false;
  }
};

// ============ CLINICIAN REQUESTS ============

export interface ClinicianRequest {
  id?: string;
  name: string;
  email: string;
  hospital: string;
  phone?: string;
  notes?: string;
  read: boolean;
  createdAt?: any;
}

export type AddClinicianRequestResult =
  | { ok: true; id: string }
  | { ok: false; error: string; code?: string };

export const addClinicianRequest = async (
  request: Omit<ClinicianRequest, 'id' | 'createdAt' | 'read'>
): Promise<AddClinicianRequestResult> => {
  if (!db) {
    return { ok: false, error: 'Database is not configured' };
  }
  try {
    const ref = collection(db, 'clinicianRequests');
    const payload: Record<string, unknown> = {
      name: request.name,
      email: request.email.trim().toLowerCase(),
      hospital: request.hospital,
      read: false,
      createdAt: serverTimestamp()
    };
    const phone = request.phone?.trim();
    const notes = request.notes?.trim();
    if (phone) payload.phone = phone;
    if (notes) payload.notes = notes;
    const docRef = await addDoc(ref, payload as Parameters<typeof addDoc>[1]);
    return { ok: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error saving clinician request:', error);
    const code = error?.code as string | undefined;
    const message =
      code === 'permission-denied'
        ? 'Could not save your request (server permissions). Please contact us by email.'
        : error?.message || 'Failed to save your request';
    return { ok: false, error: message, code };
  }
};

export const getClinicianRequests = async () => {
  if (!db) return [];
  const ref = collection(db, 'clinicianRequests');
  try {
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ClinicianRequest[];
  } catch (error) {
    console.error('Error getting clinician requests (ordered query):', error);
    try {
      const snapshot = await getDocs(ref);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ClinicianRequest[];
    } catch (e2) {
      console.error('Error getting clinician requests:', e2);
      return [];
    }
  }
};

export const markClinicianRequestRead = async (requestId: string) => {
  if (!db) return false;
  try {
    await updateDoc(doc(db, 'clinicianRequests', requestId), { read: true });
    return true;
  } catch (error) {
    console.error('Error marking clinician request as read:', error);
    return false;
  }
};

export const deleteClinicianRequest = async (requestId: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'clinicianRequests', requestId));
    return true;
  } catch (error) {
    console.error('Error deleting clinician request:', error);
    return false;
  }
};

// ============ NEWSLETTER SIGNUPS ============

export interface NewsletterSignup {
  id?: string;
  name: string;
  email: string;
  interests: string[];
  read: boolean;
  createdAt?: any;
}

export type AddNewsletterSignupResult =
  | { ok: true; id: string }
  | { ok: false; error: string; code?: string };

export const addNewsletterSignup = async (
  signup: Omit<NewsletterSignup, 'id' | 'createdAt' | 'read'>
): Promise<AddNewsletterSignupResult> => {
  if (!db) {
    return { ok: false, error: 'Database is not configured' };
  }
  try {
    const ref = collection(db, 'newsletterSignups');
    const docRef = await addDoc(ref, {
      name: signup.name,
      email: signup.email.trim().toLowerCase(),
      interests: signup.interests,
      read: false,
      createdAt: serverTimestamp()
    });
    return { ok: true, id: docRef.id };
  } catch (error: any) {
    console.error('Error saving newsletter signup:', error);
    const code = error?.code as string | undefined;
    const message =
      code === 'permission-denied'
        ? 'Could not save your signup (server permissions). Please contact us by email.'
        : error?.message || 'Failed to save your signup';
    return { ok: false, error: message, code };
  }
};

export const getNewsletterSignups = async () => {
  if (!db) return [];
  const ref = collection(db, 'newsletterSignups');
  try {
    const q = query(ref, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsletterSignup[];
  } catch (error) {
    console.error('Error getting newsletter signups (ordered query):', error);
    try {
      const snapshot = await getDocs(ref);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsletterSignup[];
    } catch (e2) {
      console.error('Error getting newsletter signups:', e2);
      return [];
    }
  }
};

export const markNewsletterSignupRead = async (signupId: string) => {
  if (!db) return false;
  try {
    await updateDoc(doc(db, 'newsletterSignups', signupId), { read: true });
    return true;
  } catch (error) {
    console.error('Error marking newsletter signup as read:', error);
    return false;
  }
};

export const deleteNewsletterSignup = async (signupId: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'newsletterSignups', signupId));
    return true;
  } catch (error) {
    console.error('Error deleting newsletter signup:', error);
    return false;
  }
};

// Used right after a non-team Google sign-in to decide whether to show the
// clinician/newsletter sign-up choice or a "you're already registered" screen.
// The caller must still be authenticated as `email` when this runs — the
// Firestore rules only allow this lookup for a user checking their own email.
export const checkEmailAlreadyRegistered = async (email: string): Promise<boolean> => {
  if (!db) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  try {
    const [clinicianSnap, newsletterSnap] = await Promise.all([
      getDocs(query(collection(db, 'clinicianRequests'), where('email', '==', normalized), limit(1))),
      getDocs(query(collection(db, 'newsletterSignups'), where('email', '==', normalized), limit(1)))
    ]);
    return !clinicianSnap.empty || !newsletterSnap.empty;
  } catch (error) {
    console.error('Error checking existing registration:', error);
    return false;
  }
};

// ============ TEAM CONTACTS ============
// Shared address book any team member can add to / edit / delete from the Dashboard.

export interface TeamContact {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  howWeKnowThem: string;
  lastContacted?: string; // Free-form date string the team enters, not a Firestore timestamp
  createdBy: string;
  createdAt?: any;
  updatedAt?: any;
}

export const addTeamContact = async (contact: Omit<TeamContact, 'id' | 'createdAt' | 'updatedAt'>) => {
  if (!db) return null;
  try {
    const ref = collection(db, 'teamContacts');
    const payload: Record<string, unknown> = {
      name: contact.name,
      howWeKnowThem: contact.howWeKnowThem,
      createdBy: contact.createdBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    if (contact.email) payload.email = contact.email;
    if (contact.phone) payload.phone = contact.phone;
    if (contact.lastContacted) payload.lastContacted = contact.lastContacted;
    const docRef = await addDoc(ref, payload as Parameters<typeof addDoc>[1]);
    return docRef.id;
  } catch (error) {
    console.error('Error adding team contact:', error);
    return null;
  }
};

export const getTeamContacts = async () => {
  if (!db) return [];
  try {
    const snapshot = await getDocs(collection(db, 'teamContacts'));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as TeamContact[];
  } catch (error) {
    console.error('Error getting team contacts:', error);
    return [];
  }
};

export const updateTeamContact = async (contactId: string, updates: Partial<TeamContact>) => {
  if (!db) return false;
  try {
    await updateDoc(doc(db, 'teamContacts', contactId), { ...updates, updatedAt: serverTimestamp() });
    return true;
  } catch (error) {
    console.error('Error updating team contact:', error);
    return false;
  }
};

export const deleteTeamContact = async (contactId: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'teamContacts', contactId));
    return true;
  } catch (error) {
    console.error('Error deleting team contact:', error);
    return false;
  }
};

// ============ NEWS POSTS ============
// Team-authored company news, published live on the public /news page.

export interface NewsPost {
  id?: string;
  headline: string;
  body: string;
  photoUrl: string;
  createdBy: string;
  createdByEmail: string;
  createdAt?: any;
}

export const uploadNewsPhoto = async (file: File): Promise<string | null> => {
  if (!app) {
    console.error('Cannot upload news photo: Firebase app not configured');
    return null;
  }
  try {
    const { getStorage, ref: storageRef, uploadBytesResumable, getDownloadURL } = await import('firebase/storage');
    const storage = getStorage(app);
    const path = `news/${Date.now()}-${file.name}`;
    const fileRef = storageRef(storage, path);
    console.log('Uploading news photo to', path, `(${(file.size / 1024).toFixed(0)} KB)`);

    const uploadTask = uploadBytesResumable(fileRef, file);
    await new Promise<void>((resolve, reject) => {
      // Storage requests can hang indefinitely (misconfigured bucket, blocked
      // request) instead of rejecting on their own, so force a failure after
      // a minute rather than leaving the "Publishing..." button spinning forever.
      const timeout = setTimeout(() => {
        uploadTask.cancel();
        reject(new Error('Upload timed out after 60s'));
      }, 60000);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          console.log(`News photo upload: ${pct}%`);
        },
        (error) => {
          clearTimeout(timeout);
          reject(error);
        },
        () => {
          clearTimeout(timeout);
          resolve();
        }
      );
    });

    const url = await getDownloadURL(fileRef);
    console.log('News photo uploaded successfully:', url);
    return url;
  } catch (error) {
    console.error('Error uploading news photo:', error);
    return null;
  }
};

export const addNewsPost = async (post: Omit<NewsPost, 'id' | 'createdAt'>) => {
  if (!db) return null;
  try {
    const ref = collection(db, 'newsPosts');
    const docRef = await addDoc(ref, { ...post, createdAt: serverTimestamp() });
    return docRef.id;
  } catch (error) {
    console.error('Error adding news post:', error);
    return null;
  }
};

export const getNewsPosts = async () => {
  if (!db) return [];
  try {
    const q = query(collection(db, 'newsPosts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsPost[];
  } catch (error) {
    console.error('Error getting news posts (ordered query):', error);
    try {
      const snapshot = await getDocs(collection(db, 'newsPosts'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as NewsPost[];
    } catch (e2) {
      console.error('Error getting news posts:', e2);
      return [];
    }
  }
};

export const deleteNewsPost = async (postId: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'newsPosts', postId));
    return true;
  } catch (error) {
    console.error('Error deleting news post:', error);
    return false;
  }
};

export { auth, db };
export type { User };
