'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

export default function ResumeBuilderPage() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [error, setError] = useState(false);

  const resumeBuilderUrl = 'http://localhost:3001';

  useEffect(() => {
    // Start countdown and redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirect = () => {
    setIsRedirecting(true);
    try {
      window.open(resumeBuilderUrl, '_blank', 'noopener,noreferrer');
      // Redirect back to home after opening external app
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err) {
      setError(true);
      setIsRedirecting(false);
    }
  };

  const handleManualRedirect = () => {
    handleRedirect();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Resume Builder
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Redirecting you to our professional ATS Resume Builder...
          </p>
        </motion.div>

        {/* Redirection State */}
        <motion.div className="mb-12" variants={itemVariants}>
          <Card className="p-12 text-center">
            {error ? (
              <>
                <AlertCircle className="h-24 w-24 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4 text-red-600">Connection Error</h3>
                <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                  Unable to connect to the Resume Builder. Please make sure the ATS Resume Builder is running on localhost:3001.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleManualRedirect} className="min-h-[44px]">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={() => window.location.href = '/'} className="min-h-[44px]">
                    Back to Home
                  </Button>
                </div>
              </>
            ) : isRedirecting ? (
              <>
                <Loader2 className="h-24 w-24 text-primary mx-auto mb-6 animate-spin" />
                <h3 className="text-2xl font-semibold mb-4">Opening Resume Builder...</h3>
                <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                  The ATS Resume Builder is opening in a new tab. You'll be redirected back to the home page shortly.
                </p>
              </>
            ) : (
              <>
                <FileText className="h-24 w-24 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">Launching Resume Builder</h3>
                <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
                  You'll be redirected to our professional ATS Resume Builder with advanced templates,
                  AI-powered optimization, and real-time ATS scoring.
                </p>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-3xl font-bold text-primary">{countdown}</div>
                  <span className="text-muted-foreground">seconds remaining</span>
                </div>
                <Button onClick={handleManualRedirect} className="min-h-[44px]">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Now
                </Button>
              </>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

