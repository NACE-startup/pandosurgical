'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Users,
  Settings,
  LogOut,
  AlertTriangle,
  ChevronLeft,
  UserPlus,
  Mail,
  Phone,
  Search,
  CheckCircle,
  XCircle,
  Bell,
  Loader2,
  Sparkles,
  Sun,
  Moon,
  Menu,
  Edit3,
  Inbox,
  Briefcase,
  Stethoscope,
  Send,
  Plus,
  Contact as ContactIcon,
  Newspaper,
  Image as ImageIcon
} from 'lucide-react';
import {
  logOut,
  User,
  searchUsersByEmail,
  sendTeamInvite,
  getTeamMembers,
  getPendingInvites,
  respondToInvite,
  getContactSubmissions,
  markSubmissionRead,
  deleteContactSubmission,
  getInternshipApplications,
  markApplicationRead,
  deleteInternshipApplication,
  getClinicianRequests,
  markClinicianRequestRead,
  deleteClinicianRequest,
  getNewsletterSignups,
  markNewsletterSignupRead,
  deleteNewsletterSignup,
  addTeamContact,
  getTeamContacts,
  updateTeamContact,
  deleteTeamContact,
  addNewsPost,
  getNewsPosts,
  deleteNewsPost,
  uploadNewsPhoto,
  ContactSubmission,
  InternshipApplication,
  ClinicianRequest,
  NewsletterSignup,
  TeamContact,
  NewsPost
} from '@/lib/firebase';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface TeamMember {
  id: string;
  email: string;
  displayName?: string;
}

interface Invite {
  id: string;
  inviterId: string;
  inviterEmail: string;
  status: string;
}

