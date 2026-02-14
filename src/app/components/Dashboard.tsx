import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Edit2, 
  Check,
  Users,
  FileText,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  UserPlus,
  Mail,
  AlertTriangle,
  Share2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { 
  logOut, 
  User,
  addEvent,
  getEventsForUser,
  deleteEvent,
  updateEventSharing,
  addTask,
  getTasksForUser,
  updateTask,
  deleteTask,
  searchUsersByEmail,
  sendTeamInvite,
  getTeamMembers,
  getPendingInvites,
  respondToInvite,
  FirestoreEvent,
  FirestoreTask,
  TeamInvite
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
  displayName: string;
  photoURL?: string;
}

interface Invite {
  id: string;
  inviterId: string;
  inviterEmail: string;
  inviteeId: string;
  inviteeEmail: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export function Dashboard({ isOpen, onClose, user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'team' | 'settings'>('schedule');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: '',
    time: '',
    type: 'meeting',
    description: ''
  });
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState<string | null>(null);
  
  // Team search
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<TeamMember[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [inviteSending, setInviteSending] = useState(false);
  
  // Share search
  const [shareSearchEmail, setShareSearchEmail] = useState('');
  const [shareSearchResults, setShareSearchResults] = useState<TeamMember[]>([]);

  // Load data on mount
  useEffect(() => {
    if (user && isOpen) {
      loadData();
    }
  }, [user, isOpen]);

  const loadData = async () => {
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

  const handleLogout = async () => {
    await logOut();
    onClose();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const handleAddEvent = async () => {
    if (!user || !newEvent.title || !newEvent.date || !newEvent.time) return;
    
    const eventData: Omit<FirestoreEvent, 'id' | 'createdAt'> = {
      title: newEvent.title,
      date: newEvent.date,
      time: newEvent.time,
      type: newEvent.type as Event['type'],
      description: newEvent.description,
      createdBy: user.uid,
      createdByEmail: user.email || '',
      sharedWith: []
    };
    
    const eventId = await addEvent(eventData);
    if (eventId) {
      const event: Event = { id: eventId, ...eventData };
      setEvents([...events, event]);
    }
    
    setNewEvent({ title: '', date: '', time: '', type: 'meeting', description: '' });
    setShowEventModal(false);
  };

  const handleDeleteEvent = async (id: string) => {
    const success = await deleteEvent(id);
    if (success) {
      setEvents(events.filter(e => e.id !== id));
    }
    setShowDeleteConfirm(null);
  };

  // Tasks
  const handleAddTask = async () => {
    if (!user || !newTask.title) return;
    
    const taskData: Omit<FirestoreTask, 'id' | 'createdAt'> = {
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority as Task['priority'],
      status: newTask.status as Task['status'],
      createdBy: user.uid
    };
    
    const taskId = await addTask(taskData);
    if (taskId) {
      const task: Task = { id: taskId, ...taskData };
      setTasks([...tasks, task]);
    }
    
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'todo' });
    setShowTaskModal(false);
  };

  const handleUpdateTaskStatus = async (taskId: string, status: Task['status']) => {
    const success = await updateTask(taskId, { status });
    if (success) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
    }
  };

  const handleDeleteTask = async (id: string) => {
    const success = await deleteTask(id);
    if (success) {
      setTasks(tasks.filter(t => t.id !== id));
    }
    setShowDeleteTaskConfirm(null);
  };

  // Team search
  const handleSearchUsers = async () => {
    if (!searchEmail.trim() || !user) return;
    setSearchingUsers(true);
    const results = await searchUsersByEmail(searchEmail.trim());
    // Filter out current user and existing team members
    const filteredResults = results.filter(
      (r: any) => r.id !== user.uid && !teamMembers.find(m => m.id === r.id)
    );
    setSearchResults(filteredResults as TeamMember[]);
    setSearchingUsers(false);
  };

