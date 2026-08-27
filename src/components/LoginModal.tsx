'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, Building2, Phone, ChevronLeft } from 'lucide-react';
import {
  signInWithGoogle,
  signInWithEmail,
  resetPassword,
  addClinicianRequest,
  addNewsletterSignup,
  checkEmailAlreadyRegistered,
  logOut,
  TEAM_EMAILS
} from '@/lib/firebase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Mode = 'login' | 'forgot' | 'clinicianOrNot' | 'clinicianForm' | 'newsletterForm' | 'thankYou';

const NEWSLETTER_INTERESTS = ['Investment updates', 'Partnership opportunities', 'General news'];

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [clinicianData, setClinicianData] = useState({ name: '', email: '', hospital: '', phone: '' });
  const [newsletterData, setNewsletterData] = useState<{ name: string; email: string; interests: string[] }>({
    name: '',
    email: '',
    interests: []
  });

  const resetAllState = () => {
    setFormData({ email: '', password: '' });
    setClinicianData({ name: '', email: '', hospital: '', phone: '' });
    setNewsletterData({ name: '', email: '', interests: [] });
    setError('');
    setSuccessMessage('');
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    resetAllState();
  };

  const handleClose = () => {
    onClose();
    switchMode('login');
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');

    const result = await signInWithGoogle();

    if (result.error) {
      setError(result.error);
      setIsGoogleLoading(false);
      return;
    }

    const email = result.user?.email?.toLowerCase() ?? '';

    if (TEAM_EMAILS.includes(email)) {
      // Real team member — proceed to the Dashboard as normal.
      handleClose();
      setIsGoogleLoading(false);
      return;
    }

    // Not a team email: Google sign-in here is only used to verify identity
    // for the clinician/newsletter flow, not to grant a real account. Check
    // whether they've already registered before signing them back out.
    const alreadyRegistered = await checkEmailAlreadyRegistered(email);
    await logOut();

    if (alreadyRegistered) {
      setMode('thankYou');
    } else {
      const name = result.user?.displayName ?? '';
      setClinicianData((prev) => ({ ...prev, name, email }));
      setNewsletterData((prev) => ({ ...prev, name, email }));
      setMode('clinicianOrNot');
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
        setTimeout(() => switchMode('login'), 3000);
      }
      setIsLoading(false);
      return;
    }

    const result = await signInWithEmail(formData.email, formData.password);
    if (result.error) {
      setError(result.error);
    } else if (result.user) {
      handleClose();
    }

    setIsLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleClinicianChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClinicianData({ ...clinicianData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletterData({ ...newsletterData, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleInterest = (interest: string) => {
    setNewsletterData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleClinicianSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await addClinicianRequest(clinicianData);
    if (!result.ok) {
      setError(result.error);
    } else {
      setMode('thankYou');
    }
    setIsLoading(false);
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await addNewsletterSignup(newsletterData);
    if (!result.ok) {
      setError(result.error);
    } else {
      setMode('thankYou');
    }
    setIsLoading(false);
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'forgot': return 'Reset Password';
      case 'clinicianOrNot': return 'Get Started';
      case 'clinicianForm': return 'Clinician Access';
      case 'newsletterForm': return 'Stay Updated';
      case 'thankYou': return 'Thank You!';
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'login': return 'Sign in to access your account';
      case 'forgot': return 'Enter your email to reset password';
      case 'clinicianOrNot': return 'Are you a clinician?';
      case 'clinicianForm': return "Tell us a bit about yourself and we'll be in touch";
      case 'newsletterForm': return "We'll keep you posted on what we're building";
      case 'thankYou': return "We'll be in touch soon.";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <div className="min-h-full flex items-center justify-center p-4">
            <motion.div
              className="relative w-full max-w-md my-8"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white/80 backdrop-blur-xl rounded-sm sm:rounded-sm shadow-2xl border border-white/60 overflow-hidden">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal/30 via-teal/10 to-teal/30 rounded-sm sm:rounded-sm blur-xl -z-10" />

                {/* Header */}
                <div className="relative bg-gradient-to-r from-navy to-navy-hover px-6 py-8 text-center">
                  <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label="Close login modal"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>

                  <h2 className="text-2xl font-semibold text-white mb-1">{getTitle()}</h2>
                  <p className="text-gray-300 text-sm">{getSubtitle()}</p>
                </div>

                <div className="p-6">
                  {/* LOGIN / FORGOT PASSWORD */}
                  {(mode === 'login' || mode === 'forgot') && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {mode === 'login' && (
                        <>
                          <motion.button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleLoading}
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-200 rounded-sm hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-70"
                            whileHover={!isGoogleLoading ? { scale: 1.02 } : {}}
                            whileTap={!isGoogleLoading ? { scale: 0.98 } : {}}
                          >
                            {isGoogleLoading ? (
                              <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                            ) : (
                              <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                              </svg>
                            )}
                            <span className="font-medium text-gray-700">
                              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
                            </span>
                          </motion.button>

                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-sm font-medium text-gray-500">or</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
                          />
                        </div>
                      </div>

                      {mode === 'login' && (
                        <div>
                          <label className="block text-gray-700 mb-1.5 text-sm font-medium">Password</label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              placeholder="••••••••"
                              className="w-full pl-10 pr-12 py-3 bg-white/70 border border-gray-200/50 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                              aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {mode === 'login' && (
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => switchMode('forgot')}
                            className="text-sm text-teal hover:text-teal-hover transition-colors"
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      {successMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-sm text-green-700 text-sm"
                        >
                          <CheckCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{successMessage}</span>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className={`relative w-full bg-gradient-to-r from-teal to-teal-hover text-white py-3.5 rounded-sm flex items-center justify-center gap-2 shadow-lg overflow-hidden group ${
                          isLoading ? 'opacity-80 cursor-not-allowed' : ''
                        }`}
                        whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                      >
                        <span className="relative z-10 flex items-center gap-2 font-medium">
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              {mode === 'login' ? 'Signing in...' : 'Sending...'}
                            </>
                          ) : mode === 'login' ? (
                            'Sign In'
                          ) : (
                            'Send Reset Link'
                          )}
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      </motion.button>

                      <div className="text-center pt-2 space-y-2">
                        {mode === 'forgot' ? (
                          <button
                            type="button"
                            onClick={() => switchMode('login')}
                            className="text-sm text-teal hover:text-teal-hover transition-colors"
                          >
                            Back to Sign In
                          </button>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Not on the team?{' '}
                            <button
                              type="button"
                              onClick={() => switchMode('clinicianOrNot')}
                              className="text-teal hover:text-teal-hover font-medium transition-colors"
                            >
                              Sign Up
                            </button>
                          </p>
                        )}
                      </div>
                    </form>
                  )}

                  {/* CLINICIAN OR NOT */}
                  {mode === 'clinicianOrNot' && (
                    <div className="space-y-4">
                      <motion.button
                        type="button"
                        onClick={() => switchMode('clinicianForm')}
                        className="w-full flex items-center justify-between gap-3 p-4 bg-white/70 border border-gray-200/50 rounded-sm hover:border-teal transition-colors text-left"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div>
                          <p className="font-medium text-gray-900">Yes, I'm a clinician</p>
                          <p className="text-sm text-gray-500">Get clinician access and resources</p>
                        </div>
                      </motion.button>

                      <motion.button
                        type="button"
                        onClick={() => switchMode('newsletterForm')}
                        className="w-full flex items-center justify-between gap-3 p-4 bg-white/70 border border-gray-200/50 rounded-sm hover:border-teal transition-colors text-left"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div>
                          <p className="font-medium text-gray-900">No</p>
                          <p className="text-sm text-gray-500">Just keep me updated on Pando Surgical</p>
                        </div>
                      </motion.button>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="text-sm text-teal hover:text-teal-hover transition-colors"
                        >
                          Back to Sign In
                        </button>
                      </div>
                    </div>
                  )}

                  {/* CLINICIAN FORM */}
                  {mode === 'clinicianForm' && (
                    <form onSubmit={handleClinicianSubmit} className="space-y-4">
                      <button
                        type="button"
                        onClick={() => switchMode('clinicianOrNot')}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors -mt-1 mb-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>

                      <div>
                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={clinicianData.name}
                            onChange={handleClinicianChange}
                            required
                            placeholder="Jane Doe"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={clinicianData.email}
                            onChange={handleClinicianChange}
                            required
                            placeholder="you@hospital.org"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">Hospital / Institution</label>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="hospital"
                            value={clinicianData.hospital}
                            onChange={handleClinicianChange}
                            required
                            placeholder="General Hospital"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">Phone Number (optional)</label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            name="phone"
                            value={clinicianData.phone}
                            onChange={handleClinicianChange}
                            placeholder="(555) 555-5555"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
                          />
                        </div>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className={`relative w-full bg-gradient-to-r from-teal to-teal-hover text-white py-3.5 rounded-sm flex items-center justify-center gap-2 shadow-lg overflow-hidden group ${
                          isLoading ? 'opacity-80 cursor-not-allowed' : ''
                        }`}
                        whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                      >
                        <span className="relative z-10 flex items-center gap-2 font-medium">
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                            </>
                          ) : (
                            'Submit Request'
                          )}
                        </span>
                      </motion.button>
                    </form>
                  )}

                  {/* NEWSLETTER FORM */}
                  {mode === 'newsletterForm' && (
                    <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                      <button
                        type="button"
                        onClick={() => switchMode('clinicianOrNot')}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors -mt-1 mb-1"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>

                      <div>
                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={newsletterData.name}
                            onChange={handleNewsletterChange}
                            required
                            placeholder="Jane Doe"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-1.5 text-sm font-medium">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={newsletterData.email}
                            onChange={handleNewsletterChange}
                            required
                            placeholder="you@example.com"
                            className="w-full pl-10 pr-4 py-3 bg-white/70 border border-gray-200/50 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2 text-sm font-medium">I'm interested in</label>
                        <div className="space-y-2">
                          {NEWSLETTER_INTERESTS.map((interest) => (
                            <label
                              key={interest}
                              className="flex items-center gap-3 p-3 bg-white/70 border border-gray-200/50 rounded-sm cursor-pointer hover:border-teal/50 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={newsletterData.interests.includes(interest)}
                                onChange={() => toggleInterest(interest)}
                                className="w-4 h-4 accent-teal"
                              />
                              <span className="text-sm text-gray-700">{interest}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm"
                        >
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{error}</span>
                        </motion.div>
                      )}

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        className={`relative w-full bg-gradient-to-r from-teal to-teal-hover text-white py-3.5 rounded-sm flex items-center justify-center gap-2 shadow-lg overflow-hidden group ${
                          isLoading ? 'opacity-80 cursor-not-allowed' : ''
                        }`}
                        whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                      >
                        <span className="relative z-10 flex items-center gap-2 font-medium">
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" /> Submitting...
                            </>
                          ) : (
                            'Sign Up for Updates'
                          )}
                        </span>
                      </motion.button>
                    </form>
                  )}

                  {/* THANK YOU */}
                  {mode === 'thankYou' && (
                    <div className="text-center py-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                        className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30"
                      >
                        <CheckCircle className="w-8 h-8 text-white" />
                      </motion.div>
                      <p className="text-gray-600 mb-6">Thank you for signing up! We'll be in touch soon.</p>
                      <button
                        onClick={handleClose}
                        className="px-6 py-3 bg-teal hover:bg-teal-hover text-white rounded-sm font-medium transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
