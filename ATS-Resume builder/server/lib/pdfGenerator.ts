import { ResumeContent } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as crypto from "crypto";
import { exec } from "child_process";
import { promisify } from "util";
import puppeteer from 'puppeteer';

// Alternative PDF generation imports
import { chromium } from 'playwright';

const execAsync = promisify(exec);

/**
 * ALTERNATIVE PDF GENERATION APPROACHES
 *
 * Current implementation uses Puppeteer/wkhtmltopdf but produces poor quality results.
 * Below are recommended alternative approaches for professional-quality PDF generation:
 *
 * 1. @react-pdf/renderer (RECOMMENDED)
 *    - Native PDF generation without browser dependency
 *    - Precise layout control with React components
 *    - Excellent font rendering and typography
 *    - Professional-quality output
 *    - Installation: npm install @react-pdf/renderer
 *
 * 2. Playwright PDF Generation
 *    - More modern and reliable than Puppeteer
 *    - Better font rendering and CSS support
 *    - Installation: npm install playwright
 *
 * 3. PDFMake
 *    - Declarative document definition
 *    - Excellent for structured documents
 *    - Installation: npm install pdfmake
 *
 * 4. Canvas-based PDF (html2canvas + jsPDF)
 *    - Pixel-perfect rendering
 *    - Installation: npm install html2canvas jspdf
 *
 * 5. Server-side rendering with Chrome/Chromium
 *    - Use Chrome's native PDF generation
 *    - Better than Puppeteer for some use cases
 */

/**
 * Intelligent PDF Generation Strategy (2024 Enhanced)
 *
 * Automatically selects the best PDF generation method based on:
 * - Content complexity
 * - Template requirements
 * - Performance considerations
 * - Quality requirements
 */
export async function generatePDF(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  console.log("=== PDF GENERATION STARTED ===");
  console.log(`Template: ${template}`);
  console.log(`Content: ${JSON.stringify(resumeContent, null, 2).substring(0, 200)}...`);

  // Analyze content complexity to determine optimal generation method
  const contentComplexity = analyzeContentComplexity(resumeContent, template);

  console.log(`PDF Generation Strategy: ${contentComplexity.strategy} (complexity: ${contentComplexity.score})`);
  console.log(`Complexity factors:`, contentComplexity.factors);

  // Strategy 1: React-PDF for simple to moderate content (HIGHEST QUALITY)
  if (contentComplexity.strategy === 'react-pdf') {
    try {
      console.log("🚀 Attempting PDF generation with Enhanced React-PDF...");
      const reactPdfBuffer = await generatePDFWithReactPDF(resumeContent, template);
      console.log("✅ Enhanced React-PDF generation successful");
      return reactPdfBuffer;
    } catch (reactPdfError) {
      console.error("❌ Enhanced React-PDF generation failed:", reactPdfError);
      // Fall through to next strategy
    }
  }

  // Strategy 2: Enhanced Playwright for complex layouts (HIGH QUALITY)
  try {
    console.log("🎭 Attempting PDF generation with Enhanced Playwright...");
    const playwrightBuffer = await generatePDFWithPlaywright(resumeContent, template);
    console.log("✅ Enhanced Playwright PDF generation successful");
    return playwrightBuffer;
  } catch (playwrightError) {
    console.error("❌ Enhanced Playwright PDF generation failed:", playwrightError);

    // Strategy 3: React-PDF fallback if not tried yet
    if (contentComplexity.strategy !== 'react-pdf') {
      try {
        console.log("🔄 Attempting fallback PDF generation with React-PDF...");
        const reactPdfBuffer = await generatePDFWithReactPDF(resumeContent, template);
        console.log("✅ React-PDF fallback generation successful");
        return reactPdfBuffer;
      } catch (reactPdfError) {
        console.error("❌ React-PDF fallback generation failed:", reactPdfError);
      }
    }

    // Strategy 4: Enhanced Puppeteer fallback
    let browser;
    try {
      console.log("Attempting fallback PDF generation with enhanced Puppeteer...");
      const html = generateHTMLForTemplate(resumeContent, template, true); // Use fullPage optimization

        browser = await puppeteer.launch({
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--run-all-compositor-stages-before-draw',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--disable-background-timer-throttling',
            '--disable-ipc-flooding-protection',
            '--font-render-hinting=none',
            '--force-color-profile=srgb'
          ]
        });

        const page = await browser.newPage();

        // Enhanced viewport settings for better PDF quality and full page utilization
        await page.setViewport({
          width: 816,   // A4 width + buffer for better rendering
          height: 1156, // A4 height + buffer for better rendering
          deviceScaleFactor: 1.5 // Balanced DPI for quality vs performance
        });

        // Emulate print media for better CSS handling
        await page.emulateMediaType('print');

        // Set content with enhanced wait conditions
        await page.setContent(html, {
          waitUntil: ['networkidle0', 'domcontentloaded', 'load']
        });

        // Wait for fonts to load completely
        await page.evaluateHandle('document.fonts.ready');

        // Additional wait for any remaining rendering and layout stabilization
        // Extra time for Tokyo template contact layout
        const waitTime = template === 'tokyo' ? 4000 : 3000;
        await new Promise(resolve => setTimeout(resolve, waitTime));

        // Enhanced PDF generation settings for full page utilization
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
          margin: {
            top: '0.4in',    // Reduced margins for better space utilization
            right: '0.4in',
            bottom: '0.4in',
            left: '0.4in'
          },
          preferCSSPageSize: false, // Let PDF control the page size
          displayHeaderFooter: false,
          tagged: true, // For accessibility
          outline: false,
          scale: 1.0, // Ensure 1:1 scaling
          width: '8.27in',  // Explicit A4 width
          height: '11.69in' // Explicit A4 height
        });

        console.log("Enhanced Puppeteer PDF generation successful");
        return Buffer.from(pdfBuffer);

      } catch (puppeteerError) {
        console.error("Enhanced Puppeteer failed, trying basic Puppeteer...");

        // Fallback to basic Puppeteer with different settings
        try {
          const fallbackBuffer = await generatePDFWithBasicPuppeteer(resumeContent, template);
          console.log("Basic Puppeteer PDF generation successful");
          return fallbackBuffer;
        } catch (basicError) {
          console.error("Basic Puppeteer failed, trying wkhtmltopdf...");

          // Final fallback to wkhtmltopdf
          try {
            const wkBuffer = await generatePDFWithWkhtmltopdf(resumeContent, template);
            console.log("wkhtmltopdf PDF generation successful");
            return wkBuffer;
          } catch (wkError) {
            console.error("All PDF generation methods failed:", wkError);
            throw new Error("PDF generation failed - All methods exhausted");
          }
        }
      } finally {
        if (browser) {
          await browser.close();
        }
      }
  }
}

/**
 * Analyze Content Complexity for Optimal PDF Generation Strategy
 */
function analyzeContentComplexity(resumeContent: ResumeContent, template: string) {
  let complexityScore = 0;
  let strategy: 'react-pdf' | 'playwright' = 'react-pdf';

  // Analyze content volume
  const experienceCount = resumeContent.experience.length;
  const educationCount = resumeContent.education.length;
  const skillsCount = resumeContent.skills.length;
  const totalSections = [
    resumeContent.summary,
    ...resumeContent.experience,
    ...resumeContent.education,
    ...resumeContent.skills,
    ...(resumeContent.certifications || []),
    ...(resumeContent.projects || []),
    ...(resumeContent.languages || []),
    ...(resumeContent.volunteer || [])
  ].filter(Boolean).length;

  // Content volume scoring
  complexityScore += Math.min(experienceCount * 2, 10);
  complexityScore += Math.min(educationCount * 1, 5);
  complexityScore += Math.min(skillsCount * 0.1, 3);
  complexityScore += Math.min(totalSections * 0.5, 8);

  // Template complexity scoring
  const templateComplexity = {
    'stockholm': 2,
    'berlin': 2,
    'tokyo': 3,
    'modern': 4,
    'minimalist': 1,
    'creative': 5
  };
  complexityScore += templateComplexity[template as keyof typeof templateComplexity] || 3;

  // Description complexity
  const totalDescriptions = resumeContent.experience.reduce((acc, exp) =>
    acc + (exp.description?.length || 0), 0
  );
  complexityScore += Math.min(totalDescriptions * 0.2, 5);

  // Strategy selection based on complexity
  if (complexityScore <= 15) {
    strategy = 'react-pdf'; // Use React-PDF for simple to moderate content (best quality)
  } else {
    strategy = 'playwright'; // Use enhanced Playwright for complex content
  }

  return {
    score: Math.round(complexityScore),
    strategy,
    factors: {
      experienceCount,
      educationCount,
      skillsCount,
      totalSections,
      totalDescriptions,
      template
    }
  };
}

/**
 * Playwright PDF Generation Implementation
 *
 * This function uses Playwright instead of Puppeteer for better reliability and quality.
 * Playwright generally produces better font rendering and CSS support.
 *
 * ENHANCED FOR FULL A4 PAGE UTILIZATION
 */
