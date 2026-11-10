document.addEventListener('DOMContentLoaded', function() {
    // Initialize settings forms with current values (if available)
    initializeSettings();
    
    // Add animation classes to settings sections
    animateSettingsSections();

    // Handle account settings form submission
    const accountForm = document.getElementById('account-settings');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(accountForm);
            saveSettings('account', formData);
        });
    }

    // Handle password settings form submission
    const passwordForm = document.getElementById('password-settings');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(passwordForm);
            
            // Validate password
            const currentPassword = formData.get('current-password');
            const newPassword = formData.get('new-password');
            const confirmPassword = formData.get('confirm-password');
            
            if (!currentPassword) {
                showMessage('Current password is required!', 'error');
                return;
            }
            
            if (!newPassword) {
                showMessage('New password is required!', 'error');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showMessage('Passwords do not match!', 'error');
                return;
            }
            
            if (newPassword.length < 8) {
                showMessage('Password must be at least 8 characters!', 'error');
                return;
            }
            
            saveSettings('password', formData);
        });
    }

    // Handle theme settings form submission
    const themeForm = document.getElementById('theme-settings');
    if (themeForm) {
        themeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(themeForm);
            saveSettings('theme', formData);
            
            // Apply theme changes immediately
            applyThemeSettings(formData);
        });
        
        // Apply theme changes on selection
        const themeRadios = document.querySelectorAll('input[name="theme"]');
        themeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                const formData = new FormData(themeForm);
                applyThemeSettings(formData);
                
                // Auto-save theme settings when changed
                saveSettings('theme', formData, true);
            });
        });
        
        // Apply font size changes on selection
        const fontSizeSelect = document.getElementById('font-size');
        if (fontSizeSelect) {
            fontSizeSelect.addEventListener('change', function() {
                const formData = new FormData(themeForm);
                applyThemeSettings(formData);
                
                // Auto-save font size settings when changed
                saveSettings('theme', formData, true);
            });
        }
    }

    // Handle privacy settings form submission
    const privacyForm = document.getElementById('privacy-settings');
    if (privacyForm) {
        privacyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(privacyForm);
            saveSettings('privacy', formData);
        });
        
        // Auto-save privacy settings when toggles are changed
        const privacyToggles = privacyForm.querySelectorAll('input[type="checkbox"]');
        privacyToggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const formData = new FormData(privacyForm);
                saveSettings('privacy', formData, true);
            });
        });
        
        // Auto-save privacy settings when dropdown is changed
        const privacyDropdown = document.getElementById('profile-visibility');
        if (privacyDropdown) {
            privacyDropdown.addEventListener('change', function() {
                const formData = new FormData(privacyForm);
                saveSettings('privacy', formData, true);
            });
        }
    }

    // Handle notification settings form submission
    const notificationForm = document.getElementById('notification-settings');
    if (notificationForm) {
        notificationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(notificationForm);
            saveSettings('notification', formData);
        });
        
        // Auto-save notification settings when toggles are changed
        const notificationToggles = notificationForm.querySelectorAll('input[type="checkbox"]');
        notificationToggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const formData = new FormData(notificationForm);
                saveSettings('notification', formData, true);
            });
        });
    }
    
    // Handle accessibility settings form submission
    const accessibilityForm = document.getElementById('accessibility-settings');
    if (accessibilityForm) {
        accessibilityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(accessibilityForm);
            saveSettings('accessibility', formData);
            
            // Apply accessibility changes immediately
            applyAccessibilitySettings(formData);
        });
        
        // Apply accessibility changes on toggle
        const accessibilityToggles = accessibilityForm.querySelectorAll('input[type="checkbox"]');
        accessibilityToggles.forEach(toggle => {
            toggle.addEventListener('change', function() {
                const formData = new FormData(accessibilityForm);
                applyAccessibilitySettings(formData);
                
                // Auto-save accessibility settings when changed
                saveSettings('accessibility', formData, true);
            });
        });
    }

    // Function to save settings to the server
    function saveSettings(type, formData, silent = false) {
        // Show loading state
        const submitButton = silent ? null : event.submitter;
        if (submitButton) {
            const originalText = submitButton.textContent;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Saving...';
            submitButton.disabled = true;
        }
        
        fetch('/api/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: type,
                data: Object.fromEntries(formData)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (!silent) {
                    showMessage('Settings saved successfully!', 'success');
                }
                
                // Store settings in localStorage for persistence
                localStorage.setItem(`settings_${type}`, JSON.stringify(Object.fromEntries(formData)));
            } else {
                showMessage('Error saving settings: ' + data.message, 'error');
            }
        })
        .catch(error => {
            showMessage('Network error: ' + error.message, 'error');
        })
        .finally(() => {
            // Reset button state
            if (submitButton) {
                submitButton.innerHTML = '<i class="fas fa-save me-2"></i>Save Changes';
                submitButton.disabled = false;
            }
        });
    }

    // Function to display messages
    function showMessage(message, type) {
        // Remove any existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        // Add icon based on message type
        const icon = document.createElement('i');
        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
        }
        
        const textSpan = document.createElement('span');
        textSpan.textContent = message;
        
        messageDiv.appendChild(icon);
        messageDiv.appendChild(textSpan);
        
        document.body.appendChild(messageDiv);
        
        // Auto-hide the message after 3 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 3000);
    }
    
    // Function to initialize settings forms with saved values
    function initializeSettings() {
        // Account settings
        const accountData = localStorage.getItem('settings_account');
        if (accountData && document.getElementById('account-settings')) {
            try {
                const data = JSON.parse(accountData);
                // Skip username and email as they should come from the server
                if (data.bio) {
                    document.getElementById('bio').value = data.bio;
                }
            } catch (e) {
                console.error('Error parsing account settings:', e);
            }
        }
        
        // Theme settings
        const themeData = localStorage.getItem('settings_theme');
        if (themeData && document.getElementById('theme-settings')) {
            try {
                const data = JSON.parse(themeData);
                if (data.theme) {
                    document.querySelector(`input[name="theme"][value="${data.theme}"]`).checked = true;
                }
                if (data['font-size']) {
                    document.getElementById('font-size').value = data['font-size'];
                }
                applyThemeSettings(new FormData(document.getElementById('theme-settings')));
            } catch (e) {
                console.error('Error parsing theme settings:', e);
            }
        }
        
        // Privacy settings
        const privacyData = localStorage.getItem('settings_privacy');
        if (privacyData && document.getElementById('privacy-settings')) {
            try {
                const data = JSON.parse(privacyData);
                if (data['profile-visibility']) {
                    document.getElementById('profile-visibility').value = data['profile-visibility'];
                }
                if (data['activity-tracking'] !== undefined) {
                    document.getElementById('activity-tracking').checked = data['activity-tracking'] === 'on';
                }
                if (data['data-collection'] !== undefined) {
                    document.getElementById('data-collection').checked = data['data-collection'] === 'on';
                }
            } catch (e) {
                console.error('Error parsing privacy settings:', e);
            }
        }
        
        // Notification settings
        const notificationData = localStorage.getItem('settings_notification');
        if (notificationData && document.getElementById('notification-settings')) {
            try {
                const data = JSON.parse(notificationData);
                const checkboxes = document.querySelectorAll('#notification-settings input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    if (data[checkbox.name] !== undefined) {
                        checkbox.checked = data[checkbox.name] === 'on';
                    }
                });
            } catch (e) {
                console.error('Error parsing notification settings:', e);
            }
        }
        
        // Accessibility settings
        const accessibilityData = localStorage.getItem('settings_accessibility');
        if (accessibilityData && document.getElementById('accessibility-settings')) {
            try {
                const data = JSON.parse(accessibilityData);
                const checkboxes = document.querySelectorAll('#accessibility-settings input[type="checkbox"]');
                checkboxes.forEach(checkbox => {
                    if (data[checkbox.name] !== undefined) {
                        checkbox.checked = data[checkbox.name] === 'on';
                    }
                });
                applyAccessibilitySettings(new FormData(document.getElementById('accessibility-settings')));
            } catch (e) {
                console.error('Error parsing accessibility settings:', e);
            }
        }
    }
    
    // Function to apply theme settings
    function applyThemeSettings(formData) {
        const theme = formData.get('theme');
        const fontSize = formData.get('font-size');
        
        // Apply theme
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-system');
        if (theme === 'light') {
            document.body.classList.add('theme-light');
            document.documentElement.style.setProperty('--primary-bg', '#f8f9fa');
            document.documentElement.style.setProperty('--secondary-bg', '#e9ecef');
            document.documentElement.style.setProperty('--text-color', '#212529');
        } else if (theme === 'dark') {
            document.body.classList.add('theme-dark');
            document.documentElement.style.setProperty('--primary-bg', '#1a202c');
            document.documentElement.style.setProperty('--secondary-bg', '#2d3748');
            document.documentElement.style.setProperty('--text-color', '#f8f9fa');
        } else if (theme === 'system') {
            document.body.classList.add('theme-system');
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.style.setProperty('--primary-bg', '#1a202c');
                document.documentElement.style.setProperty('--secondary-bg', '#2d3748');
                document.documentElement.style.setProperty('--text-color', '#f8f9fa');
            } else {
                document.documentElement.style.setProperty('--primary-bg', '#f8f9fa');
                document.documentElement.style.setProperty('--secondary-bg', '#e9ecef');
                document.documentElement.style.setProperty('--text-color', '#212529');
            }
        }
        
        // Apply font size
        document.documentElement.style.fontSize = fontSize === 'small' ? '14px' : 
                                                 fontSize === 'large' ? '18px' : '16px';
                                                 
        // Add a subtle animation to show the change
        const settingsSections = document.querySelectorAll('.settings-section');
        settingsSections.forEach(section => {
            section.style.transition = 'all 0.5s ease';
            section.style.transform = 'scale(1.01)';
            setTimeout(() => {
                section.style.transform = 'scale(1)';
            }, 300);
        });
    }
    
    // Function to apply accessibility settings
    function applyAccessibilitySettings(formData) {
        const highContrast = formData.get('high-contrast') === 'on';
        const reduceAnimations = formData.get('reduce-animations') === 'on';
        const screenReader = formData.get('screen-reader') === 'on';
        
        // Apply high contrast mode
        if (highContrast) {
            document.body.classList.add('high-contrast');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
            document.documentElement.style.setProperty('--bg-color', '#000000');
            document.documentElement.style.setProperty('--border-color', '#ffffff');
        } else {
            document.body.classList.remove('high-contrast');
            document.documentElement.style.removeProperty('--text-color');
            document.documentElement.style.removeProperty('--bg-color');
            document.documentElement.style.removeProperty('--border-color');
        }
        
        // Apply reduced animations
        if (reduceAnimations) {
            document.body.classList.add('reduce-motion');
        } else {
            document.body.classList.remove('reduce-motion');
        }
        
        // Apply screen reader support
        if (screenReader) {
            document.body.classList.add('screen-reader');
            // Add ARIA attributes where needed
            document.querySelectorAll('button, a').forEach(el => {
                if (!el.getAttribute('aria-label') && el.textContent.trim()) {
                    el.setAttribute('aria-label', el.textContent.trim());
                }
            });
            
            // Add role attributes to improve screen reader experience
            document.querySelectorAll('.settings-section').forEach(section => {
                section.setAttribute('role', 'region');
                const heading = section.querySelector('h2');
                if (heading) {
                    const id = 'heading-' + Math.random().toString(36).substr(2, 9);
                    heading.setAttribute('id', id);
                    section.setAttribute('aria-labelledby', id);
                }
            });
        }
    }
    
    // Function to add animation classes to settings sections
    function animateSettingsSections() {
        const settingsSections = document.querySelectorAll('.settings-section');
        settingsSections.forEach((section, index) => {
            // Add staggered animation delay
            section.style.animationDelay = `${index * 0.1}s`;
            
            // Add hover effect with gradient shift
            section.addEventListener('mouseenter', function() {
                this.style.backgroundImage = 'linear-gradient(135deg, #2d3748, #1e293b)';
                this.style.borderLeftColor = '#63b3ed';
            });
            
            section.addEventListener('mouseleave', function() {
                this.style.backgroundImage = 'linear-gradient(135deg, #2d3748, #1a202c)';
                this.style.borderLeftColor = '#007bff';
            });
        });
        
        // Add pulse animation to buttons
        const buttons = document.querySelectorAll('.btn-primary');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.classList.add('pulse');
            });
            
            button.addEventListener('mouseleave', function() {
                this.classList.remove('pulse');
            });
        });
    }
});
