// main.js
// Shared interactions for the Melayu Riau Digital Archive

function smoothScrollTo(selector) {
    if (selector === 'body') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    const el = document.querySelector(selector);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle fade-in sections
document.addEventListener("DOMContentLoaded", function() {
    const fadeSections = document.querySelectorAll('.fade-in-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeSections.forEach(section => {
        observer.observe(section);
    });

    // Navbar blur effect on scroll
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-blur');
                navbar.classList.add('bg-[#1A1009]/80');
                navbar.classList.remove('py-8');
                navbar.classList.add('py-4');
            } else {
                navbar.classList.remove('nav-blur');
                navbar.classList.remove('bg-[#1A1009]/80');
                navbar.classList.add('py-8');
                navbar.classList.remove('py-4');
            }
        });
    }
});
