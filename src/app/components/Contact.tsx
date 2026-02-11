import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_035hjcs';
const EMAILJS_TEMPLATE_ID = 'template_g40ybbn';
const EMAILJS_PUBLIC_KEY = '4kITqwgwXtJr6ubMM';

export function Contact() {
  const ref = useRef(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    message: '',
  });
  
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');

    try {
      console.log('Sending email with:', {
        serviceId: EMAILJS_SERVICE_ID,
        templateId: EMAILJS_TEMPLATE_ID,
        data: {
          name: formData.fullName,
          email: formData.email,
          title: formData.inquiryType,
        }
      });
      
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: formData.fullName,
          email: formData.email,
          title: formData.inquiryType,
          phone: formData.phone || 'Not provided',
          company: formData.company || 'Not provided',
          message: formData.message,
        },
        EMAILJS_PUBLIC_KEY
      );
      
      console.log('EmailJS Success:', result);
      
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: '',
        message: '',
      });
      
      // Reset to idle after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      setStatus('error');
      const errorText = error?.text || error?.message || 'Unknown error';
      setErrorMessage(`Failed to send: ${errorText}. Please try again or contact us directly.`);
      
      // Reset to idle after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section id="contact" className="py-12 sm:py-20 bg-gradient-to-b from-slate-50 via-white to-amber-50/20 relative overflow-hidden" ref={ref}>
      {/* Background glass effects */}
      <div className="absolute top-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-br from-[#D4A24A]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-gradient-to-tl from-blue-100/30 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-[#1E293B] to-[#D4A24A] bg-clip-text text-transparent">Contact Us</h2>
          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] mx-auto rounded-full shadow-lg shadow-[#D4A24A]/30" />
        </motion.div>

        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glass-morphic form container */}
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/60">
            {/* Golden border glow on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A24A]/20 via-amber-300/10 to-[#D4A24A]/20 rounded-2xl sm:rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Name and Email - side by side on larger screens */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm text-base"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm text-base"
                  />
                </div>
              </div>

              {/* Phone and Company - side by side on larger screens */}
              <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm text-base"
                  />
                </div>

                <div>
                  <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Company/Organization</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Inquiry Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm text-base appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                >
                  <option value="">Select an option</option>
                  <option value="product">Product Information</option>
                  <option value="demo">Request a Demo</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all resize-none shadow-sm text-base"
                />
              </div>

              {/* Status Messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm sm:text-base"
                >
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>Thank you! Your message has been sent successfully.</span>
                </motion.div>
              )}
              
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm sm:text-base"
                >
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={status === 'sending'}
                className={`relative w-full bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl overflow-hidden group text-sm sm:text-base ${
                  status === 'sending' ? 'opacity-80 cursor-not-allowed' : ''
                }`}
                whileHover={status !== 'sending' ? { scale: 1.02, y: -2 } : {}}
                whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      Submit Inquiry
                    </>
                  )}
                </span>
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                {/* Golden glow */}
                <div className="absolute inset-0 bg-[#D4A24A] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
