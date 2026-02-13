import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call - replace with actual authentication
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(mode === 'login' ? 'Login attempt:' : 'Signup attempt:', formData);
    setIsLoading(false);
    
    // TODO: Implement actual authentication logic
    alert(mode === 'login' ? 'Login functionality coming soon!' : 'Signup functionality coming soon!');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass-morphic container */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
                {/* Golden glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A24A]/30 via-amber-300/20 to-[#D4A24A]/30 rounded-2xl sm:rounded-3xl blur-xl -z-10" />

                {/* Header */}
                <div className="relative bg-gradient-to-r from-[#1E293B] to-[#334155] px-6 py-8 text-center">
                  {/* Close button */}
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Close login modal"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  {/* Logo/Icon */}
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#D4A24A] to-[#B8883D] flex items-center justify-center shadow-lg shadow-[#D4A24A]/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.1 }}
                  >
                    <User className="w-8 h-8 text-white" />
                  </motion.div>

                  <h2 className="text-2xl font-semibold text-white mb-1">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-gray-300 text-sm">
                    {mode === 'login'
                      ? 'Sign in to access your account'
                      : 'Join Pando Surgical today'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Name field (signup only) */}
                  <AnimatePresence mode="wait">
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required={mode === 'signup'}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all text-base"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email field */}
                  <div>
                    <label className="block text-gray-700 mb-1.5 text-sm font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all text-base"
                      />
                    </div>
                  </div>

                  {/* Password field */}
                  <div>
                    <label className="block text-gray-700 mb-1.5 text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 bg-white/70 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (signup only) */}
                  <AnimatePresence mode="wait">
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required={mode === 'signup'}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all text-base"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Forgot password link (login only) */}
                  {mode === 'login' && (
                    <div className="text-right">
                      <button
                        type="button"
                        className="text-sm text-[#D4A24A] hover:text-[#B8883D] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Submit button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className={`relative w-full bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg overflow-hidden group ${
                      isLoading ? 'opacity-80 cursor-not-allowed' : ''
                    }`}
                    whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!isLoading ? { scale: 0.98 } : {}}
                  >
                    <span className="relative z-10 flex items-center gap-2 font-medium">
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                        </>
                      ) : mode === 'login' ? (
                        'Sign In'
                      ) : (
                        'Create Account'
                      )}
                    </span>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/80 text-gray-500">
                        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                      </span>
                    </div>
                  </div>

                  {/* Switch mode button */}
                  <motion.button
                    type="button"
                    onClick={switchMode}
                    className="w-full py-3 rounded-xl border-2 border-[#D4A24A]/30 text-[#D4A24A] font-medium hover:bg-[#D4A24A]/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {mode === 'login' ? 'Create Account' : 'Sign In'}
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

