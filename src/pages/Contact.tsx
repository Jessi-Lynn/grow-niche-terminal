
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (data: any) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      <div className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-white">
              <span className="text-terminal-red">Contact</span> Us
            </h1>
            <p className="text-terminal-white/70 max-w-2xl mx-auto">
              Have questions about our blueprints or services? Need custom automation solutions?
              We're here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-terminal-white">Get in Touch</h2>
              <p className="text-terminal-white/70 mb-6">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-terminal-red/10 flex items-center justify-center rounded mr-4">
                    <span className="text-terminal-red">📧</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-terminal-white">Email</h3>
                    <p className="text-terminal-white/70">support@growyourniche.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-terminal-red/10 flex items-center justify-center rounded mr-4">
                    <span className="text-terminal-red">📱</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-terminal-white">Phone</h3>
                    <p className="text-terminal-white/70">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-terminal-red/10 flex items-center justify-center rounded mr-4">
                    <span className="text-terminal-red">🌐</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-terminal-white">Social Media</h3>
                    <div className="flex gap-4 mt-2">
                      <a href="#" className="text-terminal-white hover:text-terminal-red transition-colors">Twitter</a>
                      <a href="#" className="text-terminal-white hover:text-terminal-red transition-colors">LinkedIn</a>
                      <a href="#" className="text-terminal-white hover:text-terminal-red transition-colors">GitHub</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
