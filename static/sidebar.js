// Sidebar functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggler = document.getElementById('sidebarToggler');
    
    // Function to toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('shifted');
        
        // Initialize scroll behavior after toggle
        if (sidebar.classList.contains('active')) {
            setTimeout(initSidebarScroll, 300); // Wait for transition to complete
        }
    }
    
    // Function to initialize sidebar scroll behavior
    function initSidebarScroll() {
        const sidebarNav = sidebar.querySelector('.nav');
        const viewportHeight = window.innerHeight;
        const sidebarHeaderHeight = sidebar.querySelector('.sidebar-header').offsetHeight;
        const navHeight = sidebarNav.scrollHeight;
        
        // If content exceeds viewport height, ensure scrolling is enabled
        if (navHeight + sidebarHeaderHeight > viewportHeight) {
            sidebar.style.overflowY = 'scroll'; // Use 'scroll' instead of 'auto' for better touch device support
            // Add a class to indicate scrollable content
            sidebar.classList.add('scrollable');
            
            // Add touch-based scrolling indicators for mobile
            addScrollIndicators();
        } else {
            sidebar.style.overflowY = 'hidden';
            sidebar.classList.remove('scrollable');
            removeScrollIndicators();
        }
    }
    
    // Function to add visual scroll indicators for touch devices
    function addScrollIndicators() {
        // Remove any existing indicators
        removeScrollIndicators();
        
        // Only add indicators if on a touch device
        if ('ontouchstart' in window || navigator.maxTouchPoints) {
            const indicator = document.createElement('div');
            indicator.className = 'scroll-indicator';
            indicator.innerHTML = '<div class="scroll-dot"></div><div class="scroll-dot"></div><div class="scroll-dot"></div>';
            sidebar.appendChild(indicator);
            
            // Hide indicator after a few seconds
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    removeScrollIndicators();
                }, 500);
            }, 3000);
            
            // Show indicator when user touches sidebar
            sidebar.addEventListener('touchstart', () => {
                if (!sidebar.querySelector('.scroll-indicator')) {
                    addScrollIndicators();
                }
            }, { passive: true });
        }
    }
    
    // Function to remove scroll indicators
    function removeScrollIndicators() {
        const indicators = sidebar.querySelectorAll('.scroll-indicator');
        indicators.forEach(indicator => {
            indicator.remove();
        });
    }
    
    // Initialize sidebar
    if (sidebarToggler) {
        sidebarToggler.addEventListener('click', toggleSidebar);
    }
    
    // Make toggleSidebar function available globally
    window.toggleSidebar = toggleSidebar;
    
    // Initialize sidebar scroll behavior on page load
    if (sidebar.classList.contains('active')) {
        initSidebarScroll();
    }
    
    // Update scroll behavior on window resize
    window.addEventListener('resize', () => {
        if (sidebar.classList.contains('active')) {
            initSidebarScroll();
        }
    });
    
    // Initialize settings functionality
    initSettings();
});

