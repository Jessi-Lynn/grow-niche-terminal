import { useParams, useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Terminal from '@/components/Terminal';
import { useBlueprint } from '@/hooks/use-blueprint';
import { FileJson, Download, Database, Cloud, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

const BlueprintDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { blueprint, isLoading, error } = useBlueprint(slug || '');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) return;

      try {
        setIsProcessing(true);
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: { sessionId }
        });

        if (error) throw error;

        if (data.verified) {
          toast({
            title: "Payment successful!",
            description: "You can now download the blueprint.",
          });
          handleDownload();
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        toast({
          title: "Payment verification failed",
          description: "Please contact support if you've completed the payment.",
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  const handlePayment = async () => {
    if (!blueprint) return;
    
    try {
      setIsProcessing(true);
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          blueprintId: blueprint.id,
          price: blueprint.price,
          title: blueprint.title
        }
      });

      if (error) throw error;

      window.location.href = data.url;
    } catch (err) {
      console.error('Payment creation error:', err);
      toast({
        title: "Payment setup failed",
        description: "Unable to initiate payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!blueprint) return;
    
    try {
      setIsProcessing(true);
      
      const { data, error } = await supabase.storage
        .from('blueprints')
        .download(blueprint.file_path || '');
      
      if (error) throw error;
      
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = blueprint.file_path?.split('/').pop() || `${blueprint.slug}.json`;
      document.body.appendChild(a);
      a.click();
      
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: "Your blueprint download has started.",
      });
    } catch (err) {
      console.error('Download error:', err);
      toast({
        title: "Download failed",
        description: "There was an error downloading your blueprint",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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
                    onClick={sessionId ? handleDownload : handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : sessionId ? (
                      <>
                        <Download size={16} />
                        Download Blueprint
                      </>
                    ) : (
                      "Purchase Blueprint"
                    )}
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
