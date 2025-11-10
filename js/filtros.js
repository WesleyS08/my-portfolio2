const mobileFilter = document.getElementById('mobile-filter');
if (mobileFilter) {
    mobileFilter.addEventListener('change', () => {
        const filter = mobileFilter.value;
        document.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
        document.querySelector(`.chip-btn[data-filter="${filter}"]`)?.classList.add('active');

        grid.querySelectorAll('.project-card').forEach(card => {
            const cats = card.dataset.category.split(' ');
            if (filter === 'all' || cats.includes(filter)) {
                card.style.display = 'block';
                setTimeout(() => card.classList.add('visible'), 50);
            } else {
                card.classList.remove('visible');
                card.classList.remove('flipped');
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    });
}