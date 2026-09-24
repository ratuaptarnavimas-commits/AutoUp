import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [deletedPromotions, setDeletedPromotions] = useState([]);

  useEffect(() => {
    let mounted = true;

    const updateAdminStatus = async (nextSession) => {
      let authenticatedUser = nextSession?.user || null;

      if (nextSession) {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Nepavyko patikrinti Supabase vartotojo.', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
          });
          authenticatedUser = null;
        } else {
          authenticatedUser = data.user;
        }
      }

      if (mounted) {
        setSession(nextSession || null);
        setUser(authenticatedUser);
        setIsAdmin(authenticatedUser?.app_metadata?.role === 'admin');
      }
    };

    supabase.auth.getSession().then(async ({ data: { session: currentSession }, error }) => {
      if (error) {
        console.error('Nepavyko gauti Supabase sesijos.', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
      }
      await updateAdminStatus(currentSession);
      if (mounted) setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await updateAdminStatus(session);
      if (mounted) setIsLoading(false);
    });

    // Check localStorage for deleted promotions
    const storedDeleted = localStorage.getItem('deletedPromotions');
    if (storedDeleted) {
      try {
        setDeletedPromotions(JSON.parse(storedDeleted));
      } catch (e) {
        console.error("Failed to parse deletedPromotions", e);
        setDeletedPromotions([]);
      }
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginAdmin = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) return false;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || userData.user?.app_metadata?.role !== 'admin') {
      await supabase.auth.signOut();
      return false;
    }

    return true;
  };

  const logoutAdmin = async () => {
    await supabase.auth.signOut();
  };

  const markPromotionAsDeleted = (promotionId) => {
    setDeletedPromotions((prev) => {
      if (prev.includes(promotionId)) return prev;
      const newDeleted = [...prev, promotionId];
      localStorage.setItem('deletedPromotions', JSON.stringify(newDeleted));
      return newDeleted;
    });
  };

  const isPromotionDeleted = (promotionId) => {
    return deletedPromotions.includes(promotionId);
  };

  const restoreDeletedPromotion = (promotionId) => {
    setDeletedPromotions((prev) => {
      const newDeleted = prev.filter((id) => id !== promotionId);
      localStorage.setItem('deletedPromotions', JSON.stringify(newDeleted));
      return newDeleted;
    });
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      isLoading,
      session,
      user,
      loginAdmin,
      logoutAdmin,
      markPromotionAsDeleted,
      isPromotionDeleted,
      restoreDeletedPromotion,
      deletedPromotions
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};