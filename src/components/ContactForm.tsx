
import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };
  
  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-md p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm text-terminal-white">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-terminal-gray/30 border border-terminal-gray text-terminal-white rounded p-2 focus:outline-none focus:border-terminal-red transition-colors duration-300"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-terminal-white">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-terminal-gray/30 border border-terminal-gray text-terminal-white rounded p-2 focus:outline-none focus:border-terminal-red transition-colors duration-300"
          />
        </div>
      </div>
      
      <div className="mt-6 space-y-2">
        <label htmlFor="subject" className="block text-sm text-terminal-white">
          Subject
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          value={formData.subject}
          onChange={handleChange}
          className="w-full bg-terminal-gray/30 border border-terminal-gray text-terminal-white rounded p-2 focus:outline-none focus:border-terminal-red transition-colors duration-300"
        />
      </div>
      
      <div className="mt-6 space-y-2">
        <label htmlFor="message" className="block text-sm text-terminal-white">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          value={formData.message}
          onChange={handleChange}
          className="w-full bg-terminal-gray/30 border border-terminal-gray text-terminal-white rounded p-2 focus:outline-none focus:border-terminal-red transition-colors duration-300"
        />
      </div>
      
      <div className="mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="glow-button"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-terminal-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            <span className="flex items-center">
              <Send size={16} className="mr-2" />
              Send Message
            </span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