async function generatePDFWithPlaywright(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  const browser = await chromium.launch({
    headless: true,
    args: [
      // Enhanced 2024 Playwright args for professional PDF generation
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--run-all-compositor-stages-before-draw',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-background-timer-throttling',
      '--force-color-profile=srgb',
      '--disable-background-media-suspend',
      // 2024 enhancements for better font rendering
      '--font-render-hinting=none',
      '--enable-font-antialiasing',
      '--disable-lcd-text',
      '--force-device-scale-factor=2',
      '--high-dpi-support=1',
      '--force-prefers-reduced-motion',
      // Memory and performance optimizations
      '--memory-pressure-off',
      '--max_old_space_size=4096',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--mute-audio',
      '--no-first-run',
      '--safebrowsing-disable-auto-update'
    ]
  });

  try {
    const context = await browser.newContext({
      viewport: {
        // Professional A4 dimensions optimized for 2024 standards
        width: 794,   // A4 width at 96 DPI (8.27in * 96)
        height: 1123, // A4 height at 96 DPI (11.69in * 96)
      },
      deviceScaleFactor: 2.0, // High DPI for crisp text and graphics
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      },
      // Enhanced context options for professional output
      reducedMotion: 'reduce',
      forcedColors: 'none',
      colorScheme: 'light'
    });

    const page = await context.newPage();

    // Enhanced media emulation for professional print output
    await page.emulateMedia({
      media: 'print',
      colorScheme: 'light',
      reducedMotion: 'reduce'
    });

    // Inject enhanced CSS for professional PDF output
    await page.addStyleTag({
      content: `
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            font-synthesis: none;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-feature-settings: "kern" 1, "liga" 1;
          }

          .ats-score-overlay {
            display: none !important;
            visibility: hidden !important;
          }

          /* Enhanced typography for professional output */
          h1, h2, h3, h4, h5, h6 {
            font-weight: 600;
            letter-spacing: -0.025em;
          }

          p, li, span {
            font-weight: 400;
            line-height: 1.5;
          }

          /* Ensure consistent spacing */
          .resume-content {
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `
    });

    // Enhanced HTML generation with professional optimization
    const html = generateHTMLForTemplate(resumeContent, template, true);
    await page.setContent(html, {
      waitUntil: 'networkidle',
      timeout: 60000
    });

    // Add enhanced CSS for Tokyo template contact section PDF rendering
    await page.addStyleTag({
      content: `
        /* Enhanced Tokyo template contact icons and layout for PDF */
        .tokyo-contact-icon {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 16px !important;
          height: 16px !important;
          border-radius: 50% !important;
          background-color: rgba(220, 38, 38, 0.15) !important;
          color: rgb(220, 38, 38) !important;
          font-size: 11px !important;
          font-weight: 700 !important;
          margin-right: 8px !important;
          flex-shrink: 0 !important;
          text-align: center !important;
          line-height: 1 !important;
          min-width: 16px !important;
        }

        .tokyo-contact-icon.email::before {
          content: "@" !important;
          font-weight: 700 !important;
          font-size: 12px !important;
        }

        .tokyo-contact-icon.phone::before {
          content: "☎" !important;
          font-size: 10px !important;
        }

        .tokyo-contact-icon.location::before {
          content: "📍" !important;
          font-size: 10px !important;
        }

        .tokyo-contact-icon.linkedin::before {
          content: "in" !important;
          font-weight: 700 !important;
          font-size: 9px !important;
          text-transform: lowercase !important;
        }

        .tokyo-contact-item {
          display: flex !important;
          align-items: center !important;
          margin-bottom: 6px !important;
          font-size: 12px !important;
          color: rgb(51, 65, 85) !important;
          line-height: 1.25 !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          min-height: 20px !important;
          width: 100% !important;
        }

        .tokyo-contact-text {
          flex: 1 !important;
          min-width: 0 !important;
          word-break: break-word !important;
          overflow-wrap: break-word !important;
          font-size: 12px !important;
          color: rgb(51, 65, 85) !important;
        }

        .tokyo-sidebar-header {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
          padding: 12px !important;
          background-color: rgb(254, 242, 242) !important;
          width: 25% !important;
        }

        /* Ensure proper spacing between contact items - equivalent to space-y-1 */
        .tokyo-sidebar-header > .tokyo-contact-item:not(:last-child) {
          margin-bottom: 8px !important;
        }

        .tokyo-sidebar-header > .tokyo-contact-item:last-child {
          margin-bottom: 0 !important;
        }
      `
    });

    // Professional font loading sequence
    await page.waitForFunction(() => document.fonts.ready);
    await page.waitForFunction(() => document.readyState === 'complete');

    // Enhanced wait for layout stabilization and CSS application
    await page.waitForTimeout(3000);

    // Additional check for any lazy-loaded content
    await page.waitForFunction(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).every(img => img.complete);
    }, { timeout: 10000 }).catch(() => {
      console.log('Some images may not have loaded completely');
    });

    // Professional PDF generation with 2024 best practices
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      tagged: true, // Accessibility compliance
      outline: false,
      scale: 1.0
    });

    console.log("Enhanced Playwright PDF generation successful");
    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

/**
 * React-PDF Generation Implementation (Enhanced 2024)
 *
 * This function uses @react-pdf/renderer for native PDF generation.
 * Provides the highest quality output with precise typography and layout control.
 * Enhanced with professional fonts, advanced styling, and template-specific optimizations.
 */
async function generatePDFWithReactPDF(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  try {
    console.log("🔍 Checking React-PDF availability...");

    // Dynamic import to handle if @react-pdf/renderer is not available
    const ReactPDF = await import('@react-pdf/renderer');
    console.log("✅ React-PDF imported successfully");

    const { renderToBuffer, Font } = ReactPDF;

    // Register professional fonts for better typography
    console.log("🎨 Registering professional fonts...");
    await registerProfessionalFonts(Font);

    // Get the appropriate React-PDF template component with enhanced styling
    console.log("📄 Creating React-PDF template component...");
    const TemplateComponent = await createEnhancedReactPDFTemplate(resumeContent, template);

    // Render to buffer (React-PDF v4 API)
    console.log("🔄 Rendering PDF buffer...");
    const pdfBuffer = await renderToBuffer(TemplateComponent);

    console.log("✅ Enhanced React-PDF generation successful, buffer size:", pdfBuffer.length);
    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("❌ Enhanced React-PDF generation failed:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", errorMessage);
    if (errorStack) console.error("Error stack:", errorStack);
    throw new Error(`React-PDF generation failed: ${errorMessage}`);
  }
}

/**
 * Register Professional Fonts for Enhanced Typography
 */
async function registerProfessionalFonts(Font: any) {
  try {
    // Register Inter font family for modern, professional look
    Font.register({
      family: 'Inter',
      fonts: [
        {
          src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
          fontWeight: 400,
        },
        {
          src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fAZ9hiJ-Ek-_EeA.woff2',
          fontWeight: 500,
        },
        {
          src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',
          fontWeight: 600,
        },
        {
          src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hiJ-Ek-_EeA.woff2',
          fontWeight: 700,
        }
      ]
    });

    // Register Playfair Display for elegant headers
    Font.register({
      family: 'Playfair Display',
      fonts: [
        {
          src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtXK-F2qO0isEw.woff2',
          fontWeight: 400,
        },
        {
          src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeFvXDXbtXK-F2qO0isEw.woff2',
          fontWeight: 600,
        },
        {
          src: 'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeHvXDXbtXK-F2qO0isEw.woff2',
          fontWeight: 700,
        }
      ]
    });

    console.log("Professional fonts registered successfully");
  } catch (error) {
    console.warn("Font registration failed, using system fonts:", error);
  }
}

/**
 * Create Enhanced React-PDF Template Component with Professional Styling
 */
async function createEnhancedReactPDFTemplate(resumeContent: ResumeContent, template: string) {
  // Use dynamic import for React-PDF components in ES module environment
  const React = await import('react');
  const ReactPDF = await import('@react-pdf/renderer');
  const { Document, Page, Text, View, StyleSheet } = ReactPDF;

  // Create a simple React component using JSX-like syntax
  const createElement = React.default.createElement;

  const { personalInfo, summary, experience, education, skills } = resumeContent;

  // Enhanced styles with professional typography and template-specific colors
  const getTemplateColor = (template: string) => {
    switch (template) {
      case 'stockholm': return '#0D9488';
      case 'berlin': return '#2563EB';
      case 'tokyo': return '#DC2626';
      case 'modern': return '#7C3AED';
      case 'minimalist': return '#374151';
      case 'creative': return '#059669';
      default: return '#0D9488';
    }
  };

  const primaryColor = getTemplateColor(template);

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 40,
      fontFamily: 'Inter',
      fontSize: 10,
      lineHeight: 1.5,
      color: '#1F2937'
    },
    header: {
      marginBottom: 24,
      borderBottom: 2,
      borderBottomColor: primaryColor,
      paddingBottom: 16
    },
    name: {
      fontSize: 28,
      fontWeight: 700,
      marginBottom: 6,
      color: '#111827',
      fontFamily: template === 'creative' ? 'Playfair Display' : 'Inter'
    },
    jobTitle: {
      fontSize: 16,
      color: primaryColor,
      marginBottom: 12,
      fontWeight: 500
    },
    contactInfo: {
      fontSize: 10,
      color: '#6B7280',
      flexDirection: template === 'tokyo' ? 'column' : 'row',
      flexWrap: 'wrap',
      gap: template === 'tokyo' ? 4 : 12
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: template === 'tokyo' ? 2 : 0
    },
    section: {
      marginBottom: 20
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: primaryColor,
      borderBottom: 1,
      borderBottomColor: '#E5E7EB',
      paddingBottom: 4,
      marginBottom: 12
    },
    summaryText: {
      fontSize: 11,
      lineHeight: 1.6,
      color: '#374151',
      textAlign: 'justify'
    },
    experienceItem: {
      marginBottom: 16,
      paddingLeft: 8,
      borderLeft: 2,
      borderLeftColor: '#F3F4F6'
    },
    experienceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4
    },
    positionTitle: {
      fontSize: 12,
      fontWeight: 600,
      color: '#111827',
      flex: 1
    },
    dateRange: {
      fontSize: 9,
      color: '#6B7280',
      fontWeight: 500
    },
    companyName: {
      fontSize: 11,
      color: primaryColor,
      fontWeight: 500,
      marginBottom: 2
    },
    location: {
      fontSize: 9,
      color: '#9CA3AF',
      marginBottom: 6
    },
    description: {
      fontSize: 10,
      lineHeight: 1.4,
      marginLeft: 12,
      marginBottom: 2,
      color: '#4B5563'
    },
    educationItem: {
      marginBottom: 12,
      paddingBottom: 8,
      borderBottom: 1,
      borderBottomColor: '#F9FAFB'
    },
    degree: {
      fontSize: 11,
      fontWeight: 600,
      color: '#111827',
      marginBottom: 2
    },
    institution: {
      fontSize: 10,
      color: primaryColor,
      marginBottom: 2
    },
    educationDetails: {
      fontSize: 9,
      color: '#6B7280',
      flexDirection: 'row',
      gap: 8
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6
    },
    skillTag: {
      backgroundColor: template === 'minimalist' ? '#F9FAFB' : '#F0F9FF',
      borderColor: primaryColor,
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 3,
      fontSize: 9,
      color: primaryColor,
      fontWeight: 500
    }
  });

  return React.default.createElement(Document, null,
    React.default.createElement(Page, { size: 'A4', style: styles.page },
      // Enhanced Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.name }, personalInfo.fullName || 'Your Name'),
        React.createElement(Text, { style: styles.jobTitle }, personalInfo.jobTitle || 'Your Job Title'),
        React.createElement(View, { style: styles.contactInfo },
          personalInfo.email && React.createElement(View, { style: styles.contactItem },
            React.createElement(Text, null, personalInfo.email)
          ),
          personalInfo.phone && React.createElement(View, { style: styles.contactItem },
            React.createElement(Text, null, personalInfo.phone)
          ),
          personalInfo.location && React.createElement(View, { style: styles.contactItem },
            React.createElement(Text, null, personalInfo.location)
          ),
          personalInfo.profileUrl && React.createElement(View, { style: styles.contactItem },
            React.createElement(Text, null, personalInfo.profileUrl)
          )
        )
      ),

      // Professional Summary
      summary && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'PROFESSIONAL SUMMARY'),
        React.createElement(Text, { style: styles.summaryText }, summary)
      ),

      // Work Experience with Enhanced Layout
      experience.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'WORK EXPERIENCE'),
        ...experience.slice(0, 5).map((exp, index) =>
          React.createElement(View, { key: index, style: styles.experienceItem },
            React.createElement(View, { style: styles.experienceHeader },
              React.createElement(Text, { style: styles.positionTitle }, exp.position),
              React.createElement(Text, { style: styles.dateRange },
                `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}`
              )
            ),
            React.createElement(Text, { style: styles.companyName }, exp.company),
            exp.location && React.createElement(Text, { style: styles.location }, exp.location),
            ...(exp.description && exp.description.length > 0 ?
              exp.description.slice(0, 3).map((desc, descIndex) =>
                React.createElement(Text, { key: descIndex, style: styles.description }, `• ${desc}`)
              ) : [])
          )
        )
      ),

      // Education with Professional Layout
      education.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'EDUCATION'),
        ...education.slice(0, 3).map((edu, index) =>
          React.createElement(View, { key: index, style: styles.educationItem },
            React.createElement(Text, { style: styles.degree }, edu.degree),
            React.createElement(Text, { style: styles.institution }, edu.institution),
            React.createElement(View, { style: styles.educationDetails },
              React.createElement(Text, null, `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}`),
              edu.gpa && React.createElement(Text, null, `GPA: ${edu.gpa}`)
            )
          )
        )
      ),

      // Skills with Enhanced Styling
      skills.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'SKILLS'),
        React.createElement(View, { style: styles.skillsContainer },
          ...skills.slice(0, 25).map((skill, index) =>
            React.createElement(Text, { key: index, style: styles.skillTag }, skill)
          )
        )
      )
    )
  );
}

