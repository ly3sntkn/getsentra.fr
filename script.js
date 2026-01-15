document.addEventListener('DOMContentLoaded', () => {

    // Sticky Navigation
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to major sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
});

// Add dynamic CSS class for animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    .fade-in-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    .fade-in-section.visible {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(styleSheet);

// Dashboard Preview Animation
const dashboardObserverOptions = {
    threshold: 0.5
};

const dashboardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startDashboardAnimation(entry.target);
        } else {
            resetDashboardAnimation(entry.target);
        }
    });
}, dashboardObserverOptions);

const dashboardMockup = document.querySelector('.dashboard-mockup');
if (dashboardMockup) {
    dashboardObserver.observe(dashboardMockup);
}

function startDashboardAnimation(element) {
    element.classList.add('active');

    // Animate Gauge
    const circle = element.querySelector('.circle');
    const scoreValue = element.querySelector('.score-value');
    const scoreStatus = element.querySelector('.score-text'); /* Updated relative to html */
    const errorTag = element.querySelector('.tag-red'); /* Updated relative to html */

    // Reset state
    if (circle) circle.style.strokeDasharray = "0, 100";
    if (scoreValue) scoreValue.textContent = "0";
    if (scoreStatus) scoreStatus.textContent = "ANALYSE...";
    if (errorTag) errorTag.textContent = "--";

    // Sequence
    setTimeout(() => {
        // 1. Fill Gauge to 70%
        if (circle) circle.style.strokeDasharray = "70, 100";
        if (scoreValue) animateValue(scoreValue, 0, 70, 1500);

        // 2. Update Status
        setTimeout(() => {
            if (scoreStatus) {
                scoreStatus.textContent = "MOYEN";
                scoreStatus.style.color = "#64748b";
            }
            if (errorTag) errorTag.textContent = "52 ERREURS >";
        }, 1500);

        // 3. Highlight Errors
        const highlights = element.querySelectorAll('.highlight-word');
        highlights.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add('error-revealed');
                // Auto show tooltip briefly
                setTimeout(() => word.classList.add('active'), 500);
                setTimeout(() => word.classList.remove('active'), 2500);
            }, 1000 + (index * 800));
        });

    }, 500);
}

function resetDashboardAnimation(element) {
    element.classList.remove('active');
    const circle = element.querySelector('.circle');
    const highlights = element.querySelectorAll('.highlight-word');

    if (circle) circle.style.strokeDasharray = "0, 100";
    highlights.forEach(h => {
        h.classList.remove('error-revealed', 'active');
    });
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
