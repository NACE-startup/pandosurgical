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
  onSnapshot,
  serverTimestamp,
  Firestore
} from 'firebase/firestore';

// Firebase configuration - Use environment variables in production
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
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

// ============ EVENTS ============

export interface FirestoreEvent {
  id?: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'interview' | 'deadline' | 'other';
  description?: string;
  createdBy: string;
  createdByEmail: string;
  sharedWith: string[]; // Array of user IDs who can view
  assignees?: string[]; // Array of user IDs involved in the event
  createdAt?: any;
}

// Add event
export const addEvent = async (event: Omit<FirestoreEvent, 'id' | 'createdAt'>) => {
  if (!db) return null;
  try {
    const eventsRef = collection(db, 'events');
    const docRef = await addDoc(eventsRef, {
      ...event,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    return null;
  }
};

// Get events for user (created by them, shared with them, or assigned to them)
export const getEventsForUser = async (userId: string) => {
  if (!db) return [];
  try {
    const eventsRef = collection(db, 'events');
    // Get events created by user
    const createdQuery = query(eventsRef, where('createdBy', '==', userId));
    const createdSnap = await getDocs(createdQuery);
    
    // Get events shared with user
    const sharedQuery = query(eventsRef, where('sharedWith', 'array-contains', userId));
    const sharedSnap = await getDocs(sharedQuery);
    
    // Get events where user is an assignee
    const assignedQuery = query(eventsRef, where('assignees', 'array-contains', userId));
    const assignedSnap = await getDocs(assignedQuery);
    
    const events = new Map();
    createdSnap.docs.forEach(doc => events.set(doc.id, { id: doc.id, ...doc.data() }));
    sharedSnap.docs.forEach(doc => events.set(doc.id, { id: doc.id, ...doc.data() }));
    assignedSnap.docs.forEach(doc => events.set(doc.id, { id: doc.id, ...doc.data() }));
    
    return Array.from(events.values());
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
};

// Delete event
export const deleteEvent = async (eventId: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'events', eventId));
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    return false;
  }
};

// Update event shared users
export const updateEventSharing = async (eventId: string, sharedWith: string[]) => {
  if (!db) return false;
  try {
    await updateDoc(doc(db, 'events', eventId), { sharedWith });
    return true;
  } catch (error) {
    console.error('Error updating event sharing:', error);
    return false;
  }
};

// ============ TASKS ============

export interface FirestoreTask {
  id?: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  createdBy: string;
  assignees?: string[]; // Array of user IDs assigned to the task
  createdAt?: any;
}

// Add task
export const addTask = async (task: Omit<FirestoreTask, 'id' | 'createdAt'>) => {
  if (!db) return null;
  try {
    const tasksRef = collection(db, 'tasks');
    const docRef = await addDoc(tasksRef, {
      ...task,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
};

// Get tasks for user (created by them or assigned to them)
export const getTasksForUser = async (userId: string) => {
  if (!db) return [];
  try {
    const tasksRef = collection(db, 'tasks');
    // Get tasks created by user
    const createdQuery = query(tasksRef, where('createdBy', '==', userId));
    const createdSnap = await getDocs(createdQuery);
    
    // Get tasks assigned to user
    const assignedQuery = query(tasksRef, where('assignees', 'array-contains', userId));
    const assignedSnap = await getDocs(assignedQuery);
    
    const tasks = new Map();
    createdSnap.docs.forEach(doc => tasks.set(doc.id, { id: doc.id, ...doc.data() }));
    assignedSnap.docs.forEach(doc => tasks.set(doc.id, { id: doc.id, ...doc.data() }));
    
    return Array.from(tasks.values());
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

// Update task
export const updateTask = async (taskId: string, updates: Partial<FirestoreTask>) => {
  if (!db) return false;
  try {
    await updateDoc(doc(db, 'tasks', taskId), updates);
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
};

// Delete task
export const deleteTask = async (taskId: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
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

// Get team members (accepted invites)
export const getTeamMembers = async (userId: string) => {
  if (!db) return [];
  try {
    const invitesRef = collection(db, 'teamInvites');
    
    // Get invites sent by user
    const sentQuery = query(invitesRef, where('inviterId', '==', userId), where('status', '==', 'accepted'));
    const sentSnap = await getDocs(sentQuery);
    
    // Get invites received by user
    const receivedQuery = query(invitesRef, where('inviteeId', '==', userId), where('status', '==', 'accepted'));
    const receivedSnap = await getDocs(receivedQuery);
    
    const memberIds = new Set<string>();
    sentSnap.docs.forEach(doc => memberIds.add(doc.data().inviteeId));
    receivedSnap.docs.forEach(doc => memberIds.add(doc.data().inviterId));
    
    // Get user details for each member
    const members = [];
    for (const memberId of memberIds) {
      const userDoc = await getDoc(doc(db, 'users', memberId));
      if (userDoc.exists()) {
        members.push({ id: userDoc.id, ...userDoc.data() });
      }
    }
    
    return members;
  } catch (error) {
    console.error('Error getting team members:', error);
    return [];
  }
};

// Get pending invites for user
export const getPendingInvites = async (userId: string) => {
  if (!db) return [];
  try {
    const invitesRef = collection(db, 'teamInvites');
    const q = query(invitesRef, where('inviteeId', '==', userId), where('status', '==', 'pending'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

export { auth, db };
export type { User };
