import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Send } from 'lucide-react';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your inquiry! We will get back to you soon.');
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
    <section id="contact" className="py-20 bg-gradient-to-b from-slate-50 via-white to-amber-50/20 relative overflow-hidden" ref={ref}>
      {/* Background glass effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-[#D4A24A]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-tl from-blue-100/30 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-6 relative">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl mb-4 bg-gradient-to-r from-[#1E293B] to-[#D4A24A] bg-clip-text text-transparent">Contact Us</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#D4A24A] to-[#B8883D] mx-auto rounded-full shadow-lg shadow-[#D4A24A]/30" />
        </motion.div>

        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glass-morphic form container */}
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/60">
            {/* Golden border glow on hover */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4A24A]/20 via-amber-300/10 to-[#D4A24A]/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-900 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <motion.input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>

              <div>
                <label className="block text-gray-900 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>

              <div>
                <label className="block text-gray-900 mb-2">Phone Number</label>
                <motion.input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>

              <div>
                <label className="block text-gray-900 mb-2">Company/Organization</label>
                <motion.input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>

              <div>
                <label className="block text-gray-900 mb-2">
                  Inquiry Type <span className="text-red-500">*</span>
                </label>
                <motion.select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all shadow-sm"
                  whileFocus={{ scale: 1.01 }}
                >
                  <option value="">Select an option</option>
                  <option value="product">Product Information</option>
                  <option value="demo">Request a Demo</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="support">Technical Support</option>
                  <option value="other">Other</option>
                </motion.select>
              </div>

              <div>
                <label className="block text-gray-900 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <motion.textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24A] focus:border-transparent transition-all resize-none shadow-sm"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>

              <motion.button
                type="submit"
                className="relative w-full bg-gradient-to-r from-[#D4A24A] to-[#B8883D] text-white py-4 rounded-xl flex items-center justify-center gap-2 shadow-xl overflow-hidden group"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Submit Inquiry
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