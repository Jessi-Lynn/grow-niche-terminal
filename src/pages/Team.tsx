
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import { Link } from 'react-router-dom';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
}

interface Partner {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  websiteUrl: string;
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Jane Doe',
    role: 'CEO & Founder',
    description: 'Jane has over 10 years of experience in automation and workflow optimization. She founded GrowYourNiche to help businesses leverage technology for growth.',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    websiteUrl: 'https://example.com/jane',
  },
  {
    id: '2',
    name: 'John Smith',
    role: 'CTO',
    description: 'John specializes in creating custom automation solutions and blueprints. He has helped dozens of companies streamline their operations.',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    websiteUrl: 'https://example.com/john',
  },
  {
    id: '3',
    name: 'Alex Johnson',
    role: 'Head of Services',
    description: 'Alex oversees our service offerings and ensures that clients receive high-quality implementations that meet their business needs.',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    websiteUrl: 'https://example.com/alex',
  },
];

const partners: Partner[] = [
  {
    id: '1',
    name: 'TechFlow Solutions',
    description: 'TechFlow provides complementary services in cloud infrastructure that integrate seamlessly with our automation solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    websiteUrl: 'https://example.com/techflow',
  },
  {
    id: '2',
    name: 'DataSync Partners',
    description: 'DataSync specializes in data integration services that help our clients maximize the value of their automation blueprints.',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
    websiteUrl: 'https://example.com/datasync',
  },
];

const Team = () => {
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-white">
              Our <span className="text-terminal-red">Team</span>
            </h1>
            
            <p className="text-terminal-white/70 mb-8">
              Meet the experts behind GrowYourNiche who are dedicated to helping your business grow through automation.
            </p>
            
            <Terminal title="terminal@growyourniche: ~/team" className="mx-auto">
              Our team combines technical expertise with business acumen to deliver solutions that drive real results.
            </Terminal>
          </div>
        </div>
      </section>
      
      {/* Team Members Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-terminal-white text-center">
            The <span className="text-terminal-red">Experts</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="glass-panel rounded-lg overflow-hidden transition-all duration-300 hover:border-terminal-red">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={member.imageUrl} 
                    alt={member.name} 
                    className="object-cover w-full h-64"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-terminal-white mb-1">{member.name}</h3>
                  <p className="text-terminal-red mb-3">{member.role}</p>
                  <p className="text-terminal-white/70 mb-4">{member.description}</p>
                  <a 
                    href={member.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-terminal-red hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Partners Section */}
      <section className="py-16 px-4 bg-terminal-gray/5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-terminal-white text-center">
            Our <span className="text-terminal-red">Partners</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner) => (
              <div key={partner.id} className="glass-panel rounded-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3">
                  <img 
                    src={partner.imageUrl} 
                    alt={partner.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="text-xl font-bold text-terminal-white mb-3">{partner.name}</h3>
                  <p className="text-terminal-white/70 mb-4">{partner.description}</p>
                  <a 
                    href={partner.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-terminal-red hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-terminal-red/5 border border-terminal-gray rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
              Join Our Team
            </h2>
            
            <p className="text-terminal-white/70 max-w-2xl mx-auto mb-8">
              We're always looking for talented individuals who are passionate about automation and helping businesses grow.
            </p>
            
            <Link to="/contact" className="glow-button">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Team;
