import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
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
  Search,
  UserPlus,
  Mail,
  AlertTriangle,
  Link2,
  ExternalLink,
  CheckCircle,
  RefreshCw,
  CalendarDays
} from 'lucide-react';
import { logOut, User } from '@/lib/firebase';
import { loadCronofyElements } from '@/lib/cronofy';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in_progress' | 'done';
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  calendarConnected: boolean;
}

// Hardcoded team for your 5 people
const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Aiden', email: '', role: 'CEO', calendarConnected: false },
  { id: '2', name: 'Noah', email: '', role: 'CTO', calendarConnected: false },
  { id: '3', name: 'Sean', email: '', role: 'Head of Engineering', calendarConnected: false },
  { id: '4', name: 'Derek', email: '', role: 'Head of Clinical Affairs', calendarConnected: false },
  { id: '5', name: 'Toshi', email: '', role: 'Team Member', calendarConnected: false },
];

export function Dashboard({ isOpen, onClose, user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'team' | 'settings'>('schedule');
  const [cronofyLoaded, setCronofyLoaded] = useState(false);
  const [cronofyError, setCronofyError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pando_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showDeleteTaskConfirm, setShowDeleteTaskConfirm] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    status: 'todo'
  });
  
  const calendarRef = useRef<HTMLDivElement>(null);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('pando_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Load Cronofy Elements in Demo Mode
  useEffect(() => {
    if (isOpen && activeTab === 'schedule') {
      loadCronofyElements()
        .then(() => {
          setCronofyLoaded(true);
          setCronofyError(null);
        })
        .catch((err) => {
          console.error('Failed to load Cronofy:', err);
          setCronofyError('Failed to load calendar. Please refresh.');
        });
    }
  }, [isOpen, activeTab]);

  // Initialize Cronofy Elements in Demo Mode
  useEffect(() => {
    if (cronofyLoaded && activeTab === 'schedule') {
      const CronofyElements = (window as any).CronofyElements;
      
      if (calendarRef.current && CronofyElements) {
        // Clear previous elements
        calendarRef.current.innerHTML = '<div id="cronofy-agenda"></div>';

        // Initialize in Demo Mode (no token needed!)
        setTimeout(() => {
          try {
            CronofyElements.Agenda({
              target_id: 'cronofy-agenda',
              demo: true, // Demo mode - shows mock data
              styles: {
                prefix: 'cronofy-pando'
              }
            });
          } catch (e) {
            console.error('Error initializing Cronofy:', e);
          }
        }, 100);
      }
    }
  }, [cronofyLoaded, activeTab]);

  const handleLogout = async () => {
    await logOut();
    onClose();
  };

  // Tasks
  const handleAddTask = () => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority as Task['priority'],
      status: newTask.status as Task['status']
    };
    
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '', dueDate: '', priority: 'medium', status: 'todo' });
    setShowTaskModal(false);
  };

  const handleUpdateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    setShowDeleteTaskConfirm(null);
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700'
  };

  // Cronofy dashboard URL with your Client ID
  const cronofyDashboardUrl = 'https://app.cronofy.com';

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
                      {activeTab === 'schedule' && 'Manage meetings with Cronofy'}
                      {activeTab === 'tasks' && 'Track your to-do items'}
                      {activeTab === 'team' && 'Your Pando Surgical team'}
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
                  {activeTab === 'schedule' && (
                    <div className="space-y-6">
                      {cronofyError ? (
                        /* Error State */
                        <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center">
                          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                          <h3 className="font-semibold text-gray-900 mb-2">Calendar Error</h3>
                          <p className="text-gray-600 mb-4">{cronofyError}</p>
                          <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Refresh Page
                          </button>
                        </div>
                      ) : !cronofyLoaded ? (
                        /* Loading State */
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#D4A24A] border-t-transparent mx-auto mb-4" />
                            <p className="text-gray-500">Loading calendar...</p>
                          </div>
                        </div>
                      ) : (
                        /* Calendar View */
                        <div className="grid lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-2 space-y-6">
                            {/* Demo Calendar Preview */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div>
                                  <h2 className="text-lg font-semibold text-gray-900">Your Agenda</h2>
                                  <p className="text-sm text-gray-500">Preview mode - Connect calendar for real data</p>
                                </div>
                                <span className="px-3 py-1 bg-[#D4A24A]/20 text-[#D4A24A] text-xs font-medium rounded-full">
                                  Demo
                                </span>
                              </div>
                              <div ref={calendarRef} className="min-h-[300px]">
                                <div id="cronofy-agenda" />
                              </div>
                            </div>

                            {/* Main Action - Go to Cronofy */}
                            <div className="bg-gradient-to-br from-[#D4A24A] to-[#B8883D] rounded-2xl p-6 text-white">
                              <h3 className="text-xl font-bold mb-2">Ready to Schedule?</h3>
                              <p className="text-white/80 mb-4">
                                Use Cronofy's dashboard to connect your calendars, create scheduling links, and manage your team's availability.
                              </p>
                              <div className="flex flex-wrap gap-3">
                                <motion.a
                                  href={cronofyDashboardUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#D4A24A] rounded-xl font-medium"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <CalendarDays className="w-5 h-5" />
                                  Open Cronofy Dashboard
                                </motion.a>
                                <motion.a
                                  href="https://app.cronofy.com/oauth/authorize"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl font-medium"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Link2 className="w-5 h-5" />
                                  Connect Calendar
                                </motion.a>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Link2 className="w-5 h-5 text-[#D4A24A]" />
                                Quick Actions
                              </h3>
                              <div className="space-y-2">
                                <a
                                  href="https://app.cronofy.com/calendars"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                  <span className="text-sm text-gray-700">Connect Calendars</span>
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>
                                <a
                                  href="https://app.cronofy.com/scheduling"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                  <span className="text-sm text-gray-700">Create Scheduling Link</span>
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>
                                <a
                                  href="https://app.cronofy.com/availability"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                  <span className="text-sm text-gray-700">Team Availability</span>
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>
                                <a
                                  href="https://app.cronofy.com/users"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                  <span className="text-sm text-gray-700">Invite Team Members</span>
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                </a>
                              </div>
                            </div>

                            {/* Pro Tip */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
                              <h3 className="font-semibold text-gray-900 mb-2">💡 How It Works</h3>
                              <ol className="text-sm text-gray-600 space-y-2">
                                <li className="flex gap-2">
                                  <span className="text-[#D4A24A] font-bold">1.</span>
                                  Connect your Google/Outlook calendar
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#D4A24A] font-bold">2.</span>
                                  Create a scheduling link
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#D4A24A] font-bold">3.</span>
                                  Share link with others
                                </li>
                                <li className="flex gap-2">
                                  <span className="text-[#D4A24A] font-bold">4.</span>
                                  They pick a time, it's on your calendar!
                                </li>
                              </ol>
                            </div>
                          </div>
                        </div>
                      )}
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
                      {/* Team Grid */}
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                          <Users className="w-5 h-5 text-[#D4A24A]" />
                          Pando Surgical Team
                        </h3>
                        
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {TEAM_MEMBERS.map((member, index) => (
                            <motion.div
                              key={member.id}
                              className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center text-white font-semibold text-lg">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900">{member.name}</p>
                                  <p className="text-sm text-[#D4A24A]">{member.role}</p>
                                </div>
                              </div>
                              {member.calendarConnected ? (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                  <CheckCircle className="w-4 h-4" />
                                  Calendar Connected
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                  <Calendar className="w-4 h-4" />
                                  Pending Connection
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Invite Instructions */}
                      <div className="bg-gradient-to-br from-[#D4A24A]/10 to-[#B8883D]/10 rounded-2xl border border-[#D4A24A]/30 p-6">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <UserPlus className="w-5 h-5 text-[#D4A24A]" />
                          Connect Team Calendars
                        </h3>
                        <p className="text-gray-600 mb-4">
                          To see everyone's availability in real-time, each team member needs to connect their calendar in Cronofy.
                        </p>
                        <ol className="space-y-2 text-sm text-gray-600">
                          <li className="flex gap-2">
                            <span className="text-[#D4A24A] font-semibold">1.</span>
                            Go to your Cronofy dashboard
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#D4A24A] font-semibold">2.</span>
                            Click "Add User" and enter their email
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#D4A24A] font-semibold">3.</span>
                            They'll receive an invite to connect their calendar
                          </li>
                          <li className="flex gap-2">
                            <span className="text-[#D4A24A] font-semibold">4.</span>
                            Once connected, you'll see their availability!
                          </li>
                        </ol>
                        <motion.a
                          href="https://app.cronofy.com/users"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#D4A24A] text-white rounded-xl text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <UserPlus className="w-4 h-4" />
                          Invite Team Members
                        </motion.a>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="space-y-6">
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
                        </div>
                      </div>

                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Cronofy Integration</h3>
                        <div className="space-y-3">
                          <a
                            href="https://app.cronofy.com/calendars"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-sm text-gray-700">Connect Calendars</span>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </a>
                          <a
                            href="https://app.cronofy.com/settings"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <span className="text-sm text-gray-700">Manage Cronofy Settings</span>
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

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
