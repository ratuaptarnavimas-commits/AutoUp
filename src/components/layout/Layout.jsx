import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';

const Layout = ({ children, scrollToOrderForm }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer onCtaClick={scrollToOrderForm} />
      <Toaster />
    </div>
  );
};

export default Layout;