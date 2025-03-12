
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import Terminal from '@/components/Terminal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // If user is already logged in, redirect to admin
  if (user) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorDetails(null);

    try {
      await signIn(email, password);
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      navigate('/admin');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Extract detailed error information
      const errorMessage = error.message || 'Failed to log in';
      const errorCode = error.code || '';
      
      setErrorDetails(`${errorMessage} (Code: ${errorCode})`);
      
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-md">
          <Terminal title="terminal@growyourniche: ~/login" className="mx-auto mb-8">
            Please log in to access the admin dashboard.
          </Terminal>

          <div className="glass-panel p-6 rounded-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-terminal-black border-terminal-white/20 text-terminal-white"
                  required
                />
              </div>
              
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-terminal-black border-terminal-white/20 text-terminal-white"
                  required
                />
              </div>

              {errorDetails && (
                <div className="bg-red-500/20 border border-red-500/50 p-3 rounded text-sm text-white break-words">
                  <p className="font-mono">Error: {errorDetails}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-terminal-red hover:bg-terminal-red/80"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