/**
 * Create React-PDF Template Component (Legacy - kept for compatibility)
 *
 * This function creates a React-PDF component based on the template and content.
 */
function createReactPDFTemplate(resumeContent: ResumeContent, template: string) {
  // This is a simplified implementation - in a full implementation,
  // you would create separate React-PDF components for each template
  const React = require('react');
  const { Document, Page, Text, View, StyleSheet } = require('@react-pdf/renderer');

  const { personalInfo, summary, experience, education, skills } = resumeContent;

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
      fontFamily: 'Helvetica',
      fontSize: 10,
      lineHeight: 1.4
    },
    header: {
      marginBottom: 20,
      borderBottom: 1,
      borderBottomColor: '#E2E8F0',
      paddingBottom: 10
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#1E293B'
    },
    title: {
      fontSize: 12,
      color: template === 'stockholm' ? '#0D9488' : template === 'berlin' ? '#2563EB' : template === 'tokyo' ? '#DC2626' : '#667EEA',
      marginBottom: 8
    },
    contact: {
      fontSize: 9,
      color: '#475569',
      flexDirection: template === 'tokyo' ? 'column' : 'row',
      gap: template === 'tokyo' ? 4 : 8
    },
    section: {
      marginBottom: 12
    },
    sectionTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      color: '#1E293B',
      borderBottom: 1,
      borderBottomColor: '#E2E8F0',
      paddingBottom: 3,
      marginBottom: 8
    },
    experienceItem: {
      marginBottom: 8
    },
    jobTitle: {
      fontSize: 10,
      fontWeight: 'bold',
      marginBottom: 2
    },
    company: {
      fontSize: 9,
      color: template === 'stockholm' ? '#0D9488' : template === 'berlin' ? '#2563EB' : template === 'tokyo' ? '#DC2626' : '#667EEA',
      marginBottom: 2
    },
    dateLocation: {
      fontSize: 8,
      color: '#64748B',
      marginBottom: 3
    },
    description: {
      fontSize: 8,
      lineHeight: 1.3,
      marginLeft: 8,
      marginBottom: 1
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 3
    },
    skillTag: {
      backgroundColor: '#F1F5F9',
      padding: 2,
      borderRadius: 2,
      fontSize: 8
    }
  });

  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Header
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.name }, personalInfo.fullName || 'Your Name'),
        React.createElement(Text, { style: styles.title }, personalInfo.jobTitle || 'Your Job Title'),
        React.createElement(View, { style: styles.contact },
          personalInfo.email && React.createElement(Text, null, personalInfo.email),
          personalInfo.phone && React.createElement(Text, null, template === 'tokyo' ? personalInfo.phone : ` • ${personalInfo.phone}`),
          personalInfo.location && React.createElement(Text, null, template === 'tokyo' ? personalInfo.location : ` • ${personalInfo.location}`)
        )
      ),

      // Summary
      summary && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'PROFESSIONAL SUMMARY'),
        React.createElement(Text, { style: { fontSize: 9, lineHeight: 1.4 } }, summary)
      ),

      // Experience
      experience.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'WORK EXPERIENCE'),
        ...experience.slice(0, 4).map((exp, index) =>
          React.createElement(View, { key: index, style: styles.experienceItem },
            React.createElement(Text, { style: styles.jobTitle }, exp.position),
            React.createElement(Text, { style: styles.company }, exp.company),
            React.createElement(Text, { style: styles.dateLocation },
              `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}${exp.location ? ` • ${exp.location}` : ''}`
            ),
            ...(exp.description && exp.description.length > 0 ?
              exp.description.slice(0, 2).map((desc, descIndex) =>
                React.createElement(Text, { key: descIndex, style: styles.description }, `• ${desc}`)
              ) : [])
          )
        )
      ),

      // Education
      education.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'EDUCATION'),
        ...education.slice(0, 3).map((edu, index) =>
          React.createElement(View, { key: index, style: { marginBottom: 6 } },
            React.createElement(Text, { style: { fontSize: 9, fontWeight: 'bold' } }, edu.degree),
            React.createElement(Text, { style: { fontSize: 8, color: template === 'stockholm' ? '#0D9488' : template === 'berlin' ? '#2563EB' : template === 'tokyo' ? '#DC2626' : '#667EEA' } },
              `${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}`
            ),
            React.createElement(Text, { style: { fontSize: 8, color: '#64748B' } },
              `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}`
            )
          )
        )
      ),

      // Skills
      skills.length > 0 && React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, 'SKILLS'),
        React.createElement(View, { style: styles.skillsContainer },
          ...skills.slice(0, 20).map((skill, index) =>
            React.createElement(Text, { key: index, style: styles.skillTag }, skill)
          )
        )
      )
    )
  );
}

// Basic Puppeteer fallback with simpler settings
async function generatePDFWithBasicPuppeteer(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  let browser;
  try {
    const html = generateHTMLForTemplate(resumeContent, template);

    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 816,
      height: 1056,
      deviceScaleFactor: 1
    });

    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Fallback PDF generation using wkhtmltopdf
async function generatePDFWithWkhtmltopdf(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  const tempHtmlPath = path.join(os.tmpdir(), `resume-${Date.now()}.html`);
  const tempPdfPath = path.join(os.tmpdir(), `resume-${Date.now()}.pdf`);

  try {
    const html = generateHTMLForTemplate(resumeContent, template);
    await fs.promises.writeFile(tempHtmlPath, html);

    try {
      await execAsync("which wkhtmltopdf");

      const wkhtmltopdfOptions = [
        '--page-size A4',
        '--margin-top 0.5in',
        '--margin-right 0.5in',
        '--margin-bottom 0.5in',
        '--margin-left 0.5in',
        '--encoding UTF-8',
        '--enable-local-file-access',
        '--disable-smart-shrinking',
        '--print-media-type',
        '--no-background',
        '--dpi 300',
        '--image-quality 100'
      ].join(' ');

      const command = `wkhtmltopdf ${wkhtmltopdfOptions} "${tempHtmlPath}" "${tempPdfPath}"`;
      await execAsync(command);

      const pdfBuffer = await fs.promises.readFile(tempPdfPath);
      return pdfBuffer;
    } catch (error) {
      console.error("Error with wkhtmltopdf fallback:", error);
      throw new Error("PDF generation failed - No PDF converter available.");
    }
  } finally {
    try {
      if (fs.existsSync(tempHtmlPath)) {
        await fs.promises.unlink(tempHtmlPath);
      }
      if (fs.existsSync(tempPdfPath)) {
        await fs.promises.unlink(tempPdfPath);
      }
    } catch (error) {
      console.error("Error cleaning up temporary files:", error);
    }
  }
}

/**
 * ALTERNATIVE PDF GENERATION IMPLEMENTATIONS
 *
 * The following functions demonstrate different approaches to PDF generation
 * that could replace the current Puppeteer/wkhtmltopdf implementation.
 * Each approach has different trade-offs in terms of quality, performance, and complexity.
 */

/**
 * Alternative 1: @react-pdf/renderer (RECOMMENDED)
 *
 * This approach creates native PDF documents using React components.
 * It provides the highest quality output with precise typography and layout control.
 *
 * To implement this approach:
 * 1. Install: npm install @react-pdf/renderer
 * 2. Create React-PDF components for each template
 * 3. Replace the current generatePDF function with this implementation
 */