// Formats a Firestore Timestamp (or a value already coerced to one) into a local date + time string.
const formatTimestamp = (createdAt: unknown): string => {
  const toDate = (createdAt as { toDate?: () => Date } | undefined)?.toDate;
  if (typeof toDate !== 'function') return 'just now';
  return toDate.call(createdAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

// Theme configuration
const themes = {
  light: {
    backdrop: 'bg-white/40',
    panel: 'bg-white/90',
    sidebar: 'bg-slate-50/95',
    sidebarBorder: 'border-slate-200',
    card: 'bg-white/80 border-slate-200',
    cardHover: 'hover:bg-slate-50',
    input: 'bg-white border-slate-200 text-slate-900 placeholder-slate-400',
    inputFocus: 'focus:border-[#2A8C8F] focus:ring-[#2A8C8F]/20',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-500',
    headerBg: 'bg-white/60',
    headerBorder: 'border-slate-200',
    navActive: 'bg-[#2A8C8F]/10 border-[#2A8C8F]/30',
    navInactive: 'hover:bg-slate-100 border-transparent',
    navIconBg: 'bg-slate-100',
    navIconBgActive: 'bg-[#2A8C8F]/20',
    userCard: 'bg-slate-100',
    statusBorder: 'border-white',
    modalBg: 'bg-white/95',
    modalBorder: 'border-slate-200',
    cancelBtn: 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200',
    taskCard: 'bg-slate-50 border-slate-200',
    glowOpacity: '0.1',
    checkboxBg: 'bg-slate-100 border-slate-300',
    checkboxChecked: 'bg-[#2A8C8F] border-[#2A8C8F]',
  },
  dark: {
    backdrop: 'bg-black/60',
    panel: 'bg-slate-900/80',
    sidebar: 'bg-black/40',
    sidebarBorder: 'border-white/10',
    card: 'bg-white/5 border-white/10',
    cardHover: 'hover:bg-white/10',
    input: 'bg-black/30 border-white/10 text-white placeholder-gray-400',
    inputFocus: 'focus:border-[#2A8C8F]/50 focus:ring-[#2A8C8F]/50',
    text: 'text-white',
    textSecondary: 'text-gray-200',
    textMuted: 'text-gray-300',
    headerBg: 'bg-black/20',
    headerBorder: 'border-white/10',
    navActive: 'bg-gradient-to-r from-[#2A8C8F]/20 to-[#2A8C8F]/5 border-[#2A8C8F]/30',
    navInactive: 'hover:bg-white/5 border-transparent',
    navIconBg: 'bg-white/10',
    navIconBgActive: 'bg-[#2A8C8F]/20',
    userCard: 'bg-white/10',
    statusBorder: 'border-slate-900',
    modalBg: 'bg-slate-900/95',
    modalBorder: 'border-white/10',
    cancelBtn: 'bg-white/10 border-white/10 text-gray-300 hover:bg-white/15',
    taskCard: 'bg-black/30 border-white/10',
    glowOpacity: '0.2',
    checkboxBg: 'bg-white/10 border-white/30',
    checkboxChecked: 'bg-[#2A8C8F] border-[#2A8C8F]',
  }
};

export function Dashboard({ isOpen, onClose, user }: DashboardProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('dashboard-theme') as 'light' | 'dark') || 'light';
    }
    return 'light';
  });
  const t = themes[theme];

  const [activeTab, setActiveTab] = useState<'contacts' | 'news' | 'team' | 'inbox' | 'applications' | 'clinicians' | 'newsletter' | 'settings'>('contacts');
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null);
  const [clinicianRequests, setClinicianRequests] = useState<ClinicianRequest[]>([]);
  const [selectedClinicianRequest, setSelectedClinicianRequest] = useState<ClinicianRequest | null>(null);
  const [newsletterSignups, setNewsletterSignups] = useState<NewsletterSignup[]>([]);
  const [selectedNewsletterSignup, setSelectedNewsletterSignup] = useState<NewsletterSignup | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [contacts, setContacts] = useState<TeamContact[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<TeamContact | null>(null);
  const [newContact, setNewContact] = useState<{ name: string; email: string; phone: string; howWeKnowThem: string; lastContacted: string }>({ name: '', email: '', phone: '', howWeKnowThem: '', lastContacted: '' });
  const [showDeleteContactConfirm, setShowDeleteContactConfirm] = useState<string | null>(null);
  const [savingContact, setSavingContact] = useState(false);

  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([]);
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [newNewsPost, setNewNewsPost] = useState<{ headline: string; body: string; photoFile: File | null; photoPreview: string }>({ headline: '', body: '', photoFile: null, photoPreview: '' });
  const [showDeleteNewsConfirm, setShowDeleteNewsConfirm] = useState<string | null>(null);
  const [savingNews, setSavingNews] = useState(false);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) loadAllData();
  }, [isOpen, user]);

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const loadAllData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [membersData, invitesData, contactsData, newsPostsData, submissionsData, applicationsData, clinicianRequestsData, newsletterSignupsData] = await Promise.all([
        getTeamMembers(user.uid),
        getPendingInvites(user.uid),
        getTeamContacts(),
        getNewsPosts(),
        getContactSubmissions(),
        getInternshipApplications(),
        getClinicianRequests(),
        getNewsletterSignups()
      ]);
      setTeamMembers(membersData as TeamMember[]);
      setPendingInvites(invitesData as Invite[]);
      setContacts(contactsData);
      setNewsPosts(newsPostsData);
      setSubmissions(submissionsData);
      setApplications(applicationsData);
      setClinicianRequests(clinicianRequestsData);
      setNewsletterSignups(newsletterSignupsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleLogout = async () => { await logOut(); onClose(); };

  const handleAddContact = async () => {
    if (!user || !newContact.name.trim() || !newContact.howWeKnowThem.trim()) return;
    setSavingContact(true);
    const id = await addTeamContact({
      name: newContact.name.trim(),
      email: newContact.email.trim(),
      phone: newContact.phone.trim(),
      howWeKnowThem: newContact.howWeKnowThem.trim(),
      lastContacted: newContact.lastContacted,
      createdBy: user.uid
    });
    if (id) {
      setContacts([{ id, name: newContact.name.trim(), email: newContact.email.trim() || undefined, phone: newContact.phone.trim() || undefined, howWeKnowThem: newContact.howWeKnowThem.trim(), lastContacted: newContact.lastContacted || undefined, createdBy: user.uid }, ...contacts]);
    }
    setNewContact({ name: '', email: '', phone: '', howWeKnowThem: '', lastContacted: '' });
    setShowContactModal(false);
    setSavingContact(false);
  };

  const handleEditContact = async () => {
    if (!editingContact?.id) return;
    setSavingContact(true);
    const updates = {
      name: editingContact.name,
      email: editingContact.email || '',
      phone: editingContact.phone || '',
      howWeKnowThem: editingContact.howWeKnowThem,
      lastContacted: editingContact.lastContacted || ''
    };
    const success = await updateTeamContact(editingContact.id, updates);
    if (success) {
      setContacts(contacts.map(c => c.id === editingContact.id ? { ...c, ...editingContact } : c));
    }
    setEditingContact(null);
    setSavingContact(false);
  };

  const handleDeleteContact = async (id: string) => {
    if (await deleteTeamContact(id)) setContacts(contacts.filter(c => c.id !== id));
    setShowDeleteContactConfirm(null);
  };

  const handleNewsPhotoChange = (file: File | null) => {
    if (!file) {
      setNewNewsPost(prev => ({ ...prev, photoFile: null, photoPreview: '' }));
      return;
    }
    setNewNewsPost(prev => ({ ...prev, photoFile: file, photoPreview: URL.createObjectURL(file) }));
  };

  const handleAddNewsPost = async () => {
    if (!user || !newNewsPost.headline.trim() || !newNewsPost.body.trim() || !newNewsPost.photoFile) return;
    setSavingNews(true);
    try {
      const photoUrl = await uploadNewsPhoto(newNewsPost.photoFile);
      if (!photoUrl) {
        alert('Failed to upload photo. Please try again.');
        return;
      }
      const id = await addNewsPost({
        headline: newNewsPost.headline.trim(),
        body: newNewsPost.body.trim(),
        photoUrl,
        createdBy: user.uid,
        createdByEmail: user.email || ''
      });
      if (!id) {
        alert('Failed to publish post. Please try again.');
        return;
      }
      setNewsPosts([{ id, headline: newNewsPost.headline.trim(), body: newNewsPost.body.trim(), photoUrl, createdBy: user.uid, createdByEmail: user.email || '' }, ...newsPosts]);
      setNewNewsPost({ headline: '', body: '', photoFile: null, photoPreview: '' });
      setShowNewsModal(false);
    } finally {
      setSavingNews(false);
    }
  };

  const handleDeleteNewsPost = async (id: string) => {
    if (await deleteNewsPost(id)) setNewsPosts(newsPosts.filter(n => n.id !== id));
    setShowDeleteNewsConfirm(null);
  };

  const handleSearchUsers = async () => {
    if (!searchEmail.trim() || !user) return;
    setSearching(true);
    setSearchPerformed(false);
    try {
      const results = await searchUsersByEmail(searchEmail.toLowerCase());
      const filtered = (results as TeamMember[]).filter((r: any) => r.id !== user.uid && !teamMembers.find(m => m.id === r.id));
      setSearchResults(filtered);
      setSearchPerformed(true);
    } catch (error) { 
      console.error('Search error:', error);
      setSearchPerformed(true);
    }
    setSearching(false);
  };

  const handleSendInvite = async (invitee: TeamMember) => {
    if (!user) return;
    setInviting(invitee.id);
    try {
      await sendTeamInvite(user.uid, user.email || '', invitee.id, invitee.email);
      setSearchResults(searchResults.filter(r => r.id !== invitee.id));
      setSearchEmail('');
    } catch (error) { console.error('Invite error:', error); }
    setInviting(null);
  };

  const handleRespondToInvite = async (inviteId: string, status: 'accepted' | 'rejected') => {
    if (await respondToInvite(inviteId, status)) {
      setPendingInvites(pendingInvites.filter(i => i.id !== inviteId));
      if (status === 'accepted') setTeamMembers(await getTeamMembers(user!.uid) as TeamMember[]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <div className={`absolute inset-0 ${t.backdrop} backdrop-blur-xl`} />
            <div className={`absolute inset-0 bg-[linear-gradient(rgba(212,162,74,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,162,74,0.03)_1px,transparent_1px)] bg-[size:50px_50px]`} />
          </motion.div>

          {/* Dashboard Panel */}
          <motion.div
            className="fixed inset-0 sm:inset-2 md:inset-4 lg:inset-8 xl:inset-12 z-50 flex"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex w-full ${t.panel} backdrop-blur-2xl sm:rounded-2xl md:rounded-3xl shadow-2xl border ${theme === 'light' ? 'border-slate-200/80' : 'border-white/10'} overflow-hidden`}>
              {/* Ambient glow effects */}
              <div className={`absolute -top-40 -left-40 w-80 h-80 bg-[#2A8C8F] rounded-full blur-[100px] pointer-events-none hidden sm:block`} style={{ opacity: t.glowOpacity }} />
              <div className={`absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500 rounded-full blur-[100px] pointer-events-none hidden sm:block`} style={{ opacity: theme === 'light' ? '0.05' : '0.1' }} />

              {/* Mobile Sidebar Overlay */}
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
              </AnimatePresence>

              {/* Sidebar */}
              <motion.div 
                className={`
                  fixed md:relative inset-y-0 left-0 z-50 md:z-auto
                  w-72 md:w-64 lg:w-72
                  ${t.sidebar} backdrop-blur-xl flex flex-col border-r ${t.sidebarBorder}
                  transform transition-transform duration-300 ease-in-out md:transform-none
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
              >
                {/* Logo */}
                <div className={`p-4 md:p-4 lg:p-6 border-b ${t.sidebarBorder}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2A8C8F] to-[#1E7275] rounded-xl blur-lg opacity-50" />
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#2A8C8F] to-[#1E7275] flex items-center justify-center shadow-lg">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <span className={`${t.text} font-bold text-lg`}>Pando</span>
                        <span className="text-[#2A8C8F] font-light text-lg ml-1">Portal</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSidebarOpen(false)}
                      className={`md:hidden p-2 rounded-lg ${t.cardHover}`}
                    >
                      <X className={`w-5 h-5 ${t.textMuted}`} />
                    </button>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 md:p-3 lg:p-4 space-y-2 overflow-y-auto">
                  {[
                    { id: 'contacts', icon: ContactIcon, label: 'Contacts', desc: 'Team contacts' },
                    { id: 'news', icon: Newspaper, label: 'News', desc: 'Publish updates' },
                    { id: 'team', icon: Users, label: 'Team', desc: 'Manage members', badge: pendingInvites.length },
                    { id: 'inbox', icon: Inbox, label: 'Inbox', desc: 'Contact submissions', badge: submissions.filter(s => !s.read).length },
                    { id: 'applications', icon: Briefcase, label: 'Applications', desc: 'Internship applicants', badge: applications.filter(a => !a.read).length },
                    { id: 'clinicians', icon: Stethoscope, label: 'Clinicians', desc: 'Access requests', badge: clinicianRequests.filter(c => !c.read).length },
                    { id: 'newsletter', icon: Send, label: 'Newsletter', desc: 'Signups', badge: newsletterSignups.filter(n => !n.read).length },
                    { id: 'settings', icon: Settings, label: 'Settings', desc: 'Preferences' },
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group border ${
                        activeTab === item.id ? t.navActive : t.navInactive
                      }`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {activeTab === item.id && (
                        <motion.div
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#2A8C8F] to-[#1E7275] rounded-full"
                          layoutId="activeTab"
                        />
                      )}
                      <div className={`p-2 rounded-lg ${activeTab === item.id ? t.navIconBgActive : `${t.navIconBg} group-hover:bg-[#2A8C8F]/10`}`}>
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#2A8C8F]' : `${t.textMuted} group-hover:text-[#2A8C8F]`}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <span className={`block text-sm font-medium ${activeTab === item.id ? t.text : t.textSecondary}`}>{item.label}</span>
                        <span className={`block text-xs ${t.textMuted}`}>{item.desc}</span>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <span className="bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </nav>

                {/* User Section */}
                <div className={`p-3 md:p-3 lg:p-4 border-t ${t.sidebarBorder}`}>
                  <div className={`flex items-center gap-3 px-3 py-3 rounded-xl ${t.userCard} mb-2`}>
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2A8C8F] to-[#1E7275] flex items-center justify-center text-white font-semibold">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 ${t.statusBorder}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${t.text} text-sm font-medium truncate`}>{user?.displayName || 'User'}</p>
                      <p className={`${t.textMuted} text-xs truncate`}>{user?.email}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className={`w-full flex items-center justify-start gap-3 px-3 py-2 ${t.textMuted} hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all`}
                    whileHover={{ x: 4 }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Sign Out</span>
                  </motion.button>
                </div>
              </motion.div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <div className={`flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 border-b ${t.headerBorder} ${t.headerBg}`}>
                  <div className="flex items-center gap-3">
                    {/* Mobile menu button */}
                    <motion.button 
                      onClick={() => setSidebarOpen(true)}
                      className={`md:hidden p-2 rounded-xl ${t.card} border transition-all`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Menu className={`w-5 h-5 ${t.textMuted}`} />
                    </motion.button>
                    <div>
                      <h1 className={`text-lg sm:text-xl md:text-2xl font-bold ${t.text} flex items-center gap-2`}>
                        {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#2A8C8F]/20 text-[#2A8C8F] rounded-full font-normal">Live</span>
                      </h1>
                      <p className={`${t.textMuted} text-xs sm:text-sm hidden sm:block`}>
                        {activeTab === 'contacts' && 'Shared team contacts'}
                        {activeTab === 'news' && 'Publish company news'}
                        {activeTab === 'team' && 'Manage team members'}
                        {activeTab === 'inbox' && 'Contact form submissions'}
                        {activeTab === 'applications' && 'Internship applications'}
                        {activeTab === 'clinicians' && 'Clinician access requests'}
                        {activeTab === 'newsletter' && 'Newsletter signups'}
                        {activeTab === 'settings' && 'Configure preferences'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <motion.button 
                      onClick={toggleTheme}
                      className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${t.card} border transition-all`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {theme === 'light' ? <Moon className={`w-4 h-4 sm:w-5 sm:h-5 ${t.textMuted}`} /> : <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />}
                    </motion.button>
                    <motion.button 
                      onClick={onClose} 
                      className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl ${t.card} border transition-all`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className={`w-4 h-4 sm:w-5 sm:h-5 ${t.textMuted}`} />
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-[#2A8C8F] mx-auto mb-4" />
                        <p className={t.textMuted}>Loading your data...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* CONTACTS TAB */}
                      {activeTab === 'contacts' && (
                        <div className="space-y-4 sm:space-y-6">
                          <motion.button
                            onClick={() => setShowContactModal(true)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-xl font-medium shadow-lg shadow-[#2A8C8F]/30 border border-[#2A8C8F]/50 text-sm sm:text-base"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            New Contact
                          </motion.button>

                          {contacts.length === 0 ? (
                            <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-8 sm:p-12 text-center`}>
                              <ContactIcon className={`w-12 h-12 ${t.textMuted} mx-auto mb-3 opacity-40`} />
                              <p className={`${t.textMuted} text-sm`}>No contacts yet</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                              {contacts.map((contact, index) => (
                                <motion.div
                                  key={contact.id}
                                  className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4 group`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                >
                                  <div className="flex items-start justify-between gap-2 mb-2">
                                    <p className={`font-semibold ${t.text} text-sm sm:text-base truncate`}>{contact.name}</p>
                                    <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                                      <button onClick={() => setEditingContact(contact)} className="p-1 sm:p-1.5 rounded-lg bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">
                                        <Edit3 className="w-3 h-3" />
                                      </button>
                                      <button onClick={() => setShowDeleteContactConfirm(contact.id!)} className="p-1 sm:p-1.5 rounded-lg bg-rose-500/20 text-rose-500 hover:bg-rose-500/30">
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="space-y-1 mb-2">
                                    {contact.email && (
                                      <p className={`text-xs sm:text-sm ${t.textMuted} flex items-center gap-1.5 truncate`}>
                                        <Mail className="w-3 h-3 flex-shrink-0" />{contact.email}
                                      </p>
                                    )}
                                    {contact.phone && (
                                      <p className={`text-xs sm:text-sm ${t.textMuted} flex items-center gap-1.5 truncate`}>
                                        <Phone className="w-3 h-3 flex-shrink-0" />{contact.phone}
                                      </p>
                                    )}
                                  </div>
                                  <p className={`text-xs sm:text-sm ${t.textSecondary} mb-2`}>{contact.howWeKnowThem}</p>
                                  {contact.lastContacted && (
                                    <p className={`text-[10px] sm:text-xs ${t.textMuted}`}>Last contacted: {contact.lastContacted}</p>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* NEWS TAB */}
                      {activeTab === 'news' && (
                        <div className="space-y-4 sm:space-y-6">
                          <motion.button
                            onClick={() => setShowNewsModal(true)}
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-xl font-medium shadow-lg shadow-[#2A8C8F]/30 border border-[#2A8C8F]/50 text-sm sm:text-base"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            New Post
                          </motion.button>

                          {newsPosts.length === 0 ? (
                            <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-8 sm:p-12 text-center`}>
                              <Newspaper className={`w-12 h-12 ${t.textMuted} mx-auto mb-3 opacity-40`} />
                              <p className={`${t.textMuted} text-sm`}>No news posts yet</p>
                            </div>
                          ) : (
                            <div className="space-y-3 sm:space-y-4">
                              {newsPosts.map((post, index) => (
                                <motion.div
                                  key={post.id}
                                  className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4 flex gap-3 sm:gap-4 group`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                >
                                  <img src={post.photoUrl} alt="" className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg sm:rounded-xl object-cover flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <p className={`font-semibold ${t.text} text-sm sm:text-base`}>{post.headline}</p>
                                      <button onClick={() => setShowDeleteNewsConfirm(post.id!)} className="p-1 sm:p-1.5 rounded-lg bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                    <p className={`text-xs sm:text-sm ${t.textMuted} line-clamp-2 mt-1`}>{post.body}</p>
                                    <p className={`text-[10px] ${t.textMuted} opacity-70 mt-1.5`}>{formatTimestamp(post.createdAt)}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* TEAM TAB */}
                      {activeTab === 'team' && (
                        <div className="space-y-4 sm:space-y-6">
                          {pendingInvites.length > 0 && (
                            <div className={`bg-[#2A8C8F]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-[#2A8C8F]/30 p-3 sm:p-4`}>
                              <h3 className={`font-semibold ${t.text} mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base`}>
                                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A8C8F]" />
                                Pending Invitations
                              </h3>
                              <div className="space-y-2 sm:space-y-3">
                                {pendingInvites.map(invite => (
                                  <div key={invite.id} className={`flex items-center justify-between gap-2 ${t.taskCard} rounded-lg sm:rounded-xl p-2.5 sm:p-3 border`}>
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#2A8C8F] to-[#1E7275] flex items-center justify-center text-white text-sm sm:text-base font-medium">
                                        {invite.inviterEmail.charAt(0).toUpperCase()}
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <p className={`font-medium ${t.text} text-xs sm:text-sm truncate`}>{invite.inviterEmail}</p>
                                        <p className={`text-[10px] sm:text-xs ${t.textMuted}`}>Wants to add you</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                                      <motion.button onClick={() => handleRespondToInvite(invite.id, 'accepted')} className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border border-emerald-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      </motion.button>
                                      <motion.button onClick={() => handleRespondToInvite(invite.id, 'rejected')} className="p-1.5 sm:p-2 rounded-lg bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 border border-rose-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                      </motion.button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4 md:p-6`}>
                            <h3 className={`font-semibold ${t.text} mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base`}>
                              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A8C8F]" />
                              Find & Invite
                            </h3>
                            <p className={`${t.textMuted} text-xs sm:text-sm mb-3 sm:mb-4`}>Search for users by email to add them to your team.</p>
                            <div className="flex gap-2 sm:gap-3">
                              <div className="flex-1 relative">
                                <Mail className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${t.textMuted}`} />
                                <input type="email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()} placeholder="Search by email..." className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus} focus:ring-1`} />
                              </div>
                              <motion.button onClick={handleSearchUsers} disabled={searching || !searchEmail.trim()} className="px-3 sm:px-4 py-2 bg-[#2A8C8F] text-white rounded-lg sm:rounded-xl disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {searching ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5" />}
                              </motion.button>
                            </div>

                            {searchPerformed && (
                              <div className="mt-3 sm:mt-4">
                                {searchResults.length > 0 ? (
                                  <div className="space-y-2">
                                    {searchResults.map(result => (
                                      <div key={result.id} className={`flex items-center justify-between gap-2 ${t.taskCard} rounded-lg sm:rounded-xl p-2.5 sm:p-3 border`}>
                                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#2A8C8F] to-[#1E7275] flex items-center justify-center text-white text-sm sm:text-base font-medium">
                                            {(result.displayName || result.email).charAt(0).toUpperCase()}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className={`font-medium ${t.text} text-xs sm:text-sm truncate`}>{result.displayName || 'User'}</p>
                                            <p className={`text-[10px] sm:text-xs ${t.textMuted} truncate`}>{result.email}</p>
                                          </div>
                                        </div>
                                        <motion.button onClick={() => handleSendInvite(result)} disabled={inviting === result.id} className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#2A8C8F] text-white rounded-lg text-xs sm:text-sm disabled:opacity-50 flex-shrink-0" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                          {inviting === result.id ? 'Sending...' : 'Invite'}
                                        </motion.button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className={`text-center py-3 sm:py-4 ${t.textMuted} text-xs sm:text-sm`}>
                                    <p>No users found with that email.</p>
                                    <p className={`text-[10px] sm:text-xs mt-1`}>Make sure they have signed up and logged in at least once.</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4 md:p-6`}>
                            <h3 className={`font-semibold ${t.text} mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base`}>
                              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#2A8C8F]" />
                              Your Team
                              <span className={`${t.textMuted} text-xs sm:text-sm font-normal`}>({teamMembers.length + 1})</span>
                            </h3>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                              {/* Current user - always shown first */}
                              {user && (
                                <div className={`flex items-center gap-2 sm:gap-3 ${t.taskCard} rounded-lg sm:rounded-xl p-2.5 sm:p-3 border border-[#2A8C8F]/30 bg-[#2A8C8F]/5`}>
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#2A8C8F] to-[#1E7275] flex items-center justify-center text-white text-sm sm:text-base font-medium ring-2 ring-[#2A8C8F]/50">
                                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium ${t.text} text-xs sm:text-sm truncate flex items-center gap-1`}>
                                      {user.displayName || 'User'}
                                      <span className="text-[#2A8C8F] text-[10px] sm:text-xs">(You)</span>
                                    </p>
                                    <p className={`text-[10px] sm:text-xs ${t.textMuted} truncate`}>{user.email}</p>
                                  </div>
                                </div>
                              )}
                              {/* Other team members */}
                              {teamMembers.map(member => (
                                <div key={member.id} className={`flex items-center gap-2 sm:gap-3 ${t.taskCard} rounded-lg sm:rounded-xl p-2.5 sm:p-3 border`}>
                                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#2A8C8F] to-[#1E7275] flex items-center justify-center text-white text-sm sm:text-base font-medium">
                                    {(member.displayName || member.email).charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className={`font-medium ${t.text} text-xs sm:text-sm truncate`}>{member.displayName || 'User'}</p>
                                    <p className={`text-[10px] sm:text-xs ${t.textMuted} truncate`}>{member.email}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {teamMembers.length === 0 && (
                              <p className={`${t.textMuted} text-center py-4 sm:py-6 text-xs sm:text-sm mt-2`}>Invite teammates using the search above!</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* INBOX TAB */}
                      {activeTab === 'inbox' && (
                        <div className="space-y-4 sm:space-y-6">
                          {selectedSubmission ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                              <button
                                onClick={() => setSelectedSubmission(null)}
                                className={`flex items-center gap-2 mb-4 text-sm ${t.textMuted} hover:${t.text} transition-colors`}
                              >
                                <ChevronLeft className="w-4 h-4" /> Back to inbox
                              </button>
                              <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-4 sm:p-6`}>
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className={`text-lg font-bold ${t.text}`}>{selectedSubmission.fullName}</h3>
                                    <p className={`text-sm ${t.textMuted}`}>{selectedSubmission.email}</p>
                                  </div>
                                  <span className="text-[10px] sm:text-xs px-2 py-1 bg-[#2A8C8F]/20 text-[#2A8C8F] rounded-full">
                                    {selectedSubmission.inquiryType}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                  {selectedSubmission.phone && (
                                    <div>
                                      <p className={`text-xs ${t.textMuted}`}>Phone</p>
                                      <p className={`text-sm ${t.text}`}>{selectedSubmission.phone}</p>
                                    </div>
                                  )}
                                  {selectedSubmission.company && (
                                    <div>
                                      <p className={`text-xs ${t.textMuted}`}>Company</p>
                                      <p className={`text-sm ${t.text}`}>{selectedSubmission.company}</p>
                                    </div>
                                  )}
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-4`}>
                                  <p className={`text-xs ${t.textMuted} mb-1`}>Message</p>
                                  <p className={`text-sm ${t.text} whitespace-pre-wrap leading-relaxed`}>{selectedSubmission.message}</p>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <a
                                    href={`mailto:${selectedSubmission.email}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-xl text-sm font-medium"
                                  >
                                    <Mail className="w-4 h-4" /> Reply via Email
                                  </a>
                                  <button
                                    onClick={async () => {
                                      if (selectedSubmission.id) {
                                        await deleteContactSubmission(selectedSubmission.id);
                                        setSubmissions(prev => prev.filter(s => s.id !== selectedSubmission.id));
                                        setSelectedSubmission(null);
                                      }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ) : submissions.length === 0 ? (
                            <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-8 sm:p-12 text-center`}>
                              <Inbox className={`w-12 h-12 ${t.textMuted} mx-auto mb-3 opacity-40`} />
                              <p className={`${t.textMuted} text-sm`}>No contact submissions yet</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {submissions.map((sub, index) => (
                                <motion.button
                                  key={sub.id}
                                  onClick={async () => {
                                    setSelectedSubmission(sub);
                                    if (sub.id && !sub.read) {
                                      await markSubmissionRead(sub.id);
                                      setSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, read: true } : s));
                                    }
                                  }}
                                  className={`w-full text-left ${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4 hover:border-[#2A8C8F]/40 transition-all ${!sub.read ? 'border-l-4 border-l-[#2A8C8F]' : ''}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      {!sub.read && <div className="w-2 h-2 rounded-full bg-[#2A8C8F]" />}
                                      <span className={`text-sm font-semibold ${t.text}`}>{sub.fullName}</span>
                                    </div>
                                    <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-[#2A8C8F]/15 text-[#2A8C8F] rounded-full">{sub.inquiryType}</span>
                                  </div>
                                  <p className={`text-xs ${t.textMuted} mb-1`}>{sub.email}</p>
                                  <p className={`text-xs ${t.textMuted} line-clamp-1`}>{sub.message}</p>
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* APPLICATIONS TAB */}
                      {activeTab === 'applications' && (
                        <div className="space-y-4 sm:space-y-6">
                          {selectedApplication ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                              <button
                                onClick={() => setSelectedApplication(null)}
                                className={`flex items-center gap-2 mb-4 text-sm ${t.textMuted} hover:${t.text} transition-colors`}
                              >
                                <ChevronLeft className="w-4 h-4" /> Back to applications
                              </button>
                              <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-4 sm:p-6`}>
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className={`text-lg font-bold ${t.text}`}>{selectedApplication.fullName}</h3>
                                    <p className={`text-sm ${t.textMuted}`}>{selectedApplication.email}</p>
                                  </div>
                                  <span className="text-[10px] sm:text-xs px-2 py-1 bg-[#2A8C8F]/20 text-[#2A8C8F] rounded-full">
                                    {selectedApplication.role}
                                  </span>
                                </div>

                                <a
                                  href={selectedApplication.resumeLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#2A8C8F]/10 text-[#2A8C8F] rounded-xl text-sm font-medium mb-4 hover:bg-[#2A8C8F]/20 transition-colors"
                                >
                                  <Briefcase className="w-4 h-4" /> View Resume
                                </a>

                                <p className={`text-xs ${t.textMuted} mb-4`}>
                                  Submitted {formatTimestamp(selectedApplication.createdAt)}
                                </p>

                                <div className="space-y-3">
                                  <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-4`}>
                                    <p className={`text-xs ${t.textMuted} mb-1`}>Tell us about yourself</p>
                                    <p className={`text-sm ${t.text} whitespace-pre-wrap leading-relaxed`}>{selectedApplication.whyPassionate}</p>
                                  </div>
                                  <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-4`}>
                                    <p className={`text-xs ${t.textMuted} mb-1`}>Why Pando Surgical? Why this role?</p>
                                    <p className={`text-sm ${t.text} whitespace-pre-wrap leading-relaxed`}>{selectedApplication.whyPando}</p>
                                  </div>
                                  <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-4`}>
                                    <p className={`text-xs ${t.textMuted} mb-1`}>What skillsets can you bring to this role?</p>
                                    <p className={`text-sm ${t.text} whitespace-pre-wrap leading-relaxed`}>{selectedApplication.skillsets}</p>
                                  </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                  <a
                                    href={`mailto:${selectedApplication.email}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-xl text-sm font-medium"
                                  >
                                    <Mail className="w-4 h-4" /> Reply via Email
                                  </a>
                                  <button
                                    onClick={async () => {
                                      if (selectedApplication.id) {
                                        await deleteInternshipApplication(selectedApplication.id);
                                        setApplications(prev => prev.filter(a => a.id !== selectedApplication.id));
                                        setSelectedApplication(null);
                                      }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ) : applications.length === 0 ? (
                            <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-8 sm:p-12 text-center`}>
                              <Briefcase className={`w-12 h-12 ${t.textMuted} mx-auto mb-3 opacity-40`} />
                              <p className={`${t.textMuted} text-sm`}>No internship applications yet</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {applications.map((app, index) => (
                                <motion.button
                                  key={app.id}
                                  onClick={async () => {
                                    setSelectedApplication(app);
                                    if (app.id && !app.read) {
                                      await markApplicationRead(app.id);
                                      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, read: true } : a));
                                    }
                                  }}
                                  className={`w-full text-left ${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4 hover:border-[#2A8C8F]/40 transition-all ${!app.read ? 'border-l-4 border-l-[#2A8C8F]' : ''}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      {!app.read && <div className="w-2 h-2 rounded-full bg-[#2A8C8F]" />}
                                      <span className={`text-sm font-semibold ${t.text}`}>{app.fullName}</span>
                                    </div>
                                    <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-[#2A8C8F]/15 text-[#2A8C8F] rounded-full">{app.role}</span>
                                  </div>
                                  <p className={`text-xs ${t.textMuted} mb-1`}>{app.email}</p>
                                  <p className={`text-xs ${t.textMuted} line-clamp-1 mb-1`}>{app.whyPassionate}</p>
                                  <p className={`text-[10px] ${t.textMuted} opacity-70`}>{formatTimestamp(app.createdAt)}</p>
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* CLINICIANS TAB */}
                      {activeTab === 'clinicians' && (
                        <div className="space-y-4 sm:space-y-6">
                          {selectedClinicianRequest ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                              <button
                                onClick={() => setSelectedClinicianRequest(null)}
                                className={`flex items-center gap-2 mb-4 text-sm ${t.textMuted} hover:${t.text} transition-colors`}
                              >
                                <ChevronLeft className="w-4 h-4" /> Back to clinicians
                              </button>
                              <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-4 sm:p-6`}>
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className={`text-lg font-bold ${t.text}`}>{selectedClinicianRequest.name}</h3>
                                    <p className={`text-sm ${t.textMuted}`}>{selectedClinicianRequest.email}</p>
                                  </div>
                                  <span className="text-[10px] sm:text-xs px-2 py-1 bg-[#2A8C8F]/20 text-[#2A8C8F] rounded-full">
                                    {selectedClinicianRequest.hospital}
                                  </span>
                                </div>
                                {selectedClinicianRequest.phone && (
                                  <div className="mb-4">
                                    <p className={`text-xs ${t.textMuted}`}>Phone</p>
                                    <p className={`text-sm ${t.text}`}>{selectedClinicianRequest.phone}</p>
                                  </div>
                                )}
                                {selectedClinicianRequest.notes && (
                                  <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-4`}>
                                    <p className={`text-xs ${t.textMuted} mb-1`}>Notes</p>
                                    <p className={`text-sm ${t.text} whitespace-pre-wrap leading-relaxed`}>{selectedClinicianRequest.notes}</p>
                                  </div>
                                )}
                                <div className="flex gap-2 mt-4">
                                  <a
                                    href={`mailto:${selectedClinicianRequest.email}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-xl text-sm font-medium"
                                  >
                                    <Mail className="w-4 h-4" /> Reply via Email
                                  </a>
                                  <button
                                    onClick={async () => {
                                      if (selectedClinicianRequest.id) {
                                        await deleteClinicianRequest(selectedClinicianRequest.id);
                                        setClinicianRequests(prev => prev.filter(c => c.id !== selectedClinicianRequest.id));
                                        setSelectedClinicianRequest(null);
                                      }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ) : clinicianRequests.length === 0 ? (
                            <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-8 sm:p-12 text-center`}>
                              <Stethoscope className={`w-12 h-12 ${t.textMuted} mx-auto mb-3 opacity-40`} />
                              <p className={`${t.textMuted} text-sm`}>No clinician requests yet</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {clinicianRequests.map((req, index) => (
                                <motion.button
                                  key={req.id}
                                  onClick={async () => {
                                    setSelectedClinicianRequest(req);
                                    if (req.id && !req.read) {
                                      await markClinicianRequestRead(req.id);
                                      setClinicianRequests(prev => prev.map(c => c.id === req.id ? { ...c, read: true } : c));
                                    }
                                  }}
                                  className={`w-full text-left ${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4 hover:border-[#2A8C8F]/40 transition-all ${!req.read ? 'border-l-4 border-l-[#2A8C8F]' : ''}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      {!req.read && <div className="w-2 h-2 rounded-full bg-[#2A8C8F]" />}
                                      <span className={`text-sm font-semibold ${t.text}`}>{req.name}</span>
                                    </div>
                                    <span className="text-[10px] sm:text-xs px-2 py-0.5 bg-[#2A8C8F]/15 text-[#2A8C8F] rounded-full">{req.hospital}</span>
                                  </div>
                                  <p className={`text-xs ${t.textMuted} mb-1`}>{req.email}</p>
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* NEWSLETTER TAB */}
                      {activeTab === 'newsletter' && (
                        <div className="space-y-4 sm:space-y-6">
                          {selectedNewsletterSignup ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                              <button
                                onClick={() => setSelectedNewsletterSignup(null)}
                                className={`flex items-center gap-2 mb-4 text-sm ${t.textMuted} hover:${t.text} transition-colors`}
                              >
                                <ChevronLeft className="w-4 h-4" /> Back to newsletter
                              </button>
                              <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-4 sm:p-6`}>
                                <div className="flex items-start justify-between mb-4">
                                  <div>
                                    <h3 className={`text-lg font-bold ${t.text}`}>{selectedNewsletterSignup.name}</h3>
                                    <p className={`text-sm ${t.textMuted}`}>{selectedNewsletterSignup.email}</p>
                                  </div>
                                </div>
                                <div className={`${theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'} rounded-xl p-4`}>
                                  <p className={`text-xs ${t.textMuted} mb-2`}>Interested in</p>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedNewsletterSignup.interests.length === 0 ? (
                                      <span className={`text-sm ${t.text}`}>None specified</span>
                                    ) : (
                                      selectedNewsletterSignup.interests.map((interest) => (
                                        <span key={interest} className="text-xs px-2 py-1 bg-[#2A8C8F]/15 text-[#2A8C8F] rounded-full">
                                          {interest}
                                        </span>
                                      ))
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <a
                                    href={`mailto:${selectedNewsletterSignup.email}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-xl text-sm font-medium"
                                  >
                                    <Mail className="w-4 h-4" /> Reply via Email
                                  </a>
                                  <button
                                    onClick={async () => {
                                      if (selectedNewsletterSignup.id) {
                                        await deleteNewsletterSignup(selectedNewsletterSignup.id);
                                        setNewsletterSignups(prev => prev.filter(n => n.id !== selectedNewsletterSignup.id));
                                        setSelectedNewsletterSignup(null);
                                      }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-sm font-medium hover:bg-red-500/20 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" /> Delete
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          ) : newsletterSignups.length === 0 ? (
                            <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-8 sm:p-12 text-center`}>
                              <Send className={`w-12 h-12 ${t.textMuted} mx-auto mb-3 opacity-40`} />
                              <p className={`${t.textMuted} text-sm`}>No newsletter signups yet</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {newsletterSignups.map((signup, index) => (
                                <motion.button
                                  key={signup.id}
                                  onClick={async () => {
                                    setSelectedNewsletterSignup(signup);
                                    if (signup.id && !signup.read) {
                                      await markNewsletterSignupRead(signup.id);
                                      setNewsletterSignups(prev => prev.map(n => n.id === signup.id ? { ...n, read: true } : n));
                                    }
                                  }}
                                  className={`w-full text-left ${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4 hover:border-[#2A8C8F]/40 transition-all ${!signup.read ? 'border-l-4 border-l-[#2A8C8F]' : ''}`}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                      {!signup.read && <div className="w-2 h-2 rounded-full bg-[#2A8C8F]" />}
                                      <span className={`text-sm font-semibold ${t.text}`}>{signup.name}</span>
                                    </div>
                                  </div>
                                  <p className={`text-xs ${t.textMuted} mb-1`}>{signup.email}</p>
                                  <p className={`text-xs ${t.textMuted} line-clamp-1`}>{signup.interests.join(', ') || 'No interests specified'}</p>
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* SETTINGS TAB */}
                      {activeTab === 'settings' && (
                        <div className="max-w-2xl space-y-4 sm:space-y-6">
                          <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-4 sm:p-6`}>
                            <h3 className={`font-semibold ${t.text} mb-3 sm:mb-4 text-sm sm:text-base`}>Appearance</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div>
                                <p className={`${t.text} text-xs sm:text-sm font-medium`}>Theme</p>
                                <p className={`${t.textMuted} text-[10px] sm:text-xs`}>Choose between light and dark mode</p>
                              </div>
                              <motion.button onClick={toggleTheme} className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl ${t.card} border w-full sm:w-auto`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {theme === 'light' ? <><Sun className="w-4 h-4 text-amber-500" /><span className={`text-xs sm:text-sm ${t.text}`}>Light</span></> : <><Moon className="w-4 h-4 text-blue-400" /><span className={`text-xs sm:text-sm ${t.text}`}>Dark</span></>}
                              </motion.button>
                            </div>
                          </div>

                          <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-4 sm:p-6`}>
                            <h3 className={`font-semibold ${t.text} mb-3 sm:mb-4 text-sm sm:text-base`}>Account</h3>
                            <div className="space-y-3 sm:space-y-4">
                              <div>
                                <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Display Name</label>
                                <input type="text" value={user?.displayName || ''} disabled className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl`} />
                              </div>
                              <div>
                                <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Email</label>
                                <input type="email" value={user?.email || ''} disabled className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl`} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Modals */}
          <AnimatePresence>
            {showContactModal && (
              <Modal theme={theme} t={t} onClose={() => setShowContactModal(false)}>
                <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-3 sm:mb-4`}>New Contact</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Name</label>
                    <input type="text" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} placeholder="Full name" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Email <span className="text-[10px] sm:text-xs opacity-60">(opt)</span></label>
                      <input type="email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                    </div>
                    <div>
                      <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Phone <span className="text-[10px] sm:text-xs opacity-60">(opt)</span></label>
                      <input type="tel" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>How We Know Them</label>
                    <input type="text" value={newContact.howWeKnowThem} onChange={(e) => setNewContact({ ...newContact, howWeKnowThem: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} placeholder="e.g. Met at MFC Awards Night" />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Last Contacted <span className="text-[10px] sm:text-xs opacity-60">(opt)</span></label>
                    <input type="date" value={newContact.lastContacted} onChange={(e) => setNewContact({ ...newContact, lastContacted: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <button onClick={() => setShowContactModal(false)} className={`flex-1 py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Cancel</button>
                  <motion.button onClick={handleAddContact} disabled={savingContact || !newContact.name.trim() || !newContact.howWeKnowThem.trim()} className="flex-1 py-2 sm:py-2.5 text-sm bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-lg sm:rounded-xl font-medium disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{savingContact ? 'Saving...' : 'Add Contact'}</motion.button>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          {/* Edit Contact Modal */}
          <AnimatePresence>
            {editingContact && (
              <Modal theme={theme} t={t} onClose={() => setEditingContact(null)}>
                <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-3 sm:mb-4`}>Edit Contact</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Name</label>
                    <input type="text" value={editingContact.name} onChange={(e) => setEditingContact({ ...editingContact, name: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Email</label>
                      <input type="email" value={editingContact.email || ''} onChange={(e) => setEditingContact({ ...editingContact, email: e.target.value })} className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                    </div>
                    <div>
                      <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Phone</label>
                      <input type="tel" value={editingContact.phone || ''} onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })} className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>How We Know Them</label>
                    <input type="text" value={editingContact.howWeKnowThem} onChange={(e) => setEditingContact({ ...editingContact, howWeKnowThem: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Last Contacted</label>
                    <input type="date" value={editingContact.lastContacted || ''} onChange={(e) => setEditingContact({ ...editingContact, lastContacted: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <button onClick={() => setEditingContact(null)} className={`flex-1 py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Cancel</button>
                  <motion.button onClick={handleEditContact} disabled={savingContact} className="flex-1 py-2 sm:py-2.5 text-sm bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-lg sm:rounded-xl font-medium disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>{savingContact ? 'Saving...' : 'Save Changes'}</motion.button>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteContactConfirm && (
              <Modal theme={theme} t={t} onClose={() => setShowDeleteContactConfirm(null)}>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-2`}>Delete Contact?</h3>
                  <p className={`${t.textMuted} text-sm mb-4 sm:mb-6`}>This cannot be undone.</p>
                  <div className="flex gap-2 sm:gap-3">
                    <button onClick={() => setShowDeleteContactConfirm(null)} className={`flex-1 py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Cancel</button>
                    <motion.button onClick={() => handleDeleteContact(showDeleteContactConfirm)} className="flex-1 py-2 sm:py-2.5 text-sm bg-rose-500 text-white rounded-lg sm:rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Delete</motion.button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showNewsModal && (
              <Modal theme={theme} t={t} onClose={() => setShowNewsModal(false)}>
                <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-3 sm:mb-4`}>New Post</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Headline</label>
                    <input type="text" value={newNewsPost.headline} onChange={(e) => setNewNewsPost({ ...newNewsPost, headline: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} placeholder="Headline" />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Description</label>
                    <textarea value={newNewsPost.body} onChange={(e) => setNewNewsPost({ ...newNewsPost, body: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus} resize-none`} rows={4} placeholder="What happened?" />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Photo</label>
                    {newNewsPost.photoPreview ? (
                      <div className="relative">
                        <img src={newNewsPost.photoPreview} alt="" className="w-full h-40 object-cover rounded-lg sm:rounded-xl" />
                        <button type="button" onClick={() => handleNewsPhotoChange(null)} className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <label className={`flex flex-col items-center justify-center gap-2 py-6 rounded-lg sm:rounded-xl border border-dashed ${t.taskCard} cursor-pointer`}>
                        <ImageIcon className={`w-6 h-6 ${t.textMuted}`} />
                        <span className={`text-xs sm:text-sm ${t.textMuted}`}>Click to upload a photo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleNewsPhotoChange(e.target.files?.[0] || null)} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <button onClick={() => setShowNewsModal(false)} className={`flex-1 py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Cancel</button>
                  <motion.button onClick={handleAddNewsPost} disabled={savingNews || !newNewsPost.headline.trim() || !newNewsPost.body.trim() || !newNewsPost.photoFile} className="flex-1 py-2 sm:py-2.5 text-sm bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-lg sm:rounded-xl font-medium disabled:opacity-50 flex items-center justify-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    {savingNews ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {savingNews ? 'Publishing...' : 'Publish'}
                  </motion.button>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteNewsConfirm && (
              <Modal theme={theme} t={t} onClose={() => setShowDeleteNewsConfirm(null)}>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-2`}>Delete Post?</h3>
                  <p className={`${t.textMuted} text-sm mb-4 sm:mb-6`}>This will remove it from the public site.</p>
                  <div className="flex gap-2 sm:gap-3">
                    <button onClick={() => setShowDeleteNewsConfirm(null)} className={`flex-1 py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Cancel</button>
                    <motion.button onClick={() => handleDeleteNewsPost(showDeleteNewsConfirm)} className="flex-1 py-2 sm:py-2.5 text-sm bg-rose-500 text-white rounded-lg sm:rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Delete</motion.button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

function Modal({ children, onClose, theme, t }: { children: React.ReactNode; onClose: () => void; theme: 'light' | 'dark'; t: typeof themes.light }) {
  return (
    <>
      <motion.div className={`fixed inset-0 ${theme === 'light' ? 'bg-black/30' : 'bg-black/60'} backdrop-blur-sm z-[60]`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div 
          className={`${t.modalBg} backdrop-blur-2xl rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 w-full sm:max-w-md border ${t.modalBorder} max-h-[85vh] sm:max-h-[90vh] overflow-y-auto`} 
          initial={{ scale: 0.95, y: 100 }} 
          animate={{ scale: 1, y: 0 }} 
          exit={{ scale: 0.95, y: 100 }} 
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </>
  );
}
