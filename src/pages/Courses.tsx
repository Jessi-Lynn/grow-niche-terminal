
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import { BookOpen, Clock, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  imageUrl: string;
}

const courses: Course[] = [
  {
    id: '1',
    title: 'Automation Fundamentals',
    description: 'Learn the basics of business process automation and how to identify opportunities for efficiency gains in your organization.',
    duration: '4 weeks',
    level: 'Beginner',
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  },
  {
    id: '2',
    title: 'Blueprint Implementation Masterclass',
    description: 'A deep dive into implementing complex automation blueprints and integrating them with existing business systems.',
    duration: '6 weeks',
    level: 'Intermediate',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
  },
  {
    id: '3',
    title: 'Advanced Workflow Optimization',
    description: 'For experienced professionals looking to take their automation skills to the next level with advanced techniques and strategies.',
    duration: '8 weeks',
    level: 'Advanced',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
  },
];

const Courses = () => {
  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-terminal-white">
              Our <span className="text-terminal-red">Courses</span>
            </h1>
            
            <p className="text-terminal-white/70 mb-8">
              Expand your knowledge and skills with our specialized courses in automation and workflow optimization.
            </p>
            
            <Terminal title="terminal@growyourniche: ~/courses" className="mx-auto">
              Invest in your skills with our expert-led courses designed to help you become an automation specialist.
            </Terminal>
          </div>
        </div>
      </section>
      
      {/* Courses Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-16">
            {courses.map((course, index) => (
              <div 
                key={course.id} 
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 items-center`}
              >
                <div className="md:w-1/2">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="rounded-lg object-cover w-full shadow-lg h-64 md:h-80"
                  />
                </div>
                
                <div className="md:w-1/2">
                  <span className={`inline-block px-3 py-1 rounded text-sm font-medium mb-4 
                    ${course.level === 'Beginner' ? 'bg-green-900/20 text-green-400' : 
                      course.level === 'Intermediate' ? 'bg-blue-900/20 text-blue-400' : 
                      'bg-purple-900/20 text-purple-400'}`}
                  >
                    {course.level}
                  </span>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
                    {course.title}
                  </h2>
                  
                  <p className="text-terminal-white/70 mb-6">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center mb-6">
                    <Clock size={18} className="text-terminal-red mr-2" />
                    <span className="text-terminal-white/80">{course.duration}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mb-8">
                    <span className="bg-terminal-gray/20 px-3 py-1 rounded-full text-sm text-terminal-white/70">Automation</span>
                    <span className="bg-terminal-gray/20 px-3 py-1 rounded-full text-sm text-terminal-white/70">Workflow Design</span>
                    <span className="bg-terminal-gray/20 px-3 py-1 rounded-full text-sm text-terminal-white/70">Integration</span>
                  </div>
                  
                  <Link to="/contact" className="glow-button inline-flex items-center">
                    Learn More
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 px-4 bg-terminal-gray/5">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-terminal-white text-center">
            Why Choose Our <span className="text-terminal-red">Courses</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-6 rounded-lg text-center">
              <div className="text-terminal-red mb-4 flex justify-center">
                <BookOpen size={32} />
              </div>
              <h3 className="text-xl font-bold text-terminal-white mb-3">Expert Instructors</h3>
              <p className="text-terminal-white/70">
                Learn from industry professionals with years of real-world experience in automation and workflow optimization.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg text-center">
              <div className="text-terminal-red mb-4 flex justify-center">
                <Clock size={32} />
              </div>
              <h3 className="text-xl font-bold text-terminal-white mb-3">Flexible Learning</h3>
              <p className="text-terminal-white/70">
                Our courses are designed to fit into your schedule, with both self-paced and structured options available.
              </p>
            </div>
            
            <div className="glass-panel p-6 rounded-lg text-center">
              <div className="text-terminal-red mb-4 flex justify-center">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-terminal-white mb-3">Practical Skills</h3>
              <p className="text-terminal-white/70">
                Focus on real-world applications and hands-on projects that you can immediately apply to your business.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-terminal-red/5 border border-terminal-gray rounded-lg p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-white mb-4">
              Ready to Enhance Your Skills?
            </h2>
            
            <p className="text-terminal-white/70 max-w-2xl mx-auto mb-8">
              Contact us today to learn more about our courses and how they can help advance your career.
            </p>
            
            <Link to="/contact" className="glow-button">
              Get Started
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Courses;
