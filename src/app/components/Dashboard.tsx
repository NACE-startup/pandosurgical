import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Users,
  Settings,
  LogOut,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Mail,
  Search,
  Share2,
  CheckCircle,
  XCircle,
  Bell,
  Loader2,
  Sparkles,
  Zap,
  Sun,
  Moon,
  Check,
  ListTodo,
  Lock,
  Globe,
  Menu
} from 'lucide-react';
import { 
  logOut, 
  User,
  searchUsersByEmail,
  addEvent as addEventToDb,
  getEventsForUser,
  deleteEvent as deleteEventFromDb,
  updateEventSharing,
  addTask as addTaskToDb,
  getTasksForUser,
  updateTask as updateTaskInDb,
  deleteTask as deleteTaskFromDb,
  sendTeamInvite,
  getTeamMembers,
  getPendingInvites,
  respondToInvite,
  FirestoreEvent,
  FirestoreTask
} from '@/lib/firebase';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'meeting' | 'interview' | 'deadline' | 'other';
  description?: string;
  createdBy: string;
  createdByEmail: string;
  sharedWith: string[];
  assignees?: string[];
  visibility: 'private' | 'team';
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  createdBy: string;
  assignees?: string[];
  visibility: 'private' | 'team';
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

// Calendar item type for unified display
interface CalendarItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'meeting' | 'interview' | 'deadline' | 'other' | 'task';
  isTask?: boolean;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'in_progress' | 'done';
  createdBy: string;
  assignees?: string[];
  visibility: 'private' | 'team';
}

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
    inputFocus: 'focus:border-[#D4A24A] focus:ring-[#D4A24A]/20',
    text: 'text-slate-900',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-500',
    headerBg: 'bg-white/60',
    headerBorder: 'border-slate-200',
    navActive: 'bg-[#D4A24A]/10 border-[#D4A24A]/30',
    navInactive: 'hover:bg-slate-100 border-transparent',
    navIconBg: 'bg-slate-100',
    navIconBgActive: 'bg-[#D4A24A]/20',
    userCard: 'bg-slate-100',
    statusBorder: 'border-white',
    modalBg: 'bg-white/95',
    modalBorder: 'border-slate-200',
    cancelBtn: 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200',
    taskCard: 'bg-slate-50 border-slate-200',
    glowOpacity: '0.1',
    checkboxBg: 'bg-slate-100 border-slate-300',
    checkboxChecked: 'bg-[#D4A24A] border-[#D4A24A]',
  },
  dark: {
    backdrop: 'bg-black/60',
    panel: 'bg-slate-900/80',
    sidebar: 'bg-black/40',
    sidebarBorder: 'border-white/10',
    card: 'bg-white/5 border-white/10',
    cardHover: 'hover:bg-white/10',
    input: 'bg-black/30 border-white/10 text-white placeholder-gray-400',
    inputFocus: 'focus:border-[#D4A24A]/50 focus:ring-[#D4A24A]/50',
    text: 'text-white',
    textSecondary: 'text-gray-200',
    textMuted: 'text-gray-300',
    headerBg: 'bg-black/20',
    headerBorder: 'border-white/10',
    navActive: 'bg-gradient-to-r from-[#D4A24A]/20 to-[#D4A24A]/5 border-[#D4A24A]/30',
    navInactive: 'hover:bg-white/5 border-transparent',
    navIconBg: 'bg-white/10',
    navIconBgActive: 'bg-[#D4A24A]/20',
    userCard: 'bg-white/10',
    statusBorder: 'border-slate-900',
    modalBg: 'bg-slate-900/95',
    modalBorder: 'border-white/10',
    cancelBtn: 'bg-white/10 border-white/10 text-gray-300 hover:bg-white/15',
    taskCard: 'bg-black/30 border-white/10',
    glowOpacity: '0.2',
    checkboxBg: 'bg-white/10 border-white/30',
    checkboxChecked: 'bg-[#D4A24A] border-[#D4A24A]',
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

  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'team' | 'settings'>('schedule');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<{ title: string; date: string; time: string; type: 'meeting' | 'interview' | 'deadline' | 'other'; description: string; assignees: string[]; visibility: 'private' | 'team' }>({ title: '', date: '', time: '', type: 'meeting', description: '', assignees: [], visibility: 'private' });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<{ title: string; description: string; dueDate: string; priority: 'low' | 'medium' | 'high'; status: 'todo' | 'in_progress' | 'done'; assignees: string[]; visibility: 'private' | 'team' }>({ title: '', description: '', dueDate: '', priority: 'medium', status: 'todo', assignees: [], visibility: 'private' });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);

  const [shareSearchEmail, setShareSearchEmail] = useState('');
  const [shareSearchResults, setShareSearchResults] = useState<TeamMember[]>([]);

  // Get all selectable team members (including current user)
  const selectableMembers: TeamMember[] = user ? [
    { id: user.uid, email: user.email || '', displayName: user.displayName || 'You' },
    ...teamMembers.filter(m => m.id !== user.uid)
  ] : [];

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
      // First get team members and invites
      const [membersData, invitesData] = await Promise.all([
        getTeamMembers(user.uid),
        getPendingInvites(user.uid)
      ]);
      const members = membersData as TeamMember[];
      setTeamMembers(members);
      setPendingInvites(invitesData as Invite[]);
      
      // Get team member IDs for visibility filtering
      const teamMemberIds = members.map(m => m.id);
      
      // Now get events and tasks with team visibility
      const [eventsData, tasksData] = await Promise.all([
        getEventsForUser(user.uid, teamMemberIds),
        getTasksForUser(user.uid, teamMemberIds)
      ]);
      setEvents(eventsData as Event[]);
      setTasks(tasksData as Task[]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const handleLogout = async () => { await logOut(); onClose(); };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
    return days;
  };

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  // Get calendar items for a date (events + tasks with due dates)
  const getCalendarItemsForDate = (date: Date): CalendarItem[] => {
    const dateStr = formatDate(date);
    const eventItems: CalendarItem[] = events
      .filter(e => e.date === dateStr)
      .map(e => ({ ...e, isTask: false }));
    
    const taskItems: CalendarItem[] = tasks
      .filter(t => t.dueDate === dateStr)
      .map(t => ({
        id: t.id,
        title: t.title,
        date: t.dueDate!,
        type: 'task' as const,
        isTask: true,
        priority: t.priority,
        status: t.status,
        createdBy: t.createdBy,
        assignees: t.assignees,
        visibility: t.visibility
      }));
    
    return [...eventItems, ...taskItems];
  };

  // Check if date has any items
  const getItemCountForDate = (date: Date) => getCalendarItemsForDate(date).length;

  const handleAddEvent = async () => {
    if (!user || !newEvent.title || !newEvent.date) return;
    const eventData: Omit<FirestoreEvent, 'id' | 'createdAt'> = {
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type,
      description: newEvent.description,
      createdBy: user.uid,
      createdByEmail: user.email || '',
      sharedWith: [],
      assignees: newEvent.assignees,
      visibility: newEvent.visibility
    };
    const eventId = await addEventToDb(eventData);
    if (eventId) {
      setEvents([...events, { id: eventId, ...eventData }]);
      console.log('Event added successfully:', eventId);
    } else {
      console.error('Failed to save event to database');
      alert('Failed to save event. Please check your connection and try again.');
    }
    setNewEvent({ title: '', date: '', time: '', type: 'meeting', description: '', assignees: [], visibility: 'private' });
    setShowEventModal(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (await deleteEventFromDb(id)) setEvents(events.filter(e => e.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleAddTask = async () => {
    if (!user || !newTask.title) return;
    const taskData: Omit<FirestoreTask, 'id' | 'createdAt'> = {
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      status: newTask.status,
      createdBy: user.uid,
      assignees: newTask.assignees,
      visibility: newTask.visibility
    };
    const taskId = await addTaskToDb(taskData);
    if (taskId) {
      setTasks([...tasks, { id: taskId, ...taskData }]);
      console.log('Task added successfully:', taskId);
    } else {
      console.error('Failed to save task to database');
      alert('Failed to save task. Please check your connection and try again.');
    }
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'todo', assignees: [], visibility: 'private' });
    setShowTaskModal(false);
  };

  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    if (await updateTaskInDb(taskId, { status })) setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleDeleteTask = async (id: string) => {
    if (await deleteTaskFromDb(id)) setTasks(tasks.filter(t => t.id !== id));
    setShowDeleteTaskConfirm(null);
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

  const handleShareSearch = async () => {
    if (!shareSearchEmail.trim()) return;
    const results = await searchUsersByEmail(shareSearchEmail.toLowerCase());
    setShareSearchResults((results as TeamMember[]).filter((r: any) => r.id !== user?.uid));
  };

  const handleShareWithUser = async (eventId: string, userId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const newSharedWith = [...(event.sharedWith || []), userId];
    if (await updateEventSharing(eventId, newSharedWith)) setEvents(events.map(e => e.id === eventId ? { ...e, sharedWith: newSharedWith } : e));
  };

  const handleRemoveShare = async (eventId: string, userId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const newSharedWith = (event.sharedWith || []).filter(id => id !== userId);
    if (await updateEventSharing(eventId, newSharedWith)) setEvents(events.map(e => e.id === eventId ? { ...e, sharedWith: newSharedWith } : e));
  };

  const toggleAssignee = (assignees: string[], setAssignees: (a: string[]) => void, memberId: string) => {
    if (assignees.includes(memberId)) {
      setAssignees(assignees.filter(id => id !== memberId));
    } else {
      setAssignees([...assignees, memberId]);
    }
  };

  const getMemberName = (memberId: string) => {
    if (memberId === user?.uid) return 'You';
    const member = teamMembers.find(m => m.id === memberId);
    return member?.displayName || member?.email?.split('@')[0] || 'Unknown';
  };

  const eventTypeColors = { meeting: 'from-blue-500 to-cyan-400', interview: 'from-emerald-500 to-teal-400', deadline: 'from-rose-500 to-pink-400', other: 'from-slate-500 to-gray-400', task: 'from-purple-500 to-violet-400' };
  const eventTypeBgLight = { meeting: 'bg-blue-50 border-blue-200', interview: 'bg-emerald-50 border-emerald-200', deadline: 'bg-rose-50 border-rose-200', other: 'bg-slate-50 border-slate-200', task: 'bg-purple-50 border-purple-200' };
  const eventTypeBgDark = { meeting: 'bg-blue-500/20 border-blue-500/30', interview: 'bg-emerald-500/20 border-emerald-500/30', deadline: 'bg-rose-500/20 border-rose-500/30', other: 'bg-slate-500/20 border-slate-500/30', task: 'bg-purple-500/20 border-purple-500/30' };
  const eventTypeBg = theme === 'light' ? eventTypeBgLight : eventTypeBgDark;
  
  const priorityColorsLight = { low: 'bg-emerald-100 text-emerald-700 border-emerald-200', medium: 'bg-amber-100 text-amber-700 border-amber-200', high: 'bg-rose-100 text-rose-700 border-rose-200' };
  const priorityColorsDark = { low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30', high: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
  const priorityColors = theme === 'light' ? priorityColorsLight : priorityColorsDark;
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
              <div className={`absolute -top-40 -left-40 w-80 h-80 bg-[#D4A24A] rounded-full blur-[100px] pointer-events-none hidden sm:block`} style={{ opacity: t.glowOpacity }} />
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
                        <div className="absolute inset-0 bg-gradient-to-br from-[#D4A24A] to-[#B8883D] rounded-xl blur-lg opacity-50" />
                        <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center shadow-lg">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <span className={`${t.text} font-bold text-lg`}>Pando</span>
                        <span className="text-[#D4A24A] font-light text-lg ml-1">Portal</span>
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
                    { id: 'schedule', icon: Calendar, label: 'Schedule', desc: 'Calendar & tasks' },
                    { id: 'tasks', icon: Zap, label: 'Tasks', desc: 'Track progress' },
                    { id: 'team', icon: Users, label: 'Team', desc: 'Manage members', badge: pendingInvites.length },
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
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#D4A24A] to-[#B8883D] rounded-full"
                          layoutId="activeTab"
                        />
                      )}
                      <div className={`p-2 rounded-lg ${activeTab === item.id ? t.navIconBgActive : `${t.navIconBg} group-hover:bg-[#D4A24A]/10`}`}>
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#D4A24A]' : `${t.textMuted} group-hover:text-[#D4A24A]`}`} />
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
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white font-semibold">
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
                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#D4A24A]/20 text-[#D4A24A] rounded-full font-normal">Live</span>
                      </h1>
                      <p className={`${t.textMuted} text-xs sm:text-sm hidden sm:block`}>
                        {activeTab === 'schedule' && 'Events & task deadlines'}
                        {activeTab === 'tasks' && 'Track your progress'}
                        {activeTab === 'team' && 'Manage team members'}
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
                        <Loader2 className="w-10 h-10 animate-spin text-[#D4A24A] mx-auto mb-4" />
                        <p className={t.textMuted}>Loading your data...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* SCHEDULE TAB */}
                      {activeTab === 'schedule' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                          {/* Calendar */}
                          <div className={`lg:col-span-2 ${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4 md:p-6`}>
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                              <h2 className={`text-base sm:text-lg font-semibold ${t.text}`}>
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                              </h2>
                              <div className="flex items-center gap-1 sm:gap-2">
                                <motion.button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className={`p-1.5 sm:p-2 rounded-lg ${t.card} border`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <ChevronLeft className={`w-4 h-4 ${t.textMuted}`} />
                                </motion.button>
                                <motion.button onClick={() => setCurrentMonth(new Date())} className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-[#D4A24A] hover:bg-[#D4A24A]/10 rounded-lg border border-[#D4A24A]/30" whileHover={{ scale: 1.02 }}>Today</motion.button>
                                <motion.button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className={`p-1.5 sm:p-2 rounded-lg ${t.card} border`} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <ChevronRight className={`w-4 h-4 ${t.textMuted}`} />
                                </motion.button>
                              </div>
                            </div>

                            <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                <div key={i} className={`text-center text-[10px] sm:text-xs font-medium ${t.textMuted} py-1 sm:py-2`}>
                                  <span className="sm:hidden">{day}</span>
                                  <span className="hidden sm:inline">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</span>
                                </div>
                              ))}
                              {getDaysInMonth(currentMonth).map((day, index) => {
                                const isToday = day && formatDate(day) === formatDate(new Date());
                                const isSelected = day && selectedDate && formatDate(day) === formatDate(selectedDate);
                                const dayItems = day ? getCalendarItemsForDate(day) : [];
                                
                                return (
                                  <motion.button
                                    key={index}
                                    onClick={() => day && setSelectedDate(day)}
                                    className={`aspect-square p-0.5 sm:p-1 rounded-lg sm:rounded-xl text-xs sm:text-sm relative transition-all ${
                                      !day ? 'invisible' :
                                      isSelected ? 'bg-gradient-to-br from-[#D4A24A] to-[#B8883D] text-white shadow-lg shadow-[#D4A24A]/30' :
                                      isToday ? 'bg-[#D4A24A]/20 text-[#D4A24A] border border-[#D4A24A]/30' :
                                      `${t.cardHover} ${t.textSecondary} border border-transparent hover:border-slate-200`
                                    }`}
                                    whileHover={day ? { scale: 1.1 } : {}}
                                    whileTap={day ? { scale: 0.95 } : {}}
                                  >
                                    {day?.getDate()}
                                    {dayItems.length > 0 && (
                                      <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                        {dayItems.slice(0, 3).map((item, i) => (
                                          <div key={i} className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-gradient-to-r ${eventTypeColors[item.type]}`} />
                                        ))}
                                      </div>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                            
                            {/* Legend */}
                            <div className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t ${t.sidebarBorder} flex flex-wrap gap-2 sm:gap-3`}>
                              {[
                                { type: 'meeting', label: 'Meeting' },
                                { type: 'interview', label: 'Interview' },
                                { type: 'deadline', label: 'Deadline' },
                                { type: 'task', label: 'Task' },
                              ].map(item => (
                                <div key={item.type} className="flex items-center gap-1 sm:gap-1.5">
                                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${eventTypeColors[item.type as keyof typeof eventTypeColors]}`} />
                                  <span className={`text-[10px] sm:text-xs ${t.textMuted}`}>{item.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Events Sidebar */}
                          <div className="space-y-3 sm:space-y-4">
                            <motion.button
                              onClick={() => { setShowEventModal(true); if (selectedDate) setNewEvent(prev => ({ ...prev, date: formatDate(selectedDate) })); }}
                              className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl font-medium shadow-lg shadow-[#D4A24A]/30 border border-[#D4A24A]/50 text-sm sm:text-base"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                              New Event
                            </motion.button>

                            <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4`}>
                              <h3 className={`font-semibold ${t.text} mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base`}>
                                <Calendar className="w-4 h-4 text-[#D4A24A]" />
                                {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Select a date'}
                              </h3>
                              
                              {selectedDate && getCalendarItemsForDate(selectedDate).length > 0 ? (
                                <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                                  {getCalendarItemsForDate(selectedDate).map(item => (
                                    <motion.div key={item.id} className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border ${eventTypeBg[item.type]} group`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                      <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                            {item.isTask && <ListTodo className="w-3 h-3 text-purple-500 flex-shrink-0" />}
                                            <p className={`font-medium ${t.text} text-xs sm:text-sm truncate`}>{item.title}</p>
                                            {item.visibility === 'team' ? <Globe className={`w-3 h-3 ${t.textMuted} flex-shrink-0`} /> : <Lock className={`w-3 h-3 ${t.textMuted} flex-shrink-0`} />}
                                          </div>
                                          {item.time ? (
                                            <p className={`text-[10px] sm:text-xs ${t.textMuted} flex items-center gap-1 mt-1`}>
                                              <Clock className="w-3 h-3" />{item.time}
                                            </p>
                                          ) : !item.isTask && (
                                            <p className={`text-[10px] sm:text-xs ${t.textMuted} mt-1`}>All day</p>
                                          )}
                                          {item.isTask && item.priority && (
                                            <span className={`inline-block mt-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border ${priorityColors[item.priority]}`}>{item.priority}</span>
                                          )}
                                          {item.assignees && item.assignees.length > 0 && (
                                            <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
                                              <Users className={`w-3 h-3 ${t.textMuted} flex-shrink-0`} />
                                              <span className={`text-[10px] sm:text-xs ${t.textMuted} truncate`}>
                                                {item.assignees.map(id => getMemberName(id)).join(', ')}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        {!item.isTask && item.createdBy === user?.uid && (
                                          <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                                            <button onClick={() => setShowShareModal(item.id)} className="p-1 sm:p-1.5 rounded-lg bg-blue-500/20 text-blue-500 hover:bg-blue-500/30">
                                              <Share2 className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => setShowDeleteConfirm(item.id)} className="p-1 sm:p-1.5 rounded-lg bg-rose-500/20 text-rose-500 hover:bg-rose-500/30">
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <p className={`${t.textMuted} text-xs sm:text-sm text-center py-6 sm:py-8`}>
                                  {selectedDate ? 'No events or tasks' : 'Select a date'}
                                </p>
                              )}
                            </div>

                            <div className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4`}>
                              <h3 className={`font-semibold ${t.text} mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base`}>
                                <Zap className="w-4 h-4 text-[#D4A24A]" />
                                Upcoming
                              </h3>
                              <div className="space-y-1.5 sm:space-y-2 max-h-40 sm:max-h-48 overflow-y-auto">
                                {[
                                  ...events.filter(e => new Date(e.date) >= new Date()).map(e => ({ ...e, isTask: false, sortDate: e.date })),
                                  ...tasks.filter(t => t.dueDate && new Date(t.dueDate) >= new Date()).map(t => ({ id: t.id, title: t.title, date: t.dueDate!, type: 'task' as const, isTask: true, sortDate: t.dueDate! }))
                                ].sort((a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime()).slice(0, 5).map(item => (
                                  <div key={item.id} className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg ${t.cardHover} transition-colors`}>
                                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r flex-shrink-0 ${eventTypeColors[item.type as keyof typeof eventTypeColors]}`} />
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-xs sm:text-sm font-medium ${t.textSecondary} truncate`}>{item.title}</p>
                                      <p className={`text-[10px] sm:text-xs ${t.textMuted}`}>{item.date}</p>
                                    </div>
                                    {item.isTask && <ListTodo className="w-3 h-3 text-purple-500 flex-shrink-0" />}
                                  </div>
                                ))}
                                {events.filter(e => new Date(e.date) >= new Date()).length === 0 && tasks.filter(t => t.dueDate && new Date(t.dueDate) >= new Date()).length === 0 && (
                                  <p className={`${t.textMuted} text-xs sm:text-sm text-center py-3 sm:py-4`}>Nothing upcoming</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TASKS TAB */}
                      {activeTab === 'tasks' && (
                        <div className="space-y-4 sm:space-y-6">
                          <motion.button onClick={() => setShowTaskModal(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl font-medium shadow-lg shadow-[#D4A24A]/30 border border-[#D4A24A]/50 text-sm sm:text-base" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            New Task
                          </motion.button>

                          {/* Mobile: Horizontal scroll tabs */}
                          <div className="flex gap-2 overflow-x-auto pb-2 md:hidden -mx-3 px-3">
                            {(['todo', 'in_progress', 'done'] as const).map(status => (
                              <button
                                key={status}
                                onClick={() => {
                                  const el = document.getElementById(`task-col-${status}`);
                                  el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                                }}
                                className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg border ${t.card} text-sm`}
                              >
                                <div className={`w-2 h-2 rounded-full ${status === 'todo' ? 'bg-gray-400' : status === 'in_progress' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                <span className={t.textSecondary}>
                                  {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
                                </span>
                                <span className={`${t.textMuted} text-xs`}>({tasks.filter(t => t.status === status).length})</span>
                              </button>
                            ))}
                          </div>

                          {/* Desktop: Grid layout */}
                          <div className="hidden md:grid md:grid-cols-3 gap-4 lg:gap-6">
                            {(['todo', 'in_progress', 'done'] as const).map(status => (
                              <div key={status} id={`task-col-${status}`} className={`${t.card} backdrop-blur-xl rounded-xl sm:rounded-2xl border p-3 sm:p-4`}>
                                <h3 className={`font-semibold ${t.text} mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base`}>
                                  <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${status === 'todo' ? 'bg-gray-400' : status === 'in_progress' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                  {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
                                  <span className={`${t.textMuted} text-xs sm:text-sm font-normal`}>({tasks.filter(t => t.status === status).length})</span>
                                </h3>
                                <div className="space-y-2 sm:space-y-3 max-h-[60vh] overflow-y-auto">
                                  {tasks.filter(t => t.status === status).map(task => (
                                    <TaskCard key={task.id} task={task} priorityColors={priorityColors} theme={theme} t={t} getMemberName={getMemberName} onStatusChange={handleUpdateTaskStatus} onDelete={() => setShowDeleteTaskConfirm(task.id)} />
                                  ))}
                                  {tasks.filter(t => t.status === status).length === 0 && (
                                    <p className={`${t.textMuted} text-xs sm:text-sm text-center py-6 sm:py-8`}>No tasks</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Mobile: Stacked columns */}
                          <div className="md:hidden space-y-4">
                            {(['todo', 'in_progress', 'done'] as const).map(status => (
                              <div key={status} id={`task-col-${status}`} className={`${t.card} backdrop-blur-xl rounded-xl border p-3`}>
                                <h3 className={`font-semibold ${t.text} mb-3 flex items-center gap-2 text-sm`}>
                                  <div className={`w-2.5 h-2.5 rounded-full ${status === 'todo' ? 'bg-gray-400' : status === 'in_progress' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                  {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
                                  <span className={`${t.textMuted} text-xs font-normal`}>({tasks.filter(t => t.status === status).length})</span>
                                </h3>
                                <div className="space-y-2">
                                  {tasks.filter(t => t.status === status).map(task => (
                                    <TaskCard key={task.id} task={task} priorityColors={priorityColors} theme={theme} t={t} getMemberName={getMemberName} onStatusChange={handleUpdateTaskStatus} onDelete={() => setShowDeleteTaskConfirm(task.id)} />
                                  ))}
                                  {tasks.filter(t => t.status === status).length === 0 && (
                                    <p className={`${t.textMuted} text-xs text-center py-4`}>No tasks</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TEAM TAB */}
                      {activeTab === 'team' && (
                        <div className="space-y-4 sm:space-y-6">
                          {pendingInvites.length > 0 && (
                            <div className={`bg-[#D4A24A]/10 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-[#D4A24A]/30 p-3 sm:p-4`}>
                              <h3 className={`font-semibold ${t.text} mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base`}>
                                <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A24A]" />
                                Pending Invitations
                              </h3>
                              <div className="space-y-2 sm:space-y-3">
                                {pendingInvites.map(invite => (
                                  <div key={invite.id} className={`flex items-center justify-between gap-2 ${t.taskCard} rounded-lg sm:rounded-xl p-2.5 sm:p-3 border`}>
                                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                      <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white text-sm sm:text-base font-medium">
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
                              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A24A]" />
                              Find & Invite
                            </h3>
                            <p className={`${t.textMuted} text-xs sm:text-sm mb-3 sm:mb-4`}>Search for users by email to add them to your team.</p>
                            <div className="flex gap-2 sm:gap-3">
                              <div className="flex-1 relative">
                                <Mail className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${t.textMuted}`} />
                                <input type="email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()} placeholder="Search by email..." className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus} focus:ring-1`} />
                              </div>
                              <motion.button onClick={handleSearchUsers} disabled={searching || !searchEmail.trim()} className="px-3 sm:px-4 py-2 bg-[#D4A24A] text-white rounded-lg sm:rounded-xl disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                                          <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white text-sm sm:text-base font-medium">
                                            {(result.displayName || result.email).charAt(0).toUpperCase()}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <p className={`font-medium ${t.text} text-xs sm:text-sm truncate`}>{result.displayName || 'User'}</p>
                                            <p className={`text-[10px] sm:text-xs ${t.textMuted} truncate`}>{result.email}</p>
                                          </div>
                                        </div>
                                        <motion.button onClick={() => handleSendInvite(result)} disabled={inviting === result.id} className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-[#D4A24A] text-white rounded-lg text-xs sm:text-sm disabled:opacity-50 flex-shrink-0" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#D4A24A]" />
                              Your Team
                              <span className={`${t.textMuted} text-xs sm:text-sm font-normal`}>({teamMembers.length})</span>
                            </h3>
                            
                            {teamMembers.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                {teamMembers.map(member => (
                                  <div key={member.id} className={`flex items-center gap-2 sm:gap-3 ${t.taskCard} rounded-lg sm:rounded-xl p-2.5 sm:p-3 border`}>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white text-sm sm:text-base font-medium">
                                      {(member.displayName || member.email).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`font-medium ${t.text} text-xs sm:text-sm truncate`}>{member.displayName || 'User'}</p>
                                      <p className={`text-[10px] sm:text-xs ${t.textMuted} truncate`}>{member.email}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className={`${t.textMuted} text-center py-6 sm:py-8 text-xs sm:text-sm`}>No team members yet. Search and invite users above!</p>
                            )}
                          </div>
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
            {showEventModal && (
              <Modal theme={theme} t={t} onClose={() => setShowEventModal(false)}>
                <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-3 sm:mb-4`}>New Event</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Title</label>
                    <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} placeholder="Event title" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Date</label>
                      <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                    </div>
                    <div>
                      <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Time <span className="text-[10px] sm:text-xs opacity-60">(opt)</span></label>
                      <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Type</label>
                    <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`}>
                      <option value="meeting">Meeting</option>
                      <option value="interview">Interview</option>
                      <option value="deadline">Deadline</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Visibility</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setNewEvent({ ...newEvent, visibility: 'private' })} className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border transition-all ${newEvent.visibility === 'private' ? 'bg-[#D4A24A]/20 border-[#D4A24A]/50 text-[#D4A24A]' : `${t.taskCard} ${t.textMuted}`}`}>
                        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Private</span>
                      </button>
                      <button type="button" onClick={() => setNewEvent({ ...newEvent, visibility: 'team' })} className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border transition-all ${newEvent.visibility === 'team' ? 'bg-[#D4A24A]/20 border-[#D4A24A]/50 text-[#D4A24A]' : `${t.taskCard} ${t.textMuted}`}`}>
                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Team</span>
                      </button>
                    </div>
                    <p className={`text-[10px] sm:text-xs ${t.textMuted} mt-1`}>{newEvent.visibility === 'private' ? 'Only you and participants can see this' : 'All team members can see this'}</p>
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Participants</label>
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${t.taskCard} border space-y-1.5 sm:space-y-2 max-h-28 sm:max-h-32 overflow-y-auto`}>
                      {selectableMembers.length > 0 ? selectableMembers.map(member => (
                        <label key={member.id} className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg ${t.cardHover} cursor-pointer`}>
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center border transition-all ${newEvent.assignees.includes(member.id) ? t.checkboxChecked : t.checkboxBg}`}>
                            {newEvent.assignees.includes(member.id) && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
                          </div>
                          <input type="checkbox" checked={newEvent.assignees.includes(member.id)} onChange={() => toggleAssignee(newEvent.assignees, (a) => setNewEvent({ ...newEvent, assignees: a }), member.id)} className="hidden" />
                          <span className={`text-xs sm:text-sm ${t.text} truncate`}>{member.id === user?.uid ? 'You' : member.displayName || member.email}</span>
                        </label>
                      )) : <p className={`text-xs sm:text-sm ${t.textMuted} text-center py-2`}>Add team members first</p>}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Description</label>
                    <textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus} resize-none`} rows={2} placeholder="Optional" />
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <button onClick={() => setShowEventModal(false)} className={`flex-1 py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Cancel</button>
                  <motion.button onClick={handleAddEvent} className="flex-1 py-2 sm:py-2.5 text-sm bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-lg sm:rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Create Event</motion.button>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTaskModal && (
              <Modal theme={theme} t={t} onClose={() => setShowTaskModal(false)}>
                <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-3 sm:mb-4`}>New Task</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Title</label>
                    <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} placeholder="Task title" />
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Description</label>
                    <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus} resize-none`} rows={2} placeholder="Optional" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Due Date</label>
                      <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                    </div>
                    <div>
                      <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Priority</label>
                      <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })} className={`w-full px-2 sm:px-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Visibility</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setNewTask({ ...newTask, visibility: 'private' })} className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border transition-all ${newTask.visibility === 'private' ? 'bg-[#D4A24A]/20 border-[#D4A24A]/50 text-[#D4A24A]' : `${t.taskCard} ${t.textMuted}`}`}>
                        <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Private</span>
                      </button>
                      <button type="button" onClick={() => setNewTask({ ...newTask, visibility: 'team' })} className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border transition-all ${newTask.visibility === 'team' ? 'bg-[#D4A24A]/20 border-[#D4A24A]/50 text-[#D4A24A]' : `${t.taskCard} ${t.textMuted}`}`}>
                        <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Team</span>
                      </button>
                    </div>
                    <p className={`text-[10px] sm:text-xs ${t.textMuted} mt-1`}>{newTask.visibility === 'private' ? 'Only you and assignees can see this' : 'All team members can see this'}</p>
                  </div>
                  <div>
                    <label className={`block text-xs sm:text-sm ${t.textMuted} mb-1`}>Assign To</label>
                    <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${t.taskCard} border space-y-1.5 sm:space-y-2 max-h-28 sm:max-h-32 overflow-y-auto`}>
                      {selectableMembers.length > 0 ? selectableMembers.map(member => (
                        <label key={member.id} className={`flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg ${t.cardHover} cursor-pointer`}>
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center border transition-all ${newTask.assignees.includes(member.id) ? t.checkboxChecked : t.checkboxBg}`}>
                            {newTask.assignees.includes(member.id) && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />}
                          </div>
                          <input type="checkbox" checked={newTask.assignees.includes(member.id)} onChange={() => toggleAssignee(newTask.assignees, (a) => setNewTask({ ...newTask, assignees: a }), member.id)} className="hidden" />
                          <span className={`text-xs sm:text-sm ${t.text} truncate`}>{member.id === user?.uid ? 'You' : member.displayName || member.email}</span>
                        </label>
                      )) : <p className={`text-xs sm:text-sm ${t.textMuted} text-center py-2`}>Add team members first</p>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <button onClick={() => setShowTaskModal(false)} className={`flex-1 py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Cancel</button>
                  <motion.button onClick={handleAddTask} className="flex-1 py-2 sm:py-2.5 text-sm bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-lg sm:rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Create Task</motion.button>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteConfirm && (
              <Modal theme={theme} t={t} onClose={() => setShowDeleteConfirm(null)}>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-2`}>Delete Event?</h3>
                  <p className={`${t.textMuted} text-sm mb-4 sm:mb-6`}>This will remove the event for everyone.</p>
                  <div className="flex gap-2 sm:gap-3">
                    <button onClick={() => setShowDeleteConfirm(null)} className={`flex-1 py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Cancel</button>
                    <motion.button onClick={() => handleDeleteEvent(showDeleteConfirm)} className="flex-1 py-2 sm:py-2.5 text-sm bg-rose-500 text-white rounded-lg sm:rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Delete</motion.button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteTaskConfirm && (
              <Modal theme={theme} t={t} onClose={() => setShowDeleteTaskConfirm(null)}>
                <div className="text-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-rose-500" />
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-2`}>Delete Task?</h3>
                  <p className={`${t.textMuted} text-sm mb-4 sm:mb-6`}>This cannot be undone.</p>
                  <div className="flex gap-2 sm:gap-3">
                    <button onClick={() => setShowDeleteTaskConfirm(null)} className={`flex-1 py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Cancel</button>
                    <motion.button onClick={() => handleDeleteTask(showDeleteTaskConfirm)} className="flex-1 py-2 sm:py-2.5 text-sm bg-rose-500 text-white rounded-lg sm:rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Delete</motion.button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showShareModal && (
              <Modal theme={theme} t={t} onClose={() => { setShowShareModal(null); setShareSearchResults([]); setShareSearchEmail(''); }}>
                <h3 className={`text-lg sm:text-xl font-bold ${t.text} mb-3 sm:mb-4`}>Share Event</h3>
                <p className={`${t.textMuted} text-xs sm:text-sm mb-3 sm:mb-4`}>Search for users to share this event with.</p>
                
                <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex-1 relative">
                    <Mail className={`absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${t.textMuted}`} />
                    <input type="email" value={shareSearchEmail} onChange={(e) => setShareSearchEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleShareSearch()} placeholder="Search by email..." className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm ${t.input} border rounded-lg sm:rounded-xl focus:outline-none ${t.inputFocus}`} />
                  </div>
                  <button onClick={handleShareSearch} className="px-3 sm:px-4 py-2 bg-[#D4A24A] text-white rounded-lg sm:rounded-xl">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {shareSearchResults.length > 0 && (
                  <div className="space-y-2 mb-3 sm:mb-4">
                    {shareSearchResults.map(result => {
                      const event = events.find(e => e.id === showShareModal);
                      const isShared = event?.sharedWith?.includes(result.id);
                      return (
                        <div key={result.id} className={`flex items-center justify-between gap-2 ${t.taskCard} rounded-lg sm:rounded-xl p-2.5 sm:p-3 border`}>
                          <span className={`text-xs sm:text-sm ${t.textSecondary} truncate`}>{result.email}</span>
                          {isShared ? (
                            <button onClick={() => handleRemoveShare(showShareModal, result.id)} className="px-2 sm:px-3 py-1 bg-rose-500/20 text-rose-500 rounded-lg text-xs sm:text-sm border border-rose-500/30 flex-shrink-0">Remove</button>
                          ) : (
                            <button onClick={() => handleShareWithUser(showShareModal, result.id)} className="px-2 sm:px-3 py-1 bg-[#D4A24A] text-white rounded-lg text-xs sm:text-sm flex-shrink-0">Share</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <button onClick={() => { setShowShareModal(null); setShareSearchResults([]); setShareSearchEmail(''); }} className={`w-full py-2 sm:py-2.5 text-sm ${t.cancelBtn} border rounded-lg sm:rounded-xl`}>Done</button>
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

function TaskCard({ task, priorityColors, theme, t, getMemberName, onStatusChange, onDelete }: { task: Task; priorityColors: Record<string, string>; theme: 'light' | 'dark'; t: typeof themes.light; getMemberName: (id: string) => string; onStatusChange: (id: string, status: Task['status']) => void; onDelete: () => void }) {
  return (
    <motion.div className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl ${t.taskCard} border group`} layout whileHover={{ scale: 1.02 }}>
      <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <p className={`font-medium ${t.text} text-xs sm:text-sm truncate`}>{task.title}</p>
          {task.visibility === 'team' ? <Globe className={`w-3 h-3 ${t.textMuted} flex-shrink-0`} /> : <Lock className={`w-3 h-3 ${t.textMuted} flex-shrink-0`} />}
        </div>
        <button onClick={onDelete} className="p-1 rounded-lg opacity-100 sm:opacity-0 group-hover:opacity-100 bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 transition-all flex-shrink-0">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {task.description && <p className={`text-[10px] sm:text-xs ${t.textMuted} mb-1.5 sm:mb-2 line-clamp-2`}>{task.description}</p>}
      <div className="flex items-center justify-between flex-wrap gap-1">
        <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>{task.priority}</span>
        {task.dueDate && <span className={`text-[10px] sm:text-xs ${t.textMuted}`}>{task.dueDate}</span>}
      </div>
      {task.assignees && task.assignees.length > 0 && (
        <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
          <Users className={`w-3 h-3 ${t.textMuted} flex-shrink-0`} />
          <span className={`text-[10px] sm:text-xs ${t.textMuted} truncate`}>
            {task.assignees.map(id => getMemberName(id)).join(', ')}
          </span>
        </div>
      )}
      <div className="mt-2 sm:mt-3 flex gap-1">
        {task.status !== 'todo' && <button onClick={() => onStatusChange(task.id, 'todo')} className={`flex-1 text-[10px] sm:text-xs py-1 sm:py-1.5 rounded-lg ${theme === 'light' ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border border-gray-500/30'}`}>To Do</button>}
        {task.status !== 'in_progress' && <button onClick={() => onStatusChange(task.id, 'in_progress')} className={`flex-1 text-[10px] sm:text-xs py-1 sm:py-1.5 rounded-lg ${theme === 'light' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200' : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30'}`}>In Progress</button>}
        {task.status !== 'done' && <button onClick={() => onStatusChange(task.id, 'done')} className={`flex-1 text-[10px] sm:text-xs py-1 sm:py-1.5 rounded-lg ${theme === 'light' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'}`}>Done</button>}
      </div>
    </motion.div>
  );
}
