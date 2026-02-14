import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { logOut, User } from '@/lib/firebase';

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
  type: 'meeting' | 'demo' | 'call' | 'other';
  description?: string;
}

export function Dashboard({ isOpen, onClose, user }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'schedule' | 'tasks' | 'team' | 'settings'>('schedule');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Team Standup', date: '2026-02-14', time: '09:00', type: 'meeting', description: 'Daily sync' },
    { id: '2', title: 'Product Demo', date: '2026-02-14', time: '14:00', type: 'demo', description: 'Demo for USC Medical' },
    { id: '3', title: 'Investor Call', date: '2026-02-16', time: '11:00', type: 'call', description: 'Follow up on Series A' },
  ]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    date: '',
    time: '',
    type: 'meeting',
    description: ''
  });

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
    
    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
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

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        type: newEvent.type as Event['type'],
        description: newEvent.description
      };
      setEvents([...events, event]);
      setNewEvent({ title: '', date: '', time: '', type: 'meeting', description: '' });
      setShowEventModal(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const eventTypeColors = {
    meeting: 'bg-blue-500',
    demo: 'bg-green-500',
    call: 'bg-purple-500',
    other: 'bg-gray-500'
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
                      {activeTab === 'team' && 'Team members and contacts'}
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
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteEvent(event.id)}
                                      className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-red-500 transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
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
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'tasks' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <p className="text-gray-500 text-center py-12">Task management coming soon...</p>
                    </div>
                  )}

                  {activeTab === 'team' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <p className="text-gray-500 text-center py-12">Team directory coming soon...</p>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                      <p className="text-gray-500 text-center py-12">Settings coming soon...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Add Event Modal */}
          <AnimatePresence>
            {showEventModal && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black/50 z-[60]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowEventModal(false)}
                />
                <motion.div
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md"
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                  >
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
                          <option value="demo">Demo</option>
                          <option value="call">Call</option>
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
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

