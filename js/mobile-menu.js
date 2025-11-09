document.addEventListener("DOMContentLoaded", () => {
    const mobileBtn = document.getElementById('mobileBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
        mobileBtn.setAttribute('aria-expanded', !expanded);
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileBtn.setAttribute('aria-expanded', 'false');
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            mobileMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
            mobileBtn.setAttribute('aria-expanded', 'false');
        }
    });
});