/*
async function generatePDFWithReactPDF(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  const { renderToBuffer } = await import('@react-pdf/renderer');

  // Import the appropriate React-PDF template component
  const TemplateComponent = await getReactPDFTemplate(template, resumeContent);

  // Generate PDF buffer directly
  const pdfBuffer = await renderToBuffer(TemplateComponent);
  return pdfBuffer;
}

// Example React-PDF template structure
function createStockholmReactPDFTemplate(resumeContent: ResumeContent) {
  const { Document, Page, Text, View, StyleSheet } = require('@react-pdf/renderer');

  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 30,
      fontFamily: 'Helvetica'
    },
    header: {
      marginBottom: 20,
      borderBottom: 1,
      borderBottomColor: '#E2E8F0',
      paddingBottom: 10
    },
    name: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5
    },
    title: {
      fontSize: 14,
      color: '#0D9488',
      marginBottom: 10
    },
    contact: {
      fontSize: 10,
      color: '#475569',
      flexDirection: 'row',
      gap: 10
    },
    section: {
      marginBottom: 15
    },
    sectionTitle: {
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      borderBottom: 1,
      borderBottomColor: '#E2E8F0',
      paddingBottom: 3,
      marginBottom: 8
    },
    experienceItem: {
      marginBottom: 10
    },
    jobTitle: {
      fontSize: 11,
      fontWeight: 'bold',
      marginBottom: 2
    },
    company: {
      fontSize: 10,
      color: '#0D9488',
      marginBottom: 2
    },
    dateLocation: {
      fontSize: 9,
      color: '#64748B',
      marginBottom: 5
    },
    description: {
      fontSize: 9,
      lineHeight: 1.4,
      marginLeft: 10
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{resumeContent.personalInfo.fullName}</Text>
          <Text style={styles.title}>{resumeContent.personalInfo.jobTitle}</Text>
          <View style={styles.contact}>
            <Text>{resumeContent.personalInfo.email}</Text>
            <Text>{resumeContent.personalInfo.phone}</Text>
            <Text>{resumeContent.personalInfo.location}</Text>
          </View>
        </View>

        {resumeContent.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={{ fontSize: 10, lineHeight: 1.4 }}>{resumeContent.summary}</Text>
          </View>
        )}

        {resumeContent.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {resumeContent.experience.slice(0, 4).map((exp, index) => (
              <View key={index} style={styles.experienceItem}>
                <Text style={styles.jobTitle}>{exp.position}</Text>
                <Text style={styles.company}>{exp.company}</Text>
                <Text style={styles.dateLocation}>
                  {exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ' - Present'} • {exp.location}
                </Text>
                {exp.description && exp.description.length > 0 && (
                  <View>
                    {exp.description.slice(0, 2).map((desc, descIndex) => (
                      <Text key={descIndex} style={styles.description}>• {desc}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        // Additional sections for education, skills, etc.
      </Page>
    </Document>
  );
}
*/

/**
 * Alternative 2: Playwright PDF Generation
 *
 * This approach uses Playwright instead of Puppeteer for better reliability and quality.
 * Playwright generally produces better font rendering and CSS support.
 */
/*
async function generatePDFWithPlaywright(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  const { chromium } = await import('playwright');

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
      '--disable-gpu'
    ]
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 794, height: 1123 },
      deviceScaleFactor: 2
    });

    const page = await context.newPage();

    // Set print media type for better CSS handling
    await page.emulateMedia({ media: 'print' });

    const html = generateHTMLForTemplate(resumeContent, template);
    await page.setContent(html, { waitUntil: 'networkidle' });

    // Wait for fonts to load
    await page.waitForFunction(() => document.fonts.ready);
    await page.waitForTimeout(2000);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      preferCSSPageSize: true,
      tagged: true
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}
*/

/**
 * Alternative 3: PDFMake Implementation
 *
 * This approach uses PDFMake for structured document generation.
 * Best for documents with consistent layouts and when you need precise control.
 */
/*
async function generatePDFWithPDFMake(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  const pdfMake = await import('pdfmake/build/pdfmake');
  const pdfFonts = await import('pdfmake/build/vfs_fonts');

  // Set up fonts
  pdfMake.vfs = pdfFonts.pdfMake.vfs;

  const docDefinition = createPDFMakeDocumentDefinition(resumeContent, template);

  return new Promise((resolve, reject) => {
    const pdfDoc = pdfMake.createPdf(docDefinition);
    pdfDoc.getBuffer((buffer) => {
      resolve(Buffer.from(buffer));
    });
  });
}

function createPDFMakeDocumentDefinition(resumeContent: ResumeContent, template: string) {
  const { personalInfo, summary, experience, education, skills } = resumeContent;

  return {
    content: [
      // Header
      {
        text: personalInfo.fullName || 'Your Name',
        style: 'header',
        margin: [0, 0, 0, 5]
      },
      {
        text: personalInfo.jobTitle || 'Your Job Title',
        style: 'subheader',
        margin: [0, 0, 0, 10]
      },
      {
        text: [
          personalInfo.email || '',
          personalInfo.phone ? ` • ${personalInfo.phone}` : '',
          personalInfo.location ? ` • ${personalInfo.location}` : ''
        ].filter(Boolean).join(''),
        style: 'contact',
        margin: [0, 0, 0, 20]
      },

      // Summary
      ...(summary ? [
        { text: 'PROFESSIONAL SUMMARY', style: 'sectionHeader' },
        { text: summary, style: 'body', margin: [0, 0, 0, 15] }
      ] : []),

      // Experience
      ...(experience.length > 0 ? [
        { text: 'WORK EXPERIENCE', style: 'sectionHeader' },
        ...experience.slice(0, 4).flatMap(exp => [
          {
            columns: [
              { text: exp.position, style: 'jobTitle', width: '*' },
              { text: `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}`, style: 'date', width: 'auto' }
            ],
            margin: [0, 0, 0, 2]
          },
          { text: `${exp.company}${exp.location ? `, ${exp.location}` : ''}`, style: 'company', margin: [0, 0, 0, 5] },
          ...(exp.description && exp.description.length > 0 ? [
            {
              ul: exp.description.slice(0, 2),
              style: 'description',
              margin: [0, 0, 0, 10]
            }
          ] : [])
        ])
      ] : []),

      // Education
      ...(education.length > 0 ? [
        { text: 'EDUCATION', style: 'sectionHeader' },
        ...education.slice(0, 3).flatMap(edu => [
          {
            columns: [
              { text: edu.degree, style: 'degree', width: '*' },
              { text: `${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}`, style: 'date', width: 'auto' }
            ],
            margin: [0, 0, 0, 2]
          },
          { text: `${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}`, style: 'institution', margin: [0, 0, 0, 10] }
        ])
      ] : []),

      // Skills
      ...(skills.length > 0 ? [
        { text: 'SKILLS', style: 'sectionHeader' },
        { text: skills.slice(0, 20).join(' • '), style: 'skills' }
      ] : [])
    ],

    styles: {
      header: {
        fontSize: 24,
        bold: true,
        color: '#1E293B'
      },
      subheader: {
        fontSize: 14,
        color: '#0D9488'
      },
      contact: {
        fontSize: 10,
        color: '#475569'
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: '#1E293B',
        margin: [0, 15, 0, 8]
      },
      jobTitle: {
        fontSize: 11,
        bold: true,
        color: '#1E293B'
      },
      company: {
        fontSize: 10,
        color: '#0D9488'
      },
      date: {
        fontSize: 9,
        color: '#64748B'
      },
      description: {
        fontSize: 9,
        lineHeight: 1.4,
        color: '#475569'
      },
      degree: {
        fontSize: 10,
        bold: true
      },
      institution: {
        fontSize: 9,
        color: '#0D9488'
      },
      skills: {
        fontSize: 9,
        color: '#475569'
      },
      body: {
        fontSize: 10,
        lineHeight: 1.4,
        color: '#475569'
      }
    },

    defaultStyle: {
      font: 'Helvetica'
    },

    pageSize: 'A4',
    pageMargins: [40, 40, 40, 40]
  };
}
*/

/**
 * Alternative 4: Canvas-based PDF Generation (html2canvas + jsPDF)
 *
 * This approach captures the HTML as a canvas image and converts it to PDF.
 * Provides pixel-perfect rendering but larger file sizes.
 */
/*
async function generatePDFWithCanvas(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  // This would typically be implemented on the client-side
  // For server-side implementation, you'd need a headless browser
  // to render the HTML and capture it as canvas

  const html2canvas = await import('html2canvas');
  const jsPDF = await import('jspdf');

  // Create a temporary HTML element with the resume content
  const htmlContent = generateHTMLForTemplate(resumeContent, template);

  // This is a simplified example - actual implementation would need
  // a proper DOM environment (like jsdom) or headless browser
  const canvas = await html2canvas.default(htmlElement, {
    scale: 2,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    width: 794,
    height: 1123
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF.jsPDF('p', 'mm', 'a4');

  const imgWidth = 210; // A4 width in mm
  const pageHeight = 295; // A4 height in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return Buffer.from(pdf.output('arraybuffer'));
}
*/

/**
 * Alternative 5: Chrome DevTools Protocol (Direct Chrome Control)
 *
 * This approach uses Chrome's DevTools Protocol directly for more control
 * over the PDF generation process than Puppeteer provides.
 */
/*
async function generatePDFWithChromeDevTools(
  resumeContent: ResumeContent,
  template: string
): Promise<Buffer> {
  const CDP = await import('chrome-remote-interface');

  let client;
  try {
    client = await CDP();
    const { Page, Runtime, Emulation } = client;

    await Page.enable();
    await Runtime.enable();

    // Set device metrics for A4 size
    await Emulation.setDeviceMetricsOverride({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
      mobile: false
    });

    // Set print media type
    await Emulation.setEmulatedMedia({ media: 'print' });

    const html = generateHTMLForTemplate(resumeContent, template);

    // Navigate to data URL with HTML content
    await Page.navigate({
      url: `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
    });

    // Wait for page to load
    await Page.loadEventFired();

    // Wait for fonts to load
    await Runtime.evaluate({
      expression: 'document.fonts.ready'
    });

    // Generate PDF
    const { data } = await Page.printToPDF({
      paperWidth: 8.27, // A4 width in inches
      paperHeight: 11.7, // A4 height in inches
      marginTop: 0.5,
      marginBottom: 0.5,
      marginLeft: 0.5,
      marginRight: 0.5,
      printBackground: true,
      preferCSSPageSize: true
    });

    return Buffer.from(data, 'base64');
  } finally {
    if (client) {
      await client.close();
    }
  }
}
*/

