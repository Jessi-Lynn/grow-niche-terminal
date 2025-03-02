
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import { useBlueprint } from '@/hooks/use-blueprint';
import { FileJson, Download, Database, Cloud, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const BlueprintDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blueprint, isLoading, error, handleDownload } = useBlueprint(slug || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-terminal-black">
        <Navbar />
        <div className="pt-32 pb-16 px-4 container mx-auto max-w-6xl">
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-terminal-gray/20 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-terminal-gray/20 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-terminal-gray/20 rounded"></div>
                  <div className="h-4 bg-terminal-gray/20 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blueprint) {
    return (
      <div className="min-h-screen bg-terminal-black">
        <Navbar />
        <div className="pt-32 pb-16 px-4 container mx-auto max-w-6xl">
          <div className="text-center">
            <FileJson size={48} className="text-terminal-red mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-terminal-white mb-4">Blueprint Not Found</h1>
            <p className="text-terminal-white/70 mb-8">
              We couldn't find the blueprint you're looking for. Please check the URL or browse our available blueprints.
            </p>
            <a href="/blueprints" className="glow-button">
              Browse Blueprints
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      <div className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-panel p-8 rounded-lg mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center mb-4">
                  <FileJson size={24} className="text-terminal-red mr-2" />
                  <span className="text-sm text-terminal-white/60 font-mono">{blueprint.category}</span>
                  {blueprint.featured && (
                    <span className="ml-3 bg-terminal-red text-terminal-black text-xs px-2 py-0.5 rounded font-mono">
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold text-terminal-white mb-4">
                  {blueprint.title}
                </h1>
                
                <p className="text-terminal-white/70 mb-6">
                  {blueprint.description}
                </p>
                
                <div className="mb-8">
                  <h2 className="text-lg font-bold text-terminal-white mb-3">Details</h2>
                  <p className="text-terminal-white/70 mb-4">
                    {blueprint.details}
                  </p>
                </div>
                
                {blueprint.requirements && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-terminal-white mb-3">Requirements</h2>
                    <ul className="list-disc pl-5 text-terminal-white/70 space-y-1">
                      {blueprint.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <div className="glass-panel p-6 rounded-lg border border-terminal-gray/30 mb-6">
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-terminal-white">${blueprint.price.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full mb-4 bg-terminal-red hover:bg-terminal-red/80 text-terminal-white flex items-center justify-center gap-2"
                    onClick={handleDownload}
                  >
                    <Download size={16} />
                    Download Blueprint
                  </Button>
                  
                  <Separator className="my-4 bg-terminal-gray/30" />
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Database size={16} className="text-terminal-white/60 mr-2" />
                      <span className="text-sm text-terminal-white/70">Version: {blueprint.version || '1.0.0'}</span>
                    </div>
                    <div className="flex items-center">
                      <Cloud size={16} className="text-terminal-white/60 mr-2" />
                      <span className="text-sm text-terminal-white/70">Instant delivery</span>
                    </div>
                    <div className="flex items-center">
                      <Folder size={16} className="text-terminal-white/60 mr-2" />
                      <span className="text-sm text-terminal-white/70">JSON format</span>
                    </div>
                  </div>
                </div>
                
                <Terminal title="terminal@growyourniche: ~/blueprint" className="text-sm">
                  $ blueprint --download "{blueprint.title}"
                  <br />
                  downloading... done!
                  <br />
                  $ blueprint --verify
                  <br />
                  integrity check... passed
                </Terminal>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BlueprintDetails;
