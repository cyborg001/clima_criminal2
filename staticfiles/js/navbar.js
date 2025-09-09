const navLinks = document.querySelectorAll('nav ul li a');
let maxWidth = 0;

// Find the maximum width
navLinks.forEach(link => {
    if (link.offsetWidth > maxWidth) {
        maxWidth = link.offsetWidth;
    }
});

// Set all links to that maximum width
navLinks.forEach(link => {
    link.style.width = `${maxWidth}px`;
});
