// AI Coding Test JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const codeEditor = document.getElementById('code-editor') || document.getElementById('codeEditor');
    const runButton = document.getElementById('run-code') || document.getElementById('runBtn');
    const clearButton = document.getElementById('clear-code') || document.getElementById('clearBtn');
    const terminalOutput = document.getElementById('terminal-output') || document.getElementById('terminalOutput');
    const aiReviewContent = document.getElementById('ai-review-content');
    
    console.log('Code Editor:', codeEditor);
    console.log('Run Button:', runButton);
    console.log('Clear Button:', clearButton);
    console.log('Terminal Output:', terminalOutput);
    console.log('AI Review Content:', aiReviewContent);
    
    // Default code templates for different challenges
    const codeTemplates = {
        'string_reversal': `def solution(input_string):
    # Write your code here to reverse the string
    return input_string[::-1]

# Test cases
print(solution("Hello"))
print(solution("Interview Mentor"))
print(solution(""))`,
        'palindrome': `def solution(input_string):
    # Write your code here to check if the string is a palindrome
    # Remember to handle non-alphanumeric characters and case sensitivity
    
    # Clean the string: remove non-alphanumeric chars and convert to lowercase
    cleaned = ''.join(char.lower() for char in input_string if char.isalnum())
    
    # Check if the cleaned string is equal to its reverse
    return cleaned == cleaned[::-1]

# Test cases
print(solution("A man, a plan, a canal: Panama"))  # Should return True
print(solution("race a car"))  # Should return False
print(solution(" "))  # Should return True`,
        'default': `def solution(input_data):
    # Write your solution here
    return input_data

# Test your solution
print(solution("test input"))`
    };
    
    // Function to clear terminal and AI review
    function clearTerminalAndReview() {
        if (terminalOutput) {
            terminalOutput.innerHTML = '<div class="section-header">Ready to run your code...</div>';
        }
        if (aiReviewContent) {
            aiReviewContent.innerHTML = '<div class="section-header">AI review will appear here...</div>';
        }
    }
    
    // Function to get challenge type from URL or data attribute
    function getChallengeType() {
        // Try to get from URL
        const urlParts = window.location.pathname.split('/');
        const challengeId = urlParts[urlParts.length - 1];
        
        // Check if it's a known challenge type
        if (challengeId === '1') return 'string_reversal';
        if (challengeId === '2') return 'palindrome';
        
        // Try to get from data attribute
        const challengeContainer = document.querySelector('.challenge-card[data-type]');
        if (challengeContainer) {
            const type = challengeContainer.getAttribute('data-type');
            if (type === 'string-reversal') return 'string_reversal';
            if (type === 'palindrome') return 'palindrome';
            return type;
        }
        
        // Default
        return 'default';
    }
    
    // Initialize with appropriate code template if code editor exists
    if (codeEditor) {
        // Set initial value if empty
        if (codeEditor.value === '' || codeEditor.value.trim() === '') {
            const challengeType = getChallengeType();
            codeEditor.value = codeTemplates[challengeType] || codeTemplates['default'];
        }
        
        // Make code editor usable
        codeEditor.addEventListener('click', function() {
            // Ensure the editor is focused and usable
            this.focus();
        });
        
        // Make sure the editor is editable
        codeEditor.readOnly = false;
        
        // Add tab key support
        codeEditor.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                
                // Insert tab at cursor position
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                // Set textarea value to: text before caret + tab + text after caret
                this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                
                // Move caret to position after inserted tab
                this.selectionStart = this.selectionEnd = start + 4;
            }
        });
        
        // Add auto-resize for the editor
        codeEditor.addEventListener('input', function() {
            // Ensure minimum height
            const minHeight = 300;
            // Reset height to auto to get the natural height
            this.style.height = 'auto';
            // Set new height based on scrollHeight, but not less than minHeight
            this.style.height = Math.max(minHeight, this.scrollHeight) + 'px';
        });
        
        // Trigger resize on load
        setTimeout(() => {
            const event = new Event('input');
            codeEditor.dispatchEvent(event);
        }, 100);
    }
    
    // Run code button click handler
    if (runButton) {
        runButton.addEventListener('click', runCode);
    }
    
    // Clear code button click handler
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            if (codeEditor) {
                const challengeType = getChallengeType();
                codeEditor.value = codeTemplates[challengeType] || codeTemplates['default'];
                clearTerminalAndReview();
                
                // Trigger resize
                const event = new Event('input');
                codeEditor.dispatchEvent(event);
            }
        });
    }
    
    // Function to run code
    function runCode() {
        if (!codeEditor || !terminalOutput) {
            console.error('Code editor or terminal output not found');
            return;
        }
        
        const code = codeEditor.value;
        const language = 'python'; // Default to Python
        
        // Get challenge ID from URL or data attribute
        let challengeId = 'default';
        const urlParts = window.location.pathname.split('/');
        const urlChallenge = urlParts[urlParts.length - 1];
        
        if (urlChallenge && !isNaN(urlChallenge)) {
            challengeId = urlChallenge;
        } else {
            // Try to get from practice mode
            const challengeType = getChallengeType();
            if (challengeType === 'string_reversal') {
                challengeId = 'string_reversal';
            } else if (challengeType === 'palindrome') {
                challengeId = 'palindrome';
            }
        }
        
        // Disable run button and show loading
        if (runButton) {
            runButton.disabled = true;
            runButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...';
        }
        
        // Show loading in terminal
        terminalOutput.innerHTML = '<div class="section-header">Running your code...</div>';
        
        // Clear AI review and show loading
        if (aiReviewContent) {
            aiReviewContent.innerHTML = '<div class="ai-loading">Generating AI review...</div>';
        }
        
        // Execute the code
        fetch('/api/execute-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code: code,
                language: language,
                challenge_id: challengeId
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Re-enable run button
            if (runButton) {
                runButton.disabled = false;
                runButton.innerHTML = '<i class="fas fa-play"></i> Run Code';
            }
            
            // Display execution result
            if (data.execution_result) {
                terminalOutput.innerHTML = formatTerminalOutput(data.execution_result.output);
            } else {
                terminalOutput.innerHTML = '<div class="error">Error: No execution result returned</div>';
            }
            
            // Display AI review if available
            if (aiReviewContent) {
                if (data.ai_review && data.ai_review.status === 'success') {
                    aiReviewContent.innerHTML = data.ai_review.review;
                    
                    // Ensure the AI review container is visible and scrollable
                    const aiReviewContainer = document.querySelector('.ai-review-container');
                    if (aiReviewContainer) {
                        aiReviewContainer.style.display = 'block';
                    }
                    
                    // Add syntax highlighting to code blocks if any
                    const codeBlocks = aiReviewContent.querySelectorAll('pre code');
                    if (codeBlocks.length > 0 && window.hljs) {
                        codeBlocks.forEach(block => {
                            window.hljs.highlightBlock(block);
                        });
                    }
                } else if (data.ai_review && data.ai_review.status === 'error') {
                    aiReviewContent.innerHTML = `<div class="error">AI Review Error: ${data.ai_review.message || 'Unknown error'}</div>`;
                } else {
                    aiReviewContent.innerHTML = '<div class="section-header">No AI review available</div>';
                }
            }
        })
        .catch(error => {
            console.error('Error executing code:', error);
            if (terminalOutput) {
                terminalOutput.innerHTML = `<div class="error">Error: ${error.message}</div>`;
            }
            
            // Re-enable run button
            if (runButton) {
                runButton.disabled = false;
                runButton.innerHTML = '<i class="fas fa-play"></i> Run Code';
            }
            
            // Show error in AI review
            if (aiReviewContent) {
                aiReviewContent.innerHTML = '<div class="section-header">AI review unavailable due to an error</div>';
            }
        });
    }
    
    // Function to format terminal output
    function formatTerminalOutput(output) {
        if (!output) return '<div class="error">No output generated</div>';
        
        // Split the output into lines
        const lines = output.split('\n');
        let formattedOutput = '<div class="section-header">Execution Result:</div><div class="section-content">';
        
        // Check if output contains error
        if (output.includes('Error') || output.includes('error') || output.includes('Exception') || output.includes('exception')) {
            formattedOutput = '<div class="section-header error">Execution Error:</div><div class="section-content error">';
        }
        
        // Add all lines to the output
        for (const line of lines) {
            if (line.trim() !== '') {
                formattedOutput += line + '\n';
            }
        }
        
        // Close the section
        formattedOutput += '</div>';
        
        // Add execution stats if available
        if (output.includes('Execution completed')) {
            const statsLine = lines.find(line => line.includes('Execution completed'));
            if (statsLine) {
                formattedOutput += `<div class="execution-stats">${statsLine}</div>`;
            }
        }
        
        return formattedOutput;
    }
    
    // Initialize the terminal and AI review
    clearTerminalAndReview();
    
    // Practice mode specific functionality
    const practiceButtons = document.querySelectorAll('.practice-btn');
    const practiceArea = document.getElementById('practice-area');
    const backButton = document.getElementById('back-to-challenges');
    
    if (practiceButtons.length > 0 && practiceArea) {
        // Challenge descriptions for practice mode
        const challengeDescriptions = {
            string_reversal: {
                title: 'String Reversal Challenge',
                description: document.querySelector('.challenge-card[data-type="string-reversal"] .challenge-body p')?.textContent || 
                    'Write a function that takes a string as input and returns the string reversed.',
                template: codeTemplates.string_reversal
            },
            palindrome: {
                title: 'Palindrome Checker Challenge',
                description: document.querySelector('.challenge-card[data-type="palindrome"] .challenge-body p')?.textContent || 
                    'Create a function to check if a given string is a palindrome (reads the same forward and backward).',
                template: codeTemplates.palindrome
            }
        };
        
        // Handle practice button clicks
        practiceButtons.forEach(button => {
            button.addEventListener('click', function() {
                const challengeType = this.getAttribute('data-challenge');
                const challenge = challengeDescriptions[challengeType];
                
                if (challenge) {
                    // Update challenge description
                    const titleElement = document.getElementById('challenge-description')?.querySelector('h4');
                    const descriptionElement = document.getElementById('challenge-text');
                    
                    if (titleElement) titleElement.textContent = challenge.title;
                    if (descriptionElement) descriptionElement.innerHTML = challenge.description;
                    
                    // Set code template
                    if (codeEditor) {
                        codeEditor.value = challenge.template;
                        // Trigger resize
                        const event = new Event('input');
                        codeEditor.dispatchEvent(event);
                    }
                    
                    // Show practice area and hide challenges
                    document.querySelectorAll('.challenge-card').forEach(card => {
                        const col = card.closest('.col-md-6');
                        if (col) col.style.display = 'none';
                    });
                    
                    practiceArea.classList.remove('d-none');
                    
                    // Clear terminal and AI review
                    clearTerminalAndReview();
                    
                    // Make sure the editor is focused and ready for input
                    setTimeout(() => {
                        if (codeEditor) codeEditor.focus();
                    }, 100);
                }
            });
        });
        
        // Handle back button click
        if (backButton) {
            backButton.addEventListener('click', function() {
                // Hide practice area and show challenges
                practiceArea.classList.add('d-none');
                document.querySelectorAll('.challenge-card').forEach(card => {
                    const col = card.closest('.col-md-6');
                    if (col) col.style.display = 'block';
                });
            });
        }
    }
}); 