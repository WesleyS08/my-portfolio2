document.addEventListener('DOMContentLoaded', () => {
    const blocks = document.querySelectorAll('#resume .timeline-block');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, i * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    blocks.forEach(block => observer.observe(block));
});