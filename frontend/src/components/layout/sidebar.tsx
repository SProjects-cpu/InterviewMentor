'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import { useTheme } from '@/lib/theme-provider';
import {
  Home,
  FileText,
  GraduationCap,
  Brain,
  Code,
  User,
  Settings,
  Info,
  Book,
  TrendingUp,
  Award,
  Users,
  HelpCircle,
  Bell,
  Star,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/dashboard', icon: TrendingUp, label: 'Dashboard' },
  { href: '/aptitude', icon: Brain, label: 'Aptitude Test' },
  { href: '/coding-test', icon: Code, label: 'AI Coding Test' },
  { href: '/career-guidance', icon: GraduationCap, label: 'Career Guidance' },
  { href: process.env.NEXT_PUBLIC_RESUME_BUILDER_URL || 'http://localhost:3001', icon: FileText, label: 'Resume Builder', external: true },
  { href: '/profile', icon: User, label: 'Profile' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const additionalItems = [
  { href: '/resources', icon: Book, label: 'Resources' },
  { href: '/progress', icon: TrendingUp, label: 'Progress Tracker' },
  { href: '/certifications', icon: Award, label: 'Certifications' },
  { href: '/community', icon: Users, label: 'Community' },
  { href: '/help', icon: HelpCircle, label: 'Help & Support' },
  { href: '/notifications', icon: Bell, label: 'Notifications' },
  { href: '/premium', icon: Star, label: 'Premium Features' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme, actualTheme } = useTheme();
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    if (!mounted) return Monitor; // Default icon during SSR
    if (theme === 'light') return Sun;
    if (theme === 'dark') return Moon;
    return Monitor;
  };

  const ThemeIcon = getThemeIcon();

  const getThemeTitle = () => {
    if (!mounted) return 'Current theme: system'; // Default during SSR
    return `Current theme: ${theme}`;
  };



  return (
    <>
      {/* Overlay for mobile and tablet (including medium screens) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          // Base styles - fixed positioning for all screen sizes
          'fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-50',
          'transform transition-transform duration-300 ease-in-out',
          'shadow-lg lg:shadow-none',
          // Mobile/tablet: hidden by default, show when open
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop (lg+): always visible
          'lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-border">
          <h4 className="font-semibold text-base md:text-lg">Menu</h4>
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-7 w-7 md:h-8 md:w-8 hover-scale"
              title={getThemeTitle()}
            >
              <ThemeIcon className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-7 w-7 md:h-8 md:w-8 lg:hidden"
            >
              <X className="h-3 w-3 md:h-4 md:w-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-4">
          <ul className="space-y-1 sm:space-y-1 md:space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href && !item.external;

              return (
                <li key={item.href}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'flex items-center gap-2 sm:gap-2 md:gap-3 px-2 sm:px-2 md:px-3 py-2 rounded-md text-xs sm:text-xs md:text-sm font-medium transition-colors',
                        'min-h-[40px] sm:min-h-[40px] md:min-h-[44px]', // Ensure consistent touch targets
                        'w-full overflow-hidden',
                        'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                    >
                      <Icon className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-xs md:text-sm">{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2 sm:gap-2 md:gap-3 px-2 sm:px-2 md:px-3 py-2 rounded-md text-xs sm:text-xs md:text-sm font-medium transition-colors',
                        'min-h-[40px] sm:min-h-[40px] md:min-h-[44px]', // Ensure consistent touch targets
                        'w-full overflow-hidden',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                    >
                      <Icon className="h-4 w-4 sm:h-4 sm:w-4 md:h-5 md:w-5 flex-shrink-0" />
                      <span className="truncate text-xs sm:text-xs md:text-sm">{item.label}</span>
                    </Link>
                  )}
                </li>
              );
            })}

            {/* About Dropdown */}
            <li>
              <button
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="flex items-center justify-between w-full px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[36px] md:min-h-[40px]"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <Info className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="truncate">About</span>
                </div>
                <ChevronDown
                  className={cn(
                    'h-3 w-3 md:h-4 md:w-4 transition-transform flex-shrink-0',
                    isAboutOpen && 'rotate-180'
                  )}
                />
              </button>
              {isAboutOpen && (
                <ul className="mt-1 md:mt-2 ml-5 md:ml-7 space-y-1">
                  <li>
                    <Link
                      href="/about"
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-md text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[32px]"
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                    >
                      <Info className="h-2 w-2 md:h-3 md:w-3 flex-shrink-0" />
                      <span className="truncate">About Us</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-md text-xs md:text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors min-h-[32px]"
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                    >
                      <Info className="h-2 w-2 md:h-3 md:w-3 flex-shrink-0" />
                      <span className="truncate">Contact Details</span>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Additional Items */}
            {additionalItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-colors',
                      'min-h-[36px] md:min-h-[40px]', // Ensure consistent touch targets
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                    onClick={() => {
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                  >
                    <Icon className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              );
            })}


          </ul>
        </nav>
      </div>
    </>
  );
}
