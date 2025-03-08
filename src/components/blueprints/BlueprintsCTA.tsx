
import { Link } from 'react-router-dom';

const BlueprintsCTA = () => {
  return (
    <div className="bg-terminal-gray/10 border border-terminal-gray rounded-lg p-8 text-center">
      <h2 className="text-2xl font-bold text-terminal-white mb-4">
        Don't See What You Need?
      </h2>
      
      <p className="text-terminal-white/70 max-w-2xl mx-auto mb-6">
        We can create custom blueprints tailored to your specific business requirements and workflows.
      </p>
      
      <Link to="/contact" className="glow-button">
        Request Custom Blueprint
      </Link>
    </div>
  );
};

export default BlueprintsCTA;