// Settings functionality
function initSettings() {
    // Theme selection
    const themeOptions = document.querySelectorAll('.theme-option');
    const savedTheme = localStorage.getItem('preferredTheme') || 'gradient';
    
    // Set active theme on load
    themeOptions.forEach(option => {
        const theme = option.getAttribute('data-theme');
        if (theme === savedTheme) {
            option.classList.add('active');
            applyTheme(theme);
        }
        
        // Add click event listener
        option.addEventListener('click', () => {
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            option.classList.add('active');
            // Apply the theme
            const selectedTheme = option.getAttribute('data-theme');
            applyTheme(selectedTheme);
            // Save preference
            localStorage.setItem('preferredTheme', selectedTheme);
        });
    });
    
    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
    toggleSwitches.forEach(toggle => {
        const toggleId = toggle.id;
        if (toggleId) {
            // Load saved state
            const savedState = localStorage.getItem(toggleId);
            if (savedState !== null) {
                toggle.checked = savedState === 'true';
            }
            
            // Apply settings on load
            if (toggleId === 'reducedMotionToggle') {
                applyReducedMotion(toggle.checked);
            } else if (toggleId === 'highContrastToggle') {
                applyHighContrast(toggle.checked);
            }
            
            // Add change event listener
            toggle.addEventListener('change', () => {
                // Save state
                localStorage.setItem(toggleId, toggle.checked);
                
                // Apply settings
                if (toggleId === 'reducedMotionToggle') {
                    applyReducedMotion(toggle.checked);
                } else if (toggleId === 'highContrastToggle') {
                    applyHighContrast(toggle.checked);
                }
                
                // Show feedback
                showSettingsFeedback(toggle.checked ? 'Enabled' : 'Disabled');
            });
        }
    });
    
    // Font size range
    const fontSizeRange = document.getElementById('fontSizeRange');
    if (fontSizeRange) {
        // Load saved font size
        const savedFontSize = localStorage.getItem('fontSize') || '100';
        fontSizeRange.value = savedFontSize;
        applyFontSize(savedFontSize);
        
        // Add input event listener
        fontSizeRange.addEventListener('input', () => {
            const fontSize = fontSizeRange.value;
            applyFontSize(fontSize);
        });
        
        // Save on change (when user stops dragging)
        fontSizeRange.addEventListener('change', () => {
            const fontSize = fontSizeRange.value;
            localStorage.setItem('fontSize', fontSize);
            showSettingsFeedback('Font size updated');
        });
    }
    
    // Language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        // Load saved language
        const savedLanguage = localStorage.getItem('language') || 'en';
        languageSelect.value = savedLanguage;
        
        // Add change event listener
        languageSelect.addEventListener('change', () => {
            const language = languageSelect.value;
            localStorage.setItem('language', language);
            showSettingsFeedback(`Language changed to ${languageSelect.options[languageSelect.selectedIndex].text}`);
        });
    }
    
    // Save settings button
    const saveButton = document.querySelector('.btn-settings-save');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            // Save all current settings
            saveAllSettings();
            showSettingsFeedback('Settings saved successfully');
            
            // Close settings panel
            const settingsToggle = document.querySelector('.settings-toggle');
            if (settingsToggle && settingsToggle.getAttribute('aria-expanded') === 'true') {
                settingsToggle.click();
            }
        });
    }
    
    // Reset settings button
    const resetButton = document.querySelector('.btn-settings-reset');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // Reset all settings to defaults
            resetAllSettings();
            showSettingsFeedback('Settings reset to defaults');
        });
    }
}

