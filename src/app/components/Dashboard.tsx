import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Users,
  FileText,
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
  Zap
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
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
  createdBy: string;
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

export function Dashboard({ isOpen, onClose, user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'team' | 'settings'>('schedule');
  const [loading, setLoading] = useState(true);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', type: 'meeting' as const, description: '' });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', priority: 'medium' as const, status: 'todo' as const });

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [searching, setSearching] = useState(false);
  const [inviting, setInviting] = useState<string | null>(null);

  const [shareSearchEmail, setShareSearchEmail] = useState('');
  const [shareSearchResults, setShareSearchResults] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (isOpen && user) loadAllData();
  }, [isOpen, user]);

  const loadAllData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [eventsData, tasksData, membersData, invitesData] = await Promise.all([
        getEventsForUser(user.uid),
        getTasksForUser(user.uid),
        getTeamMembers(user.uid),
        getPendingInvites(user.uid)
      ]);
      setEvents(eventsData as Event[]);
      setTasks(tasksData as Task[]);
      setTeamMembers(membersData as TeamMember[]);
      setPendingInvites(invitesData as Invite[]);
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
  const getEventsForDate = (date: Date) => events.filter(e => e.date === formatDate(date));

  const handleAddEvent = async () => {
    if (!user || !newEvent.title || !newEvent.date || !newEvent.time) return;
    const eventData: Omit<FirestoreEvent, 'id' | 'createdAt'> = {
      ...newEvent, createdBy: user.uid, createdByEmail: user.email || '', sharedWith: []
    };
    const eventId = await addEventToDb(eventData);
    if (eventId) setEvents([...events, { id: eventId, ...eventData }]);
    setNewEvent({ title: '', date: '', time: '', type: 'meeting', description: '' });
    setShowEventModal(false);
  };

  const handleDeleteEvent = async (id: string) => {
    if (await deleteEventFromDb(id)) setEvents(events.filter(e => e.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleAddTask = async () => {
    if (!user || !newTask.title) return;
    const taskData: Omit<FirestoreTask, 'id' | 'createdAt'> = { ...newTask, createdBy: user.uid };
    const taskId = await addTaskToDb(taskData);
    if (taskId) setTasks([...tasks, { id: taskId, ...taskData }]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'todo' });
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
    try {
      const results = await searchUsersByEmail(searchEmail.toLowerCase());
      setSearchResults((results as TeamMember[]).filter((r: any) => r.id !== user.uid && !teamMembers.find(m => m.id === r.id)));
    } catch (error) { console.error('Search error:', error); }
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

  const eventTypeColors = { meeting: 'from-blue-500 to-cyan-400', interview: 'from-emerald-500 to-teal-400', deadline: 'from-rose-500 to-pink-400', other: 'from-slate-500 to-gray-400' };
  const eventTypeBg = { meeting: 'bg-blue-500/20 border-blue-500/30', interview: 'bg-emerald-500/20 border-emerald-500/30', deadline: 'bg-rose-500/20 border-rose-500/30', other: 'bg-slate-500/20 border-slate-500/30' };
  const priorityColors = { low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30', high: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with grid pattern */}
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(212,162,74,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,162,74,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
          </motion.div>

          {/* Dashboard Panel */}
          <motion.div
            className="fixed inset-2 sm:inset-4 md:inset-8 lg:inset-12 z-50 flex"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full bg-slate-900/80 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
              {/* Ambient glow effects */}
              <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#D4A24A]/20 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

              {/* Sidebar */}
              <div className="w-16 sm:w-72 bg-black/40 backdrop-blur-xl flex flex-col border-r border-white/5">
                {/* Logo */}
                <div className="p-4 sm:p-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#D4A24A] to-[#B8883D] rounded-xl blur-lg opacity-50" />
                      <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-white font-bold text-lg">Pando</span>
                      <span className="text-[#D4A24A] font-light text-lg ml-1">Portal</span>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 sm:p-4 space-y-2">
                  {[
                    { id: 'schedule', icon: Calendar, label: 'Schedule', desc: 'Team calendar' },
                    { id: 'tasks', icon: Zap, label: 'Tasks', desc: 'Track progress' },
                    { id: 'team', icon: Users, label: 'Team', desc: 'Manage members', badge: pendingInvites.length },
                    { id: 'settings', icon: Settings, label: 'Settings', desc: 'Preferences' },
                  ].map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative group ${
                        activeTab === item.id
                          ? 'bg-gradient-to-r from-[#D4A24A]/20 to-[#D4A24A]/5 border border-[#D4A24A]/30'
                          : 'hover:bg-white/5 border border-transparent'
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
                      <div className={`p-2 rounded-lg ${activeTab === item.id ? 'bg-[#D4A24A]/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                        <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#D4A24A]' : 'text-gray-400 group-hover:text-white'}`} />
                      </div>
                      <div className="hidden sm:block flex-1 text-left">
                        <span className={`block text-sm font-medium ${activeTab === item.id ? 'text-white' : 'text-gray-300'}`}>{item.label}</span>
                        <span className="block text-xs text-gray-500">{item.desc}</span>
                      </div>
                      {item.badge && item.badge > 0 && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 sm:relative sm:right-0 sm:top-0 sm:translate-y-0 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                          {item.badge}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </nav>

                {/* User Section */}
                <div className="p-2 sm:p-4 border-t border-white/5">
                  <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white font-semibold">
                        {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                    </div>
                    <div className="hidden sm:block flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user?.displayName || 'User'}</p>
                      <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center sm:justify-start gap-3 px-3 py-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                    whileHover={{ x: 4 }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:block text-sm">Sign Out</span>
                  </motion.button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/5 bg-black/20">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                      <span className="text-xs px-2 py-1 bg-[#D4A24A]/20 text-[#D4A24A] rounded-full font-normal">Live</span>
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {activeTab === 'schedule' && 'Synced with your team'}
                      {activeTab === 'tasks' && 'Track your progress'}
                      {activeTab === 'team' && 'Manage team members'}
                      {activeTab === 'settings' && 'Configure preferences'}
                    </p>
                  </div>
                  <motion.button 
                    onClick={onClose} 
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                <div className="flex-1 overflow-auto p-4 sm:p-6">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <Loader2 className="w-10 h-10 animate-spin text-[#D4A24A] mx-auto mb-4" />
                        <p className="text-gray-500">Loading your data...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* SCHEDULE TAB */}
                      {activeTab === 'schedule' && (
                        <div className="grid lg:grid-cols-3 gap-6">
                          {/* Calendar */}
                          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-lg font-semibold text-white">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                              </h2>
                              <div className="flex items-center gap-2">
                                <motion.button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <ChevronLeft className="w-4 h-4 text-gray-400" />
                                </motion.button>
                                <motion.button onClick={() => setCurrentMonth(new Date())} className="px-3 py-1.5 text-sm text-[#D4A24A] hover:bg-[#D4A24A]/10 rounded-lg border border-[#D4A24A]/30" whileHover={{ scale: 1.02 }}>Today</motion.button>
                                <motion.button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                </motion.button>
                              </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">{day}</div>
                              ))}
                              {getDaysInMonth(currentMonth).map((day, index) => {
                                const isToday = day && formatDate(day) === formatDate(new Date());
                                const isSelected = day && selectedDate && formatDate(day) === formatDate(selectedDate);
                                const dayEvents = day ? getEventsForDate(day) : [];
                                
                                return (
                                  <motion.button
                                    key={index}
                                    onClick={() => day && setSelectedDate(day)}
                                    className={`aspect-square p-1 rounded-xl text-sm relative transition-all ${
                                      !day ? 'invisible' :
                                      isSelected ? 'bg-gradient-to-br from-[#D4A24A] to-[#B8883D] text-white shadow-lg shadow-[#D4A24A]/30' :
                                      isToday ? 'bg-[#D4A24A]/20 text-[#D4A24A] border border-[#D4A24A]/30' :
                                      'hover:bg-white/10 text-gray-300 border border-transparent hover:border-white/10'
                                    }`}
                                    whileHover={day ? { scale: 1.1 } : {}}
                                    whileTap={day ? { scale: 0.95 } : {}}
                                  >
                                    {day?.getDate()}
                                    {dayEvents.length > 0 && (
                                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                        {dayEvents.slice(0, 3).map((event, i) => (
                                          <div key={i} className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${eventTypeColors[event.type]}`} />
                                        ))}
                                      </div>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Events Sidebar */}
                          <div className="space-y-4">
                            <motion.button
                              onClick={() => { setShowEventModal(true); if (selectedDate) setNewEvent(prev => ({ ...prev, date: formatDate(selectedDate) })); }}
                              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl font-medium shadow-lg shadow-[#D4A24A]/30 border border-[#D4A24A]/50"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Plus className="w-5 h-5" />
                              New Event
                            </motion.button>

                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-[#D4A24A]" />
                                {selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Select a date'}
                              </h3>
                              
                              {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                                <div className="space-y-3">
                                  {getEventsForDate(selectedDate).map(event => (
                                    <motion.div key={event.id} className={`p-3 rounded-xl border ${eventTypeBg[event.type]} group`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <p className="font-medium text-white text-sm">{event.title}</p>
                                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                            <Clock className="w-3 h-3" />{event.time}
                                          </p>
                                          {event.createdBy !== user?.uid && (
                                            <p className="text-xs text-[#D4A24A] mt-1">Shared by {event.createdByEmail}</p>
                                          )}
                                        </div>
                                        {event.createdBy === user?.uid && (
                                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button onClick={() => setShowShareModal(event.id)} className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                                              <Share2 className="w-3 h-3" />
                                            </button>
                                            <button onClick={() => setShowDeleteConfirm(event.id)} className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30">
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm text-center py-8">
                                  {selectedDate ? 'No events' : 'Select a date'}
                                </p>
                              )}
                            </div>

                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[#D4A24A]" />
                                Upcoming
                              </h3>
                              <div className="space-y-2">
                                {events.filter(e => new Date(e.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).map(event => (
                                  <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${eventTypeColors[event.type]}`} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-200 truncate">{event.title}</p>
                                      <p className="text-xs text-gray-500">{event.date}</p>
                                    </div>
                                  </div>
                                ))}
                                {events.filter(e => new Date(e.date) >= new Date()).length === 0 && (
                                  <p className="text-gray-500 text-sm text-center py-4">No upcoming events</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TASKS TAB */}
                      {activeTab === 'tasks' && (
                        <div className="space-y-6">
                          <motion.button onClick={() => setShowTaskModal(true)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl font-medium shadow-lg shadow-[#D4A24A]/30 border border-[#D4A24A]/50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Plus className="w-5 h-5" />
                            New Task
                          </motion.button>

                          <div className="grid md:grid-cols-3 gap-6">
                            {(['todo', 'in_progress', 'done'] as const).map(status => (
                              <div key={status} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${status === 'todo' ? 'bg-gray-500' : status === 'in_progress' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                                  {status === 'todo' ? 'To Do' : status === 'in_progress' ? 'In Progress' : 'Done'}
                                  <span className="text-gray-500 text-sm font-normal">({tasks.filter(t => t.status === status).length})</span>
                                </h3>
                                <div className="space-y-3">
                                  {tasks.filter(t => t.status === status).map(task => (
                                    <TaskCard key={task.id} task={task} priorityColors={priorityColors} onStatusChange={handleUpdateTaskStatus} onDelete={() => setShowDeleteTaskConfirm(task.id)} />
                                  ))}
                                  {tasks.filter(t => t.status === status).length === 0 && (
                                    <p className="text-gray-500 text-sm text-center py-8">No tasks</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* TEAM TAB */}
                      {activeTab === 'team' && (
                        <div className="space-y-6">
                          {pendingInvites.length > 0 && (
                            <div className="bg-[#D4A24A]/10 backdrop-blur-xl rounded-2xl border border-[#D4A24A]/30 p-4">
                              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-[#D4A24A]" />
                                Pending Invitations
                              </h3>
                              <div className="space-y-3">
                                {pendingInvites.map(invite => (
                                  <div key={invite.id} className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white font-medium">
                                        {invite.inviterEmail.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="font-medium text-white text-sm">{invite.inviterEmail}</p>
                                        <p className="text-xs text-gray-500">Wants to add you</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <motion.button onClick={() => handleRespondToInvite(invite.id, 'accepted')} className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <CheckCircle className="w-4 h-4" />
                                      </motion.button>
                                      <motion.button onClick={() => handleRespondToInvite(invite.id, 'rejected')} className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <XCircle className="w-4 h-4" />
                                      </motion.button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                              <UserPlus className="w-5 h-5 text-[#D4A24A]" />
                              Find & Invite
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">Search for users by email to add them to your team.</p>
                            <div className="flex gap-3">
                              <div className="flex-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input type="email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()} placeholder="Search by email..." className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A24A]/50 focus:ring-1 focus:ring-[#D4A24A]/50" />
                              </div>
                              <motion.button onClick={handleSearchUsers} disabled={searching || !searchEmail.trim()} className="px-4 py-2 bg-[#D4A24A] text-white rounded-xl disabled:opacity-50" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                              </motion.button>
                            </div>

                            {searchResults.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {searchResults.map(result => (
                                  <div key={result.id} className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-white/5">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white font-medium">
                                        {(result.displayName || result.email).charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="font-medium text-white text-sm">{result.displayName || 'User'}</p>
                                        <p className="text-xs text-gray-500">{result.email}</p>
                                      </div>
                                    </div>
                                    <motion.button onClick={() => handleSendInvite(result)} disabled={inviting === result.id} className="px-3 py-1.5 bg-[#D4A24A] text-white rounded-lg text-sm disabled:opacity-50" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      {inviting === result.id ? 'Sending...' : 'Invite'}
                                    </motion.button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                              <Users className="w-5 h-5 text-[#D4A24A]" />
                              Your Team
                              <span className="text-gray-500 text-sm font-normal">({teamMembers.length})</span>
                            </h3>
                            
                            {teamMembers.length > 0 ? (
                              <div className="grid sm:grid-cols-2 gap-3">
                                {teamMembers.map(member => (
                                  <div key={member.id} className="flex items-center gap-3 bg-black/20 rounded-xl p-3 border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white font-medium">
                                      {(member.displayName || member.email).charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-white text-sm truncate">{member.displayName || 'User'}</p>
                                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-8">No team members yet. Search and invite users above!</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* SETTINGS TAB */}
                      {activeTab === 'settings' && (
                        <div className="max-w-2xl space-y-6">
                          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                            <h3 className="font-semibold text-white mb-4">Account</h3>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm text-gray-400 mb-1">Display Name</label>
                                <input type="text" value={user?.displayName || ''} disabled className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-gray-400" />
                              </div>
                              <div>
                                <label className="block text-sm text-gray-400 mb-1">Email</label>
                                <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-gray-400" />
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
              <Modal onClose={() => setShowEventModal(false)}>
                <h3 className="text-xl font-bold text-white mb-4">New Event</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                    <input type="text" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A24A]/50" placeholder="Event title" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Date</label>
                      <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4A24A]/50" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Time</label>
                      <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4A24A]/50" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                    <select value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as any })} className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4A24A]/50">
                      <option value="meeting">Meeting</option>
                      <option value="interview">Interview</option>
                      <option value="deadline">Deadline</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea value={newEvent.description} onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })} className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A24A]/50 resize-none" rows={3} placeholder="Optional" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowEventModal(false)} className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10">Cancel</button>
                  <motion.button onClick={handleAddEvent} className="flex-1 py-2.5 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Create Event</motion.button>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showTaskModal && (
              <Modal onClose={() => setShowTaskModal(false)}>
                <h3 className="text-xl font-bold text-white mb-4">New Task</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Title</label>
                    <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A24A]/50" placeholder="Task title" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A24A]/50 resize-none" rows={2} placeholder="Optional" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Due Date</label>
                      <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4A24A]/50" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Priority</label>
                      <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })} className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#D4A24A]/50">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowTaskModal(false)} className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10">Cancel</button>
                  <motion.button onClick={handleAddTask} className="flex-1 py-2.5 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Create Task</motion.button>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteConfirm && (
              <Modal onClose={() => setShowDeleteConfirm(null)}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Delete Event?</h3>
                  <p className="text-gray-400 mb-6">This will remove the event for everyone.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10">Cancel</button>
                    <motion.button onClick={() => handleDeleteEvent(showDeleteConfirm)} className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Delete</motion.button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showDeleteTaskConfirm && (
              <Modal onClose={() => setShowDeleteTaskConfirm(null)}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-rose-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Delete Task?</h3>
                  <p className="text-gray-400 mb-6">This cannot be undone.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowDeleteTaskConfirm(null)} className="flex-1 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10">Cancel</button>
                    <motion.button onClick={() => handleDeleteTask(showDeleteTaskConfirm)} className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Delete</motion.button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showShareModal && (
              <Modal onClose={() => { setShowShareModal(null); setShareSearchResults([]); setShareSearchEmail(''); }}>
                <h3 className="text-xl font-bold text-white mb-4">Share Event</h3>
                <p className="text-gray-400 text-sm mb-4">Search for users to share this event with.</p>
                
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input type="email" value={shareSearchEmail} onChange={(e) => setShareSearchEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleShareSearch()} placeholder="Search by email..." className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#D4A24A]/50" />
                  </div>
                  <button onClick={handleShareSearch} className="px-4 py-2 bg-[#D4A24A] text-white rounded-xl">
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                {shareSearchResults.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {shareSearchResults.map(result => {
                      const event = events.find(e => e.id === showShareModal);
                      const isShared = event?.sharedWith?.includes(result.id);
                      return (
                        <div key={result.id} className="flex items-center justify-between bg-black/20 rounded-xl p-3 border border-white/5">
                          <span className="text-sm text-gray-300">{result.email}</span>
                          {isShared ? (
                            <button onClick={() => handleRemoveShare(showShareModal, result.id)} className="px-3 py-1 bg-rose-500/20 text-rose-400 rounded-lg text-sm border border-rose-500/30">Remove</button>
                          ) : (
                            <button onClick={() => handleShareWithUser(showShareModal, result.id)} className="px-3 py-1 bg-[#D4A24A] text-white rounded-lg text-sm">Share</button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                <button onClick={() => { setShowShareModal(null); setShareSearchResults([]); setShareSearchEmail(''); }} className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:bg-white/10">Done</button>
              </Modal>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div className="fixed inset-0 z-[60] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 w-full max-w-md border border-white/10" initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()}>
          {children}
        </motion.div>
      </motion.div>
    </>
  );
}

function TaskCard({ task, priorityColors, onStatusChange, onDelete }: { task: Task; priorityColors: Record<string, string>; onStatusChange: (id: string, status: Task['status']) => void; onDelete: () => void }) {
  return (
    <motion.div className="p-3 rounded-xl bg-black/20 border border-white/5 group" layout whileHover={{ scale: 1.02 }}>
      <div className="flex items-start justify-between mb-2">
        <p className="font-medium text-white text-sm">{task.title}</p>
        <button onClick={onDelete} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {task.description && <p className="text-xs text-gray-500 mb-2">{task.description}</p>}
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}>{task.priority}</span>
        {task.dueDate && <span className="text-xs text-gray-500">{task.dueDate}</span>}
      </div>
      <div className="mt-3 flex gap-1">
        {task.status !== 'todo' && <button onClick={() => onStatusChange(task.id, 'todo')} className="flex-1 text-xs py-1.5 rounded-lg bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border border-gray-500/30">To Do</button>}
        {task.status !== 'in_progress' && <button onClick={() => onStatusChange(task.id, 'in_progress')} className="flex-1 text-xs py-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/30">In Progress</button>}
        {task.status !== 'done' && <button onClick={() => onStatusChange(task.id, 'done')} className="flex-1 text-xs py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30">Done</button>}
      </div>
    </motion.div>
  );
}
