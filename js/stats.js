document.addEventListener('DOMContentLoaded', async () => {
    const githubUser = 'WesleyS08';
    const codetimeUID = '25789'; 

    try {
        const userRes = await fetch(`https://api.github.com/users/${githubUser}`);
        const userData = await userRes.json();
        const repos = userData.public_repos || 0;
        document.getElementById('repos-module').dataset.target = repos;
        document.querySelector('#repos-module .counter').textContent = repos;

        let totalCommits = 0;
        const reposRes = await fetch(`https://api.github.com/users/${githubUser}/repos?per_page=100`);
        const reposData = await reposRes.json();
        for (const repo of reposData) {
            if (repo.fork) continue;
            const commitsRes = await fetch(`https://api.github.com/repos/${githubUser}/${repo.name}/commits?author=${githubUser}&per_page=1`);
            const link = commitsRes.headers.get('Link');
            if (link && link.includes('rel="last"')) {
                const lastPage = link.match(/&page=(\d+)/)[1];
                totalCommits += parseInt(lastPage);
            }
        }
        document.getElementById('commits-module').dataset.target = totalCommits;
        document.querySelector('#commits-module .counter').textContent = totalCommits;

        // 2. HORAS PROGRAMANDO (CodeTime API REAL)
        const codetimeRes = await fetch(`https://api.codetime.dev/v3/users/shield?uid=${codetimeUID}`);
        const codetimeText = await codetimeRes.text(); // Retorna "691" ou o número puro
        const codingHours = parseInt(codetimeText.trim()) || 0;

        const codingModule = document.getElementById('coding-hours-module');
        codingModule.dataset.target = codingHours;
        codingModule.querySelector('.counter').textContent = codingHours;

        // 3. LINHAS DE CÓDIGO (se quiser via WakaTime, me avisa que adiciono)

    } catch (err) {
        console.log('Erro ao carregar stats:', err);
    }

    // ANIMAÇÃO DOS CONTADORES + CÍRCULOS
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const module = entry.target.closest('.core-module');
                if (!module || module.classList.contains('visible')) return;

                const target = parseInt(module.dataset.target) || 0;
                const counter = module.querySelector('.counter');
                const ring = module.querySelector('.progress');
                const isCoding = module.id === 'coding-hours-module';

                let count = 0;
                const increment = target / 80;

                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        counter.textContent = target;
                        if (isCoding) counter.textContent += 'h';
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(count);
                        if (isCoding && count > 10) counter.textContent += 'h';
                    }
                }, 20);

                if (ring && target > 0) {
                    const circumference = 339.292;
                    const max = isCoding ? 10000 : 2000; // Ajuste pro círculo não encher rápido
                    const percent = Math.min(target / max, 1);
                    const offset = circumference - (circumference * percent);
                    ring.style.strokeDashoffset = offset;
                }

                module.classList.add('visible');
            }
        });
    }, { threshold: 0.6 });

    document.querySelectorAll('.core-module').forEach(m => observer.observe(m));

    // ENERGIA ALEATÓRIA
    setInterval(() => {
        const values = ['99.9', '100', '98.7', '99', '101', '99.8', '97'];
        const el = document.getElementById('random-value');
        el.innerHTML = values[Math.floor(Math.random() * values.length)] + '%';
    }, 1800);
});