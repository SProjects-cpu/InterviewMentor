import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format as formatDate } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateRange(startDate?: string, endDate?: string, current?: boolean): string {
  if (!startDate) return "";

  let start = "";
  let end = "";

  try {
    if (startDate.length === 7) { // YYYY-MM format
      start = formatDate(new Date(startDate), "MMM yyyy");
    } else if (startDate.length === 4) { // YYYY format
      start = startDate;
    } else {
      start = formatDate(new Date(startDate), "MMM yyyy");
    }

    if (current) {
      end = "Present";
    } else if (endDate) {
      if (endDate.length === 7) { // YYYY-MM format
        end = formatDate(new Date(endDate), "MMM yyyy");
      } else if (endDate.length === 4) { // YYYY format
        end = endDate;
      } else {
        end = formatDate(new Date(endDate), "MMM yyyy");
      }
    }
  } catch (error) {
    console.error("Error formatting date range:", error);
    return `${startDate} - ${current ? "Present" : endDate || ""}`;
  }

  return `${start}${end ? ` - ${end}` : ""}`;
}

export function generateInitials(name: string): string {
  if (!name) return "";
  
  const names = name.split(" ");
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function countWords(text: string): number {
  if (!text) return 0;
  const words = text.trim().split(/\s+/);
  return words.length;
}

export function countCharacters(text: string): number {
  if (!text) return 0;
  return text.length;
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

export function isValidHttpUrl(string: string): boolean {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

export function getDomainFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (e) {
    return url;
  }
}

export async function handleDownloadPDF(resumeId: number, resumeTitle: string): Promise<void> {
  const filename = resumeTitle.replace(/\s+/g, '_') + '.pdf';

  // Use client-side PDF generation for pixel-perfect output
  try {
    // Dynamic import for client-side PDF generation
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ]);

    // Find the resume preview element - prioritize full preview modal if open
    let previewElement = document.querySelector('.print-preview-content') as HTMLElement;

    // If modal is not open, use the main preview
    if (!previewElement) {
      previewElement = document.querySelector('.resume-preview-content') as HTMLElement;
    }

    if (!previewElement) {
      throw new Error('Resume preview not found. Please ensure the resume preview is visible.');
    }

    // Clone the element for PDF generation to avoid affecting the UI
    const clonedElement = previewElement.cloneNode(true) as HTMLElement;
    
    // Create a container for the cloned element
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '816px'; // 8.5 inches at 96 DPI
    container.style.backgroundColor = '#ffffff';
    container.appendChild(clonedElement);
    document.body.appendChild(container);

    // Hide ATS score in the clone
    const atsScoreElement = clonedElement.querySelector('.ats-score-overlay') as HTMLElement;
    if (atsScoreElement) {
      atsScoreElement.style.display = 'none';
    }

    // Style the cloned element for PDF
    clonedElement.style.width = '816px';
    clonedElement.style.maxWidth = '816px';
    clonedElement.style.height = 'auto';
    clonedElement.style.minHeight = '1056px'; // 11 inches at 96 DPI
    clonedElement.style.overflow = 'visible';
    clonedElement.style.overflowY = 'visible';
    clonedElement.style.backgroundColor = '#ffffff';
    clonedElement.style.boxShadow = 'none';
    clonedElement.style.transform = 'none';
    clonedElement.style.margin = '0';
    clonedElement.style.padding = '0';

    // Ensure all child elements are visible
    const allElements = clonedElement.querySelectorAll('*');
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style) {
        // Remove any overflow hidden that might clip content
        if (getComputedStyle(htmlEl).overflow === 'hidden') {
          htmlEl.style.overflow = 'visible';
        }
        if (getComputedStyle(htmlEl).overflowY === 'hidden' || getComputedStyle(htmlEl).overflowY === 'auto') {
          htmlEl.style.overflowY = 'visible';
        }
      }
    });

    // Wait for fonts and layout to settle
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 300));

    // Get the actual content height
    const contentHeight = Math.max(clonedElement.scrollHeight, 1056);

    // Create canvas with high quality settings
    const canvas = await html2canvas(clonedElement, {
      scale: 3, // Higher resolution for crisp text
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 816,
      height: contentHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 816,
      windowHeight: contentHeight,
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Additional styling in the cloned document
        const style = clonedDoc.createElement('style');
        style.textContent = `
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .ats-score-overlay {
            display: none !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      }
    });

    // Remove the temporary container
    document.body.removeChild(container);

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Calculate how many pages we need
    const totalPages = Math.ceil(imgHeight / pageHeight);

    // Convert canvas to high-quality image
    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (totalPages === 1) {
      // Single page - add image at top
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    } else {
      // Multi-page content - split across pages
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        const yPosition = -(page * pageHeight);
        pdf.addImage(imgData, 'JPEG', 0, yPosition, imgWidth, imgHeight);
      }
    }

    // Download the PDF
    pdf.save(filename);

  } catch (error) {
    console.error('Client-side PDF generation failed:', error);
    
    // Fallback to server-side PDF generation
    try {
      const response = await fetch(`/api/resumes/${resumeId}/pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }
    } catch (serverError) {
      console.error('Server-side PDF generation also failed:', serverError);
    }

    alert('PDF generation encountered an issue. Please try again or contact support.');
  }
}


