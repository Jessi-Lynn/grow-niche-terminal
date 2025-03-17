
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
import { AlertTriangle, Info } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, isLoading: authLoading, isAdmin } = useAuth();
  const [email, setEmail] = useState('admin@test.com'); // Pre-filled for easier testing
  const [password, setPassword] = useState('password123'); // Pre-filled for easier testing
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // If user is already logged in, redirect to admin
  useEffect(() => {
    if (user && !authLoading) {
      console.log("User is logged in:", user.email);
      console.log("Is admin:", isAdmin);
      
      if (isAdmin) {
        console.log("Redirecting to admin dashboard...");
        navigate('/admin');
      } else {
        setInfoMessage("You're logged in but don't have admin privileges.");
        console.log("User doesn't have admin privileges");
      }
    }
  }, [user, authLoading, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorDetails(null);
    setInfoMessage(null);

    try {
      console.log("Starting login process...");
      await signIn(email, password);
      
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      
      // Navigation is handled by the useEffect
      console.log("Login successful, waiting for redirect...");
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Extract detailed error information
      let errorMessage = 'Failed to log in';
      
      // Handle specific error cases
      if (error.message) {
        if (error.message.includes('Invalid login')) {
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
            
            {infoMessage && (
              <Alert className="mb-4 bg-blue-500/10 border-blue-500/50">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {infoMessage}
                </AlertDescription>
              </Alert>
            )}
            
            {user ? (
              <div className="text-center">
                <p className="text-terminal-white mb-4">
                  You are already logged in as <strong>{user.email}</strong>
                </p>
                {isAdmin ? (
                  <Button 
                    onClick={() => navigate('/admin')}
                    className="w-full bg-terminal-red hover:bg-terminal-red/80"
                  >
                    Go to Admin Dashboard
                  </Button>
                ) : (
                  <p className="text-terminal-white/70">
                    Your account does not have admin privileges.
                  </p>
                )}
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
