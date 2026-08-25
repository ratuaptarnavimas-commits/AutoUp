import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deletedPromotions, setDeletedPromotions] = useState([]);

  useEffect(() => {
    // Check localStorage on mount for auth
    const storedAuth = localStorage.getItem('adminAuth');
    if (storedAuth === 'true') {
      setIsAdmin(true);
    }

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

    setIsLoading(false);
  }, []);

  const loginAdmin = (password) => {
    if (password === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('adminAuth');
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