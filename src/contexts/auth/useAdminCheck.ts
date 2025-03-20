
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

export const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to check if user has admin privileges
  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user ID:', userId);
      
      // Check admin status using maybeSingle to avoid errors
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }
      
      const isUserAdmin = data?.role === 'admin';
      console.log(`User admin status: ${isUserAdmin ? 'ADMIN' : 'NOT ADMIN'}`);
      setIsAdmin(isUserAdmin);
    } catch (error) {
      console.error('Exception in admin status check:', error);
      setIsAdmin(false);
    }
  };

  return {
    isAdmin,
    setIsAdmin,
    checkAdminStatus,
  };
};
