'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Construction, FileText, ArrowLeft } from 'lucide-react';

export default function ResumeEditPage() {
  const handleBack = () => {
    window.location.href = '/resume-builder';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <motion.div
        className="container mx-auto px-4 py-8 max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Resume Editor</h1>
              <p className="text-muted-foreground">Resume editing feature coming soon.</p>
            </div>
          </div>
        </motion.div>

        {/* Empty State */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="p-12 text-center">
            <Construction className="h-24 w-24 text-muted-foreground/50 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4">Resume Editor Under Development</h3>
            <p className="text-muted-foreground text-lg mb-6 max-w-2xl mx-auto">
              We're working hard to bring you an amazing resume editing experience.
              This feature will be available soon with professional templates,
              AI-powered optimization, and ATS compatibility.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Coming Soon</span>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
