'use client';

import { motion } from 'motion/react';
import { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { addInternshipApplication } from '@/lib/firebase';
import { useLanguage } from '@/lib/LanguageContext';

const emptyForm = {
  role: 'Engineering Intern',
  fullName: '',
  email: '',
  resumeLink: '',
  whyPassionate: '',
  whyPando: '',
  skillsets: '',
};

export function InternshipApplicationForm() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState(emptyForm);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    const result = await addInternshipApplication(formData);

    if (!result.ok) {
      setStatus('error');
      setErrorMessage(`${t(result.error)} ${t('Please try again or email us directly.')}`);
      return;
    }

    setStatus('success');
    setFormData(emptyForm);
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative isolate z-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
        >
          <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">{t('Application Received')}</h3>
        <p className="text-gray-600 mb-6 text-sm sm:text-base max-w-md mx-auto">
          {t("Thanks for applying. We'll review your application and be in contact with you soon.")}
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 sm:px-8 py-3 sm:py-3.5 bg-teal hover:bg-teal-hover text-white rounded-sm font-medium transition-colors text-sm sm:text-base"
        >
          {t('Submit Another Application')}
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative isolate z-20 space-y-4">
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
            {t('Full Name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
          />
        </div>
        <div>
          <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
            {t('Email Address')} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
          {t('Resume (Google Drive Link)')} <span className="text-red-500">*</span>
        </label>
        <input
          type="url"
          name="resumeLink"
          value={formData.resumeLink}
          onChange={handleChange}
          required
          placeholder="https://drive.google.com/..."
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all text-base"
        />
        <p className="text-gray-500 text-xs sm:text-sm mt-1.5">
          {t('Make sure sharing is set to "Anyone with the link can view" so we can open it.')}
        </p>
      </div>

      <div>
        <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
          {t('Why are you passionate about this role?')} <span className="text-red-500">*</span>
        </label>
        <textarea
          name="whyPassionate"
          value={formData.whyPassionate}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all resize-none text-base"
        />
      </div>

      <div>
        <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
          {t('Why Pando Surgical?')} <span className="text-red-500">*</span>
        </label>
        <textarea
          name="whyPando"
          value={formData.whyPando}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all resize-none text-base"
        />
      </div>

      <div>
        <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
          {t('What skillsets can you bring to this role?')} <span className="text-red-500">*</span>
        </label>
        <textarea
          name="skillsets"
          value={formData.skillsets}
          onChange={handleChange}
          required
          rows={3}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all resize-none text-base"
        />
      </div>

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-sm text-red-700 text-sm sm:text-base"
        >
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={status === 'sending'}
        className={`relative w-full bg-teal hover:bg-teal-hover text-white py-3 sm:py-4 rounded-sm flex items-center justify-center gap-2 shadow-md overflow-hidden group text-sm sm:text-base transition-colors ${
          status === 'sending' ? 'opacity-80 cursor-not-allowed' : ''
        }`}
        whileHover={status !== 'sending' ? { scale: 1.02, y: -2 } : {}}
        whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
      >
        <span className="relative z-10 flex items-center gap-2">
          {status === 'sending' ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              {t('Submitting...')}
            </>
          ) : (
            <>
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              {t('Submit Application')}
            </>
          )}
        </span>
      </motion.button>
    </form>
  );
}