/**
 * IMPLEMENTATION RECOMMENDATIONS
 *
 * Based on research and analysis, here are the recommended approaches in order of preference:
 *
 * 1. @react-pdf/renderer (HIGHEST RECOMMENDATION)
 *    - Pros: Native PDF generation, excellent quality, precise control, no browser dependency
 *    - Cons: Requires rewriting templates in React-PDF syntax
 *    - Best for: Professional documents requiring high quality and consistency
 *    - Implementation effort: Medium to High
 *
 * 2. Playwright PDF Generation
 *    - Pros: Better than Puppeteer, modern, reliable, minimal code changes
 *    - Cons: Still browser-based, some quality limitations
 *    - Best for: Quick improvement over current Puppeteer implementation
 *    - Implementation effort: Low
 *
 * 3. PDFMake
 *    - Pros: Structured document generation, good quality, no browser dependency
 *    - Cons: Different syntax, limited styling flexibility
 *    - Best for: Structured documents with consistent layouts
 *    - Implementation effort: Medium
 *
 * 4. Canvas-based PDF (html2canvas + jsPDF)
 *    - Pros: Pixel-perfect rendering, maintains exact visual appearance
 *    - Cons: Larger file sizes, complex implementation for server-side
 *    - Best for: When exact visual fidelity is critical
 *    - Implementation effort: High
 *
 * 5. Chrome DevTools Protocol
 *    - Pros: More control than Puppeteer, potentially better quality
 *    - Cons: Complex implementation, still browser-based
 *    - Best for: Advanced use cases requiring fine-grained control
 *    - Implementation effort: High
 *
 * RECOMMENDED IMPLEMENTATION STRATEGY:
 *
 * Phase 1: Quick Win - Implement Playwright PDF Generation
 * - Replace Puppeteer with Playwright in the existing function
 * - Minimal code changes, immediate quality improvement
 * - Test with all 6 templates
 *
 * Phase 2: Long-term Solution - Implement @react-pdf/renderer
 * - Create React-PDF components for each template
 * - Implement server-side PDF generation
 * - Achieve professional-quality output
 *
 * Phase 3: Optimization
 * - Add caching for generated PDFs
 * - Implement PDF compression
 * - Add custom font support
 * - Performance optimization
 */

function generateHTMLForTemplate(resumeContent: ResumeContent, template: string, fullPage: boolean = false): string {
  const { personalInfo, summary, experience, education, skills } = resumeContent;

  // Enhanced common styles that match client-side Tailwind CSS exactly
  const commonStyles = `
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact;
      color-adjust: exact;
      print-color-adjust: exact;
    }

    @page {
      margin: 0.5in;
      size: A4;
      -webkit-print-color-adjust: exact;
    }

    @media print {
      * {
        -webkit-print-color-adjust: exact !important;
        color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }

    html, body {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      font-size: 12px;
      line-height: 1.5;
      color: #0f172a;
      background-color: #ffffff;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      line-height: ${fullPage ? '1.3' : '1.4'};
      font-size: ${fullPage ? '11px' : '12px'};
      background: white;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-feature-settings: "kern" 1;
      font-kerning: normal;
    }

    .page {
      width: 100%;
      min-height: ${fullPage ? '100vh' : 'auto'};
      ${fullPage ? 'height: 100vh;' : 'max-width: 8.5in;'}
      margin: 0 auto;
      background: white;
      overflow: visible;
      ${fullPage ? 'padding: 0.5in;' : ''}
      display: flex;
      flex-direction: column;
    }

    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      line-height: 1.2;
      page-break-after: avoid;
      orphans: 3;
      widows: 3;
    }

    p, ul, li {
      margin: 0;
      padding: 0;
      orphans: 2;
      widows: 2;
    }

    ul {
      list-style: none;
    }

    /* Enhanced bullet point rendering for PDF generation */
    ul[class*="-exp-desc"], ul[class*="-desc"] {
      list-style-type: disc !important;
      list-style-position: outside !important;
      padding-left: 1rem !important;
      margin-left: 0.5rem !important;
    }

    ul[class*="-exp-desc"] li, ul[class*="-desc"] li {
      display: list-item !important;
      list-style-type: disc !important;
      list-style-position: outside !important;
      margin-bottom: 0.125rem !important;
    }

    .section {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 12px;
    }

    .section-title {
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.05em;
      font-weight: 600;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }

    .skill-tag {
      display: inline-block;
      background-color: #f1f5f9;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      margin-right: 4px;
      margin-bottom: 4px;
    }

    .flex {
      display: flex;
    }

    .flex-col {
      flex-direction: column;
    }

    .justify-between {
      justify-content: space-between;
    }

    .items-start {
      align-items: flex-start;
    }

    .items-center {
      align-items: center;
    }

    .mb-1 { margin-bottom: 4px; }
    .mb-2 { margin-bottom: 8px; }
    .mb-3 { margin-bottom: 12px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-1 { margin-top: 4px; }
    .mt-2 { margin-top: 8px; }
    .p-2 { padding: 8px; }
    .p-3 { padding: 12px; }
    .pb-2 { padding-bottom: 8px; }
    .text-xs { font-size: 10px; }
    .text-sm { font-size: 11px; }
    .text-base { font-size: 12px; }
    .text-lg { font-size: 14px; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .font-medium { font-weight: 500; }
    .font-light { font-weight: 300; }
    .text-slate-900 { color: #0f172a; }
    .text-slate-700 { color: #334155; }
    .text-slate-600 { color: #475569; }
    .text-slate-500 { color: #64748b; }
    .border-b { border-bottom: 1px solid #e2e8f0; }
    .rounded { border-radius: 4px; }
    .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }

    /* PDF-specific optimizations for Puppeteer */
    .content-section {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 10px;
    }

    .experience-item, .education-item, .project-item {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 10px;
    }

    .two-column {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .left-column {
      width: 33%;
      flex-shrink: 0;
    }

    .right-column {
      width: 67%;
      flex-shrink: 0;
    }

    /* Hide ATS score overlay in PDF */
    .ats-score-overlay {
      display: none !important;
    }

    /* Enhanced text rendering and font optimization */
    * {
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Improved gradient rendering for PDF */
    .gradient-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-attachment: fixed;
    }

    .teal-gradient-bg {
      background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
      background-attachment: fixed;
    }

    /* Enhanced flexbox for PDF compatibility */
    .flex {
      display: flex;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
    }

    .flex-col {
      flex-direction: column;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
    }

    /* Better page break handling */
    .avoid-break {
      break-inside: avoid;
      page-break-inside: avoid;
      -webkit-column-break-inside: avoid;
    }

    /* Font loading optimization */
    @font-face {
      font-family: 'Inter Fallback';
      src: local('Arial'), local('Helvetica'), local('sans-serif');
      font-display: swap;
    }
  `;

  // Template-specific HTML
  let html = '';

  switch (template) {
    case 'stockholm':
      html = generateStockholmTemplate(personalInfo, summary, experience, education, skills, commonStyles);
      break;
    case 'berlin':
      html = generateBerlinTemplate(personalInfo, summary, experience, education, skills, commonStyles);
      break;
    case 'tokyo':
      html = generateTokyoTemplate(personalInfo, summary, experience, education, skills, commonStyles);
      break;
    case 'modern':
      html = generateModernTemplate(personalInfo, summary, experience, education, skills, commonStyles);
      break;
    case 'minimalist':
      html = generateMinimalistTemplate(personalInfo, summary, experience, education, skills, commonStyles);
      break;
    case 'creative':
      html = generateCreativeTemplate(personalInfo, summary, experience, education, skills, commonStyles);
      break;
    default:
      html = generateStockholmTemplate(personalInfo, summary, experience, education, skills, commonStyles);
  }

  return html;
}

