import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail, 
  resetPassword 
} from '@/lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    
    const result = await signInWithGoogle();
    
    if (result.error) {
      setError(result.error);
    } else if (result.user) {
      console.log('Signed in with Google:', result.user.displayName);
      onClose();
    }
    
    setIsGoogleLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    if (mode === 'forgot') {
      const result = await resetPassword(formData.email);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccessMessage('Password reset email sent! Check your inbox.');
        setTimeout(() => {
          setMode('login');
          setSuccessMessage('');
        }, 3000);
      }
      setIsLoading(false);
      return;
    }

    if (mode === 'signup') {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      const result = await signUpWithEmail(formData.email, formData.password, formData.name);
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        console.log('Account created:', result.user.email);
        setSuccessMessage('Account created successfully!');
        setTimeout(() => onClose(), 1500);
      }
    } else {
      const result = await signInWithEmail(formData.email, formData.password);
      if (result.error) {
        setError(result.error);
      } else if (result.user) {
        console.log('Signed in:', result.user.email);
        onClose();
      }
    }
    
    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
    setSuccessMessage('');
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Reset Password';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to access your account';
      case 'signup': return 'Join Pando Surgical today';
      case 'forgot': return 'Enter your email to reset password';
    }
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md my-8"
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
                    {getTitle()}
                  </h2>
                  <p className="text-gray-300 text-sm">
                    {getSubtitle()}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  {/* Google Sign In Button */}
                  {mode !== 'forgot' && (
                    <>
                      <motion.button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70"
                        whileHover={!isGoogleLoading ? { scale: 1.02 } : {}}
                        whileTap={!isGoogleLoading ? { scale: 0.98 } : {}}
                      >
                        {isGoogleLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                        ) : (
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                        )}
                        <span className="font-medium text-gray-700">
                          {isGoogleLoading ? 'Signing in...' : `Continue with Google`}
                        </span>
                      </motion.button>

                      {/* Divider */}
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-4 bg-white/80 text-gray-500">or</span>
                        </div>
                      </div>
                    </>
                  )}

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

                  {/* Password field (not for forgot mode) */}
                  {mode !== 'forgot' && (
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
                  )}

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
                        onClick={() => switchMode('forgot')}
                        className="text-sm text-[#D4A24A] hover:text-[#B8883D] transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm"
                    >
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{successMessage}</span>
                    </motion.div>
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
                          {mode === 'login' ? 'Signing in...' : mode === 'signup' ? 'Creating account...' : 'Sending...'}
                        </>
                      ) : mode === 'login' ? (
                        'Sign In'
                      ) : mode === 'signup' ? (
                        'Create Account'
                      ) : (
                        'Send Reset Link'
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

                  {/* Mode switch links */}
                  <div className="text-center pt-2 space-y-2">
                    {mode === 'forgot' ? (
                      <button
                        type="button"
                        onClick={() => switchMode('login')}
                        className="text-sm text-[#D4A24A] hover:text-[#B8883D] transition-colors"
                      >
                        Back to Sign In
                      </button>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                        <button
                          type="button"
                          onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}
                          className="text-[#D4A24A] hover:text-[#B8883D] font-medium transition-colors"
                        >
                          {mode === 'login' ? 'Sign Up' : 'Sign In'}
                        </button>
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
