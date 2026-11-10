'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './navbar';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { pageVariants, pageTransition, navVariants } from '@/lib/animations';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <motion.div
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="will-change-transform"
      >
        <Navbar onMenuToggle={toggleSidebar} />
      </motion.div>

      {/* Sidebar - fixed position */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      {/* Main content */}
      <main className={cn(
        "transition-all duration-300 ease-in-out",
        // Mobile: full width with top padding for navbar
        "pt-14 ml-0",
        // Small screens
        "sm:pt-16",
        // Desktop: add left margin for fixed sidebar (16rem = 256px)
        "lg:ml-64"
      )}>
        <motion.div
          className="w-full py-6 px-4 sm:px-6 md:px-8 lg:px-8 xl:px-12"
          variants={pageVariants}
          initial="initial"
          animate="in"
          exit="out"
          transition={pageTransition}
        >
          <div className="animate-fade-in gpu-accelerated">
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
