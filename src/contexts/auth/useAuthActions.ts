
import { Dispatch, SetStateAction } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

interface UseAuthActionsProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setSession: Dispatch<SetStateAction<Session | null>>;
  setUser: Dispatch<SetStateAction<User | null>>;
  setIsAdmin: Dispatch<SetStateAction<boolean>>;
  checkAdminStatus: (userId: string) => Promise<void>;
}

export const useAuthActions = ({
  setIsLoading,
  setSession,
  setUser,
  setIsAdmin,
  checkAdminStatus
}: UseAuthActionsProps) => {
  
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      console.log("Attempting to sign in with email:", email);
      
      // Try a direct sign-in approach without pre-cleanup
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        
        // More specific error handling
        if (error.message?.includes("Database error")) {
          toast({
            title: "Service Temporarily Unavailable",
            description: "We're experiencing technical difficulties. Please try again later.",
            variant: "destructive"
          });
          throw new Error("Service temporarily unavailable. Please try again later.");
        }
        
        if (error.message?.includes("Invalid login credentials")) {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect.",
            variant: "destructive"
          });
          throw new Error("Invalid email or password. Please try again.");
        }
        
        // Generic error handling
        toast({
          title: "Login Failed",
          description: error.message || "An unexpected error occurred.",
          variant: "destructive"
        });
        throw error;
      }
      
      if (!data.session || !data.user) {
        toast({
          title: "Login Failed",
          description: "No session data was returned. Please try again.",
          variant: "destructive"
        });
        throw new Error("Login failed: No session data returned");
      }
      
      console.log("Sign in successful for:", data.user.email);
      
      // Set session and user
      setSession(data.session);
      setUser(data.user);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.email}!`,
      });
      
      // Check admin status
      try {
        await checkAdminStatus(data.user.id);
      } catch (adminCheckError) {
        console.error("Admin check error:", adminCheckError);
        // Continue even if admin check fails - the user is still logged in
      }
      
    } catch (error: any) {
      console.error("Sign in exception:", error);
      
      // If no toast has been shown yet, show a generic one
      if (!error.message?.includes("Service temporarily unavailable") && 
          !error.message?.includes("Invalid email or password")) {
        toast({
          title: "Authentication Error",
          description: error.message || "Please try again later.",
          variant: "destructive"
        });
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        toast({
          title: "Sign Out Error",
          description: error.message,
          variant: "destructive"
        });
        throw error;
      }
      
      // Reset state
      setSession(null);
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Sign out exception:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    signOut
  };
};
