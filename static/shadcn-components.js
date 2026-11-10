// shadcn UI Components for Flask - JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all shadcn components
    initDropdowns();
    initModals();
    initTooltips();
    initThemeToggle();
});

// Dropdown functionality
function initDropdowns() {
    const dropdownTriggers = document.querySelectorAll('.shadcn-dropdown-trigger');
    
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const dropdown = trigger.closest('.shadcn-dropdown');
            
            // Close all other dropdowns
            document.querySelectorAll('.shadcn-dropdown.open').forEach(openDropdown => {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('open');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('open');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.shadcn-dropdown')) {
            document.querySelectorAll('.shadcn-dropdown.open').forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });
}

// Modal functionality
function initModals() {
    const modalTriggers = document.querySelectorAll('[data-shadcn-modal]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.getAttribute('data-shadcn-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('open');
                document.body.classList.add('shadcn-modal-open');
                
                // Focus first focusable element
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (focusableElements.length > 0) {
                    focusableElements[0].focus();
                }
            }
        });
    });
    
    // Close modal buttons
    const closeButtons = document.querySelectorAll('.shadcn-modal-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.shadcn-modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking overlay
    document.querySelectorAll('.shadcn-modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                const modal = overlay.closest('.shadcn-modal');
                closeModal(modal);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.shadcn-modal.open');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('open');
        document.body.classList.remove('shadcn-modal-open');
    }
}

// Tooltip functionality
function initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-shadcn-tooltip]');
    
    tooltipTriggers.forEach(trigger => {
        const tooltipText = trigger.getAttribute('data-shadcn-tooltip');
        const tooltip = document.createElement('div');
        tooltip.className = 'shadcn-tooltip';
        tooltip.textContent = tooltipText;
        
        // Position tooltip
        trigger.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            const triggerRect = trigger.getBoundingClientRect();
            
            tooltip.style.top = `${triggerRect.top - tooltip.offsetHeight - 5}px`;
            tooltip.style.left = `${triggerRect.left + (triggerRect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.classList.add('visible');
        });
        
        trigger.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.querySelector('.shadcn-theme-toggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark');
            
            // Save preference to localStorage
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('shadcn-theme', isDark ? 'dark' : 'light');
        });
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('shadcn-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
        }
    }
}

// Accordion functionality
function initAccordions() {
    const accordionTriggers = document.querySelectorAll('.shadcn-accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const accordion = trigger.closest('.shadcn-accordion-item');
            const content = accordion.querySelector('.shadcn-accordion-content');
            
            // Toggle current accordion
            accordion.classList.toggle('open');
            
            // Animate content height
            if (accordion.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0';
            }
        });
    });
}

// Tabs functionality
function initTabs() {
    const tabGroups = document.querySelectorAll('.shadcn-tabs');
    
    tabGroups.forEach(tabGroup => {
        const tabs = tabGroup.querySelectorAll('.shadcn-tab');
        const panels = tabGroup.querySelectorAll('.shadcn-tab-panel');
        
        tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Deactivate all tabs and hide panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Activate clicked tab and show corresponding panel
                tab.classList.add('active');
                panels[index].classList.add('active');
            });
        });
        
        // Activate first tab by default
        if (tabs.length > 0 && panels.length > 0) {
            tabs[0].classList.add('active');
            panels[0].classList.add('active');
        }
    });
}

// Form validation
function initFormValidation() {
    const forms = document.querySelectorAll('.shadcn-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            // Check required fields
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    showFieldError(field, 'This field is required');
                } else {
                    clearFieldError(field);
                }
            });
            
            // Prevent form submission if validation fails
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // Clear errors on input
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => {
                clearFieldError(field);
            });
        });
    });
}

function showFieldError(field, message) {
    const formItem = field.closest('.shadcn-form-item');
    if (formItem) {
        let errorMessage = formItem.querySelector('.shadcn-form-message');
        
        if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'shadcn-form-message';
            formItem.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
        field.classList.add('error');
    }
}

function clearFieldError(field) {
    const formItem = field.closest('.shadcn-form-item');
    if (formItem) {
        const errorMessage = formItem.querySelector('.shadcn-form-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
        field.classList.remove('error');
    }
}

// Modern animations and interactions
function initModernAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.shadcn-feature-card, .shadcn-stat-item, .shadcn-testimonial').forEach(el => {
        observer.observe(el);
    });

    // Add CSS for animations
    if (!document.querySelector('#shadcn-animations')) {
        const style = document.createElement('style');
        style.id = 'shadcn-animations';
        style.textContent = `
            .shadcn-feature-card,
            .shadcn-stat-item,
            .shadcn-testimonial {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }

            .shadcn-feature-card.animate-in,
            .shadcn-stat-item.animate-in,
            .shadcn-testimonial.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }
}

// Progress bar animation
function animateProgress() {
    const progressBars = document.querySelectorAll('.shadcn-progress-indicator');

    progressBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-progress') || '0';
        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, 500);
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.shadcn-stat-number[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.shadcn-hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    });
}

// Enhanced theme toggle with smooth transition
function enhancedThemeToggle() {
    const themeToggle = document.querySelector('.shadcn-theme-toggle');

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Add transition class
            document.body.classList.add('theme-transitioning');

            // Toggle theme
            document.body.classList.toggle('dark');

            // Update icon
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('dark')) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }

            // Save preference
            const isDark = document.body.classList.contains('dark');
            localStorage.setItem('shadcn-theme', isDark ? 'dark' : 'light');

            // Remove transition class after animation
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 300);
        });

        // Check for saved theme preference
        const savedTheme = localStorage.getItem('shadcn-theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark');
            const icon = themeToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-sun';
        }
    }
}

// Initialize all modern features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize existing components
    initDropdowns();
    initModals();
    initTooltips();
    initAccordions();
    initTabs();
    initFormValidation();

    // Initialize modern features
    initModernAnimations();
    initSmoothScroll();
    initParallax();
    enhancedThemeToggle();

    // Animate elements when page loads
    setTimeout(() => {
        animateProgress();
        animateCounters();
    }, 500);
});