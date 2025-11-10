document.addEventListener('DOMContentLoaded', async () => {
    const GITHUB_USER = 'WesleyS08';
    const CODETIME_UID = '25789';
    const CACHE_KEY = 'wesley_stats_cache';
    const CACHE_TIME = 1000 * 60 * 60; // 1 hora

    // === FALLBACK FIXO (caso tudo falhe) ===
    const FALLBACK = { repos: 47, commits: 1337, hours: 5840 };

    // === FUNÇÃO PARA BUSCAR COM CACHE ===
    const getCachedData = async () => {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TIME) {
                return data;
            }
        }
        return null;
    };

    const setCache = (data) => {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    };

    // === ANIMAÇÃO DO CONTADOR ===
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
                counter.textContent = display + (display > 10 && suffix ? suffix : '');
            }
        }, 25);
    };

    // === BUSCAR DADOS ===
    let stats = { repos: 0, commits: 0, hours: 0 };

    try {
        const cached = await getCachedData();
        if (cached) {
            stats = cached;
        } else {
            // === 1. REPOSITÓRIOS (GitHub) ===
            const userRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`);
            if (!userRes.ok) throw new Error('GitHub rate limit');
            const user = await userRes.json();
            stats.repos = user.public_repos || 0;

            // === 2. COMMITS (por repositório, sem fork) ===
            let totalCommits = 0;
            const reposRes = await fetch(`${user.repos_url}?per_page=100`);
            const repos = await reposRes.json();

            for (const repo of repos) {
                if (repo.fork) continue;
                const commitsRes = await fetch(`${repo.url}/commits?author=${GITHUB_USER}&per_page=1`);
                const link = commitsRes.headers.get('Link');
                if (link && link.includes('rel="last"')) {
                    const match = link.match(/&page=(\d+)/);
                    if (match) totalCommits += parseInt(match[1]);
                }
            }
            stats.commits = totalCommits;

            // === 3. HORAS CODANDO (CodeTime) ===
            const codetimeRes = await fetch(`https://api.codetime.dev/v3/users/shield?uid=${CODETIME_UID}`);
            const codetimeText = await codetimeRes.text();
            stats.hours = parseInt(codetimeText.trim()) || 0;

            // === SALVAR NO CACHE ===
            setCache(stats);
        }
    } catch (error) {
        console.warn('API falhou, usando fallback:', error);
        stats = FALLBACK;
    }

    // === APLICAR VALORES COM ANIMAÇÃO ===
    setTimeout(() => {
        animateCounter('repo-core', stats.repos);
        animateCounter('commit-matrix', stats.commits);
        animateCounter('coding-hours', stats.hours, 'h');
    }, 600);

    // === ENERGIA ALEATÓRIA ===
    const energy = document.getElementById('energy-value');
    if (energy) {
        energy.textContent = '99.9%';
        setInterval(() => {
            const values = ['99.9', '100', '98.7', '99.5', '100.1', '97.8'];
            energy.textContent = values[Math.floor(Math.random() * values.length)] + '%';
        }, 2200);
    }

    // === ANIMAÇÃO AO ROLAR ===
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => observer.observe(card));
});