// Apply theme
function applyTheme(theme) {
    const body = document.body;
    
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-gradient');
    
    // Add selected theme class
    body.classList.add(`theme-${theme}`);
    
    // Apply specific theme styles
    switch (theme) {
        case 'light':
            document.documentElement.style.setProperty('--primary-gradient-start', '#f8f9fa');
            document.documentElement.style.setProperty('--primary-gradient-end', '#e9ecef');
            document.documentElement.style.setProperty('--text-primary', '#212529');
            document.documentElement.style.setProperty('--text-secondary', '#495057');
            document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.8)');
            break;
        case 'dark':
            document.documentElement.style.setProperty('--primary-gradient-start', '#212529');
            document.documentElement.style.setProperty('--primary-gradient-end', '#343a40');
            document.documentElement.style.setProperty('--text-primary', '#f8f9fa');
            document.documentElement.style.setProperty('--text-secondary', '#e9ecef');
            document.documentElement.style.setProperty('--card-bg', 'rgba(52, 58, 64, 0.8)');
            break;
        case 'gradient':
            document.documentElement.style.setProperty('--primary-gradient-start', '#1a3a8f');
            document.documentElement.style.setProperty('--primary-gradient-end', '#00c6ff');
            document.documentElement.style.setProperty('--text-primary', '#f8f9fa');
            document.documentElement.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.85)');
            document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.15)');
            break;
    }
    
    // Show feedback
    showSettingsFeedback(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`);
}

// Apply reduced motion
function applyReducedMotion(enabled) {
    if (enabled) {
        document.documentElement.classList.add('reduced-motion');
    } else {
        document.documentElement.classList.remove('reduced-motion');
    }
}

// Apply high contrast
function applyHighContrast(enabled) {
    if (enabled) {
        document.documentElement.classList.add('high-contrast');
        document.documentElement.style.setProperty('--text-primary', '#ffffff');
        document.documentElement.style.setProperty('--text-secondary', '#f8f9fa');
        document.documentElement.style.setProperty('--card-border', 'rgba(255, 255, 255, 0.5)');
    } else {
        document.documentElement.classList.remove('high-contrast');
        // Reset to theme defaults
        const activeTheme = localStorage.getItem('preferredTheme') || 'gradient';
        applyTheme(activeTheme);
    }
}

// Apply font size
function applyFontSize(size) {
    document.documentElement.style.fontSize = `${size}%`;
}

// Save all settings
function saveAllSettings() {
    // Theme
    const activeTheme = document.querySelector('.theme-option.active');
    if (activeTheme) {
        localStorage.setItem('preferredTheme', activeTheme.getAttribute('data-theme'));
    }
    
    // Toggles
    document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(toggle => {
        if (toggle.id) {
            localStorage.setItem(toggle.id, toggle.checked);
        }
    });
    
    // Font size
    const fontSizeRange = document.getElementById('fontSizeRange');
    if (fontSizeRange) {
        localStorage.setItem('fontSize', fontSizeRange.value);
    }
    
    // Language
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        localStorage.setItem('language', languageSelect.value);
    }
}

// Reset all settings to defaults
function resetAllSettings() {
    // Clear localStorage settings
    localStorage.removeItem('preferredTheme');
    localStorage.removeItem('reducedMotionToggle');
    localStorage.removeItem('highContrastToggle');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('language');
    
    // Reset theme
    const gradientTheme = document.querySelector('.theme-option[data-theme="gradient"]');
    if (gradientTheme) {
        document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
        gradientTheme.classList.add('active');
        applyTheme('gradient');
    }
    
    // Reset toggles
    document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(toggle => {
        if (toggle.id === 'reducedMotionToggle' || toggle.id === 'highContrastToggle') {
            toggle.checked = false;
            
            if (toggle.id === 'reducedMotionToggle') {
                applyReducedMotion(false);
            } else if (toggle.id === 'highContrastToggle') {
                applyHighContrast(false);
            }
        }
    });
    
    // Reset font size
    const fontSizeRange = document.getElementById('fontSizeRange');
    if (fontSizeRange) {
        fontSizeRange.value = 100;
        applyFontSize(100);
    }
    
    // Reset language
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = 'en';
    }
}

// Show feedback toast
function showSettingsFeedback(message) {
    // Remove any existing feedback
    const existingFeedback = document.querySelector('.settings-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create feedback element
    const feedback = document.createElement('div');
    feedback.className = 'settings-feedback';
    feedback.textContent = message;
    document.body.appendChild(feedback);
    
    // Show feedback
    setTimeout(() => {
        feedback.classList.add('show');
        
        // Hide after delay
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                feedback.remove();
            }, 300);
        }, 2000);
    }, 10);
}

// Add feedback styles
(function addFeedbackStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .settings-feedback {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #4361ee;
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: 500;
        }
        
        .settings-feedback.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .reduced-motion * {
            animation-duration: 0.001s !important;
            transition-duration: 0.001s !important;
        }
        
        .high-contrast {
            --card-bg: rgba(0, 0, 0, 0.8) !important;
            --card-border: rgba(255, 255, 255, 0.5) !important;
            --accent-color-1: #4361ee !important;
            --accent-color-2: #3a56d4 !important;
        }
        
        .high-contrast .card-title h3,
        .high-contrast .section-title,
        .high-contrast .path-title,
        .high-contrast .trend-title,
        .high-contrast .industry-item strong {
            color: white !important;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
        }
        
        .high-contrast .card-content p,
        .high-contrast .path-description,
        .high-contrast .trend-description,
        .high-contrast .industry-item div {
            color: #f8f9fa !important;
        }
    `;
    document.head.appendChild(style);
})(); 