import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletedPromotions, setDeletedPromotions] = useState([]);

  useEffect(() => {
    let mounted = true;

    const updateAdminStatus = (session) => {
      const user = session?.user;
      const configuredAdminEmail = import.meta.env.VITE_ADMIN_EMAIL?.toLowerCase();
      const hasAdminRole = user?.app_metadata?.role === 'admin';
      const isConfiguredAdmin = configuredAdminEmail && user?.email?.toLowerCase() === configuredAdminEmail;

      if (mounted) setIsAdmin(Boolean(user && (hasAdminRole || isConfiguredAdmin)));
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      updateAdminStatus(session);
      if (mounted) setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      updateAdminStatus(session);
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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
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