function generateStockholmTemplate(personalInfo: any, summary: string | undefined, experience: any[], education: any[], skills: string[], commonStyles: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${personalInfo.fullName} - Resume</title>
      <style>
        ${commonStyles}

        /* Stockholm Template Specific Styles - Matching Client Exactly */
        .stockholm-container {
          padding: 1.5rem;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          color: rgb(15 23 42);
          overflow: hidden;
          font-size: 0.75rem;
          line-height: 1.25;
        }

        .stockholm-header {
          border-bottom: 1px solid rgb(226 232 240);
          padding-bottom: 0.5rem;
          margin-bottom: 0.75rem;
          flex-shrink: 0;
        }

        .stockholm-name {
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.25;
          margin-bottom: 0.125rem;
        }

        .stockholm-title {
          font-size: 0.875rem;
          color: rgb(67 56 202);
          font-weight: 500;
          line-height: 1.25;
          margin-bottom: 0.5rem;
        }

        .stockholm-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: rgb(71 85 105);
        }

        .stockholm-contact-item {
          display: flex;
          align-items: center;
        }

        .stockholm-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stockholm-section {
          margin-bottom: 0.75rem;
        }

        .stockholm-section-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          color: rgb(15 23 42);
          margin-bottom: 0.25rem;
          border-bottom: 1px solid rgb(226 232 240);
          padding-bottom: 0.125rem;
        }

        .stockholm-summary {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.625;
        }

        .stockholm-exp-item {
          margin-bottom: 0.75rem;
        }

        .stockholm-exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .stockholm-exp-position {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgb(15 23 42);
          line-height: 1.25;
        }

        .stockholm-exp-date {
          font-size: 0.75rem;
          color: rgb(100 116 139);
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .stockholm-exp-company {
          font-size: 0.75rem;
          color: rgb(67 56 202);
          font-weight: 500;
          line-height: 1.25;
          margin-bottom: 0.25rem;
        }

        .stockholm-exp-desc {
          list-style-type: disc;
          list-style-position: outside;
          padding-left: 1rem;
          margin-top: 0.25rem;
          margin-left: 0.5rem;
        }

        .stockholm-exp-desc li {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.25;
          margin-bottom: 0.125rem;
          display: list-item;
          list-style-type: disc;
          list-style-position: outside;
        }

        .stockholm-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .stockholm-skill-tag {
          background-color: rgb(241 245 249);
          color: rgb(51 65 85);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="stockholm-container">
        <!-- Header -->
        <div class="stockholm-header">
          <h1 class="stockholm-name">${personalInfo.fullName || "Your Name"}</h1>
          <h2 class="stockholm-title">${personalInfo.jobTitle || "Your Job Title"}</h2>
          <div class="stockholm-contact">
            ${personalInfo.email ? `<div class="stockholm-contact-item">${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div class="stockholm-contact-item">${personalInfo.phone}</div>` : ''}
            ${personalInfo.location ? `<div class="stockholm-contact-item">${personalInfo.location}</div>` : ''}
            ${personalInfo.profileUrl ? `<div class="stockholm-contact-item">${personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</div>` : ''}
          </div>
        </div>

        <!-- Content Area -->
        <div class="stockholm-content">
          <!-- Summary -->
          ${summary ? `
          <div class="stockholm-section">
            <h3 class="stockholm-section-title">Professional Summary</h3>
            <p class="stockholm-summary">${summary}</p>
          </div>
          ` : ''}

          <!-- Experience -->
          ${experience.length > 0 ? `
          <div class="stockholm-section">
            <h3 class="stockholm-section-title">Work Experience</h3>
            ${experience.map(exp => `
              <div class="stockholm-exp-item">
                <div class="stockholm-exp-header">
                  <h4 class="stockholm-exp-position">${exp.position}</h4>
                  <span class="stockholm-exp-date">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}</span>
                </div>
                <div class="stockholm-exp-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                ${exp.description && exp.description.length > 0 ? `
                  <ul class="stockholm-exp-desc">
                    ${exp.description.map((desc: string) => `<li>${desc}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Education -->
          ${education.length > 0 ? `
          <div class="stockholm-section">
            <h3 class="stockholm-section-title">Education</h3>
            ${education.map(edu => `
              <div class="stockholm-exp-item">
                <div class="stockholm-exp-header">
                  <h4 class="stockholm-exp-position">${edu.degree}</h4>
                  <span class="stockholm-exp-date">${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                </div>
                <div class="stockholm-exp-company">${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Skills -->
          ${skills.length > 0 ? `
          <div class="stockholm-section">
            <h3 class="stockholm-section-title">Skills</h3>
            <div class="stockholm-skills">
              ${skills.map(skill => `<span class="stockholm-skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateBerlinTemplate(personalInfo: any, summary: string | undefined, experience: any[], education: any[], skills: string[], commonStyles: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${personalInfo.fullName} - Resume</title>
      <style>
        ${commonStyles}

        /* Berlin Template Specific Styles - Matching Client Exactly */
        .berlin-container {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          background-color: white;
          color: rgb(15 23 42);
          overflow: hidden;
          font-size: 0.75rem;
        }

        .berlin-header {
          background-color: rgb(37 99 235);
          color: white;
          padding: 1rem;
          flex-shrink: 0;
        }

        .berlin-name {
          font-size: 1.125rem;
          font-weight: 700;
          line-height: 1.25;
          margin-bottom: 0.125rem;
        }

        .berlin-title {
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.125rem;
          color: rgb(219 234 254);
          line-height: 1.25;
          margin-bottom: 0.5rem;
        }

        .berlin-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.75rem;
          margin-top: 0.5rem;
        }

        .berlin-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .berlin-sidebar {
          width: 33.333333%;
          background-color: rgb(248 250 252);
          padding: 0.75rem;
          overflow-y: auto;
        }

        .berlin-main {
          width: 66.666667%;
          padding: 0.75rem;
          overflow-y: auto;
        }

        .berlin-section {
          margin-bottom: 0.75rem;
        }

        .berlin-section-title {
          color: rgb(37 99 235);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgb(203 213 225);
          padding-bottom: 0.125rem;
          margin-bottom: 0.5rem;
        }

        .berlin-skill-item {
          display: flex;
          align-items: center;
          margin-bottom: 0.25rem;
          font-size: 0.75rem;
        }

        .berlin-skill-dot {
          width: 0.25rem;
          height: 0.25rem;
          background-color: rgb(37 99 235);
          border-radius: 50%;
          margin-right: 0.25rem;
          flex-shrink: 0;
        }

        .berlin-exp-item {
          margin-bottom: 0.75rem;
        }

        .berlin-exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .berlin-exp-position {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgb(15 23 42);
          line-height: 1.25;
        }

        .berlin-exp-date {
          font-size: 0.75rem;
          color: rgb(100 116 139);
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .berlin-exp-company {
          font-size: 0.75rem;
          color: rgb(37 99 235);
          font-weight: 500;
          line-height: 1.25;
          margin-bottom: 0.25rem;
        }

        .berlin-exp-desc {
          list-style-type: disc;
          list-style-position: outside;
          padding-left: 1rem;
          margin-top: 0.25rem;
          margin-left: 0.5rem;
        }

        .berlin-exp-desc li {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.25;
          margin-bottom: 0.125rem;
          display: list-item;
          list-style-type: disc;
          list-style-position: outside;
        }

        .berlin-summary {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.625;
        }
      </style>
    </head>
    <body>
      <div class="berlin-container">
        <!-- Header with background -->
        <div class="berlin-header">
          <h1 class="berlin-name">${personalInfo.fullName || "Your Name"}</h1>
          <h2 class="berlin-title">${personalInfo.jobTitle || "Your Job Title"}</h2>
          <div class="berlin-contact">
            ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
            ${personalInfo.location ? `<div>${personalInfo.location}</div>` : ''}
            ${personalInfo.profileUrl ? `<div>${personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</div>` : ''}
          </div>
        </div>

        <!-- Content Area -->
        <div class="berlin-content">
          <!-- Sidebar -->
          <div class="berlin-sidebar">
            <!-- Skills -->
            ${skills.length > 0 ? `
            <div class="berlin-section">
              <h3 class="berlin-section-title">Skills</h3>
              ${skills.map(skill => `
                <div class="berlin-skill-item">
                  <div class="berlin-skill-dot"></div>
                  <span>${skill}</span>
                </div>
              `).join('')}
            </div>
            ` : ''}

            <!-- Education -->
            ${education.length > 0 ? `
            <div class="berlin-section">
              <h3 class="berlin-section-title">Education</h3>
              ${education.map(edu => `
                <div class="berlin-exp-item">
                  <h4 class="berlin-exp-position">${edu.degree}</h4>
                  <div class="berlin-exp-company">${edu.institution}</div>
                  <div class="berlin-exp-date">
                    ${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}
                    ${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>

          <!-- Main Content -->
          <div class="berlin-main">
            <!-- Summary -->
            ${summary ? `
            <div class="berlin-section">
              <h3 class="berlin-section-title">Professional Summary</h3>
              <p class="berlin-summary">${summary}</p>
            </div>
            ` : ''}

            <!-- Experience -->
            ${experience.length > 0 ? `
            <div class="berlin-section">
              <h3 class="berlin-section-title">Work Experience</h3>
              ${experience.map(exp => `
                <div class="berlin-exp-item">
                  <div class="berlin-exp-header">
                    <h4 class="berlin-exp-position">${exp.position}</h4>
                    <span class="berlin-exp-date">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}</span>
                  </div>
                  <div class="berlin-exp-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                  ${exp.description && exp.description.length > 0 ? `
                    <ul class="berlin-exp-desc">
                      ${exp.description.map((desc: string) => `<li>${desc}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateTokyoTemplate(personalInfo: any, summary: string | undefined, experience: any[], education: any[], skills: string[], commonStyles: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${personalInfo.fullName} - Resume</title>
      <style>
        ${commonStyles}

        /* Tokyo Template Specific Styles - Matching Client Exactly */
        .tokyo-container {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          color: rgb(15 23 42);
          background-color: white;
          overflow: hidden;
          font-size: 0.75rem;
        }

        .tokyo-header {
          display: flex;
          flex-shrink: 0;
        }

        .tokyo-main-header {
          width: 75%;
          padding: 0.75rem;
        }

        .tokyo-sidebar-header {
          width: 25%;
          background-color: rgb(254 242 242);
          color: rgb(15 23 42);
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          align-items: flex-start;
          justify-content: flex-start;
        }

        .tokyo-name {
          font-size: 1.125rem;
          font-weight: 700;
          color: rgb(15 23 42);
          line-height: 1.25;
          margin-bottom: 0.125rem;
        }

        .tokyo-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(220 38 38);
          margin-bottom: 0.5rem;
          line-height: 1.25;
        }

        .tokyo-content {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .tokyo-main {
          width: 75%;
          padding: 0.75rem;
          overflow-y: auto;
        }

        .tokyo-sidebar {
          width: 25%;
          background-color: rgb(254 242 242);
          color: rgb(15 23 42);
          padding: 0.75rem;
          overflow-y: auto;
        }

        .tokyo-section {
          margin-bottom: 0.75rem;
        }

        .tokyo-section-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: rgb(153 27 27);
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
        }

        .tokyo-section-title::before {
          content: '';
          width: 1rem;
          height: 0.125rem;
          background-color: rgb(239 68 68);
          margin-right: 0.25rem;
        }

        .tokyo-sidebar-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: rgb(153 27 27);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .tokyo-summary {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.625;
        }

        .tokyo-exp-item {
          margin-bottom: 0.75rem;
        }

        .tokyo-exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .tokyo-exp-position {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgb(15 23 42);
          line-height: 1.25;
        }

        .tokyo-exp-date {
          font-size: 0.75rem;
          color: rgb(100 116 139);
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .tokyo-exp-company {
          font-size: 0.75rem;
          color: rgb(220 38 38);
          font-weight: 500;
          line-height: 1.25;
          margin-bottom: 0.25rem;
        }

        .tokyo-exp-desc {
          list-style-type: disc;
          list-style-position: outside;
          padding-left: 1rem;
          margin-top: 0.25rem;
          margin-left: 0.5rem;
        }

        .tokyo-exp-desc li {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.25;
          margin-bottom: 0.125rem;
          display: list-item;
          list-style-type: disc;
          list-style-position: outside;
        }

        .tokyo-contact-item {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          line-height: 1.25;
          word-break: break-word;
          overflow-wrap: break-word;
          min-height: 1.25rem;
          width: 100%;
        }

        /* Spacing equivalent to space-y-1 (0.25rem gap) */
        .tokyo-contact-item:not(:last-child) {
          margin-bottom: 0.25rem;
        }

        .tokyo-contact-icon {
          color: rgb(220 38 38);
          margin-right: 0.25rem;
          flex-shrink: 0;
          font-size: 0.75rem;
          width: 1rem;
          height: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          border-radius: 50%;
          background-color: rgba(220, 38, 38, 0.1);
          text-align: center;
          line-height: 1;
          min-width: 1rem;
        }

        .tokyo-contact-icon.email::before {
          content: "@";
          font-weight: 700;
          font-size: 0.75rem;
          color: rgb(220 38 38);
        }

        .tokyo-contact-icon.phone::before {
          content: "☎";
          font-size: 0.625rem;
          color: rgb(220 38 38);
        }

        .tokyo-contact-icon.location::before {
          content: "📍";
          font-size: 0.625rem;
          color: rgb(220 38 38);
        }

        .tokyo-contact-icon.linkedin::before {
          content: "in";
          font-weight: 700;
          font-size: 0.5rem;
          text-transform: lowercase;
          color: rgb(220 38 38);
        }

        .tokyo-contact-text {
          flex: 1;
          min-width: 0;
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          font-size: 0.75rem;
          color: rgb(51 65 85);
        }

        .tokyo-skill-item {
          background-color: rgba(220, 38, 38, 0.1);
          color: rgb(153 27 27);
          border: 1px solid rgba(220, 38, 38, 0.2);
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          display: inline-block;
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
        }
      </style>
    </head>
    <body>
      <div class="tokyo-container">
        <!-- Header with sidebar -->
        <div class="tokyo-header">
          <!-- Main content -->
          <div class="tokyo-main-header">
            <h1 class="tokyo-name">${personalInfo.fullName || "Your Name"}</h1>
            <h2 class="tokyo-title">${personalInfo.jobTitle || "Your Job Title"}</h2>

            <!-- Summary -->
            ${summary ? `
            <div class="tokyo-section">
              <h3 class="tokyo-section-title">PROFESSIONAL SUMMARY</h3>
              <p class="tokyo-summary">${summary}</p>
            </div>
            ` : ''}
          </div>

          <!-- Sidebar -->
          <div class="tokyo-sidebar-header">
            ${personalInfo.email ? `
              <div class="tokyo-contact-item">
                <span class="tokyo-contact-icon email"></span>
                <span class="tokyo-contact-text">${personalInfo.email}</span>
              </div>
            ` : ''}
            ${personalInfo.phone ? `
              <div class="tokyo-contact-item">
                <span class="tokyo-contact-icon phone"></span>
                <span class="tokyo-contact-text">${personalInfo.phone}</span>
              </div>
            ` : ''}
            ${personalInfo.location ? `
              <div class="tokyo-contact-item">
                <span class="tokyo-contact-icon location"></span>
                <span class="tokyo-contact-text">${personalInfo.location}</span>
              </div>
            ` : ''}
            ${personalInfo.profileUrl ? `
              <div class="tokyo-contact-item">
                <span class="tokyo-contact-icon linkedin"></span>
                <span class="tokyo-contact-text">${personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Content Area -->
        <div class="tokyo-content">
          <!-- Main Content -->
          <div class="tokyo-main">
            <!-- Experience -->
            ${experience.length > 0 ? `
            <div class="tokyo-section">
              <h3 class="tokyo-section-title">WORK EXPERIENCE</h3>
              ${experience.map(exp => `
                <div class="tokyo-exp-item">
                  <div class="tokyo-exp-header">
                    <h4 class="tokyo-exp-position">${exp.position}</h4>
                    <span class="tokyo-exp-date">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}</span>
                  </div>
                  <div class="tokyo-exp-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                  ${exp.description && exp.description.length > 0 ? `
                    <ul class="tokyo-exp-desc">
                      ${exp.description.map((desc: string) => `<li>${desc}</li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
            ` : ''}

            <!-- Education -->
            ${education.length > 0 ? `
            <div class="tokyo-section">
              <h3 class="tokyo-section-title">EDUCATION</h3>
              ${education.map(edu => `
                <div class="tokyo-exp-item">
                  <div class="tokyo-exp-header">
                    <h4 class="tokyo-exp-position">${edu.degree}</h4>
                    <span class="tokyo-exp-date">${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                  </div>
                  <div class="tokyo-exp-company">${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
                </div>
              `).join('')}
            </div>
            ` : ''}
          </div>

          <!-- Sidebar -->
          <div class="tokyo-sidebar">
            <!-- Skills -->
            ${skills.length > 0 ? `
            <div class="tokyo-section">
              <h3 class="tokyo-sidebar-title">Skills</h3>
              <div>
                ${skills.map(skill => `<span class="tokyo-skill-item">${skill}</span>`).join('')}
              </div>
            </div>
            ` : ''}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateModernTemplate(personalInfo: any, summary: string | undefined, experience: any[], education: any[], skills: string[], commonStyles: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${personalInfo.fullName} - Resume</title>
      <style>
        ${commonStyles}

        /* Modern Template Specific Styles - Matching Client Exactly */
        .modern-container {
          padding: 1rem;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          background: linear-gradient(to bottom right, rgb(248 250 252), white);
          color: rgb(15 23 42);
          overflow: hidden;
          font-size: 0.75rem;
        }

        .modern-header {
          position: relative;
          background: linear-gradient(to right, rgb(37 99 235), rgb(147 51 234));
          color: white;
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-bottom: 0.75rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          flex-shrink: 0;
        }

        .modern-header::before {
          content: '';
          position: absolute;
          inset: 0;
          background-color: black;
          opacity: 0.1;
          border-radius: 0.5rem;
        }

        .modern-header-content {
          position: relative;
          z-index: 10;
        }

        .modern-name {
          font-size: 1.125rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
          line-height: 1.25;
        }

        .modern-title {
          font-size: 0.875rem;
          font-weight: 300;
          opacity: 0.9;
          margin-bottom: 0.5rem;
          line-height: 1.25;
        }

        .modern-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.75rem;
        }

        .modern-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .modern-section {
          margin-bottom: 0.75rem;
        }

        .modern-section-title {
          display: flex;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .modern-section-title::before {
          content: '';
          width: 0.125rem;
          height: 1rem;
          background: linear-gradient(to bottom, rgb(59 130 246), rgb(147 51 234));
          border-radius: 9999px;
          margin-right: 0.5rem;
        }

        .modern-section-title h3 {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgb(30 41 59);
        }

        .modern-summary {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.625;
          padding-left: 0.75rem;
          border-left: 2px solid rgb(226 232 240);
        }

        .modern-exp-item {
          margin-bottom: 0.75rem;
        }

        .modern-exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .modern-exp-position {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgb(15 23 42);
          line-height: 1.25;
        }

        .modern-exp-date {
          font-size: 0.75rem;
          color: rgb(100 116 139);
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .modern-exp-company {
          font-size: 0.75rem;
          color: rgb(71 85 105);
          font-weight: 500;
          line-height: 1.25;
          margin-bottom: 0.25rem;
        }

        .modern-exp-desc {
          list-style-type: disc;
          list-style-position: outside;
          padding-left: 1rem;
          margin-top: 0.25rem;
          margin-left: 0.5rem;
        }

        .modern-exp-desc li {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.25;
          margin-bottom: 0.125rem;
          display: list-item;
          list-style-type: disc;
          list-style-position: outside;
        }

        .modern-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .modern-skill-tag {
          background: linear-gradient(135deg, rgb(59 130 246), rgb(147 51 234));
          color: white;
          padding: 0.125rem 0.375rem;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          display: inline-block;
        }
      </style>
    </head>
    <body>
      <div class="modern-container">
        <!-- Header with modern gradient -->
        <div class="modern-header">
          <div class="modern-header-content">
            <h1 class="modern-name">${personalInfo.fullName || "Your Name"}</h1>
            <h2 class="modern-title">${personalInfo.jobTitle || "Your Job Title"}</h2>
            <div class="modern-contact">
              ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
              ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
              ${personalInfo.location ? `<div>${personalInfo.location}</div>` : ''}
              ${personalInfo.profileUrl ? `<div>${personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</div>` : ''}
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="modern-content">
          <!-- Summary with modern styling -->
          ${summary ? `
          <div class="modern-section">
            <div class="modern-section-title">
              <h3>Professional Summary</h3>
            </div>
            <p class="modern-summary">${summary}</p>
          </div>
          ` : ''}

          <!-- Experience -->
          ${experience.length > 0 ? `
          <div class="modern-section">
            <div class="modern-section-title">
              <h3>Work Experience</h3>
            </div>
            ${experience.map(exp => `
              <div class="modern-exp-item">
                <div class="modern-exp-header">
                  <h4 class="modern-exp-position">${exp.position}</h4>
                  <span class="modern-exp-date">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}</span>
                </div>
                <div class="modern-exp-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                ${exp.description && exp.description.length > 0 ? `
                  <ul class="modern-exp-desc">
                    ${exp.description.map((desc: string) => `<li>${desc}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Education -->
          ${education.length > 0 ? `
          <div class="modern-section">
            <div class="modern-section-title">
              <h3>Education</h3>
            </div>
            ${education.map(edu => `
              <div class="modern-exp-item">
                <div class="modern-exp-header">
                  <h4 class="modern-exp-position">${edu.degree}</h4>
                  <span class="modern-exp-date">${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                </div>
                <div class="modern-exp-company">${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Skills -->
          ${skills.length > 0 ? `
          <div class="modern-section">
            <div class="modern-section-title">
              <h3>Skills</h3>
            </div>
            <div class="modern-skills">
              ${skills.map(skill => `<span class="modern-skill-tag">${skill}</span>`).join('')}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateMinimalistTemplate(personalInfo: any, summary: string | undefined, experience: any[], education: any[], skills: string[], commonStyles: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${personalInfo.fullName} - Resume</title>
      <style>
        ${commonStyles}

        /* Minimalist Template Specific Styles - Matching Client Exactly */
        .minimalist-container {
          padding: 1rem;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          color: rgb(15 23 42);
          background-color: white;
          overflow: hidden;
          font-size: 0.75rem;
        }

        .minimalist-header {
          border-bottom: 2px solid rgb(15 23 42);
          padding-bottom: 0.75rem;
          margin-bottom: 0.75rem;
          flex-shrink: 0;
        }

        .minimalist-name {
          font-size: 1.125rem;
          font-weight: 300;
          letter-spacing: 0.025em;
          color: rgb(15 23 42);
          margin-bottom: 0.25rem;
          line-height: 1.25;
        }

        .minimalist-title {
          font-size: 0.875rem;
          font-weight: 400;
          color: rgb(100 116 139);
          margin-bottom: 0.5rem;
          line-height: 1.25;
        }

        .minimalist-contact {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.75rem;
          color: rgb(100 116 139);
        }

        .minimalist-content {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .minimalist-section {
          margin-bottom: 0.75rem;
        }

        .minimalist-section-title {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 500;
          color: rgb(15 23 42);
          margin-bottom: 0.5rem;
        }

        .minimalist-summary {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.625;
        }

        .minimalist-exp-item {
          margin-bottom: 0.75rem;
        }

        .minimalist-exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .minimalist-exp-position {
          font-size: 0.75rem;
          font-weight: 500;
          color: rgb(15 23 42);
          line-height: 1.25;
        }

        .minimalist-exp-date {
          font-size: 0.75rem;
          color: rgb(100 116 139);
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .minimalist-exp-company {
          font-size: 0.75rem;
          color: rgb(100 116 139);
          line-height: 1.25;
          margin-bottom: 0.25rem;
        }

        .minimalist-exp-desc {
          list-style-type: disc;
          list-style-position: outside;
          padding-left: 1rem;
          margin-top: 0.25rem;
          margin-left: 0.5rem;
        }

        .minimalist-exp-desc li {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.25;
          margin-bottom: 0.125rem;
          display: list-item;
          list-style-type: disc;
          list-style-position: outside;
        }

        .minimalist-skills {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="minimalist-container">
        <!-- Header - Clean and minimal -->
        <div class="minimalist-header">
          <h1 class="minimalist-name">${personalInfo.fullName || "Your Name"}</h1>
          <h2 class="minimalist-title">${personalInfo.jobTitle || "Your Job Title"}</h2>
          <div class="minimalist-contact">
            ${personalInfo.email ? `<div>${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div>${personalInfo.phone}</div>` : ''}
            ${personalInfo.location ? `<div>${personalInfo.location}</div>` : ''}
            ${personalInfo.profileUrl ? `<div>${personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</div>` : ''}
          </div>
        </div>

        <!-- Content Area -->
        <div class="minimalist-content">
          <!-- Summary - Clean typography -->
          ${summary ? `
          <div class="minimalist-section">
            <h3 class="minimalist-section-title">Summary</h3>
            <p class="minimalist-summary">${summary}</p>
          </div>
          ` : ''}

          <!-- Experience - Minimal design -->
          ${experience.length > 0 ? `
          <div class="minimalist-section">
            <h3 class="minimalist-section-title">Experience</h3>
            ${experience.map(exp => `
              <div class="minimalist-exp-item">
                <div class="minimalist-exp-header">
                  <h4 class="minimalist-exp-position">${exp.position}</h4>
                  <span class="minimalist-exp-date">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}</span>
                </div>
                <div class="minimalist-exp-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                ${exp.description && exp.description.length > 0 ? `
                  <ul class="minimalist-exp-desc">
                    ${exp.description.map((desc: string) => `<li>${desc}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Education -->
          ${education.length > 0 ? `
          <div class="minimalist-section">
            <h3 class="minimalist-section-title">Education</h3>
            ${education.map(edu => `
              <div class="minimalist-exp-item">
                <div class="minimalist-exp-header">
                  <h4 class="minimalist-exp-position">${edu.degree}</h4>
                  <span class="minimalist-exp-date">${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}</span>
                </div>
                <div class="minimalist-exp-company">${edu.institution}${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          <!-- Skills -->
          ${skills.length > 0 ? `
          <div class="minimalist-section">
            <h3 class="minimalist-section-title">Skills</h3>
            <div class="minimalist-skills">
              ${skills.join(' • ')}
            </div>
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateCreativeTemplate(personalInfo: any, summary: string | undefined, experience: any[], education: any[], skills: string[], commonStyles: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${personalInfo.fullName} - Resume</title>
      <style>
        ${commonStyles}

        /* Creative Template Specific Styles - Matching Client Exactly */
        .creative-container {
          padding: 0.75rem;
          height: 100%;
          width: 100%;
          display: flex;
          color: rgb(15 23 42);
          background: linear-gradient(to bottom right, rgb(240 253 250), white, rgb(236 253 245));
          overflow: hidden;
          font-size: 0.75rem;
        }

        .creative-sidebar {
          width: 33.333333%;
          background: linear-gradient(to bottom, rgb(13 148 136), rgb(5 150 105));
          color: white;
          padding: 0.75rem;
          border-radius: 0.5rem 0 0 0.5rem;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
          overflow-y: auto;
        }

        .creative-main {
          width: 66.666667%;
          padding: 0.75rem;
          border-radius: 0 0.5rem 0.5rem 0;
          overflow-y: auto;
        }

        .creative-profile {
          margin-bottom: 1rem;
        }

        .creative-avatar {
          width: 3rem;
          height: 3rem;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          margin-left: auto;
          margin-right: auto;
        }

        .creative-avatar-text {
          font-size: 0.875rem;
          font-weight: 700;
        }

        .creative-name {
          font-size: 0.875rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.25rem;
          line-height: 1.25;
        }

        .creative-title {
          font-size: 0.75rem;
          text-align: center;
          opacity: 0.9;
          margin-bottom: 1rem;
          line-height: 1.25;
        }

        .creative-sidebar-section {
          margin-bottom: 1rem;
        }

        .creative-sidebar-title {
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .creative-contact-item {
          font-size: 0.75rem;
          margin-bottom: 0.25rem;
          opacity: 0.9;
          display: flex;
          align-items: center;
        }

        .creative-contact-item::before {
          content: '';
          width: 0.375rem;
          height: 0.375rem;
          background-color: white;
          border-radius: 50%;
          margin-right: 0.5rem;
          opacity: 0.75;
          flex-shrink: 0;
        }

        .creative-skill-item {
          background-color: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          display: inline-block;
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
        }

        .creative-main-section {
          margin-bottom: 1rem;
        }

        .creative-main-title {
          color: rgb(13 148 136);
          font-weight: 700;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .creative-summary {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.625;
        }

        .creative-exp-item {
          margin-bottom: 0.75rem;
        }

        .creative-exp-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .creative-exp-position {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgb(15 23 42);
          line-height: 1.25;
        }

        .creative-exp-date {
          font-size: 0.75rem;
          color: rgb(100 116 139);
          flex-shrink: 0;
          margin-left: 0.5rem;
        }

        .creative-exp-company {
          font-size: 0.75rem;
          color: rgb(13 148 136);
          font-weight: 500;
          line-height: 1.25;
          margin-bottom: 0.25rem;
        }

        .creative-exp-desc {
          list-style-type: disc;
          list-style-position: outside;
          padding-left: 1rem;
          margin-top: 0.25rem;
          margin-left: 0.5rem;
        }

        .creative-exp-desc li {
          font-size: 0.75rem;
          color: rgb(51 65 85);
          line-height: 1.25;
          margin-bottom: 0.125rem;
          display: list-item;
          list-style-type: disc;
          list-style-position: outside;
        }
      </style>
    </head>
    <body>
      <div class="creative-container">
        <!-- Left sidebar -->
        <div class="creative-sidebar">
          <!-- Profile section -->
          <div class="creative-profile">
            <div class="creative-avatar">
              <span class="creative-avatar-text">
                ${personalInfo.fullName ? personalInfo.fullName.split(' ').map((n: string) => n[0]).join('') : 'YN'}
              </span>
            </div>
            <h1 class="creative-name">${personalInfo.fullName || "Your Name"}</h1>
            <h2 class="creative-title">${personalInfo.jobTitle || "Your Job Title"}</h2>
          </div>

          <!-- Contact -->
          <div class="creative-sidebar-section">
            <h3 class="creative-sidebar-title">Contact</h3>
            ${personalInfo.email ? `<div class="creative-contact-item">${personalInfo.email}</div>` : ''}
            ${personalInfo.phone ? `<div class="creative-contact-item">${personalInfo.phone}</div>` : ''}
            ${personalInfo.location ? `<div class="creative-contact-item">${personalInfo.location}</div>` : ''}
            ${personalInfo.profileUrl ? `<div class="creative-contact-item">${personalInfo.profileUrl.replace(/^https?:\/\/(www\.)?/, "")}</div>` : ''}
          </div>

          <!-- Skills -->
          ${skills.length > 0 ? `
          <div class="creative-sidebar-section">
            <h3 class="creative-sidebar-title">Skills</h3>
            <div>
              ${skills.map(skill => `<span class="creative-skill-item">${skill}</span>`).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Education -->
          ${education.length > 0 ? `
          <div class="creative-sidebar-section">
            <h3 class="creative-sidebar-title">Education</h3>
            ${education.map(edu => `
              <div class="creative-exp-item">
                <h4 class="creative-exp-position" style="color: white; font-size: 0.75rem;">${edu.degree}</h4>
                <div class="creative-contact-item">${edu.institution}</div>
                <div class="creative-contact-item" style="font-size: 0.625rem;">
                  ${edu.startDate}${edu.endDate ? ` - ${edu.endDate}` : ''}
                  ${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>

        <!-- Main content -->
        <div class="creative-main">
          <!-- Summary -->
          ${summary ? `
          <div class="creative-main-section">
            <h3 class="creative-main-title">Professional Summary</h3>
            <p class="creative-summary">${summary}</p>
          </div>
          ` : ''}

          <!-- Experience -->
          ${experience.length > 0 ? `
          <div class="creative-main-section">
            <h3 class="creative-main-title">Work Experience</h3>
            ${experience.map(exp => `
              <div class="creative-exp-item">
                <div class="creative-exp-header">
                  <h4 class="creative-exp-position">${exp.position}</h4>
                  <span class="creative-exp-date">${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : ' - Present'}</span>
                </div>
                <div class="creative-exp-company">${exp.company}${exp.location ? ` • ${exp.location}` : ''}</div>
                ${exp.description && exp.description.length > 0 ? `
                  <ul class="creative-exp-desc">
                    ${exp.description.map((desc: string) => `<li>${desc}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `;
}