  const handleSendInvite = async (invitee: TeamMember) => {
    if (!user) return;
    setInviteSending(true);
    const inviteId = await sendTeamInvite(user.uid, user.email || '', invitee.id, invitee.email);
    if (inviteId) {
      setSearchResults(searchResults.filter(r => r.id !== invitee.id));
      setSearchEmail('');
    }
    setInviteSending(false);
  };

  const handleRespondToInvite = async (inviteId: string, status: 'accepted' | 'rejected') => {
    const success = await respondToInvite(inviteId, status);
    if (success) {
      setPendingInvites(pendingInvites.filter(i => i.id !== inviteId));
      if (status === 'accepted') {
        // Reload team members
        const members = await getTeamMembers(user!.uid);
        setTeamMembers(members as TeamMember[]);
      }
    }
  };

  // Share event
  const handleShareSearch = async () => {
    if (!shareSearchEmail.trim() || !user) return;
    const results = await searchUsersByEmail(shareSearchEmail.trim());
    const filteredResults = results.filter((r: any) => r.id !== user.uid);
    setShareSearchResults(filteredResults as TeamMember[]);
  };

  const handleShareWithUser = async (eventId: string, userId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const newSharedWith = [...(event.sharedWith || []), userId];
    const success = await updateEventSharing(eventId, newSharedWith);
    if (success) {
      setEvents(events.map(e => e.id === eventId ? { ...e, sharedWith: newSharedWith } : e));
    }
  };

  const handleRemoveShare = async (eventId: string, userId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    const newSharedWith = (event.sharedWith || []).filter(id => id !== userId);
    const success = await updateEventSharing(eventId, newSharedWith);
    if (success) {
      setEvents(events.map(e => e.id === eventId ? { ...e, sharedWith: newSharedWith } : e));
    }
  };

