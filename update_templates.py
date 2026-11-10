import os
import re

def add_gradient_theme_to_templates():
    """
    Add the gradient-theme.css file to all HTML templates in the templates directory.
    """
    templates_dir = 'templates'
    
    # Get all HTML files in the templates directory
    html_files = [f for f in os.listdir(templates_dir) if f.endswith('.html')]
    
    # Pattern to match the head section where we want to add our CSS file
    pattern = r'(<link[^>]*coding-test\.css[^>]*>|<link[^>]*aptitude-test\.css[^>]*>|<link[^>]*light-theme\.css[^>]*>)'
    
    # CSS link to add
    gradient_css_link = '<link rel="stylesheet" href="{{ url_for(\'static\', filename=\'gradient-theme.css\') }}">'
    
    for html_file in html_files:
        file_path = os.path.join(templates_dir, html_file)
        
        # Read the file content
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Check if gradient-theme.css is already included
        if 'gradient-theme.css' in content:
            print(f"Skipping {html_file} - gradient-theme.css already included")
            continue
        
        # Add the gradient-theme.css link after an existing CSS link
        modified_content = re.sub(pattern, r'\1\n    ' + gradient_css_link, content, count=1)
        
        # If no match was found, try to add it after the last link tag in the head section
        if modified_content == content:
            head_end_pattern = r'(</head>)'
            modified_content = re.sub(head_end_pattern, r'    ' + gradient_css_link + r'\n\1', content, count=1)
        
        # Write the modified content back to the file
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        
        print(f"Updated {html_file}")

if __name__ == "__main__":
    add_gradient_theme_to_templates()
    print("All templates have been updated with gradient-theme.css") 