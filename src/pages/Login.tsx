
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
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, isLoading: authLoading, isAdmin } = useAuth();
  const [email, setEmail] = useState('admin@test.com'); // Pre-filled for easier testing
  const [password, setPassword] = useState('password123'); // Pre-filled for easier testing
  const [isLoading, setIsLoading] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Debug function to check database connection and profiles
  const checkProfiles = async () => {
    try {
      setDebugInfo("Checking database connection...");
      
      // Check if we can access the profiles table
      const { data, error } = await supabase.from('profiles').select('*');
      
      if (error) {
        setDebugInfo(`Database error: ${error.message}`);
        return;
      }
      
      setDebugInfo(`Connected to database. Found ${data?.length || 0} profiles.`);
      
      // Check for admin users
      const adminProfiles = data?.filter(p => p.role === 'admin') || [];
      if (adminProfiles.length > 0) {
        setDebugInfo(prev => `${prev}\nFound ${adminProfiles.length} admin users.`);
      } else {
        setDebugInfo(prev => `${prev}\nNo admin users found in profiles table.`);
      }
    } catch (error) {
      setDebugInfo(`Error checking profiles: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // If user is already logged in, redirect to admin
  useEffect(() => {
    if (user && !authLoading) {
      console.log("User is logged in:", user.email);
      console.log("Is admin:", isAdmin);
      
      if (isAdmin) {
        console.log("Redirecting to admin dashboard...");
        setInfoMessage("Admin privileges detected. Redirecting to admin dashboard...");
        setTimeout(() => navigate('/admin'), 1000);
      } else {
        setInfoMessage("You're logged in but don't have admin privileges.");
        console.log("User doesn't have admin privileges");
      }
    }
    
    if (!authLoading) {
      // Check profiles when component loads and not loading
      checkProfiles();
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
      
      setInfoMessage("Login successful! Checking admin privileges...");
      
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
            Credentials: admin@test.com / password123
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
            
            {debugInfo && (
              <Alert className="mb-4 bg-gray-500/10 border-gray-500/50 text-xs font-mono">
                <AlertDescription className="whitespace-pre-wrap">
                  {debugInfo}
                </AlertDescription>
              </Alert>
            )}
            
            {user ? (
              <div className="text-center">
                <Alert className="mb-4 bg-green-500/10 border-green-500/50">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    You are logged in as <strong>{user.email}</strong>
                  </AlertDescription>
                </Alert>
                
                {isAdmin ? (
                  <Button 
                    onClick={() => navigate('/admin')}
                    className="w-full bg-terminal-red hover:bg-terminal-red/80"
                  >
                    Go to Admin Dashboard
                  </Button>
                ) : (
                  <div>
                    <p className="text-terminal-white/70 mb-4">
                      Your account does not have admin privileges.
                    </p>
                    <Button
                      onClick={checkProfiles}
                      className="w-full bg-terminal-white/10 hover:bg-terminal-white/20 mb-2"
                    >
                      Debug Check
                    </Button>
                  </div>
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
                
                <Button
                  type="button"
                  onClick={checkProfiles}
                  className="w-full bg-terminal-white/10 hover:bg-terminal-white/20"
                >
                  Debug Check
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
