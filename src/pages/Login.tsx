
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Terminal from '@/components/Terminal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, isLoading: authLoading, isAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Clear error when email or password changes
  useEffect(() => {
    if (error) setError(null);
  }, [email, password]);

  // Handle redirection if user is already logged in
  useEffect(() => {
    if (user && !authLoading) {
      console.log("User is logged in:", user.email, "isAdmin:", isAdmin);
      
      if (isAdmin) {
        setMessage("Admin privileges detected. Redirecting to admin dashboard...");
        const timer = setTimeout(() => navigate('/admin'), 2000);
        return () => clearTimeout(timer);
      } else {
        setMessage("You're logged in but don't have admin privileges.");
      }
    }
  }, [user, authLoading, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    setMessage("Attempting to log in...");

    try {
      await signIn(email, password);
      setMessage("Login successful! Checking privileges...");
      // Navigation is handled by the useEffect
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'An unexpected error occurred');
      setMessage(null);
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
            <p>Please log in with your admin credentials to access the admin dashboard.</p>
            <p className="mt-2 text-terminal-white/70">Contact your administrator if you need access.</p>
          </Terminal>

          <div className="glass-panel p-6 rounded-md">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {message && (
              <Alert className="mb-4 bg-blue-500/10 border-blue-500/50">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {message}
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
