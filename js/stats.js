document.addEventListener('DOMContentLoaded', async () => {
    const GITHUB_USER = 'WesleyS08';
    const CODETIME_UID = '25789';
    const CACHE_KEY = 'wesley_stats_cache';
    const CACHE_TIME = 1000 * 60 * 60;
    const FALLBACK = { repos: 44, commits: 7, hours: 691 };

    const getCache = () => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, time } = JSON.parse(cached);
            const age = Date.now() - time;
            if (age < CACHE_TIME) {
                if (data.repos === 0 && data.commits === 0 && data.hours === 0) {
                    localStorage.removeItem(CACHE_KEY);
                    return null;
                }
                return data;
            } else {
                localStorage.removeItem(CACHE_KEY);
            }
        }
        return null;
    };

    const setCache = (data) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data, time: Date.now() }));
    };

    const animateCounter = (id, target, suffix = '') => {
        const counter = document.querySelector(`#${id} .counter`);
        if (!counter) return;
        let count = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
                counter.textContent = target + suffix;
                clearInterval(timer);
            } else {
                const display = Math.floor(count);
                counter.textContent = display + (display >= 1 ? suffix : '');
            }
        }, 25);
    };

    let stats = { repos: 0, commits: 0, hours: 0 };
    const cached = getCache();
    let useCache = true;

    if (cached) {
        stats = cached;
    } else {
        useCache = false;
        try {
            const userRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
            if (userRes.ok) {
                const user = await userRes.json();
                stats.repos = user.public_repos || 0;
            } else {
                stats.repos = FALLBACK.repos;
            }

            const eventsRes = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=100`);
            if (eventsRes.ok) {
                const events = await eventsRes.json();
                const pushEvents = events.filter(e => e.type === 'PushEvent');
                stats.commits = pushEvents.reduce((sum, e) => sum + (e.payload.commits?.length || 0), 0);
            } else {
                stats.commits = FALLBACK.commits;
            }

            try {
                const ctRes = await fetch(`https://api.codetime.dev/v3/users/shield?uid=${CODETIME_UID}`);
                const ctJson = await ctRes.json();
                const message = ctJson.message || '';
                const hoursMatch = message.match(/(\d+)hrs?/i);
                stats.hours = hoursMatch ? parseInt(hoursMatch[1]) : FALLBACK.hours;
            } catch {
                stats.hours = FALLBACK.hours;
            }

            setCache(stats);
        } catch {
            stats = FALLBACK;
        }
    }

    setTimeout(() => {
        animateCounter('repo-core', stats.repos);
        animateCounter('commit-matrix', stats.commits);
        animateCounter('coding-hours', stats.hours, 'h');
    }, 600);

    const energy = document.getElementById('energy-value');
    if (energy) {
        energy.textContent = '99.9%';
        setInterval(() => {
            const values = ['99.9', '100', '98.7', '99.5', '100.1', '97.8'];
            energy.textContent = values[Math.floor(Math.random() * values.length)] + '%';
        }, 2200);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.stat-card').forEach(card => observer.observe(card));

    // === AÇÃO QUANDO FICA PARADO OLHANDO ===
    let idleTimer;
    const IDLE_THRESHOLD = 10000; // 10 segundos

    const resetIdle = () => {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            const messages = [
                "O sistema detectou inatividade. Quer um café virtual?",
                "Matrix está estável. Mas você, tá bem?",
                "WesleyOS v8.0.8 rodando liso. E você, vai codar hoje?",
                "Se piscar, perde. (mas não pisca, né?)"
            ];
            const msg = messages[Math.floor(Math.random() * messages.length)];
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed; bottom: 20px; right: 20px; background: #000; color: #0f0; 
                border: 1px solid #0f0; padding: 12px 20px; font-family: monospace; 
                font-size: 14px; z-index: 9999; border-radius: 8px; box-shadow: 0 0 15px #0f0;
                animation: glitch 1.5s infinite;
            `;
            notification.textContent = msg;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 5000);
        }, IDLE_THRESHOLD);
    };

    ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetIdle, { passive: true });
    });
    resetIdle();

    // Botão limpar cache
    const clearBtn = document.getElementById('clear-cache');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            localStorage.removeItem(CACHE_KEY);
            location.reload();
        });
    }
});
