
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import Terminal from '@/components/Terminal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('admin@test.com'); // Pre-filled for easier testing
  const [password, setPassword] = useState('password123'); // Pre-filled for easier testing
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  // If user is already logged in, redirect to admin
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/admin');
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorDetails(null);

    try {
      await signIn(email, password);
      
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      
      // Navigate is handled by the useEffect
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Extract detailed error information
      let errorMessage = 'Failed to log in';
      
      // Handle specific error cases
      if (error.message) {
        if (error.message.includes('confirmation_token')) {
          errorMessage = 'This appears to be a Supabase database schema issue. Please make sure your Supabase project is properly set up with the auth schema and RLS policies.';
        } else if (error.message.includes('Invalid login')) {
          errorMessage = 'Invalid email or password';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please confirm your email before logging in';
        } else {
          errorMessage = error.message;
        }
      }
      
      // Format error code if available
      const errorCode = error.code || error.status || '';
      const displayError = errorCode ? `${errorMessage} (Code: ${errorCode})` : errorMessage;
      
      setErrorDetails(displayError);
      
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If still checking auth state, show loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-terminal-black flex items-center justify-center">
        <p className="text-terminal-white">Loading authentication status...</p>
      </div>
    );
  }

  // If already logged in, don't render the form (useEffect will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-terminal-black">
      <Navbar />
      
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-md">
          <Terminal title="terminal@growyourniche: ~/login" className="mx-auto mb-8">
            Please log in to access the admin dashboard.
          </Terminal>

          <div className="glass-panel p-6 rounded-md">
            {errorDetails && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {errorDetails}
                </AlertDescription>
              </Alert>
            )}
            
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
