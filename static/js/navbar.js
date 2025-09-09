document.addEventListener('DOMContentLoaded', () => {
    const equalizeNavButtonWidths = () => {
        const navLinks = document.querySelectorAll('header nav ul li a');
        let maxWidth = 0;

        // Reset widths to auto to calculate natural width
        navLinks.forEach(link => {
            link.style.width = 'auto';
        });

        // Find the maximum width
        navLinks.forEach(link => {
            if (link.offsetWidth > maxWidth) {
                maxWidth = link.offsetWidth;
            }
        });

        // Set all links to the max width, if maxWidth is greater than 0
        if (maxWidth > 0) {
            navLinks.forEach(link => {
                link.style.width = `${maxWidth}px`;
                link.style.textAlign = 'center'; // Ensure text is centered
            });
        }
    };

    equalizeNavButtonWidths();
    window.addEventListener('resize', equalizeNavButtonWidths);
});