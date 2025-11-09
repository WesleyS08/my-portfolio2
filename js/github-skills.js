// src/js/github-skills.js
const GITHUB_USERNAME = 'WesleyS08';
const CACHE_KEY = 'github-skills-cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

// Cores oficiais das linguagens (GitHub style)
const languageColors = {
    JavaScript: '#f1e05a', TypeScript: '#2b7489', Python: '#3572A5',
    HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219', PHP: '#4F5D95',
    Ruby: '#701516', Go: '#00ADD8', Rust: '#dea584', C: '#555555',
    'C++': '#f34b7d', 'C#': '#178600', Shell: '#89e051', Dockerfile: '#384d54',
    React: '#61dafb', Node: '#68a063', Vue: '#41b883', Angular: '#dd1b16'
};

async function fetchGitHubLanguages() {
    // 1. Tentar carregar do cache
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        const { data, time } = JSON.parse(cached);
        if (Date.now() - time < CACHE_DURATION) {
            renderSkills(data);
            return;
        }
    }

    try {
        // 2. Fetch com User-Agent (obrigatório!)
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, {
            headers: {
                'User-Agent': 'WesleyS08-Portfolio',
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) throw new Error(`GitHub API: ${response.status}`);

        const repos = await response.json();
        const langMap = {};

        // 3. Contar linguagens por repositório (mais confiável que bytes)
        for (const repo of repos) {
            if (repo.fork || !repo.language) continue;
            const lang = repo.language;
            langMap[lang] = (langMap[lang] || 0) + 1;
        }

        // 4. Calcular % e ordenar
        const totalRepos = Object.values(langMap).reduce((a, b) => a + b, 0) || 1;
        const skills = Object.entries(langMap)
            .map(([name, count]) => ({
                name,
                percentage: Math.round((count / totalRepos) * 100),
                color: languageColors[name] || '#666'
            }))
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 6); // Top 6

        // 5. Salvar no cache
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: skills, time: Date.now() }));
        renderSkills(skills);

    } catch (err) {
        console.warn('GitHub API falhou:', err);
        showFallbackSkills();
    }
}

// FUNÇÃO DE RENDERIZAÇÃO (com anel de progresso)
function renderSkills(skills) {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    // Limpa skeleton
    grid.innerHTML = '';

    skills.forEach((skill, i) => {
        const initials = skill.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        const glow = skill.color.replace('#', '') + '40'; // 25% opacity para glow

        const item = document.createElement('div');
        item.className = 'skill-item';
        item.innerHTML = `
            <div class="skill-icon" style="
                --skill-color: ${skill.color};
                --skill-color-glow: #${glow};
                --progress: ${skill.percentage};
                background: ${skill.color};
            ">
                <span class="initials">${initials}</span>
            </div>
            <span class="skill-label">${skill.name}</span>
            <div class="skill-percentage">${skill.percentage}%</div>
        `;

        // Animação de entrada
        setTimeout(() => {
            item.classList.add('visible');
        }, i * 150);

        grid.appendChild(item);
    });
}

// Fallback caso tudo falhe
function showFallbackSkills() {
    const fallback = [
        { name: 'JavaScript', percentage: 90, color: '#f1e05a' },
        { name: 'React', percentage: 85, color: '#61dafb' },
        { name: 'Node.js', percentage: 80, color: '#68a063' },
        { name: 'Python', percentage: 75, color: '#3572A5' },
        { name: 'HTML/CSS', percentage: 85, color: '#e34c26' },
        { name: 'SQL', percentage: 70, color: '#336791' }
    ];
    renderSkills(fallback);
}

// Iniciar quando carregar
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('skills-grid');
    if (grid) {
        // Mostra skeleton enquanto carrega
        for (let i = 0; i < 6; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton';
            grid.appendChild(skeleton);
        }
        fetchGitHubLanguages();
    }
});