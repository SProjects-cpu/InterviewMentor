'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {

  return (
    <nav className={cn(
      "fixed top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border",
      // Mobile: full width
      "left-0 right-0",
      // Desktop: account for sidebar width (16rem = 256px)
      "lg:left-64 lg:right-0"
    )}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          {/* Left side - Menu button and Brand */}
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuToggle}
              className="lg:hidden h-9 w-9 flex-shrink-0"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-base md:text-lg hover:text-primary transition-colors"
            >
              <User className="h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Interview Mentor</span>
              <span className="sm:hidden">IM</span>
            </Link>
          </div>

          {/* Right side - Navigation links */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Features
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
            >
              Testimonials
            </Link>
            <Button asChild size="sm">
              <Link href="/aptitude">
                Get Started
              </Link>
            </Button>
          </div>

          {/* Mobile: Get Started button only */}
          <div className="md:hidden">
            <Button asChild size="sm" className="text-xs px-3">
              <Link href="/aptitude">
                Start
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
