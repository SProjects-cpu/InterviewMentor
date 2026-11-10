// Simple repeater functionality without jQuery
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners to all repeater add buttons
    document.querySelectorAll('[data-repeater-create]').forEach(function(button) {
        button.addEventListener('click', function() {
            const repeaterList = this.previousElementSibling;
            const repeaterItem = repeaterList.querySelector('[data-repeater-item]');
            if (repeaterItem) {
                const clone = repeaterItem.cloneNode(true);
                // Clear input values in the clone
                clone.querySelectorAll('input').forEach(input => {
                    input.value = '';
                });
                // Add event listener to remove button
                const removeBtn = clone.querySelector('[data-repeater-delete]');
                if (removeBtn) {
                    removeBtn.addEventListener('click', function() {
                        this.closest('[data-repeater-item]').remove();
                        setTimeout(() => {
                            generateCV();
                        }, 500);
                    });
                }
                repeaterList.appendChild(clone);
            }
        });
    });

    // Add event listeners to existing remove buttons
    document.querySelectorAll('[data-repeater-delete]').forEach(function(button) {
        button.addEventListener('click', function() {
            // Don't remove if it's the only item
            const repeaterList = this.closest('[data-repeater-list]');
            const items = repeaterList.querySelectorAll('[data-repeater-item]');
            if (items.length > 1) {
                this.closest('[data-repeater-item]').remove();
                setTimeout(() => {
                    generateCV();
                }, 500);
            }
        });
    });
});

// Function to print CV
function printCV() {
    window.print();
}