  const eventTypeColors = {
    meeting: 'bg-blue-500',
    interview: 'bg-green-500',
    deadline: 'bg-red-500',
    other: 'bg-gray-500'
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    done: 'bg-green-100 text-green-700'
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dashboard Panel */}
          <motion.div
            className="fixed inset-4 sm:inset-8 md:inset-12 lg:inset-16 z-50 flex"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
              {/* Sidebar */}
              <div className="w-16 sm:w-64 bg-gradient-to-b from-[#1E293B] to-[#0F172A] flex flex-col">
                {/* Logo/Header */}
                <div className="p-4 sm:p-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center">
                      <span className="text-white font-bold text-lg">P</span>
                    </div>
                    <span className="hidden sm:block text-white font-semibold">Pando Portal</span>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 sm:p-4 space-y-1">
                  {[
                    { id: 'schedule', icon: Calendar, label: 'Schedule' },
                    { id: 'tasks', icon: FileText, label: 'Tasks' },
                    { id: 'team', icon: Users, label: 'Team' },
                    { id: 'settings', icon: Settings, label: 'Settings' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        activeTab === item.id
                          ? 'bg-[#D4A24A] text-white shadow-lg shadow-[#D4A24A]/30'
                          : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mx-auto sm:mx-0" />
                      <span className="hidden sm:block">{item.label}</span>
                      {item.id === 'team' && pendingInvites.length > 0 && (
                        <span className="hidden sm:flex ml-auto bg-red-500 text-white text-xs w-5 h-5 rounded-full items-center justify-center">
                          {pendingInvites.length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>

                {/* User Section */}
                <div className="p-2 sm:p-4 border-t border-white/10">
                  <div className="flex items-center gap-3 px-3 py-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white text-sm font-medium">
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden sm:block flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{user?.displayName || 'User'}</p>
                      <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <LogOut className="w-5 h-5 mx-auto sm:mx-0" />
                    <span className="hidden sm:block">Sign Out</span>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-gray-100">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      {activeTab === 'schedule' && 'Schedule'}
                      {activeTab === 'tasks' && 'Tasks'}
                      {activeTab === 'team' && 'Team'}
                      {activeTab === 'settings' && 'Settings'}
                    </h1>
                    <p className="text-gray-500 text-sm">
                      {activeTab === 'schedule' && 'Manage your meetings and events'}
                      {activeTab === 'tasks' && 'Track your to-do items'}
                      {activeTab === 'team' && 'Invite and manage team members'}
                      {activeTab === 'settings' && 'Configure your preferences'}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-4 sm:p-8">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D4A24A] border-t-transparent" />
                    </div>
                  ) : (
                    <>
                      {activeTab === 'schedule' && (
                        <div className="grid lg:grid-cols-3 gap-6">
                          {/* Calendar */}
                          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
                            {/* Calendar Header */}
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-lg font-semibold text-gray-900">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                              </h2>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => setCurrentMonth(new Date())}
                                  className="px-3 py-1 text-sm text-[#D4A24A] hover:bg-[#D4A24A]/10 rounded-lg transition-colors"
                                >
                                  Today
                                </button>
                                <button
                                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <ChevronRight className="w-5 h-5 text-gray-600" />
                                </button>
                              </div>
                            </div>

                            {/* Calendar Grid */}
                            <div className="grid grid-cols-7 gap-1">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                                  {day}
                                </div>
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
                                      isSelected ? 'bg-[#D4A24A] text-white shadow-lg shadow-[#D4A24A]/30' :
                                      isToday ? 'bg-[#D4A24A]/20 text-[#D4A24A] font-semibold' :
                                      'hover:bg-gray-100 text-gray-700'
                                    }`}
                                    whileHover={day ? { scale: 1.05 } : {}}
                                    whileTap={day ? { scale: 0.95 } : {}}
                                  >
                                    {day?.getDate()}
                                    {dayEvents.length > 0 && (
                                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                                        {dayEvents.slice(0, 3).map((event, i) => (
                                          <div
                                            key={i}
                                            className={`w-1 h-1 rounded-full ${
                                              isSelected ? 'bg-white' : eventTypeColors[event.type]
                                            }`}
                                          />
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
                            {/* Add Event Button */}
                            <motion.button
                              onClick={() => {
                                setShowEventModal(true);
                                if (selectedDate) {
                                  setNewEvent(prev => ({ ...prev, date: formatDate(selectedDate) }));
                                }
                              }}
                              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl shadow-lg shadow-[#D4A24A]/30 font-medium"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Plus className="w-5 h-5" />
                              Add Event
                            </motion.button>

                            {/* Selected Date Events */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                              <h3 className="font-semibold text-gray-900 mb-4">
                                {selectedDate 
                                  ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
                                  : 'Select a date'}
                              </h3>
                              
                              {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                                <div className="space-y-3">
                                  {getEventsForDate(selectedDate).map(event => (
                                    <motion.div
                                      key={event.id}
                                      className="p-3 rounded-xl bg-gray-50 border border-gray-100 group"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3">
                                          <div className={`w-2 h-2 rounded-full mt-2 ${eventTypeColors[event.type]}`} />
                                          <div>
                                            <p className="font-medium text-gray-900">{event.title}</p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                              <Clock className="w-3 h-3" />
                                              {event.time}
                                            </p>
                                            {event.description && (
                                              <p className="text-sm text-gray-400 mt-1">{event.description}</p>
                                            )}
                                            {event.createdBy !== user?.uid && (
                                              <p className="text-xs text-[#D4A24A] mt-1">Shared by {event.createdByEmail}</p>
                                            )}
                                          </div>
                                        </div>
                                        {event.createdBy === user?.uid && (
                                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                              onClick={() => setShowShareModal(event.id)}
                                              className="p-1 rounded-lg hover:bg-blue-100 text-blue-500"
                                            >
                                              <Share2 className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={() => setShowDeleteConfirm(event.id)}
                                              className="p-1 rounded-lg hover:bg-red-100 text-red-500"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-gray-400 text-sm text-center py-4">
                                  {selectedDate ? 'No events scheduled' : 'Click a date to view events'}
                                </p>
                              )}
                            </div>

                            {/* Upcoming Events */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                              <h3 className="font-semibold text-gray-900 mb-4">Upcoming</h3>
                              <div className="space-y-2">
                                {events
                                  .filter(e => new Date(e.date) >= new Date())
                                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                  .slice(0, 5)
                                  .map(event => (
                                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                                      <div className={`w-2 h-2 rounded-full ${eventTypeColors[event.type]}`} />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                                        <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                                      </div>
                                    </div>
                                  ))}
                                {events.filter(e => new Date(e.date) >= new Date()).length === 0 && (
                                  <p className="text-gray-400 text-sm text-center py-2">No upcoming events</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'tasks' && (
                        <div className="space-y-6">
                          {/* Add Task Button */}
                          <motion.button
                            onClick={() => setShowTaskModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl shadow-lg shadow-[#D4A24A]/30 font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Plus className="w-5 h-5" />
                            Add Task
                          </motion.button>

                          {/* Task Columns */}
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* To Do */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400" />
                                To Do
                                <span className="text-gray-400 text-sm">({tasks.filter(t => t.status === 'todo').length})</span>
                              </h3>
                              <div className="space-y-3">
                                {tasks.filter(t => t.status === 'todo').map(task => (
                                  <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    priorityColors={priorityColors}
                                    onStatusChange={handleUpdateTaskStatus}
                                    onDelete={() => setShowDeleteTaskConfirm(task.id)}
                                  />
                                ))}
                                {tasks.filter(t => t.status === 'todo').length === 0 && (
                                  <p className="text-gray-400 text-sm text-center py-4">No tasks</p>
                                )}
                              </div>
                            </div>

                            {/* In Progress */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                In Progress
                                <span className="text-gray-400 text-sm">({tasks.filter(t => t.status === 'in_progress').length})</span>
                              </h3>
                              <div className="space-y-3">
                                {tasks.filter(t => t.status === 'in_progress').map(task => (
                                  <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    priorityColors={priorityColors}
                                    onStatusChange={handleUpdateTaskStatus}
                                    onDelete={() => setShowDeleteTaskConfirm(task.id)}
                                  />
                                ))}
                                {tasks.filter(t => t.status === 'in_progress').length === 0 && (
                                  <p className="text-gray-400 text-sm text-center py-4">No tasks</p>
                                )}
                              </div>
                            </div>

                            {/* Done */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                Done
                                <span className="text-gray-400 text-sm">({tasks.filter(t => t.status === 'done').length})</span>
                              </h3>
                              <div className="space-y-3">
                                {tasks.filter(t => t.status === 'done').map(task => (
                                  <TaskCard 
                                    key={task.id} 
                                    task={task} 
                                    priorityColors={priorityColors}
                                    onStatusChange={handleUpdateTaskStatus}
                                    onDelete={() => setShowDeleteTaskConfirm(task.id)}
                                  />
                                ))}
                                {tasks.filter(t => t.status === 'done').length === 0 && (
                                  <p className="text-gray-400 text-sm text-center py-4">No tasks</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === 'team' && (
                        <div className="space-y-6">
                          {/* Pending Invites */}
                          {pendingInvites.length > 0 && (
                            <div className="bg-[#D4A24A]/10 rounded-2xl border border-[#D4A24A]/30 p-4">
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Bell className="w-5 h-5 text-[#D4A24A]" />
                                Pending Invitations
                              </h3>
                              <div className="space-y-3">
                                {pendingInvites.map(invite => (
                                  <div key={invite.id} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white font-medium">
                                        {invite.inviterEmail.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">{invite.inviterEmail}</p>
                                        <p className="text-sm text-gray-500">Invited you to join their team</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => handleRespondToInvite(invite.id!, 'accepted')}
                                        className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                      >
                                        <CheckCircle className="w-5 h-5" />
                                      </button>
                                      <button
                                        onClick={() => handleRespondToInvite(invite.id!, 'rejected')}
                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                      >
                                        <XCircle className="w-5 h-5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Invite New Member */}
                          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <UserPlus className="w-5 h-5 text-[#D4A24A]" />
                              Invite Team Member
                            </h3>
                            <p className="text-gray-500 text-sm mb-4">
                              Search for users by email to invite them to your team. They'll be able to view events you share with them.
                            </p>
                            <div className="flex gap-3">
                              <div className="flex-1 relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                  type="email"
                                  value={searchEmail}
                                  onChange={(e) => setSearchEmail(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearchUsers()}
                                  placeholder="Search by email..."
                                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A]"
                                />
                              </div>
                              <motion.button
                                onClick={handleSearchUsers}
                                disabled={searchingUsers || !searchEmail.trim()}
                                className="px-4 py-2 bg-[#D4A24A] text-white rounded-xl disabled:opacity-50"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {searchingUsers ? (
                                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Search className="w-5 h-5" />
                                )}
                              </motion.button>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                              <div className="mt-4 space-y-2">
                                {searchResults.map(result => (
                                  <div key={result.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white font-medium">
                                        {result.displayName?.charAt(0) || result.email.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <p className="font-medium text-gray-900">{result.displayName || 'User'}</p>
                                        <p className="text-sm text-gray-500">{result.email}</p>
                                      </div>
                                    </div>
                                    <motion.button
                                      onClick={() => handleSendInvite(result)}
                                      disabled={inviteSending}
                                      className="px-3 py-1 bg-[#D4A24A] text-white rounded-lg text-sm"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {inviteSending ? 'Sending...' : 'Invite'}
                                    </motion.button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Team Members */}
                          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <Users className="w-5 h-5 text-[#D4A24A]" />
                              Team Members
                              <span className="text-gray-400 text-sm">({teamMembers.length})</span>
                            </h3>
                            
                            {teamMembers.length > 0 ? (
                              <div className="grid sm:grid-cols-2 gap-3">
                                {teamMembers.map(member => (
                                  <div key={member.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white font-medium">
                                      {member.displayName?.charAt(0) || member.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-900 truncate">{member.displayName || 'User'}</p>
                                      <p className="text-sm text-gray-500 truncate">{member.email}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-400 text-center py-8">
                                No team members yet. Invite someone to get started!
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {activeTab === 'settings' && (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                          <h3 className="font-semibold text-gray-900 mb-4">Account Settings</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                              <input
                                type="text"
                                value={user?.displayName || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
                              />
                            </div>
                            <p className="text-sm text-gray-500">
                              Account settings management coming soon. For now, you can manage your account through Firebase.
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Add Event Modal */}
          <AnimatePresence>
            {showEventModal && (
              <Modal onClose={() => setShowEventModal(false)}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Event</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A]"
                      placeholder="Event title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A]"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={newEvent.type}
                      onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as Event['type'] })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A]"
                    >
                      <option value="meeting">Meeting</option>
                      <option value="interview">Interview</option>
                      <option value="deadline">Deadline</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A] resize-none"
                      rows={3}
                      placeholder="Optional description"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleAddEvent}
                    className="flex-1 py-2 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Event
                  </motion.button>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          {/* Add Task Modal */}
          <AnimatePresence>
            {showTaskModal && (
              <Modal onClose={() => setShowTaskModal(false)}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Task</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A]"
                      placeholder="Task title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A] resize-none"
                      rows={2}
                      placeholder="Optional description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <select
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A]"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowTaskModal(false)}
                    className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    onClick={handleAddTask}
                    className="flex-1 py-2 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white rounded-xl"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Add Task
                  </motion.button>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          {/* Delete Event Confirmation */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <Modal onClose={() => setShowDeleteConfirm(null)}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Event?</h3>
                  <p className="text-gray-500 mb-6">
                    Are you sure you want to delete this event? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={() => handleDeleteEvent(showDeleteConfirm)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          {/* Delete Task Confirmation */}
          <AnimatePresence>
            {showDeleteTaskConfirm && (
              <Modal onClose={() => setShowDeleteTaskConfirm(null)}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Task?</h3>
                  <p className="text-gray-500 mb-6">
                    Are you sure you want to delete this task? This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDeleteTaskConfirm(null)}
                      className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      onClick={() => handleDeleteTask(showDeleteTaskConfirm)}
                      className="flex-1 py-2 bg-red-500 text-white rounded-xl"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>

          {/* Share Event Modal */}
          <AnimatePresence>
            {showShareModal && (
              <Modal onClose={() => { setShowShareModal(null); setShareSearchResults([]); setShareSearchEmail(''); }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Event</h3>
                <p className="text-gray-500 text-sm mb-4">
                  Search for team members by email to share this event with them.
                </p>
                
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={shareSearchEmail}
                      onChange={(e) => setShareSearchEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleShareSearch()}
                      placeholder="Search by email..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A]"
                    />
                  </div>
                  <button
                    onClick={handleShareSearch}
                    className="px-4 py-2 bg-[#D4A24A] text-white rounded-xl"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                {/* Search Results */}
                {shareSearchResults.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-medium text-gray-700">Search Results</p>
                    {shareSearchResults.map(result => {
                      const event = events.find(e => e.id === showShareModal);
                      const isShared = event?.sharedWith?.includes(result.id);
                      return (
                        <div key={result.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white text-sm">
                              {result.email.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-700">{result.email}</span>
                          </div>
                          {isShared ? (
                            <button
                              onClick={() => handleRemoveShare(showShareModal, result.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm"
                            >
                              Remove
                            </button>
                          ) : (
                            <button
                              onClick={() => handleShareWithUser(showShareModal, result.id)}
                              className="px-3 py-1 bg-[#D4A24A] text-white rounded-lg text-sm"
                            >
                              Share
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Currently Shared With */}
                {(() => {
                  const event = events.find(e => e.id === showShareModal);
                  if (event?.sharedWith && event.sharedWith.length > 0) {
                    return (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Shared with</p>
                        <div className="space-y-2">
                          {event.sharedWith.map(userId => {
                            const member = teamMembers.find(m => m.id === userId);
                            return (
                              <div key={userId} className="flex items-center justify-between bg-green-50 rounded-xl p-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white text-sm">
                                    {member?.email?.charAt(0)?.toUpperCase() || '?'}
                                  </div>
                                  <span className="text-sm text-gray-700">{member?.email || userId}</span>
                                </div>
                                <button
                                  onClick={() => handleRemoveShare(showShareModal, userId)}
                                  className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm"
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <div className="mt-6">
                  <button
                    onClick={() => { setShowShareModal(null); setShareSearchResults([]); setShareSearchEmail(''); }}
                    className="w-full py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </Modal>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

// Modal Component
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    </>
  );
}

// Task Card Component
function TaskCard({ 
  task, 
  priorityColors, 
  onStatusChange, 
  onDelete 
}: { 
  task: Task; 
  priorityColors: Record<string, string>;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: () => void;
}) {
  return (
    <motion.div
      className="p-3 rounded-xl bg-gray-50 border border-gray-100 group"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-medium text-gray-900 text-sm">{task.title}</p>
        <button
          onClick={onDelete}
          className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-500 transition-all"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 mb-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="text-xs text-gray-400">{task.dueDate}</span>
        )}
      </div>
      <div className="mt-2 flex gap-1">
        {task.status !== 'todo' && (
          <button
            onClick={() => onStatusChange(task.id, 'todo')}
            className="flex-1 text-xs py-1 rounded bg-gray-200 text-gray-600 hover:bg-gray-300"
          >
            To Do
          </button>
        )}
        {task.status !== 'in_progress' && (
          <button
            onClick={() => onStatusChange(task.id, 'in_progress')}
            className="flex-1 text-xs py-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200"
          >
            In Progress
          </button>
        )}
        {task.status !== 'done' && (
          <button
            onClick={() => onStatusChange(task.id, 'done')}
            className="flex-1 text-xs py-1 rounded bg-green-100 text-green-600 hover:bg-green-200"
          >
            Done
          </button>
        )}
      </div>
    </motion.div>
  );
}
