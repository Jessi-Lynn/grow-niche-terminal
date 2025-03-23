
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Terminal from '@/components/Terminal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, user, isLoading, isAdmin, isAuthInitialized } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // Clear error when input changes
  useEffect(() => {
    if (error) setError(null);
  }, [email, password]);

  // Handle redirection for logged-in users
  useEffect(() => {
    if (isAuthInitialized && user) {
      console.log("User authenticated:", user.email);
      
      if (isAdmin) {
        console.log("User is admin, redirecting to admin dashboard");
        setLoginSuccess(true);
        // Short delay before redirect to ensure UI updates
        setTimeout(() => navigate('/admin'), 1000);
      }
    }
  }, [user, isAdmin, isAuthInitialized, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    
    if (formLoading) return;
    
    setFormLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", email);
      await signIn(email, password);
      setLoginSuccess(true);
    } catch (error: any) {
      console.error('Login form error:', error);
      setError(error.message || 'An unexpected error occurred');
      setLoginSuccess(false);
    } finally {
      setFormLoading(false);
    }
  };

  const isButtonDisabled = formLoading || !isAuthInitialized;

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
            {!isAuthInitialized && (
              <Alert className="mb-4 bg-blue-500/10 border-blue-500/50">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Initializing authentication...
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            {loginSuccess && (
              <Alert className="mb-4 bg-green-500/10 border-green-500/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  Login successful! {isAdmin ? "Redirecting to admin dashboard..." : ""}
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
                    disabled={formLoading}
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
                    disabled={formLoading}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-terminal-red hover:bg-terminal-red/80"
                  disabled={isButtonDisabled}
                >
                  {formLoading ? 'Logging in...' : 'Login'}
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
