// Navigation Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const body = document.body;

    if (navToggle && navLinks) {
        // Toggle mobile menu
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            body.classList.toggle('nav-open');
        });

        // Close menu when clicking on a nav link
        const navLinksItems = document.querySelectorAll('.nav-link');
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('nav-open');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navbar.contains(event.target);
            if (!isClickInsideNav && navLinks.classList.contains('active')) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('nav-open');
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth > 1024) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
                body.classList.remove('nav-open');
            }
        });

        // Prevent body scroll when mobile menu is open
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    if (body.classList.contains('nav-open')) {
                        body.style.overflow = 'hidden';
                    } else {
                        body.style.overflow = '';
                    }
                }
            });
        });

        observer.observe(body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});
