import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { addContactSubmission } from '@/lib/firebase';

const EMAILJS_SERVICE_ID = 'service_ajie1au';
const EMAILJS_TEMPLATE_CONTACT = 'template_g40ybbn';
const EMAILJS_TEMPLATE_AUTOREPLY = 'template_sjwr9ag';
const EMAILJS_PUBLIC_KEY = '4kITqwgwXtJr6ubMM';

const RECIPIENT_EMAILS = [
  'tnagai@usc.edu',
  'pan.anye@gmail.com',
  'test1@gmail.com',
  'derekhua2007@gmail.com',
  'longseanlee@gmail.com',
];

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
      const templateData = {
        name: formData.fullName,
        email: formData.email,
        title: formData.inquiryType,
        phone: formData.phone || 'Not provided',
        company: formData.company || 'Not provided',
        message: formData.message,
        to_email: RECIPIENT_EMAILS.join(','),
      };

      // Save to Firestore inbox
      await addContactSubmission({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        company: formData.company || undefined,
        inquiryType: formData.inquiryType,
        message: formData.message,
      });
      
      // Send notification email to all recipients
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_CONTACT,
          templateData,
          EMAILJS_PUBLIC_KEY
        );
      } catch (contactError: any) {
        console.error('Contact notification failed:', contactError);
        throw contactError;
      }
      
      // Send auto-reply to user
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_AUTOREPLY,
          { ...templateData, to_email: formData.email },
          EMAILJS_PUBLIC_KEY
        );
      } catch (autoReplyError: any) {
        console.warn('Auto-reply failed but contact notification was sent');
      }
      
      setStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: '',
        message: '',
      });
    } catch (error: any) {
      console.error('EmailJS Error:', error);
      setStatus('error');
      const errorText = error?.text || error?.message || 'Unknown error';
      setErrorMessage(`Failed to send: ${errorText}. Please try again or contact us directly.`);
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
    <section id="contact" className="py-12 sm:py-20 bg-[#E8ECF1] relative overflow-hidden" ref={ref}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 text-[#0C2340] font-bold">Contact Us</h2>
          <div className="w-20 sm:w-24 h-1 bg-[#2A8C8F] mx-auto rounded-full" />
        </motion.div>

        <motion.div
          className="relative group"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-sm shadow-md border-l-4 border-[#2A8C8F] p-4 sm:p-6 md:p-8">
            
            {/* Success State - Full replacement of form */}
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 sm:py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                >
                  <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </motion.div>
                
                <h3 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-3">
                  Thank You for Your Inquiry!
                </h3>
                
                <p className="text-gray-600 mb-2 text-sm sm:text-base">
                  Your message has been successfully submitted.
                </p>
                
                <p className="text-gray-600 mb-2 text-sm sm:text-base">
                  A confirmation email has been sent to your inbox.
                </p>
                
                <p className="text-gray-500 text-xs sm:text-sm mb-8">
                  Please check your <strong>spam or junk folder</strong> if you don't see it within a few minutes.
                </p>
                
                <p className="text-gray-600 mb-6 text-sm sm:text-base">
                  We'll get back to you as soon as possible!
                </p>
                
                <motion.button
                  onClick={() => setStatus('idle')}
                  className="relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#2A8C8F] to-[#1E7275] text-white rounded-sm shadow-xl overflow-hidden group text-sm sm:text-base"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="relative z-10">Submit Another Inquiry</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </motion.div>
            ) : (
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#E8ECF1] border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2A8C8F] focus:border-transparent transition-all text-base"
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#E8ECF1] border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2A8C8F] focus:border-transparent transition-all text-base"
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
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#E8ECF1] border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2A8C8F] focus:border-transparent transition-all text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 mb-1.5 sm:mb-2 text-sm sm:text-base">Company/Organization</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#E8ECF1] border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2A8C8F] focus:border-transparent transition-all text-base"
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#E8ECF1] border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2A8C8F] focus:border-transparent transition-all text-base appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%232A8C8F' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
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
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-[#E8ECF1] border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#2A8C8F] focus:border-transparent transition-all resize-none text-base"
                  />
                </div>

                {/* Error Message */}
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
                  className={`relative w-full bg-[#2A8C8F] hover:bg-[#1E7275] text-white py-3 sm:py-4 rounded-sm flex items-center justify-center gap-2 shadow-md overflow-hidden group text-sm sm:text-base transition-colors ${
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
                  
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
